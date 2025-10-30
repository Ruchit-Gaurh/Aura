import { 
  User, 
  AuthResponse, 
  LoginRequest, 
  RegisterRequest, 
  Appointment, 
  CreateAppointmentRequest,
  DialogflowResponse,
  SummarizeResponse,
  GenerateAIResponse
} from '../types';

// Mock data for development
const MOCK_USER: User = {
  _id: 'mock-user-123',
  name: 'Demo User',
  email: 'demo@aura.com',
  preferredLanguage: 'en-US',
  __v: 0,
};

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    _id: 'apt-1',
    patient: 'mock-user-123',
    doctorName: 'Dr. Sarah Johnson',
    appointmentTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    status: 'Scheduled',
    transcript: undefined,
    __v: 0,
  },
  {
    _id: 'apt-2',
    patient: 'mock-user-123',
    doctorName: 'Dr. Michael Chen',
    appointmentTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // Last week
    status: 'Completed',
    transcript: 'Patient reported feeling much better after the prescribed medication. Follow-up recommended in 2 weeks.',
    __v: 0,
  },
  {
    _id: 'apt-3',
    patient: 'mock-user-123',
    doctorName: 'Dr. Emily Rodriguez',
    appointmentTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // In 3 days
    status: 'Scheduled',
    transcript: undefined,
    __v: 0,
  },
];

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class MockApiService {
  private appointments: Appointment[] = [...MOCK_APPOINTMENTS];
  private isLoggedIn = false;

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await delay(1000); // Simulate network delay
    console.log('🔧 Mock API: User registered', userData);
    this.isLoggedIn = true;
    return { token: 'mock-jwt-token-123' };
  }

  async login(credentials: LoginRequest): Promise<AuthResponse> {
    await delay(800);
    console.log('🔧 Mock API: User logged in', credentials);
    this.isLoggedIn = true;
    return { token: 'mock-jwt-token-123' };
  }

  async getProfile(): Promise<User> {
    await delay(500);
    console.log('🔧 Mock API: Profile retrieved');
    return MOCK_USER;
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    await delay(600);
    console.log('🔧 Mock API: Profile updated', userData);
    return { ...MOCK_USER, ...userData };
  }

  async getAppointments(): Promise<Appointment[]> {
    await delay(700);
    console.log('🔧 Mock API: Appointments retrieved', this.appointments.length);
    return this.appointments;
  }

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    await delay(900);
    const newAppointment: Appointment = {
      _id: `apt-${Date.now()}`,
      patient: 'mock-user-123',
      doctorName: appointmentData.doctorName,
      appointmentTime: appointmentData.appointmentTime,
      status: 'Scheduled',
      transcript: undefined,
      __v: 0,
    };
    this.appointments.push(newAppointment);
    console.log('🔧 Mock API: Appointment created', newAppointment);
    return newAppointment;
  }

  async updateAppointment(appointmentId: string, updateData: any): Promise<Appointment> {
    await delay(600);
    const appointmentIndex = this.appointments.findIndex(apt => apt._id === appointmentId);
    if (appointmentIndex === -1) {
      throw new Error('Appointment not found');
    }
    
    this.appointments[appointmentIndex] = {
      ...this.appointments[appointmentIndex],
      ...updateData,
    };
    
    console.log('🔧 Mock API: Appointment updated', this.appointments[appointmentIndex]);
    return this.appointments[appointmentIndex];
  }

  async detectIntent(): Promise<DialogflowResponse> {
    await delay(1200);
    const responses = [
      {
        responseText: "I understand you're looking for health information. How can I help you today?",
        intent: 'health.inquiry',
        confidence: 0.95,
      },
      {
        responseText: "I can help you with appointment scheduling, health questions, or symptom information.",
        intent: 'general.help',
        confidence: 0.88,
      },
      {
        responseText: "For medical concerns, I recommend consulting with a healthcare professional.",
        intent: 'medical.advice',
        confidence: 0.92,
      },
    ];
    
    const response = responses[Math.floor(Math.random() * responses.length)];
    console.log('🔧 Mock API: Intent detected', response);
    return response;
  }

  async summarizeTranscript(): Promise<SummarizeResponse> {
    await delay(1500);
    const summary = {
      summary: "Patient consultation summary: Discussed symptoms, reviewed treatment options, and scheduled follow-up appointment. Patient showed improvement with current medication.",
      originalLength: 450,
      summaryLength: 125,
    };
    console.log('🔧 Mock API: Transcript summarized', summary);
    return summary;
  }

  async generateAIResponse(): Promise<GenerateAIResponse> {
    await delay(1800);
    const responses = [
      "Based on your question, I'd recommend consulting with a healthcare professional for personalized advice. In the meantime, maintaining a healthy lifestyle with regular exercise and balanced nutrition is always beneficial.",
      "That's a great health question! While I can provide general information, it's important to discuss specific symptoms or concerns with your doctor who can provide personalized medical advice.",
      "Health and wellness involve many factors including diet, exercise, sleep, and stress management. For specific medical concerns, please consult with a qualified healthcare provider.",
      "I understand your concern about your health. While I can offer general wellness information, any specific symptoms or medical questions should be discussed with a healthcare professional who can properly evaluate your situation.",
    ];
    
    const response = {
      response: responses[Math.floor(Math.random() * responses.length)],
      model: 'mock-llm-v1',
    };
    
    console.log('🔧 Mock API: AI response generated', response);
    return response;
  }
}

export const mockApiService = new MockApiService();