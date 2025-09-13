import { apiSlice } from '../api/apiSlice';
import { ChatMessage, ChatResponse } from './types';

export const chatbotApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    postChatMessage: builder.mutation<ChatResponse, { message: string }>({      query: ({ message }) => ({
        url: '/chatbot/message',
        method: 'POST',
        body: { message },
      }),
      transformResponse: (response: { response: ChatResponse }) => response.response,
      invalidatesTags: (result, error, arg) => [{ type: 'ChatHistory', id: 'LIST' }],
    }),
    getChatHistory: builder.query<ChatMessage[], void>({
      query: () => '/chatbot/history',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'ChatHistory' as const, id })),
              { type: 'ChatHistory', id: 'LIST' },
            ]
          : [{ type: 'ChatHistory', id: 'LIST' }],
    }),
  }),
});

export const {
  usePostChatMessageMutation,
  useGetChatHistoryQuery,
} = chatbotApiSlice;
