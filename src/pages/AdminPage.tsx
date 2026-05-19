import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Eye, CreditCard as Edit3, Printer, Trash2, FileText, ClipboardList, LogOut, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { EvaluatorSheet } from '../types';
import Footer from '../components/Footer';

export default function AdminPage() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [sheets, setSheets] = useState<EvaluatorSheet[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchSheets();
  }, []);

  const fetchSheets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('evaluator_sheets')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSheets(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this evaluator sheet? This action cannot be undone.')) return;

    setDeleting(id);
    const { error } = await supabase.from('evaluator_sheets').delete().eq('id', id);

    if (!error) {
      setSheets((prev) => prev.filter((s) => s.id !== id));
    }
    setDeleting(null);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const filtered = sheets.filter(
    (s) =>
      s.evaluator_name.toLowerCase().includes(search.toLowerCase()) ||
      s.subject_name.toLowerCase().includes(search.toLowerCase()) ||
      s.qp_code.toLowerCase().includes(search.toLowerCase()) ||
      s.packet_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-600 rounded-lg">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Evaluator Sheet Admin</h1>
              <p className="text-sm text-slate-500">Manage all evaluator marks sheets</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors text-sm"
            >
              <Home className="w-4 h-4" />
              Home
            </button>
            <button
              onClick={() => navigate('/new')}
              className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Sheet
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Evaluator Name, Subject, Q.P Code, or Packet Number..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-slate-500">
            <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-3" />
            Loading records...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">
              {search ? 'No records match your search.' : 'No evaluator sheets found. Create one to get started.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-800 text-white">
                    <th className="px-4 py-3 text-left font-semibold">Evaluator Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Subject Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Q.P Code</th>
                    <th className="px-4 py-3 text-left font-semibold">Date</th>
                    <th className="px-4 py-3 text-left font-semibold">Packet No.</th>
                    <th className="px-4 py-3 text-center font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((sheet, index) => (
                    <tr
                      key={sheet.id}
                      className={`
                        ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}
                        hover:bg-teal-50 transition-colors border-b border-slate-100
                      `}
                    >
                      <td className="px-4 py-3 font-medium text-slate-800">{sheet.evaluator_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{sheet.subject_name || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{sheet.qp_code || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{sheet.date || '—'}</td>
                      <td className="px-4 py-3 text-slate-600 font-mono">{sheet.packet_number || '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => navigate(`/view/${sheet.id}`)}
                            className="p-1.5 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="View"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/edit/${sheet.id}`)}
                            className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/print/${sheet.id}`)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Print"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(sheet.id)}
                            disabled={deleting === sheet.id}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Count */}
        <div className="mt-4 text-center text-xs text-slate-400">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''} found
        </div>

        <Footer />
      </div>
    </div>
  );
}
