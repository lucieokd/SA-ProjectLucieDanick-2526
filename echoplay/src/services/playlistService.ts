import { db, storage } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  Unsubscribe,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  createdAt: Timestamp;
};

// create playlist (uploads image file if provided)
export async function createPlaylist({
  name,
  description,
  imageFile,
}: {
  name: string;
  description?: string;
  imageFile?: File | null;
}) {
  let imageUrl: string | null = null;

  if (imageFile) {
    const fileRef = ref(storage, `playlist_covers/${Date.now()}_${imageFile.name}`);
    const snapshot = await uploadBytes(fileRef, imageFile);
    imageUrl = await getDownloadURL(snapshot.ref);
  }

  const docRef = await addDoc(collection(db, "playlists"), {
    name,
    description: description || null,
    imageUrl,
    createdAt: Timestamp.now(),
  });

  return docRef.id;
}

// subscribe to playlists (real-time)
// callback gets array of Playlist
export function subscribePlaylists(
  onUpdate: (items: Playlist[]) => void
): Unsubscribe {
  const q = query(collection(db, "playlists"), orderBy("createdAt", "desc"));
  const unsub = onSnapshot(q, (snapshot) => {
    const items: Playlist[] = snapshot.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        name: data.name,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? null,
        createdAt: data.createdAt,
      } as Playlist;
    });
    onUpdate(items);
  });

  return unsub;
}
