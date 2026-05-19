import { EvaluatorSheet } from '../types';

interface SignatureSectionProps {
  sheet: Partial<EvaluatorSheet>;
  onChange: (field: keyof EvaluatorSheet, value: string) => void;
  readOnly?: boolean;
}

export default function SignatureSection({ sheet, onChange, readOnly = false }: SignatureSectionProps) {
  return (
    <div className="border-2 border-slate-300 rounded-lg p-6 mt-6 bg-slate-50">
      <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-300 pb-2">
        Signature & Verification
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Signature of Evaluator
          </label>
          <input
            type="text"
            value={sheet.evaluator_signature || ''}
            onChange={(e) => onChange('evaluator_signature', e.target.value)}
            readOnly={readOnly}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Evaluator signature"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
            Signature of Board Evaluator
          </label>
          <input
            type="text"
            value={sheet.board_evaluator_signature || ''}
            onChange={(e) => onChange('board_evaluator_signature', e.target.value)}
            readOnly={readOnly}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow disabled:bg-slate-50 disabled:text-slate-500"
            placeholder="Board evaluator signature"
          />
        </div>
      </div>
    </div>
  );
}
