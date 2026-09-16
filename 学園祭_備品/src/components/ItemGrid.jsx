import React, { useState, useMemo } from 'react';
import { 
  Utensils, 
  Gamepad2, 
  PenTool, 
  Layout, 
  Box, 
  Plus, 
  Check, 
  AlertCircle,
  Filter,
  Sparkles,
  Info
} from 'lucide-react';
import { CATEGORIES } from '../services/seedData';

// Map category to graphic styling and icon
const categoryMeta = {
  "調理器具・飲食": { icon: Utensils, gradient: "from-amber-500 to-orange-600", bgLight: "bg-amber-50 text-amber-700" },
  "ゲーム・アミューズメント": { icon: Gamepad2, gradient: "from-purple-500 to-indigo-600", bgLight: "bg-purple-50 text-purple-700" },
  "文房具・事務用品": { icon: PenTool, gradient: "from-cyan-500 to-blue-600", bgLight: "bg-cyan-50 text-cyan-700" },
  "装飾・会場設営": { icon: Layout, gradient: "from-emerald-500 to-teal-600", bgLight: "bg-emerald-50 text-emerald-700" },
};

export default function ItemGrid({
  equipmentList,
  searchQuery,
  onSelectItem,
  cartItems,
  onAddToCart
}) {
  const [selectedCategory, setSelectedCategory] = useState("すべて");

  // Fuzzy search and category filter algorithm
  const filteredList = useMemo(() => {
    return equipmentList.filter(item => {
      // Category filter
      if (selectedCategory !== "すべて" && item.category !== selectedCategory) {
        return false;
      }
      // Search query fuzzy match
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const catMatch = item.category.toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        return nameMatch || catMatch || descMatch;
      }
      return true;
    });
  }, [equipmentList, selectedCategory, searchQuery]);

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Category Pills Header */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full sm:w-auto">
          {CATEGORIES.map((cat, idx) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md scale-105'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat === "すべて" && <Filter className="w-3.5 h-3.5 text-indigo-400" />}
                {cat}
              </button>
            );
          })}
        </div>
        
        <div className="text-xs text-slate-500 font-medium">
          該当備品: <span className="font-bold text-slate-900">{filteredList.length}</span> 件
        </div>
      </div>

      {/* Grid View */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <Box className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">条件に該当する備品が見つかりませんでした</h3>
          <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
            検索キーワード「{searchQuery}」を変更するか、カテゴリフィルターをリセットしてください。
          </p>
          <button
            onClick={() => { setSelectedCategory("すべて"); }}
            className="mt-4 btn btn-secondary text-xs"
          >
            フィルターをリセット
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredList.map((item) => {
            const meta = categoryMeta[item.category] || { icon: Box, gradient: "from-indigo-500 to-purple-600", bgLight: "bg-indigo-50 text-indigo-700" };
            const CategoryIcon = meta.icon;
            
            const isInCart = cartItems.some(c => c.id === item.id);
            const isOutOfStock = item.stock <= 0;
            const isLowStock = item.stock > 0 && item.stock <= 3;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:-translate-y-1 relative"
              >
                {/* Visual Header Banner */}
                <div className={`h-24 bg-gradient-to-br ${meta.gradient} p-4 flex items-between justify-between relative overflow-hidden`}>
                  <div className="absolute right-0 bottom-0 opacity-15 transform translate-x-3 translate-y-3">
                    <CategoryIcon className="w-24 h-24 text-white" />
                  </div>
                  
                  <span className="inline-flex items-center gap-1 bg-black/30 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full border border-white/20">
                    <CategoryIcon className="w-3 h-3" />
                    {item.category}
                  </span>

                  {/* Stock Tag */}
                  <div>
                    {isOutOfStock ? (
                      <span className="badge badge-danger shadow-sm">
                        在庫なし
                      </span>
                    ) : isLowStock ? (
                      <span className="badge badge-warning shadow-sm">
                        残り{item.stock}{item.unit}
                      </span>
                    ) : (
                      <span className="badge badge-success shadow-sm">
                        在庫: {item.stock}{item.unit}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 
                      onClick={() => onSelectItem(item)}
                      className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 min-h-[36px]">
                      {item.description || `${item.name}の貸出申請が可能です。`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onSelectItem(item)}
                      className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1 transition-colors"
                    >
                      <Info className="w-3.5 h-3.5" />
                      詳細
                    </button>

                    <button
                      disabled={isOutOfStock}
                      onClick={() => onSelectItem(item)}
                      className={`btn text-xs py-1.5 px-3 rounded-xl transition-all ${
                        isOutOfStock
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : isInCart
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                          : 'btn-primary'
                      }`}
                    >
                      {isOutOfStock ? (
                        <span>貸出不可</span>
                      ) : isInCart ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>追加済み</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>申請指定</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </section>
  );
}
