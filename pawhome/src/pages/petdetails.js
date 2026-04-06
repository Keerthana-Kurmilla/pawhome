import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, MessageCircle, MapPin, Calendar, Shield, AlertTriangle, ArrowLeft, ChevronLeft, ChevronRight, Stethoscope, Utensils, Brain, Clock, FileText } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const defaultImages = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&h=600&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&h=600&fit=crop',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=800&h=600&fit=crop',
  parrot: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&h=600&fit=crop',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&h=600&fit=crop',
  other: 'https://images.unsplash.com/photo-1425082661507-6af0db74dd50?w=800&h=600&fit=crop',
};

const vaccinationLabels = {
  fully_vaccinated: '✅ Fully Vaccinated',
  partially_vaccinated: '⚠️ Partially Vaccinated',
  not_vaccinated: '❌ Not Vaccinated',
  unknown: '❓ Unknown',
};

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImage, setCurrentImage] = useState(0);

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const pets = await base44.entities.Pet.filter({ id });
      return pets[0];
    },
  });

  const { data: wishlistItems = [] } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => base44.entities.Wishlist.list(),
  });

  const isWishlisted = useMemo(() => wishlistItems.some(w => w.pet_id === id), [wishlistItems, id]);

  const toggleWishlist = useMutation({
    mutationFn: async () => {
      const existing = wishlistItems.find(w => w.pet_id === id);
      if (existing) {
        await base44.entities.Wishlist.delete(existing.id);
      } else {
        const user = await base44.auth.me();
        await base44.entities.Wishlist.create({ pet_id: id, user_email: user.email, notify_when_available: true });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({ title: isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️' });
    },
  });

  const startChat = async () => {
    const user = await base44.auth.me();
    const chatRoomId = [user.email, pet.donor_email, pet.id].sort().join('_');
    navigate(`/chat/${chatRoomId}?pet=${pet.id}&owner=${pet.donor_email}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <p className="text-lg text-muted-foreground">Pet not found</p>
        <Link to="/browse"><Button className="mt-4">Browse Pets</Button></Link>
      </div>
    );
  }

  const images = pet.images?.length > 0 ? pet.images : [defaultImages[pet.type] || defaultImages.other];

  const infoSections = [
    { icon: Stethoscope, title: 'Health', content: pet.health_condition },
    { icon: Utensils, title: 'Feeding', content: pet.feeding_habits },
    { icon: Brain, title: 'Behavior', content: pet.behavior_notes },
    { icon: Clock, title: 'Daily Schedule', content: pet.daily_schedule },
    { icon: FileText, title: 'Care Instructions', content: pet.care_instructions },
    { icon: Heart, title: 'Reason for Rehoming', content: pet.reason_for_rehoming },
  ].filter(s => s.content);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4 gap-2">
        <ArrowLeft className="w-4 h-4" /> Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Gallery */}
        <div className="lg:col-span-3">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt={pet.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </AnimatePresence>
            {images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button onClick={() => setCurrentImage(i => (i + 1) % images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-card/80 backdrop-blur rounded-full flex items-center justify-center">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
            {pet.is_emergency && (
              <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground gap-1">
                <AlertTriangle className="w-3 h-3" /> Urgent
              </Badge>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {images.map((img, i) => (
                <button key={i} onClick={() => setCurrentImage(i)} className={`w-16 h-16 rounded-lg overflow-hidden shrink-0 border-2 ${i === currentImage ? 'border-primary' : 'border-transparent'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h1 className="font-heading text-3xl font-bold">{pet.name}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="secondary" className="capitalize">{pet.type}</Badge>
              {pet.breed && <Badge variant="outline">{pet.breed}</Badge>}
              {pet.age && <Badge variant="outline">{pet.age}</Badge>}
              {pet.gender && pet.gender !== 'unknown' && <Badge variant="outline" className="capitalize">{pet.gender}</Badge>}
            </div>
          </div>

          {pet.description && (
            <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
          )}

          <Card>
            <CardContent className="p-4 space-y-3">
              {pet.donor_location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{pet.donor_location}</span>
                </div>
              )}
              {pet.vaccination_status && (
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span>{vaccinationLabels[pet.vaccination_status]}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Listed {pet.created_date ? format(new Date(pet.created_date), 'MMM d, yyyy') : 'recently'}</span>
              </div>
              <div className="pt-2 border-t">
                <p className="text-lg font-heading font-bold text-primary">
                  {pet.adoption_type === 'free' ? 'Free Adoption' : pet.adoption_type === 'sponsored' ? 'Sponsored Adoption' : `$${pet.adoption_fee || 0}`}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button className="flex-1 rounded-full gap-2" onClick={startChat}>
              <MessageCircle className="w-4 h-4" /> Chat with Owner
            </Button>
            <Button
              variant="outline"
              className="rounded-full gap-2"
              onClick={() => toggleWishlist.mutate()}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-destructive text-destructive' : ''}`} />
              {isWishlisted ? 'Saved' : 'Save'}
            </Button>
          </div>

          <Link to={`/adopt/${pet.id}`}>
            <Button variant="secondary" className="w-full rounded-full gap-2 mt-2">
              🐾 Apply to Adopt
            </Button>
          </Link>
        </div>
      </div>

      {/* Detail sections */}
      {infoSections.length > 0 && (
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoSections.map((section) => (
            <Card key={section.title}>
              <CardHeader className="pb-2">
                <CardTitle className="font-heading text-base flex items-center gap-2">
                  <section.icon className="w-4 h-4 text-primary" />
                  {section.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{section.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}