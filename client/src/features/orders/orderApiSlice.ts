import { apiSlice } from '../api/apiSlice';
import {
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  UpdatePaymentStatusDto,
  OrderStatus,
  PaymentStatus,
} from './types';

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    createOrder: builder.mutation({
      query: (orderData: CreateOrderDto) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: [{ type: 'Order', id: 'LIST' }],
    }),
    findAllOrders: builder.query({
      query: ({ status, paymentStatus, page, limit }: { status?: OrderStatus; paymentStatus?: PaymentStatus; page?: number; limit?: number }) => {
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (paymentStatus) params.append('paymentStatus', paymentStatus);
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        return {
          url: `/orders?${params.toString()}`,
        };
      },
      providesTags: (result: Order[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
              { type: 'Order', id: 'LIST' },
            ]
          : [{ type: 'Order', id: 'LIST' }],
    }),
    findOneOrder: builder.query({
      query: (id: number) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order', id }],
    }),
    updateOrder: builder.mutation({
      query: ({ id, data }: { id: number; data: UpdateOrderDto }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
    updatePaymentStatus: builder.mutation({
      query: ({ id, data }: { id: number; data: UpdatePaymentStatusDto }) => ({
        url: `/orders/${id}/payment-status`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
    getUserOrders: builder.query({
      query: ({ page, limit }: { page?: number; limit?: number }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (limit) params.append('limit', limit.toString());
        return {
          url: `/orders/user/history?${params.toString()}`,
        };
      },
      providesTags: (result, error, arg) => [{ type: 'Order', id: 'LIST' }],
    }),
    getOrderStats: builder.query<any, void>({
      query: () => '/orders/stats',
    }),
    cancelOrder: builder.mutation({
      query: (id: number) => ({
        url: `/orders/${id}/cancel`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
    removeOrder: builder.mutation({
      query: (id: number) => ({
        url: `/orders/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Order', id }, { type: 'Order', id: 'LIST' }],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useFindAllOrdersQuery,
  useFindOneOrderQuery,
  useUpdateOrderMutation,
  useUpdatePaymentStatusMutation,
  useGetUserOrdersQuery,
  useGetOrderStatsQuery,
  useCancelOrderMutation,
  useRemoveOrderMutation,
} = orderApiSlice;
