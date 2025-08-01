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
    // semester 1
  {
    courseCode: "CMP 172",
    chapters: [
      { id: "ch1", title: "Introduction to Programming" },
      { id: "ch2", title: "Variables and Data Types" },
      { id: "ch3", title: "Operators and Expressions" },
      { id: "ch4", title: "Control Structures" },
      { id: "ch5", title: "Functions and Modular Programming" },
    ],
  },
  {
    courseCode: "CMP 173",
    chapters: [
      { id: "ch1", title: "Introduction to Internet" },
      { id: "ch2", title: "HTML Basics" },
      { id: "ch3", title: "CSS Fundamentals" },
      { id: "ch4", title: "JavaScript Introduction" },
    ],
  },
  {
    courseCode: "CMP 171",
    chapters: [
      { id: "ch1", title: "History of Computers" },
      { id: "ch2", title: "Types of Computers" },
      { id: "ch3", title: "Components of Computer Systems" },
    ],
  },
  {
    courseCode: "MTH 113",
    chapters: [
      { id: "ch1", title: "Set Theory" },
      { id: "ch2", title: "Relations and Functions" },
      { id: "ch3", title: "Limits and Continuity" },
    ],
  },
  {
    courseCode: "ENG 111",
    chapters: [
      { id: "Unit 1", title: "Reading Comprehension" },
      { id: "ch2", title: "Essay Writing" },
      { id: "ch3", title: "Grammar and Vocabulary" },
    ],
  },

  // Semester 2
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
];
