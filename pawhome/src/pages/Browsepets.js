import React, { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, PawPrint, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PetCard from '../components/pets/PetCard';
import CategoryFilter from '../components/pets/CategoryFilter';

export default function BrowsePets() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialType = urlParams.get('type') || 'all';

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState(initialType);
  const [adoptionFilter, setAdoptionFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const queryClient = useQueryClient();

  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: () => base44.entities.Pet.list('-created_date', 100),
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.Wishlist.list(),
  });

  const wishlistPetIds = useMemo(() => new Set(wishlistItems.map(w => w.pet_id)), [wishlistItems]);

  const toggleWishlist = useMutation({
    mutationFn: async (pet) => {
      const existing = wishlistItems.find(w => w.pet_id === pet.id);
      if (existing) {
        await base44.entities.Wishlist.delete(existing.id);
      } else {
        const user = await base44.auth.me();
        await base44.entities.Wishlist.create({ pet_id: pet.id, user_email: user.email, notify_when_available: true });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      if (typeFilter !== 'all' && pet.type !== typeFilter) return false;
      if (adoptionFilter !== 'all' && pet.adoption_type !== adoptionFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        if (!pet.name?.toLowerCase().includes(s) && !pet.breed?.toLowerCase().includes(s) && !pet.donor_location?.toLowerCase().includes(s)) return false;
      }
      return true;
    });
  }, [pets, typeFilter, adoptionFilter, search]);

  // Sort: available first, then emergency first
  const sortedPets = useMemo(() => {
    return [...filteredPets].sort((a, b) => {
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (a.status !== 'available' && b.status === 'available') return 1;
      if (a.is_emergency && !b.is_emergency) return -1;
      if (!a.is_emergency && b.is_emergency) return 1;
      return 0;
    });
  }, [filteredPets]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">Find Your New Friend</h1>
        <p className="text-muted-foreground mt-2">Browse pets looking for a loving home</p>
      </div>

      {/* Search & Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="pl-10 rounded-full"
              placeholder="Search by name, breed, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={adoptionFilter} onValueChange={setAdoptionFilter}>
            <SelectTrigger className="w-32 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="sponsored">Sponsored</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:flex gap-1 border rounded-full p-1">
            <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className="rounded-full h-8 w-8" onClick={() => setViewMode('grid')}>
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === 'list' ? 'default' : 'ghost'} size="icon" className="rounded-full h-8 w-8" onClick={() => setViewMode('list')}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <CategoryFilter selected={typeFilter} onSelect={setTypeFilter} />
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : sortedPets.length === 0 ? (
        <div className="text-center py-20">
          <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
          <p className="text-lg text-muted-foreground">No pets found matching your criteria</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6' : 'flex flex-col gap-4'}>
          <AnimatePresence>
            {sortedPets.map(pet => (
              <PetCard
                key={pet.id}
                pet={pet}
                isWishlisted={wishlistPetIds.has(pet.id)}
                onWishlist={(p) => toggleWishlist.mutate(p)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="text-center mt-6 text-sm text-muted-foreground">
        Showing {sortedPets.length} pet{sortedPets.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}