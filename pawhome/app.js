import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from './components/layout/AppLayout';
import Home from './pages/Home';
import RehomePet from './pages/RehomePet';
import BrowsePets from './pages/BrowsePets';
import PetDetails from './pages/PetDetails';
import AdoptPet from './pages/AdoptPet';
import Wishlist from './pages/Wishlist';
import MyListings from './pages/MyListings';
import ChatRoom from './pages/ChatRoom';
import Chats from './pages/Chats';
import Donations from './pages/Donations';
import SuccessStories from './pages/SuccessStories';
import PartnerShelters from './pages/PartnerShelters';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center animate-pulse">
            <span className="text-2xl">🐾</span>
          </div>
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/rehome" element={<RehomePet />} />
        <Route path="/browse" element={<BrowsePets />} />
        <Route path="/pet/:id" element={<PetDetails />} />
        <Route path="/adopt/:id" element={<AdoptPet />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/my-listings" element={<MyListings />} />
        <Route path="/chats" element={<Chats />} />
        <Route path="/chat/:roomId" element={<ChatRoom />} />
        <Route path="/donate" element={<Donations />} />
        <Route path="/stories" element={<SuccessStories />} />
        <Route path="/shelters" element={<PartnerShelters />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App