import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaMoon, FaSun } from "react-icons/fa";
import { getToken, getArtistInfo } from "../../API/SpotifyCred";
import { IoSearchCircle } from 'react-icons/io5';
import { ThemeContext } from './theme-context';

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
    const { theme, setTheme } = useContext(ThemeContext);

    const handleChangeMode = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        console.log(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode ingeschakeld`);
    }

    const handleCredentialsChange = (e) => {
        e.preventDefault();
        //
    };

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
            <div>
                <label htmlFor="">Change Mode</label>
                <button type="button" onClick={handleChangeMode}>
                    {theme === 'dark' ? <FaSun /> : <FaMoon />}   
                </button>
            </div>
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
            <div>
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
            </div>
             
        </div>
    );
}

export default userinfo;