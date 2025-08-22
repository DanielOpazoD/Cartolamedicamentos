export enum Frequency {
  EVERY_24H = 'cada 24 horas (mañana)',
  EVERY_24H_NIGHT = 'cada 24 horas (noche)',
  EVERY_12H = 'cada 12 horas',
  EVERY_8H = 'cada 8 horas',
  MORNING = 'Solo en la mañana',
  AFTERNOON = 'Solo en la tarde',
  NIGHT = 'Solo en la noche',
  WITH_MEALS = 'con cada comida principal',
}

export enum Dose {
    QUARTER = '1/4',
    HALF = '1/2',
    THREE_QUARTERS = '3/4',
    ONE = '1',
    ONE_AND_QUARTER = '1 + 1/4',
    ONE_AND_HALF = '1 + 1/2',
    ONE_AND_THREE_QUARTERS = '1 + 3/4',
    TWO = '2',
    THREE = '3',
    FOUR = '4',
}

export enum DosageForm {
    TABLET_CAPSULE = 'comprimido/capsula',
    SOBRE = 'sobre',
    BICARBONATE_POWDER = 'bicarbonato en polvo',
    DROPS = 'gotas',
    OTHER = 'otro',
}

export interface Medication {
  id: number;
  name: string;
  presentacion: string;
  dose: Dose;
  frequency: Frequency;
  dosageForm: DosageForm;
  notes?: string;
  isNewMedication?: boolean;
  doseIncreased?: boolean;
  doseDecreased?: boolean;
  requiresPurchase?: boolean;
}

export interface Patient {
  name: string;
  rut: string;
  date: string;
}

export enum InjectableType {
    NPH = 'Lenta (NPH)',
    CRYSTALLINE = 'Rápida (Cristalina)',
    INSULIN_LANTUS = 'Insulina Lantus (Glargina 100 UI/ml)',
    INSULIN_TOUJEO = 'Insulina Toujeo (Glargina 300 UI/ml)',
    INSULIN_TRESIBA = 'Insulina Tresiba (Degludec 100 UI/ml)',
    SEMAGLUTIDE = 'Semaglutide (Ozempic)',
    LIRAGLUTIDE = 'Liraglutide (Victoza)',
    OTHER = 'Otros',
}

export enum InjectableSchedule {
    MAÑANA = 'Mañana',
    NOCHE = 'Noche',
}

export interface Injectable {
    id: number;
    type: InjectableType;
    dose: string;
    schedule: InjectableSchedule;
    time: string; // "HH:mm" format
    notes?: string;
    isNewMedication?: boolean;
    doseIncreased?: boolean;
    doseDecreased?: boolean;
    requiresPurchase?: boolean;
}

export interface Inhaler {
    id: number;
    name: string;
    presentacion: string;
    dose: number; // número de puff
    frequencyHours: number; // cada X horas
    notes?: string;
    isNewMedication?: boolean;
    doseIncreased?: boolean;
    doseDecreased?: boolean;
    requiresPurchase?: boolean;
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
  date: string; // YYYY-MM-DD format
  time: string; // HH:mm
  professional: string;
  withExams: 'yes' | 'no' | 'unspecified';
  exams: ExamOptions;
  otrosText: string;
  note: string;
  suspendEnabled: boolean;
  suspendText: string;
  freeNoteEnabled: boolean;
  freeNoteText: string;
}