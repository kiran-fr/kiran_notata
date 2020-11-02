export type Connection = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: SimpleUser;
  accountId: string;
  creativeId: string;
  starred: boolean;
  creative: Creative;
  tags: Tag[];
  funnelTags: FunnelTag[];
  subjectiveScores: SubjectiveScore[];
  evaluations: Evaluation[];
  log: LogItem[];
  sharedWithMe: GroupStartupList[];
}

export type SimpleUser = {
  email: string
  given_name: string
  family_name: string
  company: string
}

export type Creative = {
  id: string;
  name: string;
  description: string;
  templateId: string;
  sharedWithEmail: string;
  sharedByEmail: string;
  submit: boolean;
  answers: CreativeAnswer[];
}

export type CreativeAnswer = {
  id: string;
  inputType: EvaluationInputType
  questionId: string;
  sid: string;
  question: string;
  val: string;
}

export type Tag = {
  id: string;
  tagGroupId: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: Date;
  index: number;
  createdByUser: SimpleUser;
}

export type FunnelTag = {
  id: string;
  funnelGroupId: string;
  name: string;
  description: string;
  createdBy: string;
  createdByUser: string;
  createdAt: Date;
  index: number;
}

export type SubjectiveScore = {
  score: number;
  createdBy: string;
  createdByUser: SimpleUser;
  createdAt: Date;
  responseType: string;
}

export type Evaluation = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  createdByUser: SimpleUser;
  templateId: string;
  answers: EvaluationAnswer[];
  summary: EvaluationSummary;
}

export type LogItem = {
  id: string;
  createdBy: string;
  createdByUser: SimpleUser;
  accountId: string;
  connectionId: string;
  createdAt: Date;
  updatedAt: Date;
  logType: LogType;
  notifyUsers: string[];
  seenBy: string[];
  reference: KeyVal[];
  dataPairs: KeyVal[];
}

export type GroupStartupList = {
  connectionId: string;
  creativeId: string;
  sharedBy: string;
  createdAt: Date;
  comments: boolean;
  evaluations: boolean;
  subjective_score: boolean;
  tags: boolean;
  connection: Connection
  groupName: string;
  groupId: string;
  createdByUser: SimpleUser;
  members: GroupMember[];
}

export type GroupMember = {
  accountId: string;
  accountName: string;
  email: string;
  role: string;
  joinedDate: Date;
  latestActivity: Date;
  user: SimpleUser;
}

export type EvaluationAnswer = {
  id: string;
  inputType: EvaluationInputType;
  questionId: string;
  sid: string;
  question: string
  val: string;
}

export type EvaluationSummary = {
  totalScore: number;
  possibleScore: number;
  templateName: string;
  sections: EvaluationSummarySection[];
}

export type EvaluationSummarySection = {
  id: string;
  name: string;
  score: number;
  possibleScore: number;
}

export type KeyVal = {
  key: string;
  val: string;
}

export enum EvaluationInputType {
  RADIO,
  CHECK,
  INPUT_TEXT,
  TRAFFIC_LIGHTS,
  INPUT_MUTLIPLE_LINES,
  COMMENT,
  URL,
  URLS,
}

export enum LogType {
  TASK,
  REMINDER,
  EVENT,
  COMMENT,
}
