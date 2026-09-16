import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  PackageCheck, 
  Users, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Mail, 
  FileText, 
  Search,
  Filter,
  Check,
  AlertTriangle,
  Send
} from 'lucide-react';
import { 
  getApplications, 
  approveApplication, 
  rejectApplication, 
  getEquipmentList, 
  addEquipmentItem, 
  updateEquipmentItem, 
  deleteEquipmentItem, 
  resetEquipmentToSeed,
  getClassList,
  addClassItem,
  deleteClassItem,
  getSentEmails
} from '../services/storage';
import { CATEGORIES } from '../services/seedData';

export default function AdminDashboard({ onTriggerEmailPreview, onShowToast }) {
  const [activeTab, setActiveTab] = useState('pending'); // pending, history, equipment, classes
  
  // Data states
  const [applications, setApplications] = useState(getApplications());
  const [equipmentList, setEquipmentList] = useState(getEquipmentList());
  const [classList, setClassList] = useState(getClassList());
  const [sentEmails, setSentEmails] = useState(getSentEmails());

  // Equipment Form Modal / State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIES[1]);
  const [newItemStock, setNewItemStock] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('個');
  const [newItemDesc, setNewItemDesc] = useState('');

  // Class Form State
  const [newClassName, setNewClassName] = useState('');

  // Equipment Search State
  const [equipSearch, setEquipSearch] = useState('');

  // Re-fetch data helper
  const reloadAll = () => {
    setApplications(getApplications());
    setEquipmentList(getEquipmentList());
    setClassList(getClassList());
    setSentEmails(getSentEmails());
  };

  // --- Actions ---
  const handleApprove = (appId) => {
    const res = approveApplication(appId);
    if (res.success) {
      reloadAll();
      onShowToast(`申請 (${appId}) を承認しました。在庫が更新され、結果メールが自動送信されました！`, 'success');
      if (res.email) {
        onTriggerEmailPreview(res.email);
      }
    } else {
      onShowToast(res.message || '処理に失敗しました', 'danger');
    }
  };

  const handleReject = (appId) => {
    const reason = window.prompt('棄却理由を入力してください（オプション）:', '他団体との使用バッティングのため');
    if (reason === null) return; // user cancelled prompt

    const res = rejectApplication(appId, reason);
    if (res.success) {
      reloadAll();
      onShowToast(`申請 (${appId}) を棄却しました。通知メールを送信しました。`, 'warning');
      if (res.email) {
        onTriggerEmailPreview(res.email);
      }
    }
  };

  const handleAddEquipment = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    addEquipmentItem({
      name: newItemName,
      category: newItemCategory,
      stock: newItemStock,
      unit: newItemUnit,
      description: newItemDesc
    });
    setNewItemName('');
    setNewItemDesc('');
    setShowAddModal(false);
    reloadAll();
    onShowToast(`備品「${newItemName}」をマスタに追加しました！`, 'success');
  };

  const handleDeleteEquipment = (id, name) => {
    if (window.confirm(`備品「${name}」を完全に削除してもよろしいですか？`)) {
      deleteEquipmentItem(id);
      reloadAll();
      onShowToast(`備品「${name}」を削除しました`, 'warning');
    }
  };

  const handleResetEquipment = () => {
    if (window.confirm('List.mdの初期データ（117点）にマスタを完全リセットしますか？')) {
      resetEquipmentToSeed();
      reloadAll();
      onShowToast('備品マスタを初期データにリセットしました', 'success');
    }
  };

  const handleAddClass = (e) => {
    e.preventDefault();
    if (!newClassName.trim()) return;
    addClassItem(newClassName.trim());
    setNewClassName('');
    reloadAll();
    onShowToast(`クラス「${newClassName}」を追加しました`, 'success');
  };

  const handleDeleteClass = (className) => {
    deleteClassItem(className);
    reloadAll();
    onShowToast(`クラス「${className}」を削除しました`, 'warning');
  };

  const pendingApps = applications.filter(a => a.status === 'pending');
  const processedApps = applications.filter(a => a.status !== 'pending');

  const filteredEquip = equipmentList.filter(e => 
    e.name.toLowerCase().includes(equipSearch.toLowerCase()) ||
    e.category.toLowerCase().includes(equipSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl mb-8 border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
          <ShieldCheck className="w-80 h-80 text-white" />
        </div>
        
        <div>
          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 text-xs font-bold px-3 py-1 rounded-full border border-amber-500/30 mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            学園祭実行委員会 管理者専用パネル
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            備品貸出承認 ＆ マスタ管理
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            未承認申請の審査・自動メール返信・在庫減算・クラスマスタ管理を一元化
          </p>
        </div>

        {/* Quick Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 text-center flex-1 sm:flex-initial min-w-[110px]">
            <div className="text-xs text-slate-400 font-semibold">未承認申請</div>
            <div className="text-2xl font-black text-amber-400">{pendingApps.length}</div>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md px-4 py-3 rounded-2xl border border-slate-700 text-center flex-1 sm:flex-initial min-w-[110px]">
            <div className="text-xs text-slate-400 font-semibold">総登録備品</div>
            <div className="text-2xl font-black text-cyan-300">{equipmentList.length}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pending'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>申請審査 (未承認)</span>
          {pendingApps.length > 0 && (
            <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full">
              {pendingApps.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <PackageCheck className="w-4 h-4" />
          <span>処理済み履歴・送信メール</span>
        </button>

        <button
          onClick={() => setActiveTab('equipment')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'equipment'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>備品マスタ管理 ({equipmentList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('classes')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'classes'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>クラスマスタ管理 ({classList.length})</span>
        </button>
      </div>

      {/* --- TAB 1: PENDING APPLICATIONS --- */}
      {activeTab === 'pending' && (
        <div className="space-y-4">
          {pendingApps.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-sm">
              <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">未処理の申請はありません</h3>
              <p className="text-xs text-slate-500 mt-1">
                学生からの新しい貸出申請が届くとここに表示されます。
              </p>
            </div>
          ) : (
            pendingApps.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl border-2 border-amber-200/80 shadow-md p-5 sm:p-6 transition-all hover:border-amber-400"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-extrabold text-sm text-indigo-900 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                        {app.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        申請日時: {new Date(app.createdAt).toLocaleString('ja-JP')}
                      </span>
                    </div>
                    
                    <h3 className="text-base font-bold text-slate-900">
                      {app.userClass} / {app.userName} 様
                    </h3>
                    <div className="text-xs text-indigo-600 font-medium flex items-center gap-1 mt-0.5">
                      <Mail className="w-3.5 h-3.5" />
                      {app.userEmail}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReject(app.id)}
                      className="btn btn-danger py-2 px-4 text-xs sm:text-sm rounded-xl"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>棄却する</span>
                    </button>
                    
                    <button
                      onClick={() => handleApprove(app.id)}
                      className="btn btn-success py-2 px-5 text-xs sm:text-sm rounded-xl font-bold"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>承認して在庫更新</span>
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
                  
                  {/* Items List */}
                  <div className="lg:col-span-2 bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <div className="text-xs font-bold text-slate-700 mb-2">
                      【申請備品および数量】
                    </div>
                    <div className="space-y-1.5">
                      {app.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs">
                          <span className="font-bold text-slate-800">{item.name}</span>
                          <span className="font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {item.quantity} {item.unit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purpose & Dates */}
                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/80 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-indigo-950 block">使用目的:</span>
                      <p className="text-slate-700 font-medium mt-0.5">{app.purpose}</p>
                    </div>
                    <div className="pt-2 border-t border-indigo-100">
                      <span className="font-bold text-indigo-950 block">貸出希望期間:</span>
                      <p className="text-indigo-800 font-bold mt-0.5">{app.startDate} ～ {app.endDate}</p>
                    </div>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* --- TAB 2: HISTORY & SENT EMAILS --- */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <PackageCheck className="w-5 h-5 text-indigo-600" />
              審査処理済み 過去申請履歴 ({processedApps.length})
            </h3>
            
            {processedApps.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">処理済みの申請履歴はまだありません。</p>
            ) : (
              <div className="space-y-3">
                {processedApps.map(app => (
                  <div key={app.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{app.id}</span>
                        <span className={`badge ${app.status === 'approved' ? 'badge-success' : 'badge-danger'}`}>
                          {app.status === 'approved' ? '承認済み (在庫更新済)' : '棄却'}
                        </span>
                        <span className="text-slate-400">{app.userName} ({app.userClass})</span>
                      </div>
                      <div className="text-slate-600 mt-1">
                        備品: {app.items.map(i => `${i.name} (${i.quantity}${i.unit})`).join(', ')}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        const email = sentEmails.find(e => e.subject.includes(app.id));
                        if (email) onTriggerEmailPreview(email);
                      }}
                      className="btn btn-secondary text-xs py-1 px-3 self-start sm:self-center"
                    >
                      <Mail className="w-3.5 h-3.5 text-indigo-600" />
                      送信メール確認
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- TAB 3: EQUIPMENT MASTER --- */}
      {activeTab === 'equipment' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="備品名で絞り込み..."
                value={equipSearch}
                onChange={(e) => setEquipSearch(e.target.value)}
                className="input-field pl-10 text-xs"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary text-xs py-2 px-4 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                新規備品を追加
              </button>

              <button
                onClick={handleResetEquipment}
                className="btn btn-secondary text-xs py-2 px-3 rounded-xl text-slate-600"
                title="List.md の117件初期データにリセット"
              >
                <RotateCcw className="w-4 h-4" />
                初期リセット
              </button>
            </div>
          </div>

          {/* Add Modal */}
          {showAddModal && (
            <div className="bg-indigo-50 border-2 border-indigo-200 p-5 rounded-2xl space-y-3 animate-fade-in">
              <h4 className="font-bold text-slate-900 text-sm">新規備品データの追加</h4>
              <form onSubmit={handleAddEquipment} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="備品名 (例: 寸胴鍋30cm)"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="input-field text-xs bg-white"
                  required
                />
                <select
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="input-field text-xs bg-white"
                >
                  {CATEGORIES.filter(c => c !== 'すべて').map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="初期在庫数"
                  value={newItemStock}
                  onChange={(e) => setNewItemStock(e.target.value)}
                  className="input-field text-xs bg-white"
                  min="0"
                  required
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="単位 (個/箱/枚)"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="input-field text-xs bg-white flex-1"
                  />
                  <button type="submit" className="btn btn-success text-xs py-2 px-4 rounded-xl shrink-0">
                    保存
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Equipment Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">備品名</th>
                    <th className="p-3">カテゴリ</th>
                    <th className="p-3">現在在庫</th>
                    <th className="p-3">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEquip.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono text-slate-400">#{item.id}</td>
                      <td className="p-3 font-bold text-slate-900">{item.name}</td>
                      <td className="p-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-[11px]">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`font-bold ${item.stock <= 0 ? 'text-rose-600 font-extrabold' : 'text-emerald-700'}`}>
                          {item.stock} {item.unit}
                        </span>
                      </td>
                      <td className="p-3">
                        <button
                          onClick={() => handleDeleteEquipment(item.id, item.name)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50 transition-colors"
                          title="削除"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* --- TAB 4: CLASS MASTER --- */}
      {activeTab === 'classes' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm max-w-2xl">
            <h3 className="font-bold text-slate-900 text-base mb-3">申請可能クラス・学科マスタの管理</h3>
            
            <form onSubmit={handleAddClass} className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="新規クラス名 (例: N1A (ネットワーク科 1年))"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                className="input-field text-xs flex-1"
                required
              />
              <button type="submit" className="btn btn-primary text-xs py-2 px-4 rounded-xl shrink-0">
                <Plus className="w-4 h-4" />
                クラスを追加
              </button>
            </form>

            <div className="space-y-2">
              {classList.map((cls, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-800">{cls}</span>
                  <button
                    onClick={() => handleDeleteClass(cls)}
                    className="text-rose-500 hover:text-rose-700 p-1 rounded hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
