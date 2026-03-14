export interface Chapter {
  id: string;
  title: string;
  description?: string;
}

export interface SubjectChapters {
  courseCode: string;
  chapters: Chapter[];
}

export const chapterData: SubjectChapters[] = [
  // Start 1st Semester
  {
    courseCode: "ENG 111",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Introduction to Language Skills" },
        { id: "Unit 2", title: "Unit 2: Listening Skills" },
        { id: "Unit 3", title: "Unit 3: Speaking Skills" },
        { id: "Unit 4", title: "Unit 4: English Grammar for Accuracy" },
        { id: "Unit 5", title: "Unit 5: Reading Skills" },
        { id: "Unit 6", title: "Unit 6: Basic Research Skills" },
        { id: "Unit 7", title: "Unit 7: Writing Skills" }
    ],
  },
  {
    courseCode: "MTH 113",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Basic Concept" },
        { id: "Unit 2", title: "Unit 2: Functions, Limit, and Continuity" },
        { id: "Unit 3", title: "Unit 3: Derivative" },
        { id: "Unit 4", title: "Unit 4: Application of Derivatives" },
        { id: "Unit 5", title: "Unit 5: Integrals" },
        { id: "Unit 6", title: "Unit 6: Matrices and Determinants" },
        { id: "Unit 7", title: "Unit 7: Permutations and Combinations" }
    ]
  },
  {
    courseCode: "CMP 173",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Introduction to Web Technology" },
        { id: "Unit 2", title: "Unit 2: Hyper Text Markup Language (HTML)" },
        { id: "Unit 3", title: "Unit 3: HTML5" },
        { id: "Unit 4", title: "Unit 4: Cascading Style Sheets (CSS)" },
        { id: "Unit 5", title: "Unit 5: Advanced CSS" },
        { id: "Unit 6", title: "Unit 6: Client-Side Scripting with JavaScript" },
        { id: "Unit 7", title: "Unit 7: Advanced JavaScript" }
    ]
  },
  {
    courseCode: "CMP 171",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Introduction to Computer" },
        { id: "Unit 2", title: "Unit 2: Computer Hardware" },
        { id: "Unit 3", title: "Unit 3: Computer Software" },
        { id: "Unit 4", title: "Unit 4: Operating System" },
        { id: "Unit 5", title: "Unit 5: Data Communication and Computer Network" },
        { id: "Unit 6", title: "Unit 6: Internet and Internet Services" },
        { id: "Unit 7", title: "Unit 7: Database Management System" },
        { id: "Unit 8", title: "Unit 8: Multimedia" },
        { id: "Unit 9", title: "Unit 9: Computer Security and Privacy" },
        { id: "Unit 10", title: "Unit 10: Current Trends in Computing" }
    ]
  },
  {
    courseCode: "CMP 172",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Problem Solving with Computer" },
        { id: "Unit 2", title: "Unit 2: Elements of C" },
        { id: "Unit 3", title: "Unit 3: Input and Output" },
        { id: "Unit 4", title: "Unit 4: Operators and Expressions" },
        { id: "Unit 5", title: "Unit 5: Control Statements" },
        { id: "Unit 6", title: "Unit 6: Arrays and Strings" },
        { id: "Unit 7", title: "Unit 7: Functions" },
        { id: "Unit 8", title: "Unit 8: Pointers" },
        { id: "Unit 9", title: "Unit 9: Structures and Unions" },
        { id: "Unit 10", title: "Unit 10: File Handling" }
    ]
  },
  //End 1st Semester

  // Start 2nd Semester
    {
    courseCode: "ENG 112",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Foundation of Business Communication" },
        { id: "Unit 2", title: "Unit 2: Written Business Communication" },
        { id: "Unit 3", title: "Unit 3: Oral Business Communication" },
        { id: "Unit 4", title: "Unit 4: Non-verbal and Intercultural Business Communication" },
        { id: "Unit 5", title: "Unit 5: Visual Communication" },
        { id: "Unit 6", title: "Unit 6: Employment Communication and Presentation (Practicum)" }
    ],
  },

    {
    courseCode: "MTH 114",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Complex Numbers" },
        { id: "Unit 2", title: "Unit 2: Infinite Sequence and Series" },
        { id: "Unit 3", title: "Unit 3: Application of Antiderivative" },
        { id: "Unit 4", title: "Unit 4: Optimization: Functions of Several Variables" },
        { id: "Unit 5", title: "Unit 5: Ordinary Differential Equation" },
        { id: "Unit 6", title: "Unit 6: Integers and Division" },
        { id: "Unit 7", title: "Unit 7: Fourier Series and Integrals" }
    ]
  },

  {
    courseCode: "CMP 174",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Binary Foundation and Digital Representation" },
        { id: "Unit 2", title: "Unit 2: Boolean Building Blocks" },
        { id: "Unit 3", title: "Unit 3: Simplification of Boolean Functions" },
        { id: "Unit 4", title: "Unit 4: Combinational Logic" },
        { id: "Unit 5", title: "Unit 5: Sequential Logic" },
        { id: "Unit 6", title: "Unit 6: Registers and Counters" },
        { id: "Unit 7", title: "Unit 7: Digital Systems Design" }
    ]
  },

  {
    courseCode: "CMP 175",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Introduction to Object-Oriented Programming" },
        { id: "Unit 2", title: "Unit 2: Basic Java" },
        { id: "Unit 3", title: "Unit 3: Object-Oriented Programming" },
        { id: "Unit 4", title: "Unit 4: Inheritance and Polymorphism" },
        { id: "Unit 5", title: "Unit 5: Exception Handling" },
        { id: "Unit 6", title: "Unit 6: Stream in JAVA" },
        { id: "Unit 7", title: "Unit 7: GUI Programming with Swing" },
        { id: "Unit 8", title: "Unit 8: Generics" }
    ]
  },

  {
    courseCode: "CMP 176",
    chapters: [
        { id: "Unit 1", title: "Unit 1: Introduction to Data Structure" },
        { id: "Unit 2", title: "Unit 2: Recursion" },
        { id: "Unit 3", title: "Unit 3: Stacks" },
        { id: "Unit 4", title: "Unit 4: Queue" },
        { id: "Unit 5", title: "Unit 5: Linked List" },
        { id: "Unit 6", title: "Unit 6: Trees" },
        { id: "Unit 7", title: "Unit 7: Sorting" },
        { id: "Unit 8", title: "Unit 8: Searching" },
        { id: "Unit 9", title: "Unit 9: Graph" },
        { id: "Unit 10", title: "Unit 10: Growth Functions" }
    ]
  },

  {
    courseCode: "PRJ 181",
    chapters: [
        { id: "Project I", title: "Project I: Syllabus" },
        { id: "Guidelines", title: "Project I: Guidelines" }
    ]
  },
  // Start 3rd Semester
  {
    courseCode: "CMP 272",
    chapters: [
      { id: "Unit 1", title: "Unit 1: Introduction to Object-Oriented" },
      { id: "Unit 2", title: "Unit 2: Requirement Elicitation and Analysis" },
      { id: "Unit 3", title: "Unit 3: Object oriented analysis" },
      { id: "Unit 4", title: "Unit 4: Object-Oriented Modeling Using UML Notation" },
      { id: "Unit 5", title: "Unit 5: Object Oriented Design principles" },
      { id: "Unit 6", title: "Unit 6: Applying GOF Design Patterns" },
      { id: "Unit 7", title: "Unit 7: Case Study and Project" }
    ],
  },
  {
    courseCode: "CMP 271",
    chapters: [
      { id: "Unit 1", title: "Unit 1: Introduction" },
      { id: "Unit 2", title: "Unit 2: Data Models" },
      { id: "Unit 3", title: "Unit 3: Normalization" },
      { id: "Unit 4", title: "Unit 4: Relational Language" },
      { id: "Unit 5", title: "Unit 5: Query Processing" },
      { id: "Unit 6", title: "Unit 6: File organization and indexing" },
      { id: "Unit 7", title: "Unit 7: Security" },
      { id: "Unit 8", title: "Unit 8: Transaction and Concurrency Control" },
      { id: "Unit 9", title: "Unit 9: Backup and Recovery" },
      { id: "Unit 10", title: "Unit 10: Object oriented Database" }
    ]
  },
  {
    courseCode: "CMP 273",
    chapters: [
      { id: "Unit 1", title: "Unit 1: Introduction" },
      { id: "Unit 2", title: "Unit 2: Control Structures and Loop" },
      { id: "Unit 3", title: "Unit 3: Array and Function" },
      { id: "Unit 4", title: "Unit 4: Form Handling and Data Validation" },
      { id: "Unit 5", title: "Unit 5: File Handling, Sessions, and Error Handling" },
      { id: "Unit 6", title: "Unit 6: Working with Database" },
      { id: "Unit 7", title: "Unit 7: Advanced PHP Concepts" },
      { id: "Unit 8", title: "Unit 8: PHP Framework" }
    ]
  },
  {
    courseCode: "MGT 222",
    chapters: [
      { id: "Unit 1", title: "Unit I: Introduction to Management" },
      { id: "Unit 2", title: "Unit II: The Evolution of Management Thoughts" },
      { id: "Unit 3", title: "Unit III: Decision Making" },
      { id: "Unit 4", title: "Unit IV: Planning and Organizing" },
      { id: "Unit 5", title: "Unit V: Leadership" },
      { id: "Unit 6", title: "Unit VI: Motivation" },
      { id: "Unit 7", title: "Unit VII: Controlling" },
      { id: "Unit 8", title: "Unit VIII: IT for Management" }
    ]
  },
  {
    courseCode: "STT 220",
    chapters: [
      { id: "Unit 1", title: "Unit 1: Introduction" },
      { id: "Unit 2", title: "Unit 2: Summarization and Analysis of Data" },
      { id: "Unit 3", title: "Unit 3: Basic Probability" },
      { id: "Unit 4", title: "Unit 4: Correlation and Regression Analysis" },
      { id: "Unit 5", title: "Unit 5: Probability Distribution" },
      { id: "Unit 6", title: "Unit 6: Theory of Estimation" },
      { id: "Unit 7", title: "Unit 7: Hypothesis Testing" }
    ]
  },
  // End 3rd Semester
];
