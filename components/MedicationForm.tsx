
import React, { useState } from 'react';
import { Medication, Frequency, Dose, MedicationDescriptor } from '../types';
import MoneyIcon from './icons/MoneyIcon';
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import NewIcon from './icons/NewIcon';

interface MedicationFormProps {
    onAddMedication: (med: Omit<Medication, 'id'>) => void;
}

const initialMedState: Omit<Medication, 'id'> = {
    name: '',
    presentacion: '',
    dose: Dose.ONE,
    frequency: Frequency.EVERY_12H,
    notes: '',
    descriptors: [],
};

const MedicationForm: React.FC<MedicationFormProps> = ({ onAddMedication }) => {
    const [medication, setMedication] = useState(initialMedState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setMedication(prev => ({ ...prev, [name]: value }));
    };

    const toggleDescriptor = (desc: MedicationDescriptor) => {
        setMedication(prev => {
            const hasDesc = prev.descriptors.includes(desc);
            return {
                ...prev,
                descriptors: hasDesc
                    ? prev.descriptors.filter(d => d !== desc)
                    : [...prev.descriptors, desc],
            };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (medication.name && medication.presentacion) {
            onAddMedication(medication);
            setMedication(initialMedState);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">Añadir Medicamento</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                    <label htmlFor="medName" className="block text-sm font-medium text-slate-600 mb-1">Nombre del Medicamento</label>
                    <input
                        type="text"
                        id="medName"
                        name="name"
                        value={medication.name}
                        onChange={handleChange}
                        placeholder="Ej: Losartán"
                        className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="presentacion" className="block text-sm font-medium text-slate-600 mb-1">Presentación</label>
                    <input
                        type="text"
                        id="presentacion"
                        name="presentacion"
                        value={medication.presentacion}
                        onChange={handleChange}
                        placeholder="Ej: 50mg"
                        className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                    <label htmlFor="dose" className="block text-sm font-medium text-slate-600 mb-1">Dosis (comprimidos)</label>
                    <select
                        id="dose"
                        name="dose"
                        value={medication.dose}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        {Object.values(Dose).map(d => (
                            <option key={d} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="frequency" className="block text-sm font-medium text-slate-600 mb-1">Frecuencia</label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={medication.frequency}
                        onChange={handleChange}
                        className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        {Object.values(Frequency).map(freq => (
                            <option key={freq} value={freq}>{freq}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
                <label className="flex items-center text-sm text-slate-600">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={medication.descriptors.includes(MedicationDescriptor.BUY_OUTSIDE)}
                        onChange={() => toggleDescriptor(MedicationDescriptor.BUY_OUTSIDE)}
                    />
                    <MoneyIcon className="w-4 h-4 mr-1" /> Comprar afuera
                </label>
                <label className="flex items-center text-sm text-slate-600">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={medication.descriptors.includes(MedicationDescriptor.DOSE_INCREASE)}
                        onChange={() => toggleDescriptor(MedicationDescriptor.DOSE_INCREASE)}
                    />
                    <ArrowUpIcon className="w-4 h-4 mr-1" /> Aumento de dosis
                </label>
                <label className="flex items-center text-sm text-slate-600">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={medication.descriptors.includes(MedicationDescriptor.DOSE_DECREASE)}
                        onChange={() => toggleDescriptor(MedicationDescriptor.DOSE_DECREASE)}
                    />
                    <ArrowDownIcon className="w-4 h-4 mr-1" /> Disminución de dosis
                </label>
                <label className="flex items-center text-sm text-slate-600">
                    <input
                        type="checkbox"
                        className="mr-1"
                        checked={medication.descriptors.includes(MedicationDescriptor.NEW)}
                        onChange={() => toggleDescriptor(MedicationDescriptor.NEW)}
                    />
                    <NewIcon className="w-4 h-4 mr-1" /> Nuevo fármaco
                </label>
            </div>
            <div>
                <label htmlFor="notes" className="block text-sm font-medium text-slate-600 mb-1">Notas (Opcional)</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={medication.notes}
                    onChange={handleChange}
                    placeholder="Ej: Tomar con abundante agua"
                    rows={2}
                    className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Medicamento
            </button>
        </form>
    );
};

export default MedicationForm;