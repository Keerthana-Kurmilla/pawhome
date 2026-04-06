import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, MapPin, ExternalLink, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

const fallbackShelters = [
  {
    id: 'sh1', name: 'Paws & Claws Rescue', description: 'A no-kill shelter dedicated to rescuing stray and abused dogs and cats. We provide medical care, rehabilitation, and adoption services across Maharashtra.',
    location: 'Mumbai, Maharashtra', animals_helped: 1250, founded_year: 2012, verified: true,
    specialization: 'Dogs & Cats', contact_email: 'hello@pawsclaws.in',
    logo_url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop&crop=face',
    website: '#',
  },
  {
    id: 'sh2', name: 'Happy Tails Foundation', description: 'Working to end pet abandonment through education, community programs, and a robust adoption network. Our volunteers cover 15 districts in Karnataka.',
    location: 'Bengaluru, Karnataka', animals_helped: 890, founded_year: 2015, verified: true,
    specialization: 'All Animals', contact_email: 'info@happytails.org',
    logo_url: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=100&h=100&fit=crop',
    website: '#',
  },
  {
    id: 'sh3', name: 'Feathered Friends Sanctuary', description: 'India\'s largest bird and parrot rescue sanctuary. We rehabilitate injured birds and provide lifetime care for those unable to be released or adopted.',
    location: 'Hyderabad, Telangana', animals_helped: 420, founded_year: 2018, verified: true,
    specialization: 'Birds & Parrots', contact_email: 'sanctuary@featheredfriends.in',
    logo_url: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=100&h=100&fit=crop',
    website: '#',
  },
  {
    id: 'sh4', name: 'Bunny Burrow Rescue', description: 'Specializing in small animals — rabbits, guinea pigs, hamsters, and more. We educate families on small pet care and ensure every adoption is the right match.',
    location: 'Pune, Maharashtra', animals_helped: 310, founded_year: 2019, verified: true,
    specialization: 'Small Animals', contact_email: 'adopt@bunnyburrow.in',
    logo_url: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=100&h=100&fit=crop',
    website: '#',
  },
  {
    id: 'sh5', name: 'Animal Welfare Society of India', description: 'A national-level NGO running spay-neuter programs, vaccination drives, and emergency rescue operations. Partnered with 50+ local shelters.',
    location: 'New Delhi', animals_helped: 5600, founded_year: 2005, verified: true,
    specialization: 'All Animals', contact_email: 'awsi@welfare.org',
    logo_url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=100&h=100&fit=crop',
    website: '#',
  },
  {
    id: 'sh6', name: 'Chennai Street Dog Rescue', description: 'Focused on street dog rescue, treatment of mange and injuries, and community awareness programs. Operating 24/7 emergency rescue hotline.',
    location: 'Chennai, Tamil Nadu', animals_helped: 780, founded_year: 2016, verified: true,
    specialization: 'Street Dogs', contact_email: 'rescue@chennaistreetdog.com',
    logo_url: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=100&h=100&fit=crop',
    website: '#',
  },
];

const specColors = {
  'Dogs & Cats': 'bg-amber-50 text-amber-700 border-amber-200',
  'All Animals': 'bg-green-50 text-green-700 border-green-200',
  'Birds & Parrots': 'bg-blue-50 text-blue-700 border-blue-200',
  'Small Animals': 'bg-purple-50 text-purple-700 border-purple-200',
  'Street Dogs': 'bg-rose-50 text-rose-700 border-rose-200',
};

export default function PartnerShelters() {
  const { data: shelters = [], isLoading } = useQuery({
    queryKey: ['partner-shelters'],
    queryFn: () => base44.entities.PartnerShelter.list('-animals_helped', 50),
  });

  const displayShelters = shelters.length > 0 ? shelters : fallbackShelters;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-4">
          <Shield className="w-10 h-10 text-primary" />
        </div>
        <h1 className="font-heading text-4xl font-bold">Partner Shelters</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
          Verified organizations dedicated to animal welfare across India.
        </p>
        <div className="flex justify-center gap-6 mt-6 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-primary">{displayShelters.length}+</p>
            <p>Partner Shelters</p>
          </div>
          <div className="text-center">
            <p className="font-heading text-2xl font-bold text-accent">{displayShelters.reduce((s, sh) => s + (sh.animals_helped || 0), 0).toLocaleString('en-IN')}+</p>
            <p>Animals Helped</p>
          </div>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-64 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayShelters.map((shelter, i) => (
            <motion.div key={shelter.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="hover:shadow-xl transition-all h-full flex flex-col border-border/50 group">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start gap-3 mb-3">
                    <img
                      src={shelter.logo_url || 'https://images.unsplash.com/photo-1425082661507-6af0db74dd50?w=100&h=100&fit=crop'}
                      alt={shelter.name}
                      className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-heading font-bold text-sm leading-tight">{shelter.name}</h3>
                        {shelter.verified && (
                          <Shield className="w-4 h-4 text-primary fill-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {shelter.location}
                      </div>
                    </div>
                  </div>

                  {shelter.specialization && (
                    <Badge variant="outline" className={`w-fit text-xs mb-3 ${specColors[shelter.specialization] || 'bg-muted'}`}>
                      {shelter.specialization}
                    </Badge>
                  )}

                  <p className="text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-4">{shelter.description}</p>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3.5 h-3.5" />
                      <span className="font-semibold text-foreground">{(shelter.animals_helped || 0).toLocaleString('en-IN')}</span> helped
                    </div>
                    {shelter.founded_year && (
                      <span className="text-xs text-muted-foreground">Est. {shelter.founded_year}</span>
                    )}
                    {shelter.website && shelter.website !== '#' && (
                      <a href={shelter.website} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-primary">
                          Visit <ExternalLink className="w-3 h-3" />
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}