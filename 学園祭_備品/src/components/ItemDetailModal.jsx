import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingCart, Check, Info, Box } from 'lucide-react';

export default function ItemDetailModal({ item, isOpen, onClose, onAddToCart, cartItems }) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (item) {
      const existingInCart = cartItems.find(c => c.id === item.id);
      setQuantity(existingInCart ? existingInCart.quantity : 1);
    }
  }, [item, cartItems]);

  if (!isOpen || !item) return null;

  const maxStock = item.stock || 0;
  const isOutOfStock = maxStock <= 0;

  const handleAdd = () => {
    onAddToCart(item, quantity);
    onClose();
  };

  return (
    <div className="modal-overlay animate-fade-in">
      <div className="modal-content animate-pop-in relative overflow-hidden p-6 max-w-lg">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Box className="w-6 h-6" />
          </div>
          <div>
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full mb-1">
              {item.category}
            </span>
            <h2 className="text-xl font-bold text-slate-900 leading-snug">
              {item.name}
            </h2>
          </div>
        </div>

        {/* Description & Stock */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-5 space-y-3">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-slate-500 font-medium">現在の利用可能在庫</span>
            <span className={`font-bold px-2.5 py-1 rounded-full text-xs ${
              isOutOfStock 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {isOutOfStock ? '在庫切れ (0)' : `${maxStock} ${item.unit}`}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200/60">
            <div className="text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-indigo-500" />
              備品の説明・注意事項
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {item.description || '学園祭期間中の安全な取り扱いをお願いします。'}
            </p>
          </div>
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="mb-6">
            <label className="block text-xs font-bold text-slate-700 mb-2">
              申請希望個数 <span className="text-slate-400 font-normal">（上限: {maxStock}{item.unit}）</span>
            </label>
            <div className="flex items-center justify-between bg-white border-2 border-slate-200 rounded-xl p-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="text-center font-extrabold text-slate-900 text-lg">
                {quantity} <span className="text-xs font-semibold text-slate-500">{item.unit}</span>
              </div>

              <button
                type="button"
                onClick={() => setQuantity(Math.min(maxStock, quantity + 1))}
                className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Modal Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn btn-secondary py-2.5 rounded-xl text-xs sm:text-sm"
          >
            キャンセル
          </button>
          
          <button
            disabled={isOutOfStock}
            onClick={handleAdd}
            className={`flex-1 btn py-2.5 rounded-xl text-xs sm:text-sm ${
              isOutOfStock
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'btn-primary'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>カートに追加して指定</span>
          </button>
        </div>

      </div>
    </div>
  );
}
