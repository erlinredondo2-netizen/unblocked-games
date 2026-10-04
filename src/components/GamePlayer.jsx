import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, RotateCcw, Maximize2, Minimize2, ExternalLink, Star, Code2, Keyboard, Info, Check, Copy } from 'lucide-react';
import { openInAboutBlank } from '../utils/cloak.js';

export const GamePlayer = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
  relatedGames,
  onSelectGame
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const [showJsonCode, setShowJsonCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef(null);

  const handleReload = () => {
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => {
        console.error('Exit fullscreen failed', err);
      });
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const handleAboutBlank = () => {
    openInAboutBlank(game.title, game.iframe);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(game, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const srcMatch = game.iframe ? game.iframe.match(/src=["']([^"']+)["']/) : null;
  const iframeUrl = game.iframeSrc || (srcMatch ? srcMatch[1] : '');

  return (
    <div className="flex flex-col gap-6">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Games</span>
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-medium text-blue-400">{game.category}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{game.author}</span>
            </div>
            <h1 className="text-lg font-bold text-white tracking-tight">{game.title}</h1>
          </div>
        </div>

        {/* Toolbar actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
            }`}
            title="Bookmark this game"
          >
            <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-400' : ''}`} />
            <span>{isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleReload}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors cursor-pointer"
            title="Reload game"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={handleAboutBlank}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 rounded-md border border-slate-800 transition-colors cursor-pointer"
            title="Open in about:blank cloaked tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">about:blank Stealth</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Game Iframe Container */}
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden rounded-xl border border-slate-800 bg-black shadow-2xl flex items-center justify-center ${
          isFullscreen ? 'h-screen' : 'h-[580px] max-h-[75vh]'
        }`}
      >
        {iframeUrl ? (
          <iframe
            key={iframeKey}
            src={iframeUrl}
            title={game.title}
            className="w-full h-full border-0"
            allow="fullscreen; gamepad; autoplay"
            allowFullScreen
          />
        ) : (
          <div
            className="w-full h-full"
            dangerouslySetInnerHTML={{ __html: game.iframe }}
          />
        )}
      </div>

      {/* Details & Controls Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Description & Metadata */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>About {game.title}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {game.description}
            </p>

            {/* Tags (Zero-pill clean text) */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-slate-500">Tags:</span>
              {game.tags && game.tags.map((tag, idx) => (
                <React.Fragment key={tag}>
                  <span>#{tag}</span>
                  {idx < game.tags.length - 1 && <span className="text-slate-600">·</span>}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Iframe JSON Inspector Toggle */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Code2 className="w-4 h-4 text-emerald-400" />
                <span>JSON Iframe Configuration</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 rounded border border-slate-700 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy JSON'}</span>
                </button>
                <button
                  onClick={() => setShowJsonCode(!showJsonCode)}
                  className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer font-medium"
                >
                  {showJsonCode ? 'Hide' : 'Inspect'}
                </button>
              </div>
            </div>

            {showJsonCode ? (
              <pre className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
                {JSON.stringify(
                  {
                    id: game.id,
                    title: game.title,
                    category: game.category,
                    iframe: game.iframe,
                    controls: game.controls
                  },
                  null,
                  2
                )}
              </pre>
            ) : (
              <div className="text-xs font-mono text-slate-400 truncate bg-slate-950 p-2.5 rounded border border-slate-800/80">
                {game.iframe}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Key Controls Reference */}
        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
            <div className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
              <Keyboard className="w-4 h-4 text-amber-400" />
              <span>Game Controls</span>
            </div>

            <div className="divide-y divide-slate-800">
              {game.controls && game.controls.length > 0 ? (
                game.controls.map((ctrl, index) => (
                  <div key={index} className="py-2.5 flex items-center justify-between text-xs">
                    <span className="font-mono text-amber-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                      {ctrl.key}
                    </span>
                    <span className="text-slate-300">{ctrl.action}</span>
                  </div>
                ))
              ) : (
                <div className="py-2 text-xs text-slate-400">Mouse and standard keyboard keys.</div>
              )}
            </div>
          </div>

          {/* Quick Stealth Tip Box */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs text-slate-400">
            <div className="font-medium text-slate-300 mb-1">Quick Unblocked Tip</div>
            <p className="leading-relaxed">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded font-mono text-[11px]">ESC</kbd> or{' '}
              <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-200 rounded font-mono text-[11px] font-bold">]</kbd> anywhere to trigger the emergency Panic Disguise screen.
            </p>
          </div>
        </div>
      </div>

      {/* Related Games Row */}
      {relatedGames && relatedGames.length > 0 && (
        <div className="mt-4 pt-6 border-t border-slate-800">
          <h2 className="text-base font-semibold text-white mb-4">More Games You Might Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedGames.slice(0, 4).map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectGame(rel)}
                className="group p-3 rounded-lg border border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${rel.color || 'from-slate-700 to-slate-900'} flex items-center justify-center text-white shrink-0`}>
                  <span className="text-xs font-bold">{rel.title.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-blue-400 font-medium">{rel.category}</div>
                  <div className="text-sm font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                    {rel.title}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
