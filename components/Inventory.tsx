import React from 'react';
import { Backpack, Shield, Sword, Heart, Zap } from 'lucide-react';
import { PlayerState, ItemType, Item } from '../types';

interface InventoryProps {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
}

const Inventory: React.FC<InventoryProps> = ({ player, setPlayer }) => {
  const attackPower = (player.equipped.weapon?.value || 0) + 1; // Base damage 1 for unarmed

  const handleItemClick = (item: Item) => {
    if (item.type === ItemType.WEAPON) {
      const currentWeapon = player.equipped.weapon;
      // Remove new weapon from inventory
      const newInventory = player.inventory.filter(i => i.id !== item.id);
      // Add old weapon back to inventory if exists
      if (currentWeapon) {
        newInventory.push(currentWeapon);
      }
      
      setPlayer(prev => ({
        ...prev,
        inventory: newInventory,
        equipped: { ...prev.equipped, weapon: item }
      }));
    } else if (item.type === ItemType.ARMOR) {
       const currentArmor = player.equipped.armor;
      // Remove new armor from inventory
      const newInventory = player.inventory.filter(i => i.id !== item.id);
      // Add old armor back to inventory if exists
      if (currentArmor) {
        newInventory.push(currentArmor);
      }
      
      setPlayer(prev => ({
        ...prev,
        inventory: newInventory,
        equipped: { ...prev.equipped, armor: item }
      }));
    } else if (item.type === ItemType.CONSUMABLE) {
       const newInventory = player.inventory.filter(i => i.id !== item.id);
       setPlayer(prev => ({
          ...prev,
          hp: Math.min(prev.maxHp, prev.hp + item.value),
          inventory: newInventory
       }));
    }
  };

  const handleUnequip = (type: 'weapon' | 'armor') => {
      if (type === 'weapon' && player.equipped.weapon) {
          const item = player.equipped.weapon;
          setPlayer(prev => ({
              ...prev,
              inventory: [...prev.inventory, item],
              equipped: { ...prev.equipped, weapon: null }
          }));
      } else if (type === 'armor' && player.equipped.armor) {
          const item = player.equipped.armor;
          setPlayer(prev => ({
              ...prev,
              inventory: [...prev.inventory, item],
              equipped: { ...prev.equipped, armor: null }
          }));
      }
  };

  return (
    <div className="bg-slate-800 border-l border-slate-700 w-full md:w-80 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-slate-900 border-b border-slate-700 shadow-md">
        <h2 className="text-xl font-fantasy text-yellow-500 flex items-center gap-2">
          <Backpack className="w-5 h-5" />
          Äventyrarens Utrustning
        </h2>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-2 gap-4 border-b border-slate-700 bg-slate-800/50">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase">Hälsa</span>
          <div className="flex items-center gap-1 text-red-400 font-bold text-lg">
            <Heart className="w-4 h-4 fill-current" />
            {player.hp} / {player.maxHp}
          </div>
          <div className="w-full bg-slate-900 h-2 rounded-full mt-1 overflow-hidden">
            <div 
              className="bg-red-500 h-full transition-all duration-500" 
              style={{ width: `${(player.hp / player.maxHp) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 uppercase">Anfallskraft</span>
          <div className="flex items-center gap-1 text-yellow-400 font-bold text-lg">
             <Zap className="w-4 h-4 fill-current" />
             {attackPower}
          </div>
        </div>
      </div>

      {/* Equipment Slots */}
      <div className="p-4 space-y-3">
        <h3 className="text-xs uppercase text-slate-500 font-bold tracking-wider">Utrustad</h3>
        
        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded border border-slate-700 relative group">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-500">
            <Sword className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">
              {player.equipped.weapon ? player.equipped.weapon.name : 'Obeväpnad'}
            </p>
            <p className="text-xs text-slate-500">
                {player.equipped.weapon ? `Skada: ${player.equipped.weapon.value}` : 'Bas Skada: 1'}
            </p>
          </div>
          {player.equipped.weapon && (
              <button 
                onClick={() => handleUnequip('weapon')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-1 rounded"
              >
                  Ta av
              </button>
          )}
        </div>

        <div className="flex items-center gap-3 p-2 bg-slate-900 rounded border border-slate-700 relative group">
          <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-slate-500">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-200">
              {player.equipped.armor ? player.equipped.armor.name : 'Kläder'}
            </p>
            <p className="text-xs text-slate-500">
                 {player.equipped.armor ? `Skydd: ${player.equipped.armor.value}` : 'Inget skydd'}
            </p>
          </div>
          {player.equipped.armor && (
              <button 
                onClick={() => handleUnequip('armor')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 px-2 py-1 rounded"
              >
                  Ta av
              </button>
          )}
        </div>
      </div>

      {/* Backpack Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <h3 className="text-xs uppercase text-slate-500 font-bold tracking-wider mb-3">Ryggsäck</h3>
        
        {player.inventory.length === 0 ? (
          <p className="text-slate-600 italic text-sm text-center mt-10">Din väska är tom.</p>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            {player.inventory.map((item, idx) => (
              <div 
                key={`${item.id}-${idx}`} 
                onClick={() => handleItemClick(item)}
                className="aspect-square bg-slate-700 rounded border border-slate-600 p-1 flex flex-col items-center justify-center relative group hover:border-cyan-500 hover:bg-slate-600 transition-colors cursor-pointer"
              >
                <span className="text-2xl">
                    {item.type === ItemType.WEAPON ? '⚔️' : 
                     item.type === ItemType.ARMOR ? '🛡️' : 
                     item.type === ItemType.KEY ? '🔑' : '💊'}
                </span>
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-40 bg-black text-xs p-2 rounded border border-slate-500 hidden group-hover:block z-50 pointer-events-none shadow-xl">
                  <p className="font-bold text-white">{item.name}</p>
                  <p className="text-slate-300 mb-1">{item.description}</p>
                  <p className="text-cyan-400 font-mono text-[10px] uppercase">
                      {item.type === ItemType.WEAPON ? `Skada: ${item.value} (Klicka för att utrusta)` : 
                       item.type === ItemType.ARMOR ? `Skydd: ${item.value} (Klicka för att utrusta)` : 
                       item.type === ItemType.CONSUMABLE ? `Läker: ${item.value} (Klicka för att använda)` : 'Objekt'}
                  </p>
                </div>
              </div>
            ))}
             {/* Empty Slots Filler */}
             {Array.from({ length: Math.max(0, 9 - player.inventory.length) }).map((_, i) => (
               <div key={`empty-${i}`} className="aspect-square bg-slate-900/50 rounded border border-slate-800"></div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Inventory;