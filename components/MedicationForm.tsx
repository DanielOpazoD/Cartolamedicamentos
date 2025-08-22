
import React, { useState, useEffect } from 'react';
import { Medication, Frequency, Dose } from '../types';
import PlusIcon from './icons/PlusIcon';

interface MedicationFormProps {
    onAddMedication: (med: Omit<Medication, 'id'>) => void;
    onUpdateMedication?: (id: number, med: Omit<Medication, 'id'>) => void;
    editingMedication?: Medication | null;
    onCancelEdit?: () => void;
}

const initialMedState: Omit<Medication, 'id'> = {
    name: '',
    presentacion: '',
    dose: Dose.ONE,
    frequency: Frequency.EVERY_12H,
    notes: '',
    requiresPurchase: false,
};

const MedicationForm: React.FC<MedicationFormProps> = ({ onAddMedication, onUpdateMedication, editingMedication, onCancelEdit }) => {
    const [medication, setMedication] = useState(initialMedState);

    useEffect(() => {
        if (editingMedication) {
            const { id, ...rest } = editingMedication;
            setMedication(rest);
        } else {
            setMedication(initialMedState);
        }
    }, [editingMedication]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type } = e.target;
        const value = type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setMedication(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (medication.name && medication.presentacion) {
            if (editingMedication) {
                onUpdateMedication && onUpdateMedication(editingMedication.id, medication);
                onCancelEdit && onCancelEdit();
            } else {
                onAddMedication(medication);
            }
            setMedication(initialMedState);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2 pt-2 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                {editingMedication ? 'Editar Medicamento' : 'Añadir Medicamento'}
            </h2>
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
            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="requiresPurchase"
                    name="requiresPurchase"
                    checked={medication.requiresPurchase}
                    onChange={handleChange}
                    className="mr-2"
                />
                <label htmlFor="requiresPurchase" className="text-sm text-slate-600">Paciente compra este medicamento</label>
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
            <div className="flex gap-2">
                <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
                >
                    <PlusIcon className="h-5 w-5" />
                    {editingMedication ? 'Actualizar Medicamento' : 'Añadir Medicamento'}
                </button>
                {editingMedication && (
                    <button
                        type="button"
                        onClick={onCancelEdit}
                        className="px-3 py-1 rounded-lg border border-slate-300 text-slate-600"
                    >
                        Cancelar
                    </button>
                )}
            </div>
        </form>
    );
};

export default MedicationForm;