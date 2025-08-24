
import React, { useState, useRef, useCallback } from 'react';
import { Patient, Medication, Injectable, ControlInfo, ExamOptions, Inhaler, DosageForm } from './types';
import PatientInfoForm from './components/PatientInfoForm';
import MedicationForm from './components/MedicationForm';
import InjectableForm from './components/InjectableForm';
import InhalerForm from './components/InhalerForm';
import SchedulePreview from './components/SchedulePreview';
import TrashIcon from './components/icons/TrashIcon';
import ControlInfoForm from './components/ControlInfoForm';
import SuspensionSection from './components/SuspensionSection';
import MoneyIcon from './components/icons/MoneyIcon';
import StarIcon from './components/icons/StarIcon';
import ArrowUpIcon from './components/icons/ArrowUpIcon';
import ArrowDownIcon from './components/icons/ArrowDownIcon';
import GlycemiaLog from './components/GlycemiaLog';

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
    suspendText: '',
    freeNoteEnabled: false,
    freeNoteText: ''
};

const App: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [patient, setPatient] = useState<Patient>({ name: '', rut: '', date: today });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [injectables, setInjectables] = useState<Injectable[]>([]);
    const [inhalers, setInhalers] = useState<Inhaler[]>([]);
    const [controlInfo, setControlInfo] = useState<ControlInfo>(initialControlInfo);
    const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
    const [editingInjectable, setEditingInjectable] = useState<Injectable | null>(null);
    const [editingInhaler, setEditingInhaler] = useState<Inhaler | null>(null);
    const [activeTab, setActiveTab] = useState<'oral' | 'injectable' | 'inhaled'>('oral');
    const [showQr, setShowQr] = useState(false);
    const [activeSection, setActiveSection] = useState<'medications' | 'glycemia'>('medications');


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

    const addInhaler = useCallback((inh: Omit<Inhaler, 'id'>) => {
        setInhalers(prev => [...prev, { ...inh, id: Date.now() }]);
    }, []);

    const updateInhaler = useCallback((id: number, inh: Omit<Inhaler, 'id'>) => {
        setInhalers(prev => prev.map(i => i.id === id ? { ...i, ...inh } : i));
    }, []);

    const removeInhaler = useCallback((id: number) => {
        setInhalers(prev => prev.filter(i => i.id !== id));
    }, []);

    const handleControlChange = useCallback((field: keyof ControlInfo, value: string | boolean | ExamOptions) => {
        setControlInfo(prev => ({...prev, [field]: value}));
    }, []);

    const handlePrint = () => {
        window.print();
    };

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExportList = () => {
        const data = { patient, medications, injectables, inhalers };
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
                setPatient(data.patient || { name: '', rut: '', date: today });
                setMedications(data.medications || []);
                setInjectables(data.injectables || []);
                setInhalers(data.inhalers || []);
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
                    <div className="flex items-center gap-4">
                        <h1 className="text-2xl font-bold text-blue-700">
                            {activeSection === 'medications' ? 'Guía de Medicamentos' : 'Registro de Glicemia'}
                        </h1>
                        <nav className="flex gap-2">
                            <button
                                className={`text-sm font-semibold ${activeSection === 'medications' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveSection('medications')}
                                type="button"
                            >
                                Medicamentos
                            </button>
                            <button
                                className={`text-sm font-semibold ${activeSection === 'glycemia' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveSection('glycemia')}
                                type="button"
                            >
                                Registro glicemia
                            </button>
                        </nav>
                    </div>
                    <div className="flex gap-2">
                        {activeSection === 'medications' && (
                            <>
                                <button
                                    onClick={handleExportList}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v3h-2V3H5v14h6v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V3z"/><path d="M9 7h2v5h3l-4 4-4-4h3V7z"/></svg>
                                    Exportar Lista
                                </button>
                                <button
                                    onClick={handleImportClick}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M3 3a2 2 0 012-2h6a2 2 0 012 2v3h-2V3H5v14h6v-3h2v3a2 2 0 01-2 2H5a2 2 0 01-2-2V3z"/><path d="M11 13H9V8H6l4-4 4 4h-3v5z"/></svg>
                                    Importar Lista
                                </button>
                                <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportList} />
                            </>
                        )}
                        <button
                            onClick={handlePrint}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v2h12V4a2 2 0 00-2-2H6zm10 6H4v8a2 2 0 002 2h8a2 2 0 002-2V8zM6 10h8v2H6v-2z" clipRule="evenodd" />
                            </svg>
                            Imprimir / Guardar PDF
                        </button>
                    </div>
                </div>
            </header>

            {activeSection === 'medications' ? (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
                    <PatientInfoForm patient={patient} onChange={handlePatientChange} showQr={showQr} onToggleQr={setShowQr} />
                    <div>
                        <div className="flex border-b">
                            <button
                                className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'oral' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab('oral')}
                                type="button"
                            >
                                Fármacos orales
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'injectable' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab('injectable')}
                                type="button"
                            >
                                Fármacos inyectables
                            </button>
                            <button
                                className={`flex-1 py-2 text-sm font-semibold ${activeTab === 'inhaled' ? 'border-b-2 border-blue-500' : ''}`}
                                onClick={() => setActiveTab('inhaled')}
                                type="button"
                            >
                                Fármacos inhalados
                            </button>
                        </div>
                        <div className="pt-4 space-y-4">
                            {activeTab === 'oral' && (
                                <>
                                    <MedicationForm onAddMedication={addMedication} onUpdateMedication={updateMedication} editingMedication={editingMedication} onCancelEdit={() => setEditingMedication(null)} />
                                    {medications.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Medicamentos Añadidos</h3>
                                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                {medications.map((med) => (
                                                    <li key={med.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                                        <div>
                                                            <p className="font-bold text-blue-600 flex items-center gap-1">
                                                                {med.isNewMedication && <StarIcon className="inline w-4 h-4 text-yellow-500" />}
                                                                {med.doseIncreased && <ArrowUpIcon className="inline w-4 h-4" />}
                                                                {med.doseDecreased && <ArrowDownIcon className="inline w-4 h-4" />}
                                                                {med.requiresPurchase && <MoneyIcon className="inline w-4 h-4 text-green-600" />}
                                                                {med.name} <span className="text-slate-600 font-normal">{med.presentacion}</span>
                                                            </p>
                                                            {(() => {
                                                                const description = med.dosageForm === DosageForm.OTHER
                                                                    ? med.otherDosageForm
                                                                    : med.dosageForm === DosageForm.NONE
                                                                        ? ''
                                                                        : med.dosageForm;
                                                                return (
                                                                    <p className="text-sm text-slate-500">
                                                                        {`${med.dose}${description ? ` ${description}` : ''} - ${med.frequency}`}
                                                                    </p>
                                                                );
                                                            })()}
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
                                </>
                            )}
                            {activeTab === 'injectable' && (
                                <>
                                    <InjectableForm onAddInjectable={addInjectable} onUpdateInjectable={updateInjectable} editingInjectable={editingInjectable} onCancelEdit={() => setEditingInjectable(null)} />
                                    {injectables.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Tratamientos Inyectables Añadidos</h3>
                                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                {injectables.map((ins) => (
                                                    <li key={ins.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                                        <div>
                                                            <p className="font-bold text-teal-600 flex items-center gap-1">
                                                                {ins.isNewMedication && <StarIcon className="inline w-4 h-4 text-yellow-500" />}
                                                                {ins.doseIncreased && <ArrowUpIcon className="inline w-4 h-4" />}
                                                                {ins.doseDecreased && <ArrowDownIcon className="inline w-4 h-4" />}
                                                                {ins.requiresPurchase && <MoneyIcon className="inline w-4 h-4 text-green-600" />}
                                                                {ins.type}
                                                            </p>
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
                                </>
                            )}
                            {activeTab === 'inhaled' && (
                                <>
                                    <InhalerForm onAddInhaler={addInhaler} onUpdateInhaler={updateInhaler} editingInhaler={editingInhaler} onCancelEdit={() => setEditingInhaler(null)} />
                                    {inhalers.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Inhaladores Añadidos</h3>
                                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                                {inhalers.map((inh) => (
                                                    <li key={inh.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                                        <div>
                                                            <p className="font-bold text-purple-600 flex items-center gap-1">
                                                                {inh.isNewMedication && <StarIcon className="inline w-4 h-4 text-yellow-500" />}
                                                                {inh.doseIncreased && <ArrowUpIcon className="inline w-4 h-4" />}
                                                                {inh.doseDecreased && <ArrowDownIcon className="inline w-4 h-4" />}
                                                                {inh.requiresPurchase && <MoneyIcon className="inline w-4 h-4 text-green-600" />}
                                                                {inh.name} <span className="text-slate-600 font-normal">{inh.presentacion}</span>
                                                            </p>
                                                            <p className="text-sm text-slate-500">{`${inh.dose} puff(s) - cada ${inh.frequencyHours} h`}</p>
                                                            {inh.notes && <p className="text-xs text-slate-500 italic mt-1">Nota: {inh.notes}</p>}
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button
                                                                onClick={() => setEditingInhaler(inh)}
                                                                className="p-2 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
                                                                aria-label="Editar inhalador"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L7.5 21.036H3v-4.5L16.732 3.732z" /></svg>
                                                            </button>
                                                            <button
                                                                onClick={() => removeInhaler(inh.id)}
                                                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                                                aria-label="Eliminar inhalador"
                                                            >
                                                                <TrashIcon className="w-5 h-5" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    <SuspensionSection controlInfo={controlInfo} onChange={handleControlChange} />
                    <div className="space-y-2 pt-4 border-t border-slate-200">
                        <label htmlFor="professional" className="block text-sm font-medium text-slate-600 mb-1">Profesional</label>
                        <input
                            type="text"
                            id="professional"
                            name="professional"
                            value={controlInfo.professional}
                            onChange={(e) => handleControlChange('professional', e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <ControlInfoForm controlInfo={controlInfo} onChange={handleControlChange} />
                </div>

                {/* Preview Panel */}
                <div className="bg-slate-200 p-4 sm:p-6 rounded-xl shadow-inner flex items-start justify-center overflow-x-auto">
                   <div ref={previewRef} className="w-full">
                     <SchedulePreview
                       patient={patient}
                       medications={medications}
                       injectables={injectables}
                       inhalers={inhalers}
                       controlInfo={controlInfo}
                       showQr={showQr}
                       onEditMedication={(id) => {
                         const med = medications.find(m => m.id === id);
                         if (med) {
                           setActiveTab('oral');
                           setEditingMedication(med);
                         }
                       }}
                       onEditInjectable={(id) => {
                         const inj = injectables.find(i => i.id === id);
                         if (inj) {
                           setActiveTab('injectable');
                           setEditingInjectable(inj);
                         }
                       }}
                       onEditInhaler={(id) => {
                         const inh = inhalers.find(i => i.id === id);
                         if (inh) {
                           setActiveTab('inhaled');
                           setEditingInhaler(inh);
                         }
                       }}
                     />
                   </div>
                </div>
                </main>
            ) : (
                <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <GlycemiaLog />
                </main>
            )}
        </div>
    );
};

export default App;