/**
 * dummyResume — A fully-populated, realistic student profile used
 * as default preview content across all resume templates so users can
 * evaluate a template's look with realistic, dense content before filling
 * in their own — instead of seeing a half-empty resume. Every section is
 * deliberately filled out; nothing is left sparse or placeholder-thin.
 */
export const DUMMY_RESUME = {
  name: 'Alex Chen',
  headline: 'Software Engineering Student | Full-Stack Developer',
  intro:
    'Computer Science senior with 2+ years of hands-on experience building scalable web services, microservices, and mobile applications. Track record of successful internships at mid-sized tech startups and active contributions to open-source developer tools. Passionate about systems design, API performance optimization, and cloud-native architecture.',
  email: 'alex.chen@tempestmail.com',
  phone: '+1 (512) 555-0192',
  location: 'Seattle, WA',
  skills: [
    'JavaScript', 'TypeScript', 'Python', 'Go', 'C++', 'SQL', 'Java',
    'React', 'Node.js', 'Express', 'Next.js', 'Django', 'FastAPI',
    'PostgreSQL', 'MongoDB', 'Redis',
    'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'GitHub Actions', 'Terraform',
    'Git', 'Linux', 'Figma',
  ],
  experience: [
    {
      role: 'Backend Engineering Intern',
      company: 'CloudScale Systems',
      startDate: 'May 2025',
      endDate: 'Aug 2025',
      description:
        'Designed and implemented an asynchronous event-processing service using Go and Apache Kafka, handling 500K+ concurrent requests per day and reducing end-to-end event processing latency by 42%. Established comprehensive Prometheus metrics dashboard and configured custom alerts for service degradations, reducing mean time to detection (MTTD) by 15 minutes.',
    },
    {
      role: 'Full-Stack Developer Intern',
      company: 'DevFlow Labs',
      startDate: 'Jun 2024',
      endDate: 'Aug 2024',
      description:
        'Collaborated on the core React and Node.js platform to build a real-time collaborative workspace interface using WebSockets for synchronization. Improved system load speeds by 28% through aggressive backend API caching with Redis and optimizing SQL queries. Authored 50+ unit and integration tests achieving 90% test coverage.',
    },
    {
      role: 'Undergraduate Research Assistant',
      company: 'Vanguard Systems Lab',
      startDate: 'Sep 2023',
      endDate: 'May 2024',
      description:
        'Assisted in benchmarking latency and memory footprint of various lightweight virtualization runtimes (Docker, gVisor, Firecracker). Programmed Python automated scripts to orchestrate test runs and parse logs, co-authoring a paper accepted at an undergraduate systems engineering conference.',
    },
  ],
  education: [
    {
      degree: 'B.S.',
      field: 'Computer Science',
      institution: 'University of Washington',
      year: 'Expected Jun 2026',
      description: 'GPA: 3.92/4.0. Relevant coursework: Advanced Algorithms, Distributed Systems, Database Internals, Operating Systems, Machine Learning. Recipient of the Academic Excellence Scholarship and Departmental Honors Program.',
    },
    {
      degree: 'Study Abroad',
      field: 'Computer Engineering',
      institution: 'National University of Singapore',
      year: 'Spring 2024',
      description: 'Coursework focused on Computer Architecture, Cryptography, and Advanced Computer Networks.',
    },
  ],
  achievements: [
    {
      title: '1st Place Winner – HuskyHack Hackathon',
      year: '2025',
      description: 'Spearheaded the backend development of a peer-to-peer mesh networking emergency response app using React Native and Go. Won overall first place out of 85 competing teams.',
    },
    {
      title: 'AWS Certified Developer – Associate',
      year: '2025',
      description: 'Validated expertise in developing, deploying, and debugging cloud-based applications using AWS services.',
    },
    {
      title: 'Finalist – Collegiate Cyber Defense Competition (CCDC)',
      year: '2024',
      description: 'Configured and secured network infrastructure under active red-team attack scenarios, placing in the regional top 5.',
    },
    {
      title: "Dean's Honor List",
      year: '2022 – 2025',
      description: 'Maintained consecutive Dean\'s List standing across all academic quarters.',
    },
  ],
  links: { github: 'github.com/alexchen-dev', linkedin: 'linkedin.com/in/alexchen-dev', website: 'alexchen.dev' },
};

export const DUMMY_PROJECTS = [
  {
    _id: 'dummy-1',
    name: 'Port-Forge',
    language: 'React · Node.js · Express · MongoDB · Tailwind CSS',
    description:
      'An AI-powered portfolio generator that automatically fetches public repositories from GitHub and ranks them comparatively based on documentation quality and technical complexity. Built using React and Node.js, featuring six responsive themes, Clerk authentication, and a customized resume creation engine that exports clean, print-optimized PDF outputs.',
  },
  {
    _id: 'dummy-2',
    name: 'VeloDB',
    language: 'Go · gRPC · Raft Consensus Protocol',
    description:
      'A distributed, persistent key-value store built in Go implementing the Raft consensus protocol for high availability and fault tolerance. Supports write-ahead logging, database compaction, and parallel query execution. Handled up to 10K writes/sec during benchmarking with zero data loss under simulated network partition failures.',
  },
  {
    _id: 'dummy-3',
    name: 'OctoTrace',
    language: 'Python · FastAPI · Docker · Redis',
    description:
      'A real-time container log analysis tool that aggregates Docker container logs, parses stack traces using regular expressions, and feeds them into a Redis pub/sub queue. Features an interactive FastAPI dashboard for streaming trace analysis, helping developers debug localized distributed service issues quickly.',
  },
];
