import { db } from "../firebase/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export type User = {
  id?: string;
  authId: string;
  email: string;
  firstName: string;
  lastName: string;
  geboorteDag: number;
  geboorteMaand: number;
  geboorteJaar: number;
  favoriteArtist?: string[];
};

// Maak een nieuwe user aan in Firestore
export async function createUser(userData: Omit<User, "id">): Promise<string> {
  if (!userData.authId) {
    throw new Error("authId is required");
  }
  const docRef = doc(collection(db, "users"));
  await setDoc(docRef, userData);
  return docRef.id;
}

// Haal user op via authId
export async function getUserByAuthId(authId: string): Promise<User | null> {
  const q = query(collection(db, "users"), where("authId", "==", authId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as User;
}

// Update user data
export async function updateUser(authId: string, updates: Partial<User>): Promise<void> {
  const q = query(collection(db, "users"), where("authId", "==", authId));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    throw new Error("User not found");
  }
  
  const docRef = doc(db, "users", querySnapshot.docs[0].id);
  await updateDoc(docRef, updates);
}
