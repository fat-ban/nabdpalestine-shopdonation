import { apiSlice } from '../api/apiSlice';
import { Organization, CreateOrganizationDto, UpdateOrganizationDto } from './types';

export const organizationApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getOrganizations: builder.query({
      query: () => '/organizations',
      providesTags: (result: Organization[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Organization' as const, id })),
              { type: 'Organization', id: 'LIST' },
            ]
          : [{ type: 'Organization', id: 'LIST' }],
    }),
    getVerifiedOrganizations: builder.query({
      query: () => '/organizations/verified',
      providesTags: (result: Organization[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Organization' as const, id })),
              { type: 'Organization', id: 'LIST' },
            ]
          : [{ type: 'Organization', id: 'LIST' }],
    }),
    getPendingOrganizations: builder.query({
      query: () => '/organizations/pending',
      providesTags: (result: Organization[] | undefined) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Organization' as const, id })),
              { type: 'Organization', id: 'LIST' },
            ]
          : [{ type: 'Organization', id: 'LIST' }],
    }),
    getOrganization: builder.query({
      query: (id: string) => `/organizations/${id}`,
      providesTags: (result, error, id) => [{ type: 'Organization', id }],
    }),
    createOrganization: builder.mutation({
      query: (organizationData: CreateOrganizationDto) => ({
        url: '/organizations',
        method: 'POST',
        body: organizationData,
      }),
      invalidatesTags: [{ type: 'Organization', id: 'LIST' }],
    }),
    updateOrganization: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateOrganizationDto }) => ({
        url: `/organizations/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Organization', id }, { type: 'Organization', id: 'LIST' }],
    }),
    deleteOrganization: builder.mutation({
      query: (id: string) => ({
        url: `/organizations/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Organization', id }, { type: 'Organization', id: 'LIST' }],
    }),
    verifyOrganization: builder.mutation({
      query: (id: string) => ({
        url: `/organizations/${id}/verify`,
        method: 'PUT',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Organization', id: id }, { type: 'Organization', id: 'LIST' }],
    }),
    rejectOrganization: builder.mutation({
      query: ({ id, data }: { id: string; data: UpdateOrganizationDto }) => ({
        url: `/organizations/${id}/reject`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Organization', id: id }, { type: 'Organization', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetOrganizationsQuery,
  useGetVerifiedOrganizationsQuery,
  useGetPendingOrganizationsQuery,
  useGetOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
  useVerifyOrganizationMutation,
  useRejectOrganizationMutation,
} = organizationApiSlice;
