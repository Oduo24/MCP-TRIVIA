import React, { createContext, useState, useContext, useEffect } from 'react';
import { Episode } from '../models';

// Create context
interface EpisodesContextProps {
    episodes: Episode[];
    setEpisodes: (episodes: Episode[]) => void;
}

const EpisodesContext = createContext<EpisodesContextProps | undefined>(undefined);

// Create provider
export const EpisodesProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    // Load initial state from local storage or use default
    const [episodes, setEpisodes] = useState<Episode[]>(() => {
        const storedEpisodes = localStorage.getItem('episodes');
        return storedEpisodes ? JSON.parse(storedEpisodes) : [];
    });

    useEffect(() => {
        localStorage.setItem('episodes', JSON.stringify(episodes));
    }, [episodes]);


    return (
        <EpisodesContext.Provider value={{ episodes, setEpisodes }}>
            {children}
        </EpisodesContext.Provider>
    );
};

// Custom hook to use the EpisodesContext
export const useEpisodes = (): EpisodesContextProps => {
    const context = useContext(EpisodesContext);
    if (!context) {
        throw new Error('useEpisodes must be used within an EpisodesProvider');
    }
    return context;
};
