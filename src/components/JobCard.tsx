import { MapPin, Briefcase, Globe, Clock, ChevronRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { format } from 'date-fns';

import { slugifyLocation } from '../lib/utils';

export default function JobCard({ job }: { job: Job }) {
  // slug = job-title-company-name-publishdate
  // Silo: /country/state/city/slug
  const countrySlug = slugifyLocation(job.country_id);
  const stateSlug = slugifyLocation(job.state_id || 'all');
  const citySlug = slugifyLocation(job.city_id);
  
  const jobPath = `/${countrySlug}/${stateSlug}/${citySlug}/${job.slug}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-brand-blue hover:shadow-xl transition-all group">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start space-x-6">
          <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-xl p-2 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue transition-colors duration-300">
            {job.company_logo_url ? (
              <img src={job.company_logo_url} alt={job.company_name} className="h-full w-full object-contain group-hover:brightness-0 group-hover:invert transition-all" referrerPolicy="no-referrer" />
            ) : (
              <Building2 className="h-8 w-8 text-brand-blue group-hover:text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-xs font-bold text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded uppercase tracking-wider">
                {job.work_setup}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                {job.seniority_level}
              </span>
            </div>
            <h3 className="text-xl font-bold text-brand-gray group-hover:text-brand-blue transition-colors">
              <Link to={jobPath}>{job.job_title}</Link>
            </h3>
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3">
              <span className="text-sm font-semibold text-slate-600 flex items-center">
                <Globe className="h-4 w-4 mr-2 text-brand-blue" />
                {job.company_name}
              </span>
              <Link 
                to={`/${countrySlug}/${stateSlug}/${citySlug}`}
                className="text-sm font-semibold text-slate-500 flex items-center hover:text-brand-blue transition-colors"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {job.city_id}, {job.country_id.toUpperCase()}
              </Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Clock className="h-3 w-3" />
              Posted {job.published_date ? format(new Date(job.published_date?.seconds * 1000), 'MMM dd') : 'Today'}
            </span>
            <span className="text-brand-yellow font-bold text-sm mt-1">NEW</span>
          </div>
          <Link
            to={jobPath}
            className="px-6 py-3 bg-brand-blue text-white rounded-full text-sm font-bold hover:bg-brand-blue/90 transition-all flex items-center gap-2 group/btn"
          >
            Details
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}

