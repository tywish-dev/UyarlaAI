export interface StudentProfile {
  readinessLevel: "düşük" | "orta" | "yüksek";
  interestArea: string;
  learningPace: "yavaş" | "normal" | "hızlı";
}

export interface TaskInput {
  learningObjective: string;
  subject: string;
  gradeLevel: string;
  studentProfile: StudentProfile;
}

export interface DifferentiatedTask {
  dimension: "içerik" | "süreç" | "ürün";
  title: string;
  description: string;
  difficultyLevel: number;
}

export interface RubricCriterion {
  criterion: string;
  levels: { score: number; description: string }[];
}

export interface GenerateTasksResponse {
  tasks: Omit<DifferentiatedTask, "difficultyLevel">[];
}

export interface AdaptTaskResponse {
  task: Omit<DifferentiatedTask, "difficultyLevel">;
}

export interface RubricResponse {
  criteria: RubricCriterion[];
}
