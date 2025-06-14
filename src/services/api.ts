import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { AuthResponse, UserPublic, Post } from '../types/api'
import type { RootState } from '../store'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).auth.token
            if (token) {
                headers.set('Authorization', `Token ${token}`)
            }
            return headers
        },
    }),
    tagTypes: ['User', 'Post'],
    endpoints: (builder) => ({
        register: builder.mutation<
            AuthResponse,
            { username: string; password: string; password2: string }
        >({
            query: (credentials) => ({
                url: '/register/',
                method: 'POST',
                body: credentials,
            }),
        }),

        login: builder.mutation<AuthResponse, { username: string; password: string }>({
            query: (credentials) => ({
                url: '/login/',
                method: 'POST',
                body: credentials,
            }),
        }),

        getUserById: builder.query<UserPublic, string | number>({
            query: (id) => `/user/${id}/`,
            providesTags: (result, error, id) => [{ type: 'User', id }],
        }),

        getPosts: builder.query<Post[], { authorId?: string | number; filter?: 'following' }>({
            query: (params) => {
                const queryParams = new URLSearchParams()
                if (params.authorId) {
                    queryParams.append('author', String(params.authorId))
                }
                if (params.filter) {
                    queryParams.append('filter', params.filter)
                }
                return `/posts/?${queryParams.toString()}`
            },
            providesTags: ['Post'],
        }),

        createPost: builder.mutation<Post, { content: string }>({
            query: (newPost) => ({
                url: '/posts/',
                method: 'POST',
                body: newPost,
            }),
            invalidatesTags: ['Post'],
        }),

        deletePost: builder.mutation<void, number>({
            query: (postId) => ({
                url: `/posts/${postId}/`,
                method: 'DELETE',
            }),
            invalidatesTags: (result, error, id) => [{ type: 'Post', id }],
        }),

        toggleFollow: builder.mutation<UserPublic, number>({
            query: (userIdToFollow) => ({
                url: `/user/${userIdToFollow}/toggle_follow/`,
                method: 'POST',
            }),
            invalidatesTags: (result, error, id) => [
                { type: 'User', id },
                { type: 'User', id: 'me' },
            ],
        }),

        updateUserProfile: builder.mutation<
            UserPublic,
            { id: string | number; data: Partial<UserPublic> }
        >({
            query: ({ id, data }) => ({
                url: `/user/${id}/`,
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
        }),
    }),
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useGetUserByIdQuery,
    useGetPostsQuery,
    useCreatePostMutation,
    useDeletePostMutation,
    useToggleFollowMutation,
    useUpdateUserProfileMutation,
} = api
