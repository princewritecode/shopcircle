import React from 'react';
import { Star, ShoppingBag, Heart, Eye, Edit, Trash2 } from 'lucide-react';
import type { Product } from '../types/product';
import { useAppDispatch, useAppSelector } from '../store';
import { addToCart } from '../store/cartSlice';
import { toggleWishlist } from '../store/wishlistSlice';
import { addToast } from '../store/toastSlice';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onEdit,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ product, quantity: 1 }));
    dispatch(addToast({ message: `Added "${product.title}" to cart!`, type: 'success' }));
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleWishlist(product));
    const msg = isWishlisted
      ? `Removed "${product.title}" from wishlist`
      : `Saved "${product.title}" to wishlist!`;
    dispatch(addToast({ message: msg, type: 'info' }));
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="bg-zinc-950 border border-zinc-800 hover:border-zinc-600 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-300 group cursor-pointer shadow-lg hover:shadow-2xl select-none"
    >
      {/* Thumbnail Box */}
      <div className="relative bg-zinc-900 h-64 overflow-hidden flex items-center justify-center p-4">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.title}
          loading="lazy"
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={handleToggleWishlist}
            className="p-2 rounded-full bg-black/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Toggle Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="p-2 rounded-full bg-black/80 border border-zinc-800 text-zinc-400 hover:text-white transition-colors"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Admin Edit/Delete overlays if provided */}
        {(onEdit || onDelete) && (
          <div className="absolute bottom-3 left-3 flex gap-1 z-10">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(product);
                }}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white text-[11px] flex items-center gap-1"
                title="Edit Product (API PUT)"
              >
                <Edit className="w-3 h-3" /> Edit
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(product.id);
                }}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-400 hover:text-red-400 text-[11px] flex items-center gap-1"
                title="Delete Product (API DELETE)"
              >
                <Trash2 className="w-3 h-3" /> Delete
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Box */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span className="capitalize">{product.category.replace('-', ' ')}</span>
            <div className="flex items-center gap-1 text-white font-semibold">
              <Star className="w-3.5 h-3.5 fill-white text-white" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="font-bold text-white text-sm group-hover:text-zinc-300 transition-colors line-clamp-1">
            {product.title}
          </h3>
          <p className="text-xs text-zinc-500 line-clamp-2 mt-1">
            {product.description}
          </p>
        </div>

        {/* Price & Cart */}
        <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
          <div>
            <div className="text-base font-extrabold text-white">
              ${product.price.toFixed(2)}
            </div>
            {product.discountPercentage > 0 && (
              <div className="text-xs text-zinc-600 line-through">
                ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
              </div>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-white hover:bg-zinc-200 text-black font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition-all active:scale-95 shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
};
