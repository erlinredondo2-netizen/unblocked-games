import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, Star, Flame, Sparkles, Gamepad2, X, RefreshCw } from 'lucide-react';
import defaultGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { CloakModal } from './components/CloakModal.jsx';
import { JsonManagerModal } from './components/JsonManagerModal.jsx';
import { PanicOverlay } from './components/PanicOverlay.jsx';
import { applyCloak } from './utils/cloak.js';

export default function App() {
  // Load games from localStorage or default
  const [games, setGames] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_games_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load games from localStorage', e);
    }
    return defaultGamesData;
  });

  const [activeGame, setActiveGame] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular'); // 'popular' | 'rating' | 'az'
  
  // Favorites saved in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_favorites');
      return saved ? JSON.parse(saved) : ['retro-snake', 'block-drop-tetris'];
    } catch (e) {
      return ['retro-snake', 'block-drop-tetris'];
    }
  });

  // Recently played
  const [recentIds, setRecentIds] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_recent');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // Modals & Panic Screen state
  const [isCloakOpen, setIsCloakOpen] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Apply saved cloak preset on boot
  useEffect(() => {
    const savedPreset = localStorage.getItem('nexus_cloak_preset');
    if (savedPreset) {
      applyCloak(savedPreset);
    }
  }, []);

  // Save games whenever updated
  const handleSaveGames = (newGames) => {
    setGames(newGames);
    localStorage.setItem('nexus_games_catalog', JSON.stringify(newGames));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset catalog to the default unblocked games collection?')) {
      setGames(defaultGamesData);
      localStorage.setItem('nexus_games_catalog', JSON.stringify(defaultGamesData));
    }
  };

  // Keyboard shortcut listener for Panic mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle panic screen on ESC or ']'
      if (e.key === 'Escape' || e.key === ']') {
        setIsPanicActive((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (e, gameId) => {
    if (e && e.stopPropagation) e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('nexus_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Select game to play
  const handlePlayGame = (game) => {
    setActiveGame(game);
    // Add to recent
    setRecentIds((prev) => {
      const filtered = prev.filter((id) => id !== game.id);
      const updated = [game.id, ...filtered].slice(0, 6);
      localStorage.setItem('nexus_recent', JSON.stringify(updated));
      return updated;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Random game picker
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    handlePlayGame(games[randomIndex]);
  };

  // Categories list
  const categories = useMemo(() => {
    const set = new Set();
    games.forEach((g) => {
      if (g.category) set.add(g.category);
    });
    return ['All', ...Array.from(set), 'Favorites'];
  }, [games]);

  // Filtered & Sorted Games
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Category filter
    if (activeCategory === 'Favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    } else if (activeCategory !== 'All') {
      result = result.filter((g) => g.category.toLowerCase() === activeCategory.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.tags && g.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.plays || 0) - (a.plays || 0));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'az') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [games, activeCategory, searchQuery, sortBy, favorites]);

  // Recent game items
  const recentGames = useMemo(() => {
    return recentIds
      .map((id) => games.find((g) => g.id === id))
      .filter(Boolean);
  }, [recentIds, games]);

  // Related games for active player
  const relatedGames = useMemo(() => {
    if (!activeGame) return [];
    return games.filter(
      (g) => g.id !== activeGame.id && (g.category === activeGame.category || favorites.includes(g.id))
    );
  }, [activeGame, games, favorites]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Panic Camouflage Screen */}
      {isPanicActive && <PanicOverlay onExit={() => setIsPanicActive(false)} />}

      {/* Top Header */}
      <Header
        onOpenCloakModal={() => setIsCloakOpen(true)}
        onOpenJsonManager={() => setIsJsonOpen(true)}
        onTriggerPanic={() => setIsPanicActive(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          setActiveGame(null);
        }}
        onRandomGame={handleRandomGame}
        favoritesCount={favorites.length}
        activeCategory={activeCategory}
        onGoHome={() => setActiveGame(null)}
      />

      {/* Main Content Area */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {activeGame ? (
          /* Game Player Mode */
          <GamePlayer
            game={activeGame}
            isFavorite={favorites.includes(activeGame.id)}
            onBack={() => setActiveGame(null)}
            onToggleFavorite={(id) => handleToggleFavorite(null, id)}
            relatedGames={relatedGames}
            onSelectGame={handlePlayGame}
          />
        ) : (
          /* Catalog View */
          <div className="flex flex-col gap-8">
            {/* Hero & Search Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800/80">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">
                  <Gamepad2 className="w-4 h-4" />
                  <span>Unblocked HTML5 Game Hub</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-slate-400 font-mono">{games.length} Games in games.json</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
                  Instant Unblocked Games
                </h1>
                <p className="mt-2 text-sm text-slate-400 leading-relaxed">
                  Fast, lightweight games stored with iframe configurations in JSON. Zero ad-blockers required, stealth panic key enabled.
                </p>
              </div>

              {/* Search Bar */}
              <div className="w-full md:w-80 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search games, retro, snake..."
                  className="w-full pl-10 pr-9 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Recently Played Bar (if any) */}
            {recentGames.length > 0 && !searchQuery && activeCategory === 'All' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    <span>Jump Back In</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {recentGames.map((rg) => (
                    <div
                      key={rg.id}
                      onClick={() => handlePlayGame(rg)}
                      className="p-3 rounded-lg border border-slate-800/80 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 transition-all cursor-pointer flex flex-col gap-1.5"
                    >
                      <div className={`h-12 w-full rounded bg-gradient-to-br ${rg.color || 'from-slate-700 to-slate-900'} flex items-center justify-center text-white`}>
                        <span className="text-xs font-bold">{rg.title.slice(0, 3)}</span>
                      </div>
                      <div className="text-xs font-medium text-white truncate">{rg.title}</div>
                      <div className="text-[11px] text-slate-500 truncate">{rg.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Tabs and Sort Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Interactive Category Segmented Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900/80 rounded-lg border border-slate-800">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                      activeCategory === cat
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                    {cat === 'Favorites' && favorites.length > 0 && (
                      <span className="ml-1 text-[11px] font-mono text-amber-300">({favorites.length})</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                <span>Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-md px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Top Rated</option>
                  <option value="az">Alphabetical</option>
                </select>
              </div>
            </div>

            {/* Game Grid */}
            {filteredGames.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onPlay={handlePlayGame}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center gap-3">
                <Gamepad2 className="w-10 h-10 text-slate-600" />
                <h3 className="text-base font-semibold text-white">No games found</h3>
                <p className="text-xs text-slate-400 max-w-sm">
                  {searchQuery
                    ? `No matches for "${searchQuery}". Try searching for snake, tetris, or puzzle.`
                    : activeCategory === 'Favorites'
                    ? 'You have not favorited any games yet. Click the star icon on any game card to bookmark it.'
                    : 'No games available in this category.'}
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mt-2 px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    Clear search query
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Nexus Arcade</span>
            <span>·</span>
            <span>Unblocked HTML5 Game Portal</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsCloakOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Tab Cloaker
            </button>
            <button
              onClick={() => setIsJsonOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              JSON Storage
            </button>
            <button
              onClick={handleRandomGame}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Surprise Game
            </button>
            <button
              onClick={() => setIsPanicActive(true)}
              className="hover:text-rose-400 transition-colors cursor-pointer"
            >
              Panic [ESC]
            </button>
          </div>
          <div>All games stored via sandboxed iframes · Zero AI features</div>
        </div>
      </footer>

      {/* Cloak Settings Modal */}
      <CloakModal
        isOpen={isCloakOpen}
        onClose={() => setIsCloakOpen(false)}
        onTriggerPanic={() => setIsPanicActive(true)}
      />

      {/* JSON Storage Inspector & Game Adder Modal */}
      <JsonManagerModal
        isOpen={isJsonOpen}
        onClose={() => setIsJsonOpen(false)}
        games={games}
        onSaveGames={handleSaveGames}
        onResetDefaults={handleResetDefaults}
      />
    </div>
  );
}
