import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const typeEmojis = { dog: '🐕', cat: '🐱', rabbit: '🐰', fish: '🐠', parrot: '🦜', bird: '🐦', other: '🐾' };

const defaultImages = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop',
  parrot: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=300&fit=crop',
  other: 'https://images.unsplash.com/photo-1425082661507-6af0db74dd50?w=400&h=300&fit=crop',
};

export default function PetCard({ pet, onWishlist, isWishlisted }) {
  const image = pet.images?.[0] || defaultImages[pet.type] || defaultImages.other;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden group cursor-pointer border-border/50 hover:shadow-xl transition-all duration-300">
        <Link to={`/pet/${pet.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={image}
              alt={pet.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {pet.is_emergency && (
              <Badge className="absolute top-3 left-3 bg-destructive text-destructive-foreground gap-1">
                <AlertTriangle className="w-3 h-3" />
                Urgent
              </Badge>
            )}
            {pet.status === 'unavailable' && (
              <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
                <Badge variant="secondary" className="text-sm">Currently Unavailable</Badge>
              </div>
            )}
            <div className="absolute top-3 right-3">
              <Badge variant="secondary" className="bg-card/90 backdrop-blur-sm text-foreground">
                {pet.adoption_type === 'free' ? 'Free' : pet.adoption_type === 'sponsored' ? 'Sponsored' : `$${pet.adoption_fee || 0}`}
              </Badge>
            </div>
          </div>
        </Link>
        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-foreground">
                {typeEmojis[pet.type]} {pet.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {pet.breed && `${pet.breed} · `}{pet.age || 'Age unknown'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={(e) => {
                e.preventDefault();
                onWishlist?.(pet);
              }}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-destructive text-destructive' : 'text-muted-foreground'}`} />
            </Button>
          </div>
          {pet.donor_location && (
            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              {pet.donor_location}
            </div>
          )}
          {pet.description && (
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{pet.description}</p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}