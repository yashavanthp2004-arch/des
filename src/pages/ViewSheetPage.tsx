import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer, CreditCard as Edit3, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { EvaluatorSheet, StudentMark } from '../types';
import PrintableSheet from '../components/PrintableSheet';
import Footer from '../components/Footer';

export default function ViewSheetPage() {
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

  const handleDownloadPDF = () => {
    window.print();
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
        <div className="flex items-center justify-between mb-6 no-print">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/edit/${id}`)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-sm"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors text-sm"
            >
              <Download className="w-4 h-4" />
              Download PDF
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white font-medium rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>
        </div>

        {/* Sheet Content */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
          <PrintableSheet sheet={sheet} marks={marks} />
        </div>

        <Footer />
      </div>
    </div>
  );
}
