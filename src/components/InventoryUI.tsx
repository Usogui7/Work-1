import React from 'react';
import { Item } from '../types';
import { Package, X } from 'lucide-react';

interface InventoryUIProps {
  items: Item[];
  onClose: () => void;
}

export const InventoryUI: React.FC<InventoryUIProps> = ({ items, onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4">
      <div className="pixel-card w-full max-w-md bg-zinc-900">
        <div className="flex justify-between items-center mb-4 border-b-4 border-white pb-2">
          <h2 className="text-lg flex items-center gap-2">
            <Package size={20} /> INVENTORY
          </h2>
          <button onClick={onClose} className="pixel-button p-1">
            <X size={16} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-h-[300px] overflow-y-auto p-2">
          {items.length === 0 ? (
            <div className="col-span-2 text-center text-gray-500 py-8 text-xs">
              EMPTY POCKETS...
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="pixel-card bg-zinc-800 p-2 flex flex-col items-center text-center gap-2">
                <span className="text-2xl">{item.icon}</span>
                <div className="text-[10px] font-bold">{item.name}</div>
                <div className="text-[8px] text-gray-400">{item.description}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
