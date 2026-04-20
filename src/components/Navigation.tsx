import { useState } from 'react';
import { Menu, X, Code2, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About Python Job Board', href: '/about-python-job-board' },
    { name: 'Locations', href: '/#locations' },
    { name: 'Publish a Python Job', href: '/publish-a-job', primary: true },
    { name: 'Admin', href: '/admin', icon: Shield },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 h-20">
      <div className="max-w-7xl mx-auto px-6 h-full">
        <div className="flex justify-between items-center h-full">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-brand-blue p-2 rounded-lg group-hover:bg-brand-yellow transition-colors duration-300">
                <Code2 className="h-6 w-6 text-white group-hover:text-brand-blue" />
              </div>
              <span className="text-xl font-bold text-brand-blue tracking-tight">
                PYTHON <span className="text-brand-gray">JB</span>
              </span>
            </Link>
            
            {/* Desktop Links */}
            <nav className="hidden md:flex gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "text-sm font-semibold text-brand-gray hover:text-brand-blue transition-colors flex items-center gap-2",
                    link.primary && "bg-brand-blue text-white px-4 py-2 rounded-full hover:bg-brand-blue/90"
                  )}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-brand-gray"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
          >
            <div className="px-6 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={cn(
                    "flex items-center gap-3 text-sm font-semibold py-2",
                    link.primary ? "text-brand-blue" : "text-brand-gray"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

