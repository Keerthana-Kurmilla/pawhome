import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const fallbackStories = [
  {
    id: 's1', pet_name: 'Bruno', pet_type: 'dog', adopter_name: 'Priya & Arjun Mehta',
    story: 'Bruno was found malnourished and injured on the streets of Bengaluru. After 3 months of rehab and lots of love, he found his forever family. Today he runs in the park every morning and sleeps on the couch like royalty!',
    before_image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop',
    date_adopted: '2024-03-15', location: 'Bengaluru', is_featured: true,
  },
  {
    id: 's2', pet_name: 'Miso', pet_type: 'cat', adopter_name: 'Sneha Kapoor',
    story: 'Miso was surrendered by her previous owner who could no longer care for her. After a few weeks of adjusting, she became the most affectionate cat. Now she greets Sneha at the door every evening!',
    before_image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    date_adopted: '2024-05-20', location: 'Mumbai',
  },
  {
    id: 's3', pet_name: 'Ginger', pet_type: 'rabbit', adopter_name: 'The Sharma Family',
    story: 'Ginger was rescued from an overcrowded pet store. The Sharma kids fell in love with her immediately. She now has her own room corner with toys, tunnels, and all the veggies she could ever want!',
    before_image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1552573020-7df19e3e6ba6?w=400&h=300&fit=crop',
    date_adopted: '2024-07-10', location: 'Delhi',
  },
  {
    id: 's4', pet_name: 'Polly', pet_type: 'parrot', adopter_name: 'Ravi Krishnan',
    story: 'Polly was abandoned in a park. Ravi, a musician, adopted her and discovered she has a talent for mimicking guitar riffs! She now has her own Instagram page with 12k followers.',
    before_image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1546842931-886c185b4c8c?w=400&h=300&fit=crop',
    date_adopted: '2024-06-03', location: 'Chennai', is_featured: true,
  },
  {
    id: 's5', pet_name: 'Noodle', pet_type: 'dog', adopter_name: 'Ananya Iyer',
    story: 'Noodle, a tiny Dachshund, spent 8 months in a shelter. Ananya saw his photo online and drove 200 km to adopt him. He now helps Ananya with her anxiety as her certified emotional support pet.',
    before_image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400&h=300&fit=crop',
    date_adopted: '2024-08-22', location: 'Hyderabad',
  },
  {
    id: 's6', pet_name: 'Bubbles', pet_type: 'fish', adopter_name: 'Tanvi Desai',
    story: 'Bubbles and his entire school were rescued from a neglectful owner. Tanvi set up a beautiful community tank for them. She says watching them swim together every morning is the best meditation.',
    before_image: 'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=400&h=300&fit=crop',
    after_image: 'https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=400&h=300&fit=crop',
    date_adopted: '2024-04-11', location: 'Pune',
  },
];

const petEmojis = { dog: '🐕', cat: '🐱', rabbit: '🐰', fish: '🐠', parrot: '🦜', bird: '🐦', other: '🐾' };

export default function SuccessStories() {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['success-stories'],
    queryFn: () => base44.entities.SuccessStory.list('-date_adopted', 50),
  });

  const displayStories = stories.length > 0 ? stories : fallbackStories;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-accent/10 flex items-center justify-center mb-4">
          <Star className="w-10 h-10 text-accent" />
        </div>
        <h1 className="font-heading text-4xl font-bold">Success Stories</h1>
        <p className="text-muted-foreground mt-3 text-lg max-w-xl mx-auto">
          Real stories of rescued pets who found happiness and loving forever homes.
        </p>
      </motion.div>

      {/* Featured story */}
      {!isLoading && displayStories.filter(s => s.is_featured).length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          {displayStories.filter(s => s.is_featured).slice(0, 1).map(story => (
            <Card key={story.id} className="overflow-hidden border-primary/20 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="grid grid-cols-2">
                  <div className="relative">
                    <img src={story.before_image} alt="Before" className="w-full h-56 md:h-full object-cover" />
                    <Badge className="absolute bottom-2 left-2 bg-destructive/80 text-white text-xs">Before</Badge>
                  </div>
                  <div className="relative">
                    <img src={story.after_image} alt="After" className="w-full h-56 md:h-full object-cover" />
                    <Badge className="absolute bottom-2 left-2 bg-accent text-white text-xs">After</Badge>
                  </div>
                </div>
                <CardContent className="p-6 flex flex-col justify-center">
                  <Badge className="w-fit mb-3 bg-primary/10 text-primary border-primary/20">⭐ Featured Story</Badge>
                  <h2 className="font-heading text-2xl font-bold">{petEmojis[story.pet_type]} {story.pet_name}'s Journey</h2>
                  <p className="text-muted-foreground mt-3 leading-relaxed">{story.story}</p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-primary" /> Adopted by {story.adopter_name}</span>
                    {story.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.location}</span>}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </motion.div>
      )}

      {/* All stories grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 w-full rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayStories.filter(s => !s.is_featured || stories.length > 0).map((story, i) => (
            <motion.div key={story.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              <Card className="overflow-hidden hover:shadow-xl transition-shadow group">
                <div className="grid grid-cols-2">
                  <div className="relative h-36 overflow-hidden">
                    <img src={story.before_image} alt="Before" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge className="absolute bottom-2 left-2 bg-destructive/80 text-white text-xs py-0">Before</Badge>
                  </div>
                  <div className="relative h-36 overflow-hidden">
                    <img src={story.after_image || story.before_image} alt="After" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <Badge className="absolute bottom-2 right-2 bg-accent text-white text-xs py-0">After</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{petEmojis[story.pet_type] || '🐾'}</span>
                    <h3 className="font-heading font-bold text-base">{story.pet_name}'s Story</h3>
                    {story.is_featured && <Star className="w-4 h-4 text-amber-500 fill-amber-500 ml-auto" />}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">{story.story}</p>
                  <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3 text-primary" /> {story.adopter_name}</span>
                    <div className="flex items-center gap-2">
                      {story.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{story.location}</span>}
                      {story.date_adopted && <span>{format(new Date(story.date_adopted), 'MMM yyyy')}</span>}
                    </div>
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