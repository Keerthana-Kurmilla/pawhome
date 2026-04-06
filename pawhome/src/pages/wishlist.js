import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, PawPrint } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import PetCard from '../components/pets/PetCard';

export default function Wishlist() {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading: loadingWishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.Wishlist.list(),
  });

  const { data: allPets = [], isLoading: loadingPets } = useQuery({
    queryKey: ['all-pets'],
    queryFn: () => base44.entities.Pet.list('-created_date', 200),
  });

  const wishlistPetIds = useMemo(() => new Set(wishlistItems.map(w => w.pet_id)), [wishlistItems]);

  const wishlistedPets = useMemo(() => {
    return allPets.filter(p => wishlistPetIds.has(p.id));
  }, [allPets, wishlistPetIds]);

  const toggleWishlist = useMutation({
    mutationFn: async (pet) => {
      const existing = wishlistItems.find(w => w.pet_id === pet.id);
      if (existing) await base44.entities.Wishlist.delete(existing.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const isLoading = loadingWishlist || loadingPets;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-destructive" />
        </div>
        <h1 className="font-heading text-3xl font-bold">My Wishlist</h1>
        <p className="text-muted-foreground mt-2">Pets you've saved for later</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : wishlistedPets.length === 0 ? (
        <div className="text-center py-20">
          <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">Your wishlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Browse pets and tap the heart to save them here</p>
          <Link to="/browse"><Button className="mt-4 rounded-full">Browse Pets</Button></Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistedPets.map(pet => (
            <PetCard
              key={pet.id}
              pet={pet}
              isWishlisted={true}
              onWishlist={(p) => toggleWishlist.mutate(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
}