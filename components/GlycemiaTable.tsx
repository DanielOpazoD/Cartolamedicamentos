import React, { useState } from 'react';

interface Column {
  id: string;
  label: string;
  isNotes?: boolean;
}

const initialColumns: Column[] = [
  { id: 'fecha', label: 'Fecha' },
  { id: 'glicemia-ayuno', label: 'Glicemia Ayuno' },
  { id: 'antes-almuerzo', label: 'Antes de Almuerzo' },
  { id: 'antes-once', label: 'Antes de Once' },
  { id: 'antes-cena', label: 'Antes de Cena' },
  { id: '2200', label: '22:00' },
  { id: 'notas', label: 'Notas', isNotes: true }
];

const GlycemiaTable: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [showGoals, setShowGoals] = useState(false);
  const rows = Array.from({ length: 30 });

  const handleAddColumn = () => {
    const newCol: Column = {
      id: Date.now().toString(),
      label: 'Nueva Columna'
    };
    setColumns(prev => {
      const withoutNotes = prev.slice(0, -1);
      const notes = prev[prev.length - 1];
      return [...withoutNotes, newCol, notes];
    });
  };

  const handleRemoveColumn = (index: number) => {
    if (index === 0 || columns[index].isNotes) return;
    setColumns(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div id="glycemia-table" className="p-4 font-sans text-black">
      <h2 className="text-2xl font-bold mb-4">Registro de Automonitoreo de Glicemia</h2>

      <div className="flex items-start mb-4">
        <div
          className={`border border-gray-300 p-4 rounded-md bg-gray-50 flex-1 ${
            showGoals ? 'mr-4' : ''
          }`}
        >
          <div className="flex flex-wrap gap-4 mb-3">
            <div className="flex items-center flex-1">
              <label className="font-bold mr-1 text-xs">Nombre:</label>
              <span
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-xs flex-1"
              >
                _________________________
              </span>
            </div>
            <div className="flex items-center flex-1">
              <label className="font-bold mr-1 text-xs">RUT:</label>
              <span
                contentEditable
                suppressContentEditableWarning
                className="outline-none text-xs flex-1"
              >
                _________________________
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <label className="font-bold mr-1 text-xs">Dosis de Insulinoterapia:</label>
            <span
              contentEditable
              suppressContentEditableWarning
              className="outline-none text-xs flex-1"
            >
              _________________________
            </span>
          </div>
        </div>

        {showGoals && (
          <div className="border border-gray-300 p-4 rounded-md bg-gray-50 flex-1">
            <h3 className="text-center text-base font-semibold mb-3">Metas Metabólicas</h3>
            <div className="flex justify-between mb-3">
              <div className="flex flex-col mr-3 flex-1">
                <label className="font-bold text-xs mb-1">Hb Glicosilada</label>
                <input
                  type="text"
                  placeholder="Ej: <7%"
                  className="p-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div className="flex flex-col mr-3 flex-1">
                <label className="font-bold text-xs mb-1">Glicemia Ayuno</label>
                <input
                  type="text"
                  placeholder="Ej: 80-130 mg/dL"
                  className="p-1 border border-gray-300 rounded text-xs"
                />
              </div>
              <div className="flex flex-col flex-1">
                <label className="font-bold text-xs mb-1">Glicemias Pre-Comidas</label>
                <input
                  type="text"
                  placeholder="Ej: 90-130 mg/dL"
                  className="p-1 border border-gray-300 rounded text-xs"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="font-bold text-xs mb-1">Nota</label>
              <input
                type="text"
                placeholder="Observaciones"
                className="p-1 border border-gray-300 rounded text-xs"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4 print:hidden">
        <label className="flex items-center text-xs gap-1">
          <input
            type="checkbox"
            checked={showGoals}
            onChange={e => setShowGoals(e.target.checked)}
          />
          Metas
        </label>
        <button
          onClick={handleAddColumn}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md"
          type="button"
        >
          Agregar columna
        </button>
        <button
          onClick={() => window.print()}
          className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md"
          type="button"
        >
          Imprimir
        </button>
        <button
          onClick={onBack}
          className="bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs py-1 px-2 rounded-lg shadow-md"
          type="button"
        >
          Volver
        </button>
      </div>
      
      <div className="overflow-auto">
        <table className="border-collapse w-full text-sm table-fixed">
          <thead>
            <tr className="bg-blue-50">
              {columns.map((col, idx) => (
                <th key={col.id} className="border p-2 relative">
                  <span contentEditable suppressContentEditableWarning className="outline-none">
                    {col.label}
                  </span>
                  {!col.isNotes && idx > 0 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveColumn(idx)}
                      className="absolute top-1 right-1 text-red-600 print:hidden"
                      title="Eliminar columna"
                    >
                      &times;
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns
                  .filter(col => !col.isNotes)
                  .map(col => (
                    <td
                      key={col.id}
                      className="border p-2"
                      contentEditable
                      suppressContentEditableWarning
                    ></td>
                  ))}
                {rowIndex === 0 && (
                  <td
                    key="notes"
                    rowSpan={rows.length}
                    className="border p-2 align-top"
                    contentEditable
                    suppressContentEditableWarning
                  ></td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GlycemiaTable;
