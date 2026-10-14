const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    companyLogo: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      required: true,
      default: 'Remote',
    },
    jobType: {
      type: String,
      enum: ['Full-time', 'Part-time', 'Contract', 'Remote', 'Hybrid', 'Internship'],
      default: 'Full-time',
    },
    category: {
      type: String,
      default: 'Engineering',
    },
    experienceLevel: {
      type: String,
      enum: ['Entry Level', 'Mid Level', 'Senior Level', 'Lead / Executive'],
      default: 'Mid Level',
    },
    salaryRange: {
      type: String,
      default: '$80,000 - $120,000 / yr',
    },
    description: {
      type: String,
      required: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      required: true,
      default: [],
    },
    benefits: {
      type: [String],
      default: ['Health insurance', 'Flexible hours', '401(k) matching', 'Paid time off'],
    },
    status: {
      type: String,
      enum: ['active', 'closed'],
      default: 'active',
    },
    applicantCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Job', JobSchema);
