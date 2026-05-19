import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EvaluatorSheet, StudentMark, calculateTotal } from '../types';
import SheetHeader from '../components/SheetHeader';
import MarksTable from '../components/MarksTable';
import SignatureSection from '../components/SignatureSection';
import Footer from '../components/Footer';

export default function EditSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<Partial<EvaluatorSheet> | null>(null);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    const { data: sheetData } = await supabase
      .from('evaluator_sheets')
      .select('*')
      .eq('id', id!)
      .maybeSingle();

    const { data: marksData } = await supabase
      .from('student_marks')
      .select('*')
      .eq('sheet_id', id!)
      .order('sl_no', { ascending: true });

    if (sheetData) setSheet(sheetData);
    if (marksData) setMarks(marksData);
    setLoading(false);
  };

  const handleSheetChange = (field: keyof EvaluatorSheet, value: string) => {
    setSheet((prev) => prev ? { ...prev, [field]: value } : prev);
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
    if (!sheet || !id) return;

    setSaving(true);
    setError('');

    try {
      const { error: sheetError } = await supabase
        .from('evaluator_sheets')
        .update({
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
        .eq('id', id);

      if (sheetError) throw sheetError;

      for (const mark of marks) {
        const { error: markError } = await supabase
          .from('student_marks')
          .update({
            q1: mark.q1,
            q2: mark.q2,
            q3: mark.q3,
            q4: mark.q4,
            q5: mark.q5,
            q6: mark.q6,
            q7: mark.q7,
            q8: mark.q8,
            q9: mark.q9,
            total_marks: calculateTotal(mark),
          })
          .eq('id', mark.id);

        if (markError) throw markError;
      }

      navigate(`/view/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndDownload = async () => {
    if (!sheet || !id) return;

    setSaving(true);
    setError('');

    try {
      const { error: sheetError } = await supabase
        .from('evaluator_sheets')
        .update({
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
        .eq('id', id);

      if (sheetError) throw sheetError;

      for (const mark of marks) {
        const { error: markError } = await supabase
          .from('student_marks')
          .update({
            q1: mark.q1,
            q2: mark.q2,
            q3: mark.q3,
            q4: mark.q4,
            q5: mark.q5,
            q6: mark.q6,
            q7: mark.q7,
            q8: mark.q8,
            q9: mark.q9,
            total_marks: calculateTotal(mark),
          })
          .eq('id', mark.id);

        if (markError) throw markError;
      }

      navigate(`/print/${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Sheet not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(`/view/${id}`)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to View
          </button>
          <span className="font-bold text-lg text-amber-700">Edit Evaluator Sheet</span>
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
            className="flex items-center gap-2 px-6 py-3 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Save className="w-5 h-5" />
            {saving ? 'Updating...' : 'Save'}
          </button>
          <button
            onClick={handleSaveAndDownload}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            <Download className="w-5 h-5" />
            {saving ? 'Updating...' : 'Save & Download PDF'}
          </button>
        </div>

        <Footer />
      </div>
    </div>
  );
}
