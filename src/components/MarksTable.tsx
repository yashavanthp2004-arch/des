import { StudentMark, calculateTotal } from '../types';

interface MarksTableProps {
  marks: StudentMark[];
  onChange: (index: number, field: keyof StudentMark, value: number) => void;
  readOnly?: boolean;
}

const SECTION_A = ['q1', 'q2', 'q3', 'q4'] as const;
const SECTION_B = ['q5', 'q6', 'q7', 'q8'] as const;
const SECTION_C = ['q9'] as const;

const questionKeys = [...SECTION_A, ...SECTION_B, ...SECTION_C] as const;

export default function MarksTable({ marks, onChange, readOnly = false }: MarksTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-800 text-white">
            <th className="border border-slate-600 px-2 py-2 text-center font-semibold" rowSpan={2}>
              SL No
            </th>
            <th className="border border-slate-600 px-2 py-2 text-center font-semibold bg-teal-700" colSpan={4}>
              SECTION A
            </th>
            <th className="border border-slate-600 px-2 py-2 text-center font-semibold bg-emerald-700" colSpan={4}>
              SECTION B
            </th>
            <th className="border border-slate-600 px-2 py-2 text-center font-semibold bg-cyan-700" colSpan={1}>
              SECTION C
            </th>
            <th className="border border-slate-600 px-2 py-2 text-center font-semibold bg-amber-700" rowSpan={2}>
              Total Marks
            </th>
          </tr>
          <tr className="bg-slate-700 text-white">
            {SECTION_A.map((q) => (
              <th key={q} className="border border-slate-600 px-2 py-1 text-center font-medium bg-teal-600 uppercase">
                {q.replace('q', 'Q')}
              </th>
            ))}
            {SECTION_B.map((q) => (
              <th key={q} className="border border-slate-600 px-2 py-1 text-center font-medium bg-emerald-600 uppercase">
                {q.replace('q', 'Q')}
              </th>
            ))}
            {SECTION_C.map((q) => (
              <th key={q} className="border border-slate-600 px-2 py-1 text-center font-medium bg-cyan-600 uppercase">
                {q.replace('q', 'Q')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {marks.map((mark, index) => {
            const total = calculateTotal(mark);
            return (
              <tr
                key={mark.sl_no}
                className={`
                  ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                  hover:bg-teal-50 transition-colors
                `}
              >
                <td className="border border-slate-300 px-2 py-1.5 text-center font-medium text-slate-700">
                  {mark.sl_no}
                </td>
                {questionKeys.map((q) => (
                  <td key={q} className="border border-slate-300 px-1 py-1 text-center">
                    <input
                      type="number"
                      min="0"
                      value={mark[q] || 0}
                      onChange={(e) => onChange(index, q, parseInt(e.target.value) || 0)}
                      readOnly={readOnly}
                      className="w-full text-center py-1 px-1 border-0 bg-transparent focus:outline-none focus:bg-teal-50 focus:ring-1 focus:ring-teal-400 rounded text-sm disabled:text-slate-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </td>
                ))}
                <td className="border border-slate-300 px-2 py-1.5 text-center font-bold text-slate-800 bg-amber-50">
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
