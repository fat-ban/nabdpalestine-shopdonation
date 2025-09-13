import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { chatbotApiSlice } from './chatbotApiSlice';
import { ChatState, ChatMessage, ChatRole } from './types';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
};

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const newMessage: ChatMessage = {
        id: new Date().toISOString(),
        role: ChatRole.USER,
        content: action.payload,
        timestamp: new Date().toISOString(),
      };
      state.messages.push(newMessage);
      state.isLoading = true;
    },
  },
  extraReducers: builder => {
    builder
      .addMatcher(chatbotApiSlice.endpoints.getChatHistory.matchPending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(chatbotApiSlice.endpoints.getChatHistory.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addMatcher(chatbotApiSlice.endpoints.getChatHistory.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch chat history';
      })
      .addMatcher(chatbotApiSlice.endpoints.postChatMessage.matchPending, (state, action) => {
        state.isLoading = true;
        const userMessage: ChatMessage = {
          role: ChatRole.USER,
          content: action.meta.arg.originalArgs.message,
        };
        state.messages.push(userMessage);
      })
      .addMatcher(chatbotApiSlice.endpoints.postChatMessage.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload.history;
      })
      .addMatcher(chatbotApiSlice.endpoints.postChatMessage.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { addUserMessage } = chatbotSlice.actions;

export default chatbotSlice.reducer;
