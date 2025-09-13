import { apiSlice } from '../api/apiSlice';
import { Product, CreateProductDto, UpdateProductDto } from './types';

interface FindAllProductsResponse {
    data: Product[];
    total: number;
    hasNextPage: boolean;
}

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getProducts: builder.query<FindAllProductsResponse, { page?: number, limit?: number, seller?: string }>({
      query: ({ page = 1, limit = 10, seller }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (seller) {
            params.append('seller', seller);
        }
        return {
            url: `/products?${params.toString()}`,
        }
      },
      transformResponse: (response: { data: Product[], total: number }, meta, arg) => {
        return {
            data: response.data,
            total: response.total,
            hasNextPage: (arg.page * arg.limit) < response.total,
        };
      },
      providesTags: (result: FindAllProductsResponse | undefined) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
              { type: 'Product', id: 'LIST' },
            ]
          : [{ type: 'Product', id: 'LIST' }],
    }),
    getProduct: builder.query<Product, string>({
      query: (id: string) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation({
      query: (productData: CreateProductDto) => ({
        url: '/products',
        method: 'POST',
        body: productData,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }],
    }),
    updateProduct: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateProductDto }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Product', id }, { type: 'Product', id: 'LIST' }],
    }),
    uploadProductImage: builder.mutation({
      query: ({ productId, file }: { productId: string; file: any }) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: `/products/${productId}/image`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product', id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImageMutation,
} = productApiSlice;
