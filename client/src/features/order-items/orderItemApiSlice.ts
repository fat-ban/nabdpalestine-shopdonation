import { apiSlice } from '../api/apiSlice';
import { OrderItem, CreateOrderItemDto, UpdateOrderItemDto } from './types';
import { OrderStatus } from '../orders/types';

export const orderItemApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrderItem: builder.mutation({
      query: (orderItemData: CreateOrderItemDto) => ({
        url: '/order-items',
        method: 'POST',
        body: orderItemData,
      }),
      invalidatesTags: [{ type: 'OrderItem', id: 'LIST' }],
    }),
    findMyOrderItems: builder.query({
        query: () => '/order-items/my-order-items',
        providesTags: (result: OrderItem[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'OrderItem' as const, id })),
              { type: 'OrderItem', id: 'LIST' },
            ]
          : [{ type: 'OrderItem', id: 'LIST' }],
    }),
    findOrderItemsByOrder: builder.query({
      query: (orderId: number) => `/order-items/by-order/${orderId}`,
      providesTags: (result: OrderItem[] | undefined, error, orderId) => [{ type: 'OrderItem', id: `LIST-${orderId}` }],
    }),
    findOneOrderItem: builder.query({
      query: (id: number) => `/order-items/${id}`,
      providesTags: (result: OrderItem | undefined, error, id) => [{ type: 'OrderItem', id }],
    }),
    updateOrderItem: builder.mutation({
      query: ({ id, data }: { id: number; data: UpdateOrderItemDto }) => ({
        url: `/order-items/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'OrderItem', id }, { type: 'OrderItem', id: 'LIST' }],
    }),
    removeOrderItem: builder.mutation({
      query: (id: number) => ({
        url: `/order-items/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'OrderItem', id: 'LIST' }],
    }),
    findAllOrderItemsAdmin: builder.query(
        {
          query: ({ page = 1, limit = 10, status, productId }: { page?: number; limit?: number; status?: string; productId?: number }) => {
            const params = new URLSearchParams();
            params.append('page', page.toString());
            params.append('limit', limit.toString());
            if (status) params.append('status', status);
            if (productId) params.append('productId', productId.toString());
            return {
              url: `/order-items?${params.toString()}`,
            };
          },
          providesTags: (result: OrderItem[] | undefined) =>
            result
              ? [
                  ...result.map(({ id }) => ({ type: 'OrderItem' as const, id })),
                  { type: 'OrderItem', id: 'LIST' },
                ]
              : [{ type: 'OrderItem', id: 'LIST' }],
        },
      ),
    updateOrderItemStatus: builder.mutation({
        query: ({ id, status }: { id: number; status: OrderStatus }) => ({
          url: `/order-items/${id}/status`,
          method: 'PATCH',
          body: { status },
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'OrderItem', id }, { type: 'OrderItem', id: 'LIST' }],
      }),
    getOrderItemsAnalytics: builder.query({
        query: (period: string) => `/order-items/analytics/stats?period=${period}`,
    }),
  }),
});

export const {
  useCreateOrderItemMutation,
  useFindMyOrderItemsQuery,
  useFindOrderItemsByOrderQuery,
  useFindOneOrderItemQuery,
  useUpdateOrderItemMutation,
  useRemoveOrderItemMutation,
  useFindAllOrderItemsAdminQuery,
  useUpdateOrderItemStatusMutation,
  useGetOrderItemsAnalyticsQuery,
} = orderItemApiSlice;
