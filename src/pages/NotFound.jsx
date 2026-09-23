import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="bg-red-50 p-6 rounded-full mb-6 text-red-500">
        <AlertTriangle className="w-16 h-16" />
      </div>
      <h1 className="text-4xl font-bold text-slate-900 mb-2">404 - Page Not Found</h1>
      <p className="text-slate-500 text-lg mb-8 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link 
        to="/"
        className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors shadow-sm"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
