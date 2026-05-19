import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Save, ArrowLeft, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EvaluatorSheet, StudentMark, EMPTY_SHEET, createEmptyMarks, calculateTotal } from '../types';
import SheetHeader from '../components/SheetHeader';
import MarksTable from '../components/MarksTable';
import SignatureSection from '../components/SignatureSection';
import Footer from '../components/Footer';

export default function NewSheetPage() {
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Partial<EvaluatorSheet>>({ ...EMPTY_SHEET });
  const [marks, setMarks] = useState<StudentMark[]>(createEmptyMarks(''));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSheetChange = (field: keyof EvaluatorSheet, value: string) => {
    setSheet((prev) => ({ ...prev, [field]: value }));
  };

  const handleMarkChange = (index: number, field: keyof StudentMark, value: number) => {
    setMarks((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      updated[index].total_marks = calculateTotal(updated[index]);
      return updated;
    });
  };

  const handleSave = async () => {
    if (!sheet.qp_code || !sheet.subject_name || !sheet.evaluator_name) {
      setError('Please fill in Q.P Code, Subject Name, and Evaluator Name at minimum.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data: sheetData, error: sheetError } = await supabase
        .from('evaluator_sheets')
        .insert({
          qp_code: sheet.qp_code,
          packet_number: sheet.packet_number,
          date: sheet.date || null,
          subject_name: sheet.subject_name,
          evaluator_name: sheet.evaluator_name,
          evaluator_code: sheet.evaluator_code,
          board_evaluator: sheet.board_evaluator,
          trimester: sheet.trimester,
          evaluator_signature: sheet.evaluator_signature || '',
          board_evaluator_signature: sheet.board_evaluator_signature || '',
          signature_date: sheet.signature_date || null,
          remarks: sheet.remarks || '',
        })
        .select()
        .single();

      if (sheetError) throw sheetError;

      const marksToInsert = marks.map((m) => ({
        sheet_id: sheetData.id,
        sl_no: m.sl_no,
        q1: m.q1,
        q2: m.q2,
        q3: m.q3,
        q4: m.q4,
        q5: m.q5,
        q6: m.q6,
        q7: m.q7,
        q8: m.q8,
        q9: m.q9,
        total_marks: calculateTotal(m),
      }));

      const { error: marksError } = await supabase.from('student_marks').insert(marksToInsert);

      if (marksError) throw marksError;

      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndDownload = async () => {
    if (!sheet.qp_code || !sheet.subject_name || !sheet.evaluator_name) {
      setError('Please fill in Q.P Code, Subject Name, and Evaluator Name at minimum.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const { data: sheetData, error: sheetError } = await supabase
        .from('evaluator_sheets')
        .insert({
          qp_code: sheet.qp_code,
          packet_number: sheet.packet_number,
          date: sheet.date || null,
          subject_name: sheet.subject_name,
          evaluator_name: sheet.evaluator_name,
          evaluator_code: sheet.evaluator_code,
          board_evaluator: sheet.board_evaluator,
          trimester: sheet.trimester,
          evaluator_signature: sheet.evaluator_signature || '',
          board_evaluator_signature: sheet.board_evaluator_signature || '',
          signature_date: sheet.signature_date || null,
          remarks: sheet.remarks || '',
        })
        .select()
        .single();

      if (sheetError) throw sheetError;

      const marksToInsert = marks.map((m) => ({
        sheet_id: sheetData.id,
        sl_no: m.sl_no,
        q1: m.q1,
        q2: m.q2,
        q3: m.q3,
        q4: m.q4,
        q5: m.q5,
        q6: m.q6,
        q7: m.q7,
        q8: m.q8,
        q9: m.q9,
        total_marks: calculateTotal(m),
      }));

      const { error: marksError } = await supabase.from('student_marks').insert(marksToInsert);

      if (marksError) throw marksError;

      navigate(`/print/${sheetData.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <div className="flex items-center gap-2 text-teal-700">
            <FileText className="w-5 h-5" />
            <span className="font-bold text-lg">New Evaluator Sheet</span>
          </div>
          <div className="w-24" />
        </div>

        {/* Sheet Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
            Evaluator Details
          </h2>
          <SheetHeader sheet={sheet} onChange={handleSheetChange} />
        </div>

        {/* Marks Table Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-4 border-b border-slate-200 pb-2">
            Marks Entry
          </h2>
          <MarksTable marks={marks} onChange={handleMarkChange} />
        </div>

        {/* Signature Card */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 mb-6">
          <SignatureSection sheet={sheet} onChange={handleSheetChange} />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={handleSaveAndDownload}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save & Download PDF'}
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}
