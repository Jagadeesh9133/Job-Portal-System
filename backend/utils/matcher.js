// Comprehensive Skill Dictionary for Tech, Design, Management & Operations
const SKILL_DICTIONARY = [
  'JavaScript', 'TypeScript', 'React', 'React.js', 'React Native', 'Node.js', 'Express', 'Express.js',
  'Next.js', 'Vue.js', 'Angular', 'HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind', 'TailwindCSS',
  'Bootstrap', 'Sass', 'SCSS', 'Redux', 'Zustand', 'GraphQL', 'REST API', 'WebSockets',
  'Python', 'Django', 'Flask', 'FastAPI', 'Java', 'Spring', 'Spring Boot', 'C++', 'C#',
  '.NET', 'PHP', 'Laravel', 'Ruby', 'Ruby on Rails', 'Go', 'Golang', 'Rust', 'Swift', 'Kotlin',
  'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Mongoose', 'Redis', 'Firebase', 'Supabase',
  'Cassandra', 'DynamoDB', 'Oracle', 'SQLite',
  'AWS', 'Amazon Web Services', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes',
  'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions', 'Linux', 'Nginx', 'Vercel', 'Netlify',
  'Git', 'GitHub', 'GitLab', 'Jira', 'Agile', 'Scrum', 'Kanban',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science', 'Pandas',
  'NumPy', 'Scikit-learn', 'NLP', 'Computer Vision', 'AI', 'OpenAI',
  'Figma', 'UI/UX', 'User Research', 'Wireframing', 'Prototyping', 'Adobe XD', 'Photoshop',
  'Illustrator', 'Design Systems',
  'Unit Testing', 'Jest', 'Cypress', 'Playwright', 'Selenium', 'TDD',
  'System Design', 'Microservices', 'Distributed Systems', 'Security', 'OAuth', 'JWT',
  'Communication', 'Leadership', 'Project Management', 'Problem Solving', 'Teamwork'
];

/**
 * Standardize skill name for comparison
 */
function normalizeSkill(skill) {
  if (!skill) return '';
  return skill.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
}

/**
 * Extract skills from raw resume text
 * @param {string} text 
 * @returns {string[]} List of unique matched skills
 */
function extractSkillsFromText(text) {
  if (!text || typeof text !== 'string') return [];
  
  const extracted = new Set();
  const lowerText = text.toLowerCase();

  SKILL_DICTIONARY.forEach((skill) => {
    // Escape special regex chars
    const escaped = skill.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'i');
    if (regex.test(text) || lowerText.includes(skill.toLowerCase())) {
      extracted.add(skill);
    }
  });

  return Array.from(extracted);
}

/**
 * Calculate match percentage and skill breakdown between candidate resume & job required skills
 * @param {string[]} applicantSkills - List of applicant's skills
 * @param {string} resumeText - Raw text of candidate's resume
 * @param {Object} job - Job object containing requiredSkills, description, title
 */
function calculateMatchScore(applicantSkills = [], resumeText = '', job = {}) {
  const requiredSkills = job.requiredSkills || [];
  
  // Normalize candidate skills
  const candidateSkillMap = new Map();
  applicantSkills.forEach(s => candidateSkillMap.set(normalizeSkill(s), s));
  
  // Also extract skills from raw resume text if provided
  if (resumeText) {
    const textSkills = extractSkillsFromText(resumeText);
    textSkills.forEach(s => candidateSkillMap.set(normalizeSkill(s), s));
  }

  if (requiredSkills.length === 0) {
    return {
      score: 75,
      matchingSkills: Array.from(candidateSkillMap.values()),
      missingSkills: [],
    };
  }

  const matchingSkills = [];
  const missingSkills = [];

  requiredSkills.forEach((reqSkill) => {
    const normReq = normalizeSkill(reqSkill);
    let matched = false;

    // Direct match check
    for (let [normCand, rawCand] of candidateSkillMap.entries()) {
      if (normCand === normReq || normCand.includes(normReq) || normReq.includes(normCand)) {
        matchingSkills.push(reqSkill);
        matched = true;
        break;
      }
    }

    if (!matched) {
      missingSkills.push(reqSkill);
    }
  });

  // Calculate ratio of matched required skills
  const skillRatio = matchingSkills.length / requiredSkills.length;
  
  // Calculate text similarity Jaccard index between resume text and job description
  let textSimilarity = 0;
  if (resumeText && job.description) {
    const resumeWords = new Set(resumeText.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    const jobWords = new Set((job.description + ' ' + (job.title || '')).toLowerCase().split(/\W+/).filter(w => w.length > 3));
    
    let intersection = 0;
    resumeWords.forEach(w => {
      if (jobWords.has(w)) intersection++;
    });
    
    const union = new Set([...resumeWords, ...jobWords]).size;
    textSimilarity = union > 0 ? intersection / union : 0;
  }

  // Weighted overall match score (75% skill overlap + 25% text similarity boost)
  let rawScore = (skillRatio * 75) + (Math.min(textSimilarity * 3, 1) * 25);
  
  // If applicant has additional relevant skills, give up to 10% bonus
  if (candidateSkillMap.size > matchingSkills.length) {
    rawScore += Math.min((candidateSkillMap.size - matchingSkills.length) * 2, 10);
  }

  const score = Math.min(Math.max(Math.round(rawScore), 15), 99);

  return {
    score,
    matchingSkills,
    missingSkills,
  };
}

module.exports = {
  extractSkillsFromText,
  calculateMatchScore,
  SKILL_DICTIONARY,
};
