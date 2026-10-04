import React, { useState } from 'react';
import { X, Shield, Check } from 'lucide-react';
import { CLOAK_PRESETS, applyCloak } from '../utils/cloak.js';

export const CloakModal = ({
  isOpen,
  onClose,
  onTriggerPanic
}) => {
  const [currentPreset, setCurrentPreset] = useState(
    localStorage.getItem('nexus_cloak_preset') || 'none'
  );
  const [customTitle, setCustomTitle] = useState('');
  const [customIcon, setCustomIcon] = useState('');

  if (!isOpen) return null;

  const handleSelectPreset = (key) => {
    setCurrentPreset(key);
    applyCloak(key);
  };

  const handleApplyCustom = (e) => {
    e.preventDefault();
    if (!customTitle.trim()) return;
    document.title = customTitle.trim();
    if (customIcon.trim()) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = customIcon.trim();
    }
    setCurrentPreset('custom');
    localStorage.setItem('nexus_cloak_preset', 'custom');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Tab Cloaker & Panic Disguise</h2>
              <p className="text-xs text-slate-400">Mask browser tab title & favicon from teachers or bosses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Select Cloak Preset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(CLOAK_PRESETS).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => handleSelectPreset(key)}
                  className={`flex items-center justify-between p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    currentPreset === key
                      ? 'border-blue-500 bg-blue-500/10 text-white'
                      : 'border-slate-800 bg-slate-950/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={config.icon}
                      alt=""
                      className="w-4 h-4 shrink-0 rounded"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="truncate">
                      <div className="text-xs font-medium">{config.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{config.title}</div>
                    </div>
                  </div>
                  {currentPreset === key && (
                    <Check className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Cloak Option */}
          <form onSubmit={handleApplyCustom} className="pt-2 border-t border-slate-800/80">
            <div className="text-xs font-semibold text-slate-300 mb-2">Custom Title & Favicon</div>
            <div className="flex flex-col gap-2">
              <input
                type="text"
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
                placeholder="Custom Tab Title (e.g. Biology Homework)"
                className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customIcon}
                  onChange={(e) => setCustomIcon(e.target.value)}
                  placeholder="Favicon URL (optional)"
                  className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors whitespace-nowrap cursor-pointer"
                >
                  Set Custom
                </button>
              </div>
            </div>
          </form>

          {/* Emergency Panic Screen Hotkey */}
          <div className="p-3.5 rounded-lg bg-rose-950/30 border border-rose-900/50 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-rose-300">Panic Hotkey: [ESC] or [ ] ]</div>
              <div className="text-[11px] text-rose-400/80">Instantly hides games behind a mock Google Docs screen.</div>
            </div>
            <button
              onClick={() => {
                onClose();
                onTriggerPanic();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-md transition-colors cursor-pointer shrink-0"
            >
              Test Panic Screen
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
