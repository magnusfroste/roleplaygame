import React, { useState, useEffect } from 'react';
import { Dices, Gem } from 'lucide-react';

interface DiceRollerProps {
  onRollComplete: (result: number) => void;
  isRolling: boolean;
}

const DiceRoller: React.FC<DiceRollerProps> = ({ onRollComplete, isRolling }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRolling) {
      interval = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 20) + 1);
      }, 50);
    } else {
      // @ts-ignore
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRolling]);

  // When rolling stops, the parent determines the value, but visual effect needs to settle
  // We'll rely on the parent updating state to stop showing "rolling" and show result narrative.
  
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-900 border-2 border-cyan-500 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.5)]">
      <div className="text-cyan-400 font-scifi mb-2 tracking-widest text-sm uppercase">Ödeshjulet</div>
      
      <div className="relative w-24 h-24 bg-black rounded-full flex items-center justify-center border-4 border-slate-700 overflow-hidden">
        {/* Background glow */}
        <div className={`absolute inset-0 bg-cyan-900 opacity-20 ${isRolling ? 'animate-pulse' : ''}`}></div>
        
        {/* The Number */}
        <span className={`text-4xl font-bold font-mono z-10 ${isRolling ? 'text-gray-400 blur-[1px]' : 'text-cyan-400'}`}>
          {displayValue}
        </span>

        {/* Decorative ring */}
        <div className={`absolute w-full h-full border-2 border-dashed border-cyan-500 rounded-full ${isRolling ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}></div>
      </div>

      <div className="mt-4 flex gap-2">
         {/* Decorative 'coins' or tokens */}
         <Gem className="w-5 h-5 text-purple-500" />
         <Dices className="w-5 h-5 text-cyan-500" />
         <Gem className="w-5 h-5 text-purple-500" />
      </div>
    </div>
  );
};

export default DiceRoller;