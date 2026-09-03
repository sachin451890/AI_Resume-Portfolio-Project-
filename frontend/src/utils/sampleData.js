export const sampleResume = {
  id: 'sample_resume_01',
  title: 'Senior Full Stack Developer Resume',
  targetRole: 'Full Stack Software Engineer',
  templateId: 'modern',
  personalInfo: {
    fullName: 'Alex Johnson',
    professionalTitle: 'Senior Full Stack Engineer',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    linkedinUrl: 'https://linkedin.com/in/alexjohnson-dev',
    githubUrl: 'https://github.com/alexjohnson-dev',
    portfolioUrl: 'https://alexjohnson.dev',
    otherLinks: 'https://dev.to/alexjohnson'
  },
  summary: 'Results-driven Senior Full Stack Engineer with 5+ years of experience designing and deploying high-scale web applications, microservices, and AI-driven platforms. Skilled in React, Node.js, TypeScript, PostgreSQL, and Cloud Architecture with a strong focus on system performance and clean code.',
  educations: [
    {
      id: 'edu_1',
      degree: 'B.S. in Computer Science',
      institution: 'University of California, Berkeley',
      location: 'Berkeley, CA',
      startDate: '2016-08',
      endDate: '2020-05',
      gpa: '3.8 / 4.0',
      coursework: 'Data Structures, Operating Systems, Web Engineering, Database Systems, Machine Learning',
      description: 'Graduated with Honors. Co-founder of Computer Science Student Association.'
    }
  ],
  experiences: [
    {
      id: 'exp_1',
      jobTitle: 'Senior Full Stack Engineer',
      company: 'TechNova Solutions',
      location: 'San Francisco, CA',
      employmentType: 'Full-time',
      startDate: '2022-06',
      endDate: 'Present',
      isCurrent: true,
      responsibilities: '• Spearheaded the architectural migration of core monolith to serverless microservices, improving throughput by 40%.\n• Designed and implemented real-time collaboration dashboards using React, WebSockets, and Node.js.\n• Led a squad of 6 engineers, conducting code reviews and mentoring junior developers.',
      achievements: 'Engineered automated CI/CD pipeline reducing deployment cycle times from 2 hours to 10 minutes.'
    },
    {
      id: 'exp_2',
      jobTitle: 'Software Engineer',
      company: 'Apex Cloud Systems',
      location: 'San Jose, CA',
      employmentType: 'Full-time',
      startDate: '2020-06',
      endDate: '2022-05',
      isCurrent: false,
      responsibilities: '• Developed high-traffic web applications with React and Express, servicing over 200k active monthly users.\n• Optimized SQL query performance on PostgreSQL databases, cutting average query latency by 35%.\n• Integrated third-party REST and GraphQL APIs securely with strict error handling.',
      achievements: 'Received Excellence Award for delivering key SaaS module ahead of schedule.'
    }
  ],
  skills: [
    { id: 'sk_1', name: 'JavaScript (ES6+)', category: 'Programming Languages', proficiency: 'Expert' },
    { id: 'sk_2', name: 'TypeScript', category: 'Programming Languages', proficiency: 'Expert' },
    { id: 'sk_3', name: 'React.js', category: 'Frontend', proficiency: 'Expert' },
    { id: 'sk_4', name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Expert' },
    { id: 'sk_5', name: 'Node.js', category: 'Backend', proficiency: 'Expert' },
    { id: 'sk_6', name: 'Express.js', category: 'Backend', proficiency: 'Expert' },
    { id: 'sk_7', name: 'PostgreSQL', category: 'Database', proficiency: 'Advanced' },
    { id: 'sk_8', name: 'Supabase', category: 'Database', proficiency: 'Advanced' },
    { id: 'sk_9', name: 'Docker & Kubernetes', category: 'Cloud', proficiency: 'Intermediate' },
    { id: 'sk_10', name: 'Git & GitHub Actions', category: 'Tools', proficiency: 'Expert' }
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'AI E-Commerce Intelligence Dashboard',
      description: 'An AI-powered dashboard enabling merchants to analyze customer sentiment and auto-generate product descriptions using Gemini API.',
      technologies: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Gemini AI API'],
      githubUrl: 'https://github.com/alexjohnson-dev/ai-ecommerce-dashboard',
      liveUrl: 'https://ai-ecommerce-demo.vercel.app',
      startDate: '2023-01',
      endDate: '2023-04',
      keyContributions: 'Built real-time visualization widgets and secure AI streaming service integration.'
    },
    {
      id: 'proj_2',
      name: 'Collaborative Task Management App',
      description: 'Real-time kanban and workspace management platform with drag-and-drop support, role-based permissions, and instant notifications.',
      technologies: ['TypeScript', 'React', 'Supabase', 'WebSockets'],
      githubUrl: 'https://github.com/alexjohnson-dev/task-flow',
      liveUrl: 'https://taskflow-app.vercel.app',
      startDate: '2022-09',
      endDate: '2022-12',
      keyContributions: 'Implemented optimistic UI updates and robust offline cache synchronization.'
    }
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Associate',
      organization: 'Amazon Web Services',
      issueDate: '2023-03',
      expiryDate: '2026-03',
      credentialId: 'AWS-ASA-99201',
      credentialUrl: 'https://aws.amazon.com/verification'
    }
  ],
  achievements: [
    {
      id: 'ach_1',
      title: 'First Place - Silicon Valley Hackathon 2023',
      organization: 'TechCrunch Disrupt',
      date: '2023-09',
      description: 'Won 1st place among 120 teams for building an AI-powered accessibility solution for visually impaired developers.'
    }
  ],
  customSections: [
    {
      id: 'cs_1',
      sectionType: 'languages',
      title: 'Languages',
      content: 'English (Native/Fluent), Spanish (Conversational)',
      isEnabled: true
    },
    {
      id: 'cs_2',
      sectionType: 'interests',
      title: 'Interests',
      content: 'Open Source Contributing, Cloud Architecture, UI Design, Cycling',
      isEnabled: true
    }
  ]
};
