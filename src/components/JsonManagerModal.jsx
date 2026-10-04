import React, { useState } from 'react';
import { X, FileCode, Plus, Copy, Download, Check, Trash2, RotateCcw, Eye } from 'lucide-react';

export const JsonManagerModal = ({
  isOpen,
  onClose,
  games,
  onSaveGames,
  onResetDefaults
}) => {
  const [activeTab, setActiveTab] = useState('view'); // 'view' or 'add'
  const [copied, setCopied] = useState(false);

  // New game form state
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Arcade');
  const [newDescription, setNewDescription] = useState('');
  const [newIframe, setNewIframe] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newControls, setNewControls] = useState('Arrow Keys: Move\nSpacebar: Action');
  const [previewIframe, setPreviewIframe] = useState(false);

  if (!isOpen) return null;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(games, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(games, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'games.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleAddGame = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newIframe.trim()) {
      alert('Please provide a title and iframe code/URL.');
      return;
    }

    // Format iframe
    let finalIframe = newIframe.trim();
    let finalSrc = '';
    if (!finalIframe.startsWith('<iframe')) {
      finalSrc = finalIframe;
      finalIframe = `<iframe src="${finalIframe}" width="100%" height="520" frameborder="0" allowfullscreen="true" allow="gamepad; autoplay"></iframe>`;
    } else {
      const match = finalIframe.match(/src=["']([^"']+)["']/);
      if (match) finalSrc = match[1];
    }

    // Parse controls
    const parsedControls = newControls
      .split('\n')
      .filter((line) => line.includes(':'))
      .map((line) => {
        const parts = line.split(':');
        return { key: parts[0].trim(), action: parts[1].trim() };
      });

    const newGame = {
      id: 'custom-' + Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim() || 'Custom added game.',
      author: newAuthor.trim() || 'Custom',
      color: 'from-indigo-600 to-slate-800',
      accentColor: '#6366f1',
      icon: 'Gamepad2',
      iframe: finalIframe,
      iframeSrc: finalSrc,
      controls: parsedControls.length > 0 ? parsedControls : [{ key: 'Mouse / Keys', action: 'Standard Controls' }],
      tags: ['Custom', newCategory],
      rating: 5.0,
      plays: 1,
      isCustom: true
    };

    onSaveGames([newGame, ...games]);
    setActiveTab('view');
    // Reset form
    setNewTitle('');
    setNewDescription('');
    setNewIframe('');
    setNewAuthor('');
    setPreviewIframe(false);
  };

  const handleDeleteGame = (gameId) => {
    if (confirm('Remove this game from games.json storage?')) {
      onSaveGames(games.filter((g) => g.id !== gameId));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">games.json Database Storage</h2>
              <p className="text-xs text-slate-400">
                Each game is stored with its iframe configuration, controls, and metadata
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('view')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'view'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              JSON View ({games.length} Games)
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                activeTab === 'add'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Game Iframe</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-md border border-slate-700 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download games.json</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'view' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Direct storage representation from <code className="text-emerald-400 font-mono">/public/games.json</code>:</span>
                <button
                  onClick={onResetDefaults}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Default Catalog</span>
                </button>
              </div>

              {/* JSON code view */}
              <div className="relative rounded-lg border border-slate-800 bg-slate-950 p-4 overflow-hidden">
                <pre className="text-xs font-mono text-emerald-400/90 leading-relaxed overflow-x-auto max-h-[460px]">
                  {JSON.stringify(games, null, 2)}
                </pre>
              </div>

              {/* Quick Game Row Actions */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Stored Entries</h4>
                <div className="divide-y divide-slate-800 rounded-lg border border-slate-800 bg-slate-950/40">
                  {games.map((g) => (
                    <div key={g.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{g.title}</div>
                        <div className="text-slate-500 font-mono truncate max-w-lg mt-0.5">{g.iframe}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-medium">{g.category}</span>
                        {g.isCustom && (
                          <button
                            onClick={() => handleDeleteGame(g.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete custom game"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Add Game Tab */
            <form onSubmit={handleAddGame} className="space-y-4 max-w-2xl mx-auto">
              <div className="text-xs text-slate-400">
                Add any game by providing its iframe HTML tag or destination URL. It will be immediately saved into your active JSON database.
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Game Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Retro Pacman 3D"
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="Arcade">Arcade</option>
                    <option value="Action">Action</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Retro">Retro</option>
                    <option value="Sports">Sports</option>
                    <option value="Strategy">Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Author / Credit</label>
                  <input
                    type="text"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    placeholder="e.g. Web Game Studio"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Iframe HTML Tag or URL *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newIframe}
                  onChange={(e) => setNewIframe(e.target.value)}
                  placeholder='e.g. <iframe src="https://example.com/game" width="100%" height="520" frameborder="0" allowfullscreen></iframe>'
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Accepts complete &lt;iframe&gt; code or standalone URL.</span>
                  {newIframe.trim() && (
                    <button
                      type="button"
                      onClick={() => setPreviewIframe(!previewIframe)}
                      className="text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1 font-medium"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{previewIframe ? 'Hide Preview' : 'Preview Iframe'}</span>
                    </button>
                  )}
                </div>
              </div>

              {previewIframe && newIframe.trim() && (
                <div className="rounded-lg border border-slate-800 bg-black p-2 overflow-hidden h-64">
                  <div
                    className="w-full h-full"
                    dangerouslySetInnerHTML={{
                      __html: newIframe.startsWith('<iframe')
                        ? newIframe
                        : `<iframe src="${newIframe}" width="100%" height="100%" frameborder="0"></iframe>`
                    }}
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief game gameplay description..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Controls (one per line, format: Key: Action)
                </label>
                <textarea
                  rows={2}
                  value={newControls}
                  onChange={(e) => setNewControls(e.target.value)}
                  placeholder="Arrow Keys: Move&#10;Spacebar: Action"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('view')}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors shadow-sm cursor-pointer"
                >
                  Save Game to JSON
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
