import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import HomePage from '@/pages/HomePage';
import AffidavitPage from '@/pages/AffidavitPage';
import MinorsRegistrationPage from '@/pages/MinorsRegistrationPage';
import AdultsRegistrationPage from '@/pages/AdultsRegistrationPage';
import AdminRegistrationsPage from '@/pages/AdminRegistrationsPage';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
  },
  out: {
    opacity: 0,
    y: -20,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

function App() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground dark">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route
              path="/"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <HomePage />
                </motion.div>
              }
            />
            <Route
              path="/affidavit/:type"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AffidavitPage />
                </motion.div>
              }
            />
            <Route
              path="/register/minors"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <MinorsRegistrationPage />
                </motion.div>
              }
            />
            <Route
              path="/register/adults"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdultsRegistrationPage />
                </motion.div>
              }
            />
            <Route
              path="/admin/registrations"
              element={
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  <AdminRegistrationsPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;