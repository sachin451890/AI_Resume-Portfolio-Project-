import { Document, Packer, Paragraph, TextRun, HeadingLevel, BorderStyle } from 'docx';

export async function exportResumeToDocx(resumeData) {
  const info = (resumeData && resumeData.personalInfo) || {};
  const summary = (resumeData && resumeData.summary) || '';
  const experiences = (resumeData && resumeData.experiences) || [];
  const educations = (resumeData && resumeData.educations) || [];
  const skills = (resumeData && resumeData.skills) || [];
  const projects = (resumeData && resumeData.projects) || [];
  const certifications = (resumeData && resumeData.certifications) || [];
  const customSections = (resumeData && resumeData.customSections) || [];

  const firstName = (info.fullName || 'User').trim().split(' ')[0] || 'Candidate';
  const lastName = (info.fullName || 'Resume').trim().split(' ').slice(1).join('_') || 'Document';
  const filename = `${firstName}_${lastName}_Resume.docx`;

  const children = [];

  // Helper for Section Headings
  const createSectionHeading = (title) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: { color: '1E40AF', space: 4, value: BorderStyle.SINGLE, size: 12 }
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 24, // 12pt
          color: '1E40AF',
          font: 'Calibri'
        })
      ]
    });
  };

  // 1. Candidate Name & Header
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: info.fullName || 'Alex Johnson',
          bold: true,
          size: 36, // 18pt
          color: '0F172A',
          font: 'Calibri'
        })
      ]
    })
  );

  if (info.professionalTitle) {
    children.push(
      new Paragraph({
        spacing: { after: 120 },
        children: [
          new TextRun({
            text: info.professionalTitle,
            bold: true,
            size: 24, // 12pt
            color: '2563EB',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // Contact Info Line
  const contactParts = [];
  if (info.location) contactParts.push(info.location);
  if (info.phone) contactParts.push(info.phone);
  if (info.email) contactParts.push(info.email);
  if (info.linkedinUrl) contactParts.push(`LinkedIn: ${info.linkedinUrl}`);
  if (info.githubUrl) contactParts.push(`GitHub: ${info.githubUrl}`);

  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactParts.join('  •  '),
            size: 19, // 9.5pt
            color: '475569',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 2. Professional Summary
  if (summary) {
    children.push(createSectionHeading('Professional Summary'));
    children.push(
      new Paragraph({
        spacing: { after: 180 },
        children: [
          new TextRun({
            text: summary,
            size: 21, // 10.5pt
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 3. Work Experience
  if (experiences.length > 0) {
    children.push(createSectionHeading('Work Experience'));
    experiences.forEach(exp => {
      // Header: Job Title & Dates
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({ text: exp.jobTitle || 'Role', bold: true, size: 22, color: '0F172A', font: 'Calibri' }),
            new TextRun({ text: ` — ${exp.company || ''}`, bold: true, size: 22, color: '1E40AF', font: 'Calibri' }),
            new TextRun({
              text: `      (${exp.startDate || ''} – ${exp.isCurrent ? 'Present' : exp.endDate || ''})`,
              size: 20,
              color: '64748B',
              font: 'Calibri'
            })
          ]
        })
      );

      // Location
      if (exp.location) {
        children.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({ text: exp.location, italics: true, size: 19, color: '64748B', font: 'Calibri' })
            ]
          })
        );
      }

      // Responsibilities
      if (exp.responsibilities) {
        const lines = exp.responsibilities.split('\n').filter(l => l.trim().length > 0);
        lines.forEach(line => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { after: 40 },
              children: [
                new TextRun({ text: line.replace(/^[•\-\*\s]+/, ''), size: 21, color: '334155', font: 'Calibri' })
              ]
            })
          );
        });
      }
    });
  }

  // 4. Key Projects
  if (projects.length > 0) {
    children.push(createSectionHeading('Key Projects'));
    projects.forEach(proj => {
      const techText = proj.technologies
        ? ` [${Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies}]`
        : '';

      children.push(
        new Paragraph({
          spacing: { before: 100, after: 40 },
          children: [
            new TextRun({ text: proj.name || 'Project', bold: true, size: 22, color: '0F172A', font: 'Calibri' }),
            new TextRun({ text: techText, italics: true, size: 19, color: '2563EB', font: 'Calibri' })
          ]
        })
      );

      if (proj.description) {
        children.push(
          new Paragraph({
            spacing: { after: 100 },
            children: [
              new TextRun({ text: proj.description, size: 21, color: '334155', font: 'Calibri' })
            ]
          })
        );
      }
    });
  }

  // 5. Education
  if (educations.length > 0) {
    children.push(createSectionHeading('Education'));
    educations.forEach(edu => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 40 },
          children: [
            new TextRun({ text: edu.degree || 'Degree', bold: true, size: 22, color: '0F172A', font: 'Calibri' }),
            new TextRun({ text: ` — ${edu.institution || ''}`, size: 21, color: '334155', font: 'Calibri' }),
            new TextRun({
              text: `      (${edu.startDate || ''} – ${edu.endDate || ''})`,
              size: 20,
              color: '64748B',
              font: 'Calibri'
            })
          ]
        })
      );
    });
  }

  // 6. Skills
  if (skills.length > 0) {
    children.push(createSectionHeading('Technical & Professional Skills'));
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: skills.map(s => s.name).join('  •  '),
            size: 21,
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 7. Certifications
  if (certifications.length > 0) {
    children.push(createSectionHeading('Certifications'));
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: certifications.map(c => `${c.name} (${c.organization})`).join('  •  '),
            size: 21,
            color: '334155',
            font: 'Calibri'
          })
        ]
      })
    );
  }

  // 8. Custom Sections
  customSections.filter(cs => cs.isEnabled).forEach(cs => {
    children.push(createSectionHeading(cs.title || 'Additional Section'));
    children.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({ text: cs.content || '', size: 21, color: '334155', font: 'Calibri' })
        ]
      })
    );
  });

  // Create Native OpenXML Word Document (.docx)
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 } // 1 inch margins (1440 twips)
          }
        },
        children
      }
    ]
  });

  // Generate Binary Blob with correct OpenXML Word MIME type
  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  return filename;
}
