import React, { useState } from 'react';
import { HelpCircle, ChevronRight, BookOpen, Brain, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const questions = {
  entry: [
    {
      q: "What are the common built-in data types in Python?",
      a: "Python has several built-in data types, including: Numeric Types (int, float, complex), Sequence Types (list, tuple, range), Text Type (str), Binary Types (bytes, bytearray, memoryview), Mapping Type (dict), Set Types (set, frozenset), and Boolean Type (bool)."
    },
    {
      q: "What is the difference between a list and a tuple?",
      a: "The primary difference is mutability. Lists are mutable (can be changed after creation), while tuples are immutable (cannot be changed). Lists are defined with square brackets [], and tuples with parentheses ()."
    },
    {
      q: "What is PEP 8?",
      a: "PEP 8 is the Style Guide for Python Code. It provides guidelines and best practices on how to write Python code to improve its readability and consistency."
    }
  ],
  mid: [
    {
      q: "What is a decorator and how do you use it?",
      a: "A decorator is a design pattern in Python that allows a user to add new functionality to an existing object without modifying its structure. Decorators are usually called before the definition of a function you want to decorate."
    },
    {
      q: "Explain the difference between deep and shallow copy.",
      a: "A shallow copy creates a new object but fills it with references to the original child objects. A deep copy creates a new object and recursively adds copies of the child objects, making it completely independent of the original."
    },
    {
      q: "What are *args and **kwargs?",
      a: "*args allows a function to accept any number of positional arguments, while **kwargs allows a function to accept any number of keyword arguments. They are useful when the number of arguments is not known in advance."
    }
  ],
  senior: [
    {
      q: "How does Python's Memory Management work?",
      a: "Python uses a private heap to manage memory. All Python objects and data structures are located in this private heap. The programmer does not have access to this heap; it's managed by the Python interpreter. Python also uses a built-in garbage collector that recycles unused memory."
    },
    {
      q: "Explain Global Interpreter Lock (GIL).",
      a: "The GIL is a mutex that protects access to Python objects, preventing multiple threads from executing Python bytecodes at once. This lock is necessary because CPython's memory management is not thread-safe. While it limits true multi-core parallel execution of threads, it simplifies many aspects of the language."
    },
    {
      q: "What is the difference between __str__ and __repr__?",
      a: "__repr__ is intended to provide an unambiguous representation of an object and is mostly used for debugging. __str__ is intended to provide a readable representation of an object for end-users."
    }
  ]
};

export default function InterviewQuestions() {
  const [activeTab, setActiveTab] = useState<'entry' | 'mid' | 'senior'>('entry');
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-16 text-center">
           <h1 className="text-sm font-bold text-brand-blue uppercase tracking-[0.3em] mb-4">Preparation Protocol</h1>
           <div className="text-4xl md:text-6xl font-bold text-brand-blue tracking-tight leading-tight">Python Interview Intel</div>
           <p className="mt-6 max-w-2xl mx-auto text-slate-500 font-medium leading-relaxed">
             Curated technical questions and expert answers categorized by seniority level to help you clear your next Python interview.
           </p>
        </div>

        {/* Level Tabs */}
        <div className="flex p-1 bg-white rounded-2xl border border-slate-200 mb-12 shadow-sm">
          {(['entry', 'mid', 'senior'] as const).map((level) => (
            <button
              key={level}
              onClick={() => {
                setActiveTab(level);
                setExpandedIdx(null);
              }}
              className={`flex-1 py-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                activeTab === level 
                ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                : 'text-slate-400 hover:text-brand-blue'
              }`}
            >
              {level === 'entry' && 'Entry Level'}
              {level === 'mid' && 'Mid Level'}
              {level === 'senior' && 'Senior Python'}
            </button>
          ))}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {questions[activeTab].map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all hover:border-brand-blue/30"
                >
                  <button 
                    onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                    className="w-full text-left p-6 md:p-8 flex items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">
                        <HelpCircle className="h-5 w-5 text-brand-blue" />
                      </div>
                      <span className="text-lg font-bold text-brand-blue leading-tight">{item.q}</span>
                    </div>
                    <ChevronRight className={`h-5 w-5 text-slate-400 transition-transform ${expandedIdx === idx ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {expandedIdx === idx && (
                    <div className="px-8 pb-8 md:px-14 md:pb-10">
                      <div className="p-6 bg-slate-50 rounded-2xl border-l-4 border-brand-yellow">
                        <p className="text-slate-600 font-medium leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="mt-20 p-12 bg-brand-blue rounded-3xl text-white text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain className="w-24 h-24" />
          </div>
          <h3 className="text-2xl font-bold mb-4 relative z-10">Ready to test your skills?</h3>
          <p className="text-white/70 mb-8 max-w-md mx-auto relative z-10">
            Apply for positions where these questions are actually asked. 
            Find your next Python role today.
          </p>
          <button className="bg-brand-yellow text-brand-blue px-10 py-4 rounded-full font-bold hover:shadow-lg transition-all relative z-10">
            Browse Python Jobs
          </button>
        </div>
      </div>
    </div>
  );
}
