import { createContext } from 'react'
import { type User } from 'firebase/auth'

// AppUser — uid, displayName, avatar, bio, followers, isFollowing

export interface AppUser {
    username: string,
    displayName: string,
    email: string,
    photoURL: string,
    bio: string,
    followerCount: number,
    createdAt: string
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

// AuthContextType — currentUser, login, logout, isLoggedIn
export interface AuthContextType {
    currentUser: User | null,
    isLoading: boolean,
    registerWithEmail: (email: string, password: string, displayName: string) => Promise<User>,
    loginWithEmail: (email: string, password: string) => Promise<User>,
    loginWithGoogle: () => Promise<User>,
    logout: () => void,
}

export const AuthContext = createContext<AuthContextType | null>(null);

// FeedContextType — posts, addPost, toggleLike, filterCategory,
//                   setFilterCategory
export interface FeedContextType {
    posts: Post[],
    addPost: (form: NewPostForm) => void,
    toggleLike: (postId: string) => void,
    filterCategory: Category,
    setFilterCategory: (category: Category) => void,
    removePosts: (postId: string) => void
}

export const FeedContext = createContext<FeedContextType | null>(null);


export interface UserContextType {
    profileUser: AppUser | null,
    isLoading: boolean,
    fetchProfileUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null);