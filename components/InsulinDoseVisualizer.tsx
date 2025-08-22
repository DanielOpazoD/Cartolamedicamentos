import React from 'react';
import SyringeIcon from './icons/SyringeIcon';

interface InsulinDoseVisualizerProps {
    dose: number;
    time: string;
    className?: string;
}

const InsulinDoseVisualizer: React.FC<InsulinDoseVisualizerProps> = ({ dose, time, className }) => {
    return (
        <div className={`inline-flex flex-col items-center justify-center gap-1.5 ${className}`}>
            <SyringeIcon className="w-8 h-8" />
            <span className="font-bold text-base uppercase tracking-wide">{dose} U</span>
            <span className="font-semibold text-xs">{time}</span>
        </div>
    );
};

export default InsulinDoseVisualizer;