import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, PawPrint } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import LocationPicker from '../components/pets/LocationPicker';

export default function AdoptPet() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    adopter_name: '', adopter_phone: '', adopter_location: '',
    adopter_lat: null, adopter_lng: null, message: '',
    lifestyle: '', home_type: '', pet_experience: '',
  });

  const { data: pet, isLoading } = useQuery({
    queryKey: ['pet', id],
    queryFn: async () => {
      const pets = await base44.entities.Pet.filter({ id });
      return pets[0];
    },
  });

  const submitRequest = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.AdoptionRequest.create({
        ...data,
        pet_id: id,
        pet_name: pet?.name,
        adopter_email: user.email,
        donor_email: pet?.donor_email,
        status: 'pending',
      });
    },
    onSuccess: () => {
      toast({ title: "Application submitted! 🎉", description: "The pet owner will review your request." });
      navigate(`/pet/${id}`);
    },
  });

  const handleChange = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  if (isLoading) return <div className="max-w-2xl mx-auto px-4 py-8"><Skeleton className="h-8 w-1/2 mb-4" /><Skeleton className="h-64 w-full" /></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-heading text-3xl font-bold">Adopt {pet?.name}</h1>
          <p className="text-muted-foreground mt-2">Fill out the application below</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submitRequest.mutate(form); }} className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">About You</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Name</Label>
                <Input value={form.adopter_name} onChange={(e) => handleChange('adopter_name', e.target.value)} placeholder="Your full name" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={form.adopter_phone} onChange={(e) => handleChange('adopter_phone', e.target.value)} placeholder="Your phone number" />
              </div>
              <div>
                <Label>Location</Label>
                <LocationPicker
                  value={form.adopter_location}
                  onChange={(v) => handleChange('adopter_location', v)}
                  onCoordsChange={(lat, lng) => { handleChange('adopter_lat', lat); handleChange('adopter_lng', lng); }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Lifestyle Match</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Lifestyle</Label>
                <Select value={form.lifestyle} onValueChange={(v) => handleChange('lifestyle', v)}>
                  <SelectTrigger><SelectValue placeholder="Select your lifestyle" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="busy">Busy</SelectItem>
                    <SelectItem value="family">Family with kids</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Home Type</Label>
                <Select value={form.home_type} onValueChange={(v) => handleChange('home_type', v)}>
                  <SelectTrigger><SelectValue placeholder="Select your home type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House with yard</SelectItem>
                    <SelectItem value="farm">Farm</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Pet Experience</Label>
                <Select value={form.pet_experience} onValueChange={(v) => handleChange('pet_experience', v)}>
                  <SelectTrigger><SelectValue placeholder="Your experience" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="first_time">First-time owner</SelectItem>
                    <SelectItem value="some_experience">Some experience</SelectItem>
                    <SelectItem value="experienced">Experienced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Message to Owner</CardTitle></CardHeader>
            <CardContent>
              <Textarea
                value={form.message}
                onChange={(e) => handleChange('message', e.target.value)}
                placeholder="Tell the owner why you'd be a great match for their pet..."
                rows={4}
              />
            </CardContent>
          </Card>

          <Button type="submit" size="lg" className="w-full rounded-full" disabled={submitRequest.isPending}>
            {submitRequest.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <PawPrint className="w-5 h-5 mr-2" />}
            Submit Adoption Application
          </Button>
        </form>
      </motion.div>
    </div>
  );
}