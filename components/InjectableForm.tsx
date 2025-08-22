import React, { useState } from 'react';
import { Injectable, InjectableType, InjectableSchedule } from '../types';

interface InjectableFormProps {
    onAddInjectable: (inj: Omit<Injectable, 'id'>) => void;
}

const initialInjectableState: Omit<Injectable, 'id'> = {
    type: InjectableType.NPH,
    dose: '',
    schedule: InjectableSchedule.MAÑANA,
    time: '08:00',
    notes: '',
};

const hourOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});

const insulinTypes = [
    InjectableType.NPH,
    InjectableType.CRYSTALLINE,
    InjectableType.LANTUS,
    InjectableType.TRESIBA,
];

const InjectableForm: React.FC<InjectableFormProps> = ({ onAddInjectable }) => {
    const [injectable, setInjectable] = useState<Omit<Injectable, 'id'>>(initialInjectableState);
    const [customDose, setCustomDose] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInjectable(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let finalDose = injectable.dose;

        if (insulinTypes.includes(injectable.type)) {
            if (!injectable.dose) return;
            finalDose = `${injectable.dose} U`;
        } else if (injectable.type === InjectableType.SEMAGLUTIDE) {
            if (injectable.dose === 'other') {
                if (!customDose) return;
                finalDose = `${customDose} mg/sem`;
            } else {
                finalDose = injectable.dose;
            }
        } else if (injectable.type === InjectableType.LIRAGLUTIDE) {
            if (!injectable.dose) return;
        }

        onAddInjectable({ ...injectable, dose: finalDose });
        setInjectable(initialInjectableState);
        setCustomDose('');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">
                Añadir Tratamiento Inyectable (Insulinas, Agonistas GLP-1)
            </h2>

            <div>
                <label htmlFor="injectableType" className="block text-sm font-medium text-slate-600 mb-1">
                    Tipo de Tratamiento
                </label>
                <select
                    id="injectableType"
                    name="type"
                    value={injectable.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                    {Object.values(InjectableType).map(type => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
            </div>

            {insulinTypes.includes(injectable.type) && (
                <div>
                    <label htmlFor="injectableDose" className="block text-sm font-medium text-slate-600 mb-1">Dosis (Unidades)</label>
                    <input
                        type="number"
                        id="injectableDose"
                        name="dose"
                        value={injectable.dose}
                        onChange={handleChange}
                        min="0"
                        placeholder="Ej: 10"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
            )}

            {injectable.type === InjectableType.SEMAGLUTIDE && (
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Dosis (mg/sem)</label>
                    <select
                        name="dose"
                        value={injectable.dose}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="0.25 mg/sem">0.25 mg/sem</option>
                        <option value="0.5 mg/sem">0.5 mg/sem</option>
                        <option value="1 mg/sem">1 mg/sem</option>
                        <option value="2 mg/sem">2 mg/sem</option>
                        <option value="other">Otra dosis</option>
                    </select>
                    {injectable.dose === 'other' && (
                        <input
                            type="text"
                            className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ej: 1.5 mg/sem"
                            value={customDose}
                            onChange={e => setCustomDose(e.target.value)}
                        />
                    )}
                </div>
            )}

            {injectable.type === InjectableType.LIRAGLUTIDE && (
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Dosis (mg/día)</label>
                    <select
                        name="dose"
                        value={injectable.dose}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="0.6 mg/día">0.6 mg/día</option>
                        <option value="1.2 mg/día">1.2 mg/día</option>
                        <option value="1.8 mg/día">1.8 mg/día</option>
                    </select>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="schedule" className="block text-sm font-medium text-slate-600 mb-1">Horario</label>
                    <select
                        id="schedule"
                        name="schedule"
                        value={injectable.schedule}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        {Object.values(InjectableSchedule).map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-slate-600 mb-1">Indicar Hora</label>
                    <select
                        id="time"
                        name="time"
                        value={injectable.time}
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
                <label htmlFor="injectable_notes" className="block text-sm font-medium text-slate-600 mb-1">Notas (Opcional)</label>
                <textarea
                    id="injectable_notes"
                    name="notes"
                    value={injectable.notes}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Medir glicemia antes de administrar"
                />
            </div>

            <button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105 flex items-center justify-center gap-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Añadir Tratamiento
            </button>
        </form>
    );
};

export default InjectableForm;
