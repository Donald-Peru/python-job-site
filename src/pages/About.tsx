import React from 'react';
import { Target, Users, Globe, ShieldCheck, Terminal, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-brand-blue py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-brand-yellow rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-yellow rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-sm font-bold text-brand-yellow uppercase tracking-[0.4em] mb-6">Mission Protocol</h1>
          <h2 className="text-5xl md:text-7xl font-bold text-white tracking-tight mb-8">
            The World's Hub for <span className="text-brand-yellow">Python</span> Talent.
          </h2>
          <p className="text-xl text-white/70 font-medium leading-relaxed max-w-2xl mx-auto">
            We are dedicated to connecting the global Python community with specialized technical opportunities that push the boundaries of software engineering.
          </p>
        </div>
      </div>

      {/* Philosophy */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Target className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue">Targeted Tech</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              We focus exclusively on Python. No noise, just the best roles in data science, backend web, and automation.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <Globe className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue">Global Reach</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              With nodes in 50+ locations including USA, UK, Canada, and India, we bring the best roles to your local coordinate.
            </p>
          </div>
          <div className="space-y-6">
            <div className="w-16 h-16 bg-white border border-slate-200 rounded-3xl flex items-center justify-center mx-auto shadow-sm">
              <ShieldCheck className="h-8 w-8 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold text-brand-blue">Verified Nodes</h3>
            <p className="text-slate-500 font-medium leading-relaxed">
              Every job on our platform is hand-published and verified by our team of technical node administrators.
            </p>
          </div>
        </div>
      </div>

      {/* Team/Story Section */}
      <div className="max-w-5xl mx-auto px-6 py-24 border-t border-slate-200">
        <div className="bg-white rounded-[40px] p-12 md:p-20 shadow-xl border border-slate-100 flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-bold text-brand-blue leading-tight">Built by Pythonistas, for Pythonistas.</h2>
            <p className="text-slate-600 font-medium leading-relaxed text-lg">
              Python Job Board started as a small internal tool to help our network find specialized roles. Today, it serves thousands of developers daily, acting as a critical bridge in the technical recruitment ecosystem.
            </p>
            <div className="flex items-center gap-6">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/user${i}/100/100`} 
                      alt="Team Member" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Connect with 5k+ Users</p>
            </div>
          </div>
          <div className="w-full md:w-80 h-80 bg-brand-blue rounded-3xl p-10 flex flex-col items-center justify-center text-center shadow-lg transform rotate-3">
             <Heart className="w-20 h-20 text-brand-yellow mb-6 animate-pulse" />
             <p className="text-white font-bold opacity-80 uppercase tracking-[0.2em] text-xs">Community First</p>
          </div>
        </div>
      </div>
    </div>
  );
}
