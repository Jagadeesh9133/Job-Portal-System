const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const { verifyToken, requireRole } = require('../middleware/auth');
const { calculateMatchScore } = require('../utils/matcher');

// GET /api/matching/feed (Get personalized jobs sorted by Resume Match Score)
router.get('/feed', verifyToken, requireRole('job_seeker'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Job Seeker profile not found' });
    }

    const { minScore = 0, category, jobType, location, search } = req.query;

    const query = { status: 'active' };
    if (category) query.category = category;
    if (jobType) query.jobType = jobType;
    if (location && location !== 'All') query.location = new RegExp(location, 'i');
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { companyName: searchRegex },
        { requiredSkills: searchRegex },
        { description: searchRegex },
      ];
    }

    const allJobs = await Job.find(query);

    // Calculate match score for each job against user's skills & resume
    const matchedJobs = allJobs.map((job) => {
      const matchResult = calculateMatchScore(user.skills, user.resumeText, job);
      return {
        job,
        matchScore: matchResult.score,
        matchingSkills: matchResult.matchingSkills,
        missingSkills: matchResult.missingSkills,
      };
    });

    // Filter by minimum score if specified
    const filteredJobs = matchedJobs.filter((item) => item.matchScore >= Number(minScore));

    // Sort by Match Score descending
    filteredJobs.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      candidateSkills: user.skills,
      hasResume: !!(user.resumeText || (user.skills && user.skills.length > 0)),
      totalMatched: filteredJobs.length,
      jobs: filteredJobs,
    });
  } catch (error) {
    console.error('Job Matching Error:', error);
    res.status(500).json({ message: 'Failed to compute job match scores' });
  }
});

// POST /api/matching/evaluate (Evaluate custom text/skills against a specific job)
router.post('/evaluate/:jobId', verifyToken, async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const { skills, resumeText } = req.body;
    const matchResult = calculateMatchScore(skills || [], resumeText || '', job);

    res.json({
      jobId: job._id,
      jobTitle: job.title,
      ...matchResult,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error evaluating job match' });
  }
});

module.exports = router;
