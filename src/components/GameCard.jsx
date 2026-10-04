import React from 'react';
import { Play, Star, Gamepad2, Boxes, Layers, Bird, Target, Rocket, Bomb, Trophy, Zap } from 'lucide-react';

const ICON_MAP = {
  Gamepad2: <Gamepad2 className="w-8 h-8" />,
  Boxes: <Boxes className="w-8 h-8" />,
  Layers: <Layers className="w-8 h-8" />,
  Bird: <Bird className="w-8 h-8" />,
  Target: <Target className="w-8 h-8" />,
  Rocket: <Rocket className="w-8 h-8" />,
  Bomb: <Bomb className="w-8 h-8" />,
  Trophy: <Trophy className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />
};

export const GameCard = ({
  game,
  isFavorite,
  onPlay,
  onToggleFavorite
}) => {
  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/90 overflow-hidden hover:border-slate-700 hover:shadow-xl hover:shadow-black/50 transition-all duration-200 cursor-pointer"
    >
      {/* Visual Thumbnail */}
      <div className={`relative h-44 w-full bg-gradient-to-br ${game.color || 'from-slate-700 to-slate-900'} flex items-center justify-center overflow-hidden`}>
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Game Icon */}
        <div className="relative text-white/90 transform group-hover:scale-110 transition-transform duration-200">
          {ICON_MAP[game.icon || 'Gamepad2'] || <Gamepad2 className="w-8 h-8" />}
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 backdrop-blur-[2px]">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
            <Play className="w-4 h-4 fill-current" />
            <span>Launch Iframe</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={(e) => onToggleFavorite(e, game.id)}
          className="absolute top-2.5 right-2.5 p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950/90 text-slate-300 hover:text-amber-400 transition-colors cursor-pointer z-10"
          title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star
            className={`w-4 h-4 ${
              isFavorite ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
            }`}
          />
        </button>
      </div>

      {/* Content Info */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Metadata: Zero-pill clean unboxed text */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
            <span className="font-medium text-blue-400">{game.category}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{game.author}</span>
            {game.rating && (
              <>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="text-amber-400 font-mono">★ {game.rating}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            {game.title}
          </h3>
          <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <span>{game.plays ? `${(game.plays / 1000).toFixed(1)}k plays` : 'HTML5'}</span>
          <span className="text-slate-400 group-hover:text-slate-200 transition-colors flex items-center gap-1 font-sans font-medium text-xs">
            Play Game →
          </span>
        </div>
      </div>
    </div>
  );
};
