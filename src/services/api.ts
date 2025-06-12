import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { AuthResponse, UserPublic } from '../types/api'; // Certifique-se de que estes tipos estejam definidos

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = createApi({
  reducerPath: 'api', // Nome do slice do Redux para esta API
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Pega o token do localStorage ou de algum lugar do estado Redux, se estiver lá
      const token = localStorage.getItem('token'); 
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User', 'Post'], // Usado para invalidação de cache
  endpoints: (builder) => ({
    // Endpoint de login
    login: builder.mutation<AuthResponse, { username: string; password: string }>({
      query: (credentials) => ({
        url: '/auth/', // Sua rota de login
        method: 'POST',
        body: credentials,
      }),
      // Não queremos invalidar tags ao fazer login, mas talvez ao buscar o próprio usuário
    }),
    
    // Exemplo: Obter dados de um usuário (incluindo o próprio)
    getUserById: builder.query<UserPublic, string | number>({
      query: (id) => `/user/${id}/`,
      providesTags: (result, error, id) => [{ type: 'User', id }], // Cache baseado no ID do usuário
    }),

    // Exemplo: Obter posts (com filtros)
    getPosts: builder.query<any[], { authorId?: string | number; filter?: 'following' }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.authorId) {
          queryParams.append('author', String(params.authorId));
        }
        if (params.filter) {
          queryParams.append('filter', params.filter);
        }
        return `/posts/?${queryParams.toString()}`;
      },
      providesTags: ['Post'], // Cache de posts em geral
    }),

    // Exemplo: Criar um post
    createPost: builder.mutation<any, { content: string }>({
      query: (newPost) => ({
        url: '/posts/',
        method: 'POST',
        body: newPost,
      }),
      invalidatesTags: ['Post'], // Invalida o cache de posts para buscar novamente após a criação
    }),

    // Exemplo: Deletar um post
    deletePost: builder.mutation<void, number>({
        query: (postId) => ({
            url: `/posts/${postId}/`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, id) => [{ type: 'Post', id }], // Invalida um post específico
    }),

    // Exemplo: Toggle Follow
    toggleFollow: builder.mutation<UserPublic, number>({
        query: (userIdToFollow) => ({
            url: `/toggle_follow/${userIdToFollow}/`, // Sua rota de toggle_follow
            method: 'POST',
        }),
        // Invalida a tag do usuário seguido E do usuário que está seguindo/deixando de seguir (o próprio usuário logado)
        // Isso fará com que o perfil seja re-buscado para atualizar a contagem de seguidores/seguindo
        invalidatesTags: (result, error, id) => [
            { type: 'User', id }, // Invalida o perfil do usuário alvo
            { type: 'User', id: 'me' } // Invalida o perfil do usuário logado (assumindo que 'me' é um ID de cache para o usuário logado)
        ],
    }),

    // Exemplo: Update User Profile ( PATCH /user/<pk>/ )
    updateUserProfile: builder.mutation<UserPublic, { id: string | number; data: Partial<UserPublic> }>({
      query: ({ id, data }) => ({
        url: `/user/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),

  }),
});

// Hooks gerados automaticamente pelo RTK Query
export const {
  useLoginMutation,
  useGetUserByIdQuery,
  useGetPostsQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useToggleFollowMutation,
  useUpdateUserProfileMutation,
} = api;