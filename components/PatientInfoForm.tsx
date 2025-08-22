
import React from 'react';
import { Patient } from '../types';

interface PatientInfoFormProps {
    patient: Patient;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PatientInfoForm: React.FC<PatientInfoFormProps> = ({ patient, onChange }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">Datos del Paciente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Nombre y Apellido</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={patient.name}
                        onChange={onChange}
                        placeholder="Ej: Juan Pérez"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="rut" className="block text-sm font-medium text-slate-600 mb-1">RUT</label>
                    <input
                        type="text"
                        id="rut"
                        name="rut"
                        value={patient.rut}
                        onChange={onChange}
                        placeholder="Ej: 12.345.678-9"
                        className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
            <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-600 mb-1">Fecha de Emisión</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={patient.date}
                    onChange={onChange}
                    className="w-full sm:w-1/2 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
        </div>
    );
};

export default PatientInfoForm;
