import { apiSlice } from '../api/apiSlice';
import { Comment, CreateCommentDto, UpdateCommentDto } from './types';

export const commentApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createComment: builder.mutation<Comment, CreateCommentDto>({
      query: (commentData) => ({
        url: '/comments',
        method: 'POST',
        body: commentData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Comment', id: 'LIST' }, { type: 'Comment', id: `PRODUCT-${productId}` }],
    }),
    findAllComments: builder.query<Comment[], { productId?: number; userId?: string; page?: number; limit?: number }>(
        {
          query: ({ productId, userId, page = 1, limit = 10 }) => {
            const params = new URLSearchParams();
            if (productId) params.append('productId', productId.toString());
            if (userId) params.append('userId', userId);
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            return {
              url: `/comments?${params.toString()}`,
            };
          },
          providesTags: (result) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'Comment' as const, id })),
                  { type: 'Comment', id: 'LIST' },
                ]
              : [{ type: 'Comment', id: 'LIST' }],
        },
      ),
    findOneComment: builder.query<Comment, string>({
      query: (id) => `/comments/${id}`,
      providesTags: (result, error, id) => [{ type: 'Comment', id }],
    }),
    updateComment: builder.mutation<Comment, { id: string; commentData: UpdateCommentDto }>(
        {
          query: ({ id, commentData }) => ({
            url: `/comments/${id}`,
            method: 'PATCH',
            body: commentData,
          }),
          invalidatesTags: (result, error, { id }) => [{ type: 'Comment', id }, { type: 'Comment', id: 'LIST' }],
        },
      ),
    removeComment: builder.mutation<void, string>({
      query: (id) => ({
        url: `/comments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Comment', id: 'LIST' }],
    }),
  }),
});

export const {
    useCreateCommentMutation,
    useFindAllCommentsQuery,
    useFindOneCommentQuery,
    useUpdateCommentMutation,
    useRemoveCommentMutation,
} = commentApiSlice;
