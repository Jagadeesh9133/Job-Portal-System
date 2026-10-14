const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const User = require("../models/User");
const { verifyToken, requireRole } = require("../middleware/auth");
const { calculateMatchScore } = require("../utils/matcher");

// POST /api/applications/apply (Job Seeker applies for a job)
router.post(
  "/apply",
  verifyToken,
  requireRole("job_seeker"),
  async (req, res) => {
    try {
      const { jobId, coverLetter } = req.body;
      if (!jobId) {
        return res.status(400).json({ message: "Job ID is required" });
      }

      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User profile not found" });
      }

      // Check if already applied
      const existingApp = await Application.findOne({
        job: jobId,
        jobSeeker: req.user.id,
      });

      if (existingApp) {
        return res
          .status(400)
          .json({ message: "You have already applied for this position" });
      }

      // Compute match score at time of application
      const matchResult = calculateMatchScore(
        user.skills,
        user.resumeText,
        job,
      );

      const application = new Application({
        job: jobId,
        jobSeeker: req.user.id,
        organization: job.organization,
        resumeText: user.resumeText || "",
        applicantSkills: user.skills || [],
        matchScore: matchResult.score,
        matchingSkills: matchResult.matchingSkills,
        missingSkills: matchResult.missingSkills,
        coverLetter: coverLetter || "",
        status: "Applied",
      });

      await application.save();

      // Increment applicant count on job
      job.applicantCount = (job.applicantCount || 0) + 1;
      await job.save();

      res.status(201).json({
        message: "Application submitted successfully!",
        application,
      });
    } catch (error) {
      console.error("Apply Error:", error);
      res.status(500).json({ message: "Failed to submit application" });
    }
  },
);

// GET /api/applications/my-applications (Job Seeker views submitted applications)
router.get(
  "/my-applications",
  verifyToken,
  requireRole("job_seeker"),
  async (req, res) => {
    try {
      const apps = await Application.find({ jobSeeker: req.user.id })
        .populate("job")
        .populate("organization", "companyName companyLogo companyWebsite")
        .sort({ createdAt: -1 });

      res.json(apps);
    } catch (error) {
      console.error("Fetch My Applications Error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  },
);

// GET /api/applications/org-applicants (Organization views all incoming applications across jobs)
router.get(
  "/org-applicants",
  verifyToken,
  requireRole("organization"),
  async (req, res) => {
    try {
      const apps = await Application.find({ organization: req.user.id })
        .populate("job", "title location jobType salaryRange category")
        .populate(
          "jobSeeker",
          "name email title bio skills resumeText resumeFileName",
        )
        .sort({ matchScore: -1, createdAt: -1 });

      res.json(apps);
    } catch (error) {
      console.error("Fetch Org Applicants Error:", error);
      res.status(500).json({ message: "Failed to fetch applicants" });
    }
  },
);

// GET /api/applications/job/:jobId (Organization views applicants for specific job)
router.get(
  "/job/:jobId",
  verifyToken,
  requireRole("organization"),
  async (req, res) => {
    try {
      const apps = await Application.find({
        job: req.params.jobId,
        organization: req.user.id,
      })
        .populate(
          "jobSeeker",
          "name email title bio skills resumeText resumeFileName",
        )
        .sort({ matchScore: -1 });

      res.json(apps);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job applicants" });
    }
  },
);

// PUT /api/applications/:id/status (Organization updates application status)
router.put(
  "/:id/status",
  verifyToken,
  requireRole("organization"),
  async (req, res) => {
    try {
      const { status, interviewDateTime } = req.body;
      const validStatuses = [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Hired",
      ];

      if (!validStatuses.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid application status value" });
      }

      const app = await Application.findById(req.params.id);
      if (!app) {
        return res.status(404).json({ message: "Application not found" });
      }

      if (app.organization.toString() !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Not authorized to manage this application" });
      }

      app.status = status;

      if (status === "Interview Scheduled") {
        if (!interviewDateTime) {
          return res
            .status(400)
            .json({
              message:
                "Interview date and time are required when scheduling an interview",
            });
        }
        const parsed = new Date(interviewDateTime);
        if (Number.isNaN(parsed.getTime())) {
          return res
            .status(400)
            .json({ message: "Invalid interview date and time" });
        }
        app.interviewDateTime = parsed;
      } else if (interviewDateTime) {
        const parsed = new Date(interviewDateTime);
        if (!Number.isNaN(parsed.getTime())) {
          app.interviewDateTime = parsed;
        }
      }

      await app.save();

      res.json({
        message: `Application status updated to ${status}`,
        application: app,
      });
    } catch (error) {
      console.error("Update Application Status Error:", error);
      res.status(500).json({ message: "Failed to update application status" });
    }
  },
);

module.exports = router;
