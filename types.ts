export enum Frequency {
  EVERY_24H = 'cada 24 horas (mañana)',
  EVERY_24H_NIGHT = 'cada 24 horas (noche)',
  EVERY_12H = 'cada 12 horas',
  EVERY_8H = 'cada 8 horas',
  MORNING = 'Solo en la mañana',
  AFTERNOON = 'Solo en la tarde',
  NIGHT = 'Solo en la noche',
  WITH_MEALS = 'Con cada comida principal',
}

export enum Dose {
    QUARTER = '1/4',
    HALF = '1/2',
    ONE = '1',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
}

export interface Medication {
  id: number;
  name: string;
  presentacion: string;
  dose: Dose;
  frequency: Frequency;
  notes?: string;
  externalPurchase?: boolean;
}

export interface Patient {
  name: string;
  rut: string;
  date: string;
}

export enum InsulinType {
    NPH = 'Lenta (NPH)',
    CRYSTALLINE = 'Rápida (Cristalina)',
    LANTUS = 'Lantus',
    TRESIBA = 'Tresiba',
}

export enum InsulinSchedule {
    MAÑANA = 'Mañana',
    NOCHE = 'Noche',
}

export interface Insulin {
    id: number;
    type: InsulinType;
    dose: number;
    schedule: InsulinSchedule;
    time: string; // "HH:mm" format
    notes?: string;
}

export interface ExamOptions {
  sangre: boolean;
  orina: boolean;
  ecg: boolean;
  endoscopia: boolean;
  colonoscopia: boolean;
  otros: boolean;
}

export interface ControlInfo {
  applies: 'yes' | 'no';
  date: string; // YYYY-MM format
  withExams: 'yes' | 'no' | 'unspecified';
  exams: ExamOptions;
  otrosText: string;
}