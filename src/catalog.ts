export interface SHLAssessment {
  name: string;
  url: string;
  test_type: "C" | "P" | "K";
  description: string;
  target_audience: string;
  typical_duration: string;
  competencies: string[];
}

export const SHL_CATALOG: SHLAssessment[] = [
  {
    name: "Occupational Personality Questionnaire OPQ32r",
    url: "https://www.shl.com/products/product-catalog/view/occupational-personality-questionnaire-opq32r/",
    test_type: "P",
    description: "The Occupational Personality Questionnaire (OPQ32r) is the most widely used and respected measure of work style and behavioral preferences. It assesses 32 key personality dimensions across three main domains: Relationship with People, Thinking Style, and Feelings and Emotions. Crucial for understanding how a candidate fits into a team, communicates, influences stakeholders, and handles pressure.",
    target_audience: "Professional Individual Contributor, Supervisor, Mid-Professional, Front Line Manager, General Population, Graduate, Manager, Director, Executive",
    typical_duration: "Approx. 25 minutes (untimed)",
    competencies: [
      "Persuading and Influencing",
      "Relating and Networking",
      "Analyzing and Interpreting",
      "Adapting and Coping",
      "Working with Stakeholders",
      "Leading and Deciding"
    ]
  },
  {
    name: "SHL Verify Interactive – Numerical Reasoning",
    url: "https://www.shl.com/products/product-catalog/view/shl-verify-interactive-numerical-reasoning/",
    test_type: "C",
    description: "An interactive, mobile-optimized cognitive assessment measuring the candidate's ability to analyze, interpret, and draw logical conclusions from numerical data presented in tables, charts, or graphs. Candidates are required to perform calculations, identify trends, and make business-relevant decisions.",
    target_audience: "Graduate, Manager, Mid-Professional, Professional Individual Contributor",
    typical_duration: "20 minutes",
    competencies: [
      "Numerical Data Analysis",
      "Quantitative Problem Solving",
      "Critical Thinking",
      "Business Calculations"
    ]
  },
  {
    name: "Verify - Verbal Ability - Next Generation",
    url: "https://www.shl.com/products/product-catalog/view/verify-verbal-ability-next-generation/",
    test_type: "C",
    description: "Measures the ability to read written passages and comprehend the text, interpret tone and author intent, identify main ideas, and predict author responses. Crucial for understanding reports and correspondence.",
    target_audience: "General Population, Graduate, Executive, Director, Entry-Level, Manager, Mid-Professional, Professional Individual Contributor, Supervisor, Front Line Manager",
    typical_duration: "15 minutes",
    competencies: [
      "Written Comprehension",
      "Information Extraction",
      "Logical Verbal Deduction",
      "Critical Thinking"
    ]
  },
  {
    name: "SHL Verify Interactive - Inductive Reasoning",
    url: "https://www.shl.com/products/product-catalog/view/shl-verify-interactive-inductive-reasoning/",
    test_type: "C",
    description: "Measures abstract reasoning ability. Candidates must identify patterns, rules, and logical sequences in non-verbal, visual shapes or sequences and apply those rules to determine the next item in a pattern. Excellent for assessing learning agility and novel problem-solving capabilities.",
    target_audience: "Professional Individual Contributor, Graduate, Manager, Mid-Professional",
    typical_duration: "20 minutes",
    competencies: [
      "Pattern Recognition",
      "Abstract Reasoning",
      "Conceptual Thinking",
      "Problem Solving"
    ]
  },
  {
    name: "SHL Verify Interactive – Deductive Reasoning",
    url: "https://www.shl.com/products/product-catalog/view/shl-verify-interactive-deductive-reasoning/",
    test_type: "C",
    description: "Evaluates the ability to solve logical problems, analyze scenarios, and make sound deductions based on a set of rules or premises. Unlike inductive reasoning which finds patterns, deductive reasoning applies strict logical rules to reach a guaranteed, specific conclusion.",
    target_audience: "Graduate, Manager, Mid-Professional, Professional Individual Contributor",
    typical_duration: "20 minutes",
    competencies: [
      "Logical Troubleshooting",
      "Rule Application",
      "Deductive Logic",
      "Analytical Problem Solving"
    ]
  },
  {
    name: "SHL Verify Interactive G+",
    url: "https://www.shl.com/products/product-catalog/view/shl-verify-interactive-g/",
    test_type: "C",
    description: "A comprehensive cognitive ability test combining numerical, verbal, and inductive reasoning questions into a single integrated assessment. It provides an overall index of general cognitive power (g-factor), reflecting learning speed, mental agility, and general adaptability.",
    target_audience: "Graduate, Manager, Mid-Professional, Professional Individual Contributor",
    typical_duration: "36 minutes",
    competencies: [
      "General Cognitive Agility",
      "Rapid Learning",
      "Complex Information Processing",
      "Multi-domain Problem Solving"
    ]
  },
  {
    name: "Verify - G+",
    url: "https://www.shl.com/products/product-catalog/view/verify-g/",
    test_type: "C",
    description: "An adaptive test of general cognitive ability that generates accurate assessments of three specific abilities: Deductive Reasoning, Inductive Reasoning, and Numerical Reasoning. The candidate will see questions measuring all three abilities.",
    target_audience: "General Population, Graduate, Manager, Mid-Professional, Professional Individual Contributor, Supervisor, Director, Entry-Level, Executive, Front Line Manager",
    typical_duration: "36 minutes",
    competencies: [
      "General Cognitive Agility",
      "Rapid Learning",
      "Complex Information Processing",
      "Multi-domain Problem Solving"
    ]
  },
  {
    name: "Verify - Technical Checking - Next Generation",
    url: "https://www.shl.com/products/product-catalog/view/verify-technical-checking-next-generation/",
    test_type: "C",
    description: "Measures perceptual speed and accuracy. This assessment requires examinees to quickly and accurately match symbols and switches based on a given set of rules. Highly effective in assessing attention to detail.",
    target_audience: "Entry-Level",
    typical_duration: "5 minutes",
    competencies: [
      "Attention to Detail",
      "Error Spotting",
      "Alphanumeric Comparison Speed"
    ]
  },
  {
    name: "SHL Verify Interactive Numerical Calculation",
    url: "https://www.shl.com/products/product-catalog/view/shl-verify-interactive-numerical-calculation/",
    test_type: "C",
    description: "Measures a candidate’s ability to work with numbers and use appropriate mathematics in different situations, requiring candidates to understand order of operations, perform calculations, and spot errors.",
    target_audience: "Entry-Level",
    typical_duration: "10 minutes",
    competencies: [
      "Arithmetical Accuracy",
      "Computational Speed",
      "Mathematical Operations"
    ]
  },
  {
    name: "Motivation Questionnaire MQM5",
    url: "https://www.shl.com/products/product-catalog/view/motivation-questionnaire-mqm5/",
    test_type: "P",
    description: "Measures 18 dimensions of an individual’s motivation, and provides a comprehensive understanding of those situations which increase and reduce their motivation at work.",
    target_audience: "Director, Entry-Level, Executive, Front Line Manager, General Population, Graduate, Manager, Mid-Professional, Professional Individual Contributor, Supervisor",
    typical_duration: "Approx. 25 minutes",
    competencies: [
      "Employee Engagement Factors",
      "Intrinsic Drive Alignment",
      "Culture Fit",
      "Workplace Preferences"
    ]
  },
  {
    name: "Java 8 (New)",
    url: "https://www.shl.com/products/product-catalog/view/java-8-new/",
    test_type: "K",
    description: "A comprehensive knowledge and skills assessment evaluating proficiency in Java programming, including syntax, object-oriented principles, multi-threading, stream API, memory management, garbage collection, and standard library features.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "TBC",
    competencies: [
      "Java Syntax & Core APIs",
      "Object-Oriented Programming (OOP)",
      "Concurrency & Multi-threading",
      "Troubleshooting Java Applications"
    ]
  },
  {
    name: "Python (New)",
    url: "https://www.shl.com/products/product-catalog/view/python-new/",
    test_type: "K",
    description: "Measures the candidate's core coding skills and knowledge of Python programming, databases, modules, and libraries.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "11 minutes",
    competencies: [
      "Python Data Structures",
      "Algorithmic Problem Solving",
      "Scripting & Automation",
      "Pythonic Best Practices"
    ]
  },
  {
    name: "SQL (New)",
    url: "https://www.shl.com/products/product-catalog/view/sql-new/",
    test_type: "K",
    description: "Evaluates the candidate's knowledge of SQL queries, data manipulation, and transaction processing.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "9 minutes",
    competencies: [
      "Relational Database Querying",
      "SQL Optimizations",
      "Data Manipulation & Aggregation",
      "Database Schema Knowledge"
    ]
  },
  {
    name: "Automata - SQL (New)",
    url: "https://www.shl.com/products/product-catalog/view/automata-sql-new/",
    test_type: "K",
    description: "A simulated query writing test that measures the ability to write SQL queries to perform DDL, DML and DCL tasks.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "Max 30 minutes",
    competencies: [
      "Relational Database Querying",
      "SQL Optimizations",
      "Data Manipulation & Aggregation"
    ]
  },
  {
    name: "C++ Programming (New)",
    url: "https://www.shl.com/products/product-catalog/view/c-programming-new-4122/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of programming in the C++ language and the ability to use the C++ standard library to write code.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "10 minutes",
    competencies: [
      "C++ Memory Management",
      "Standard Template Library (STL)",
      "Object-Oriented Programming (OOP)",
      "Performance Optimization"
    ]
  },
  {
    name: "JavaScript (New)",
    url: "https://www.shl.com/products/product-catalog/view/javascript-new/",
    test_type: "K",
    description: "Multi-choice test that measures knowledge of programming in the JavaScript language and its application in front-end development.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "9 minutes",
    competencies: [
      "ES6+ Standards",
      "Asynchronous Operations",
      "Closures & Scope Dynamics",
      "Browser & Web APIs"
    ]
  },
  {
    name: "C# Programming (New)",
    url: "https://www.shl.com/products/product-catalog/view/c-programming-new-4039/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of C# programming structure, functions, collections, enumeration, exception handling, OOPs constructs, and inheritance.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "9 minutes",
    competencies: [
      ".NET Core Standards",
      "LINQ & Data Filtering",
      "Asynchronous Programming",
      "Type Safety & Generics"
    ]
  },
  {
    name: "HTML/CSS (New)",
    url: "https://www.shl.com/products/product-catalog/view/htmlcss-new/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of HTML to create a user interface and CSS to stylize it.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "12 minutes",
    competencies: [
      "Semantic HTML Structures",
      "Responsive CSS (Flexbox/Grid)",
      "Web Accessibility Standards",
      "Cross-browser Layout Styling"
    ]
  },
  {
    name: "ReactJS (New)",
    url: "https://www.shl.com/products/product-catalog/view/reactjs-new/",
    test_type: "K",
    description: "Multi-choice test that measures the technical knowledge of React APIs, render function, JSX, form validation, and styling.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "10 minutes",
    competencies: [
      "React Hooks & State Flow",
      "Component Composition",
      "Performance Tuning",
      "Ecosystem & Routing Integration"
    ]
  },
  {
    name: "Angular 6 (New)",
    url: "https://www.shl.com/products/product-catalog/view/angular-6-new/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of the basic components and modules of Angular 6 and concepts like data binding, dependency injection, routing and navigation.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "11 minutes",
    competencies: [
      "RxJS & Reactive Streams",
      "Angular Modules & Routing",
      "Dependency Injection Flow",
      "State Management & Forms"
    ]
  },
  {
    name: "Data Science (New)",
    url: "https://www.shl.com/products/product-catalog/view/data-science-new/",
    test_type: "K",
    description: "Multi-choice test that measures the conceptual knowledge on how to use machine learning to analyze data, extract information, draw conclusions and make statistically-driven decisions.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "14 minutes",
    competencies: [
      "Statistical Modeling",
      "Machine Learning Algorithms",
      "Evaluation Metrics & Pipelines",
      "Data Preprocessing & EDA"
    ]
  },
  {
    name: "Agile Software Development",
    url: "https://www.shl.com/products/product-catalog/view/agile-software-development/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of agile methodology, scrum, feature driven software development, incremental and iterative development.",
    target_audience: "Graduate",
    typical_duration: "7 minutes",
    competencies: [
      "Agile Values & Principles",
      "Scrum Events & Artifacts",
      "Impediment Resolution",
      "Team Coaching & Delivery Metrics"
    ]
  },
  {
    name: "Cyber Risk (New)",
    url: "https://www.shl.com/products/product-catalog/view/cyber-risk-new/",
    test_type: "K",
    description: "Multi-choice test that measures the knowledge of cyber risk management, system and application security, network security, and security management.",
    target_audience: "Manager, Mid-Professional, Professional Individual Contributor, Supervisor",
    typical_duration: "9 minutes",
    competencies: [
      "OWASP Vulnerability Handling",
      "Network Protocols & Cryptography",
      "Identity & Access Management (IAM)",
      "Secure System Administration"
    ]
  },
  {
    name: "Project Management (2013)",
    url: "https://www.shl.com/products/product-catalog/view/project-management-2013/",
    test_type: "K",
    description: "Measures knowledge of how to manage projects to ensure that objectives are completed on time and within budget, based on PMBOK methodology.",
    target_audience: "Mid-Professional, Professional Individual Contributor",
    typical_duration: "30 minutes",
    competencies: [
      "Prioritization Frameworks",
      "Roadmap Planning",
      "Product Metrics & KPIs",
      "Stakeholder Alignment & Strategy"
    ]
  },
  {
    name: "Financial Accounting (New)",
    url: "https://www.shl.com/products/product-catalog/view/financial-accounting-new/",
    test_type: "K",
    description: "Multi-choice test that measures the ability to post journal entries, classify items into assets and liabilities, analyze financial statements and calculate financial ratios.",
    target_audience: "Entry-Level, Graduate, Manager, Mid-Professional, Professional Individual Contributor, Supervisor",
    typical_duration: "9 minutes",
    competencies: [
      "Financial Statement Mapping",
      "Ledger Bookkeeping Entries",
      "GAAP/IFRS Regulation Standards",
      "Cash Flow Analyses"
    ]
  },
  {
    name: "Entry Level Sales Solution",
    url: "https://www.shl.com/products/product-catalog/view/entry-level-sales-solution/",
    test_type: "P",
    description: "Designed for entry-level sales positions, evaluating competencies and behaviors that proactively sell products/services and drive sales revenue.",
    target_audience: "Entry-Level",
    typical_duration: "20 minutes",
    competencies: [
      "Objection Resolution",
      "Negotiation Effectiveness",
      "Customer Needs Diagnosis",
      "Goal Achievement Drive"
    ]
  },
  {
    name: "Customer Service Phone Solution",
    url: "https://www.shl.com/products/product-catalog/view/customer-service-phone-solution/",
    test_type: "P",
    description: "Includes a contact center simulation and two behavioral tests designed to measure a wide range of customer care skills, active listening, and problem resolution.",
    target_audience: "General Population",
    typical_duration: "30 minutes",
    competencies: [
      "De-escalation Mechanics",
      "Empathy & Active Listening",
      "Problem Diagnosis & Care",
      "Professional Decorum"
    ]
  },
  {
    name: "Universal Competency Framework Interview Guide",
    url: "https://www.shl.com/products/product-catalog/view/universal-competency-framework-interview-guide/",
    test_type: "P",
    description: "Provides a structured way of gathering information about each candidate and their competency potential across the 20 UCF Dimensions.",
    target_audience: "Director, Entry-Level, Executive, Front Line Manager, Manager, Mid-Professional, Professional Individual Contributor",
    typical_duration: "Variable",
    competencies: [
      "Leading and Directing",
      "Supporting and Cooperating",
      "Formulating Concepts & Strategy",
      "Organizing and Executing"
    ]
  },
  {
    name: "Verify - Deductive Reasoning",
    url: "https://www.shl.com/products/product-catalog/view/verify-deductive-reasoning/",
    test_type: "C",
    description: "An online ability assessment measuring deductive reasoning ability: drawing logical conclusions based on information provided, and analyzing scenarios.",
    target_audience: "Director, Entry-Level, Executive, Front Line Manager, General Population, Graduate, Manager, Mid-Professional, Professional Individual Contributor, Supervisor",
    typical_duration: "20 minutes",
    competencies: [
      "Logical Troubleshooting",
      "Rule Application",
      "Deductive Logic",
      "Analytical Problem Solving"
    ]
  }
];
