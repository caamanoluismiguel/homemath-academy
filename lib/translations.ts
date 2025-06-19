
import { Language } from './types';

export const translations: Record<string, Record<Language, string>> = {
  // Navigation & General
  appTitle: { en: "HomeMath Academy", es: "Academia HomeMath" },
  appDescription: { 
    en: "Empowering Christian homeschooling families with AI-driven math placement and personalized growth.", 
    es: "Empoderando a las familias cristianas que educan en el hogar con ubicación de matemáticas impulsada por IA y crecimiento personalizado." 
  },
  dashboard: { en: "Dashboard", es: "Panel de Control" },
  logout: { en: "Logout", es: "Cerrar Sesión" },
  login: { en: "Login", es: "Iniciar Sesión" },
  getStarted: { en: "Get Started", es: "Comenzar" },
  learnMore: { en: "Learn More", es: "Saber Más" },
  
  // Child Management
  selectChild: { en: "Select Child", es: "Seleccionar Niño/a" },
  addChild: { en: "Add Child", es: "Añadir Niño/a" },
  childName: { en: "Child's Name", es: "Nombre del Niño/a" },
  preferredGrade: { en: "Preferred Grade", es: "Grado Preferido" },
  preferredLanguage: { en: "Preferred Language", es: "Idioma Preferido" },
  birthDate: { en: "Birth Date", es: "Fecha de Nacimiento" },
  save: { en: "Save", es: "Guardar" },
  cancel: { en: "Cancel", es: "Cancelar" },
  
  // Assessment & Testing
  takePlacementTest: { en: "Take Placement Test", es: "Tomar Examen de Ubicación" },
  placementTestDesc: { 
    en: "Assess readiness for {grade} grade math concepts.", 
    es: "Evaluar la preparación para los conceptos matemáticos del grado {grade}." 
  },
  startTest: { en: "Start Test", es: "Comenzar Examen" },
  submittingTest: { en: "Submitting test results...", es: "Enviando resultados del examen..." },
  loadingTest: { en: "Loading test...", es: "Cargando examen..." },
  
  // Reports & Insights
  viewReport: { en: "View Insight Report", es: "Ver Informe de Perspectivas" },
  insightReport: { en: "Insight Report", es: "Informe de Perspectivas" },
  strengths: { en: "Strengths", es: "Fortalezas" },
  weaknesses: { en: "Areas for Growth", es: "Áreas de Crecimiento" },
  recommendations: { en: "Recommendations", es: "Recomendaciones" },
  
  // Growth Plans
  viewGrowthPlan: { en: "View Growth Plan", es: "Ver Plan de Crecimiento" },
  growthPlan: { en: "Growth Plan", es: "Plan de Crecimiento" },
  weeklyPlan: { en: "Weekly Plan", es: "Plan Semanal" },
  dailyLesson: { en: "Daily Lesson", es: "Lección Diaria" },
  
  // Progress Tracking
  progressTracking: { en: "Progress Tracking", es: "Seguimiento del Progreso" },
  weeklyProgress: { en: "Weekly Progress", es: "Progreso Semanal" },
  masteryLevel: { en: "Mastery Level", es: "Nivel de Dominio" },
  timeSpent: { en: "Time Spent", es: "Tiempo Dedicado" },
  
  // Subscription
  subscription: { en: "Subscription", es: "Suscripción" },
  upgradeNow: { en: "Upgrade Now", es: "Actualizar Ahora" },
  manageBilling: { en: "Manage Billing", es: "Gestionar Facturación" },
  
  // Common Actions
  continue: { en: "Continue", es: "Continuar" },
  back: { en: "Back", es: "Atrás" },
  next: { en: "Next", es: "Siguiente" },
  previous: { en: "Previous", es: "Anterior" },
  submit: { en: "Submit", es: "Enviar" },
  loading: { en: "Loading...", es: "Cargando..." },
  
  // Error Messages
  errorGeneral: { en: "An error occurred. Please try again.", es: "Ocurrió un error. Por favor, inténtelo de nuevo." },
  errorNetwork: { en: "Network error. Please check your connection.", es: "Error de red. Por favor, verifique su conexión." },
  
  // Success Messages
  successSaved: { en: "Successfully saved!", es: "¡Guardado exitosamente!" },
  successSubmitted: { en: "Successfully submitted!", es: "¡Enviado exitosamente!" },
};

export function useTranslation(language: Language = 'en') {
  const t = (key: string, replacements?: Record<string, string>): string => {
    const translationSet = translations[key];
    let translation = translationSet?.[language] || translationSet?.['en'] || key;
    
    if (replacements) {
      translation = Object.entries(replacements).reduce((acc, [placeholder, value]) => {
        return acc.replace(`{${placeholder}}`, value);
      }, translation);
    }
    
    return translation;
  };

  return { t };
}
