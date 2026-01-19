// src/services/playlistService.ts
import { db, storage } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  Unsubscribe,
  updateDoc,
  arrayUnion,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type Playlist = {
  id: string;
  userId: string;        
  name: string;
  description?: string;
  imageUrl?: string | null;
  createdAt: Timestamp;
  tracks: any[];
};

export async function createPlaylist({userId,name,description,imageFile,
}: {
  userId: string;
  name: string;
  description?: string;
  imageFile?: File | null;
}) {
  let imageUrl: string | null = null;

  if (imageFile) {
    const fileRef = ref(
      storage,
      `playlist_covers/${userId}/${Date.now()}_${imageFile.name}`
    );
    const snap = await uploadBytes(fileRef, imageFile);
    imageUrl = await getDownloadURL(snap.ref);
  }

  const docRef = await addDoc(collection(db, "playlists"), {
    userId,                      
    name,
    description: description || null,
    imageUrl,
    createdAt: Timestamp.now(),
    tracks: [],
  });

  return docRef.id;
}

export function subscribePlaylists(
  userId: string,
  onUpdate: (items: Playlist[]) => void
): Unsubscribe {
  const q = query(
    collection(db, "playlists"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );

  return onSnapshot(
    q,
    (snap) => {
      if (snap.empty) {
        console.warn("Firestore snapshot empty – update skipped");
        return;
      }

      const items: Playlist[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Playlist, "id">),
      }));

      onUpdate(items);
    },
    (error) => {
      console.error("Firestore playlist listener error:", error);
    }
  );
}


export async function findPlaylistByName(
  userId: string,
  name: string
) {
  const q = query(
    collection(db, "playlists"),
    where("userId", "==", userId),
    where("name", "==", name)
  );

  const snap = await getDocs(q);
  if (snap.empty) return null;

  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as any) };
}

export async function getOrCreateFavorites(userId: string) {
  const existing = await findPlaylistByName(userId, "Favorites");
  if (existing) return existing.id;

  return await createPlaylist({
    userId,
    name: "Favorites",
    description: "Your favorited songs",
  });
}

export async function getOrCreateMySongs(userId: string) {
  const existing = await findPlaylistByName(userId, "My Songs");
  if (existing) return existing.id;

  return await createPlaylist({
    userId,
    name: "My Songs",
    description: "Songs uploaded by you",
  });
}

export async function addTrackToPlaylist(
  playlistId: string,
  track: {
    id: string;
    name: string;
    artist: string;
    album: string;
    artwork: string | null;
    preview_url: string | null | undefined;
  }
) {
  const playlistRef = doc(db, "playlists", playlistId);
  const snap = await getDoc(playlistRef);

  if (!snap.exists()) return;

  const data = snap.data();

  // Mappen naar Firestore-track formaat
  const trackToStore = {
    id: track.id,
    name: track.name,
    preview_url: track.preview_url || null,
    artists: [{ name: track.artist }],
    album: { images: track.artwork ? [{ url: track.artwork }] : [] },
  };

  const updates: any = {
    tracks: arrayUnion(trackToStore),
  };

  // Stel playlist-cover alleen in als nog niet aanwezig
  if (!data.imageUrl && track.artwork) {
    updates.imageUrl = track.artwork;
  }

  await updateDoc(playlistRef, updates);
}




export async function removeTrackFromPlaylist(
  playlistId: string,
  trackToRemove: any
) {
  const playlistRef = doc(db, "playlists", playlistId);
  const snap = await getDoc(playlistRef);

  if (!snap.exists()) return;

  const data = snap.data();

  const updatedTracks = (data.tracks || []).filter(
    (t: any) => t.id !== trackToRemove.id
  );

  await updateDoc(playlistRef, {
    tracks: updatedTracks,
  });
}


export async function renamePlaylist(playlistId: string, newName: string) {
  const playlistRef = doc(db, "playlists", playlistId);
  await updateDoc(playlistRef, {
    name: newName,
  });
}

export async function deletePlaylist(playlistId: string) {
  const playlistRef = doc(db, "playlists", playlistId);
  await deleteDoc(playlistRef);
}