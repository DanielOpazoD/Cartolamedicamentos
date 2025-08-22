import React, { useState, useEffect } from 'react';
import { Patient, Medication, Frequency, Dose, Injectable, InjectableSchedule, InjectableType, ControlInfo, Inhaler } from '../types';
import DoseVisualizer from './DoseVisualizer';
import MoonIcon from './icons/MoonIcon';
import SunIcon from './icons/SunIcon';
import InjectableDoseVisualizer from './InjectableDoseVisualizer';
import StarIcon from './icons/StarIcon';
import MoneyIcon from "./icons/MoneyIcon";
import ArrowUpIcon from './icons/ArrowUpIcon';
import ArrowDownIcon from './icons/ArrowDownIcon';
import EditIcon from './icons/EditIcon';
import RedCrossIcon from './icons/RedCrossIcon';

interface SchedulePreviewProps {
    patient: Patient;
    medications: Medication[];
    injectables: Injectable[];
    inhalers: Inhaler[];
    controlInfo: ControlInfo;
    onEditMedication?: (id: number) => void;
    onEditInjectable?: (id: number) => void;
    onEditInhaler?: (id: number) => void;
}

const SchedulePreview: React.FC<SchedulePreviewProps> = ({ patient, medications, injectables, inhalers, controlInfo, onEditMedication, onEditInjectable, onEditInhaler }) => {

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

    const doseOrder: Dose[] = [
        Dose.QUARTER,
        Dose.HALF,
        Dose.THREE_QUARTERS,
        Dose.ONE,
        Dose.ONE_AND_QUARTER,
        Dose.ONE_AND_HALF,
        Dose.ONE_AND_THREE_QUARTERS,
        Dose.TWO,
        Dose.THREE,
        Dose.FOUR,
    ];

    const initializeDoses = (meds: Medication[]) => {
        const map: Record<number, { morning: Dose | null; afternoon: Dose | null; night: Dose | null }> = {};
        meds.forEach(med => {
            map[med.id] = {
                morning: shouldShowDose(med.frequency, 'morning') ? med.dose : null,
                afternoon: shouldShowDose(med.frequency, 'afternoon') ? med.dose : null,
                night: shouldShowDose(med.frequency, 'night') ? med.dose : null,
            };
        });
        return map;
    };

    const [editableDoses, setEditableDoses] = useState<Record<number, { morning: Dose | null; afternoon: Dose | null; night: Dose | null }>>(() => initializeDoses(medications));

    useEffect(() => {
        setEditableDoses(initializeDoses(medications));
    }, [medications]);

    const cycleDose = (current: Dose | null): Dose | null => {
        if (current === null) return doseOrder[0];
        const idx = doseOrder.indexOf(current);
        return idx === -1 || idx === doseOrder.length - 1 ? null : doseOrder[idx + 1];
    };

    const handleDoseClick = (medId: number, time: 'morning' | 'afternoon' | 'night') => {
        setEditableDoses(prev => {
            const next = cycleDose(prev[medId][time]);
            return { ...prev, [medId]: { ...prev[medId], [time]: next } };
        });
    };

    const groupedInjectables = injectables.reduce((acc, inj) => {
        const existing = acc.get(inj.type);
        if (existing) {
            if (inj.schedule === InjectableSchedule.MAÑANA) {
                existing.mañana.push(inj);
            } else {
                existing.noche.push(inj);
            }
            existing.isNewMedication ||= inj.isNewMedication;
            existing.doseIncreased ||= inj.doseIncreased;
            existing.doseDecreased ||= inj.doseDecreased;
            existing.requiresPurchase ||= inj.requiresPurchase;
        } else {
            acc.set(inj.type, {
                mañana: inj.schedule === InjectableSchedule.MAÑANA ? [inj] : [],
                noche: inj.schedule === InjectableSchedule.NOCHE ? [inj] : [],
                isNewMedication: inj.isNewMedication || false,
                doseIncreased: inj.doseIncreased || false,
                doseDecreased: inj.doseDecreased || false,
                requiresPurchase: inj.requiresPurchase || false,
            });
        }
        return acc;
    }, new Map<InjectableType, { mañana: Injectable[], noche: Injectable[], isNewMedication: boolean, doseIncreased: boolean, doseDecreased: boolean, requiresPurchase: boolean }>());

    const medicationItems = medications.map(med => ({ ...med, itemType: 'medication' as const }));

    const inhalerItems = inhalers.map(inh => ({ ...inh, itemType: 'inhaler' as const }));

    const injectableItems = Array.from(groupedInjectables.entries()).map(([type, data]) => ({
        id: type,
        editId: data.mañana[0]?.id ?? data.noche[0]?.id,
        itemType: 'injectable' as const,
        type,
        schedules: { mañana: data.mañana, noche: data.noche },
        isNewMedication: data.isNewMedication,
        doseIncreased: data.doseIncreased,
        doseDecreased: data.doseDecreased,
        requiresPurchase: data.requiresPurchase,
    }));

    const allItems = [...medicationItems, ...inhalerItems, ...injectableItems];

    const formattedControlDate = controlInfo.date ? new Date(`${controlInfo.date}T${controlInfo.time || '00:00'}`).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }) : '';

    return (
        <div id="schedule-preview" className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
            <header className="text-center mb-8 border-b-2 pb-4 border-slate-200">
                <h1 className="text-2xl font-extrabold text-blue-700">Cartola de Medicamentos</h1>
            </header>
            
            <section className="mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-50 p-3 rounded">
                    <span className="font-bold text-slate-600">Nombre y Apellido:</span>
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

            <section className="mb-4 text-xs text-slate-600">
                <p className="font-semibold mb-1">Iconos:</p>
                <ul className="flex flex-wrap gap-4">
                    <li className="flex items-center gap-1"><ArrowUpIcon className="w-4 h-4"/> Aumento de dosis</li>
                    <li className="flex items-center gap-1"><ArrowDownIcon className="w-4 h-4"/> Disminución de dosis</li>
                    <li className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-500"/> Nuevo medicamento</li>
                    <li className="flex items-center gap-1"><MoneyIcon className="w-4 h-4 text-green-600"/> Comprar afuera</li>
                </ul>
            </section>

            <section>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-blue-600 text-white">
                                <th className="p-2 text-center font-semibold text-sm w-12">#</th>
                                <th className="p-2 text-left font-semibold text-sm w-1/3">Medicamento / Presentación</th>
                                <th className="p-2 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                        <SunIcon className="w-5 h-5" />
                                        <span>Mañana</span>
                                    </div>
                                </th>
                                <th className="p-2 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                        <SunIcon className="w-5 h-5" />
                                        <span>Tarde</span>
                                    </div>
                                </th>
                                <th className="p-2 text-center font-semibold text-sm w-1/6">
                                    <div className="flex flex-col items-center justify-center gap-0.5">
                                        <MoonIcon className="w-5 h-5" />
                                        <span>Noche</span>
                                    </div>
                                </th>
                                <th className="p-2 text-left font-semibold text-sm w-1/6">Notas</th>
                            </tr>
                        </thead>
                        <tbody contentEditable suppressContentEditableWarning>
                            {allItems.length > 0 ? allItems.map((item, index) => {
                                if (item.itemType === 'medication') {
                                    return (
                                        <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <td className="p-2 text-center align-top">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span>{index + 1}</span>
                                                    {onEditMedication && (
                                                        <button
                                                            onClick={() => onEditMedication(item.id)}
                                                            className="text-blue-500 hover:text-blue-700 print:hidden"
                                                            contentEditable={false}
                                                            aria-label="Editar medicamento"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 align-top text-center">
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1">
                                                    {item.isNewMedication && (
                                                        <span contentEditable={false}>
                                                            <StarIcon className="inline w-4 h-4 text-yellow-500" />
                                                        </span>
                                                    )}
                                                    {item.doseIncreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowUpIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.doseDecreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowDownIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.requiresPurchase && (
                                                        <span contentEditable={false}>
                                                            <MoneyIcon className="inline w-4 h-4 text-green-600" />
                                                        </span>
                                                    )}
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-slate-600">{item.presentacion}</p>
                                                <p className="text-xs text-slate-500 italic">{`${item.dose} comp. - ${item.frequency}`}</p>
                                            </td>
                                            <td className="p-2 text-center align-middle cursor-pointer" contentEditable={false} onClick={() => handleDoseClick(item.id, 'morning')}>
                                                {editableDoses[item.id]?.morning && <DoseVisualizer dose={editableDoses[item.id].morning} className="text-blue-600" />}
                                            </td>
                                            <td className="p-2 text-center align-middle cursor-pointer" contentEditable={false} onClick={() => handleDoseClick(item.id, 'afternoon')}>
                                                {editableDoses[item.id]?.afternoon && <DoseVisualizer dose={editableDoses[item.id].afternoon} className="text-amber-500" />}
                                            </td>
                                            <td className="p-2 text-center align-middle cursor-pointer" contentEditable={false} onClick={() => handleDoseClick(item.id, 'night')}>
                                                {editableDoses[item.id]?.night && <DoseVisualizer dose={editableDoses[item.id].night} className="text-blue-600" />}
                                            </td>
                                            <td className="p-2 align-top text-sm text-slate-700 whitespace-pre-wrap break-words">
                                                {item.notes || ''}
                                            </td>
                                        </tr>
                                    );
                                } else if (item.itemType === 'inhaler') {
                                    const showMorning = item.frequencyHours === 8 || item.frequencyHours === 12;
                                    const showAfternoon = item.frequencyHours === 8;
                                    const showNight = item.frequencyHours === 8 || item.frequencyHours === 12;
                                    return (
                                        <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <td className="p-2 text-center align-top">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span>{index + 1}</span>
                                                    {onEditInhaler && (
                                                        <button
                                                            onClick={() => onEditInhaler(item.id)}
                                                            className="text-blue-500 hover:text-blue-700 print:hidden"
                                                            contentEditable={false}
                                                            aria-label="Editar inhalador"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 align-top text-center">
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1">
                                                    {item.isNewMedication && (
                                                        <span contentEditable={false}>
                                                            <StarIcon className="inline w-4 h-4 text-yellow-500" />
                                                        </span>
                                                    )}
                                                    {item.doseIncreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowUpIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.doseDecreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowDownIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.requiresPurchase && (
                                                        <span contentEditable={false}>
                                                            <MoneyIcon className="inline w-4 h-4 text-green-600" />
                                                        </span>
                                                    )}
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-slate-600">{item.presentacion}</p>
                                                <p className="text-xs text-slate-500 italic">{`${item.dose} puff - cada ${item.frequencyHours} h`}</p>
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                {showMorning && <span className="font-bold">{`${item.dose} puff`}</span>}
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                {showAfternoon && <span className="font-bold">{`${item.dose} puff`}</span>}
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                {showNight && <span className="font-bold">{`${item.dose} puff`}</span>}
                                            </td>
                                            <td className="p-2 align-top text-sm text-slate-700 whitespace-pre-wrap break-words">
                                                {item.notes || ''}
                                            </td>
                                        </tr>
                                    );
                                } else { // item.itemType === 'injectable'
                                    const allNotes = [...item.schedules.mañana, ...item.schedules.noche]
                                        .map(ins => ins.notes)
                                        .filter(Boolean)
                                        .join('\n');
                                    return (
                                        <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}`}>
                                            <td className="p-2 text-center align-top">
                                                <div className="flex items-center justify-center gap-1">
                                                    <span>{index + 1}</span>
                                                    {onEditInjectable && item.editId != null && (
                                                        <button
                                                            onClick={() => onEditInjectable(item.editId!)}
                                                            className="text-blue-500 hover:text-blue-700 print:hidden"
                                                            contentEditable={false}
                                                            aria-label="Editar inyectable"
                                                        >
                                                            <EditIcon className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-2 align-top text-center">
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1">
                                                    {item.isNewMedication && (
                                                        <span contentEditable={false}>
                                                            <StarIcon className="inline w-4 h-4 text-yellow-500" />
                                                        </span>
                                                    )}
                                                    {item.doseIncreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowUpIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.doseDecreased && (
                                                        <span contentEditable={false}>
                                                            <ArrowDownIcon className="inline w-4 h-4" />
                                                        </span>
                                                    )}
                                                    {item.requiresPurchase && (
                                                        <span contentEditable={false}>
                                                            <MoneyIcon className="inline w-4 h-4 text-green-600" />
                                                        </span>
                                                    )}
                                                    {item.type}
                                                </p>
                                                <p className="text-sm text-teal-600">Inyectable</p>
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                <div className="flex flex-col items-center gap-2">
                                                    {item.schedules.mañana.map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={ins.time} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                {/* typically not used in the afternoon */}
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                 <div className="flex flex-col items-center gap-2">
                                                    {item.schedules.noche.map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={ins.time} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-2 align-top text-sm text-slate-700 whitespace-pre-wrap break-words">
                                                {allNotes}
                                            </td>
                                        </tr>
                                    );
                                }
                            }) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-4 text-slate-500">
                                        <p>Añada un medicamento, inhalador o tratamiento inyectable para verlo aquí.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {controlInfo.suspendEnabled && controlInfo.suspendText && (
                <section className="mb-8">
                    <h3 className="text-base font-bold text-black mb-2 text-center flex items-center justify-center gap-1">
                        <RedCrossIcon className="w-4 h-4 text-red-600" />
                        Suspender los siguientes medicamentos
                    </h3>
                    <div className="p-3 border border-black rounded text-black text-sm whitespace-pre-wrap">{controlInfo.suspendText}</div>
                </section>
            )}

             {controlInfo.applies === 'yes' && controlInfo.date && (
                <section className="mt-6 pt-4 border-t border-slate-200 text-xs">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 text-center">Próximo Control Médico</h3>
                    <div className="bg-slate-50 rounded-lg p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <p className="font-semibold text-slate-600">Fecha y hora:</p>
                            <p className="font-bold text-blue-700">{formattedControlDate}</p>
                        </div>
                        <div>
                            <p className="font-semibold text-slate-600">Profesional:</p>
                            <p className="text-slate-800">{controlInfo.professional || 'No especificado'}</p>
                        </div>
                        {controlInfo.withExams !== 'unspecified' && (
                            <div className="md:col-span-2">
                                <p className="font-semibold text-slate-600">Exámenes:</p>
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
                        )}
                        {controlInfo.note && (
                            <div className="md:col-span-2">
                                <p className="font-semibold text-slate-600">Nota:</p>
                                <p className="text-slate-700 whitespace-pre-wrap">{controlInfo.note}</p>
                            </div>
                        )}
                    </div>
                </section>
            )}

            <section className="mt-12 pt-6 text-center">
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center">
                        <div className="w-4/5 h-12 border-b-2 border-slate-400"></div>
                        <p className="mt-2 text-sm font-semibold text-slate-600">{controlInfo.professional || 'Nombre Profesional'}</p>
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