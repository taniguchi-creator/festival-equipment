import React from 'react';
import { X, Mail, CheckCircle2, AlertTriangle, Copy, Send } from 'lucide-react';

export default function EmailNotifyModal({ email, isOpen, onClose, onShowToast }) {
  if (!isOpen || !email) return null;

  const isApproved = email.type === 'approved';

  const handleCopy = () => {
    navigator.clipboard.writeText(email.body);
    if (onShowToast) onShowToast('メール本文をクリップボードにコピーしました', 'success');
  };

  return (
    <div className="modal-overlay animate-fade-in z-50">
      <div className="modal-content animate-pop-in max-w-lg p-6 relative overflow-hidden border-2 border-indigo-200">
        
        {/* Header gradient bar */}
        <div className={`absolute top-0 left-0 right-0 h-2 ${isApproved ? 'bg-emerald-500' : 'bg-rose-500'}`} />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Status Badge */}
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
          }`}>
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              自動送信メールプレビュー
            </span>
            <h3 className="font-bold text-base text-slate-900">
              {isApproved ? '申請結果通知（承認）' : '申請結果通知（棄却）'}
            </h3>
          </div>
        </div>

        {/* Email Header Info */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 mb-4 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-bold">宛先 (To):</span>
            <span className="text-indigo-600 font-bold">{email.to}</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
            <span className="text-slate-400 font-bold">差出人 (From):</span>
            <span className="text-slate-700 font-semibold">KCS大分 実行委員会 &lt;no-reply@kcs-oita.ac.jp&gt;</span>
          </div>
          <div className="flex items-center justify-between border-t border-slate-200/60 pt-1.5">
            <span className="text-slate-400 font-bold">件名 (Subject):</span>
            <span className="text-slate-900 font-bold">{email.subject}</span>
          </div>
        </div>

        {/* Email Body Text Container */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl mb-4 max-h-60 overflow-y-auto">
          <pre className="whitespace-pre-wrap font-sans text-xs text-slate-700 leading-relaxed">
            {email.body}
          </pre>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={handleCopy}
            className="btn btn-secondary text-xs py-2 px-3 rounded-xl flex items-center gap-1.5"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>本文をコピー</span>
          </button>

          <button
            onClick={onClose}
            className="btn btn-primary text-xs py-2 px-5 rounded-xl font-bold"
          >
            閉じる
          </button>
        </div>

      </div>
    </div>
  );
}
