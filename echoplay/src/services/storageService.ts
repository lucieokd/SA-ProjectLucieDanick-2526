import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/firebaseConfig";

export type StoredSong = {
  audioUrl: string;
  coverUrl?: string;
  name: string;
};

export const fetchSongsFromStorage = async (): Promise<StoredSong[]> => {
  const songsRef = ref(storage, "songs");
  const coversRef = ref(storage, "covers");

  const [songsResult, coversResult] = await Promise.all([
    listAll(songsRef),
    listAll(coversRef),
  ]);

  const coversMap = new Map<string, string>();

  // Covers → map op bestandsnaam (zonder extensie)
  for (const cover of coversResult.items) {
    const url = await getDownloadURL(cover);
    const baseName = cover.name.split(".")[0];
    coversMap.set(baseName, url);
  }

  const tracks: StoredSong[] = [];

  for (const song of songsResult.items) {
    const audioUrl = await getDownloadURL(song);
    const baseName = song.name.split(".")[0];

    tracks.push({
      name: baseName,
      audioUrl,
      coverUrl: coversMap.get(baseName),
    });
  }

  return tracks;
};
