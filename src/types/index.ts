import { createContext } from 'react'
import { type User } from 'firebase/auth'
import type { Timestamp } from 'firebase/firestore';
// AppUser — uid, displayName, avatar, bio, followers, isFollowing

export interface UserProfile {
    userId: string
    username: string,
    displayName: string,
    email: string,
    photoURL: string,
    bio: string,
    followerCount: number,
    createdAt: Timestamp,
}

// Post — id, userId, username, caption, imageUrl,
//         likes, isLiked, category, createdAt
export interface Post{
    postId: string,
    userId: string,
    username: string,
    avatar: string,
    imageUrl: string,
    caption: string,
    likes: number,
    category: Category,
    createdAt: Timestamp,
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
    deleteAccount: (user: User) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null);

// FeedContextType — posts, addPost, toggleLike, filterCategory,
//                   setFilterCategory
export interface FeedContextType {
    feed: Post[],
    posts: Post[],
    createPost: (currentUser: UserProfile, form: NewPostForm) => Promise<void>,
    loadNewestPosts: () => Promise<void>,
    loadUserPosts: () => Promise<void>,
}

export const FeedContext = createContext<FeedContextType | null>(null);


export interface UserContextType {
    profileUser: UserProfile | null,
    isLoading: boolean,
    fetchProfileUser: () => Promise<void>
}

export const UserContext = createContext<UserContextType | null>(null);


export interface ConfirmModalProps{
    isOpen: boolean,
    title: string,
    message: string,
    confirmText?: string,
    cancelText?: string,
    onConfirm: () => void,
    onCancel: () => void
}