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
];
