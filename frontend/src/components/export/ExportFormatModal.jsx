import React, { useState } from 'react';
import { FileText, FileSpreadsheet, Download, X, CheckCircle2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { exportResumeToPDF } from '../../utils/pdfExporter';
import { exportResumeToDocx } from '../../utils/docxExporter';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

export default function ExportFormatModal({ isOpen, onClose, resumeData, previewElementId = 'wizard-resume-preview' }) {
  if (!isOpen) return null;

  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' or 'docx'
  const [isExporting, setIsExporting] = useState(false);
  const { getToken } = useAuth();
  const { addToast } = useToast();

  const handleExport = async () => {
    if (isExporting) return; // Prevent duplicate download requests
    setIsExporting(true);

    try {
      const token = await getToken();
      if (selectedFormat === 'pdf') {
        addToast('Preparing vector A4 PDF...', 'info');
        await exportResumeToPDF(previewElementId, resumeData, token);
        addToast('PDF downloaded successfully!', 'success');
      } else {
        addToast('Generating editable Word (.docx) file...', 'info');
        await exportResumeToDocx(resumeData);
        addToast('Word (.docx) downloaded successfully!', 'success');
      }
      onClose();
    } catch (err) {
      addToast(`Export failed: ${err.message}`, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isExporting}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-lg">
            <Download className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Choose Export Format</h3>
          <p className="text-xs text-slate-400">Select the file format you wish to download</p>
        </div>

        {/* Options Selection */}
        <div className="space-y-3">
          {/* PDF Option */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setSelectedFormat('pdf')}
            className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition ${
              selectedFormat === 'pdf'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">PDF Document (.pdf)</span>
                {selectedFormat === 'pdf' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">High-fidelity printable A4 layout with clickable links & vector typography.</p>
            </div>
          </button>

          {/* Word DOCX Option */}
          <button
            type="button"
            disabled={isExporting}
            onClick={() => setSelectedFormat('docx')}
            className={`w-full p-4 rounded-2xl border text-left flex items-start gap-4 transition ${
              selectedFormat === 'docx'
                ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg'
                : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">Microsoft Word (.docx)</span>
                {selectedFormat === 'docx' && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
              </div>
              <p className="text-xs text-slate-400 mt-1">Fully editable Word document format for custom offline modifications.</p>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-60"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating your resume...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              <span>Download {selectedFormat.toUpperCase()} File</span>
            </>
          )}
        </button>

        <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Both formats are 100% ATS-friendly & virus-free
        </div>
      </div>
    </div>
  );
}
