import React, { useState } from 'react';
import { FileText, Share2, Undo2, Redo2, Printer, Check, Eye } from 'lucide-react';

export const PanicOverlay = ({ onExit }) => {
  const [docTitle, setDocTitle] = useState('AP Biology - Cellular Respiration & ATP Synthesis');

  return (
    <div className="fixed inset-0 z-[9999] bg-[#f8f9fa] text-slate-800 flex flex-col font-sans select-none overflow-hidden animate-in fade-in duration-75">
      {/* Top Google Docs header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#dadce0] bg-white">
        <div className="flex items-center gap-3">
          <div
            onClick={onExit}
            className="w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-slate-100 rounded-full"
            title="Nexus: Click logo to return to games"
          >
            <div className="w-8 h-8 rounded bg-[#4285f4] flex items-center justify-center text-white font-bold text-xs">
              Docs
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="font-medium text-base text-slate-800 border border-transparent hover:border-[#dadce0] px-1 rounded focus:outline-none focus:border-[#4285f4]"
              />
              <span className="text-xs text-slate-400">Saved to Drive</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600 mt-0.5">
              <span className="hover:text-black cursor-pointer">File</span>
              <span className="hover:text-black cursor-pointer">Edit</span>
              <span className="hover:text-black cursor-pointer">View</span>
              <span className="hover:text-black cursor-pointer">Insert</span>
              <span className="hover:text-black cursor-pointer">Format</span>
              <span className="hover:text-black cursor-pointer">Tools</span>
              <span className="hover:text-black cursor-pointer">Extensions</span>
              <span className="hover:text-black cursor-pointer">Help</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onExit}
            className="px-4 py-1.5 rounded-full bg-[#1a73e8] text-white text-xs font-medium hover:bg-[#1557b0] transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            title="Return to gaming"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>
          <div
            onClick={onExit}
            className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center cursor-pointer"
            title="Return to gaming"
          >
            S
          </div>
        </div>
      </div>

      {/* Docs Toolbar */}
      <div className="flex items-center gap-3 px-4 py-1.5 bg-[#edf2fa] border-b border-[#dadce0] text-xs text-slate-700">
        <Undo2 className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
        <Redo2 className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
        <Printer className="w-3.5 h-3.5 cursor-pointer hover:text-black" />
        <span className="text-slate-300">|</span>
        <span className="bg-white px-2 py-0.5 rounded border border-[#dadce0] font-sans">Arial</span>
        <span className="bg-white px-2 py-0.5 rounded border border-[#dadce0] font-mono">11</span>
        <span className="text-slate-300">|</span>
        <strong className="cursor-pointer">B</strong>
        <em className="cursor-pointer">I</em>
        <u className="cursor-pointer">U</u>
        <span className="text-slate-300">|</span>
        <span className="text-[11px] text-slate-500 italic ml-auto cursor-pointer" onClick={onExit}>
          (Press ESC or click Docs logo to unlock games)
        </span>
      </div>

      {/* Page view */}
      <div className="flex-1 overflow-y-auto bg-[#f8f9fa] flex justify-center py-6 px-4">
        <div className="w-[816px] min-h-[1056px] bg-white shadow-md border border-[#dadce0] p-16 text-slate-800 leading-relaxed font-serif text-[15px] space-y-4">
          <h1 className="text-2xl font-bold font-sans text-slate-900 border-b pb-2">
            Section 4.2: Overview of Glycolysis and the Citric Acid Cycle
          </h1>
          <p className="text-slate-700">
            Cellular respiration is a series of chemical reactions that break down glucose to produce ATP, which may be used as energy to power many reactions throughout the organism. There are three main steps of cellular respiration: glycolysis, the citric acid cycle, and oxidative phosphorylation.
          </p>
          <h2 className="text-lg font-semibold font-sans text-slate-800 pt-2">
            Phase 1: Energy Investment and Cleavage
          </h2>
          <p className="text-slate-700">
            Glycolysis occurs in the cytosol of the cell and can proceed under either aerobic or anaerobic conditions. During the energy investment phase, two molecules of ATP are consumed to phosphorylate glucose, destabilizing it for cleavage into two three-carbon glyceraldehyde-3-phosphate (G3P) molecules.
          </p>
          <ul className="list-disc pl-6 space-y-1 text-slate-700">
            <li>Hexokinase catalyzes the initial phosphorylation of glucose to glucose-6-phosphate.</li>
            <li>Phosphofructokinase (PFK) serves as the primary allosteric regulatory control point.</li>
            <li>Net yield per glucose molecule: 2 ATP, 2 NADH, and 2 pyruvate molecules.</li>
          </ul>
          <h2 className="text-lg font-semibold font-sans text-slate-800 pt-2">
            Phase 2: Mitochondria Transition & Acetyl-CoA Synthesis
          </h2>
          <p className="text-slate-700">
            Pyruvate is subsequently translocated across the mitochondrial inner membrane via the pyruvate translocase symport. Inside the mitochondrial matrix, the pyruvate dehydrogenase complex converts each pyruvate molecule into acetyl-CoA while reducing NAD+ to NADH.
          </p>
        </div>
      </div>
    </div>
  );
};
