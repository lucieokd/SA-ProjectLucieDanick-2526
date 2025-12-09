import { db } from "../firebase/firebaseConfig";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
} from "firebase/firestore";


type Artist = {
  id: string;
  name: string;
  images?: { url: string }[];
  genres?: string[];
  followers?: { total: number };
  popularity?: number;
};

export type User = {
  id?: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  favArtists: Artist[]
};

// Maak een nieuwe user aan in Firestore
export async function createUser(userData: Omit<User, "id">): Promise<string> {
  if (!userData.authId) throw new Error("authId is required");

  const userRef = doc(db, "users", userData.authId);

  await setDoc(userRef, {
    ...userData,
    favArtists: []
  });

  return userRef.id;
}


// Haal user op via authId (document ID is gelijk aan authId)
export async function getUserByAuthId(authId: string): Promise<User | null> {
  const userDocRef = doc(db, "users", authId);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    return null;
  }
  
  return {
    id: userDoc.id,
    ...userDoc.data(),
  } as User;
}

// Update user data (document ID is gelijk aan authId)
export async function updateUser(authId: string, updates: Partial<User>): Promise<void> {
  const userDocRef = doc(db, "users", authId);
  const userDoc = await getDoc(userDocRef);
  
  if (!userDoc.exists()) {
    throw new Error("User not found");
  }
  
  await updateDoc(userDocRef, updates);
}
