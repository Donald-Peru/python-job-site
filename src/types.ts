export interface Job {
  id: string;
  job_title: string;
  company_id: string;
  company_name: string;
  company_logo_url?: string;
  company_website?: string;
  job_description: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  work_setup: 'Remote' | 'Onsite' | 'Hybrid';
  seniority_level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Manager';
  country_id: string;
  state_id?: string;
  city_id: string;
  address_country_code: string;
  apply_link?: string;
  apply_email?: string;
  slug: string;
  published_date: any;
  expiry_date: any;
  is_active: boolean;
  is_featured: boolean;
  is_approved: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: any;
}

export interface Company {
  id: string;
  company_name: string;
  slug: string;
  logo_url?: string;
  website_url?: string;
  description: string;
  founded_year?: number;
  company_size: string;
  industry: string;
  company_type: 'Organization' | 'LocalBusiness';
  country: string;
  is_published: boolean;
}

export interface Location {
  id: string;
  name: string;
  slug: string;
  type: 'country' | 'state' | 'city';
  parent_id?: string;
  job_count: number;
}
