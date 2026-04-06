import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Search, PawPrint, ArrowRight, Shield, MessageCircle, Users, Star, IndianRupee, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import PetCard from '../components/pets/PetCard';

const features = [
  { icon: Shield, title: 'Safe & Verified', desc: 'Every adoption goes through a trusted process', color: 'bg-blue-50 text-blue-600' },
  { icon: MessageCircle, title: 'Direct Chat', desc: 'Talk to pet owners before adopting', color: 'bg-primary/10 text-primary' },
  { icon: Users, title: 'Community', desc: 'Join thousands of caring pet lovers', color: 'bg-green-50 text-green-600' },
  { icon: Heart, title: 'Post-Adoption', desc: 'Ongoing support after you adopt', color: 'bg-rose-50 text-rose-600' },
];

const petTypeImages = [
  { type: 'dog', emoji: '🐕', label: 'Dogs', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
  { type: 'cat', emoji: '🐱', label: 'Cats', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&h=200&fit=crop' },
  { type: 'rabbit', emoji: '🐰', label: 'Rabbits', img: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=200&h=200&fit=crop' },
  { type: 'fish', emoji: '🐠', label: 'Fish', img: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=200&h=200&fit=crop' },
  { type: 'parrot', emoji: '🦜', label: 'Parrots', img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=200&h=200&fit=crop' },
  { type: 'bird', emoji: '🐦', label: 'Birds', img: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=200&h=200&fit=crop' },
  { type: 'other', emoji: '🦎', label: 'Others', img: 'https://images.unsplash.com/photo-1425082661507-6af0db74dd50?w=200&h=200&fit=crop' },
];

const impactTiers = [
  { amount: '₹100', label: 'Feeds a pet for 3 days', emoji: '🍖' },
  { amount: '₹500', label: 'Covers a vet checkup', emoji: '🏥' },
  { amount: '₹1,000', label: 'Shelter for a month', emoji: '🏠' },
  { amount: '₹5,000', label: 'Full rescue & rehab', emoji: '⭐' },
];

const quickStories = [
  { name: 'Bruno', type: 'dog', adopter: 'Priya & Arjun', quote: 'He runs in the park every morning and sleeps on the couch like royalty!', img: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=200&fit=crop', location: 'Bengaluru' },
  { name: 'Miso', type: 'cat', adopter: 'Sneha K.', quote: 'She greets me at the door every evening. Life is so much better with her.', img: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&h=200&fit=crop', location: 'Mumbai' },
  { name: 'Polly', type: 'parrot', adopter: 'Ravi K.', quote: 'She mimics guitar riffs and now has 12k followers on Instagram!', img: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=300&h=200&fit=crop', location: 'Chennai' },
];

export default function Home() {
  const { data: featuredPets = [], isLoading } = useQuery({
    queryKey: ['featured-pets'],
    queryFn: () => base44.entities.Pet.filter({ status: 'available' }, '-created_date', 6),
  });

  return (
    <div className="font-body">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-secondary/40 to-accent/8 min-h-[90vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-20 w-full">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <motion.div
              className="flex-1 text-center md:text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 text-sm px-4 py-1.5 rounded-full bg-primary/10 text-primary border-primary/20">
                🐾 India's Trusted Pet Rehoming Platform
              </Badge>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Give Every Pet a{' '}
                <span className="text-primary">Forever Home</span>
              </h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Connect with caring pet owners, rescue animals in need, and make a difference — one paw at a time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center md:justify-start flex-wrap">
                <Link to="/rehome">
                  <Button size="lg" className="gap-2 rounded-full text-base px-8 shadow-lg">
                    <Heart className="w-5 h-5" /> Rehome Your Pet
                  </Button>
                </Link>
                <Link to="/browse">
                  <Button size="lg" variant="outline" className="gap-2 rounded-full text-base px-8 border-primary/30 hover:bg-primary/5">
                    <Search className="w-5 h-5" /> Find a Pet
                  </Button>
                </Link>
                <Link to="/donate">
                  <Button size="lg" variant="secondary" className="gap-2 rounded-full text-base px-8">
                    <IndianRupee className="w-5 h-5" /> Donate
                  </Button>
                </Link>
              </div>
              {/* Stats row */}
              <div className="flex gap-6 mt-10 justify-center md:justify-start">
                {[{ v: '2,500+', l: 'Pets Rehomed' }, { v: '50+', l: 'Partner Shelters' }, { v: '10K+', l: 'Happy Families' }].map(s => (
                  <div key={s.l} className="text-center md:text-left">
                    <p className="font-heading text-2xl font-bold text-primary">{s.v}</p>
                    <p className="text-xs text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="flex-1 relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="relative w-full max-w-md mx-auto">
                <div className="absolute inset-0 bg-primary/15 rounded-3xl rotate-3" />
                <img
                  src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=600&h=700&fit=crop"
                  alt="Happy pets"
                  className="relative rounded-3xl w-full object-cover shadow-2xl aspect-[4/5]"
                />
                <motion.div
                  className="absolute -bottom-4 -left-4 bg-card rounded-2xl shadow-xl p-4 border border-border/50"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-xl">🐾</div>
                    <div>
                      <p className="font-heading font-bold text-sm">2,500+</p>
                      <p className="text-xs text-muted-foreground">Pets rehomed</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  className="absolute -top-4 -right-4 bg-primary rounded-2xl shadow-xl p-3 text-white"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                >
                  <p className="font-heading font-bold text-sm">❤️ 10K+</p>
                  <p className="text-xs text-white/70">Happy families</p>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-8">Browse by Animal</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-4">
          {petTypeImages.map((item, i) => (
            <motion.div key={item.type} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Link to={`/browse?type=${item.type}`}>
                <div className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-secondary/60 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow ring-2 ring-transparent group-hover:ring-primary/30">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{item.label}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Pets */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">Featured Pets</h2>
          <Link to="/browse"><Button variant="ghost" className="gap-2 text-primary hover:text-primary">View All <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="space-y-3"><Skeleton className="h-48 w-full rounded-xl" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>)}
          </div>
        ) : featuredPets.length === 0 ? (
          <div className="text-center py-16">
            <PawPrint className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground text-lg">No pets listed yet.</p>
            <Link to="/rehome"><Button className="mt-4 rounded-full">List Your Pet</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPets.map(pet => <PetCard key={pet.id} pet={pet} />)}
          </div>
        )}
      </section>

      {/* Donation Impact */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/40 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold">Your Donation Makes a Real Difference</h2>
            <p className="text-muted-foreground mt-2">Every rupee helps animals in need</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {impactTiers.map((tier, i) => (
              <motion.div key={tier.amount} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="text-center border-border/50 hover:shadow-lg transition-shadow hover:border-primary/30 cursor-pointer" onClick={() => {}}>
                  <CardContent className="p-5">
                    <span className="text-4xl">{tier.emoji}</span>
                    <p className="font-heading text-xl font-bold text-primary mt-2">{tier.amount}</p>
                    <p className="text-xs text-muted-foreground mt-1">{tier.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <Link to="/donate"><Button size="lg" className="rounded-full gap-2 px-10 shadow-lg"><IndianRupee className="w-5 h-5" /> Donate Now</Button></Link>
          </div>
        </div>
      </section>

      {/* Success Stories Teaser */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-bold">💛 Happy Endings</h2>
          <Link to="/stories"><Button variant="ghost" className="gap-2 text-primary hover:text-primary">All Stories <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {quickStories.map((s, i) => (
            <motion.div key={s.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="relative h-44 overflow-hidden">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                  <div className="absolute bottom-3 left-3 text-white">
                    <p className="font-heading font-bold">{s.name}</p>
                    <div className="flex items-center gap-1 text-xs text-white/80"><MapPin className="w-3 h-3" />{s.location}</div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground italic line-clamp-2">"{s.quote}"</p>
                  <p className="text-xs text-primary font-semibold mt-2">— {s.adopter}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-secondary/40 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-center mb-10">Why PawHome?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                className="bg-card rounded-2xl p-6 text-center border border-border/50 hover:shadow-lg transition-shadow">
                <div className={`w-14 h-14 mx-auto rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon className="w-7 h-7" />
                </div>
                <h3 className="font-heading font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Shelters teaser */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold">🤝 Partner Shelters</h2>
            <p className="text-muted-foreground text-sm mt-1">Verified organizations dedicated to animal welfare</p>
          </div>
          <Link to="/shelters"><Button variant="ghost" className="gap-2 text-primary hover:text-primary">View All <ArrowRight className="w-4 h-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {['Paws & Claws', 'Happy Tails', 'Feathered Friends', 'Bunny Burrow', 'Animal Welfare Society', 'Chennai Street Dog'].map((name, i) => (
            <Link to="/shelters" key={name}>
              <div className="text-center p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <p className="text-xs font-semibold text-foreground leading-tight">{name}</p>
                <Badge variant="secondary" className="text-[9px] mt-1 px-1.5">Verified ✓</Badge>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/50 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
                <PawPrint className="w-4 h-4 text-white" />
              </div>
              <span className="font-heading font-bold text-lg">PawHome</span>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground justify-center">
              {[['/', 'Home'], ['/browse', 'Browse'], ['/donate', 'Donate'], ['/stories', 'Stories'], ['/shelters', 'Shelters']].map(([path, label]) => (
                <Link key={path} to={path} className="hover:text-primary transition-colors">{label}</Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Made with ❤️ for animals everywhere</p>
          </div>
        </div>
      </footer>
    </div>
  );
}