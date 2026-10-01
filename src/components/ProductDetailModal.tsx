import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RotateCcw, Check, Plus, Minus } from 'lucide-react';
import type { Product } from '../types/product';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { addToast } from '../store/toastSlice';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const [selectedImage, setSelectedImage] = useState<string>(
    product.images?.[0] || product.thumbnail
  );
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    dispatch(
      addToast({
        message: `Added ${quantity}x "${product.title}" to cart!`,
        type: 'success',
      })
    );
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product));
    dispatch(
      addToast({
        message: isWishlisted ? `Removed from wishlist` : `Added to wishlist!`,
        type: 'info',
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 text-white max-h-[90vh] flex flex-col">
        
        {/* Header bar */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-black/60 sticky top-0 z-20">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
            Product Detail &nbsp;•&nbsp; SKU: {product.sku || product.id}
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="relative bg-zinc-900 border border-zinc-800 rounded-2xl h-80 flex items-center justify-center p-4 overflow-hidden">
                <img
                  src={selectedImage}
                  alt={product.title}
                  className="max-h-full max-w-full object-contain"
                />
                {product.discountPercentage > 0 && (
                  <span className="absolute top-4 left-4 bg-white text-black font-black text-xs px-2.5 py-1 rounded uppercase">
                    -{Math.round(product.discountPercentage)}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-16 h-16 rounded-xl border overflow-hidden shrink-0 bg-zinc-900 p-1 transition-all ${
                        selectedImage === img
                          ? 'border-white ring-2 ring-white/20'
                          : 'border-zinc-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info & Specs */}
            <div className="space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="uppercase font-semibold tracking-wider text-zinc-300">
                    {product.brand ? product.brand : product.category}
                  </span>
                  <div className="flex items-center gap-1 text-white font-bold">
                    <Star className="w-4 h-4 fill-white text-white" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-zinc-500 font-normal">({product.reviews?.length || 0} reviews)</span>
                  </div>
                </div>

                <h2 className="text-2xl font-black text-white leading-tight">
                  {product.title}
                </h2>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl font-black text-white font-mono">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-sm text-zinc-500 line-through">
                      ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                    </span>
                  )}
                  {product.stock > 0 ? (
                    <span className="text-[11px] bg-zinc-900 text-zinc-300 border border-zinc-800 px-2 py-0.5 rounded font-mono">
                      In Stock ({product.stock})
                    </span>
                  ) : (
                    <span className="text-[11px] bg-red-950 text-red-300 border border-red-900 px-2 py-0.5 rounded font-mono">
                      Out of Stock
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {product.description}
                </p>

                {/* Specs metadata badges */}
                <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-zinc-400 font-mono">
                  {product.warrantyInformation && (
                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
                      <span>{product.warrantyInformation}</span>
                    </div>
                  )}
                  {product.shippingInformation && (
                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-zinc-300" />
                      <span>{product.shippingInformation}</span>
                    </div>
                  )}
                  {product.returnPolicy && (
                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5 text-zinc-300" />
                      <span>{product.returnPolicy}</span>
                    </div>
                  )}
                  {product.minimumOrderQuantity && (
                    <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-lg flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-zinc-300" />
                      <span>Min Order: {product.minimumOrderQuantity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity & CTA */}
              <div className="pt-4 border-t border-zinc-800 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-zinc-700 bg-zinc-900 rounded-xl px-3 py-1.5 text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold px-3 text-white">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={handleWishlist}
                    className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
                    title="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold py-3.5 rounded-xl uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-xl transition-all"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {quantity} to Cart</span>
                </button>
              </div>
            </div>

          </div>

          {/* Customer Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="pt-6 border-t border-zinc-900 space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider">
                Verified Customer Reviews ({product.reviews.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.reviews.map((rev, i) => (
                  <div key={i} className="bg-zinc-900/60 border border-zinc-800 p-3.5 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{rev.reviewerName}</span>
                      <div className="flex items-center gap-1 text-white text-[11px]">
                        <Star className="w-3 h-3 fill-white text-white" />
                        <span>{rev.rating}</span>
                      </div>
                    </div>
                    <p className="text-zinc-400 text-[11px] leading-relaxed">"{rev.comment}"</p>
                    <span className="text-[10px] text-zinc-600 font-mono block">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
