import React, { useState, useEffect } from 'react';
import { Patient, Medication, Frequency, Dose, DosageForm, Injectable, InjectableSchedule, ControlInfo, Inhaler } from '../types';
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
import SyringeIcon from './icons/SyringeIcon';
import { LOGICAL_LABELS, getInjectableLogicalKey, getInhalerLogicalKey, getMedicationLogicalKey } from '../utils/orderUtils';

interface SchedulePreviewProps {
    patient: Patient;
    medications: Medication[];
    injectables: Injectable[];
    inhalers: Inhaler[];
    controlInfo: ControlInfo;
    showQr: boolean;
    onEditMedication?: (id: number) => void;
    onEditInjectable?: (id: number) => void;
    onEditInhaler?: (id: number) => void;
}

const SchedulePreview: React.FC<SchedulePreviewProps> = ({ patient, medications, injectables, inhalers, controlInfo, showQr, onEditMedication, onEditInjectable, onEditInhaler }) => {

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

    const doseOrder: string[] = Object.values(Dose);

    const initializeDoses = (meds: Medication[]) => {
        const map: Record<number, { morning: string | null; afternoon: string | null; night: string | null }> = {};
        meds.forEach(med => {
            map[med.id] = {
                morning: shouldShowDose(med.frequency, 'morning') ? med.dose : null,
                afternoon: shouldShowDose(med.frequency, 'afternoon') ? med.dose : null,
                night: shouldShowDose(med.frequency, 'night') ? med.dose : null,
            };
        });
        return map;
    };

    const [editableDoses, setEditableDoses] = useState<Record<number, { morning: string | null; afternoon: string | null; night: string | null }>>(() => initializeDoses(medications));

    useEffect(() => {
        setEditableDoses(initializeDoses(medications));
    }, [medications]);

    const cycleDose = (current: string | null): string | null => {
        if (current === null) return doseOrder[0];
        const idx = doseOrder.indexOf(current);
        return idx === -1 || idx === doseOrder.length - 1 ? null : doseOrder[idx + 1];
    };

    const handleDoseClick = (medId: number, time: 'morning' | 'afternoon' | 'night') => {
        const med = medications.find(m => m.id === medId);
        if (!med || (med.dosageForm !== DosageForm.TABLET && med.dosageForm !== DosageForm.NONE)) return;
        setEditableDoses(prev => {
            const next = cycleDose(prev[medId][time]);
            return { ...prev, [medId]: { ...prev[medId], [time]: next } };
        });
    };

    const handleDoseInputChange = (medId: number, time: 'morning' | 'afternoon' | 'night', value: string) => {
        setEditableDoses(prev => ({ ...prev, [medId]: { ...prev[medId], [time]: value } }));
    };

    const groupedInjectables = injectables.reduce((acc, inj) => {
        const existing = acc.get(inj.type);
        const addToSchedule = (obj: { mañana: Injectable[]; noche: Injectable[]; ad: Injectable[]; aa: Injectable[]; ao: Injectable[]; ac: Injectable[] }) => {
            if (inj.schedule === InjectableSchedule.MAÑANA) obj.mañana.push(inj);
            else if (inj.schedule === InjectableSchedule.NOCHE) obj.noche.push(inj);
            else if (inj.schedule === InjectableSchedule.AD) obj.ad.push(inj);
            else if (inj.schedule === InjectableSchedule.AA) obj.aa.push(inj);
            else if (inj.schedule === InjectableSchedule.AO) obj.ao.push(inj);
            else if (inj.schedule === InjectableSchedule.AC) obj.ac.push(inj);
        };
        if (existing) {
            addToSchedule(existing);
            existing.isNewMedication ||= inj.isNewMedication;
            existing.doseIncreased ||= inj.doseIncreased;
            existing.doseDecreased ||= inj.doseDecreased;
            existing.requiresPurchase ||= inj.requiresPurchase;
        } else {
            const data = {
                mañana: [],
                noche: [],
                ad: [],
                aa: [],
                ao: [],
                ac: [],
                isNewMedication: inj.isNewMedication || false,
                doseIncreased: inj.doseIncreased || false,
                doseDecreased: inj.doseDecreased || false,
                requiresPurchase: inj.requiresPurchase || false,
                logicalKey: getInjectableLogicalKey(inj),
            };
            addToSchedule(data);
            acc.set(inj.type, data);
        }
        return acc;
    }, new Map<string, { mañana: Injectable[]; noche: Injectable[]; ad: Injectable[]; aa: Injectable[]; ao: Injectable[]; ac: Injectable[]; isNewMedication: boolean; doseIncreased: boolean; doseDecreased: boolean; requiresPurchase: boolean; logicalKey: ReturnType<typeof getInjectableLogicalKey> }>());

    const medicationItems = medications.map(med => ({ ...med, itemType: 'medication' as const, logicalKey: getMedicationLogicalKey(med) }));

    const inhalerItems = inhalers.map(inh => ({ ...inh, itemType: 'inhaler' as const, logicalKey: getInhalerLogicalKey() }));

    const injectableItems = Array.from(groupedInjectables.entries()).map(([type, data]) => ({
        id: type,
        editId: data.mañana[0]?.id ?? data.noche[0]?.id ?? data.ad[0]?.id ?? data.aa[0]?.id ?? data.ao[0]?.id ?? data.ac[0]?.id,
        itemType: 'injectable' as const,
        type,
        schedules: { mañana: data.mañana, noche: data.noche, ad: data.ad, aa: data.aa, ao: data.ao, ac: data.ac },
        isNewMedication: data.isNewMedication,
        doseIncreased: data.doseIncreased,
        doseDecreased: data.doseDecreased,
        requiresPurchase: data.requiresPurchase,
        logicalKey: data.logicalKey,
    }));

    const getDisplayTime = (ins: Injectable): string => {
        const match = ins.schedule.match(/\((.*)\)/);
        return match ? match[1] : ins.time;
    };

    const allItems = [...medicationItems, ...inhalerItems, ...injectableItems];

    const formattedControlDate = controlInfo.date ? new Date(`${controlInfo.date}T${controlInfo.time || '00:00'}`).toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' }) : '';

    const frequencyShortMap: Record<Frequency, string> = {
        [Frequency.EVERY_24H]: 'c/24h',
        [Frequency.EVERY_24H_NIGHT]: 'c/24h noche',
        [Frequency.EVERY_12H]: 'c/12h',
        [Frequency.EVERY_8H]: 'c/8h',
        [Frequency.MORNING]: 'mañana',
        [Frequency.AFTERNOON]: 'tarde',
        [Frequency.NIGHT]: 'noche',
        [Frequency.WITH_MEALS]: 'con comidas',
    };

    const oralStrings = medications.map(m => `${m.name} ${m.presentacion} ${frequencyShortMap[m.frequency] ?? m.frequency}`);
    const injectableStrings = injectables.map(i => {
        const sched = i.schedule.match(/\((.*)\)/);
        return `${i.type} ${i.dose} ${(sched ? sched[1] : i.schedule).toLowerCase()}`;
    });
    const inhalerStrings = inhalers.map(h => `${h.name} inh ${h.presentacion} c/${h.frequencyHours}h`);
    const medsParam = [...oralStrings, ...injectableStrings, ...inhalerStrings].join('||');

    const qrLink = showQr ? `https://qreceta.netlify.app/htmla.html?nombre=${encodeURIComponent(patient.name)}&rut=${encodeURIComponent(patient.rut)}&fecha=${encodeURIComponent(patient.date)}&meds=${encodeURIComponent(medsParam)}` : '';
    const qrImageSrc = showQr ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrLink)}` : '';

    return (
        <div id="schedule-preview" className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
            <header className="mb-4 border-b-2 pb-4 border-slate-200 relative">
                {showQr && (
                    <img
                        src={qrImageSrc}
                        alt="Código QR de medicamentos"
                        className="absolute -top-8 -right-8 w-36 h-36"
                    />
                )}
                <h1 className="mt-0 mb-1 text-2xl font-extrabold text-blue-700 leading-tight sm:pr-40">Guía de Medicamentos</h1>
                <div className="text-sm flex flex-wrap gap-x-4 gap-y-1 sm:pr-40 sm:mt-0 mt-36">
                    <div className="flex items-center">
                        <span className="font-bold text-slate-600">Nombre y Apellido:</span>
                        <span className="ml-1 text-slate-800">{patient.name || '...'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-slate-600">RUT:</span>
                        <span className="ml-1 text-slate-800">{patient.rut || '...'}</span>
                    </div>
                    <div className="flex items-center">
                        <span className="font-bold text-slate-600">Fecha:</span>
                        <span className="ml-1 text-slate-800">{patient.date ? new Date(patient.date + 'T00:00:00').toLocaleDateString('es-CL') : '...'}</span>
                    </div>
                </div>
            </header>

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
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1 flex-wrap">
                                                    <span className="text-[10px] uppercase tracking-wide bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                                                        {LOGICAL_LABELS[item.logicalKey]}
                                                    </span>
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
                                                {(() => {
                                                    const description = item.dosageForm === DosageForm.OTHER
                                                        ? item.otherDosageForm
                                                        : item.dosageForm === DosageForm.NONE
                                                            ? ''
                                                            : item.dosageForm;
                                                    return (
                                                        <p className="text-xs text-slate-500 italic">
                                                            {`${item.dose}${description ? ` ${description}` : ''} - ${item.frequency}`}
                                                        </p>
                                                    );
                                                })()}
                                            </td>
                                            {(() => {
                                                const doses = editableDoses[item.id];
                                                return (
                                                    <>
                                                        <td
                                                            className={`p-2 text-center align-middle ${[DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm) ? 'cursor-pointer' : 'cursor-text'}`}
                                                            contentEditable={false}
                                                            onClick={() => handleDoseClick(item.id, 'morning')}
                                                        >
                                                            {doses && doses.morning != null && (
                                                                <DoseVisualizer
                                                                    dose={doses.morning || ''}
                                                                    dosageForm={item.dosageForm}
                                                                    className="text-blue-600"
                                                                    editable={! [DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm)}
                                                                    onDoseChange={(val) => handleDoseInputChange(item.id, 'morning', val)}
                                                                />
                                                            )}
                                                        </td>
                                                        <td
                                                            className={`p-2 text-center align-middle ${[DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm) ? 'cursor-pointer' : 'cursor-text'}`}
                                                            contentEditable={false}
                                                            onClick={() => handleDoseClick(item.id, 'afternoon')}
                                                        >
                                                            {doses && doses.afternoon != null && (
                                                                <DoseVisualizer
                                                                    dose={doses.afternoon || ''}
                                                                    dosageForm={item.dosageForm}
                                                                    className="text-amber-500"
                                                                    editable={! [DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm)}
                                                                    onDoseChange={(val) => handleDoseInputChange(item.id, 'afternoon', val)}
                                                                />
                                                            )}
                                                        </td>
                                                        <td
                                                            className={`p-2 text-center align-middle ${[DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm) ? 'cursor-pointer' : 'cursor-text'}`}
                                                            contentEditable={false}
                                                            onClick={() => handleDoseClick(item.id, 'night')}
                                                        >
                                                            {doses && doses.night != null && (
                                                                <DoseVisualizer
                                                                    dose={doses.night || ''}
                                                                    dosageForm={item.dosageForm}
                                                                    className="text-blue-600"
                                                                    editable={! [DosageForm.TABLET, DosageForm.NONE].includes(item.dosageForm)}
                                                                    onDoseChange={(val) => handleDoseInputChange(item.id, 'night', val)}
                                                                />
                                                            )}
                                                        </td>
                                                    </>
                                                );
                                            })()}
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
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1 flex-wrap">
                                                    <span className="text-[10px] uppercase tracking-wide bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                                                        {LOGICAL_LABELS[item.logicalKey]}
                                                    </span>
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
                                    const allNotes = [...item.schedules.mañana, ...item.schedules.noche, ...item.schedules.ad, ...item.schedules.aa, ...item.schedules.ao, ...item.schedules.ac]
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
                                                <p className="font-bold text-md text-slate-800 flex items-center justify-center gap-1 flex-wrap">
                                                    <span className="text-[10px] uppercase tracking-wide bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold">
                                                        {LOGICAL_LABELS[item.logicalKey]}
                                                    </span>
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
                                                <SyringeIcon className="w-5 h-5 text-teal-600 mx-auto" />
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                                                    {[...item.schedules.mañana, ...item.schedules.ad].map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={getDisplayTime(ins)} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                                                    {item.schedules.aa.map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={getDisplayTime(ins)} className="text-blue-600"/>
                                                    ))}
                                                    {item.schedules.ao.map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={getDisplayTime(ins)} className="text-blue-600"/>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-2 text-center align-middle" contentEditable={false}>
                                                <div className="flex flex-row flex-wrap justify-center items-center gap-2">
                                                    {[...item.schedules.ac, ...item.schedules.noche].map(ins => (
                                                        <InjectableDoseVisualizer key={ins.id} dose={ins.dose} time={getDisplayTime(ins)} className="text-blue-600"/>
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

            {controlInfo.freeNoteEnabled && controlInfo.freeNoteText && (
                <section className="mb-8">
                    <h3 className="text-base font-bold text-black mb-2 text-center">Nota</h3>
                    <div className="p-3 border border-black rounded text-black text-sm whitespace-pre-wrap">{controlInfo.freeNoteText}</div>
                </section>
            )}

             {controlInfo.applies === 'yes' && controlInfo.date && (
                <section className="mt-6 pt-4 border-t border-slate-200 text-xs">
                    <h3 className="text-base font-bold text-slate-800 mb-2 text-center">Próximo Control Médico</h3>
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
            <p className="mt-6 text-center text-[10px] text-slate-500">Esta hoja es un recordatorio personal. Ante dudas o eventos adversos, consulte a su médico tratante.</p>
        </div>
    );
};

export default SchedulePreview;