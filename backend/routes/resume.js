const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');
const { extractSkillsFromText, SKILL_DICTIONARY } = require('../utils/matcher');

// Configure multer memory storage
const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

// Helper for parsing PDF buffer supporting pdf-parse v1 and v2
async function parsePdfBuffer(buffer) {
  try {
    const pdfParseModule = require('pdf-parse');
    if (typeof pdfParseModule === 'function') {
      const data = await pdfParseModule(buffer);
      return data.text || '';
    } else if (pdfParseModule.PDFParse) {
      const parser = new pdfParseModule.PDFParse({ data: buffer });
      const textResult = await parser.getText();
      if (parser.destroy) await parser.destroy();
      return textResult.text || '';
    } else if (pdfParseModule.default && typeof pdfParseModule.default === 'function') {
      const data = await pdfParseModule.default(buffer);
      return data.text || '';
    } else if (pdfParseModule.default && pdfParseModule.default.PDFParse) {
      const parser = new pdfParseModule.default.PDFParse({ data: buffer });
      const textResult = await parser.getText();
      if (parser.destroy) await parser.destroy();
      return textResult.text || '';
    } else {
      // Fallback text extraction from raw buffer
      return buffer.toString('utf-8');
    }
  } catch (err) {
    console.error('PDF parsing error inside parsePdfBuffer:', err);
    // Fallback: extract plain text strings from buffer
    const rawText = buffer.toString('utf-8');
    const printableOnly = rawText.replace(/[^\x20-\x7E\n\r\t]/g, ' ');
    return printableOnly;
  }
}

// GET /api/resume/skills-dictionary (Return list of supported system skills)
router.get('/skills-dictionary', (req, res) => {
  res.json(SKILL_DICTIONARY);
});

// POST /api/resume/parse-text (Parse skills directly from text snippet)
router.post('/parse-text', verifyToken, async (req, res) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ message: 'Resume text is required' });
    }

    const extractedSkills = extractSkillsFromText(resumeText);
    
    // Save to user profile
    const user = await User.findById(req.user.id);
    if (user) {
      user.resumeText = resumeText;
      const combined = Array.from(new Set([...(user.skills || []), ...extractedSkills]));
      user.skills = combined;
      await user.save();
    }

    res.json({
      resumeText,
      extractedSkills,
      totalSkillsFound: extractedSkills.length,
      userSkills: user ? user.skills : extractedSkills,
    });
  } catch (error) {
    console.error('Parse Resume Text Error:', error);
    res.status(500).json({ message: 'Failed to process resume text' });
  }
});

// POST /api/resume/upload (Upload resume PDF or TXT file)
router.post('/upload', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    let extractedText = '';

    if (
      req.file.mimetype === 'application/pdf' ||
      req.file.originalname.toLowerCase().endsWith('.pdf')
    ) {
      extractedText = await parsePdfBuffer(req.file.buffer);
    } else {
      extractedText = req.file.buffer.toString('utf-8');
    }

    // Clean non-printable control characters
    extractedText = extractedText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ');

    const extractedSkills = extractSkillsFromText(extractedText);

    // Save to user
    const user = await User.findById(req.user.id);
    if (user) {
      user.resumeText = extractedText;
      user.resumeFileName = req.file.originalname;
      const combined = Array.from(new Set([...(user.skills || []), ...extractedSkills]));
      user.skills = combined;
      await user.save();
    }

    res.json({
      fileName: req.file.originalname,
      extractedText,
      extractedSkills,
      totalSkillsFound: extractedSkills.length,
      userSkills: user ? user.skills : extractedSkills,
    });
  } catch (error) {
    console.error('Upload Resume Error:', error);
    res.status(500).json({ message: error.message || 'Error parsing resume file' });
  }
});

module.exports = router;
