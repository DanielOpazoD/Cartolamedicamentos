
import React, { useState, useRef, useCallback } from 'react';
import { Patient, Medication, Insulin, ControlInfo, ExamOptions } from './types';
import PatientInfoForm from './components/PatientInfoForm';
import MedicationForm from './components/MedicationForm';
import InsulinForm from './components/InsulinForm';
import SchedulePreview from './components/SchedulePreview';
import TrashIcon from './components/icons/TrashIcon';
import ControlInfoForm from './components/ControlInfoForm';
import MoneyIcon from './components/icons/MoneyIcon';

const initialControlInfo: ControlInfo = {
    applies: 'yes',
    date: '',
    withExams: 'unspecified',
    exams: {
        sangre: false,
        orina: false,
        ecg: false,
        endoscopia: false,
        colonoscopia: false,
        otros: false,
    },
    otrosText: ''
};

const App: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [patient, setPatient] = useState<Patient>({ name: '', rut: '', date: today });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [insulins, setInsulins] = useState<Insulin[]>([]);
    const [controlInfo, setControlInfo] = useState<ControlInfo>(initialControlInfo);


    const previewRef = useRef<HTMLDivElement>(null);

    const handlePatientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatient(prev => ({ ...prev, [name]: value }));
    }, []);

    const addMedication = useCallback((med: Omit<Medication, 'id'>) => {
        setMedications(prev => [...prev, { ...med, id: Date.now() }]);
    }, []);

    const removeMedication = useCallback((id: number) => {
        setMedications(prev => prev.filter(med => med.id !== id));
    }, []);

    const addInsulin = useCallback((insulin: Omit<Insulin, 'id'>) => {
        setInsulins(prev => [...prev, { ...insulin, id: Date.now() }]);
    }, []);

    const removeInsulin = useCallback((id: number) => {
        setInsulins(prev => prev.filter(ins => ins.id !== id));
    }, []);

    const handleControlChange = useCallback((field: keyof ControlInfo, value: string | boolean | ExamOptions) => {
        setControlInfo(prev => ({...prev, [field]: value}));
    }, []);

    const handlePrint = () => {
        const content = previewRef.current?.innerHTML;
        if (!content) {
            console.error('Preview element not found');
            return;
        }
        const printWindow = window.open('', '', 'width=800,height=600');
        if (!printWindow) return;
        printWindow.document.write(`<!DOCTYPE html><html><head><title>Cartola de Medicamentos</title><script src="https://cdn.tailwindcss.com"></script></head><body>${content}</body></html>`);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    };

    return (
        <div className="min-h-screen font-sans text-slate-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-700">Generador de Cartola de Medicamentos</h1>
                    <button
                        onClick={handlePrint}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                    >
                        <span role="img" aria-label="Imprimir" className="text-xl">🖨️</span>
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
                    <PatientInfoForm patient={patient} onChange={handlePatientChange} />
                    <MedicationForm onAddMedication={addMedication} />
                    <InsulinForm onAddInsulin={addInsulin} />
                    <ControlInfoForm controlInfo={controlInfo} onChange={handleControlChange} />
                    
                    {medications.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Medicamentos Añadidos</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {medications.map((med) => (
                                    <li key={med.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-blue-600">{med.externalPurchase && <MoneyIcon className="inline mr-1" />}{med.name} <span className="text-slate-600 font-normal">{med.presentacion}</span></p>
                                            <p className="text-sm text-slate-500">{`${med.dose} comprimido(s) - ${med.frequency}`}</p>
                                            {med.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {med.notes}</p>}
                                        </div>
                                        <button 
                                            onClick={() => removeMedication(med.id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                            aria-label="Eliminar medicamento"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {insulins.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Insulinas Añadidas</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {insulins.map((ins) => (
                                    <li key={ins.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-teal-600">{ins.type}</p>
                                            <p className="text-sm text-slate-500">{`${ins.dose} unidades - ${ins.schedule} a las ${ins.time}`}</p>
                                            {ins.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {ins.notes}</p>}
                                        </div>
                                        <button 
                                            onClick={() => removeInsulin(ins.id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                            aria-label="Eliminar insulina"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="bg-slate-200 p-4 sm:p-6 rounded-xl shadow-inner flex items-start justify-center overflow-x-auto">
                   <div ref={previewRef} className="w-full">
                     <SchedulePreview patient={patient} medications={medications} insulins={insulins} controlInfo={controlInfo} />
                   </div>
                </div>
            </main>
        </div>
    );
};

export default App;