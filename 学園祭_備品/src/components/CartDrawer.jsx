import React, { useState } from 'react';
import { X, Trash2, Send, ShoppingBag, Calendar, FileText, UserCheck, AlertCircle } from 'lucide-react';
import { createApplication } from '../services/storage';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onRemoveFromCart,
  onClearCart,
  currentUser,
  onOpenAuth,
  onApplicationSubmitted
}) {
  const [purpose, setPurpose] = useState('');
  const [startDate, setStartDate] = useState('2026-10-24 09:00');
  const [endDate, setEndDate] = useState('2026-10-24 17:00');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!currentUser) {
      setErrorMsg('申請を送信するにはサインインが必要です');
      onOpenAuth();
      return;
    }

    if (cartItems.length === 0) {
      setErrorMsg('カートに備品が追加されていません');
      return;
    }

    if (!purpose.trim()) {
      setErrorMsg('使用目的を入力してください');
      return;
    }

    if (!startDate || !endDate) {
      setErrorMsg('貸出希望期間（開始・返却日時）を設定してください');
      return;
    }

    const app = createApplication({
      user: currentUser,
      items: cartItems,
      purpose,
      startDate,
      endDate
    });

    onClearCart();
    onApplicationSubmitted(app);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Overlay Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
      />

      <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="pointer-events-auto w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-cyan-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-base text-slate-100">備品貸出 申請カート</h2>
                <p className="text-xs text-slate-400">{cartItems.length}件の備品を選択中</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* User Account Info Bar */}
            {currentUser ? (
              <div className="bg-indigo-50/70 border border-indigo-100 p-3 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-indigo-950">{currentUser.name}</div>
                  <div className="text-indigo-600">{currentUser.userClass || currentUser.className} ({currentUser.email})</div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-amber-800 font-medium">
                  <UserCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>申請前にサインインしてください</span>
                </div>
                <button
                  onClick={onOpenAuth}
                  className="btn btn-primary text-xs py-1 px-3 rounded-lg"
                >
                  サインイン
                </button>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Cart Items List */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  選択した備品リスト
                </h3>
                {cartItems.length > 0 && (
                  <button
                    onClick={onClearCart}
                    className="text-xs text-rose-500 hover:text-rose-700 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    すべてクリア
                  </button>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-500">カートは空です</p>
                  <p className="text-[11px] text-slate-400 mt-1">メイン画面から借りたい備品を選択してください</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((c) => (
                    <div
                      key={c.id}
                      className="bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 shadow-sm hover:border-indigo-200 transition-colors"
                    >
                      <div>
                        <div className="font-bold text-xs text-slate-900">{c.name}</div>
                        <div className="text-[11px] text-indigo-600 font-semibold mt-0.5">
                          申請数量: {c.quantity} {c.unit}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(c.id)}
                        className="text-slate-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Application Details Form (Feature ⑥ Requirement) */}
            {cartItems.length > 0 && (
              <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-indigo-600" />
                    使用目的・用途 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="例: S1Aの模擬店（たこ焼き）での調理用、および看板設営のため"
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="input-field text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    貸出希望期間（開始 ～ 返却予定） <span className="text-rose-500">*</span>
                  </label>
                  
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">受取・貸出開始日時:</span>
                      <input
                        type="text"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="2026-10-24 09:00"
                        className="input-field text-xs py-2"
                        required
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-semibold block mb-0.5">返却予定日時:</span>
                      <input
                        type="text"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        placeholder="2026-10-24 17:00"
                        className="input-field text-xs py-2"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn btn-primary py-3 text-sm rounded-xl font-bold shadow-lg mt-2"
                >
                  <Send className="w-4 h-4" />
                  <span>貸出申請を管理者に送信する</span>
                </button>
              </form>
            )}

          </div>

          {/* Footer Note */}
          <div className="bg-slate-50 p-4 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500">
              ※ 申請送信後、管理者（実行委員会）による承認が行われるとメールが届きます。
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
