import React, { useState } from 'react';

const defaultColumns = ['Fecha', 'AD', 'AA', 'AO', 'AC', '22:00-23:00', 'Nota'];

const GlycemiaLog: React.FC = () => {
  const [columns, setColumns] = useState<string[]>(defaultColumns);
  const [showNextControl, setShowNextControl] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [rut, setRut] = useState('');
  const [therapy, setTherapy] = useState('');
  const [nextControl, setNextControl] = useState('');

  const handleColumnChange = (index: number, value: string) => {
    setColumns(prev => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-4xl mx-auto border border-slate-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="patientName" className="block text-sm font-medium text-slate-600 mb-1">Nombre</label>
          <input
            id="patientName"
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="rut" className="block text-sm font-medium text-slate-600 mb-1">Rut</label>
          <input
            id="rut"
            type="text"
            value={rut}
            onChange={(e) => setRut(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="therapy" className="block text-sm font-medium text-slate-600 mb-1">Terapia insulínica indicada</label>
          <input
            id="therapy"
            type="text"
            value={therapy}
            onChange={(e) => setTherapy(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-2">
          <input
            id="nextControlEnabled"
            type="checkbox"
            checked={showNextControl}
            onChange={(e) => setShowNextControl(e.target.checked)}
          />
          <label htmlFor="nextControlEnabled" className="text-sm font-medium text-slate-600">Próximo control</label>
          {showNextControl && (
            <input
              type="text"
              value={nextControl}
              onChange={(e) => setNextControl(e.target.value)}
              className="flex-1 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-400 text-sm">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} className="border border-slate-400 p-1">
                  <input
                    value={col}
                    onChange={(e) => handleColumnChange(idx, e.target.value)}
                    className="w-full text-center font-semibold focus:outline-none"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 25 }).map((_, rowIdx) => (
              <tr key={rowIdx} className="h-8">
                {columns.map((_, colIdx) => (
                  <td key={colIdx} className="border border-slate-400" />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Abreviaturas: AD = antes de desayuno. AA = antes de almuerzo. AO = antes de once. AC = antes de cena.
      </p>
    </div>
  );
};

export default GlycemiaLog;

