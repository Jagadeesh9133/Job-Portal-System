const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { calculateMatchScore } = require('./matcher');

async function seedDatabase() {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log(`🌱 Database already initialized (${userCount} users found). Preserving stored accounts.`);
      return;
    }

    console.log('🌱 Seeding initial database records...');

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('India@2026', salt);

    // 1. Create Organization Users
    const tcsOrg = await User.create({
      name: 'TCS Digital Solutions',
      email: 'employer@tcsdigital.in',
      password: passwordHash,
      role: 'organization',
      companyName: 'TCS Digital Solutions',
      companyWebsite: 'https://tcsdigital.in',
      companyLocation: 'Bengaluru, Karnataka (Hybrid)',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      companyDescription: 'TCS Digital Solutions is a global leader in IT services, digital transformation, and enterprise platforms.',
    });

    const infosysOrg = await User.create({
      name: 'Infosys Creative Labs',
      email: 'employer@infosyslabs.in',
      password: passwordHash,
      role: 'organization',
      companyName: 'Infosys Creative Labs',
      companyWebsite: 'https://infosyslabs.in',
      companyLocation: 'Mumbai, Maharashtra (Remote)',
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=120&auto=format&fit=crop&q=80',
      companyDescription: 'Award-winning digital experience agency crafting enterprise web and mobile applications.',
    });

    // 2. Create Job Seekers
    const rahulSeeker = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      password: passwordHash,
      role: 'job_seeker',
      title: 'Senior Full Stack Engineer',
      bio: 'Software engineer with 5+ years experience building scalable web applications using React, Node.js, and TypeScript in Bengaluru.',
      skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Tailwind', 'Git', 'REST API', 'Docker'],
      resumeText: `Rahul Sharma - Senior Full Stack Engineer
Email: rahul.sharma@example.com | Location: Bengaluru, Karnataka

SUMMARY
Full stack engineer with 5+ years of experience architecting high-performance web applications using React, TypeScript, Node.js, Express, and MongoDB. Proven track record in building REST APIs, microservices, and modern responsive interfaces.

TECHNICAL SKILLS
- Core Tech: JavaScript, TypeScript, React, Next.js, Node.js, Express, HTML, CSS, Tailwind CSS
- Database & Tools: MongoDB, Mongoose, PostgreSQL, Git, Docker, REST API, Microservices`,
      resumeFileName: 'Rahul_Sharma_Resume.pdf',
    });

    const priyaSeeker = await User.create({
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      password: passwordHash,
      role: 'job_seeker',
      title: 'Lead UI/UX Designer',
      bio: 'Product designer based in Mumbai focusing on design systems, wireframes, and high-fidelity prototypes in Figma.',
      skills: ['Figma', 'UI/UX', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'HTML', 'CSS', 'Adobe XD'],
      resumeText: `Priya Patel - Lead UI/UX Product Designer
Email: priya.patel@example.com | Location: Mumbai, Maharashtra

SUMMARY
Product designer with 6 years of expertise creating intuitive user journeys, wireframes, design systems, and interactive prototypes using Figma and Adobe XD.`,
      resumeFileName: 'Priya_Patel_UIUX_Resume.pdf',
    });

    // 3. Create Job Listings with Indian Locations & Salaries
    const jobsData = [
      {
        title: 'Senior Full-Stack Engineer (React & Node.js)',
        organization: tcsOrg._id,
        companyName: tcsOrg.companyName,
        companyLogo: tcsOrg.companyLogo,
        location: 'Bengaluru, Karnataka (Hybrid)',
        jobType: 'Full-time',
        category: 'Engineering',
        experienceLevel: 'Senior Level',
        salaryRange: '₹14,00,000 - ₹22,00,000 / yr',
        description: 'We are seeking a Senior Full-Stack Engineer in Bengaluru to architect high-performance web applications using React, Node.js, Express, and MongoDB. You will collaborate with design and product teams to build real-time collaborative features.',
        requirements: [
          '5+ years experience with React, Node.js, and modern JavaScript/TypeScript',
          'Deep knowledge of state management, REST APIs, and MongoDB schema design',
          'Familiarity with Docker containerization and AWS cloud deployments',
        ],
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'MongoDB', 'Express', 'JavaScript', 'Tailwind'],
        benefits: ['Medical Insurance for Family', 'Hybrid Work Flexibility', 'Performance Bonus', 'Annual Learning Allowance'],
      },
      {
        title: 'Frontend React Developer',
        organization: tcsOrg._id,
        companyName: tcsOrg.companyName,
        companyLogo: tcsOrg.companyLogo,
        location: 'Hyderabad, Telangana (Remote)',
        jobType: 'Full-time',
        category: 'Engineering',
        experienceLevel: 'Mid Level',
        salaryRange: '₹8,00,000 - ₹14,00,000 / yr',
        description: 'Join our frontend team to build sleek, accessible, and fast web user interfaces. You will work with React, Tailwind CSS, TypeScript, and state management tools.',
        requirements: [
          '3+ years hands-on experience with modern React & JavaScript',
          'Proficiency in CSS, Tailwind CSS, HTML5, and responsive design',
          'Experience consuming REST and GraphQL APIs',
        ],
        requiredSkills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind', 'Redux'],
        benefits: ['Health Insurance', 'Flexible Working Hours', 'Home Workstation Allowance'],
      },
      {
        title: 'Lead UI/UX Product Designer',
        organization: infosysOrg._id,
        companyName: infosysOrg.companyName,
        companyLogo: infosysOrg.companyLogo,
        location: 'Mumbai, Maharashtra (Remote)',
        jobType: 'Full-time',
        category: 'Design',
        experienceLevel: 'Lead / Executive',
        salaryRange: '₹12,00,000 - ₹18,00,000 / yr',
        description: 'Lead design initiatives across web and mobile platforms. Create scalable design systems, wireframes, and conduct user research to craft delightful digital experiences.',
        requirements: [
          '4+ years experience in Product Design or UI/UX Design',
          'Mastery of Figma, design component libraries, and prototyping',
          'Strong understanding of design systems and accessibility standards',
        ],
        requiredSkills: ['Figma', 'UI/UX', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems'],
        benefits: ['Comprehensive Medical Cover', 'Flexible Vacation Policy', 'MacBook Pro Provided'],
      },
      {
        title: 'Backend Node.js & Microservices Architect',
        organization: tcsOrg._id,
        companyName: tcsOrg.companyName,
        companyLogo: tcsOrg.companyLogo,
        location: 'Pune, Maharashtra (Hybrid)',
        jobType: 'Full-time',
        category: 'Engineering',
        experienceLevel: 'Senior Level',
        salaryRange: '₹16,00,000 - ₹26,00,000 / yr',
        description: 'Looking for a backend specialist in Pune to optimize backend infrastructure, build scalable microservices, manage MongoDB clusters, and enforce security.',
        requirements: [
          '5+ years with Node.js, Express, or Python',
          'Hands-on experience with Docker, AWS, and Redis caching',
          'Strong data modeling skills with SQL and MongoDB databases',
        ],
        requiredSkills: ['Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'Docker', 'AWS', 'System Design', 'Redis'],
        benefits: ['Health Insurance', 'Remote Work Options', 'Annual Performance Bonus'],
      },
      {
        title: 'Machine Learning & AI Engineer',
        organization: tcsOrg._id,
        companyName: tcsOrg.companyName,
        companyLogo: tcsOrg.companyLogo,
        location: 'Bengaluru, Karnataka (Hybrid)',
        jobType: 'Full-time',
        category: 'Data & AI',
        experienceLevel: 'Mid Level',
        salaryRange: '₹15,00,000 - ₹25,00,000 / yr',
        description: 'Build predictive ML models, fine-tune LLM pipelines, and integrate AI features into enterprise SaaS platforms.',
        requirements: [
          'Degree in Computer Science, Data Science, or related field',
          'Strong proficiency in Python, PyTorch, Scikit-learn, and NLP',
          'Experience building REST API endpoints for AI model inference',
        ],
        requiredSkills: ['Python', 'Machine Learning', 'PyTorch', 'TensorFlow', 'NLP', 'Data Science', 'REST API'],
        benefits: ['Competitive Compensation', 'Health Coverage', 'Upskilling Stipend'],
      },
    ];

    const createdJobs = await Job.insertMany(jobsData);

    // 4. Create an initial sample application from Rahul Sharma
    const targetJob = createdJobs[0];
    const matchResult = calculateMatchScore(rahulSeeker.skills, rahulSeeker.resumeText, targetJob);

    await Application.create({
      job: targetJob._id,
      jobSeeker: rahulSeeker._id,
      organization: tcsOrg._id,
      resumeText: rahulSeeker.resumeText,
      applicantSkills: rahulSeeker.skills,
      matchScore: matchResult.score,
      matchingSkills: matchResult.matchingSkills,
      missingSkills: matchResult.missingSkills,
      coverLetter: 'Hello TCS Digital Team! I am excited about the Senior Full-Stack role in Bengaluru. My experience building React & Node.js apps aligns perfectly.',
      status: 'Shortlisted',
    });

    targetJob.applicantCount = 1;
    await targetJob.save();

    console.log('✅ Database successfully populated with Indian users, jobs, and applications!');
  } catch (error) {
    console.error('❌ Database seeding error:', error);
  }
}

module.exports = { seedDatabase };
