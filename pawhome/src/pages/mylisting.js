import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, PawPrint, Eye, Trash2, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';

const statusColors = {
  available: 'bg-green-50 text-green-600 border-green-200',
  pending: 'bg-amber-50 text-amber-600 border-amber-200',
  adopted: 'bg-blue-50 text-blue-600 border-blue-200',
  unavailable: 'bg-rose-50 text-rose-600 border-rose-200',
};

const defaultImages = {
  dog: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop',
  cat: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop',
  rabbit: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop',
  fish: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop',
  parrot: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=200&fit=crop',
  bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop',
  other: 'https://images.unsplash.com/photo-1425082661507-6af0db74dd50?w=200&h=200&fit=crop',
};

export default function MyListings() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: myPets = [], isLoading: loadingPets } = useQuery({
    queryKey: ['my-pets'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Pet.filter({ donor_email: user.email }, '-created_date');
    },
  });

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['my-requests'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.AdoptionRequest.filter({ donor_email: user.email }, '-created_date');
    },
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }) => base44.entities.Pet.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
      toast({ title: "Status updated" });
    },
  });

  const deletePet = useMutation({
    mutationFn: (id) => base44.entities.Pet.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-pets'] });
      toast({ title: "Pet removed" });
    },
  });

  const updateRequest = useMutation({
    mutationFn: ({ id, status }) => base44.entities.AdoptionRequest.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
      toast({ title: "Request updated" });
    },
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold">My Pets</h1>
          <p className="text-muted-foreground mt-1">Manage your pet listings</p>
        </div>
        <Link to="/rehome">
          <Button className="rounded-full gap-2">
            <Plus className="w-4 h-4" /> List a Pet
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="listings">
        <TabsList className="mb-6">
          <TabsTrigger value="listings">My Listings ({myPets.length})</TabsTrigger>
          <TabsTrigger value="requests">Adoption Requests ({requests.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="listings">
          {loadingPets ? (
            <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
          ) : myPets.length === 0 ? (
            <div className="text-center py-20">
              <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">No pets listed yet</p>
              <Link to="/rehome"><Button className="mt-4 rounded-full">List Your First Pet</Button></Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myPets.map((pet, i) => (
                <motion.div key={pet.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <CardContent className="p-4 flex items-center gap-4">
                      <img
                        src={pet.images?.[0] || defaultImages[pet.type] || defaultImages.other}
                        alt={pet.name}
                        className="w-16 h-16 rounded-xl object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold truncate">{pet.name}</h3>
                          {pet.is_emergency && <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground capitalize">{pet.type}{pet.breed ? ` · ${pet.breed}` : ''}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Select value={pet.status} onValueChange={(v) => updateStatus.mutate({ id: pet.id, status: v })}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="adopted">Adopted</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                          </SelectContent>
                        </Select>
                        <Link to={`/pet/${pet.id}`}>
                          <Button variant="ghost" size="icon"><Eye className="w-4 h-4" /></Button>
                        </Link>
                        <Button variant="ghost" size="icon" onClick={() => deletePet.mutate(pet.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {loadingRequests ? (
            <div className="space-y-4">{[1,2].map(i => <Skeleton key={i} className="h-24 w-full rounded-xl" />)}</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <Clock className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <p className="text-lg text-muted-foreground">No adoption requests yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <Card key={req.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-heading font-bold">{req.adopter_name || req.adopter_email}</p>
                        <p className="text-sm text-muted-foreground">wants to adopt <span className="font-medium text-foreground">{req.pet_name}</span></p>
                        {req.message && <p className="text-sm text-muted-foreground mt-2 italic">"{req.message}"</p>}
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {req.lifestyle && <Badge variant="outline" className="text-xs capitalize">{req.lifestyle}</Badge>}
                          {req.home_type && <Badge variant="outline" className="text-xs capitalize">{req.home_type}</Badge>}
                          {req.pet_experience && <Badge variant="outline" className="text-xs capitalize">{req.pet_experience?.replace('_', ' ')}</Badge>}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        {req.status === 'pending' ? (
                          <>
                            <Button size="sm" onClick={() => updateRequest.mutate({ id: req.id, status: 'approved' })}>
                              <CheckCircle className="w-4 h-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => updateRequest.mutate({ id: req.id, status: 'rejected' })}>
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge className={req.status === 'approved' ? statusColors.available : statusColors.unavailable}>
                            {req.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}