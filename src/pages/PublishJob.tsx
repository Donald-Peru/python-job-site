import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, getDocs, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { slugify } from '../lib/utils';
import { 
  Terminal, Send, CheckCircle2, Loader2, Info, Building2, MapPin, 
  Globe, DollarSign, Briefcase, Calendar, Link as LinkIcon, 
  Mail, Image as ImageIcon, Search, Layout, Type
} from 'lucide-react';
import { format, addDays } from 'date-fns';
import { handleFirestoreError } from '../lib/firestoreErrors';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { COUNTRIES, CURRENCIES, JOB_TYPES, WORK_SETUPS, SENIORITY_LEVELS } from '../constants/locations';

export default function PublishJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // State for form
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_logo_url: '',
    company_website: '',
    job_description: '',
    salary_min: '',
    salary_max: '',
    salary_currency: 'USD',
    job_type: 'Full-time',
    work_setup: 'Remote',
    seniority_level: 'Mid',
    country_id: 'USA',
    state_id: '',
    city_id: '',
    street_address: '',
    postal_code: '',
    country_code: 'US',
    apply_link: '',
    apply_email: '',
    published_date: new Date(),
    expiry_date: addDays(new Date(), 30),
    slug: '',
    meta_title: '',
    meta_description: '',
    is_active: true
  });

  // Dynamic Location Logic
  const selectedCountry = COUNTRIES.find(c => c.name.toLowerCase() === formData.country_id.toLowerCase());
  const states = selectedCountry?.states || [];
  const selectedState = states.find(s => s.name.toLowerCase() === formData.state_id.toLowerCase());
  const cities = selectedState?.cities || [];

  // Handle auto-slug and auto-meta
  useEffect(() => {
    const dateStr = format(formData.published_date, 'MMM-yyyy').toLowerCase();
    const cityPart = formData.city_id ? slugify(formData.city_id) : 'anywhere';
    const countryPart = slugify(formData.country_id);
    const titlePart = slugify(formData.job_title);
    const companyPart = slugify(formData.company_name);
    
    // Pattern: job-title-company-mmm-yyyy
    const generatedSlug = `${titlePart}-${companyPart}-${dateStr}`;
    
    setFormData(prev => ({
      ...prev,
      slug: generatedSlug,
      meta_title: `${formData.job_title} in ${formData.city_id || formData.country_id} | Python Job Board`,
      meta_description: prev.meta_description || `Apply for the ${formData.job_title} position at ${formData.company_name} in ${formData.city_id || formData.country_id}..`
    }));
  }, [formData.job_title, formData.company_name, formData.city_id, formData.country_id, formData.published_date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addDoc(collection(db, 'jobs'), {
        ...formData,
        salary_min: formData.salary_min ? Number(formData.salary_min) : null,
        salary_max: formData.salary_max ? Number(formData.salary_max) : null,
        published_date: formData.published_date,
        expiry_date: formData.expiry_date,
        created_at: serverTimestamp(),
      });

      setSubmitted(true);
      setTimeout(() => navigate('/admin'), 2000);
    } catch (error) {
      handleFirestoreError(error, 'create', 'jobs');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-32 px-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-slate-100">
          <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-brand-blue mb-4">Transmission Successful</h1>
          <p className="text-slate-500 mb-8 font-medium">
            The job listing has been verified and broadcasted to the network.
          </p>
          <button 
            onClick={() => navigate('/admin')}
            className="w-full bg-brand-blue text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand-blue/20 hover:scale-[1.02] transition-transform"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="mb-12 bg-brand-blue p-10 md:p-14 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
              <Terminal className="w-64 h-64" />
           </div>
           <div className="relative z-10">
             <h1 className="text-xs font-bold uppercase tracking-[0.4em] mb-4 text-brand-yellow/80">Operation: Data Ingestion</h1>
             <div className="text-4xl md:text-6xl font-black tracking-tight leading-tight">Publish a Position</div>
             <p className="mt-6 max-w-xl text-lg font-medium text-white/70 leading-relaxed">
               Deploy high-fidelity Python opportunities to the global index. 
               All fields are optimized for search extraction and local silos.
             </p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section: Basic Identification */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative">
            <div className="absolute top-0 left-12 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              01. Core Identity
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-4">
              <FormGroup label="Job Title" required>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    className="form-input-custom"
                    placeholder="e.g. Senior Python Engineer"
                    value={formData.job_title}
                    onChange={(e) => setFormData({...formData, job_title: e.target.value})}
                  />
                </div>
              </FormGroup>

              <FormGroup label="Company Name" required>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    required
                    type="text" 
                    className="form-input-custom"
                    placeholder="Search or type new..."
                    value={formData.company_name}
                    onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                  />
                </div>
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <FormGroup label="Company Logo URL">
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="url" 
                    className="form-input-custom text-xs"
                    placeholder="https://company.com/logo.png"
                    value={formData.company_logo_url}
                    onChange={(e) => setFormData({...formData, company_logo_url: e.target.value})}
                  />
                </div>
              </FormGroup>
              <FormGroup label="Company Website">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="url" 
                    className="form-input-custom text-xs"
                    placeholder="https://company.com"
                    value={formData.company_website}
                    onChange={(e) => setFormData({...formData, company_website: e.target.value})}
                  />
                </div>
              </FormGroup>
            </div>

            <FormGroup label="Job Description (Rich Text)" required>
              <div className="rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                <ReactQuill 
                  theme="snow"
                  value={formData.job_description}
                  onChange={(val) => setFormData({...formData, job_description: val})}
                  className="bg-white min-h-[300px]"
                />
              </div>
            </FormGroup>
          </div>

          {/* Section: Compensation & Metadata */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative">
            <div className="absolute top-0 left-12 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              02. Specifications
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 mt-4">
              <FormGroup label="Min Salary">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number" 
                    className="form-input-custom no-spinner"
                    placeholder="0"
                    value={formData.salary_min}
                    onChange={(e) => setFormData({...formData, salary_min: e.target.value})}
                  />
                </div>
              </FormGroup>
              <FormGroup label="Max Salary">
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="number" 
                    className="form-input-custom no-spinner"
                    placeholder="0"
                    value={formData.salary_max}
                    onChange={(e) => setFormData({...formData, salary_max: e.target.value})}
                  />
                </div>
              </FormGroup>
              <FormGroup label="Currency">
                <select 
                  className="form-input-custom font-bold"
                  value={formData.salary_currency}
                  onChange={(e) => setFormData({...formData, salary_currency: e.target.value})}
                >
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Job Type">
                <select 
                  className="form-input-custom font-bold"
                  value={formData.job_type}
                  onChange={(e) => setFormData({...formData, job_type: e.target.value})}
                >
                  {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="Work Setup">
                <select 
                  className="form-input-custom font-bold"
                  value={formData.work_setup}
                  onChange={(e) => setFormData({...formData, work_setup: e.target.value})}
                >
                  {WORK_SETUPS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormGroup>
              <FormGroup label="Seniority Level">
                <select 
                  className="form-input-custom font-bold"
                  value={formData.seniority_level}
                  onChange={(e) => setFormData({...formData, seniority_level: e.target.value})}
                >
                  {SENIORITY_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </FormGroup>
            </div>
          </div>

          {/* Section: Location Silo Data */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative">
            <div className="absolute top-0 left-12 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              03. Geographical Silo
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
              <FormGroup label="Country" required>
                <select 
                  className="form-input-custom font-bold"
                  value={formData.country_id}
                  onChange={(e) => {
                    const country = COUNTRIES.find(c => c.name === e.target.value);
                    setFormData({
                      ...formData, 
                      country_id: e.target.value,
                      country_code: country?.code || '',
                      state_id: '',
                      city_id: ''
                    });
                  }}
                >
                  {COUNTRIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </FormGroup>
              
              <FormGroup label="State / Province" required>
                <select 
                  className="form-input-custom font-bold"
                  value={formData.state_id}
                  onChange={(e) => setFormData({...formData, state_id: e.target.value, city_id: ''})}
                >
                  <option value="">Select State</option>
                  {states.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              </FormGroup>

              <FormGroup label="City" required>
                <select 
                  disabled={!cities.length}
                  className="form-input-custom font-bold disabled:opacity-50"
                  value={formData.city_id}
                  onChange={(e) => setFormData({...formData, city_id: e.target.value})}
                >
                  <option value="">{cities.length ? 'Select City' : 'Select State First'}</option>
                  {cities.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormGroup label="Street Address (Schema)">
                <input 
                  type="text" 
                  className="form-input-custom"
                  placeholder="e.g. 123 Tech Lane"
                  value={formData.street_address}
                  onChange={(e) => setFormData({...formData, street_address: e.target.value})}
                />
              </FormGroup>
              <FormGroup label="Postal Code">
                <input 
                  type="text" 
                  className="form-input-custom"
                  placeholder="e.g. 94105"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({...formData, postal_code: e.target.value})}
                />
              </FormGroup>
              <FormGroup label="Country Code">
                <input 
                  type="text" 
                  className="form-input-custom bg-slate-100 uppercase"
                  placeholder="US"
                  readOnly
                  value={formData.country_code}
                />
              </FormGroup>
            </div>
          </div>

          {/* Section: Application & Deployment */}
          <div className="bg-white rounded-[2rem] p-8 md:p-12 border border-slate-200 shadow-sm relative">
            <div className="absolute top-0 left-12 -translate-y-1/2 bg-brand-blue text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              04. Activation Details
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-4">
              <FormGroup label="Apply Link">
                <div className="relative">
                  <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="url" 
                    className="form-input-custom"
                    placeholder="https://..."
                    value={formData.apply_link}
                    onChange={(e) => setFormData({...formData, apply_link: e.target.value})}
                  />
                </div>
              </FormGroup>
              <FormGroup label="Apply Email">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input 
                    type="email" 
                    className="form-input-custom"
                    placeholder="jobs@..."
                    value={formData.apply_email}
                    onChange={(e) => setFormData({...formData, apply_email: e.target.value})}
                  />
                </div>
              </FormGroup>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormGroup label="Published Date">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                  <DatePicker
                    selected={formData.published_date}
                    onChange={(date) => setFormData({...formData, published_date: date || new Date()})}
                    showTimeSelect
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className="form-input-custom pl-10 w-full"
                  />
                </div>
              </FormGroup>
              <FormGroup label="Expiry Date">
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
                  <DatePicker
                    selected={formData.expiry_date}
                    onChange={(date) => setFormData({...formData, expiry_date: date || new Date()})}
                    dateFormat="MMMM d, yyyy"
                    className="form-input-custom pl-10 w-full"
                  />
                </div>
              </FormGroup>
            </div>
          </div>

          {/* Section: SEO & URL SILO */}
          <div className="bg-slate-900 rounded-[2rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative text-white">
            <div className="absolute top-0 left-12 -translate-y-1/2 bg-brand-yellow text-brand-blue px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              05. Semantic SEO
            </div>
            
            <div className="space-y-8 mt-4">
              <FormGroup label="Editable Slug (Auto-Generated)" dark>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-brand-yellow/50" />
                  <input 
                    type="text" 
                    className="form-input-dark pl-10"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <p className="text-[10px] text-brand-yellow/40 mt-1 uppercase font-mono tracking-tighter">
                  pattern: country/city/title-company-date
                </p>
              </FormGroup>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormGroup label="Page Meta Title" dark>
                  <input 
                    type="text" 
                    className="form-input-dark"
                    value={formData.meta_title}
                    onChange={(e) => setFormData({...formData, meta_title: e.target.value})}
                  />
                </FormGroup>
                <FormGroup label="Page Meta Description" dark>
                  <textarea 
                    rows={3}
                    maxLength={320}
                    className="form-input-dark"
                    value={formData.meta_description}
                    onChange={(e) => setFormData({...formData, meta_description: e.target.value})}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-brand-yellow/40 uppercase font-mono">Suggested Extraction</span>
                    <span className="text-[10px] text-brand-yellow font-bold">{formData.meta_description.length}/320</span>
                  </div>
                </FormGroup>
              </div>

              <div className="pt-6 border-t border-white/5">
                <span className="label-caps !text-white/40 block mb-2">Live Preview URL</span>
                <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex items-center gap-3 overflow-hidden">
                  <Globe className="h-4 w-4 text-brand-yellow flex-shrink-0" />
                  <span className="text-xs font-mono text-brand-yellow/80 truncate">
                    https://python-example.com/#/{formData.slug}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 mb-20">
            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white py-8 rounded-[2rem] font-black text-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-brand-blue/30 disabled:opacity-50 group"
            >
              {loading ? <Loader2 className="h-8 w-8 animate-spin" /> : <Send className="h-8 w-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
              EXECUTE PUBLISH
            </button>
            <p className="text-center text-slate-400 text-[10px] mt-8 font-black uppercase tracking-[0.5em]">
              Validated against node schema. All systems go.
            </p>
          </div>
        </form>
      </div>

      <style>{`
        .form-input-custom {
          @apply w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:bg-white focus:border-brand-blue outline-none transition-all text-slate-700 placeholder:text-slate-300;
        }
        .form-input-dark {
          @apply w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm focus:bg-white/10 focus:border-brand-yellow outline-none transition-all text-white placeholder:text-white/20;
        }
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .ql-container.ql-snow {
          @apply border-none !important;
        }
        .ql-toolbar.ql-snow {
          @apply border-none border-b border-slate-100 !important;
        }
        .react-datepicker-wrapper {
          @apply w-full;
        }
      `}</style>
    </div>
  );
}

function FormGroup({ label, children, required, dark }: { label: string, children: React.ReactNode, required?: boolean, dark?: boolean }) {
  return (
    <div className="space-y-2">
      <label className={`label-caps ${dark ? '!text-white/50' : ''}`}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
