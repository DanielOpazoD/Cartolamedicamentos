import React from 'react';
import { Dose } from '../types';
import PillIcon from './icons/PillIcon';
import HalfPillIcon from './icons/HalfPillIcon';
import QuarterPillIcon from './icons/QuarterPillIcon';
import ThreeQuarterPillIcon from './icons/ThreeQuarterPillIcon';

interface DoseVisualizerProps {
    dose: Dose;
    className?: string; // e.g. "text-sky-500"
}

const DoseVisualizer: React.FC<DoseVisualizerProps> = ({ dose, className }) => {
    
    // Renderiza múltiples cápsulas para dosis mayores a 1
    const renderMultiplePills = (count: number) => {
        return (
            <div className="flex items-center justify-center -space-x-4">
                {Array.from({ length: count }).map((_, i) => (
                     <PillIcon key={i} className="w-10 h-10" />
                ))}
            </div>
        );
    };

    // Componente contenedor para unificar el estilo del ícono y su etiqueta
    const DoseDisplay: React.FC<{ children: React.ReactNode, label: string }> = ({ children, label }) => (
        <div className={`inline-flex flex-col items-center justify-center gap-1.5 ${className}`}>
            {children}
            <span className="font-bold text-base uppercase tracking-wide">{label}</span>
        </div>
    );

    switch (dose) {
        case Dose.QUARTER:
            return (
                <DoseDisplay label={Dose.QUARTER}>
                    <QuarterPillIcon className="w-8 h-8" />
                </DoseDisplay>
            );
        case Dose.HALF:
            return (
                <DoseDisplay label={Dose.HALF}>
                    <HalfPillIcon className="w-8 h-8" />
                </DoseDisplay>
            );
        case Dose.THREE_QUARTERS:
            return (
                <DoseDisplay label={Dose.THREE_QUARTERS}>
                    <ThreeQuarterPillIcon className="w-8 h-8" />
                </DoseDisplay>
            );
        case Dose.ONE:
             return (
                <DoseDisplay label={Dose.ONE}>
                    <PillIcon className="w-10 h-10" />
                </DoseDisplay>
            );
        case Dose.ONE_AND_QUARTER:
            return (
                <DoseDisplay label={Dose.ONE_AND_QUARTER}>
                    <div className="flex items-center justify-center -space-x-4">
                        <PillIcon className="w-10 h-10" />
                        <QuarterPillIcon className="w-8 h-8" />
                    </div>
                </DoseDisplay>
            );
        case Dose.ONE_AND_HALF:
            return (
                <DoseDisplay label={Dose.ONE_AND_HALF}>
                    <div className="flex items-center justify-center -space-x-4">
                        <PillIcon className="w-10 h-10" />
                        <HalfPillIcon className="w-8 h-8" />
                    </div>
                </DoseDisplay>
            );
        case Dose.ONE_AND_THREE_QUARTERS:
            return (
                <DoseDisplay label={Dose.ONE_AND_THREE_QUARTERS}>
                    <div className="flex items-center justify-center -space-x-4">
                        <PillIcon className="w-10 h-10" />
                        <ThreeQuarterPillIcon className="w-8 h-8" />
                    </div>
                </DoseDisplay>
            );
        case Dose.TWO:
            return (
                <DoseDisplay label={Dose.TWO}>
                    {renderMultiplePills(2)}
                </DoseDisplay>
            );
        case Dose.THREE:
            return (
                <DoseDisplay label={Dose.THREE}>
                    {renderMultiplePills(3)}
                </DoseDisplay>
            );
        case Dose.FOUR:
            return (
                <DoseDisplay label={Dose.FOUR}>
                    {renderMultiplePills(4)}
                </DoseDisplay>
            );
        default:
            return null;
    }
};

export default DoseVisualizer;