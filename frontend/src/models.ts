
export interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

export interface Answers {
  [key: number]: string;
}

export interface User {
  username: string;
  role: "admin" | "member";
  score: number;
}

export interface Episode {
  id: string;
  title: string;
  episode_no: number;
  featured_guest: string;
}

export interface QuestionCategory {
  id: string;
  category_name: string;
}

export interface Success {
  status: string;
}

export interface QuestionChoice {
  choiceText: string;
  isCorrect: boolean;
}

export interface Score {
  username: string;
  score: number;
}

