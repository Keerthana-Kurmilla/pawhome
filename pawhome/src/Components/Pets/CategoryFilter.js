import React from 'react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

const categories = [
  { value: 'all', label: 'All Pets', emoji: '🐾' },
  { value: 'dog', label: 'Dogs', emoji: '🐕' },
  { value: 'cat', label: 'Cats', emoji: '🐱' },
  { value: 'rabbit', label: 'Rabbits', emoji: '🐰' },
  { value: 'fish', label: 'Fish', emoji: '🐠' },
  { value: 'parrot', label: 'Parrots', emoji: '🦜' },
  { value: 'bird', label: 'Birds', emoji: '🐦' },
  { value: 'other', label: 'Others', emoji: '🦎' },
];

export default function CategoryFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((cat) => (
        <motion.div key={cat.value} whileTap={{ scale: 0.95 }}>
          <Button
            variant={selected === cat.value ? "default" : "outline"}
            className="whitespace-nowrap gap-2 rounded-full font-body"
            onClick={() => onSelect(cat.value)}
          >
            <span className="text-lg">{cat.emoji}</span>
            {cat.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}