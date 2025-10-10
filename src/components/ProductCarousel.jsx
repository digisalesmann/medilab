// src/components/ProductCarousel.jsx
import React from 'react';
import { ShoppingBag, ArrowRight, X, Plus } from 'lucide-react';

/**
 * Reusable Product Carousel Component for Recommendations/Wishlist
 *
 * NOTE: Requires the custom 'hide-scrollbar' utility in your global CSS.
 */
export default function ProductCarousel({
  title,
  subtitle,
  products = [],
  showWishlistActions = false,
  onAction,
  sectionId,
}) {

  if (!products || products.length === 0) return null;

  return (
    <section className="mt-8 sm:mt-12 bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-xl border" aria-labelledby={`${sectionId}-heading`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h2 id={`${sectionId}-heading`} className="text-lg sm:text-xl font-bold text-gray-900">{title}</h2>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500">{subtitle}</p>}
        </div>
        <button className="text-xs sm:text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1">
          View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Horizontal scroll container - NOTE THE 'hide-scrollbar' class */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-5 sm:px-5 hide-scrollbar">
        {products.map((p, index) => (
          <div key={p.id} className="w-44 sm:w-52 bg-gray-50 border rounded-lg sm:rounded-xl p-3 flex-shrink-0 hover:shadow-lg transition relative">
            
            {/* Tag/Badge (e.g., HOT, SALE) */}
            {p.tag && (
                <span className={`absolute top-0 left-0 text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-br-lg z-10 ${p.tag.includes('OFF') ? 'bg-rose-500 text-white' : 'bg-emerald-500 text-white'}`}>
                {p.tag}
              </span>
            )}

            <div className="h-24 sm:h-28 w-full bg-gray-200 rounded-md flex items-center justify-center">
                <img 
                    src={p.image || '/images/default.jpg'} 
                    alt={p.name} 
                    // **KEY CHANGE: Ensure w-full is present.**
                    className="object-contain w-full h-full p-2" 
                    onError={(e) => e.target.src='/images/default.jpg'}
                />
            </div>
            <h3 className="text-sm font-medium mt-3 line-clamp-2 text-gray-800 h-10">{p.name}</h3>
            
            <div className="text-base sm:text-lg text-emerald-700 font-bold mt-1">₦{p.price.toLocaleString()}</div>
            {p.originalPrice && (
                <div className="text-xs text-gray-500 line-through">₦{p.originalPrice.toLocaleString()}</div>
            )}

            <div className="mt-3">
              {showWishlistActions ? (
                // Actions for WISHLIST section (Move to Cart / Remove)
                <div className="flex gap-2">
                    <button
                        onClick={() => onAction(p, 'move', sectionId)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                        aria-label={`Move ${p.name} to cart`}
                    >
                        <ShoppingBag className='w-3 h-3 sm:w-4 sm:h-4'/> Move
                    </button>
                    <button
                        onClick={() => onAction(p, 'remove', sectionId)}
                        className="p-1.5 rounded-lg border text-gray-500 hover:text-rose-600 hover:border-rose-300 transition"
                        aria-label={`Remove ${p.name} from wishlist`}
                    >
                        <X className='w-4 h-4'/>
                    </button>
                </div>
              ) : (
                // Default action for Recommended sections (Add to Cart)
                <button
                  onClick={() => onAction(p, 'add', sectionId)}
                  className="w-full py-2 px-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-1"
                >
                  <Plus className='w-4 h-4'/> Add to Cart
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}