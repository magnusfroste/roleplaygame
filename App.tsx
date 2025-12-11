import React, { useState, useEffect, useRef } from 'react';
import { PlayerState, StoryNode, Option, ItemType } from './types';
import { INITIAL_NODES } from './storyData';
import { enhanceNarrative } from './services/geminiService';
import Inventory from './components/Inventory';
import DiceRoller from './components/DiceRoller';
import AdminPanel from './components/AdminPanel';
import { Terminal, ShieldAlert, LogIn } from 'lucide-react';

// Initial Player State
const INITIAL_PLAYER: PlayerState = {
  hp: 20,
  maxHp: 20,
  inventory: [],
  equipped: { weapon: null, armor: null },
  history: [],
  currentNodeId: 'start'
};

const App: React.FC = () => {
  const [view, setView] = useState<'game' | 'admin' | 'login'>('game');
  const [player, setPlayer] = useState<PlayerState>(INITIAL_PLAYER);
  const [nodes] = useState<Record<string, StoryNode>>(INITIAL_NODES);
  
  // Game Flow State
  const [currentText, setCurrentText] = useState<string>('');
  const [isRolling, setIsRolling] = useState(false);
  const [pendingOption, setPendingOption] = useState<Option | null>(null);
  const [typedText, setTypedText] = useState('');
  const [adminPin, setAdminPin] = useState('');
  const [rollResult, setRollResult] = useState<number | null>(null);

  // Typing Effect Logic
  useEffect(() => {
    let index = 0;
    setTypedText('');
    const speed = 20; // ms per char
    
    if (!currentText) return;

    const interval = setInterval(() => {
      if (index < currentText.length) {
        setTypedText((prev) => prev + currentText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [currentText]);

  // Initial Load
  useEffect(() => {
    const node = nodes[player.currentNodeId];
    if (node) {
      setCurrentText(node.text);
    }
  }, []);

  const handleOptionClick = (option: Option) => {
    if (option.difficulty && option.difficulty > 0) {
      // Requires a roll
      setPendingOption(option);
      setIsRolling(true);
      // Roll will complete after animation in DiceRoller
      setTimeout(() => finalizeRoll(option), 2000); // 2 seconds spin
    } else {
      // Automatic success
      proceedToNode(option.targetNodeIdSuccess);
    }
  };

  const finalizeRoll = async (option: Option) => {
    setIsRolling(false);
    const result = Math.floor(Math.random() * 20) + 1;
    setRollResult(result);

    const difficulty = option.difficulty || 10;
    const isSuccess = result >= difficulty;
    const targetId = isSuccess ? option.targetNodeIdSuccess : (option.targetNodeIdFail || option.targetNodeIdSuccess);

    // AI Enhancement
    const nextNode = nodes[targetId];
    if(nextNode) {
        const narrative = await enhanceNarrative(nextNode.text, option.text, result, isSuccess);
        
        // Update Player State logic based on result (simple damage example)
        if (!isSuccess) {
            setPlayer(prev => ({
                ...prev,
                hp: Math.max(0, prev.hp - 2), // Take 2 damage on fail
                history: [...prev.history, `Kastade ${result} (Misslyckat) på "${option.text}"`]
            }));
        } else {
            setPlayer(prev => ({
                ...prev,
                history: [...prev.history, `Kastade ${result} (Lyckat) på "${option.text}"`]
            }));
        }

        proceedToNode(targetId, narrative);
    }
  };

  const proceedToNode = (nodeId: string, overrideText?: string) => {
    const nextNode = nodes[nodeId];
    if (!nextNode) return;

    // Handle Rewards
    if (nextNode.rewards) {
       setPlayer(prev => {
           const newItems = [...prev.inventory, ...(nextNode.rewards || [])];
           // Auto equip logic for simplicity
           let newEquipped = { ...prev.equipped };
           nextNode.rewards?.forEach(item => {
               if(item.type === ItemType.WEAPON && !newEquipped.weapon) newEquipped.weapon = item;
               if(item.type === ItemType.ARMOR && !newEquipped.armor) newEquipped.armor = item;
           });
           return { ...prev, inventory: newItems, equipped: newEquipped };
       });
    }

    setPlayer(prev => ({ ...prev, currentNodeId: nodeId }));
    setCurrentText(overrideText || nextNode.text);
    setRollResult(null); // Clear previous roll display
    setPendingOption(null);
  };

  const currentNode = nodes[player.currentNodeId];

  // --- Login View ---
  if (view === 'login') {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-950">
              <div className="bg-slate-900 p-8 rounded-lg border border-cyan-700 shadow-2xl w-96 text-center">
                  <ShieldAlert className="w-12 h-12 text-cyan-500 mx-auto mb-4" />
                  <h2 className="text-xl font-scifi text-white mb-4">Admin Åtkomst</h2>
                  <input 
                    type="password" 
                    placeholder="Ange PIN-kod"
                    className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white mb-4 text-center tracking-widest"
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                  />
                  <button 
                    onClick={() => {
                        if(adminPin === 'admin') setView('admin');
                        else alert('Access Denied');
                    }}
                    className="w-full bg-cyan-700 hover:bg-cyan-600 text-white font-bold py-2 rounded transition-colors"
                  >
                      Logga in
                  </button>
                  <button onClick={() => setView('game')} className="mt-4 text-slate-500 text-sm underline">Tillbaka till spelet</button>
              </div>
          </div>
      )
  }

  // --- Admin View ---
  if (view === 'admin') {
      return <AdminPanel onExit={() => setView('game')} />
  }

  // --- Game View ---
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-200 overflow-hidden font-mono">
      {/* Main Game Area */}
      <main className="flex-1 flex flex-col relative">
        
        {/* Header / Admin Trigger */}
        <div className="absolute top-4 right-4 z-50">
            <button onClick={() => setView('login')} className="text-slate-600 hover:text-cyan-500 transition-colors">
                <Terminal size={20} />
            </button>
        </div>

        {/* Visual Scene Area */}
        <div className="h-1/3 md:h-2/5 bg-black relative overflow-hidden border-b-2 border-slate-800">
            {/* Placeholder Image Logic using Picsum with seed based on node ID for consistency */}
            <img 
              src={`https://picsum.photos/seed/${player.currentNodeId}/1200/600?grayscale&blur=2`} 
              alt="Scene" 
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
            
            <div className="absolute bottom-6 left-6 md:left-12">
                <h1 className="text-3xl md:text-5xl font-scifi font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
                    {currentNode.title}
                </h1>
            </div>

            {/* Dice Overlay */}
            {(isRolling || rollResult !== null) && (
                 <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-40 transition-all">
                     <div className="text-center">
                        <DiceRoller isRolling={isRolling} onRollComplete={() => {}} />
                        {rollResult !== null && !isRolling && (
                            <div className="mt-4 text-xl font-bold animate-bounce text-white">
                                {rollResult >= (pendingOption?.difficulty || 10) ? 
                                    <span className="text-green-400">LYCKAT!</span> : 
                                    <span className="text-red-500">MISSLYCKAT!</span>
                                }
                            </div>
                        )}
                     </div>
                 </div>
            )}
        </div>

        {/* Text & Interaction Area */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto bg-slate-950 flex flex-col gap-6">
            <div className="prose prose-invert prose-lg max-w-none">
                <p className="leading-relaxed text-slate-300 font-serif text-xl border-l-4 border-cyan-800 pl-4 py-2 bg-slate-900/30 rounded-r">
                    {typedText}
                </p>
            </div>

            <div className="mt-auto">
                {currentNode.isEnding ? (
                    <div className="text-center p-8 border border-green-800 bg-green-900/20 rounded-lg">
                        <h3 className="text-2xl text-green-400 font-bold mb-4">SLUTET</h3>
                        <button 
                           onClick={() => window.location.reload()}
                           className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded font-bold"
                        >
                            Starta om systemet
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentNode.options.map((opt) => (
                            <button
                                key={opt.id}
                                onClick={() => handleOptionClick(opt)}
                                disabled={isRolling}
                                className="group relative p-4 bg-slate-900 border border-slate-700 hover:border-cyan-500 hover:bg-slate-800 transition-all text-left rounded-lg overflow-hidden"
                            >
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-700 group-hover:bg-cyan-500 transition-colors"></div>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold text-slate-200 group-hover:text-white">{opt.text}</span>
                                    {opt.difficulty && (
                                        <span className="text-xs bg-black px-2 py-1 rounded border border-slate-800 text-slate-400 font-mono">
                                            KASTA {opt.difficulty}+
                                        </span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 group-hover:text-slate-400">
                                    Klicka för att avgöra ödet...
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
      </main>

      {/* Sidebar Inventory */}
      <aside className="hidden md:block">
         <Inventory player={player} setPlayer={setPlayer} />
      </aside>

      {/* Mobile Inventory Toggle (simplified for this demo) */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
          {/* In a full mobile implementation, this would toggle a modal */}
          <div className="bg-slate-800 p-3 rounded-full border border-slate-600 shadow-lg text-white font-bold">
              {player.hp} HP
          </div>
      </div>
    </div>
  );
};

export default App;