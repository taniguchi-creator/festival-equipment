import React from 'react';
import { X, Clock, CheckCircle2, XCircle, Package } from 'lucide-react';
import { getApplications } from '../services/storage';

export default function MyRequestsModal({ isOpen, onClose, currentUser }) {
  if (!isOpen || !currentUser) return null;

  const allApps = getApplications();
  const myApps = allApps.filter(a => a.userEmail === currentUser.email);

  return (
    <div className="modal-overlay animate-fade-in z-50">
      <div className="modal-content animate-pop-in max-w-xl p-6 relative overflow-hidden">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">自分の備品貸出申請履歴</h2>
            <p className="text-xs text-slate-500">{currentUser.name} 様の申請状況</p>
          </div>
        </div>

        {myApps.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-600">まだ貸出申請の送信履歴がありません</p>
            <p className="text-[11px] text-slate-400 mt-1">借りたい備品をカートに追加して申請してください。</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
            {myApps.map((app) => (
              <div
                key={app.id}
                className="bg-white border border-slate-200 rounded-xl p-4 space-y-2 hover:border-indigo-200 transition-colors shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded border border-indigo-100">
                    {app.id}
                  </span>

                  <span className={`badge ${
                    app.status === 'approved' 
                      ? 'badge-success' 
                      : app.status === 'rejected' 
                      ? 'badge-danger' 
                      : 'badge-warning'
                  }`}>
                    {app.status === 'approved' && <CheckCircle2 className="w-3 h-3 mr-1 inline" />}
                    {app.status === 'rejected' && <XCircle className="w-3 h-3 mr-1 inline" />}
                    {app.status === 'pending' && <Clock className="w-3 h-3 mr-1 inline" />}
                    {app.status === 'approved' ? '承認完了' : app.status === 'rejected' ? '棄却' : '審査待ち'}
                  </span>
                </div>

                <div className="text-xs text-slate-800 font-bold">
                  申請備品: {app.items.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ')}
                </div>

                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg">
                  <div>目的: {app.purpose}</div>
                  <div>貸出希望日時: {app.startDate} ～ {app.endDate}</div>
                  {app.rejectReason && (
                    <div className="text-rose-600 font-semibold mt-1">棄却理由: {app.rejectReason}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 text-right">
          <button onClick={onClose} className="btn btn-secondary text-xs py-2 px-4 rounded-xl">
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
}
