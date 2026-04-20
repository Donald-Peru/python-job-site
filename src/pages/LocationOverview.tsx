import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy, getCountFromServer } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { MapPin, Briefcase, ChevronRight, Loader2, Calendar, Search } from 'lucide-react';
import { format, subDays, isAfter } from 'date-fns';

import DatePicker from 'react-datepicker';
import { COUNTRIES } from '../constants/locations';
import { slugifyLocation } from '../lib/utils';

export default function LocationOverview() {
  const { country, state, city } = useParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [citySearch, setCitySearch] = useState('');
  const [filters, setFilters] = useState({
    seniority: 'All Levels',
    postedOn: 'Anytime'
  });

  // Find exact casing from constants for Firestore querying
  const matchedCountry = COUNTRIES.find(c => slugifyLocation(c.name) === country);
  const displayCountry = matchedCountry?.name || country?.toUpperCase() || '';
  
  const matchedState = matchedCountry?.states.find(s => slugifyLocation(s.name) === state);
  const displayState = matchedState?.name || '';
  
  const displayCity = matchedState?.cities.find(c => slugifyLocation(c) === city) || '';

  useEffect(() => {
    async function fetchLocationData() {
      setLoading(true);
      try {
        const jobsRef = collection(db, 'jobs');
        
        let q = query(
          jobsRef,
          where('is_active', '==', true),
          where('country_id', '==', displayCountry),
          orderBy('published_date', 'desc')
        );

        if (displayState && !displayCity) {
          q = query(
            jobsRef,
            where('is_active', '==', true),
            where('country_id', '==', displayCountry),
            where('state_id', '==', displayState),
            orderBy('published_date', 'desc')
          );
        }

        if (displayCity) {
          q = query(
            jobsRef,
            where('is_active', '==', true),
            where('country_id', '==', displayCountry),
            where('state_id', '==', displayState),
            where('city_id', '==', displayCity),
            orderBy('published_date', 'desc')
          );
        }

        const snapshot = await getDocs(q);
        const jobList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
        
        // Apply client-side filters for more flexibility with date ranges
        let filteredJobs = jobList;
        
        if (filters.seniority !== 'All Levels') {
          filteredJobs = filteredJobs.filter(j => j.seniority_level === filters.seniority);
        }

        if (filters.postedOn !== 'Anytime') {
          const now = new Date();
          filteredJobs = filteredJobs.filter(j => {
            const pubDate = new Date(j.published_date.seconds * 1000);
            if (filters.postedOn === 'Today') return isAfter(pubDate, subDays(now, 1));
            if (filters.postedOn === 'This Week') return isAfter(pubDate, subDays(now, 7));
            if (filters.postedOn === 'Last week') return isAfter(pubDate, subDays(now, 14)) && !isAfter(pubDate, subDays(now, 7));
            if (filters.postedOn === '3 Weeks ago') return isAfter(pubDate, subDays(now, 21)) && !isAfter(pubDate, subDays(now, 14));
            if (filters.postedOn === '4 weeks ago') return isAfter(pubDate, subDays(now, 28)) && !isAfter(pubDate, subDays(now, 21));
            return true;
          });
        }

        if (citySearch) {
          const term = citySearch.toLowerCase();
          filteredJobs = filteredJobs.filter(j => j.city_id.toLowerCase().includes(term));
        }

        setJobs(filteredJobs);
        setTotalCount(filteredJobs.length);
      } catch (error) {
        console.error("Error fetching location data:", error);
      } finally {
        setLoading(false);
      }
    }

    if (country) {
      fetchLocationData();
    }
  }, [country, city, displayCountry, displayCity, filters, citySearch]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Python Jobs", "item": "https://python-example.com" },
      { "@type": "ListItem", "position": 2, "name": displayCountry, "item": `https://python-example.com/#/${country}` },
      state ? { "@type": "ListItem", "position": 3, "name": displayState, "item": `https://python-example.com/#/${country}/${state}` } : null,
      city ? { "@type": "ListItem", "position": 4, "name": displayCity, "item": `https://python-example.com/#/${country}/${state}/${city}` } : null
    ].filter(Boolean)
  };

  return (
    <div className="bg-bg-light min-h-screen pb-20">
      <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <Link to="/" className="hover:text-brand-blue transition-colors">HOME</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={`/${country}`} className="hover:text-brand-blue transition-colors uppercase">{country}</Link>
            {state && (
              <>
                <ChevronRight className="h-3 w-3" />
                <Link to={`/${country}/${state}`} className={`${!city ? 'text-brand-blue' : 'hover:text-brand-blue'} transition-colors uppercase`}>
                  {state}
                </Link>
              </>
            )}
            {city && (
              <>
                <ChevronRight className="h-3 w-3" />
                <span className="text-brand-blue uppercase">{city}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Header Section */}
      <div className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-blue mb-6 leading-tight tracking-tight uppercase">
              Python Jobs in {city ? `${displayCity}, ${displayState}` : state ? displayState : displayCountry}
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium mb-0">
              Explore the latest Python development opportunities in {city ? displayCity : state ? displayState : displayCountry}. 
              Our manual curation process ensures you only see high-quality, relevant roles from top 
              tech companies and innovative startups. Browse through {totalCount} currently open 
              positions and find your next career move in the Python ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <section className="bg-slate-50 border-b border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Seniority Level</label>
              <select 
                value={filters.seniority}
                onChange={(e) => setFilters({...filters, seniority: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-blue transition-colors"
              >
                <option>All Levels</option>
                <option>Entry Level</option>
                <option>Mid Level</option>
                <option>Senior Python Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Posted On</label>
              <select 
                value={filters.postedOn}
                onChange={(e) => setFilters({...filters, postedOn: e.target.value})}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-blue transition-colors"
              >
                <option>Anytime</option>
                <option>Today</option>
                <option>This Week</option>
                <option>Last week</option>
                <option>3 Weeks ago</option>
                <option>4 weeks ago</option>
              </select>
            </div>
            {!city && (
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Filter by City</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Type a city name..."
                    value={citySearch}
                    onChange={(e) => setCitySearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-brand-blue transition-all"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar - Location Navigation */}
          {matchedCountry && (
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-3xl border border-slate-200 p-8 sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto custom-scrollbar">
                <h3 className="text-sm font-bold text-brand-blue uppercase tracking-widest mb-6 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {!state ? 'Silo Regions' : 'Deep Silo: Cities'}
                </h3>
                <nav className="space-y-1">
                  {!state ? (
                    // Country Page: List States
                    matchedCountry.states.map((s) => (
                      <Link
                        key={s.name}
                        to={`/${country}/${slugifyLocation(s.name)}`}
                        className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-brand-blue transition-all"
                      >
                        {s.name}
                      </Link>
                    ))
                  ) : (
                    // State or City Page: List Cities in the current State
                    matchedState?.cities.map((cityName) => (
                      <Link
                        key={cityName}
                        to={`/${country}/${state}/${slugifyLocation(cityName)}`}
                        className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          displayCity === cityName 
                            ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/20' 
                            : 'text-slate-600 hover:bg-slate-50 hover:text-brand-blue'
                        }`}
                      >
                        {cityName}
                      </Link>
                    ))
                  )}
                </nav>
              </div>
            </aside>
          )}

          <div className="flex-grow">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40">
                <Loader2 className="h-10 w-10 text-brand-blue animate-spin mb-4" />
                <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Searching local jobs...</p>
              </div>
            ) : jobs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {jobs.map(job => (
                  <div key={job.id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                <Briefcase className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-brand-blue mb-2">Sector Empty</h3>
                <p className="text-slate-500 max-w-sm mx-auto mb-8">No Python jobs found in {city ? displayCity : displayCountry} for the selected criteria.</p>
                <Link to="/" className="bg-brand-blue text-white px-10 py-4 rounded-full font-bold hover:bg-brand-blue/90 transition-all inline-block">
                  Browse All Jobs
                </Link>
              </div>
            )}

            {/* Sub-region Silo Content Suggestion (Footer Style) */}
            {jobs.length > 0 && (
              <div className="mt-20">
                <h2 className="text-xl font-bold text-brand-blue mb-6">
                  {!state ? `States in ${displayCountry}` : `Cities in ${displayState}`}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {!state ? (
                    // On Country Page: Show States
                    Array.from(new Set(jobs.map(j => j.state_id) as string[]))
                      .filter(Boolean)
                      .map((stateName: string) => (
                        <Link 
                          key={stateName}
                          to={`/${country}/${slugifyLocation(stateName)}`}
                          className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:border-brand-blue hover:text-brand-blue transition-all font-semibold text-sm"
                        >
                          {stateName}
                        </Link>
                      ))
                  ) : !city ? (
                    // On State Page: Show Cities
                    Array.from(new Set(jobs.map(j => j.city_id) as string[]))
                      .map((cityName: string) => (
                        <Link 
                          key={cityName}
                          to={`/${country}/${state}/${slugifyLocation(cityName)}`}
                          className="bg-white p-4 rounded-xl border border-slate-200 text-center hover:border-brand-blue hover:text-brand-blue transition-all font-semibold text-sm"
                        >
                          {cityName}
                        </Link>
                      ))
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
