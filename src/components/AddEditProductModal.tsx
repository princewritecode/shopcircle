import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Save } from 'lucide-react';
import type { Product } from '../types/product';
import { productApi } from '../api/productApi';
import { useAppDispatch } from '../store';
import { addToast } from '../store/toastSlice';

interface AddEditProductModalProps {
  isOpen: boolean;
  product?: Product | null;
  onClose: () => void;
  onSuccess: (updatedProduct: Product) => void;
}

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  product,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;

  const dispatch = useAppDispatch();
  const isEdit = !!product;

  const [title, setTitle] = useState(product?.title || '');
  const [price, setPrice] = useState(product?.price?.toString() || '');
  const [category, setCategory] = useState(product?.category || 'beauty');
  const [description, setDescription] = useState(product?.description || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setPrice(product.price.toString());
      setCategory(product.category);
      setDescription(product.description);
    } else {
      setTitle('');
      setPrice('');
      setCategory('beauty');
      setDescription('');
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    setLoading(true);
    try {
      if (isEdit && product) {
        // PUT API request
        const res = await productApi.updateProduct(product.id, {
          title,
          price: parseFloat(price),
          category,
          description,
        });
        dispatch(addToast({ message: `API PUT simulation: Product #${product.id} updated!`, type: 'success' }));
        onSuccess(res);
      } else {
        // POST API request
        const res = await productApi.addProduct({
          title,
          price: parseFloat(price),
          category,
          description,
          thumbnail: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
          images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80'],
          rating: 5.0,
          stock: 50,
          discountPercentage: 10,
        });
        dispatch(addToast({ message: `API POST simulation: Created new product #${res.id}!`, type: 'success' }));
        onSuccess(res);
      }
      onClose();
    } catch (err: any) {
      dispatch(addToast({ message: 'API Request Failed', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-6 shadow-2xl z-10 text-white space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2 font-bold text-base">
            {isEdit ? <Save className="w-5 h-5 text-white" /> : <PlusCircle className="w-5 h-5 text-white" />}
            <span>{isEdit ? `Edit Product #${product?.id}` : 'Add New Product (API POST)'}</span>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-zinc-400 mb-1">Product Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Minimalist Wireless Headphones"
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-white outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-zinc-400 mb-1">Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="199.99"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-white outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-zinc-400 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="beauty, smartphones, etc."
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-white outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product overview..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2.5 text-white focus:border-white outline-none resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-zinc-200 text-black font-extrabold py-3 rounded-xl uppercase tracking-wider text-xs shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? 'Submitting REST API Call...' : isEdit ? 'Update Product (PUT)' : 'Create Product (POST)'}
          </button>
        </form>
      </div>
    </div>
  );
};
