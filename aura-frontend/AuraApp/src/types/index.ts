// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  preferredLanguage: string;
  __v: number;
}

export interface AuthResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  preferredLanguage: string;
}

// Appointment types
export interface Appointment {
  _id: string;
  patient: string;
  doctorName: string;
  appointmentTime: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  transcript?: string;
  __v: number;
}

export interface CreateAppointmentRequest {
  doctorName: string;
  appointmentTime: string;
}

export interface UpdateAppointmentRequest {
  status?: 'Scheduled' | 'Completed' | 'Cancelled';
  transcript?: string;
}

// AI Service types
export interface DialogflowRequest {
  text: string;
  sessionId: string;
  projectId: string;
  location: string;
  agentId: string;
}

export interface DialogflowResponse {
  responseText: string;
  intent: string;
  confidence: number;
}

export interface SummarizeRequest {
  transcript: string;
}

export interface SummarizeResponse {
  summary: string;
  originalLength: number;
  summaryLength: number;
}

export interface GenerateAIRequest {
  prompt: string;
  model: string;
}

export interface GenerateAIResponse {
  response: string;
  model: string;
}

// WebSocket types
export interface WebSocketMessage {
  type: 'join_room' | 'text_message' | 'audio_chunk' | 'translated_message' | 'joined_room';
  roomId?: string;
  userId?: string;
  targetLanguage?: string;
  text?: string;
  audioData?: string;
  senderId?: string;
  originalText?: string;
  translatedText?: string;
  participantCount?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  msg?: string;
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
  AppointmentDetail: { appointmentId: string };
  CreateAppointment: undefined;
  Profile: undefined;
  VoiceCall: { appointmentId: string };
  Loading: undefined;
  
  // Medicine reminder screens
  MedicineReminders: undefined;
  MedicineSchedule: undefined;
  HealthCheck: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Appointments: undefined;
  Profile: undefined;
  AI: undefined;
};