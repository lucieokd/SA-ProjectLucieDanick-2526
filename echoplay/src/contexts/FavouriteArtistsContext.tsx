// src/contexts/FavouriteArtistsContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

type Artist = {
  id: string;
  name: string;
  images?: { url: string }[];
  genres?: string[];
  followers?: { total: number };
  popularity?: number;
};

// Simpele default lijst van STRING names
const DEFAULT_ARTISTS = ["Taylor Swift", "Rihanna", "Drake"];

type ContextType = {
  favArtists: Artist[];
  displayedArtists: string[]; // enkel namen
  addArtist: (artist: Artist) => Promise<void>;
  removeArtist: (artistId: string) => Promise<void>;
  isFollowing: (artistId: string) => boolean;
  loading: boolean;
};

const FavouriteArtistsContext = createContext<ContextType | undefined>(undefined);

export const FavouriteArtistsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [favArtists, setFavArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Auth listener
  useEffect(() => {
    console.log("🔐 [FavouriteArtists] Auth listener gestart");
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("✅ [FavouriteArtists] Gebruiker ingelogd:", user.uid);
        setUserId(user.uid);
      } else {
        console.log("❌ [FavouriteArtists] Gebruiker uitgelogd - state wordt gereset");
        setUserId(null);
        setFavArtists([]);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  // 🔹 Firestore listener
  useEffect(() => {
    if (!userId) {
      console.log("⏸️ [FavouriteArtists] Geen userId, listener niet gestart");
      return;
    }

    console.log("👂 [FavouriteArtists] Firestore listener gestart voor userId:", userId);
    const userRef = doc(db, "users", userId);

    const unsub = onSnapshot(
      userRef,
      async (snap) => {
        console.log("📡 [FavouriteArtists] Firestore snapshot ontvangen");
        console.log("   - Document bestaat:", snap.exists());
        
        if (!snap.exists()) {
          console.warn("⚠️ [FavouriteArtists] User document bestaat niet in Firestore!");
          setFavArtists([]);
          return;
        }

        const data = snap.data();
        const artists = data.favArtists || [];
        console.log("   - favArtists array:", artists);
        console.log("   - Aantal artiesten:", artists.length);
        
        if (artists.length > 0) {
          console.log("   - Artiest namen:", artists.map((a: Artist) => a.name));
        }
        
        setFavArtists(artists);
        console.log("✅ [FavouriteArtists] State bijgewerkt met", artists.length, "artiesten");
      },
      (error) => {
        console.error("❌ [FavouriteArtists] Firestore listener error:", error);
      }
    );

    return unsub;
  }, [userId]);

  const addArtist = async (artist: Artist) => {
    if (!userId) {
      console.warn("⚠️ [addArtist] Geen userId, kan artiest niet toevoegen");
      return;
    }

    console.log("➕ [addArtist] Probeer artiest toe te voegen:", artist.name, "(" + artist.id + ")");

    // Check eerst of artiest al bestaat in lokale state
    if (favArtists.some((a) => a.id === artist.id)) {
      console.log("⚠️ [addArtist] Artiest bestaat al in lokale state");
      return;
    }

    const userRef = doc(db, "users", userId);
    
    // Bewaar oude state voor rollback
    const oldFavArtists = [...favArtists];
    
    // OPTIMISTIC UPDATE: Update lokale state direct zodat knop direct reageert
    const optimisticList = [...favArtists, artist];
    console.log("   - Optimistic update: lokale state wordt direct geüpdatet");
    setFavArtists(optimisticList);

    try {
      // Lees huidige data uit Firestore om stale closures te voorkomen
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error("❌ [addArtist] User document bestaat niet!");
        // Rollback optimistic update
        setFavArtists(oldFavArtists);
        return;
      }

      const currentData = userSnap.data();
      const currentFavArtists = (currentData.favArtists || []) as Artist[];
      
      console.log("   - Huidige artiesten in Firestore:", currentFavArtists.length);

      // Check opnieuw of artiest al bestaat (mogelijk toegevoegd door andere client)
      if (currentFavArtists.some((a) => a.id === artist.id)) {
        console.log("⚠️ [addArtist] Artiest bestaat al in Firestore, rollback optimistic update");
        setFavArtists(currentFavArtists);
        return;
      }

      const newList = [...currentFavArtists, artist];
      console.log("   - Nieuwe lijst bevat", newList.length, "artiesten");

      // Update Firestore
      await setDoc(userRef, { favArtists: newList }, { merge: true });
      console.log("✅ [addArtist] Artiest succesvol toegevoegd aan Firestore");
      // Lokale state wordt automatisch geüpdatet door onSnapshot listener
    } catch (error) {
      console.error("❌ [addArtist] Error bij toevoegen artiest:", error);
      // Rollback optimistic update bij error
      setFavArtists(oldFavArtists);
      throw error;
    }
  };

  const removeArtist = async (artistId: string) => {
    if (!userId) {
      console.warn("⚠️ [removeArtist] Geen userId, kan artiest niet verwijderen");
      return;
    }

    console.log("➖ [removeArtist] Probeer artiest te verwijderen met ID:", artistId);

    const userRef = doc(db, "users", userId);
    
    // Bewaar oude state voor rollback
    const oldFavArtists = [...favArtists];
    
    // OPTIMISTIC UPDATE: Update lokale state direct zodat knop direct reageert
    const optimisticList = favArtists.filter((a) => a.id !== artistId);
    console.log("   - Optimistic update: lokale state wordt direct geüpdatet");
    setFavArtists(optimisticList);

    try {
      // Lees huidige data uit Firestore
      const userSnap = await getDoc(userRef);
      
      if (!userSnap.exists()) {
        console.error("❌ [removeArtist] User document bestaat niet!");
        // Rollback optimistic update
        setFavArtists(oldFavArtists);
        return;
      }

      const currentData = userSnap.data();
      const currentFavArtists = (currentData.favArtists || []) as Artist[];
      
      console.log("   - Huidige artiesten in Firestore:", currentFavArtists.length);

      const artistToRemove = currentFavArtists.find((a) => a.id === artistId);
      if (!artistToRemove) {
        console.log("⚠️ [removeArtist] Artiest niet gevonden in Firestore");
        // Artiest bestaat niet meer, gebruik huidige Firestore state
        setFavArtists(currentFavArtists);
        return;
      }

      console.log("   - Te verwijderen artiest:", artistToRemove.name);

      const newList = currentFavArtists.filter((a) => a.id !== artistId);
      console.log("   - Nieuwe lijst bevat", newList.length, "artiesten");

      // Update Firestore
      await setDoc(userRef, { favArtists: newList }, { merge: true });
      console.log("✅ [removeArtist] Artiest succesvol verwijderd uit Firestore");
      // Lokale state wordt automatisch geüpdatet door onSnapshot listener
    } catch (error) {
      console.error("❌ [removeArtist] Error bij verwijderen artiest:", error);
      // Rollback optimistic update bij error
      setFavArtists(oldFavArtists);
      throw error;
    }
  };

  const isFollowing = (artistId: string) => {
    return favArtists.some((a) => a.id === artistId);
  };

  // 🔹 Gebruiker heeft favorieten → toon echte namen
  // 🔹 Gebruiker heeft geen favorieten → toon default strings
  const displayedArtists =
    favArtists.length > 0 ? favArtists.map((a) => a.name) : DEFAULT_ARTISTS;

  return (
    <FavouriteArtistsContext.Provider
      value={{ favArtists, displayedArtists, addArtist, removeArtist, isFollowing, loading }}
    >
      {children}
    </FavouriteArtistsContext.Provider>
  );
};

export const useFavouriteArtists = () => {
  const ctx = useContext(FavouriteArtistsContext);
  if (!ctx) throw new Error("useFavouriteArtists must be used inside provider");
  return ctx;
};
