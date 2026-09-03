import html2pdf from 'html2pdf.js';
import { api } from '../services/api';

export async function exportResumeToPDF(elementId, resumeData, authToken = '') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Resume element not found in DOM.');
  }

  // 1. Send authorization check request to backend endpoint
  try {
    const headers = authToken ? { 'Authorization': `Bearer ${authToken}` } : {};
    const backendRes = await fetch('http://localhost:5000/api/pdf/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: JSON.stringify({ resumeData, htmlContent: element.outerHTML })
    });

    if (backendRes.status === 401) {
      throw new Error('Authentication required to export your resume.');
    }
    if (backendRes.status === 403) {
      throw new Error('You are not authorized to export this resume.');
    }

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => ({}));
      throw new Error(errData.message || 'Export authorization failed.');
    }
  } catch (backendErr) {
    // Re-throw 401 / 403 errors directly to protect download
    if (backendErr.message.includes('Authentication required') || backendErr.message.includes('not authorized')) {
      throw backendErr;
    }
    console.warn('[pdfExporter] Backend verification note:', backendErr.message);
  }

  // 2. Generate vector printable A4 PDF
  const personalInfo = (resumeData && resumeData.personalInfo) || {};
  const firstName = (personalInfo.fullName || 'User').trim().split(' ')[0] || 'Candidate';
  const lastName = (personalInfo.fullName || 'Resume').trim().split(' ').slice(1).join('_') || 'Document';
  const filename = `${firstName}_${lastName}_Resume.pdf`;

  const opt = {
    margin: 0, // 0 margin so internal 15mm 16mm padding provides perfect printable page margins
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
      windowWidth: 794
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return filename;
  } catch (err) {
    console.warn('[pdfExporter] html2pdf error, triggering fallback print window:', err);
    window.print();
    return filename;
  }
}
