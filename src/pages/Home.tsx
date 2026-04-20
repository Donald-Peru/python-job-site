import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Briefcase, Globe, Loader2, Target, Users, Zap } from 'lucide-react';
import JobCard from '../components/JobCard';
import { collection, query, where, getDocs, limit, count, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';
import { motion } from 'motion/react';
import { format } from 'date-fns';

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ jobsCount: 0, locationsCount: 50 });
  const [filters, setFilters] = useState({
    title: '',
    seniority: 'All Levels',
    country: 'All Countries',
    workSetup: 'All Types'
  });

  async function fetchJobs(isInitial = false) {
    setLoading(true);
    try {
      const jobsRef = collection(db, 'jobs');
      
      if (isInitial) {
        const countSnapshot = await getCountFromServer(jobsRef);
        setStats(prev => ({ ...prev, jobsCount: countSnapshot.data().count }));
      }

      let q = query(jobsRef, where('is_active', '==', true), limit(30));
      
      // Firestore doesn't support partial string match well without external services
      // We'll do basic equality for country and setup, and client-side for title
      if (filters.country !== 'All Countries') {
        q = query(q, where('country_id', '==', filters.country.toUpperCase()));
      }
      if (filters.workSetup !== 'All Types') {
        q = query(q, where('work_setup', '==', filters.workSetup));
      }

      const snapshot = await getDocs(q);
      let jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
      
      // Client side post-processing
      if (filters.title) {
        const term = filters.title.toLowerCase();
        jobList = jobList.filter(j => 
          j.job_title.toLowerCase().includes(term) || 
          j.company_name.toLowerCase().includes(term)
        );
      }
      
      if (filters.seniority !== 'All Levels') {
        jobList = jobList.filter(j => j.seniority_level === filters.seniority);
      }

      setJobs(jobList);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchJobs(true);
  }, []);

  const handleFilter = () => {
    fetchJobs();
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://python-example.com",
    "name": "Python Job Board",
    "description": "The Dedicated Platform for Python Developers Seeking Global Opportunities.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://python-example.com/#/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "url": "https://python-example.com",
    "logo": "https://python-example.com/logo.png",
    "name": "Python Job Board",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-555-PYTHON",
      "contactType": "customer service"
    }
  };

  return (
    <div className="bg-bg-light min-h-screen font-sans">
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      
      {/* Hero Section */}
      <section className="py-24 text-center" style={{backgroundColor: '#1E1E1E'}}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 font-mono tracking-tight whitespace-nowrap">
  <span style={{color: '#DCDCAA'}}>print</span>
  <span style={{color: '#D4D4D4'}}>(</span>
  <span style={{color: '#CE9178'}}>"You Are Hired!"</span>
  <span style={{color: '#D4D4D4'}}>)</span>
</h1>
            <p className="text-white/80 text-xl font-medium max-w-2xl mx-auto mb-8">
              The Dedicated Platform for Python Developers Seeking Global Opportunities.
            </p>
            <div className="flex justify-center gap-4">
              <a href="#jobs" className="bg-brand-yellow text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-white transition-colors">
                Find Python Jobs
              </a>
              <a href="/about" className="text-white border border-white/30 px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors">
                Learn More
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Use Section */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-brand-blue mb-4">Why Use Python Job Board?</h2>
            <p className="text-slate-500 text-lg">
              On this site you see at least 100 new python jobs everyday from 50+ Different Locations around the world.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="bg-brand-blue w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Targeted Tech</h3>
              <p className="text-slate-500">Purely dedicated to Python jobs. No noise, just relevant Python-centric opportunities.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="bg-brand-yellow w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Globe className="text-brand-blue w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Global Reach</h3>
              <p className="text-slate-500">Find remote, onsite, and hybrid roles from USA, India, Canada, UK, and beyond.</p>
            </div>
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
              <div className="bg-brand-blue w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                <Users className="text-white w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">Community Hub</h3>
              <p className="text-slate-500">More than a job board—access interview guides, blogs, and courses to boost your career.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section id="jobs" className="sticky top-20 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Job Title</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Senior Backend Engineer" 
                  value={filters.title}
                  onChange={(e) => setFilters({...filters, title: e.target.value})}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Seniority</label>
              <select 
                value={filters.seniority}
                onChange={(e) => setFilters({...filters, seniority: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors"
              >
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Python Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</label>
              <select 
                value={filters.country}
                onChange={(e) => setFilters({...filters, country: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors"
              >
                <option>All Countries</option>
                <option>USA</option>
                <option>India</option>
                <option>Canada</option>
                <option>UK</option>
                <option>Europe</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Setup</label>
              <select 
                value={filters.workSetup}
                onChange={(e) => setFilters({...filters, workSetup: e.target.value})}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-brand-blue transition-colors"
              >
                <option>All Types</option>
                <option>Remote</option>
                <option>Onsite</option>
                <option>Hybrid</option>
              </select>
            </div>
            <div className="pb-0.5">
              <button 
                onClick={handleFilter}
                className="w-full bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-brand-blue/90 transition-colors"
              >
                Filter Jobs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-8 gap-4 border-l-4 border-brand-yellow pl-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-brand-blue">
              {stats.jobsCount} Python Jobs Listed
            </h2>
            <p className="text-slate-500 font-medium">
              From {stats.locationsCount}+ International Locations
            </p>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full">
            Last Updated: {format(new Date(), 'MMMM dd, yyyy')}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Loader2 className="h-10 w-10 text-brand-blue animate-spin mb-4" />
            <p className="font-bold text-brand-gray">Fetching current opportunities...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobs.map(job => (
              <div key={job.id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 shadow-inner">
            <Briefcase className="h-16 w-16 text-slate-200 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-brand-blue mb-2">No Jobs Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-8">We couldn't find any Python jobs matching your current search criteria.</p>
            <button className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blue/90">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Floating post job CTA */}
        <div className="mt-20 p-12 bg-white rounded-3xl border border-slate-200 shadow-xl relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Zap className="w-64 h-64 text-brand-yellow" />
          </div>
          <h2 className="text-3xl font-bold text-brand-blue mb-4">Hiring Python Talent?</h2>
          <p className="text-slate-500 text-lg mb-8 max-w-2xl mx-auto">
            Connect with thousands of dedicated Python developers worldwide. Our specialized board ensures your listing reaches the right eyes.
          </p>
          <Link to="/publish-a-job" className="inline-block bg-brand-yellow text-brand-blue px-10 py-4 rounded-full font-bold text-lg hover:shadow-lg transition-all">
            Post a Python Job Today
          </Link>
        </div>
      </main>
    </div>
  );
}

