import { apiSlice } from '../api/apiSlice';
import { Rating, CreateRatingDto, UpdateRatingDto } from './types';

interface FindAllRatingsResponse {
    data: Rating[];
    total: number;
    hasNextPage: boolean;
}

export const ratingApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createRating: builder.mutation<Rating, CreateRatingDto>({
      query: (ratingData) => ({
        url: '/ratings',
        method: 'POST',
        body: ratingData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Rating', id: 'LIST' }, { type: 'Rating', id: `PRODUCT-${productId}` }],
    }),
    findAllRatings: builder.query<FindAllRatingsResponse, { productId?: number; userId?: string; page?: number; limit?: number }>(
        {
          query: ({ productId, userId, page = 1, limit = 10 }) => {
            const params = new URLSearchParams();
            if (productId) params.append('productId', productId.toString());
            if (userId) params.append('userId', userId);
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            return {
              url: `/ratings?${params.toString()}`,
            };
          },
          transformResponse: (response: { data: Rating[], total: number }, meta, arg) => {
            return {
                data: response.data,
                total: response.total,
                hasNextPage: (arg.page * arg.limit) < response.total,
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.data.map(({ id }) => ({ type: 'Rating' as const, id })),
                  { type: 'Rating', id: 'LIST' },
                ]
              : [{ type: 'Rating', id: 'LIST' }],
        },
      ),
    getProductAverageRating: builder.query<{ average: number }, number>({
      query: (productId) => `/ratings/product/${productId}/average`,
      providesTags: (result, error, productId) => [{ type: 'Rating', id: `PRODUCT-${productId}` }],
    }),
    getUserProductRating: builder.query<Rating, number>({
      query: (productId) => `/ratings/product/${productId}/user`,
      providesTags: (result, error, productId) => [{ type: 'Rating', id: `USER-PRODUCT-${productId}` }],
    }),
    findOneRating: builder.query<Rating, string>({
      query: (id) => `/ratings/${id}`,
      providesTags: (result, error, id) => [{ type: 'Rating', id }],
    }),
    updateRating: builder.mutation<Rating, { id: string; ratingData: UpdateRatingDto }>(
        {
          query: ({ id, ratingData }) => ({
            url: `/ratings/${id}`,
            method: 'PATCH',
            body: ratingData,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Rating', id }, { type: 'Rating', id: 'LIST' }],
        },
      ),
    removeRating: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/ratings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Rating', id: 'LIST' }],
    }),
  }),
});

export const {
    useCreateRatingMutation,
    useFindAllRatingsQuery,
    useGetProductAverageRatingQuery,
    useGetUserProductRatingQuery,
    useFindOneRatingQuery,
    useUpdateRatingMutation,
    useRemoveRatingMutation,
} = ratingApiSlice;
