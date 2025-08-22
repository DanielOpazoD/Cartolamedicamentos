import React, { useState } from 'react';
import { Insulin, InsulinType, InsulinSchedule } from '../types';

interface InsulinFormProps {
    onAddInsulin: (insulin: Omit<Insulin, 'id'>) => void;
}

const initialInsulinState = {
    type: InsulinType.NPH,
    dose: 0,
    schedule: InsulinSchedule.MAÑANA,
    time: '08:00',
    notes: '',
};

const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});


const InsulinForm: React.FC<InsulinFormProps> = ({ onAddInsulin }) => {
    const [insulin, setInsulin] = useState(initialInsulinState);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const isNumberInput = e.target.type === 'number';
        setInsulin(prev => ({ 
            ...prev, 
            [name]: isNumberInput && value !== '' ? parseInt(value, 10) : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (insulin.dose > 0) {
            onAddInsulin(insulin);
            setInsulin(initialInsulinState);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">Añadir Insulina</h2>
            
            <div>
                <label htmlFor="insulinType" className="block text-sm font-medium text-slate-600 mb-1">Tipo de Insulina</label>
                <select
                    id="insulinType"
                    name="type"
                    value={insulin.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    {Object.values(InsulinType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="insulinDose" className="block text-sm font-medium text-slate-600 mb-1">Dosis (Unidades)</label>
                    <input
                        type="number"
                        id="insulinDose"
                        name="dose"
                        value={insulin.dose === 0 ? '' : insulin.dose}
                        onChange={handleChange}
                        min="0"
                        placeholder="Ej: 10"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-slate-600 mb-1">Horario</label>
                    <select
                        id="schedule"
                        name="schedule"
                        value={insulin.schedule}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        {Object.values(InsulinSchedule).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-600 mb-1">Indicar Hora</label>
                    <select
                        id="time"
                        name="time"
                        value={insulin.time}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                        required
                    >
                        {hourOptions.map(hour => (
                             <option key={hour} value={hour}>{hour}</option>
                        ))}
                    </select>
                </div>
            </div>
             <div>
                <label htmlFor="insulin_notes" className="block text-sm font-medium text-slate-600 mb-1">Notas (Opcional)</label>
                <textarea
                    id="insulin_notes"
                    name="notes"
                    value={insulin.notes}
                    onChange={handleChange}
                    placeholder="Ej: Medir glicemia antes de administrar"
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            
            <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Insulina
            </button>
        </form>
    );
};

export default InsulinForm;