// src/services/playlistService.ts
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
  doc,
  getDocs,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export type Playlist = {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string | null;
  createdAt: Timestamp;
  tracks?: any[];
};

/* ---------------------------------------
   🔥 Playlist CRUD + Track Management
---------------------------------------- */

/** 🎵 Playlist maken */
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
    const fileRef = ref(
      storage,
      `playlist_covers/${Date.now()}_${imageFile.name}`
    );
    const snap = await uploadBytes(fileRef, imageFile);
    imageUrl = await getDownloadURL(snap.ref);
  }

  const docRef = await addDoc(collection(db, "playlists"), {
    name,
    description: description || null,
    imageUrl,
    createdAt: Timestamp.now(),
    tracks: [],
  });

  return docRef.id;
}

/** 📡 Realtime ophalen */
export function subscribePlaylists(onUpdate: (items: Playlist[]) => void): Unsubscribe {
  const q = query(collection(db, "playlists"), orderBy("createdAt", "desc"));

  return onSnapshot(q, (snap) => {
    const items: Playlist[] = snap.docs.map((d) => {
      const data = d.data() as DocumentData;
      return {
        id: d.id,
        name: data.name,
        description: data.description ?? "",
        imageUrl: data.imageUrl ?? null,
        createdAt: data.createdAt,
        tracks: data.tracks ?? [],
      };
    });

    onUpdate(items);
  });
}

/** 🔎 Playlist zoeken op naam */
export async function findPlaylistByName(name: string) {
  const snap = await getDocs(collection(db, "playlists"));
  const all = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Playlist[];

  return all.find(
    (p) => p.name.toLowerCase().trim() === name.toLowerCase().trim()
  ) || null;
}

/* ---------------------------------------
   ⭐ Favorites / My Songs Special Rules
---------------------------------------- */

/** 🔄 Haal Favorites op of maak ze aan */
export async function getOrCreateFavorites() {
  let p = await findPlaylistByName("Favorites");

  if (p) return p.id;

  const id = await createPlaylist({
    name: "Favorites",
    description: "Your favorited songs",
    imageFile: null,
  });

  return id;
}

/** 🎵 Haal My Songs op of maak aan */
export async function getOrCreateMySongs() {
  let p = await findPlaylistByName("My Songs");

  if (p) return p.id;

  const id = await createPlaylist({
    name: "My Songs",
    description: "Songs uploaded by you",
    imageFile: null,
  });

  return id;
}

/* ---------------------------------------
   ➕ Tracks toevoegen
---------------------------------------- */

export async function addTrackToPlaylist(playlistId: string, track: any) {
  const playlistRef = doc(db, "playlists", playlistId);

  await updateDoc(playlistRef, {
    tracks: arrayUnion(track),
  });
}

/* ---------------------------------------
   ❌ Playlist verwijderen
---------------------------------------- */

export async function deletePlaylist(playlistId: string) {
  const refDoc = doc(db, "playlists", playlistId);
  await deleteDoc(refDoc);
}

/* ---------------------------------------
   ✏️ Playlist naam wijzigen
---------------------------------------- */

export async function renamePlaylist(playlistId: string, newName: string) {
  const refDoc = doc(db, "playlists", playlistId);
  await updateDoc(refDoc, { name: newName });
}

/* ---------------------------------------
   ❌ Track verwijderen uit playlist
---------------------------------------- */

export async function removeTrackFromPlaylist(playlistId: string, track: any) {
  const playlistRef = doc(db, "playlists", playlistId);
  const snap = await getDoc(playlistRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const oldTracks = data?.tracks ?? [];

  // Track eruit
  const updatedTracks = oldTracks.filter((t: any) => t.id !== track.id);

  // ❗ Geen tracks meer → playlist verwijderen
  if (updatedTracks.length === 0) {
    await deleteDoc(playlistRef);
    return;
  }

  await updateDoc(playlistRef, { tracks: updatedTracks });
}

/* ---------------------------------------
   🎵 Song upload → automatisch naar My Songs
---------------------------------------- */

export async function uploadSongToMySongs({
  audioFile,
  coverFile,
  name,
}: {
  audioFile: File;
  coverFile?: File | null;
  name: string;
}) {
  const mySongsId = await getOrCreateMySongs();

  // Upload audio
  const audioRef = ref(storage, `songs/${Date.now()}_${audioFile.name}`);
  const audioSnap = await uploadBytes(audioRef, audioFile);
  const audioUrl = await getDownloadURL(audioSnap.ref);

  // Upload cover (optioneel)
  let coverUrl: string | null = null;

  if (coverFile) {
    const coverRef = ref(storage, `covers/${Date.now()}_${coverFile.name}`);
    const coverSnap = await uploadBytes(coverRef, coverFile);
    coverUrl = await getDownloadURL(coverSnap.ref);
  }

  // Track object (zoals Spotify)
  const track = {
    id: Date.now().toString(),
    name,
    preview_url: audioUrl,
    album: {
      images: [{ url: coverUrl }],
    },
    artists: [{ name: "You" }],
  };

  await addTrackToPlaylist(mySongsId, track);
}
