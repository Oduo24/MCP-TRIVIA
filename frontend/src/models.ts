export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Answers {
  [key: number]: string;
}