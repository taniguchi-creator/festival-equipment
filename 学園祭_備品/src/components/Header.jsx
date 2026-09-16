import React from 'react';
import { 
  Search, 
  ShoppingCart, 
  User, 
  ShieldCheck, 
  LogOut, 
  Box, 
  Clock, 
  Sparkles,
  UserPlus
} from 'lucide-react';

export default function Header({
  currentUser,
  searchQuery,
  setSearchQuery,
  cartCount,
  onOpenCart,
  onOpenAuth,
  onOpenMyRequests,
  onOpenAdmin,
  onLogout,
  isAdminView,
  setIsAdminView
}) {
  return (
    <header className="glass-nav sticky top-0 z-50 text-white shadow-lg transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3 gap-4">
          
          {/* Logo & Title */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setIsAdminView(false)}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-indigo-100 to-cyan-200 bg-clip-text text-transparent">
                  KCS学園祭 備品管理
                </span>
                <span className="bg-indigo-500/30 text-indigo-200 text-xs px-2 py-0.5 rounded-full border border-indigo-400/30 font-semibold hidden sm:inline-block">
                  大分校
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden md:block">
                学生用 備品貸出・申請ポータル
              </p>
            </div>
          </div>

          {/* Fuzzy Search Bar (Only on general view) */}
          {!isAdminView && (
            <div className="flex-1 max-w-md mx-2 sm:mx-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="備品名・キーワードであいまい検索... (例: 鍋, ダーツ, テープ)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 hover:bg-slate-800 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2 rounded-full border border-slate-700/80 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 transition-all shadow-inner"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Switch Button */}
            {currentUser?.isAdmin && (
              <button
                onClick={() => setIsAdminView(!isAdminView)}
                className={`flex items-center gap-1.5 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-lg transition-all border ${
                  isAdminView
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-indigo-500/20 text-indigo-200 border-indigo-500/30 hover:bg-indigo-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isAdminView ? '一般画面へ戻る' : '管理者ダッシュボード'}</span>
              </button>
            )}

            {/* My Requests (General User) */}
            {currentUser && !isAdminView && (
              <button
                onClick={onOpenMyRequests}
                className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                title="自分の申請履歴"
              >
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="hidden lg:inline">申請履歴</span>
              </button>
            )}

            {/* Cart Icon */}
            {!isAdminView && (
              <button
                onClick={onOpenCart}
                className="relative p-2 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 transition-all hover:scale-105 active:scale-95"
                title="申請カートを見る"
              >
                <ShoppingCart className="w-5 h-5 text-cyan-300" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 animate-bounce shadow-md">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* User Profile / Auth Toggle */}
            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-700/80">
                <div className="hidden md:block text-right">
                  <div className="text-xs font-bold text-slate-200 truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-cyan-300/80 truncate max-w-[130px]">
                    {currentUser.className || (currentUser.isAdmin ? '管理者' : '一般')}
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="ログアウト"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="btn btn-primary text-xs sm:text-sm py-1.5 px-3 sm:px-4 rounded-xl shadow-lg"
              >
                <UserPlus className="w-4 h-4" />
                <span>サインイン / 登録</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
}
