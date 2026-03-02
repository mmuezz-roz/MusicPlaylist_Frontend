import { createContext, useContext, useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

export const AudioProvider = ({ children }) => {
    const audioRef = useRef(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Sync state with audio element events
    const setupAudioListeners = (audio) => {
        audio.oncanplay = () => {
            setIsBuffering(false);
            audio.play().catch((err) => {
                if (err.name !== "AbortError") console.error("Playback failed:", err);
            });
            setIsPlaying(true);
        };

        audio.onwaiting = () => setIsBuffering(true);
        audio.onplaying = () => setIsBuffering(false);

        audio.onended = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.ontimeupdate = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.onloadedmetadata = () => {
            setDuration(audio.duration);
        };

        audio.onerror = () => {
            if (audio.src && audio.src !== window.location.href) {
                toast.error("Failed to load audio source.");
            }
            setIsPlaying(false);
            setIsBuffering(false);
        };
    };

    const playSong = (song) => {
        if (!song.filepath) return;

        // Toggle same song
        if (currentSong && currentSong._id === song._id) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(console.error);
                setIsPlaying(true);
            }
            return;
        }

        // New song
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current.load();
        }

        const audio = new Audio(song.filepath);
        audioRef.current = audio;
        setCurrentSong(song);
        setIsBuffering(true);
        setIsPlaying(false);
        setCurrentTime(0);

        setupAudioListeners(audio);
        audio.load();
    };

    const seek = (time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play().catch(console.error);
            setIsPlaying(true);
        }
    };

    return (
        <AudioContext.Provider
            value={{
                currentSong,
                isPlaying,
                isBuffering,
                currentTime,
                duration,
                playSong,
                togglePlay,
                seek,
            }}
        >
            {children}
        </AudioContext.Provider>
    );
};
