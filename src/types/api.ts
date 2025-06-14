export interface AuthResponse {
    token: string
    user_id: number
    username: string
}

export interface SimpleUser {
    id: number
    username: string
}

export interface UserPublic {
    id: number
    username: string
    email: string
    bio: string
    followers_count: number
    following_count: number
    is_following: boolean
    following: SimpleUser[]
    followers: SimpleUser[]
}

export interface Post {
    id: number
    content: string
    author: SimpleUser
    created_at: string
}

export interface ApiError {
    detail?: string
    non_field_errors?: string[]
    username?: string[]
    email?: string[]
    password?: string[]
    password2?: string[]
    bio?: string[]
    [key: string]: string[] | string | undefined
}
