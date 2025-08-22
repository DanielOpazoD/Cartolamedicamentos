
import React, { useState, useRef, useCallback } from 'react';
import { Patient, Medication, Injectable, ControlInfo, ExamOptions } from './types';
import PatientInfoForm from './components/PatientInfoForm';
import MedicationForm from './components/MedicationForm';
import InjectableForm from './components/InjectableForm';
import SchedulePreview from './components/SchedulePreview';
import TrashIcon from './components/icons/TrashIcon';
import ControlInfoForm from './components/ControlInfoForm';

// Declare jsPDF and html2canvas to be available in the global scope from the CDN
declare const jspdf: any;
declare const html2canvas: any;

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
    note: ''
};

const App: React.FC = () => {
    const today = new Date().toISOString().split('T')[0];
    const [patient, setPatient] = useState<Patient>({ name: '', rut: '', date: today });
    const [medications, setMedications] = useState<Medication[]>([]);
    const [injectables, setInjectables] = useState<Injectable[]>([]);
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

    const addInjectable = useCallback((inj: Omit<Injectable, 'id'>) => {
        setInjectables(prev => [...prev, { ...inj, id: Date.now() }]);
    }, []);

    const removeInjectable = useCallback((id: number) => {
        setInjectables(prev => prev.filter(ins => ins.id !== id));
    }, []);

    const handleControlChange = useCallback((field: keyof ControlInfo, value: string | boolean | ExamOptions) => {
        setControlInfo(prev => ({...prev, [field]: value}));
    }, []);

    const handleExportPDF = () => {
        const input = previewRef.current;
        if (!input) {
            console.error("Preview element not found");
            return;
        }

        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
            orientation: 'p',
            unit: 'px',
            format: 'a4',
            putOnlyUsedFonts:true,
            floatPrecision: 16
        });

        // Temporarily change width to a fixed one for consistent PDF output
        const originalWidth = input.style.width;
        input.style.width = '700px';

        html2canvas(input, {
             scale: 2, // Higher scale for better quality
             useCORS: true 
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            
            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            const imgProps= pdf.getImageProperties(imgData);
            const imgWidth = pdfWidth;
            const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
            
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            
            // Restore original width
            input.style.width = originalWidth;

            pdf.save(`cartola_${patient.name.replace(/\s/g, '_') || 'paciente'}.pdf`);
        }).catch(err => {
            console.error("Error generating PDF:", err);
            // Restore original width on error
            input.style.width = originalWidth;
        });
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
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            Exportar Lista
                        </button>
                        <button
                            onClick={handleImportClick}
                            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
                        >
                            Importar Lista
                        </button>
                        <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImportList} />
                        <button
                            onClick={handleExportPDF}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center gap-2"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                            Exportar a PDF
                        </button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Control Panel */}
                <div className="bg-white p-6 rounded-xl shadow-lg space-y-8">
                    <PatientInfoForm patient={patient} onChange={handlePatientChange} />
                    <MedicationForm onAddMedication={addMedication} />
                    <InjectableForm onAddInjectable={addInjectable} />
                    <ControlInfoForm controlInfo={controlInfo} onChange={handleControlChange} />
                    
                    {medications.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-slate-700 border-b pb-2">Medicamentos Añadidos</h3>
                            <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
                                {medications.map((med) => (
                                    <li key={med.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-lg shadow-sm">
                                        <div>
                                            <p className="font-bold text-blue-600">{med.name} <span className="text-slate-600 font-normal">{med.presentacion}</span></p>
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
                                        <button
                                            onClick={() => removeInjectable(ins.id)}
                                            className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                                            aria-label="Eliminar inyectable"
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
                     <SchedulePreview patient={patient} medications={medications} injectables={injectables} controlInfo={controlInfo} />
                   </div>
                </div>
            </main>
        </div>
    );
};

export default App;