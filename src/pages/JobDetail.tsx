import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Job } from '../types';
import {
  Loader2, Share2, Globe, MapPin, Building2, Clock,
  DollarSign, Briefcase, ArrowRight, ExternalLink, CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { slugifyLocation } from '../lib/utils';
import JobCard from '../components/JobCard';

export default function JobDetail() {
  const { country, state, city, slug } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [relatedJobs, setRelatedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchJobData() {
      try {
        const q = query(
          collection(db, 'jobs'),
          where('slug', '==', slug),
          limit(1)
        );
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const jobData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Job;
          if (jobData.is_active) {
            setJob(jobData);
            fetchRelatedJobs(jobData);
          }
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchJobData();
  }, [slug]);

  async function fetchRelatedJobs(currentJob: Job) {
    try {
      const q = query(
        collection(db, 'jobs'),
        where('city_id', '==', currentJob.city_id),
        where('is_active', '==', true),
        limit(4)
      );
      const snapshot = await getDocs(q);
      let related = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Job))
        .filter(j => j.id !== currentJob.id);

      if (related.length < 3) {
        const q2 = query(
          collection(db, 'jobs'),
          where('seniority_level', '==', currentJob.seniority_level),
          where('is_active', '==', true),
          limit(6)
        );
        const snapshot2 = await getDocs(q2);
        const extra = snapshot2.docs
          .map(doc => ({ id: doc.id, ...doc.data() } as Job))
          .filter(j => j.id !== currentJob.id && !related.find(r => r.id === j.id));
        related = [...related, ...extra];
      }

      setRelatedJobs(related.slice(0, 3));
    } catch (error) {
      console.error('Error fetching related jobs:', error);
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-bg-light">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin mb-4" />
        <p className="font-bold text-slate-400 uppercase tracking-widest text-xs">Loading Job...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-32 bg-bg-light">
        <h2 className="text-3xl font-bold text-brand-blue mb-4">Job Not Found</h2>
        <p className="text-slate-500 mb-8">This listing may have been removed or expired.</p>
        <Link to="/" className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-blue/90">
          Back to Listings
        </Link>
      </div>
    );
  }

  const publishedDate = job.published_date?.seconds
    ? new Date(job.published_date.seconds * 1000).toISOString()
    : new Date().toISOString();

  const expiryDate = job.expiry_date?.seconds
    ? new Date(job.expiry_date.seconds * 1000).toISOString()
    : job.published_date?.seconds
      ? new Date((job.published_date.seconds + 60 * 24 * 60 * 60) * 1000).toISOString()
      : undefined;

  const jobSchema = {
    '@context': 'https://schema.org/',
    '@type': 'JobPosting',
    title: job.job_title,
    description: job.job_description,
    datePosted: publishedDate,
    validThrough: expiryDate,
    employmentType: job.job_type?.toUpperCase().replace(/\s+/g, '_') || 'FULL_TIME',
    hiringOrganization: {
      '@type': 'Organization',
      name: job.company_name,
      ...(job.company_logo_url && { logo: job.company_logo_url }),
      ...(job.company_website && { url: job.company_website }),
    },
    jobLocation: job.work_setup === 'Remote'
      ? { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: job.address_country_code || job.country_id } }
      : {
        '@type': 'Place',
        address: {
          '@type': 'PostalAddress',
          addressLocality: job.city_id,
          addressRegion: job.state_id,
          addressCountry: job.address_country_code || job.country_id,
        }
      },
    jobLocationType: job.work_setup === 'Remote' ? 'TELECOMMUTE' : undefined,
    ...(job.salary_min && {
      baseSalary: {
        '@type': 'MonetaryAmount',
        currency: job.salary_currency || 'USD',
        value: {
          '@type': 'QuantitativeValue',
          minValue: job.salary_min,
          maxValue: job.salary_max || job.salary_min,
          unitText: 'YEAR',
        },
      },
    }),
    directApply: !!job.apply_link,
  };

  const jobCountrySlug = slugifyLocation(job.country_id);
  const jobStateSlug = slugifyLocation(job.state_id || 'all');
  const jobCitySlug = slugifyLocation(job.city_id);

  const publishedFormatted = job.published_date?.seconds
    ? format(new Date(job.published_date.seconds * 1000), 'MMMM d, yyyy')
    : 'Recently';

  return (
    <div className="bg-bg-light min-h-screen pb-24">
      <script type="application/ld+json">{JSON.stringify(jobSchema)}</script>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 flex-wrap">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <ChevronRight />
            <Link to={`/${jobCountrySlug}`} className="hover:text-brand-blue transition-colors">{job.country_id}</Link>
            <ChevronRight />
            {job.state_id && (
              <>
                <Link to={`/${jobCountrySlug}/${jobStateSlug}`} className="hover:text-brand-blue transition-colors">{job.state_id}</Link>
                <ChevronRight />
              </>
            )}
            <Link to={`/${jobCountrySlug}/${jobStateSlug}/${jobCitySlug}`} className="hover:text-brand-blue transition-colors">{job.city_id}</Link>
            <ChevronRight />
            <span className="text-brand-blue truncate max-w-[180px]">{job.job_title}</span>
          </nav>
        </div>
      </div>

      {/* Hero Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">
            <div className="flex items-start gap-6">
              <div className="h-20 w-20 bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-center flex-shrink-0 shadow-sm">
                {job.company_logo_url
                  ? <img src={job.company_logo_url} alt={job.company_name} className="h-full w-full object-contain" referrerPolicy="no-referrer" />
                  : <Building2 className="h-10 w-10 text-brand-blue" />
                }
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{job.seniority_level}</span>
                  <span className="bg-brand-yellow text-brand-blue text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{job.work_setup}</span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">{job.job_type}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-brand-blue tracking-tight mb-3">{job.job_title}</h1>
                <div className="flex flex-wrap items-center gap-5 text-slate-500 font-semibold text-sm">
                  <span className="flex items-center gap-2"><Globe className="h-4 w-4 text-brand-blue" />{job.company_name}</span>
                  <Link to={`/${jobCountrySlug}/${jobStateSlug}/${jobCitySlug}`} className="flex items-center gap-2 hover:text-brand-blue transition-colors">
                    <MapPin className="h-4 w-4 text-brand-blue" />{job.city_id}, {job.country_id.toUpperCase()}
                  </Link>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-blue" />Posted {publishedFormatted}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[190px]">
              {job.apply_link
                ? <a href={job.apply_link} target="_blank" rel="noreferrer" className="px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-center hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all flex items-center justify-center gap-2">
                    Apply Now <ExternalLink className="h-4 w-4" />
                  </a>
                : job.apply_email
                  ? <a href={`mailto:${job.apply_email}`} className="px-8 py-4 bg-brand-blue text-white rounded-full font-bold text-center hover:bg-brand-blue/90 shadow-lg transition-all">
                      Apply via Email
                    </a>
                  : null
              }
              <button onClick={handleShare} className="px-8 py-3 border border-slate-200 text-slate-500 rounded-full font-bold text-sm hover:border-brand-blue hover:text-brand-blue transition-all flex items-center justify-center gap-2">
                {copied ? <><CheckCircle className="h-4 w-4 text-green-500" /> Copied!</> : <><Share2 className="h-4 w-4" /> Share Job</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 mt-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-sm">
            <h2 className="text-2xl font-bold text-brand-blue mb-6 pb-4 border-b border-slate-100">Job Description</h2>
            <div
             className="leading-relaxed text-slate-600 quill-content prose prose-slate max-w-none break-words overflow-hidden"
              dangerouslySetInnerHTML={{ __html: job.job_description }}
            />
          </div>

          {(job.apply_link || job.apply_email) && (
            <div className="bg-brand-blue rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-white font-bold text-lg">Interested in this role?</p>
                <p className="text-white/70 text-sm mt-1">Apply directly and take the next step in your Python career.</p>
              </div>
              {job.apply_link
                ? <a href={job.apply_link} target="_blank" rel="noreferrer" className="bg-brand-yellow text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-white transition-all whitespace-nowrap flex items-center gap-2">
                    Apply Now <ArrowRight className="h-4 w-4" />
                  </a>
                : <a href={`mailto:${job.apply_email}`} className="bg-brand-yellow text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-white transition-all whitespace-nowrap">
                    Apply via Email
                  </a>
              }
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-brand-blue p-7 rounded-3xl text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Briefcase className="w-24 h-24" />
            </div>
            <h3 className="text-lg font-bold mb-5 relative z-10 font-mono">Job Summary</h3>
            <div className="space-y-4 relative z-10">
              {[
                { label: 'Company', value: job.company_name },
                { label: 'Location', value: `${job.city_id}, ${job.country_id}` },
                { label: 'Job Type', value: job.job_type },
                { label: 'Work Setup', value: job.work_setup },
                { label: 'Experience', value: job.seniority_level },
                ...(job.salary_min ? [{
                  label: 'Salary',
                  value: job.salary_max
                    ? `${job.salary_currency} ${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`
                    : `${job.salary_currency} ${job.salary_min.toLocaleString()}+`
                }] : []),
              ].map((item, idx) => (
                <div key={idx} className="border-b border-white/10 pb-3">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-white/50 block mb-1">{item.label}</span>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-brand-blue mb-4 uppercase tracking-widest text-xs">Browse More Jobs</h3>
            <div className="space-y-2">
              <Link to={`/${jobCountrySlug}/${jobStateSlug}/${jobCitySlug}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-sm font-semibold text-slate-600 group-hover:text-brand-blue flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-brand-blue" /> Python Jobs in {job.city_id}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-blue" />
              </Link>
              <Link to={`/${jobCountrySlug}`} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-sm font-semibold text-slate-600 group-hover:text-brand-blue flex items-center gap-2">
                  <Globe className="h-4 w-4 text-brand-blue" /> Python Jobs in {job.country_id}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-blue" />
              </Link>
              <Link to="/" className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                <span className="text-sm font-semibold text-slate-600 group-hover:text-brand-blue flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-brand-blue" /> All Python Jobs
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-brand-blue" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {relatedJobs.length > 0 && (
        <div className="max-w-5xl mx-auto px-6 mt-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-brand-blue">Similar Python Jobs</h2>
            <Link to={`/${jobCountrySlug}/${jobStateSlug}/${jobCitySlug}`} className="text-sm font-bold text-brand-blue hover:underline flex items-center gap-1">
              View all in {job.city_id} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {relatedJobs.map(relatedJob => (
              <JobCard key={relatedJob.id} job={relatedJob} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ChevronRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}