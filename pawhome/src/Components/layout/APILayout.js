import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import PawBot from '../chatbot/PawBot';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 pb-20 lg:pb-8">
        <Outlet />
      </main>
      <PawBot />
    </div>
  );
}