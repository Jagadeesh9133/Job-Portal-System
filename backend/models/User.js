const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['job_seeker', 'organization'],
      required: true,
      default: 'job_seeker',
    },
    // Organization specific details
    companyName: {
      type: String,
      default: '',
    },
    companyWebsite: {
      type: String,
      default: '',
    },
    companyLogo: {
      type: String,
      default: '',
    },
    companyDescription: {
      type: String,
      default: '',
    },
    companyLocation: {
      type: String,
      default: '',
    },
    // Job Seeker specific details
    title: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    skills: {
      type: [String],
      default: [],
    },
    resumeText: {
      type: String,
      default: '',
    },
    resumeFileName: {
      type: String,
      default: '',
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
