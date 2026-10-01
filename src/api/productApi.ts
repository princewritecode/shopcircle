import { axiosClient } from './axiosClient';
import type { Product, ProductsResponse, CategoryItem, FetchProductsParams } from '../types/product';

export const productApi = {
  // Get products (with optional search, category, pagination, sorting)
  getProducts: async (params: FetchProductsParams): Promise<ProductsResponse> => {
    const { limit = 12, skip = 0, search, category, sortBy, order } = params;

    let url = '/products';
    const queryParams = new URLSearchParams();

    queryParams.append('limit', limit.toString());
    queryParams.append('skip', skip.toString());

    if (sortBy) queryParams.append('sortBy', sortBy);
    if (order) queryParams.append('order', order);

    // DummyJSON endpoint routing logic:
    // 1) If search query present: /products/search?q=...
    // 2) Else if category present: /products/category/...
    // 3) Else standard list: /products?...
    if (search && search.trim() !== '') {
      url = `/products/search`;
      queryParams.append('q', search.trim());
    } else if (category && category !== 'all') {
      url = `/products/category/${encodeURIComponent(category)}`;
    }

    const fullUrl = `${url}?${queryParams.toString()}`;
    const response = await axiosClient.get<ProductsResponse>(fullUrl);
    return response.data;
  },

  // Get single product details
  getProductById: async (id: number): Promise<Product> => {
    const response = await axiosClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  // Get all product category list
  getCategories: async (): Promise<CategoryItem[]> => {
    try {
      const response = await axiosClient.get<CategoryItem[]>('/products/category-list');
      return response.data;
    } catch {
      // Fallback if category-list endpoint has format variations
      const res = await axiosClient.get<CategoryItem[]>('/products/categories');
      return res.data;
    }
  },

  // Simulate POST (Add product)
  addProduct: async (productData: Partial<Product>): Promise<Product> => {
    const response = await axiosClient.post<Product>('/products/add', productData);
    return response.data;
  },

  // Simulate PUT/PATCH (Update product)
  updateProduct: async (id: number, productData: Partial<Product>): Promise<Product> => {
    const response = await axiosClient.put<Product>(`/products/${id}`, productData);
    return response.data;
  },

  // Simulate DELETE (Delete product)
  deleteProduct: async (id: number): Promise<Product & { isDeleted: boolean; deletedOn: string }> => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  }
};
