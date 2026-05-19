import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EvaluatorSheet, StudentMark } from '../types';
import PrintableSheet from '../components/PrintableSheet';
import Footer from '../components/Footer';

export default function PrintSheetPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sheet, setSheet] = useState<EvaluatorSheet | null>(null);
  const [marks, setMarks] = useState<StudentMark[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!sheet) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-slate-500">Sheet not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar - hidden in print */}
      <div className="no-print bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between print:hidden">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-colors text-sm"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors text-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      {/* Printable Content */}
      <div className="max-w-4xl mx-auto px-8 py-6">
        <PrintableSheet sheet={sheet} marks={marks} />
      </div>

      <Footer />
    </div>
  );
}
