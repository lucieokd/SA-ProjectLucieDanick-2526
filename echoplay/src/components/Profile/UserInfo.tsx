import React, { useState, useEffect, useRef } from 'react';
import { getToken, getArtistInfo } from "../../API/SpotifyCred";
import { IoSearchCircle } from 'react-icons/io5';

interface Artist {
  id: string;
  name: string;
  genres: Array<string>;
  images: Array<{ url: string }>;
  followers: {
    total: number;
  };
  popularity: number;
}

const userinfo = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Artist[]>([]);
    const [favourite_artists, setFavourite_artists] = useState<Artist[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const handleCredentialsChange = (e) => {
        e.preventDefault();
        //
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (value.trim() === '') {
            setSearchResults([]);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            try {
                setIsSearching(true);
                const tokenData = await getToken();
                const access_token = tokenData.access_token;
                const data = await getArtistInfo(access_token, value);

                if (data.artists && data.artists.items) {
                    setSearchResults(data.artists.items);
                    console.log("Zoekresultaten opgehaald:", data.artists.items);
                } else {
                    setSearchResults([]);
                }
            } catch (error) {
                console.error("Fout bij het ophalen van artiestgegevens:", error);
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 500);
    };

    const handleAddArtist = (artist: Artist) => {
        // .some() controleert of minstens één element in de array voldoet aan een bepaalde voorwaarde.
        const isAlreadyAdded = favourite_artists.some(fav => fav.id === artist.id);
        
        if (!isAlreadyAdded) {
            setFavourite_artists([...favourite_artists, artist]);
            console.log("Artiest toegevoegd aan favorieten:", artist.name);
        } else {
            console.log("Artiest staat al in de favorieten lijst:", artist.name);
        }
    };

    const handleVerwijderArtiest = (artistId: string) => {
        //.filter() maakt een nieuwe array met alle elementen die voldoen aan een bepaalde voorwaarde.
        const updatedArtists = favourite_artists.filter(artist => artist.id !== artistId);
        setFavourite_artists(updatedArtists);
        console.log("Artiest verwijderd uit favorieten:", artistId);
    }

    const handleChangeMode = (e) => {
        e.preventDefault();
        //
    }

    // Cleanup timer bij unmount
    useEffect(() => {
        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, []);

    return (
        <div className=''>
            <form onChange={handleCredentialsChange}>
                <label content='Name'>Voornaam: </label>
                <input type="text"  placeholder="Voornaam" name="ChangeVoornaam" />
                <label htmlFor="">Achternaam: </label>
                <input type="text"  placeholder="Achternaam" name="ChangeAchternaam" />
                <label htmlFor="">Email: </label>
                <input type="text"  placeholder="Email" name="ChangeEmail" />
                <div className='ChangeBirthdate'>
                    <label htmlFor="">Geboortedatum: </label>
                    <input type="number"  min={1} max={31} placeholder="Dag" name="" />
                    <input type="number"  min={1} max={12} placeholder="maand" name="" />
                    <input type="number"  min={1850} max={2025} placeholder="jaar" name="" />
                </div>
                <button type="submit" value="Verander credentials" />
            </form>
            <form onChange={handleChangeMode}>
                <input type="checkbox" value="Dark Mode" />
            </form>
            <div>
                <div>
                    <input type="search" placeholder='Zoek artiest...' 
                        value={searchTerm} onChange={handleSearchChange}
                    />
                    {isSearching && <span>Zoeken...</span>}
                </div>
                
                {searchResults.length > 0 && (
                    <div className="search-results">
                        <h3>Zoekresultaten:</h3>
                        <ul>
                            {searchResults.map((artist) => {
                                const isAdded = favourite_artists.some(fav => fav.id === artist.id);
                                return (
                                    <li key={artist.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <span>{artist.name}</span>
                                        <button type="button" onClick={() => handleAddArtist(artist)}>
                                            {isAdded ? 'Al Toegevoegd' : 'Toevoegen'}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>
             {favourite_artists.length > 0 && (
                    <div className="favourite-artists">
                        <h3>Favoriete artiesten</h3>
                        <p>aantal artiesten: {favourite_artists.length}</p>
                        <ul>
                            {favourite_artists.map((artist) => (
                                <li key={artist.id}>
                                    {artist.name}
                                    <button onClick={() => handleVerwijderArtiest(artist.id)}>X</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

        </div>
    );
}

export default userinfo;