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
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  createdAt: Timestamp;
  tracks?: any[]; // <-- toegevoegd
};

// create playlist
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
    tracks: [], // <-- playlist bevat tracks
  });

  return docRef.id;
}

// subscribe to playlists
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
        tracks: data.tracks ?? [], // <-- toegevoegd
      };
    });
    onUpdate(items);
  });

  return unsub;
}

// 🔎 Zoek playlist op naam
export async function findPlaylistByName(name: string) {
  const snap = await getDocs(collection(db, "playlists"));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Playlist[];
  return all.find((p) => p.name.toLowerCase() === name.toLowerCase()) || null;
}

// ➕ Track toevoegen aan playlist
export async function addTrackToPlaylist(playlistId: string, track: any) {
  const playlistRef = doc(db, "playlists", playlistId);
  await updateDoc(playlistRef, {
    tracks: arrayUnion(track),
  });
}

// ➖ Track verwijderen uit playlist
export async function removeTrackFromPlaylist(playlistId: string, track: any) {
  const playlistRef = doc(db, "playlists", playlistId);
  await updateDoc(playlistRef, {
    tracks: arrayRemove(track),
  });
}
