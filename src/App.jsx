import React from "react";
import { Sparkles, Users, Share2, Compass, ArrowRight, Github, Twitter, Linkedin } from "lucide-react";

const features = [
  {
    icon: <Users className="w-8 h-8 text-indigo-400" />,
    title: "Connect with Friends",
    desc: "Find and connect with people who share your interests.",
  },
  {
    icon: <Share2 className="w-8 h-8 text-indigo-400" />,
    title: "Share Moments",
    desc: "Post updates, photos, and stories instantly.",
  },
  {
    icon: <Compass className="w-8 h-8 text-indigo-400" />,
    title: "Discover Content",
    desc: "Explore trending topics and communities.",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-800 text-white font-sans flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <header className="flex items-center gap-2 mb-8">
        <Sparkles className="w-10 h-10 text-yellow-300 animate-pulse" />
        <h1 className="text-4xl font-bold tracking-tight">Socially</h1>
      </header>
      <main className="flex flex-col items-center w-full max-w-2xl">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-center">Connect, Share, and Discover</h2>
        <p className="mb-8 text-center text-lg text-indigo-100">A modern social platform to meet new friends, share your moments, and explore the world.</p>
        <a href="#" className="inline-flex items-center gap-2 bg-yellow-400 text-indigo-900 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-yellow-300 transition transform duration-200 hover:scale-105 mb-12">
          Get Started <ArrowRight className="w-5 h-5" />
        </a>
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full mb-12">
          {features.map((f, i) => (
            <div key={i} className="bg-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-md transform transition-transform duration-200 hover:scale-105">
              {f.icon}
              <h3 className="mt-4 text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-indigo-100">{f.desc}</p>
            </div>
          ))}
        </section>
      </main>
      <footer className="mt-auto flex flex-col items-center gap-2 text-indigo-200">
        <div className="flex gap-4 mb-2">
          <a href="#" className="hover:text-white transform transition-transform duration-200 hover:scale-125"><Github className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transform transition-transform duration-200 hover:scale-125"><Twitter className="w-5 h-5" /></a>
          <a href="#" className="hover:text-white transform transition-transform duration-200 hover:scale-125"><Linkedin className="w-5 h-5" /></a>
        </div>
        <span className="text-xs">&copy; {new Date().getFullYear()} Socially. All rights reserved.</span>
      </footer>
    </div>
  );
} 