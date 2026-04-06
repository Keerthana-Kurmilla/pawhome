import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PawPrint, Upload, AlertTriangle, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { motion } from 'framer-motion';
import LocationPicker from '../components/pets/LocationPicker';

const petTypes = [
  { value: 'dog', label: 'Dog 🐕' },
  { value: 'cat', label: 'Cat 🐱' },
  { value: 'rabbit', label: 'Rabbit 🐰' },
  { value: 'fish', label: 'Fish 🐠' },
  { value: 'parrot', label: 'Parrot 🦜' },
  { value: 'bird', label: 'Bird 🐦' },
  { value: 'other', label: 'Other 🐾' },
];

export default function RehomePet() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: '', type: '', breed: '', age: '', gender: '',
    description: '', health_condition: '', vaccination_status: '',
    reason_for_rehoming: '', feeding_habits: '', behavior_notes: '',
    care_instructions: '', daily_schedule: '', adoption_type: 'free',
    adoption_fee: 0, is_emergency: false, donor_location: '',
    donor_lat: null, donor_lng: null, donor_name: '', donor_phone: '',
    images: [],
  });
  const [uploading, setUploading] = useState(false);

  const createPet = useMutation({
    mutationFn: async (data) => {
      const user = await base44.auth.me();
      return base44.entities.Pet.create({
        ...data,
        donor_email: user.email,
        donor_name: data.donor_name || user.full_name,
        status: 'available',
      });
    },
    onSuccess: () => {
      toast({ title: "Pet listed successfully! 🎉", description: "Your pet is now visible to potential adopters." });
      navigate('/my-listings');
    },
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    const urls = [];
    for (const file of files) {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      urls.push(file_url);
    }
    setForm(prev => ({ ...prev, images: [...prev.images, ...urls] }));
    setUploading(false);
  };

  const removeImage = (index) => {
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.type) {
      toast({ title: "Please fill required fields", description: "Pet name and type are required.", variant: "destructive" });
      return;
    }
    createPet.mutate(form);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <PawPrint className="w-8 h-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl font-bold">Rehome Your Pet</h1>
          <p className="text-muted-foreground mt-2">Help your pet find a loving new home</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emergency Toggle */}
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-accent" />
                <div>
                  <p className="font-medium text-sm">Emergency Rehoming</p>
                  <p className="text-xs text-muted-foreground">Mark as urgent for priority placement</p>
                </div>
              </div>
              <Switch checked={form.is_emergency} onCheckedChange={(v) => handleChange('is_emergency', v)} />
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Pet Name *</Label>
                  <Input value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="e.g. Buddy" />
                </div>
                <div>
                  <Label>Pet Type *</Label>
                  <Select value={form.type} onValueChange={(v) => handleChange('type', v)}>
                    <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                    <SelectContent>
                      {petTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Breed</Label>
                  <Input value={form.breed} onChange={(e) => handleChange('breed', e.target.value)} placeholder="e.g. Golden Retriever" />
                </div>
                <div>
                  <Label>Age</Label>
                  <Input value={form.age} onChange={(e) => handleChange('age', e.target.value)} placeholder="e.g. 2 years" />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => handleChange('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Tell us about your pet's personality..." rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Health */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Health & Medical</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Health Condition</Label>
                <Textarea value={form.health_condition} onChange={(e) => handleChange('health_condition', e.target.value)} placeholder="Any medical conditions or special needs?" rows={2} />
              </div>
              <div>
                <Label>Vaccination Status</Label>
                <Select value={form.vaccination_status} onValueChange={(v) => handleChange('vaccination_status', v)}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fully_vaccinated">Fully Vaccinated</SelectItem>
                    <SelectItem value="partially_vaccinated">Partially Vaccinated</SelectItem>
                    <SelectItem value="not_vaccinated">Not Vaccinated</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Care */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Care & Behavior</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Reason for Rehoming</Label>
                <Textarea value={form.reason_for_rehoming} onChange={(e) => handleChange('reason_for_rehoming', e.target.value)} placeholder="Why are you rehoming?" rows={2} />
              </div>
              <div>
                <Label>Feeding Habits</Label>
                <Textarea value={form.feeding_habits} onChange={(e) => handleChange('feeding_habits', e.target.value)} placeholder="What does your pet eat? How often?" rows={2} />
              </div>
              <div>
                <Label>Behavior Notes</Label>
                <Textarea value={form.behavior_notes} onChange={(e) => handleChange('behavior_notes', e.target.value)} placeholder="Is your pet friendly, shy, energetic?" rows={2} />
              </div>
              <div>
                <Label>Care Instructions</Label>
                <Textarea value={form.care_instructions} onChange={(e) => handleChange('care_instructions', e.target.value)} placeholder="Special care tips for the new owner" rows={2} />
              </div>
              <div>
                <Label>Daily Schedule</Label>
                <Textarea value={form.daily_schedule} onChange={(e) => handleChange('daily_schedule', e.target.value)} placeholder="Walk times, meal times, sleep routine..." rows={2} />
              </div>
            </CardContent>
          </Card>

          {/* Adoption Model */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Adoption Model</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {['free', 'paid', 'sponsored'].map(type => (
                  <Badge
                    key={type}
                    variant={form.adoption_type === type ? 'default' : 'outline'}
                    className="cursor-pointer px-4 py-2 text-sm capitalize"
                    onClick={() => handleChange('adoption_type', type)}
                  >
                    {type === 'free' ? '🆓 Free' : type === 'paid' ? '💰 Paid' : '🤝 Sponsored'}
                  </Badge>
                ))}
              </div>
              {form.adoption_type === 'paid' && (
                <div>
                  <Label>Adoption Fee ($)</Label>
                  <Input type="number" value={form.adoption_fee} onChange={(e) => handleChange('adoption_fee', parseFloat(e.target.value) || 0)} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Photos</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-4">
                {form.images.map((url, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 bg-foreground/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3 text-background" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                  {uploading ? <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /> : (
                    <>
                      <ImageIcon className="w-6 h-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                    </>
                  )}
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Location & Contact */}
          <Card>
            <CardHeader><CardTitle className="font-heading text-lg">Your Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Your Name</Label>
                <Input value={form.donor_name} onChange={(e) => handleChange('donor_name', e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input value={form.donor_phone} onChange={(e) => handleChange('donor_phone', e.target.value)} placeholder="Your phone number" />
              </div>
              <div>
                <Label>Location</Label>
                <LocationPicker
                  value={form.donor_location}
                  onChange={(v) => handleChange('donor_location', v)}
                  onCoordsChange={(lat, lng) => {
                    handleChange('donor_lat', lat);
                    handleChange('donor_lng', lng);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full text-base"
            disabled={createPet.isPending}
          >
            {createPet.isPending ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Listing Pet...</>
            ) : (
              <><PawPrint className="w-5 h-5 mr-2" /> List Pet for Adoption</>
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}