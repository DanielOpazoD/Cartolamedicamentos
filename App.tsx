
import React, { useState, useRef, useCallback } from 'react';
import { Patient, Medication, Injectable, ControlInfo, ExamOptions } from './types';
import PatientInfoForm from './components/PatientInfoForm';
import MedicationForm from './components/MedicationForm';
import InjectableForm from './components/InjectableForm';
import SchedulePreview from './components/SchedulePreview';
import TrashIcon from './components/icons/TrashIcon';
import ControlInfoForm from './components/ControlInfoForm';
import MoneyIcon from './components/icons/MoneyIcon';

const initialControlInfo: ControlInfo = {
    applies: 'no',
    date: '',
    time: '',
    professional: '',
    withExams: 'unspecified',
    exams: {
        sangre: false,
        orina: false,
        ecg: false,
        endoscopia: false,
        colonoscopia: false,
        otros: false,
    },
    otrosText: '',
    note: '',
    suspendEnabled: false,
    suspendText: ''
};

const App: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [patient, setPatient] = useState<Patient>({ name: '', rut: '', date: today });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [injectables, setInjectables] = useState<Injectable[]>([]);
    const [controlInfo, setControlInfo] = useState<ControlInfo>(initialControlInfo);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const [editingInjectable, setEditingInjectable] = useState<Injectable | null>(null);


    const previewRef = useRef<HTMLDivElement>(null);

    const handlePatientChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPatient(prev => ({ ...prev, [name]: value }));
    }, []);

    const addMedication = useCallback((med: Omit<Medication, 'id'>) => {
        setMedications(prev => [...prev, { ...med, id: Date.now() }]);
    }, []);

    const updateMedication = useCallback((id: number, med: Omit<Medication, 'id'>) => {
        setMedications(prev => prev.map(m => m.id === id ? { ...m, ...med } : m));
    }, []);

    const removeMedication = useCallback((id: number) => {
        setMedications(prev => prev.filter(med => med.id !== id));
    }, []);

    const addInjectable = useCallback((inj: Omit<Injectable, 'id'>) => {
        setInjectables(prev => [...prev, { ...inj, id: Date.now() }]);
    }, []);

    const updateInjectable = useCallback((id: number, inj: Omit<Injectable, 'id'>) => {
        setInjectables(prev => prev.map(i => i.id === id ? { ...i, ...inj } : i));
    }, []);

    const removeInjectable = useCallback((id: number) => {
        setInjectables(prev => prev.filter(ins => ins.id !== id));
    }, []);

    const handleControlChange = useCallback((field: keyof ControlInfo, value: string | boolean | ExamOptions) => {
        setControlInfo(prev => ({...prev, [field]: value}));
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportList = () => {
        const data = { medications, injectables };
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'lista_farmacos.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleImportList = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                setMedications(data.medications || []);
                setInjectables(data.injectables || []);
            } catch (err) {
                console.error('Error al importar lista', err);
            }
        };
        reader.readAsText(file);
    };

    const handleImportClick = () => fileInputRef.current?.click();

    return (
        <div className="min-h-screen font-sans text-slate-800">
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap gap-2 justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-700">Generador de Cartola de Medicamentos</h1>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportList}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v3h-2V3H5v14h6v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V3z"/><path d="M9 7h2v5h3l-4 4-4-4h3V7z"/></svg>
                            Exportar Lista
                        </button>
                        <button
                            onClick={handleImportClick}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v3h-2V3H5v14h6v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V3z"/><path d="M11 13H9V8H6l4-4 4 4h-3v5z"/></svg>
                            Importar Lista
                        </button>
                        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportList} />
                        <button
                            onClick={handlePrint}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v2h12V4a2 2 0 00-2-2H6zm10 6H4v8a2 2 0 002 2h8a2 2 0 002-2V8zM6 10h8v2H6v-2z" clipRule="evenodd" />
                            </svg>
                            Imprimir / Guardar PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
                    <PatientInfoForm patient={patient} onChange={handlePatientChange} />
                    <MedicationForm onAddMedication={addMedication} onUpdateMedication={updateMedication} editingMedication={editingMedication} onCancelEdit={() => setEditingMedication(null)} />
                    <InjectableForm onAddInjectable={addInjectable} onUpdateInjectable={updateInjectable} editingInjectable={editingInjectable} onCancelEdit={() => setEditingInjectable(null)} />
                    <ControlInfoForm controlInfo={controlInfo} onChange={handleControlChange} />
                    
                    {medications.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Medicamentos Añadidos</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {medications.map((med) => (
                                    <li key={med.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-blue-600">
                                                {med.requiresPurchase && <MoneyIcon className="inline w-4 h-4 mr-1" />}
                                                {med.name} <span className="text-slate-600 font-normal">{med.presentacion}</span>
                                            </p>
                        <p className="text-sm text-slate-500">{`${med.dose} comprimido(s) - ${med.frequency}`}</p>
                                            {med.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {med.notes}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingMedication(med)}
                                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                                aria-label="Editar medicamento"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21.036H3v-4.5L16.732 3.732z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => removeMedication(med.id)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                                aria-label="Eliminar medicamento"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {injectables.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Tratamientos Inyectables Añadidos</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {injectables.map((ins) => (
                                    <li key={ins.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-teal-600">{ins.type}</p>
                                            <p className="text-sm text-slate-500">{`${ins.dose} - ${ins.schedule} a las ${ins.time}`}</p>
                                            {ins.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {ins.notes}</p>}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingInjectable(ins)}
                                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                                aria-label="Editar inyectable"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21.036H3v-4.5L16.732 3.732z" /></svg>
                                            </button>
                                            <button
                                                onClick={() => removeInjectable(ins.id)}
                                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                                aria-label="Eliminar inyectable"
                                            >
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Preview Panel */}
                <div className="bg-slate-200 p-4 sm:p-6 rounded-xl shadow-inner flex items-start justify-center overflow-x-auto">
                   <div ref={previewRef} className="w-full">
                     <SchedulePreview patient={patient} medications={medications} injectables={injectables} controlInfo={controlInfo} />
                   </div>
                </div>
            </main>
        </div>
    );
};

export default App;