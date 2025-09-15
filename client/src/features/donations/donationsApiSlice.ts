import { apiSlice } from '../api/apiSlice';
import { CreateDonationDto, Donation, DonationStatus, UpdateDonationDto } from './types';

interface Pagination {
  page?: number;
  limit?: number;
}

export const donationsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDonations: builder.query<Donation[], { userId?: string; organizationId?: number; status?: DonationStatus; page?: number; limit?: number }>({      query: (params) => ({ url: '/donations', params }),
      providesTags: ['Donation'],
    }),
    getDonation: builder.query<Donation, number>({
      query: (id) => `/donations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Donation', id }],
    }),
    getUserDonations: builder.query<Donation[], Pagination>(
      {
        query: (params) => ({ url: '/donations/user/history', params }),
        providesTags: ['Donation'],
      }
    ),
    getOrganizationDonations: builder.query<Donation[], { orgId: number, page?: number, limit?: number }>({
      query: ({ orgId, ...params }) => ({ url: `/donations/organization/${orgId}`, params }),
      providesTags: ['Donation'],
    }),
    getOrganizationStats: builder.query<any, number>({
      query: (orgId) => `/donations/organization/${orgId}/stats`,
      providesTags: ['Donation'],
    }),
    getDonationStats: builder.query<{
      totalRaised: number;
      totalDonors: number;
      totalProjects: number;
      transparencyScore: number;
    }, void>({
      query: () => '/donations/stats',
      providesTags: ['Donation'],
    }),
    createDonation: builder.mutation<Donation, CreateDonationDto>({
      query: (body) => ({
        url: '/donations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Donation'],
    }),
    updateDonationStatus: builder.mutation<Donation, { id: number; body: UpdateDonationDto }>({
      query: ({ id, body }) => ({
        url: `/donations/${id}/status`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Donation', id }, 'Donation'],
    }),
    deleteDonation: builder.mutation<void, number>({
      query: (id) => ({
        url: `/donations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Donation', id: id }, 'Donation'],
    }),
    confirmBlockchainTransaction: builder.mutation<Donation, { id: number; blockchainTxId: string }>({
      query: ({ id, blockchainTxId }) => ({
        url: `/donations/${id}/confirm`,
        method: 'PUT',
        body: { blockchainTxId },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Donation', id }, 'Donation'],
    }),
  }),
});

export const {
  useGetDonationsQuery,
  useGetDonationQuery,
  useCreateDonationMutation,
  useUpdateDonationStatusMutation,
  useDeleteDonationMutation,
  useConfirmBlockchainTransactionMutation,
  useGetUserDonationsQuery,
  useGetOrganizationDonationsQuery,
  useGetOrganizationStatsQuery,
  useGetDonationStatsQuery,
} = donationsApiSlice;
