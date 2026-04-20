import { Code2, Link as LinkIcon, Mail, Globe, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Footer() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const interviewLinks = [
    { name: 'Python Interview Questions (Entry Level)', href: '/python-interview-questions' },
    { name: 'Python Interview Questions (Mid Level)', href: '/python-interview-questions' },
    { name: 'Python Interview Questions (Senior Level)', href: '/python-interview-questions' },
  ];

  const countryLinks = [
    { name: 'Python Jobs in USA', href: '/usa' },
    { name: 'Python Jobs in India', href: '/india' },
    { name: 'Python Jobs in Canada', href: '/canada' },
    { name: 'Python Jobs in UK', href: '/uk' },
    { name: 'Python Jobs in Europe', href: '/europe' },
  ];

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-brand-gray">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="bg-brand-blue p-2 rounded-lg">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-brand-blue tracking-tight">
                PYTHON <span className="text-brand-gray">JB</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed font-medium">
              Python Jobs Everyday From Almost Everywhere.
            </p>
          </div>

          {/* Column 2: Resources Dropdowns */}
          <div className="space-y-6">
            <div>
              <button 
                onClick={() => toggleDropdown('interview')}
                className="flex items-center justify-between w-full group py-2"
              >
                <span className="font-bold text-sm uppercase tracking-wider">Python Interview Questions</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === 'interview' ? 'rotate-180' : ''}`} />
              </button>
              {activeDropdown === 'interview' && (
                <ul className="mt-2 space-y-2 bg-white p-4 rounded-lg shadow-sm border border-slate-100">
                  {interviewLinks.map((link) => (
                    <li key={link.name}>
                      <Link to={link.href} className="text-sm hover:text-brand-blue transition-colors">
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="pt-2">
              <Link to="/blog" className="font-bold text-sm uppercase tracking-wider block py-2 hover:text-brand-blue">Blogs</Link>
            </div>
            <div>
              <Link to="/python-courses" className="font-bold text-sm uppercase tracking-wider block py-2 hover:text-brand-blue">Python Courses</Link>
            </div>
          </div>

          {/* Column 3: Quick Links & Socials */}
          <div className="space-y-4">
            <Link to="/publish-a-job" className="text-sm font-semibold hover:text-brand-blue block">Post a Python Job</Link>
            <Link to="/contact" className="text-sm font-semibold hover:text-brand-blue block">Contact Us</Link>
            <Link to="/terms" className="text-sm font-semibold hover:text-brand-blue block">Terms and Conditions</Link>
            <div className="flex gap-4 mt-6">
              <a href="#" className="p-2 bg-white rounded-full border border-slate-200 hover:text-brand-blue transition-colors shadow-sm">
                <LinkIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full border border-slate-200 hover:text-brand-blue transition-colors shadow-sm">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 bg-white rounded-full border border-slate-200 hover:text-brand-blue transition-colors shadow-sm">
                <Globe className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Column 4: Location Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Locations</h4>
            <ul className="space-y-3">
              {countryLinks.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm font-semibold hover:text-brand-blue transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 bg-brand-yellow rounded-full"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-slate-200 px-6 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">
          <span>Python Job Board © 2026. All Rights Reserved.</span>
          <div className="flex gap-6">
            <Link to="/admin" className="hover:text-brand-blue">Admin Access</Link>
            <span>Managed from Florida, USA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


