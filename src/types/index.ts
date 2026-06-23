import { createContext } from 'react'

// User — id, username, avatar, bio, followers, isFollowing
export interface User {
    id: string
    username: string,
    avatar: string,
    bio: string,
    followers: number,
    isFollowing: boolean
}

// Post — id, userId, username, caption, imageUrl,
//         likes, isLiked, category, createdAt
export interface Post{
    id: string,
    userId: string,
    username: string,
    avatar: string,
    imageUrl: string,
    caption: string,
    isLiked: boolean,
    likes: number,
    category: Category,
    createdAt: string
}

// Category — union type: "all" | "tech" | "lifestyle" | "travel" | "food"
export type Category = "all" | "tech" | "lifestyle" | "travel" | "food";

// NewPostForm — caption, imageUrl, category (no id, userId, likes etc)
export interface NewPostForm {
    caption: string,
    imageUrl: string,
    category: Category
}

// AuthContextType — user, login, logout, isLoggedIn
export interface AuthContextType {
    user: User | null,
    login: (username: string) => void,
    logout: () => void,
    isLoggedIn: boolean,
    toggleFollow: (username: string) => void
}

export const AuthContext = createContext<AuthContextType | null>(null);

// FeedContextType — posts, addPost, toggleLike, filterCategory,
//                   setFilterCategory
export interface FeedContextType {
    posts: Post[],
    addPost: (form: NewPostForm) => void,
    toggleLike: (postId: string) => void,
    filterCategory: Category,
    setFilterCategory: (category: Category) => void
}

export const FeedContext = createContext<FeedContextType | null>(null);