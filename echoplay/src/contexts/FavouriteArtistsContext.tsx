import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Artist {
  id: string;
  name: string;
  genres?: Array<string>;
  images?: Array<{ url: string }>;
  followers?: {
    total: number;
  };
  popularity?: number;
}

interface FavouriteArtistsContextType {
  favourite_artists: Artist[];
  addArtist: (artist: Artist) => void;
  removeArtist: (artistId: string) => void;
  isFollowing: (artistId: string) => boolean;
}

const FavouriteArtistsContext = createContext<FavouriteArtistsContextType | undefined>(undefined);

export const FavouriteArtistsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [favourite_artists, setFavourite_artists] = useState<Artist[]>(() => {
    // Laad opgeslagen favorieten uit localStorage bij initialisatie
    const saved = localStorage.getItem('favourite_artists');
    return saved ? JSON.parse(saved) : [];
  });

  // Sla favorieten op in localStorage wanneer ze veranderen
  React.useEffect(() => {
    localStorage.setItem('favourite_artists', JSON.stringify(favourite_artists));
  }, [favourite_artists]);

  const addArtist = (artist: Artist) => {
    setFavourite_artists((prev) => {
      const isAlreadyAdded = prev.some((fav) => fav.id === artist.id);
      if (!isAlreadyAdded) {
        return [...prev, artist];
      }
      return prev;
    });
  };

  const removeArtist = (artistId: string) => {
    setFavourite_artists((prev) => prev.filter((artist) => artist.id !== artistId));
  };

  const isFollowing = (artistId: string) => {
    return favourite_artists.some((fav) => fav.id === artistId);
  };

  return (
    <FavouriteArtistsContext.Provider
      value={{
        favourite_artists,
        addArtist,
        removeArtist,
        isFollowing,
      }}
    >
      {children}
    </FavouriteArtistsContext.Provider>
  );
};

export const useFavouriteArtists = () => {
  const context = useContext(FavouriteArtistsContext);
  if (context === undefined) {
    throw new Error('useFavouriteArtists must be used within a FavouriteArtistsProvider');
  }
  return context;
};

