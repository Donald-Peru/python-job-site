import React from 'react';
import { Mail, Zap, Target, Globe, CheckCircle2, Send, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export default function PostJobInfo() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-24">
      <div className="max-w-4xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-sm font-bold text-brand-blue uppercase tracking-[0.4em] mb-4">Partner with us</h1>
            <div className="text-4xl md:text-6xl font-black text-brand-blue tracking-tight leading-tight mb-6">
              Hire the World's Best <br />
              <span className="text-brand-yellow">Python Developers</span>
            </div>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Join hundreds of companies finding their technical talent on the world's most specialized Python job board.
            </p>
          </motion.div>
        </div>

        {/* Value Props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Target className="h-6 w-6 text-white" />,
              title: "Laser Focused",
              desc: "Your listing is only shown to developers whose primary stack is Python. No noise, just quality."
            },
            {
              icon: <Globe className="h-6 w-6 text-white" />,
              title: "Global Reach",
              desc: "Our deep location silos ensure your job ranks locally in 50+ international tech hubs."
            },
            {
              icon: <Zap className="h-6 w-6 text-white" />,
              title: "Fast Results",
              desc: "Most listings receive their first qualified candidates within 48 hours of publication."
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + (i * 0.1) }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
            >
              <div className="bg-brand-blue w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-blue/20">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-brand-blue mb-2">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* How it Works / CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-brand-blue rounded-[3rem] p-10 md:p-16 text-white text-center relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MessageSquare className="w-64 h-64" />
          </div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight">Ready to Publish?</h2>
            <p className="text-xl text-white/70 mb-12 max-w-xl mx-auto leading-relaxed">
              Because we manually curate every listing for quality assurance, we handle postings directly through our engineering team.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 mb-8 inline-block text-left">
              <h4 className="text-sm font-bold uppercase tracking-widest text-brand-yellow mb-4">Submission Process:</h4>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow flex-shrink-0" />
                  <span className="text-sm font-medium">Send job details to the address below.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow flex-shrink-0" />
                  <span className="text-sm font-medium">Include Title, Level, Salary, and Apply Link.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-brand-yellow flex-shrink-0" />
                  <span className="text-sm font-medium">Listing goes live within 12-24 hours.</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-6">
              <a 
                href="mailto:sakibabdurrahman403@gmail.com"
                className="group bg-brand-yellow text-brand-blue px-10 py-5 rounded-full font-black text-xl flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-xl"
              >
                <Mail className="h-6 w-6" />
                sakibabdurrahman403@gmail.com
                <Send className="h-5 w-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </a>
              <p className="text-xs font-bold text-white/40 uppercase tracking-[0.3em]">No Registration Required • Direct Support</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
