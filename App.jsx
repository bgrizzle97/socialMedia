import React from 'react';
import { Sparkles, Users, Share2, Compass, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react'; // Importing icons

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-inter flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="w-full max-w-7xl flex justify-between items-center py-4">
        <div className="flex items-center space-x-3">
          <Sparkles className="h-8 w-8 text-yellow-300" />
          <h1 className="text-3xl font-bold tracking-tight">SocialSphere</h1>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-lg hover:text-purple-200 transition-colors duration-200">Features</a>
          <a href="#" className="text-lg hover:text-purple-200 transition-colors duration-200">About Us</a>
          <a href="#" className="text-lg hover:text-purple-200 transition-colors duration-200">Contact</a>
          <a href="#" className="text-lg hover:text-purple-200 transition-colors duration-200">Sign In</a>
        </nav>
        <button className="md:hidden p-2 rounded-md hover:bg-purple-700 transition-colors duration-200">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col justify-center items-center text-center py-20 max-w-4xl">
        <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-fade-in-down">
          Connect. Share. Thrive.
        </h2>
        <p className="text-xl sm:text-2xl text-purple-100 mb-10 animate-fade-in-up">
          Your new digital home to build communities, share moments, and discover inspiring content.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in-up-delay">
          <button className="bg-white text-purple-700 font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
            Join SocialSphere <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg hover:bg-white hover:text-purple-700 transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
            Learn More
          </button>
        </div>
      </main>

      {/* Features Section */}
      <section className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-8 py-20">
        <div className="bg-purple-700 bg-opacity-40 rounded-xl p-8 flex flex-col items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Users className="h-16 w-16 text-teal-300 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Build Communities</h3>
          <p className="text-purple-100">Create and join groups based on your interests, hobbies, and passions.</p>
        </div>
        <div className="bg-purple-700 bg-opacity-40 rounded-xl p-8 flex flex-col items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Share2 className="h-16 w-16 text-rose-300 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Share Your World</h3>
          <p className="text-purple-100">Easily share photos, videos, and updates with your friends and followers.</p>
        </div>
        <div className="bg-purple-700 bg-opacity-40 rounded-xl p-8 flex flex-col items-center text-center shadow-lg transform hover:scale-105 transition-transform duration-300">
          <Compass className="h-16 w-16 text-sky-300 mb-4" />
          <h3 className="text-2xl font-bold mb-3">Discover New Content</h3>
          <p className="text-purple-100">Explore trending topics, articles, and profiles tailored to you.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center py-8 border-t border-purple-500 mt-auto">
        <p className="text-purple-200 text-sm mb-4 sm:mb-0">&copy; {new Date().getFullYear()} SocialSphere. All rights reserved.</p>
        <div className="flex space-x-6">
          <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200"><Twitter className="h-6 w-6" /></a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200"><Linkedin className="h-6 w-6" /></a>
          <a href="#" className="text-purple-200 hover:text-white transition-colors duration-200"><Github className="h-6 w-6" /></a>
        </div>
      </footer>

      {/* Tailwind CSS and Inter Font */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        body { font-family: 'Inter', sans-serif; }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-up-delay {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out forwards 0.2s; }
        .animate-fade-in-up-delay { animation: fade-in-up-delay 0.8s ease-out forwards 0.4s; }
      `}} />
    </div>
  );
};

export default App;