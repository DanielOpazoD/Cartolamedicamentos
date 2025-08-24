import React, { useState } from 'react';
import { Patient } from '../types';

interface GlycemiaTableProps {
  patient: Patient;
  onPatientChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBack: () => void;
}

const defaultColumns = ['Fecha', 'AD', 'AA', 'AO', 'AC', '22:00-23:00', 'Nota'];

const GlycemiaTable: React.FC<GlycemiaTableProps> = ({ patient, onPatientChange, onBack }) => {
  const [therapy, setTherapy] = useState('');
  const [nextEnabled, setNextEnabled] = useState(false);
  const [nextText, setNextText] = useState('');
  const [columns, setColumns] = useState<string[]>(defaultColumns);

  const handleColumnChange = (idx: number, value: string) => {
    setColumns(prev => prev.map((c, i) => (i === idx ? value : c)));
  };

  const handlePrint = () => {
    window.print();
  };

  const rows = Array.from({ length: 26 });

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex justify-between">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-slate-300 rounded hover:bg-slate-400"
        >
          Volver
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Imprimir
        </button>
      </div>
      <div id="glycemia-table" className="space-y-4">
        <h1 className="text-2xl font-bold text-center">Registro de Glicemia</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
            <input
              type="text"
              id="name"
              name="name"
              value={patient.name}
              onChange={onPatientChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label htmlFor="rut" className="block text-sm font-medium text-slate-600 mb-1">Rut</label>
            <input
              type="text"
              id="rut"
              name="rut"
              value={patient.rut}
              onChange={onPatientChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="therapy" className="block text-sm font-medium text-slate-600 mb-1">Terapia insulínica indicada</label>
          <input
            type="text"
            id="therapy"
            value={therapy}
            onChange={(e) => setTherapy(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <input
              type="checkbox"
              checked={nextEnabled}
              onChange={(e) => setNextEnabled(e.target.checked)}
              className="h-4 w-4 text-blue-600"
            />
            Próximo control
          </label>
          {nextEnabled && (
            <textarea
              value={nextText}
              onChange={(e) => setNextText(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm"
            />
          )}
        </div>
        <table className="w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="border border-slate-400 p-1">
                  <input
                    className="w-full text-center font-semibold"
                    value={col}
                    onChange={(e) => handleColumnChange(i, e.target.value)}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, r) => (
              <tr key={r}>
                {columns.map((_, c) => (
                  <td key={c} className="border border-slate-400 h-6"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-xs text-slate-600">
          Abreviaturas: AD = antes de desayuno. AA = antes de almuerzo. AO = antes de once. AC = antes de cena.
        </p>
      </div>
    </div>
  );
};

export default GlycemiaTable;
