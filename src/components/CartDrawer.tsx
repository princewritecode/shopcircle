import React from 'react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight, Truck } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../store';
import { updateQuantity, removeFromCart, clearCart, toggleCartOpen } from '../store/cartSlice';
import { addToast } from '../store/toastSlice';

export const CartDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, isOpen } = useAppSelector(state => state.cart);

  if (!isOpen) return null;

  const totalCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = 75;
  const isFreeShipping = subtotal >= freeShippingThreshold || totalCount === 0;
  const shippingCost = isFreeShipping ? 0 : 10;
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + shippingCost + tax;

  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleCheckout = () => {
    dispatch(addToast({ message: 'Order submitted! Thank you for shopping with ShopCircle.', type: 'success' }));
    dispatch(clearCart());
    dispatch(toggleCartOpen(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(toggleCartOpen(false))}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800 h-full shadow-2xl flex flex-col z-10 text-white animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/70">
          <div className="flex items-center gap-2 font-bold text-base">
            <ShoppingBag className="w-5 h-5 text-white" />
            <span>Cart ({totalCount})</span>
          </div>
          <button
            onClick={() => dispatch(toggleCartOpen(false))}
            className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="p-3 bg-zinc-900 border-b border-zinc-800 text-xs">
          <div className="flex items-center justify-between mb-1 font-medium text-zinc-300">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-white" />
              {isFreeShipping ? (
                <strong className="text-white">🎉 Free Express Shipping Unlocked!</strong>
              ) : (
                <span>Add <strong>${(freeShippingThreshold - subtotal).toFixed(2)}</strong> more for Free Shipping</span>
              )}
            </span>
          </div>
          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-white h-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-[1.5] mx-auto text-zinc-700" />
              <p className="font-semibold text-zinc-300 text-sm">Your cart is empty</p>
              <p className="text-xs text-zinc-500">Explore products and add items to your cart</p>
            </div>
          ) : (
            items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl items-center"
              >
                <img
                  src={product.thumbnail || product.images[0]}
                  alt={product.title}
                  className="w-16 h-16 rounded-lg object-contain bg-zinc-900 p-1 border border-zinc-800"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-white truncate">{product.title}</h4>
                  <div className="text-[11px] text-zinc-500 font-mono mt-0.5">${product.price.toFixed(2)} each</div>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 border border-zinc-700 bg-zinc-950 px-2 py-0.5 rounded text-xs">
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: product.id, delta: -1 }))}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-bold px-1 text-white">{quantity}</span>
                      <button
                        onClick={() => dispatch(updateQuantity({ productId: product.id, delta: 1 }))}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-xs font-bold text-white font-mono">
                      ${(product.price * quantity).toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(removeFromCart(product.id))}
                  className="text-zinc-500 hover:text-white p-1 transition-colors"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary */}
        {items.length > 0 && (
          <div className="p-4 border-t border-zinc-800 bg-black space-y-3 text-xs">
            <div className="space-y-1.5 text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-white font-mono">{isFreeShipping ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Est. Tax (8%)</span>
                <span className="text-white font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-bold text-white">
                <span>Total</span>
                <span className="font-mono text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => dispatch(clearCart())}
                className="px-3 py-3 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white text-xs font-semibold"
              >
                Clear
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-white hover:bg-zinc-200 text-black font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
