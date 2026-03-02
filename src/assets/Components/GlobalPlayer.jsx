import { useAudio } from "../Context/AudioContext";
import { motion, AnimatePresence } from "framer-motion";

function GlobalPlayer() {
    const { currentSong, isPlaying, isBuffering, currentTime, duration, togglePlay, seek } = useAudio();

    if (!currentSong) return null;

    const formatTime = (time) => {
        if (isNaN(time)) return "00:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
    };

    const handleSeek = (e) => {
        const time = parseFloat(e.target.value);
        seek(time);
    };

    const progressPercent = (currentTime / duration) * 100 || 0;

    return (
        <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="fixed bottom-[72px] md:bottom-0 left-0 right-0 z-[60] bg-[var(--surface)]/95 backdrop-blur-xl border-t border-[var(--border)] px-4 py-3 md:py-4 shadow-2xl"
        >
            <div className="container-custom flex items-center gap-4 md:gap-8 justify-between">
                {/* SONG INFO */}
                <div className="flex items-center gap-3 w-[40%] md:w-[250px] overflow-hidden">
                    <div className="w-10 h-10 md:w-14 md:h-14 bg-[var(--surface-hover)] rounded-lg overflow-hidden flex-shrink-0 border border-[var(--border)]">
                        {currentSong.coverImage ? (
                            <img src={currentSong.coverImage} alt={currentSong.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)]">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-sm md:text-base font-semibold text-[var(--text-main)] truncate">{currentSong.title}</h4>
                        <p className="text-[10px] md:text-xs text-[var(--text-muted)] truncate">{currentSong.artist}</p>
                    </div>
                </div>

                {/* PLAYER CONTROLS & PROGRESS */}
                <div className="flex-grow flex flex-col items-center max-w-[600px] gap-1 md:gap-2">
                    {/* Controls */}
                    <div className="flex items-center gap-4 md:gap-6">
                        <button
                            onClick={togglePlay}
                            disabled={isBuffering}
                            className="w-8 h-8 md:w-11 md:h-11 bg-[var(--text-main)] text-[var(--background)] rounded-full flex items-center justify-center hover:scale-105 transition-transform disabled:opacity-50"
                        >
                            {isBuffering ? (
                                <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[var(--background)] border-t-transparent rounded-full animate-spin"></div>
                            ) : isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 md:h-6 md:w-6 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Progress Bar & Time */}
                    <div className="flex items-center gap-2 md:gap-3 w-full">
                        <span className="text-[10px] md:text-xs font-mono text-[var(--text-muted)] w-8 md:w-10 text-right">
                            {formatTime(currentTime)}
                        </span>

                        <div className="relative group flex-grow h-1.5 md:h-2 flex items-center">
                            {/* Background track */}
                            <div className="absolute inset-0 bg-[var(--surface-hover)] rounded-full border border-[var(--border)]/50 overflow-hidden">
                                <div
                                    className="h-full bg-[var(--primary)] transition-all ease-linear"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>

                            {/* Interactive range input */}
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="0.1"
                                value={currentTime}
                                onChange={handleSeek}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />

                            {/* Custom thumb (handled via slider styles in global CSS if complex, but here a simple indicator) */}
                            <div
                                className="absolute w-2.5 h-2.5 md:w-3 md:h-3 bg-[var(--text-main)] rounded-full shadow-md scale-0 group-hover:scale-100 transition-transform pointer-events-none z-20"
                                style={{ left: `calc(${progressPercent}% - 6px)` }}
                            />
                        </div>

                        <span className="text-[10px] md:text-xs font-mono text-[var(--text-muted)] w-8 md:w-10">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* VOLUME / ADDITIONAL ACTIONS (Desktop Only) */}
                <div className="hidden md:flex items-center justify-end w-[250px] gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    <div className="w-24 h-1 bg-[var(--surface-hover)] rounded-full relative">
                        <div className="absolute inset-0 bg-[var(--text-muted)] rounded-full w-[70%]" />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default GlobalPlayer;
