import React from 'react';
import { Shield, FileCode, Shuffle } from 'lucide-react';

export const Header = ({
  onOpenCloakModal,
  onOpenJsonManager,
  onTriggerPanic,
  onSelectCategory,
  onRandomGame,
  favoritesCount,
  activeCategory,
  onGoHome
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark */}
        <button
          onClick={onGoHome}
          className="text-left font-bold text-xl tracking-tight text-white hover:text-blue-400 transition-colors cursor-pointer shrink-0"
        >
          Nexus Arcade
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => onSelectCategory('All')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === 'All' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>
          <button
            onClick={() => onSelectCategory('Arcade')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === 'Arcade' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Arcade
          </button>
          <button
            onClick={() => onSelectCategory('Puzzle')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap ${
              activeCategory === 'Puzzle' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            Puzzle
          </button>
          <button
            onClick={() => onSelectCategory('Favorites')}
            className={`hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeCategory === 'Favorites' ? 'text-blue-400 font-semibold' : ''
            }`}
          >
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-xs font-mono text-amber-400">({favoritesCount})</span>
            )}
          </button>
          <button
            onClick={onRandomGame}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            title="Play a random game"
          >
            <Shuffle className="w-3.5 h-3.5 text-slate-400" />
            <span>Random</span>
          </button>
          <button
            onClick={onOpenJsonManager}
            className="hover:text-white transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
            title="Inspect & Edit games.json storage"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>JSON Database</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCloakModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700/80 transition-colors whitespace-nowrap cursor-pointer"
            title="Disguise tab title and icon"
          >
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Cloak Tab</span>
          </button>

          <button
            onClick={onTriggerPanic}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors whitespace-nowrap shadow-sm cursor-pointer"
            title="Emergency Panic Screen (Hotkey: ESC or ])"
          >
            <span className="w-2 h-2 rounded-full bg-rose-200 animate-pulse"></span>
            <span>Panic [ESC]</span>
          </button>
        </div>
      </div>
    </header>
  );
};
