import React, { useState } from 'react';
import { X, UserCheck, ShieldCheck, Sparkles, Mail, Lock, User, GraduationCap } from 'lucide-react';
import { loginUser, signupUser, getClassList } from '../services/storage';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const classes = getClassList();

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email) {
      setErrorMsg('メールアドレスを入力してください');
      return;
    }

    if (isSignUp) {
      if (!name) {
        setErrorMsg('氏名を入力してください');
        return;
      }
      if (!selectedClass) {
        setErrorMsg('所属クラスを選択してください');
        return;
      }
      const res = signupUser({ name, className: selectedClass, email, password });
      onAuthSuccess(res.user);
      onClose();
    } else {
      const res = loginUser(email, password);
      onAuthSuccess(res.user);
      onClose();
    }
  };

  const handleQuickAdminLogin = () => {
    const res = loginUser('admin@kcs.ac.jp', 'admin123');
    onAuthSuccess(res.user);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-pop-in relative overflow-hidden p-6 sm:p-8">
        
        {/* Decorative header gradient background */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400" />
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mb-3 shadow-sm border border-indigo-100">
            <UserCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            {isSignUp ? '学生アカウント新規登録' : 'サインイン'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            KCS大分情報専門学校 学園祭備品管理ポータル
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5 text-xs font-semibold">
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg transition-all ${
              !isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => { setIsSignUp(false); setErrorMsg(''); }}
          >
            サインイン
          </button>
          <button
            type="button"
            className={`flex-1 py-2 rounded-lg transition-all ${
              isSignUp ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
            onClick={() => { setIsSignUp(true); setErrorMsg(''); }}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  氏名 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="例: 大分 太郎"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  所属クラス・学科 <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="input-field pl-10 bg-white"
                  >
                    <option value="">クラスを選択してください</option>
                    {classes.map((cls, idx) => (
                      <option key={idx} value={cls}>
                        {cls}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              メールアドレス <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                placeholder="oita.t@kcs-oita.ac.jp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              パスワード
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn btn-primary py-3 text-sm rounded-xl mt-2"
          >
            {isSignUp ? '新規登録してサインイン' : 'サインイン'}
          </button>
        </form>

        {/* Quick Admin Access Button */}
        <div className="mt-6 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 font-semibold px-3 py-1.5 rounded-lg transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>【デモ用】管理者アカウントでワンクリックログイン</span>
          </button>
        </div>

      </div>
    </div>
  );
}
