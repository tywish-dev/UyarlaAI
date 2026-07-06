export type BloomLevel =
  | "hatırlama"
  | "anlama"
  | "uygulama"
  | "analiz"
  | "değerlendirme"
  | "oluşturma";

export type LearningModality = "görsel" | "işitsel" | "kinestetik" | "sözel";
export type LearningEnvironment = "bireysel" | "küçük_grup" | "tüm_sınıf";
export type LearningExpression = "sözlü" | "yazılı" | "görsel" | "dijital";

export interface LearningProfile {
  modalities: LearningModality[];
  environment: LearningEnvironment;
  expression: LearningExpression;
}

export interface TymmAlignment {
  learningOutcome: string;
  skill: string;
  value: string;
  disposition: string;
}

export interface StudentProfile {
  readinessLevel: "düşük" | "orta" | "yüksek";
  interestArea: string;
  /** @deprecated Use learningProfile instead; kept for backward compatibility */
  learningPace?: "yavaş" | "normal" | "hızlı";
  learningProfile: LearningProfile;
}

export interface TaskInput {
  learningObjective: string;
  subject: string;
  gradeLevel: string;
  studentProfile: StudentProfile;
}

export interface LessonInput extends TaskInput {
  durationMinutes: number;
  bloomLevel: BloomLevel;
  tymm: TymmAlignment;
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

export interface LessonFlowPhase {
  phase: string;
  duration: string;
  activity: string;
  teacherRole: string;
}

export interface TeacherGuideSection {
  section: string;
  content: string;
}

export interface WorksheetSection {
  section: string;
  instructions: string;
  questions: string[];
}

export interface PresentationSlide {
  slideNumber: number;
  title: string;
  content: string;
  notes: string;
}

export interface AssessmentQuestion {
  type: "çoktan_seçmeli" | "açık_uçlu" | "doğru_yanlış" | "kısa_cevap";
  question: string;
  options?: string[];
  answer?: string;
}

export interface LessonPackageMetadata {
  subject: string;
  gradeLevel: string;
  durationMinutes: number;
  bloomLevel: BloomLevel;
  tymm: TymmAlignment;
}

export interface LessonPackage {
  metadata: LessonPackageMetadata;
  lessonFlow: LessonFlowPhase[];
  teacherGuide: TeacherGuideSection[];
  tasks: Omit<DifferentiatedTask, "difficultyLevel">[];
  studentWorksheet: WorksheetSection[];
  presentationOutline: PresentationSlide[];
  rubric: RubricCriterion[];
  assessmentQuestions: AssessmentQuestion[];
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

export interface GenerateLessonPackageResponse {
  package: LessonPackage;
}

export const DEFAULT_LEARNING_PROFILE: LearningProfile = {
  modalities: ["görsel", "sözel"],
  environment: "küçük_grup",
  expression: "dijital",
};

export const DEFAULT_TYMM: TymmAlignment = {
  learningOutcome: "",
  skill: "",
  value: "",
  disposition: "",
};
