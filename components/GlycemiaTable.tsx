import React, { useState } from 'react';

const rowCount = 26; // number of rows to nearly fill letter-size page

const GlycemiaTable: React.FC = () => {
    const [info, setInfo] = useState({
        name: '',
        rut: '',
        therapy: '',
        nextControlEnabled: false,
        nextControl: '',
    });

    const [headers, setHeaders] = useState({
        fecha: 'Fecha',
        ad: 'AD',
        aa: 'AA',
        ao: 'AO',
        ac: 'AC',
        late: '22:00-23:00',
        note: 'Nota',
    });

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setInfo(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleHeaderChange = (key: keyof typeof headers, value: string) => {
        setHeaders(prev => ({ ...prev, [key]: value }));
    };

    const columnKeys = Object.keys(headers) as (keyof typeof headers)[];

    return (
        <div id="schedule-preview" className="bg-white p-8 rounded-lg shadow-xl w-full max-w-3xl mx-auto border border-slate-200">
            <header className="mb-4 border-b-2 pb-4 border-slate-200">
                <h2 className="mt-0 mb-2 text-2xl font-extrabold text-blue-700 leading-tight">Registro de Glicemia</h2>
                <div className="text-sm space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <label className="font-semibold">Nombre:</label>
                        <input
                            name="name"
                            value={info.name}
                            onChange={handleInfoChange}
                            className="flex-1 border-b border-slate-300 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <label className="font-semibold">RUT:</label>
                        <input
                            name="rut"
                            value={info.rut}
                            onChange={handleInfoChange}
                            className="flex-1 border-b border-slate-300 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <label className="font-semibold">Terapia insulínica indicada:</label>
                        <input
                            name="therapy"
                            value={info.therapy}
                            onChange={handleInfoChange}
                            className="flex-1 border-b border-slate-300 focus:outline-none"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                        <label className="font-semibold flex items-center gap-2">
                            <input
                                type="checkbox"
                                name="nextControlEnabled"
                                checked={info.nextControlEnabled}
                                onChange={handleInfoChange}
                            />
                            Próximo control
                        </label>
                        {info.nextControlEnabled && (
                            <input
                                name="nextControl"
                                value={info.nextControl}
                                onChange={handleInfoChange}
                                className="flex-1 border-b border-slate-300 focus:outline-none"
                            />
                        )}
                    </div>
                </div>
            </header>

            <table className="w-full border border-slate-400 border-collapse text-xs">
                <thead>
                    <tr>
                        {columnKeys.map(key => (
                            <th key={key} className="border border-slate-400 p-1">
                                <input
                                    value={headers[key]}
                                    onChange={e => handleHeaderChange(key, e.target.value)}
                                    className="w-full text-center font-semibold bg-transparent focus:outline-none"
                                />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: rowCount }).map((_, idx) => (
                        <tr key={idx} className="h-6">
                            {columnKeys.map(col => (
                                <td key={col} className="border border-slate-400"></td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            <p className="mt-4 text-xs">
                Abreviaturas: AD = antes de desayuno. AA = antes de almuerzo. AO = antes de once. AC = antes de cena.
            </p>
        </div>
    );
};

export default GlycemiaTable;

