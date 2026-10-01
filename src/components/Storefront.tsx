import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Plus, AlertCircle, RefreshCw, Sparkles, Layers } from 'lucide-react';

import { productApi } from '../api/productApi';
import type { Product } from '../types/product';
import { useDebounce } from '../hooks/useDebounce';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { FiltersBar } from './FiltersBar';
import { Pagination } from './Pagination';
import { ProductDetailModal } from './ProductDetailModal';
import { AddEditProductModal } from './AddEditProductModal';
import { useAppDispatch } from '../store';
import { addToast } from '../store/toastSlice';

export const Storefront: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  // Read URL parameters
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('q') || '';
  const sortByParam = searchParams.get('sortBy') || '';
  const orderParam = (searchParams.get('order') as 'asc' | 'desc') || 'asc';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const limitParam = parseInt(searchParams.get('limit') || '12', 10);

  // Search input state with debouncing
  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to URL query param
  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      const newParams = new URLSearchParams(searchParams);
      if (debouncedSearch.trim()) {
        newParams.set('q', debouncedSearch.trim());
      } else {
        newParams.delete('q');
      }
      newParams.set('page', '1'); // Reset to first page on search change
      setSearchParams(newParams);
    }
  }, [debouncedSearch, searchParam, searchParams, setSearchParams]);

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Pagination skip calculation
  const skip = (pageParam - 1) * limitParam;

  // 1. TanStack Query: Fetch Categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => productApi.getCategories(),
    staleTime: 1000 * 60 * 60, // 1 hour caching
  });

  // 2. TanStack Query: Fetch Products with deduplication & caching
  const {
    data: productsData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: [
      'products',
      {
        limit: limitParam,
        skip,
        search: searchParam,
        category: categoryParam,
        sortBy: sortByParam,
        order: orderParam,
      },
    ],
    queryFn: () =>
      productApi.getProducts({
        limit: limitParam,
        skip,
        search: searchParam,
        category: categoryParam,
        sortBy: sortByParam,
        order: orderParam,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes caching
  });

  // 3. TanStack Query: Prefetch next page for seamless UX
  useEffect(() => {
    if (productsData && skip + limitParam < productsData.total) {
      queryClient.prefetchQuery({
        queryKey: [
          'products',
          {
            limit: limitParam,
            skip: skip + limitParam,
            search: searchParam,
            category: categoryParam,
            sortBy: sortByParam,
            order: orderParam,
          },
        ],
        queryFn: () =>
          productApi.getProducts({
            limit: limitParam,
            skip: skip + limitParam,
            search: searchParam,
            category: categoryParam,
            sortBy: sortByParam,
            order: orderParam,
          }),
      });
    }
  }, [productsData, skip, limitParam, searchParam, categoryParam, sortByParam, orderParam, queryClient]);

  // URL Sync Handlers
  const handleCategorySelect = (category: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (category !== 'all') {
      newParams.set('category', category);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
    const newParams = new URLSearchParams(searchParams);
    if (sortBy) {
      newParams.set('sortBy', sortBy);
      newParams.set('order', order);
    } else {
      newParams.delete('sortBy');
      newParams.delete('order');
    }
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLimitChange = (newLimit: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('limit', newLimit.toString());
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  // Simulated REST API Handlers
  const handleDeleteProduct = async (id: number) => {
    try {
      await productApi.deleteProduct(id);
      dispatch(addToast({ message: `API DELETE: Simulated deletion of product #${id}`, type: 'info' }));
      refetch();
    } catch {
      dispatch(addToast({ message: 'Delete failed', type: 'error' }));
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20 select-none">
      
      {/* Top Banner & Action Line */}
      <section className="pt-6 pb-4 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs text-zinc-400 font-mono uppercase tracking-widest mb-1">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>DummyJSON REST API Integration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              ShopCircle Catalog
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isFetching && (
              <span className="text-xs text-zinc-400 font-mono flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Fetching live API...
              </span>
            )}

            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="bg-white hover:bg-zinc-200 text-black font-extrabold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow transition-all active:scale-95 uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add Product (API POST)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Filter & Products Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        
        {/* URL Synced Filters Bar */}
        <FiltersBar
          categories={categories}
          selectedCategory={categoryParam}
          onSelectCategory={handleCategorySelect}
          searchTerm={searchInput}
          onSearchChange={setSearchInput}
          sortBy={sortByParam}
          order={orderParam}
          onSortChange={handleSortChange}
          limit={limitParam}
          onLimitChange={handleLimitChange}
          onReset={handleResetFilters}
          totalProducts={productsData?.total}
        />

        {/* Error Feedback State */}
        {isError && (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto stroke-[1.5]" />
            <h3 className="font-bold text-lg text-white">Failed to load API products</h3>
            <p className="text-xs text-zinc-400">{(error as Error)?.message || 'Check network connection or API specs.'}</p>
            <button
              onClick={() => refetch()}
              className="bg-white text-black font-bold px-6 py-2.5 rounded-xl text-xs uppercase"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limitParam }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && productsData && (
          <>
            {productsData.products.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <Layers className="w-12 h-12 text-zinc-700 mx-auto stroke-[1.5]" />
                <h3 className="font-bold text-white text-base">No products match your criteria</h3>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  Try adjusting search query, category filter, or click reset to view all items.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-white text-black font-bold px-4 py-2 rounded-lg text-xs"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {productsData.products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={setSelectedProduct}
                    onEdit={(p) => {
                      setEditingProduct(p);
                      setIsAddModalOpen(true);
                    }}
                    onDelete={handleDeleteProduct}
                  />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            <Pagination
              currentPage={pageParam}
              totalItems={productsData.total}
              limit={limitParam}
              onPageChange={handlePageChange}
            />
          </>
        )}

      </main>

      {/* Product Quick View Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Add / Edit Product Modal */}
      <AddEditProductModal
        isOpen={isAddModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProduct(null);
        }}
        onSuccess={() => {
          refetch();
        }}
      />

    </div>
  );
};
