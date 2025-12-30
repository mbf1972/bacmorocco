
export interface AnalysisStep {
  title: string;
  content: string;
}

export interface ExamAnalysisResponse {
  subject: string;
  level: string;
  summary: string;
  solutions: {
    question: string;
    answer: string;
    explanation: string;
    commonMistakes: string[];
    tips: string;
  }[];
  overallAdvice: string;
}

export interface FileData {
  base64: string;
  mimeType: string;
  name: string;
}
