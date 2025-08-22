import React from 'react';
import { Patient, Medication, Frequency, Insulin, InsulinSchedule, InsulinType, ControlInfo } from '../types';
import DoseVisualizer from './DoseVisualizer';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';
import InsulinDoseVisualizer from './InsulinDoseVisualizer';
import MoneyIcon from './icons/MoneyIcon';

interface SchedulePreviewProps {
    patient: Patient;
    medications: Medication[];
    insulins: Insulin[];
    controlInfo: ControlInfo;
}

const SchedulePreview: React.FC<SchedulePreviewProps> = ({ patient, medications, insulins, controlInfo }) => {
    
    const shouldShowDose = (freq: Frequency, time: 'morning' | 'afternoon' | 'night'): boolean => {
        switch (time) {
            case 'morning':
                return [Frequency.EVERY_24H, Frequency.EVERY_12H, Frequency.EVERY_8H, Frequency.MORNING, Frequency.WITH_MEALS].includes(freq);
            case 'afternoon':
                return [Frequency.EVERY_8H, Frequency.AFTERNOON, Frequency.WITH_MEALS].includes(freq);
            case 'night':
                return [Frequency.EVERY_24H_NIGHT, Frequency.EVERY_12H, Frequency.EVERY_8H, Frequency.NIGHT, Frequency.WITH_MEALS].includes(freq);
            default:
                return false;
        }
    };

    const groupedInsulins = insulins.reduce((acc, insulin) => {
        const existing = acc.get(insulin.type);
        if (existing) {
            if (insulin.schedule === InsulinSchedule.MAÑANA) {
                existing.mañana.push(insulin);
            } else {
                existing.noche.push(insulin);
            }
        } else {
            acc.set(insulin.type, {
                mañana: insulin.schedule === InsulinSchedule.MAÑANA ? [insulin] : [],
                noche: insulin.schedule === InsulinSchedule.NOCHE ? [insulin] : [],
            });
        }
        return acc;
    }, new Map<InsulinType, { mañana: Insulin[], noche: Insulin[] }>());

    const medicationItems = medications.map(med => ({ ...med, itemType: 'medication' as const }));
    
    const insulinItems = Array.from(groupedInsulins.entries()).map(([type, schedules]) => ({
        id: type, // Use type as a stable key
        itemType: 'insulin' as const,
        type,
        schedules,
    }));
    
    const allItems = [...medicationItems, ...insulinItems];

    const getMonthName = (monthNumber: number) => {
        const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return months[monthNumber];
    };
    
    const formattedControlDate = controlInfo.date ? `${getMonthName(new Date(controlInfo.date + '-02').getMonth())} / ${new Date(controlInfo.date + '-02').getFullYear()}` : '';

    return (
        <div id="schedule-preview" className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
            <header className="text-center mb-8 border-b-2 pb-4 border-slate-200">
                <h1 className="text-3xl font-extrabold text-blue-700">Cartola de Medicamentos</h1>
            </header>
            
            <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded">
                    <span className="font-bold text-slate-600">Paciente:</span>
                    <span className="ml-2 text-slate-800">{patient.name || '...'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                    <span className="font-bold text-slate-600">RUT:</span>
                    <span className="ml-2 text-slate-800">{patient.rut || '...'}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded">
                    <span className="font-bold text-slate-600">Fecha:</span>
                    <span className="ml-2 text-slate-800">{patient.date ? new Date(patient.date + 'T00:00:00').toLocaleDateString('es-CL') : '...'}</span>
                </div>
            </section>

            <section>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-3 text-left font-semibold text-sm w-1/3">Medicamento / Presentación</th>
                                <th className="p-3 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <SunIcon className="w-6 h-6" />
                                        <span>Mañana</span>
                                    </div>
                                </th>
                                <th className="p-3 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <span>Tarde</span>
                                    </div>
                                </th>
                                <th className="p-3 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <MoonIcon className="w-6 h-6" />
                                        <span>Noche</span>
                                    </div>
                                </th>
                                <th className="p-3 text-left font-semibold text-sm w-1/6">Notas</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allItems.length > 0 ? allItems.map((item, index) => {
                                if (item.itemType === 'medication') {
                                    return (
                                        <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <td className="p-4 align-top" contentEditable suppressContentEditableWarning>
                                                <p className="font-bold text-md text-slate-800">{item.externalPurchase && <MoneyIcon className="inline mr-1" />}{item.name}</p>
                                                <p className="text-sm text-slate-600">{item.presentacion}</p>
                                                <p className="text-xs text-slate-500 italic">{`${item.dose} comp. - ${item.frequency}`}</p>
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                {shouldShowDose(item.frequency, 'morning') && <DoseVisualizer dose={item.dose} className="text-blue-600" />}
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                {shouldShowDose(item.frequency, 'afternoon') && <DoseVisualizer dose={item.dose} className="text-amber-500" />}
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                {shouldShowDose(item.frequency, 'night') && <DoseVisualizer dose={item.dose} className="text-blue-600" />}
                                            </td>
                                            <td className="p-4 align-top text-sm text-slate-700 whitespace-pre-wrap break-words" contentEditable suppressContentEditableWarning>
                                                {item.notes || ''}
                                            </td>
                                        </tr>
                                    );
                                } else { // item.itemType === 'insulin'
                                    const allNotes = [...item.schedules.mañana, ...item.schedules.noche]
                                        .map(ins => ins.notes)
                                        .filter(Boolean)
                                        .join('\n');
                                    return (
                                        <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <td className="p-4 align-top" contentEditable suppressContentEditableWarning>
                                                <p className="font-bold text-md text-slate-800">{item.type}</p>
                                                <p className="text-sm text-teal-600">Insulina</p>
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                <div className="flex flex-col items-center gap-2">
                                                    {item.schedules.mañana.map(ins => (
                                                        <InsulinDoseVisualizer key={ins.id} dose={ins.dose} time={ins.time} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                {/* Insulin typically not in the afternoon */}
                                            </td>
                                            <td className="p-4 text-center align-middle" contentEditable suppressContentEditableWarning>
                                                 <div className="flex flex-col items-center gap-2">
                                                    {item.schedules.noche.map(ins => (
                                                        <InsulinDoseVisualizer key={ins.id} dose={ins.dose} time={ins.time} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-4 align-top text-sm text-slate-700 whitespace-pre-wrap break-words" contentEditable suppressContentEditableWarning>
                                                {allNotes}
                                            </td>
                                        </tr>
                                    );
                                }
                            }) : (
                                <tr>
                                    <td colSpan={5} className="text-center p-8 text-slate-500">
                                        <p>Añada un medicamento o insulina para verlo aquí.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

             {controlInfo.applies === 'yes' && controlInfo.date && (
                <section className="mt-10 pt-6 border-t-2 border-slate-200 text-sm">
                    <h3 className="text-xl font-bold text-slate-800 mb-4 text-center">Próximo Control Médico</h3>
                    <div className="bg-slate-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-semibold text-slate-600">Fecha de Control:</p>
                            <p className="text-lg font-bold text-blue-700">{formattedControlDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600">Exámenes:</p>
                            {controlInfo.withExams === 'unspecified' && <p className="text-slate-500">No especificado</p>}
                            {controlInfo.withExams === 'no' && <p className="text-slate-500">Sin exámenes solicitados</p>}
                            {controlInfo.withExams === 'yes' && (
                                <ul className="list-disc list-inside text-slate-800">
                                    {controlInfo.exams.sangre && <li>Sangre</li>}
                                    {controlInfo.exams.orina && <li>Orina</li>}
                                    {controlInfo.exams.ecg && <li>ECG</li>}
                                    {controlInfo.exams.endoscopia && <li>Endoscopía digestiva alta</li>}
                                    {controlInfo.exams.colonoscopia && <li>Colonoscopía</li>}
                                    {controlInfo.exams.otros && <li>{controlInfo.otrosText || 'Otros'}</li>}
                                </ul>
                            )}
                        </div>
                    </div>
                </section>
            )}

            <section className="mt-16 pt-8 text-center">
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col items-center">
                        <div className="w-4/5 h-12 border-b-2 border-slate-400"></div>
                        <p className="mt-2 text-sm font-semibold text-slate-600">Nombre Profesional</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="w-4/5 h-12 border-b-2 border-slate-400"></div>
                        <p className="mt-2 text-sm font-semibold text-slate-600">Firma</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default SchedulePreview;