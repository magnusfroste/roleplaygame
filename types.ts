import React from 'react';

export enum ItemType {
  WEAPON = 'WEAPON',
  ARMOR = 'ARMOR',
  CONSUMABLE = 'CONSUMABLE',
  KEY = 'KEY'
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: ItemType;
  value: number; // e.g., armor value or damage
  image?: string;
}

export interface Option {
  id: string;
  text: string;
  targetNodeIdSuccess: string;
  targetNodeIdFail?: string; // If null, success is guaranteed
  difficulty?: number; // 1-20
  requiredItemId?: string;
}

export interface StoryNode {
  id: string;
  title: string;
  text: string;
  imagePrompt?: string; // For generating or selecting placeholder
  options: Option[];
  rewards?: Item[];
  isEnding?: boolean;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  inventory: Item[];
  equipped: {
    weapon: Item | null;
    armor: Item | null;
  };
  history: string[]; // Log of actions
  currentNodeId: string;
}

export interface GameContextType {
  player: PlayerState;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerState>>;
  storyNodes: Record<string, StoryNode>;
}