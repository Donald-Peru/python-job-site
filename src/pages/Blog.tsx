import React from 'react';
import { Calendar, User, ArrowRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Blog() {
  const posts = [
    { 
      title: "Mastering Python for the 2026 Job Market", 
      excerpt: "The landscape of Python development is shifting toward AI-integrated systems and complex data engineering. Here is what you need to know.", 
      date: "April 15, 2026",
      category: "Career",
      author: "Alex Rivers"
    },
    { 
      title: "Top 10 Django Libraries for High-Scale Apps", 
      excerpt: "When building production-grade web applications with Django, these libraries will save you hundreds of hours of development time.", 
      date: "April 10, 2026",
      category: "Technical",
      author: "Sarah Chen"
    },
    { 
      title: "Remote Python Jobs: A Global Overview", 
      excerpt: "Detailed analysis of remote hiring trends across USA, UK, and India for Python developers in the current fiscal year.", 
      date: "April 05, 2026",
      category: "Industry",
      author: "Markus Volter"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-16 text-center">
           <h1 className="text-sm font-bold text-brand-blue uppercase tracking-[0.3em] mb-4">Python Resources</h1>
           <div className="text-4xl md:text-6xl font-bold text-brand-blue tracking-tight leading-tight">Developer Blog</div>
           <p className="mt-6 max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
             Insights, tutorials, and career advice from industry experts to help you excel in the Python ecosystem.
           </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.title} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col">
              <div className="h-48 bg-brand-blue overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-teal-900 opacity-80" />
                <BookOpen className="absolute inset-0 m-auto h-16 w-16 text-brand-yellow/20" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-brand-yellow text-brand-blue text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {post.date}</span>
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> {post.author}</span>
                </div>
                <h2 className="text-2xl font-bold text-brand-blue mb-4 group-hover:text-brand-blue/80 transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                  {post.excerpt}
                </p>
                <div className="mt-auto">
                  <button className="text-brand-blue font-bold text-sm uppercase tracking-wider flex items-center gap-2 group-hover:gap-4 transition-all">
                    Read More <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
