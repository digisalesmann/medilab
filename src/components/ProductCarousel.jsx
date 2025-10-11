import React, { useState } from 'react';
import { ShoppingBag, ArrowRight, X, Plus, Check } from 'lucide-react'; // Added useState and Check icon

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
  // State to track which product ID was recently added to the cart
  const [addedState, setAddedState] = useState(null);

  if (!products || products.length === 0) return null;

  /**
   * Handles the action (add/move/remove) and manages the temporary UI state.
   */
  const handleAction = (product, action, id) => {
    if (action === 'add') {
      // 1. Set the product ID to trigger the 'Added!' UI state
      setAddedState(product.id);
      
      // 2. Clear the 'Added!' state after 2 seconds
      setTimeout(() => {
        setAddedState(null);
      }, 2000); 
    }
    
    // 3. Execute the external handler passed as a prop
    if (onAction) {
      onAction(product, action, id);
    }
  };

  return (
    <section className="mt-8 sm:mt-12 bg-white p-4 sm:p-5 rounded-2xl shadow-2xl border border-gray-100" aria-labelledby={`${sectionId}-heading`}>
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <div>
          <h2 id={`${sectionId}-heading`} className="text-xl sm:text-2xl font-extrabold text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm sm:text-base text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <button className="text-sm sm:text-base font-medium text-emerald-600 hover:text-emerald-800 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal scroll container - NOTE THE 'hide-scrollbar' class */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:-mx-5 sm:px-5 hide-scrollbar">
        {products.map((p, index) => {
          const isAdded = p.id === addedState;

          return (
            <div 
              key={p.id} 
              className="w-44 sm:w-52 bg-white border border-gray-200 rounded-xl p-3 flex-shrink-0 shadow-lg hover:shadow-xl hover:border-emerald-300 transition-all duration-300 relative group"
            >
              
              {/* Tag/Badge (e.g., HOT, SALE) */}
              {p.tag && (
                  <span className={`absolute top-0 left-0 text-[10px] sm:text-xs font-bold px-3 py-1 rounded-tl-xl rounded-br-xl z-10 
                    ${p.tag.includes('OFF') ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                  {p.tag}
                </span>
              )}

              <div className="h-28 w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                      src={p.image || 'https://placehold.co/100x100/e5e7eb/555?text=Product'} 
                      alt={p.name} 
                      className="object-contain w-full h-full p-2 group-hover:scale-[1.03] transition-transform duration-300" 
                      onError={(e) => e.target.src='https://placehold.co/100x100/e5e7eb/555?text=Product'}
                  />
              </div>
              <h3 className="text-sm font-semibold mt-3 line-clamp-2 text-gray-900 h-10">{p.name}</h3>
              
              <div className="text-lg text-emerald-700 font-extrabold mt-1">₦{p.price.toLocaleString()}</div>
              {p.originalPrice && (
                  <div className="text-xs text-gray-500 line-through">₦{p.originalPrice.toLocaleString()}</div>
              )}

              <div className="mt-3">
                {showWishlistActions ? (
                  // Actions for WISHLIST section (Move to Cart / Remove)
                  <div className="flex gap-2">
                      <button
                          onClick={() => handleAction(p, 'move', sectionId)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 text-white text-xs sm:text-sm font-semibold hover:bg-emerald-700 transition flex items-center justify-center gap-1 shadow-md hover:shadow-lg"
                          aria-label={`Move ${p.name} to cart`}
                      >
                          <ShoppingBag className='w-4 h-4'/> Move
                      </button>
                      <button
                          onClick={() => handleAction(p, 'remove', sectionId)}
                          className="p-1.5 rounded-lg border border-gray-300 text-gray-500 hover:text-rose-600 hover:border-rose-600 transition shadow-sm"
                          aria-label={`Remove ${p.name} from wishlist`}
                      >
                          <X className='w-4 h-4'/>
                      </button>
                  </div>
                ) : (
                  // Default action for Recommended sections (Add to Cart)
                  <button
                    onClick={() => handleAction(p, 'add', sectionId)}
                    disabled={isAdded}
                    className={`w-full py-2 px-2 rounded-lg text-white text-sm font-semibold transition flex items-center justify-center gap-1 shadow-md hover:shadow-lg
                        ${isAdded
                            ? 'bg-green-600 cursor-not-allowed transform scale-[0.98]' // Confirmed state
                            : 'bg-emerald-600 hover:bg-emerald-700' // Default state
                        }`
                    }
                  >
                    {isAdded ? (
                      <>
                        <Check className='w-4 h-4'/> Added!
                      </>
                    ) : (
                      <>
                        <Plus className='w-4 h-4'/> Add to Cart
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
