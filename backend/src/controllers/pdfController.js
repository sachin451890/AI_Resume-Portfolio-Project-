const { createClient } = require('@supabase/supabase-js');
const config = require('../config');

let supabase = null;
if (config.supabaseUrl && config.supabaseServiceRoleKey) {
  supabase = createClient(config.supabaseUrl, config.supabaseServiceRoleKey);
}

exports.generatePDF = async (req, res) => {
  try {
    const { resumeData, htmlContent } = req.body;
    const authenticatedUserId = req.user && req.user.id;

    if (!authenticatedUserId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required to export your resume.'
      });
    }

    // Ownership Verification
    if (resumeData && resumeData.userId && resumeData.userId !== authenticatedUserId && resumeData.userId !== 'guest-draft') {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to export this resume.'
      });
    }

    const personalInfo = (resumeData && resumeData.personalInfo) || {};
    const firstName = (personalInfo.fullName || 'User').trim().split(' ')[0] || 'Candidate';
    const lastName = (personalInfo.fullName || 'Resume').trim().split(' ').slice(1).join('_') || 'Document';
    const filename = `${firstName}_${lastName}_Resume.pdf`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

    return res.json({
      success: true,
      filename,
      message: 'PDF layout prepared successfully.',
      htmlContent: htmlContent || ''
    });
  } catch (err) {
    console.error('[PDF Controller Error]:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to generate PDF.' });
  }
};
