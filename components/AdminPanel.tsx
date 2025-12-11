import React, { useState } from 'react';
import { StoryNode } from '../types';
import { INITIAL_NODES } from '../storyData';
import { Network, Edit, Save, Plus } from 'lucide-react';

interface AdminPanelProps {
  onExit: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onExit }) => {
  const [nodes, setNodes] = useState<Record<string, StoryNode>>(INITIAL_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // In a real app, this would persist to a backend. 
  // Here we just visualize the structure provided in storyData.ts

  const nodeList: StoryNode[] = Object.values(nodes);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-slate-900">
        <div className="flex items-center gap-2">
          <Network className="text-cyan-500" />
          <h1 className="text-lg font-bold font-scifi">Sago-Vävaren <span className="text-xs bg-cyan-900 text-cyan-300 px-2 py-0.5 rounded ml-2">ADMIN</span></h1>
        </div>
        <button onClick={onExit} className="text-sm hover:text-white text-slate-400">Avsluta Admin</button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar List */}
        <div className="w-64 border-r border-slate-800 overflow-y-auto bg-slate-900/50">
          <div className="p-4">
             <button className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white py-2 rounded text-sm font-bold transition-colors">
               <Plus size={16} /> Ny Nod
             </button>
          </div>
          <div className="px-2 pb-4 space-y-1">
            {nodeList.map(node => (
              <div 
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-3 rounded cursor-pointer text-sm border ${selectedNodeId === node.id ? 'bg-cyan-900/30 border-cyan-500 text-white' : 'border-transparent hover:bg-slate-800 text-slate-400'}`}
              >
                <div className="font-bold truncate">{node.title}</div>
                <div className="text-xs opacity-50 truncate">ID: {node.id}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Canvas / Editor */}
        <div className="flex-1 p-8 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
          {selectedNodeId ? (
            <div className="max-w-3xl mx-auto bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-700 flex justify-between items-center">
                 <h2 className="text-2xl font-bold text-white">{nodes[selectedNodeId].title}</h2>
                 <span className="text-xs font-mono text-slate-500">{nodes[selectedNodeId].id}</span>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Berättelsetext</label>
                  <textarea 
                    readOnly
                    className="w-full h-32 bg-slate-950 border border-slate-700 rounded p-3 text-slate-300 focus:outline-none focus:border-cyan-500"
                    value={nodes[selectedNodeId].text}
                  />
                </div>

                <div>
                   <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Vägval (Alternativ)</label>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {nodes[selectedNodeId].options.map((opt, idx) => (
                        <div key={idx} className="bg-slate-800 p-4 rounded border border-slate-700 relative">
                           <div className="absolute top-2 right-2 text-xs bg-slate-950 px-2 py-0.5 rounded text-slate-400">
                             Diff: {opt.difficulty || 0}
                           </div>
                           <p className="text-sm font-bold text-cyan-400 mb-2">"{opt.text}"</p>
                           <div className="text-xs text-slate-400 space-y-1">
                              <div className="flex justify-between">
                                <span>Lyckat ➔</span>
                                <span className="font-mono text-green-400">{opt.targetNodeIdSuccess}</span>
                              </div>
                              {opt.targetNodeIdFail && (
                                <div className="flex justify-between">
                                  <span>Misslyckat ➔</span>
                                  <span className="font-mono text-red-400">{opt.targetNodeIdFail}</span>
                                </div>
                              )}
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
                
                {nodes[selectedNodeId].rewards && nodes[selectedNodeId].rewards!.length > 0 && (
                  <div>
                    <label className="block text-xs uppercase text-slate-500 font-bold mb-2">Byte (Loot)</label>
                    <div className="flex gap-2">
                      {nodes[selectedNodeId].rewards?.map(item => (
                        <span key={item.id} className="px-3 py-1 bg-yellow-900/30 text-yellow-500 border border-yellow-700 rounded text-xs">
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-slate-950 p-4 border-t border-slate-800 flex justify-end gap-3">
                 <button className="px-4 py-2 text-sm text-slate-400 hover:text-white">Kasta ändringar</button>
                 <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-bold flex items-center gap-2">
                    <Save size={16} /> Spara Nod
                 </button>
              </div>
            </div>
          ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <Network size={64} className="mb-4 opacity-20" />
                <p>Välj en nod för att se detaljer eller redigera berättelsen.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;