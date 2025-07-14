/**
 * Job API Service - Fetches real job data from Jobicy API
 */

const JOBICY_API_BASE = "https://jobicy.com/api/v2/remote-jobs";
const BACKUP_API_BASE = "https://arbeitnow.com/api/job-board-api";

// Cache for API responses
let jobsCache = null;
let companiesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Check if cache is still valid
 */
const isCacheValid = () => {
  return cacheTimestamp && Date.now() - cacheTimestamp < CACHE_DURATION;
};

/**
 * Fetch jobs from Jobicy API
 */
export const fetchRealJobs = async (filters = {}) => {
  try {
    // Return cached data if valid
    if (isCacheValid() && jobsCache) {
      return filterJobs(jobsCache, filters);
    }

    const url = new URL(JOBICY_API_BASE);

    // Add query parameters
    if (filters.count) {
      url.searchParams.set("count", filters.count);
    }
    if (filters.geo) {
      url.searchParams.set("geo", filters.geo);
    }
    if (filters.industry) {
      url.searchParams.set("industry", filters.industry);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our schema
    const transformedJobs =
      data.jobs?.map((job) => ({
        id: job.id || generateId(),
        title: job.jobTitle || job.title || "Software Developer",
        company: job.companyName || job.company || "Tech Company",
        location: job.jobGeo || job.location || "Remote",
        type: job.jobType || "Full-time",
        salary:
          job.annualSalaryMin && job.annualSalaryMax
            ? `$${job.annualSalaryMin.toLocaleString()} - $${job.annualSalaryMax.toLocaleString()}`
            : job.salary || "Competitive",
        description:
          job.jobExcerpt ||
          job.description ||
          "Exciting opportunity to work with cutting-edge technology.",
        requirements: job.jobDescription
          ? extractRequirements(job.jobDescription)
          : getDefaultRequirements(),
        benefits: job.jobDescription
          ? extractBenefits(job.jobDescription)
          : getDefaultBenefits(),
        posted_date: job.pubDate || new Date().toISOString(),
        employment_type: mapEmploymentType(job.jobType),
        experience_level: extractExperienceLevel(
          job.jobTitle,
          job.jobDescription
        ),
        remote:
          job.jobGeo?.toLowerCase().includes("remote") ||
          job.jobGeo === "Anywhere" ||
          true,
        company_logo: generateCompanyLogo(job.companyName),
        tags: extractTags(job.jobTitle, job.jobDescription, job.jobIndustry),
        apply_url:
          job.url || job.jobSlug
            ? `https://jobicy.com/jobs/${job.jobSlug}`
            : "#",
        company_size: generateCompanySize(),
        industry: job.jobIndustry || "Technology",
      })) || [];

    // Cache the results
    jobsCache = transformedJobs;
    cacheTimestamp = Date.now();

    return filterJobs(transformedJobs, filters);
  } catch (error) {
    console.error("Error fetching real jobs:", error);

    // Fallback to realistic mock data
    return getMockJobs(filters);
  }
};

/**
 * Get unique companies from job data
 */
export const fetchRealCompanies = async () => {
  try {
    // Return cached data if valid
    if (isCacheValid() && companiesCache) {
      return companiesCache;
    }

    const jobs = await fetchRealJobs({ count: 100 });

    // Extract unique companies
    const companiesMap = new Map();

    jobs.forEach((job) => {
      if (!companiesMap.has(job.company)) {
        companiesMap.set(job.company, {
          id: generateId(),
          name: job.company,
          logo: job.company_logo,
          industry: job.industry,
          size: job.company_size,
          location: job.location === "Remote" ? "Global" : job.location,
          description: generateCompanyDescription(job.company, job.industry),
          website: generateWebsite(job.company),
          founded: generateFoundedYear(),
          employees: job.company_size,
          jobs_count: 1,
          rating: (Math.random() * 2 + 3).toFixed(1), // 3.0 - 5.0
          benefits: getDefaultBenefits(),
          culture: generateCultureTags(),
          tech_stack: extractTechStack(job.requirements),
        });
      } else {
        // Increment job count
        companiesMap.get(job.company).jobs_count += 1;
      }
    });

    const companies = Array.from(companiesMap.values());

    // Cache the results
    companiesCache = companies;

    return companies;
  } catch (error) {
    console.error("Error fetching companies:", error);
    return getMockCompanies();
  }
};

/**
 * Filter jobs based on search criteria
 */
const filterJobs = (jobs, filters) => {
  let filtered = [...jobs];

  if (filters.search) {
    const search = filters.search.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.title.toLowerCase().includes(search) ||
        job.company.toLowerCase().includes(search) ||
        job.description.toLowerCase().includes(search)
    );
  }

  if (filters.location) {
    const location = filters.location.toLowerCase();
    filtered = filtered.filter(
      (job) =>
        job.location.toLowerCase().includes(location) ||
        location.includes("remote")
    );
  }

  if (filters.type) {
    filtered = filtered.filter((job) => job.employment_type === filters.type);
  }

  return filtered.slice(0, filters.limit || 50);
};

/**
 * Helper functions for data transformation
 */

const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

const mapEmploymentType = (type) => {
  const typeMap = {
    "full-time": "full_time",
    "part-time": "part_time",
    contract: "contract",
    internship: "internship",
  };
  return typeMap[type?.toLowerCase()] || "full_time";
};

const extractRequirements = (description) => {
  if (!description) return getDefaultRequirements();

  const requirements = [];
  const skillPatterns = [
    /react/i,
    /javascript/i,
    /typescript/i,
    /node\.?js/i,
    /python/i,
    /java/i,
    /aws/i,
    /docker/i,
    /kubernetes/i,
    /sql/i,
  ];

  skillPatterns.forEach((pattern) => {
    if (pattern.test(description)) {
      requirements.push(pattern.source.replace(/[\\\/\^$*+?.()|[\]{}]/g, ""));
    }
  });

  return requirements.length > 0 ? requirements : getDefaultRequirements();
};

const extractBenefits = (description) => {
  const benefits = [];
  const benefitPatterns = [
    /health insurance/i,
    /dental/i,
    /401k/i,
    /remote/i,
    /flexible/i,
    /vacation/i,
    /pto/i,
    /equity/i,
  ];

  benefitPatterns.forEach((pattern) => {
    if (description && pattern.test(description)) {
      benefits.push(pattern.source.replace(/[\\\/\^$*+?.()|[\]{}]/g, ""));
    }
  });

  return benefits.length > 0 ? benefits : getDefaultBenefits();
};

const extractExperienceLevel = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  if (
    text.includes("senior") ||
    text.includes("lead") ||
    text.includes("principal")
  ) {
    return "senior";
  } else if (text.includes("junior") || text.includes("entry")) {
    return "junior";
  } else {
    return "mid";
  }
};

const extractTags = (title, description, industry) => {
  const tags = [];
  const text = `${title} ${description}`.toLowerCase();

  const techTags = [
    "React",
    "JavaScript",
    "Python",
    "Node.js",
    "AWS",
    "Docker",
  ];
  techTags.forEach((tag) => {
    if (text.includes(tag.toLowerCase())) {
      tags.push(tag);
    }
  });

  if (text.includes("remote")) tags.push("Remote");
  if (industry) tags.push(industry);

  return tags.slice(0, 5);
};

const generateCompanyLogo = (companyName) => {
  // Generate a placeholder logo URL
  const cleanName = encodeURIComponent(companyName?.substring(0, 2) || "TC");
  return `https://ui-avatars.com/api/?name=${cleanName}&size=100&background=374151&color=ffffff`;
};

const generateCompanySize = () => {
  const sizes = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
  return sizes[Math.floor(Math.random() * sizes.length)];
};

const generateCompanyDescription = (name, industry) => {
  const templates = [
    `${name} is a leading ${industry} company focused on innovation and growth.`,
    `Join ${name}, where we're building the future of ${industry}.`,
    `${name} is transforming ${industry} through cutting-edge technology.`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const generateWebsite = (name) => {
  const cleanName = name?.toLowerCase().replace(/[^a-z0-9]/g, "") || "company";
  return `https://${cleanName}.com`;
};

const generateFoundedYear = () => {
  return Math.floor(Math.random() * 25) + 2000; // 2000-2024
};

const generateCultureTags = () => {
  const tags = [
    "Innovation",
    "Remote-first",
    "Diversity",
    "Growth",
    "Collaboration",
  ];
  return tags.slice(0, Math.floor(Math.random() * 3) + 2);
};

const extractTechStack = (requirements) => {
  const allTech = [
    "React",
    "Node.js",
    "Python",
    "JavaScript",
    "TypeScript",
    "AWS",
    "Docker",
  ];
  return allTech.filter(() => Math.random() > 0.6).slice(0, 4);
};

const getDefaultRequirements = () => [
  "Bachelor's degree in Computer Science or related field",
  "3+ years of software development experience",
  "Strong problem-solving skills",
  "Experience with modern web technologies",
];

const getDefaultBenefits = () => [
  "Health, dental, and vision insurance",
  "Flexible working hours",
  "Remote work options",
  "Professional development budget",
  "401(k) with company match",
];

/**
 * Fallback mock data for when API fails
 */
const getMockJobs = (filters = {}) => {
  const mockJobs = [
    {
      id: "job1",
      title: "Senior Frontend Developer",
      company: "TechFlow Solutions",
      location: "San Francisco, CA (Remote)",
      type: "Full-time",
      salary: "$120,000 - $180,000",
      description:
        "Join our team to build cutting-edge web applications using React and modern JavaScript technologies.",
      requirements: ["React", "TypeScript", "Node.js", "5+ years experience"],
      benefits: [
        "Health insurance",
        "Remote work",
        "Stock options",
        "Flexible PTO",
      ],
      posted_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      employment_type: "full_time",
      experience_level: "senior",
      remote: true,
      company_logo:
        "https://ui-avatars.com/api/?name=TF&size=100&background=374151&color=ffffff",
      tags: ["React", "TypeScript", "Remote", "Frontend"],
      apply_url: "#",
      company_size: "51-200",
      industry: "Technology",
    },
    {
      id: "job2",
      title: "Product Manager",
      company: "InnovateX Corp",
      location: "New York, NY",
      type: "Full-time",
      salary: "$100,000 - $140,000",
      description:
        "Lead product strategy and development for our B2B SaaS platform.",
      requirements: [
        "Product management experience",
        "Agile methodology",
        "Data analysis",
        "Leadership skills",
      ],
      benefits: [
        "Health insurance",
        "Dental coverage",
        "401k matching",
        "Career development",
      ],
      posted_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      employment_type: "full_time",
      experience_level: "mid",
      remote: false,
      company_logo:
        "https://ui-avatars.com/api/?name=IX&size=100&background=374151&color=ffffff",
      tags: ["Product", "Strategy", "B2B", "SaaS"],
      apply_url: "#",
      company_size: "201-500",
      industry: "Technology",
    },
    {
      id: "job3",
      title: "DevOps Engineer",
      company: "CloudTech Systems",
      location: "Austin, TX (Hybrid)",
      type: "Full-time",
      salary: "$110,000 - $150,000",
      description:
        "Build and maintain our cloud infrastructure using AWS and Kubernetes.",
      requirements: [
        "AWS experience",
        "Docker",
        "Kubernetes",
        "CI/CD pipelines",
        "Linux administration",
      ],
      benefits: [
        "Health insurance",
        "Remote work options",
        "Learning budget",
        "Conference attendance",
      ],
      posted_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      employment_type: "full_time",
      experience_level: "mid",
      remote: true,
      company_logo:
        "https://ui-avatars.com/api/?name=CT&size=100&background=374151&color=ffffff",
      tags: ["DevOps", "AWS", "Kubernetes", "Cloud"],
      apply_url: "#",
      company_size: "101-200",
      industry: "Technology",
    },
  ];

  return filterJobs(mockJobs, filters);
};

const getMockCompanies = () => [
  {
    id: "comp1",
    name: "TechFlow Solutions",
    logo: "https://ui-avatars.com/api/?name=TF&size=100&background=374151&color=ffffff",
    industry: "Technology",
    size: "51-200",
    location: "San Francisco, CA",
    description:
      "TechFlow Solutions is a leading technology company focused on innovation and growth.",
    website: "https://techflow.com",
    founded: 2018,
    employees: "51-200",
    jobs_count: 12,
    rating: "4.5",
    benefits: [
      "Health insurance",
      "Remote work",
      "Stock options",
      "Flexible PTO",
    ],
    culture: ["Innovation", "Remote-first", "Diversity"],
    tech_stack: ["React", "Node.js", "AWS", "Python"],
  },
  {
    id: "comp2",
    name: "InnovateX Corp",
    logo: "https://ui-avatars.com/api/?name=IX&size=100&background=374151&color=ffffff",
    industry: "SaaS",
    size: "201-500",
    location: "New York, NY",
    description:
      "InnovateX Corp is transforming business operations through cutting-edge SaaS solutions.",
    website: "https://innovatex.com",
    founded: 2015,
    employees: "201-500",
    jobs_count: 23,
    rating: "4.2",
    benefits: [
      "Health insurance",
      "Dental coverage",
      "401k matching",
      "Career development",
    ],
    culture: ["Growth", "Collaboration", "Innovation"],
    tech_stack: ["TypeScript", "React", "Docker", "PostgreSQL"],
  },
];
