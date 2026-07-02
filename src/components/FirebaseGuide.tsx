import { useState } from "react";

const ORANGE = "#FF6B35";
const DARK = "#0F1117";
const CARD = "#1A1D27";
const BORDER = "#2A2D3A";
const TEXT = "#E8EAF0";
const MUTED = "#8B8FA8";
const GREEN = "#4ADE80";
const BLUE = "#60A5FA";
const YELLOW = "#FBBF24";
const PURPLE = "#A78BFA";

const modules = [
  {
    id: 1,
    emoji: "🔥",
    title: "What is Firebase & Setup",
    color: ORANGE,
    sections: [
      {
        heading: "What is Firebase?",
        content: `Firebase is Google's Backend-as-a-Service (BaaS) platform. Instead of building your own Node.js/Express server, Firebase gives you a ready-made backend with:

• **Firestore** – NoSQL cloud database (what you'll use for posts, users, comments)
• **Authentication** – Email/Google/GitHub login, already secured
• **Storage** – Upload images and videos (profile pics, post media)
• **Hosting** – Deploy your app (alternative to Vercel)
• **Cloud Functions** – Run server-side code (like sending notifications)

Think of it as: your Pulse app already has a frontend (React + TypeScript). Firebase IS the backend.`,
        code: null,
      },
      {
        heading: "Step 1 — Create Firebase Project",
        content: `1. Go to **console.firebase.google.com**
2. Click **"Add project"** → name it "pulse-app"
3. Disable Google Analytics (not needed now) → click Create
4. Once created, click the **Web icon (</>)** to register your app
5. Name it "pulse-web" → click Register app
6. **Copy the firebaseConfig object** — you'll need it next`,
        code: null,
      },
      {
        heading: "Step 2 — Install Firebase SDK",
        content: "Run this in your Pulse project root:",
        code: `npm install firebase`,
      },
      {
        heading: "Step 3 — Create firebase.ts config file",
        content: "Create `src/firebase/firebase.ts` — this initializes Firebase once for your whole app:",
        code: `// src/firebase/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "pulse-app.firebaseapp.com",
  projectId: "pulse-app",
  storageBucket: "pulse-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase — only runs once
const app = initializeApp(firebaseConfig);

// Export the services you'll use across your app
export const db = getFirestore(app);    // Database
export const auth = getAuth(app);       // Authentication
export const storage = getStorage(app); // File storage`,
      },
      {
        heading: "Why separate exports?",
        content: `By exporting \`db\`, \`auth\`, and \`storage\` individually, any file in your project can import just what it needs:

\`\`\`ts
import { db } from "../firebase/firebase";       // for database
import { auth } from "../firebase/firebase";     // for login
import { storage } from "../firebase/firebase";  // for images
\`\`\`

This keeps things clean and avoids re-initializing Firebase multiple times.`,
        code: null,
      },
    ],
  },
  {
    id: 2,
    emoji: "🔐",
    title: "Firebase Authentication",
    color: BLUE,
    sections: [
      {
        heading: "Enable Auth in Firebase Console",
        content: `1. In Firebase Console → go to **Authentication** (left sidebar)
2. Click **"Get started"**
3. Under **Sign-in method**, enable:
   - **Email/Password** (for email login)
   - **Google** (for social login — users love this)
4. Save

That's it — Firebase handles password hashing, JWT tokens, session management automatically.`,
        code: null,
      },
      {
        heading: "Create useAuth hook (TypeScript)",
        content: "Create `src/hooks/useAuth.ts` — this replaces your current localStorage-based AuthContext:",
        code: `// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  User
} from "firebase/auth";
import { auth } from "../firebase/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 This listener auto-runs whenever login state changes
  // Even on page refresh — no more localStorage needed!
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe; // cleanup on unmount
  }, []);

  // Sign up with email
  const signUp = async (email: string, password: string, displayName: string) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Set display name immediately after signup
    await updateProfile(result.user, { displayName });
    return result.user;
  };

  // Log in with email
  const logIn = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Google login (one-tap popup)
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  };

  // Log out
  const logOut = () => signOut(auth);

  return { user, loading, signUp, logIn, googleLogin, logOut };
}`,
      },
      {
        heading: "Use it in your AuthContext",
        content: "Wrap your app with a context that exposes the auth state:",
        code: `// src/context/AuthContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { User } from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  logIn: (email: string, password: string) => Promise<User>;
  googleLogin: () => Promise<User>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider");
  return ctx;
};`,
      },
      {
        heading: "Login Component Example",
        content: "Here's how a login form looks with Firebase auth:",
        code: `// src/pages/Login.tsx
import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { logIn, googleLogin } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await logIn(email, password);
      navigate("/feed"); // redirect after login
    } catch (err: any) {
      // Firebase gives descriptive error codes
      if (err.code === "auth/wrong-password") setError("Wrong password");
      else if (err.code === "auth/user-not-found") setError("No account found");
      else setError("Login failed");
    }
  };

  return (
    <div>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleLogin}>Log In</button>
      <button onClick={googleLogin}>Continue with Google</button>
    </div>
  );
}`,
      },
      {
        heading: "Protected Routes",
        content: "Replace your existing PrivateRoute — now it uses real Firebase auth:",
        code: `// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuthContext();

  if (loading) return <div>Loading...</div>; // wait for Firebase to check session
  if (!user) return <Navigate to="/login" />;
  return children;
}`,
      },
    ],
  },
  {
    id: 3,
    emoji: "🗃️",
    title: "Firestore Database",
    color: GREEN,
    sections: [
      {
        heading: "How Firestore Works (vs SQL)",
        content: `Firestore is a **document database** — think JSON, not tables.

**SQL (what you learned in DB courses):**
\`\`\`
users table:  id | name | email | bio
posts table:  id | userId | content | likes | createdAt
\`\`\`

**Firestore structure:**
\`\`\`
/users/{userId}           ← document
  { name, email, bio, photoURL }

/posts/{postId}           ← document
  { authorId, content, likes: 0, createdAt }

/posts/{postId}/comments/{commentId}  ← subcollection
  { authorId, text, createdAt }
\`\`\`

Key idea: **Collections** contain **Documents**. Documents contain fields (strings, numbers, booleans, timestamps, arrays, maps) and can have **subcollections**.`,
        code: null,
      },
      {
        heading: "Enable Firestore",
        content: `1. Firebase Console → **Firestore Database** → **Create database**
2. Choose **"Start in test mode"** (allows all reads/writes for now — secure later)
3. Pick a region (choose one close to your users, e.g. \`asia-south1\` for Pakistan)
4. Click Enable`,
        code: null,
      },
      {
        heading: "Create a User Document on Signup",
        content: "When a user signs up, also create their Firestore profile. Update your signUp function:",
        code: `// src/hooks/useAuth.ts  (update signUp)
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebase";

const signUp = async (email: string, password: string, displayName: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(result.user, { displayName });

  // Create user document in Firestore
  await setDoc(doc(db, "users", result.user.uid), {
    uid: result.user.uid,
    displayName,
    email,
    bio: "",
    photoURL: "",
    followers: [],
    following: [],
    createdAt: serverTimestamp(), // Firebase server time (not client time)
  });

  return result.user;
};`,
      },
      {
        heading: "CRUD Operations — Create a Post",
        content: "Create `src/firebase/posts.ts` to keep all post logic separate:",
        code: `// src/firebase/posts.ts
import {
  collection, addDoc, getDocs, getDoc, doc,
  updateDoc, deleteDoc, query, orderBy,
  limit, onSnapshot, serverTimestamp, increment,
  arrayUnion, arrayRemove, where
} from "firebase/firestore";
import { db } from "./firebase";
import { Post } from "../types"; // your TypeScript types

// ── CREATE ─────────────────────────────────────────────
export async function createPost(
  authorId: string,
  authorName: string,
  content: string,
  imageURL?: string
) {
  // addDoc auto-generates an ID
  const docRef = await addDoc(collection(db, "posts"), {
    authorId,
    authorName,
    content,
    imageURL: imageURL || null,
    likes: [],        // array of userIds who liked
    likesCount: 0,    // redundant but fast to read
    commentsCount: 0,
    createdAt: serverTimestamp(),
  });
  return docRef.id; // returns the new post's ID
}`,
      },
      {
        heading: "CRUD — Read Posts (Real-time Feed)",
        content: "This is the magic of Firestore — real-time updates without polling:",
        code: `// src/firebase/posts.ts (continued)

// ── READ — Real-time feed ──────────────────────────────
// onSnapshot fires IMMEDIATELY with current data,
// then fires AGAIN every time data changes in the DB
export function subscribeToPosts(callback: (posts: Post[]) => void) {
  const q = query(
    collection(db, "posts"),
    orderBy("createdAt", "desc"), // newest first
    limit(20)                      // pagination
  );

  // Returns an unsubscribe function — call it on unmount!
  return onSnapshot(q, (snapshot) => {
    const posts: Post[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Post));
    callback(posts);
  });
}

// ── READ — Single post ─────────────────────────────────
export async function getPost(postId: string): Promise<Post | null> {
  const docSnap = await getDoc(doc(db, "posts", postId));
  if (!docSnap.exists()) return null;
  return { id: docSnap.id, ...docSnap.data() } as Post;
}`,
      },
      {
        heading: "CRUD — Update (Like a Post)",
        content: "Likes use arrayUnion/arrayRemove so two users can like simultaneously:",
        code: `// src/firebase/posts.ts (continued)

// ── UPDATE — Like / Unlike ─────────────────────────────
export async function toggleLike(postId: string, userId: string, isLiked: boolean) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: isLiked ? arrayRemove(userId) : arrayUnion(userId),
    likesCount: increment(isLiked ? -1 : 1), // atomic increment (safe!)
  });
}

// ── DELETE ─────────────────────────────────────────────
export async function deletePost(postId: string) {
  await deleteDoc(doc(db, "posts", postId));
}`,
      },
      {
        heading: "Using Real-time Data in a Component",
        content: "Here's how your FeedContext uses the real-time subscription:",
        code: `// src/context/FeedContext.tsx
import { useState, useEffect, createContext, useContext } from "react";
import { subscribeToPosts } from "../firebase/posts";
import { Post } from "../types";

const FeedContext = createContext<{ posts: Post[] }>({ posts: [] });

export function FeedProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Subscribe — runs onSnapshot listener
    const unsubscribe = subscribeToPosts(setPosts);

    // Cleanup: unsubscribe when component unmounts
    // Without this, you'd have a memory leak!
    return () => unsubscribe();
  }, []);

  return (
    <FeedContext.Provider value={{ posts }}>
      {children}
    </FeedContext.Provider>
  );
}

export const useFeed = () => useContext(FeedContext);`,
      },
      {
        heading: "TypeScript Types for Firestore",
        content: "Define your data types to get full TypeScript safety:",
        code: `// src/types/index.ts
import { Timestamp } from "firebase/firestore";

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  bio: string;
  photoURL: string;
  followers: string[];   // array of uids
  following: string[];
  createdAt: Timestamp;
}

export interface Post {
  id: string;            // Firestore doc ID
  authorId: string;
  authorName: string;
  content: string;
  imageURL: string | null;
  likes: string[];       // array of uids
  likesCount: number;
  commentsCount: number;
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: Timestamp;
}`,
      },
    ],
  },
  {
    id: 4,
    emoji: "🖼️",
    title: "Firebase Storage (Images)",
    color: PURPLE,
    sections: [
      {
        heading: "Enable Storage",
        content: `1. Firebase Console → **Storage** → **Get started**
2. Start in test mode → choose your region → Done

Storage organizes files in folders, just like a file system. You'll store:
- \`/avatars/{userId}.jpg\` — profile pictures
- \`/posts/{postId}/{filename}\` — post images`,
        code: null,
      },
      {
        heading: "Upload Profile Picture",
        content: "Create `src/firebase/storage.ts`:",
        code: `// src/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage, db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth } from "./firebase";

// Upload avatar and update user profile
export async function uploadAvatar(userId: string, file: File): Promise<string> {
  // Create a reference: "avatars/abc123.jpg"
  const avatarRef = ref(storage, \`avatars/\${userId}\`);

  // Upload the file (returns metadata)
  await uploadBytes(avatarRef, file);

  // Get the public download URL
  const downloadURL = await getDownloadURL(avatarRef);

  // Update Firebase Auth profile
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
  }

  // Update Firestore user document
  await updateDoc(doc(db, "users", userId), {
    photoURL: downloadURL
  });

  return downloadURL;
}

// Upload post image
export async function uploadPostImage(postId: string, file: File): Promise<string> {
  const imageRef = ref(storage, \`posts/\${postId}/\${file.name}\`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
}

// Delete an image
export async function deleteImage(path: string) {
  const imageRef = ref(storage, path);
  await deleteObject(imageRef);
}`,
      },
      {
        heading: "Avatar Upload Component",
        content: "A simple file picker that uploads on change:",
        code: `// src/components/AvatarUpload.tsx
import { useRef } from "react";
import { uploadAvatar } from "../firebase/storage";
import { useAuthContext } from "../context/AuthContext";

export default function AvatarUpload() {
  const { user } = useAuthContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    // Validate: only images, max 2MB
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      return;
    }

    try {
      const url = await uploadAvatar(user.uid, file);
      console.log("Avatar uploaded:", url);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div onClick={() => inputRef.current?.click()} style={{ cursor: "pointer" }}>
      <img
        src={user?.photoURL || "/default-avatar.png"}
        alt="avatar"
        style={{ width: 80, height: 80, borderRadius: "50%" }}
      />
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
}`,
      },
    ],
  },
  {
    id: 5,
    emoji: "🛡️",
    title: "Security Rules",
    color: YELLOW,
    sections: [
      {
        heading: "Why Security Rules Matter",
        content: `Right now in **test mode**, ANYONE can read/write your entire database — even without logging in. Before launching, you MUST set Security Rules.

Security Rules run on Firebase's servers. They check every read/write request before it touches your data. You write them in a special language in the Firebase Console.`,
        code: null,
      },
      {
        heading: "Firestore Security Rules",
        content: "Go to Firestore → Rules tab → paste this:",
        code: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper: check if user is logged in
    function isAuth() {
      return request.auth != null;
    }

    // Helper: check if request is from the owner
    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    // USERS: anyone logged in can read profiles
    // only the owner can update their own profile
    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // nobody can delete users
    }

    // POSTS: anyone logged in can read
    // only the author can delete their post
    match /posts/{postId} {
      allow read: if isAuth();
      allow create: if isAuth()
        && request.resource.data.authorId == request.auth.uid;
      allow update: if isAuth(); // for likes (anyone can like)
      allow delete: if isAuth()
        && resource.data.authorId == request.auth.uid;

      // COMMENTS subcollection
      match /comments/{commentId} {
        allow read: if isAuth();
        allow create: if isAuth();
        allow delete: if isAuth()
          && resource.data.authorId == request.auth.uid;
      }
    }
  }
}`,
      },
      {
        heading: "Storage Security Rules",
        content: "Go to Storage → Rules tab:",
        code: `rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {

    // Avatars: owner can write, anyone logged in can read
    match /avatars/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.auth.uid == userId
        && request.resource.size < 2 * 1024 * 1024  // max 2MB
        && request.resource.contentType.matches('image/.*');
    }

    // Post images: author can write, anyone logged in can read
    match /posts/{postId}/{filename} {
      allow read: if request.auth != null;
      allow write: if request.auth != null
        && request.resource.size < 5 * 1024 * 1024; // max 5MB
    }
  }
}`,
      },
    ],
  },
  {
    id: 6,
    emoji: "⚡",
    title: "Putting It All Together",
    color: ORANGE,
    sections: [
      {
        heading: "Final Project Structure",
        content: "Here's how your Pulse app should be organized with Firebase:",
        code: `src/
├── firebase/
│   ├── firebase.ts      ← init (db, auth, storage)
│   ├── posts.ts         ← createPost, subscribeToPosts, toggleLike
│   ├── users.ts         ← getUserProfile, updateProfile, followUser
│   ├── comments.ts      ← addComment, getComments
│   └── storage.ts       ← uploadAvatar, uploadPostImage
│
├── context/
│   ├── AuthContext.tsx  ← wraps useAuth, provides user globally
│   └── FeedContext.tsx  ← real-time posts subscription
│
├── hooks/
│   ├── useAuth.ts       ← Firebase auth logic
│   └── usePost.ts       ← post-specific logic
│
├── types/
│   └── index.ts         ← UserProfile, Post, Comment interfaces
│
└── pages/
    ├── Login.tsx
    ├── Signup.tsx
    ├── Feed.tsx
    └── Profile.tsx`,
      },
      {
        heading: "Follow / Unfollow System",
        content: "Social graph using Firestore arrays:",
        code: `// src/firebase/users.ts
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { UserProfile } from "../types";

export async function followUser(currentUserId: string, targetUserId: string) {
  // Add targetUser to current user's following list
  await updateDoc(doc(db, "users", currentUserId), {
    following: arrayUnion(targetUserId)
  });
  // Add currentUser to target user's followers list
  await updateDoc(doc(db, "users", targetUserId), {
    followers: arrayUnion(currentUserId)
  });
}

export async function unfollowUser(currentUserId: string, targetUserId: string) {
  await updateDoc(doc(db, "users", currentUserId), {
    following: arrayRemove(targetUserId)
  });
  await updateDoc(doc(db, "users", targetUserId), {
    followers: arrayRemove(currentUserId)
  });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", userId));
  if (!snap.exists()) return null;
  return { uid: snap.id, ...snap.data() } as UserProfile;
}`,
      },
      {
        heading: "Comments Subcollection",
        content: "Comments live INSIDE each post document as a subcollection:",
        code: `// src/firebase/comments.ts
import {
  collection, addDoc, onSnapshot,
  query, orderBy, serverTimestamp, doc
} from "firebase/firestore";
import { db } from "./firebase";
import { Comment } from "../types";

// Add a comment to a post
export async function addComment(
  postId: string,
  authorId: string,
  authorName: string,
  text: string
) {
  // Path: posts/{postId}/comments/{auto-id}
  await addDoc(collection(db, "posts", postId, "comments"), {
    postId,
    authorId,
    authorName,
    text,
    createdAt: serverTimestamp(),
  });
}

// Subscribe to comments in real-time
export function subscribeToComments(
  postId: string,
  callback: (comments: Comment[]) => void
) {
  const q = query(
    collection(db, "posts", postId, "comments"),
    orderBy("createdAt", "asc")
  );
  return onSnapshot(q, (snap) => {
    const comments = snap.docs.map(d => ({
      id: d.id,
      ...d.data()
    } as Comment));
    callback(comments);
  });
}`,
      },
      {
        heading: "env variables (don't commit secrets)",
        content: "Store your Firebase config in a `.env` file — never commit API keys to GitHub:",
        code: `# .env (in project root — add to .gitignore!)
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=pulse-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=pulse-app
VITE_FIREBASE_STORAGE_BUCKET=pulse-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your_app_id_here

# Then in firebase.ts, use:
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};`,
      },
      {
        heading: "What to Build Next",
        content: `You now have a production-ready Firebase backend. Here's your roadmap:

**Week 1 — Core** ✅
- Firebase setup + Auth (email + Google)
- Firestore posts CRUD + real-time feed
- Like / unlike system

**Week 2 — Social**
- Comments subcollection
- Follow / unfollow users
- User profile page with avatar upload

**Week 3 — Polish**
- Pagination (Firestore cursor-based with \`startAfter()\`)
- Search users (Algolia or simple prefix queries)
- Notifications collection

**Week 4 — Deploy**
- Add env variables to Vercel project settings
- Set Firestore + Storage security rules to production mode
- Deploy: \`vercel --prod\``,
        code: null,
      },
    ],
  },
];

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ position: "relative", margin: "12px 0" }}>
      <button
        onClick={copy}
        style={{
          position: "absolute", top: 8, right: 8,
          background: copied ? GREEN : "#2A2D3A",
          color: copied ? DARK : MUTED,
          border: "none", borderRadius: 6,
          padding: "3px 10px", fontSize: 11,
          cursor: "pointer", fontFamily: "monospace",
          transition: "all 0.2s",
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
      <pre style={{
        background: "#0D0F17",
        border: `1px solid ${BORDER}`,
        borderRadius: 10,
        padding: "16px 16px 16px 16px",
        overflowX: "auto",
        fontSize: 12.5,
        lineHeight: 1.65,
        color: "#C9D1D9",
        margin: 0,
        fontFamily: "'Fira Code', 'Cascadia Code', monospace",
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Section({ heading, content, code }: { heading: string; content: string; code: string | null }) {
  const renderContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const hasBold = line.includes("**");
      if (hasBold) {
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i} style={{ margin: "4px 0", color: line.startsWith("•") ? TEXT : MUTED, lineHeight: 1.7 }}>
            {parts.map((p, j) => j % 2 === 1
              ? <strong key={j} style={{ color: TEXT }}>{p}</strong>
              : <span key={j}>{p}</span>
            )}
          </p>
        );
      }
      if (line.startsWith("```")) return null;
      if (line.trim() === "") return <br key={i} />;
      return (
        <p key={i} style={{
          margin: "4px 0",
          color: line.startsWith("•") || line.match(/^\d\./) ? TEXT : MUTED,
          fontFamily: line.includes("`") ? "monospace" : "inherit",
          lineHeight: 1.7,
          fontSize: 14,
        }}>
          {line.includes("`") ? line.split(/`([^`]+)`/g).map((seg, j) =>
            j % 2 === 1
              ? <code key={j} style={{ background: "#1E2030", color: ORANGE, padding: "1px 5px", borderRadius: 4, fontSize: 13 }}>{seg}</code>
              : seg
          ) : line}
        </p>
      );
    }).filter(Boolean);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      <h3 style={{ color: TEXT, fontSize: 15, fontWeight: 600, margin: "0 0 10px 0" }}>{heading}</h3>
      <div style={{ marginBottom: code ? 8 : 0 }}>{renderContent(content)}</div>
      {code && <CodeBlock code={code} />}
    </div>
  );
}

export default function FirebaseGuide() {
  const [activeModule, setActiveModule] = useState(0);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const mod = modules[activeModule];

  const toggleSection = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div style={{
      background: DARK, minHeight: "100vh", fontFamily: "'Inter', system-ui, sans-serif",
      color: TEXT, display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        background: CARD, borderBottom: `1px solid ${BORDER}`,
        padding: "18px 24px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <span style={{ fontSize: 28 }}>🔥</span>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: TEXT }}>Firebase for Pulse</h1>
          <p style={{ margin: 0, fontSize: 12, color: MUTED }}>Complete backend guide for your social media app</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          {modules.map((m, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: "50%",
              background: i <= activeModule ? m.color : BORDER,
              transition: "background 0.3s",
            }} />
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Sidebar */}
        <div style={{
          width: 220, background: CARD, borderRight: `1px solid ${BORDER}`,
          padding: "16px 0", flexShrink: 0, overflowY: "auto",
        }}>
          {modules.map((m, i) => (
            <button
              key={m.id}
              onClick={() => setActiveModule(i)}
              style={{
                width: "100%", textAlign: "left", background: "none",
                border: "none", cursor: "pointer",
                padding: "10px 16px",
                borderLeft: activeModule === i ? `3px solid ${m.color}` : "3px solid transparent",
                display: "flex", alignItems: "flex-start", gap: 10,
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: 18, marginTop: 1 }}>{m.emoji}</span>
              <div>
                <div style={{
                  fontSize: 12, fontWeight: activeModule === i ? 600 : 400,
                  color: activeModule === i ? m.color : MUTED,
                  lineHeight: 1.4,
                }}>{m.title}</div>
                <div style={{ fontSize: 10, color: BORDER, marginTop: 2 }}>
                  {m.sections.length} sections
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Main content */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {/* Module header */}
          <div style={{
            background: `linear-gradient(135deg, ${mod.color}15, ${CARD})`,
            border: `1px solid ${mod.color}30`,
            borderRadius: 14, padding: "20px 24px", marginBottom: 24,
          }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{mod.emoji}</div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: 22, fontWeight: 700, color: mod.color }}>
              {mod.title}
            </h2>
            <p style={{ margin: 0, color: MUTED, fontSize: 13 }}>
              Module {mod.id} of {modules.length} · {mod.sections.length} sections
            </p>
          </div>

          {/* Sections */}
          {mod.sections.map((sec, i) => {
            const key = `${mod.id}-${i}`;
            const isOpen = openSections[key] !== false; // open by default
            return (
              <div key={i} style={{
                background: CARD, border: `1px solid ${BORDER}`,
                borderRadius: 12, marginBottom: 12, overflow: "hidden",
              }}>
                <button
                  onClick={() => toggleSection(key)}
                  style={{
                    width: "100%", textAlign: "left", background: "none",
                    border: "none", cursor: "pointer", padding: "14px 18px",
                    display: "flex", alignItems: "center", gap: 10,
                  }}
                >
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%",
                    background: mod.color, color: DARK,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: TEXT, flex: 1 }}>
                    {sec.heading}
                  </span>
                  {sec.code && (
                    <span style={{
                      fontSize: 10, background: "#1E2030", color: ORANGE,
                      padding: "2px 7px", borderRadius: 4, fontFamily: "monospace",
                    }}>code</span>
                  )}
                  <span style={{ color: MUTED, fontSize: 14, transform: isOpen ? "rotate(90deg)" : "none", transition: "0.2s" }}>›</span>
                </button>
                {isOpen && (
                  <div style={{ padding: "0 18px 18px 50px" }}>
                    <Section heading="" content={sec.content} code={sec.code} />
                  </div>
                )}
              </div>
            );
          })}

          {/* Navigation */}
          <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "space-between" }}>
            <button
              onClick={() => setActiveModule(p => Math.max(0, p - 1))}
              disabled={activeModule === 0}
              style={{
                background: activeModule === 0 ? BORDER : CARD,
                color: activeModule === 0 ? MUTED : TEXT,
                border: `1px solid ${BORDER}`, borderRadius: 8,
                padding: "10px 20px", cursor: activeModule === 0 ? "default" : "pointer",
                fontSize: 13, fontWeight: 500,
              }}
            >
              ← Previous
            </button>
            <button
              onClick={() => setActiveModule(p => Math.min(modules.length - 1, p + 1))}
              disabled={activeModule === modules.length - 1}
              style={{
                background: activeModule === modules.length - 1 ? BORDER : mod.color,
                color: activeModule === modules.length - 1 ? MUTED : DARK,
                border: "none", borderRadius: 8,
                padding: "10px 20px", cursor: activeModule === modules.length - 1 ? "default" : "pointer",
                fontSize: 13, fontWeight: 600,
              }}
            >
              Next Module →
            </button>
          </div>
        </div>
      </div>
    <div className="">
      <p>
        {`// Import the functions you need from the SDKs you need
          import { initializeApp } from "firebase/app";
          import { getAnalytics } from "firebase/analytics";
          // TODO: Add SDKs for Firebase products that you want to use
          // https://firebase.google.com/docs/web/setup#available-libraries

          // Your web app's Firebase configuration
          // For Firebase JS SDK v7.20.0 and later, measurementId is optional
          const firebaseConfig = {
            apiKey: "AIzaSyDNQfgjnJLxmVgCQkUSbVgIOv0YBUcgkJI",
            authDomain: "social-media-app-68acc.firebaseapp.com",
            projectId: "social-media-app-68acc",
            storageBucket: "social-media-app-68acc.firebasestorage.app",
            messagingSenderId: "1050459260180",
            appId: "1:1050459260180:web:bfbee4a113b632a9aaae01",
            measurementId: "G-MYH8VPK18N"
          };

          // Initialize Firebase
          const app = initializeApp(firebaseConfig);
          const analytics = getAnalytics(app);`}
      </p>
    </div>
    </div>
  );
}
