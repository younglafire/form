export interface Answer {
  id: string;
  text: string;
  timestamp?: string;
}

export interface FormResponse {
  name: string;
  selectedAnswer: string;
  timestamp: string;
}

export interface FormData {
  name: string;
  selectedAnswerId: string;
}