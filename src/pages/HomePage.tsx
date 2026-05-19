import { useNavigate } from 'react-router-dom';
import { FileText, Shield, GraduationCap } from 'lucide-react';
import Footer from '../components/Footer';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50 flex flex-col">
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full text-center">
          {/* College Logo / Icon */}
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* College Name */}
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 tracking-wide mb-2">
            INTERNATIONAL INSTITUTE OF BUSINESS STUDY
          </h1>

          {/* College Address */}
          <p className="text-sm sm:text-base text-slate-500 mb-2">
            #75, Muthugadahalli, Jala Hobli, Bangalore North, Bangalore - 562157
          </p>

          {/* Application Name */}
          <div className="mt-6 mb-10">
            <div className="inline-block px-6 py-2 bg-teal-50 border border-teal-200 rounded-full">
              <p className="text-lg font-semibold text-teal-700 tracking-wider">
                PGDM: TEE EVALUATOR SHEET
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/new')}
              className="flex items-center gap-3 px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl text-base w-full sm:w-auto justify-center"
            >
              <FileText className="w-5 h-5" />
              New Evaluator Sheet
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white font-bold rounded-xl hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl text-base w-full sm:w-auto justify-center"
            >
              <Shield className="w-5 h-5" />
              Admin Login
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
