import Ripple from '../common/Ripple';
import { X, FileText, CheckCircle2, XCircle } from 'lucide-react';
import DocumentStatusBadge from './DocumentStatusBadge';
import { useDocumentContext } from '../../context/DocumentContext';

export default function DocumentDetailsModal({ isOpen, onClose, document, onVerify, onReject }) {
  const { getResolvedStatus } = useDocumentContext();

  if (!isOpen || !document) return null;

  const resolvedStatus = getResolvedStatus(document);
  const isPending = resolvedStatus === 'Pending';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div 
        className="bg-white rounded-xl shadow-xl w-full max-w-lg flex flex-col my-8 animate-modal-enter"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 rounded-t-xl">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary-500" />
            Document Details
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200 relative overflow-hidden transition-all duration-200">
        <Ripple color="rgba(0, 0, 0, 0.1)" />
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{document.documentType}</div>
              <div className="text-sm font-mono text-slate-500">{document.documentNumber}</div>
            </div>
            <DocumentStatusBadge status={resolvedStatus} />
          </div>

          <div className="grid grid-cols-2 gap-y-4 gap-x-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Entity Type</div>
              <div className="text-sm font-semibold text-slate-900 capitalize">{document.entityType}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Entity ID</div>
              <div className="text-sm font-semibold text-slate-900">{document.entityId}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Issue Date</div>
              <div className="text-sm font-semibold text-slate-900">{document.issueDate}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Expiry Date</div>
              <div className="text-sm font-semibold text-slate-900">{document.expiryDate}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Uploaded On</div>
              <div className="text-sm font-semibold text-slate-900">{document.uploadedAt}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-slate-500 mb-1">Associated Vendor</div>
              <div className="text-sm font-semibold text-slate-900">{document.vendorId || 'N/A'}</div>
            </div>
          </div>

          <div>
            <div className="text-xs font-medium text-slate-500 mb-2">File Name / Attachment</div>
            <div className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg bg-white shadow-sm">
              <FileText className="w-8 h-8 text-primary-400" />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-slate-900 truncate">{document.fileName}</p>
                <p className="text-xs text-slate-500">Preview not available in this demo</p>
              </div>
            </div>
          </div>

          {resolvedStatus === 'Rejected' && document.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-sm font-bold text-red-800 mb-1">Rejection Reason</div>
              <div className="text-sm text-red-700">{document.rejectionReason}</div>
            </div>
          )}
        </div>

        {isPending && (
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-3 rounded-b-xl">
            <button onClick={onReject}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition-colors relative overflow-hidden"
            >
        <Ripple color="rgba(0, 0, 0, 0.1)" />
              <XCircle className="w-4 h-4" /> Reject
            </button>
            <button onClick={onVerify}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg hover:bg-green-700 transition-colors shadow-sm relative overflow-hidden"
            >
        <Ripple color="rgba(255, 255, 255, 0.3)" />
              <CheckCircle2 className="w-4 h-4" /> Verify Document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
