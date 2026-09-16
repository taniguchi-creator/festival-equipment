import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ItemGrid from './components/ItemGrid';
import ItemDetailModal from './components/ItemDetailModal';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import EmailNotifyModal from './components/EmailNotifyModal';
import MyRequestsModal from './components/MyRequestsModal';
import { 
  getCurrentUser, 
  setCurrentUser, 
  getEquipmentList, 
  initStorage 
} from './services/storage';
import { Sparkles, ShoppingBag, CheckCircle2, ShieldAlert, ArrowRight, Box } from 'lucide-react';

export default function App() {
  // Initialize storage
  useEffect(() => {
    initStorage();
  }, []);

  // App Global State
  const [currentUser, setUser] = useState(getCurrentUser());
  const [isAdminView, setIsAdminView] = useState(false);
  const [equipmentList, setEquipmentList] = useState(getEquipmentList());
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMyRequestsOpen, setIsMyRequestsOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState(null);
  const [emailToPreview, setEmailToPreview] = useState(null);

  // Toast Notification state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const reloadEquipment = () => {
    setEquipmentList(getEquipmentList());
  };

  // Cart Handlers
  const handleAddToCart = (item, quantity) => {
    setCartItems(prev => {
      const idx = prev.findIndex(c => c.id === item.id);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], quantity };
        return updated;
      } else {
        return [...prev, { ...item, quantity }];
      }
    });
    showToast(`「${item.name}」(${quantity}${item.unit}) を申請カートに追加しました`, 'success');
  };

  const handleRemoveFromCart = (id) => {
    setCartItems(prev => prev.filter(c => c.id !== id));
    showToast('カートから備品を削除しました', 'info');
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAuthSuccess = (user) => {
    setUser(user);
    if (user.isAdmin) {
      setIsAdminView(true);
      showToast(`管理者「${user.name}」としてログインしました`, 'success');
    } else {
      showToast(`「${user.name}」様、ログインしました`, 'success');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
    setIsAdminView(false);
    showToast('ログアウトしました', 'info');
  };

  const handleApplicationSubmitted = (app) => {
    showToast(`申請 (${app.id}) を管理者に送信しました！結果はメールにて届きます。`, 'success');
    reloadEquipment();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-indigo-500 selection:text-white">
      
      {/* Toast Alert Popup */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-pop-in">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl border flex items-center gap-3 text-xs sm:text-sm font-bold ${
            toast.type === 'success'
              ? 'bg-emerald-900 text-emerald-100 border-emerald-700'
              : toast.type === 'danger'
              ? 'bg-rose-900 text-rose-100 border-rose-700'
              : toast.type === 'warning'
              ? 'bg-amber-900 text-amber-100 border-amber-700'
              : 'bg-slate-900 text-slate-100 border-slate-700'
          }`}>
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <Header
        currentUser={currentUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cartItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenMyRequests={() => setIsMyRequestsOpen(true)}
        onOpenAdmin={() => setIsAdminView(true)}
        onLogout={handleLogout}
        isAdminView={isAdminView}
        setIsAdminView={setIsAdminView}
      />

      {/* Main View Area */}
      <main className="flex-1">
        
        {isAdminView && currentUser?.isAdmin ? (
          /* ADMIN DASHBOARD VIEW */
          <AdminDashboard
            onTriggerEmailPreview={(email) => setEmailToPreview(email)}
            onShowToast={showToast}
          />
        ) : (
          /* GENERAL STUDENT VIEW */
          <>
            {/* Hero Section Banner */}
            <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-800 relative overflow-hidden">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                <div className="space-y-3 max-w-2xl text-center md:text-left">
                  <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/30">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                    KCS大分情報専門学校 学園祭備品管理公式ポータル
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                    学園祭の準備・演出に必要な<br className="hidden sm:block" />
                    備品をスマホからカンタン貸出申請
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    調理器具、ダーツ・ゲーム道具、文房具、モール・装飾用シートまで全110点以上を網羅。
                    使用目的と希望期間を指定して申請するだけで、実行委員会による承認通知が届きます。
                  </p>
                </div>

                {/* Call to action card */}
                <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-2xl w-full md:w-80 shadow-xl space-y-3 shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-400/20 text-cyan-300 flex items-center justify-center font-bold">
                      <Box className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-300 font-medium">登録備品数</div>
                      <div className="text-lg font-black text-white">{equipmentList.length} 種類以上</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-slate-300">カート内: {cartItems.length}件</span>
                    <button
                      onClick={() => setIsCartOpen(true)}
                      className="text-cyan-300 hover:text-white font-bold flex items-center gap-1 transition-colors"
                    >
                      <span>申請手続きへ</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Equipment Grid Section */}
            <ItemGrid
              equipmentList={equipmentList}
              searchQuery={searchQuery}
              onSelectItem={(item) => setSelectedDetailItem(item)}
              cartItems={cartItems}
              onAddToCart={handleAddToCart}
            />
          </>
        )}

      </main>

      {/* App Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-semibold text-slate-300">
            KCS大分情報専門学校 学園祭 備品貸出管理システム
          </p>
          <p className="text-[11px] text-slate-500">
            &copy; 2026 KCS Oita Information College. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <ItemDetailModal
        item={selectedDetailItem}
        isOpen={!!selectedDetailItem}
        onClose={() => setSelectedDetailItem(null)}
        onAddToCart={handleAddToCart}
        cartItems={cartItems}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveFromCart={handleRemoveFromCart}
        onClearCart={handleClearCart}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onApplicationSubmitted={handleApplicationSubmitted}
      />

      <EmailNotifyModal
        email={emailToPreview}
        isOpen={!!emailToPreview}
        onClose={() => setEmailToPreview(null)}
        onShowToast={showToast}
      />

      <MyRequestsModal
        isOpen={isMyRequestsOpen}
        onClose={() => setIsMyRequestsOpen(false)}
        currentUser={currentUser}
      />

    </div>
  );
}
