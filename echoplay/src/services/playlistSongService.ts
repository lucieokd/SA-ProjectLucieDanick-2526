// src/services/playlistSongService.ts

import { db } from "../firebase/firebaseConfig";
import {
  addDoc,
  collection,
  Timestamp,
  query,
  where,
  onSnapshot,
  getDocs,
  DocumentData,
} from "firebase/firestore";

export type PlaylistSong = {
  id: string;
  playlistId: string;
  trackId: string;
  name: string;
  artist: string;
  preview_url: string | null;
  image: string | null;
  createdAt: Timestamp;
};

// 🔥 1. Zoeken of Favorites playlist al bestaat → anders aanmaken
export async function getOrCreateFavoritesPlaylist() {
  const q = query(collection(db, "playlists"), where("name", "==", "Favorites"));
  const snap = await getDocs(q);

  if (!snap.empty) return snap.docs[0].id;

  const newDoc = await addDoc(collection(db, "playlists"), {
    name: "Favorites",
    description: "Your favorited songs",
    imageUrl: null,
    createdAt: Timestamp.now(),
  });

  return newDoc.id;
}

// 🔥 2. Track toevoegen aan playlist
export async function addSongToPlaylist(playlistId: string, track: any) {
  await addDoc(collection(db, "playlistSongs"), {
    playlistId,
    trackId: track.id,
    name: track.name,
    artist: track.artists.map((a: any) => a.name).join(", "),
    preview_url: track.preview_url || null,
    image: track.album.images?.[0]?.url || null,
    createdAt: Timestamp.now(),
  });
}

// 🔥 3. Realtime subscribe op songs binnen één playlist
export function subscribeSongs(playlistId: string, onUpdate: (songs: PlaylistSong[]) => void) {
  const q = query(
    collection(db, "playlistSongs"),
    where("playlistId", "==", playlistId)
  );

  return onSnapshot(q, (snap) => {
    const songs: PlaylistSong[] = snap.docs.map((doc) => {
      const d = doc.data() as DocumentData;
      return {
        id: doc.id,
        ...d,
      } as PlaylistSong;
    });
    onUpdate(songs);
  });
}
