const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const { calculateMatchScore } = require('../utils/matcher');

// GET /api/jobs (List jobs with optional search, category, location, jobType filters)
router.get('/', async (req, res) => {
  try {
    const { search, category, location, jobType, experienceLevel } = req.query;

    const query = { status: 'active' };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { requiredSkills: searchRegex },
        { description: searchRegex },
      ];
    }

    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (location && location !== 'All') {
      query.location = new RegExp(location, 'i');
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Fetch Jobs Error:', error);
    res.status(500).json({ message: 'Failed to fetch job listings' });
  }
});

// GET /api/jobs/organization/my-jobs (Fetch jobs posted by current organization)
router.get('/organization/my-jobs', verifyToken, requireRole('organization'), async (req, res) => {
  try {
    const jobs = await Job.find({ organization: req.user.id }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error('Fetch Org Jobs Error:', error);
    res.status(500).json({ message: 'Failed to fetch organization job listings' });
  }
});

// GET /api/jobs/:id (Get single job details)
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job listing not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch job details' });
  }
});

// POST /api/jobs (Create job - Organization only)
router.post('/', verifyToken, requireRole('organization'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Organization user profile not found' });
    }

    const {
      title,
      location,
      jobType,
      category,
      experienceLevel,
      salaryRange,
      description,
      requirements,
      requiredSkills,
      benefits,
    } = req.body;

    if (!title || !description || !requiredSkills || requiredSkills.length === 0) {
      return res.status(400).json({ message: 'Title, description, and required skills are required' });
    }

    // Process skills if comma-separated string passed
    let skillsArr = requiredSkills;
    if (typeof requiredSkills === 'string') {
      skillsArr = requiredSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    let reqsArr = requirements || [];
    if (typeof requirements === 'string') {
      reqsArr = requirements.split('\n').map(s => s.trim()).filter(Boolean);
    }

    const job = new Job({
      title,
      organization: req.user.id,
      companyName: user.companyName || user.name,
      companyLogo: user.companyLogo || '',
      location: location || 'Remote',
      jobType: jobType || 'Full-time',
      category: category || 'Engineering',
      experienceLevel: experienceLevel || 'Mid Level',
      salaryRange: salaryRange || '$80,000 - $120,000 / yr',
      description,
      requirements: reqsArr,
      requiredSkills: skillsArr,
      benefits: benefits || ['Health insurance', 'Flexible hours', 'Paid time off'],
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Create Job Error:', error);
    res.status(500).json({ message: 'Failed to post new job' });
  }
});

// PUT /api/jobs/:id (Update job - Organization only)
router.put('/:id', verifyToken, requireRole('organization'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.organization.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this job posting' });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update job posting' });
  }
});

// DELETE /api/jobs/:id (Delete job - Organization only)
router.delete('/:id', verifyToken, requireRole('organization'), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    if (job.organization.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this job posting' });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job posting deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete job posting' });
  }
});

module.exports = router;
