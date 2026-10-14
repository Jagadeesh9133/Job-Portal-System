const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    jobSeeker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeText: {
      type: String,
      default: "",
    },
    applicantSkills: {
      type: [String],
      default: [],
    },
    matchScore: {
      type: Number,
      default: 0,
    },
    matchingSkills: {
      type: [String],
      default: [],
    },
    missingSkills: {
      type: [String],
      default: [],
    },
    coverLetter: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Rejected",
        "Hired",
      ],
      default: "Applied",
    },
    interviewDateTime: {
      type: Date,
      default: null,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Application", ApplicationSchema);
