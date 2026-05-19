import { EvaluatorSheet, StudentMark, calculateTotal } from '../types';

interface PrintableSheetProps {
  sheet: EvaluatorSheet;
  marks: StudentMark[];
}

const SECTION_A = ['q1', 'q2', 'q3', 'q4'] as const;
const SECTION_B = ['q5', 'q6', 'q7', 'q8'] as const;
const SECTION_C = ['q9'] as const;
const questionKeys = [...SECTION_A, ...SECTION_B, ...SECTION_C] as const;

export default function PrintableSheet({ sheet, marks }: PrintableSheetProps) {
  return (
    <div className="print-sheet" style={{ fontFamily: "'Times New Roman', serif", fontSize: '11pt' }}>
      {/* Institute Header */}
      <div style={{ textAlign: 'center', marginBottom: '4px' }}>
        <h1 style={{ fontSize: '16pt', fontWeight: 'bold', margin: '0 0 2px 0', letterSpacing: '2px', textTransform: 'uppercase' }}>
          INTERNATIONAL INSTITUTE OF BUSINESS STUDY
        </h1>
        <p style={{ fontSize: '9pt', margin: '0 0 2px 0', color: '#444' }}>
          #75, Muthugadahalli, Jala Hobli, Bangalore North, Bangalore - 562157
        </p>
        <p style={{ fontSize: '11pt', fontWeight: 'bold', margin: '8px 0 0 0', letterSpacing: '1px' }}>
          PGDM: TEE EVALUATOR SHEET - TRIMESTER - {sheet.trimester || '—'}
        </p>
      </div>

      <div style={{ borderBottom: '3px double #000', marginBottom: '16px', paddingBottom: '8px' }} />

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px', marginBottom: '16px', fontSize: '10pt' }}>
        <div><strong>Q.P Code:</strong> {sheet.qp_code || '—'}</div>
        <div><strong>Packet Number:</strong> {sheet.packet_number || '—'}</div>
        <div><strong>Date:</strong> {sheet.date || '—'}</div>
        <div><strong>Subject Name:</strong> {sheet.subject_name || '—'}</div>
        <div><strong>Evaluator Name:</strong> {sheet.evaluator_name || '—'}</div>
        <div><strong>Evaluator Code:</strong> {sheet.evaluator_code || '—'}</div>
        <div><strong>Board Evaluator:</strong> {sheet.board_evaluator || '—'}</div>
      </div>

      {/* Marks Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '16px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1e293b', color: '#fff' }}>
            <th style={{ border: '1px solid #475569', padding: '6px 4px', textAlign: 'center' }} rowSpan={2}>SL No</th>
            <th style={{ border: '1px solid #475569', padding: '6px 4px', textAlign: 'center', backgroundColor: '#0f766e' }} colSpan={4}>SECTION A</th>
            <th style={{ border: '1px solid #475569', padding: '6px 4px', textAlign: 'center', backgroundColor: '#047857' }} colSpan={4}>SECTION B</th>
            <th style={{ border: '1px solid #475569', padding: '6px 4px', textAlign: 'center', backgroundColor: '#0e7490' }} colSpan={1}>SECTION C</th>
            <th style={{ border: '1px solid #475569', padding: '6px 4px', textAlign: 'center', backgroundColor: '#b45309' }} rowSpan={2}>Total</th>
          </tr>
          <tr style={{ backgroundColor: '#334155', color: '#fff' }}>
            {SECTION_A.map((q) => (
              <th key={q} style={{ border: '1px solid #475569', padding: '4px', textAlign: 'center', backgroundColor: '#0f766e', textTransform: 'uppercase' }}>
                {q.replace('q', 'Q')}
              </th>
            ))}
            {SECTION_B.map((q) => (
              <th key={q} style={{ border: '1px solid #475569', padding: '4px', textAlign: 'center', backgroundColor: '#047857', textTransform: 'uppercase' }}>
                {q.replace('q', 'Q')}
              </th>
            ))}
            {SECTION_C.map((q) => (
              <th key={q} style={{ border: '1px solid #475569', padding: '4px', textAlign: 'center', backgroundColor: '#0e7490', textTransform: 'uppercase' }}>
                {q.replace('q', 'Q')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {marks.map((mark, index) => {
            const total = calculateTotal(mark);
            return (
              <tr key={mark.sl_no} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f8fafc' }}>
                <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: '600' }}>{mark.sl_no}</td>
                {questionKeys.map((q) => (
                  <td key={q} style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center' }}>
                    {mark[q] || 0}
                  </td>
                ))}
                <td style={{ border: '1px solid #cbd5e1', padding: '4px', textAlign: 'center', fontWeight: 'bold', backgroundColor: '#fef3c7' }}>
                  {total}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Signature Section */}
      <div style={{ borderTop: '2px solid #000', paddingTop: '24px', marginTop: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', fontSize: '10pt' }}>
          <div>
            <div style={{ height: '50px', borderBottom: '1px solid #000' }} />
            <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>Signature of Evaluator</p>
          </div>
          <div>
            <div style={{ height: '50px', borderBottom: '1px solid #000' }} />
            <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>Signature of Board Evaluator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
