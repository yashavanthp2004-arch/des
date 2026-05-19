import { EvaluatorSheet } from '../types';

interface SheetHeaderProps {
  sheet: Partial<EvaluatorSheet>;
  onChange: (field: keyof EvaluatorSheet, value: string) => void;
  readOnly?: boolean;
}

export default function SheetHeader({ sheet, onChange, readOnly = false }: SheetHeaderProps) {
  const fields: { key: keyof EvaluatorSheet; label: string }[] = [
    { key: 'qp_code', label: 'Q.P Code' },
    { key: 'packet_number', label: 'Packet Number' },
    { key: 'date', label: 'Date' },
    { key: 'subject_name', label: 'Subject Name' },
    { key: 'evaluator_name', label: 'Evaluator Name' },
    { key: 'evaluator_code', label: 'Evaluator Code' },
    { key: 'board_evaluator', label: 'Board Evaluator' },
    { key: 'trimester', label: 'Trimester' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {fields.map(({ key, label }) => (
        <div key={key}>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            {label}
          </label>
          {key === 'date' ? (
            <input
              type="date"
              value={(sheet[key] as string) || ''}
              onChange={(e) => onChange(key, e.target.value)}
              readOnly={readOnly}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:text-slate-500"
            />
          ) : (
            <input
              type="text"
              value={(sheet[key] as string) || ''}
              onChange={(e) => onChange(key, e.target.value)}
              readOnly={readOnly}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:text-slate-500"
              placeholder={`Enter ${label}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
