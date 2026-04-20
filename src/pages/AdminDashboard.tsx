import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { Job } from '../types';
import { 
  Shield, LogIn, LogOut, Trash2, Eye, EyeOff, 
  CheckCircle, Clock, AlertCircle, Loader2, Plus, LayoutDashboard, FileText, Settings, ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';

import { slugifyLocation } from '../lib/utils';
import { handleFirestoreError } from '../lib/firestoreErrors';

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          setIsAdminUser(true);
            fetchJobs();
        } catch (error) {
          console.error("Error checking admin status:", error);
          setIsAdminUser(false);
          setLoading(false);
        }
      } else {
        setIsAdminUser(false);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'jobs'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const jobsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Job[];
      setJobs(jobsData);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => signOut(auth);

  const toggleVisibility = async (jobId: string, currentStatus: boolean) => {
    setActionLoading(jobId);
    try {
      const jobRef = doc(db, 'jobs', jobId);
      await updateDoc(jobRef, { is_active: !currentStatus });
      setJobs(jobs.map(j => j.id === jobId ? { ...j, is_active: !currentStatus } : j));
    } catch (error) {
      handleFirestoreError(error, 'update', `jobs/${jobId}`);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to remove this job listing?")) return;
    setActionLoading(jobId);
    try {
      await deleteDoc(doc(db, 'jobs', jobId));
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (error) {
      handleFirestoreError(error, 'delete', `jobs/${jobId}`);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
      </div>
    );
  }

  if (!user || !isAdminUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white border border-slate-200 p-12 text-center rounded-3xl shadow-xl"
        >
          <div className="w-20 h-20 bg-brand-blue rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-brand-blue/20">
            <Shield className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-brand-blue mb-4 tracking-tight">Admin Gateway</h1>
          <p className="text-slate-500 mb-10 font-medium whitespace-pre-line">
            {user 
              ? `Authorized Access ONLY.\nYour account (${user.email}) does not have administrative privileges.`
              : 'Access restricted to verified \nPython Job Board administrators.'}
          </p>
          {!user ? (
            <button 
              onClick={login}
              className="w-full py-4 bg-brand-blue text-white font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-blue/90 transition-all shadow-lg shadow-brand-blue/10"
            >
              <LogIn className="h-5 w-5" />
              Sign in with Google
            </button>
          ) : (
            <button 
              onClick={logout}
              className="w-full py-4 border border-brand-blue text-brand-blue font-bold rounded-2xl flex items-center justify-center gap-4 hover:bg-brand-blue/5 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-brand-blue" />
              <span className="font-bold text-brand-blue uppercase tracking-widest text-sm">Dashboard</span>
            </div>
            <nav className="flex gap-4">
              <Link to="/admin" className="px-4 py-2 bg-slate-100 rounded-lg text-xs font-bold text-brand-blue flex items-center gap-2">
                <LayoutDashboard className="h-3 w-3" /> LISTINGS
              </Link>
              <Link to="/admin/publish" className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                <Plus className="h-3 w-3" /> PUBLISH
              </Link>
              <Link to="/admin/blogs" className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg flex items-center gap-2 transition-colors">
                <FileText className="h-3 w-3" /> BLOGS
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 truncate max-w-[150px]">{user.email}</span>
            <button 
              onClick={logout}
              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-brand-blue mb-4 tracking-tight">Manage Job Listings</h1>
            <p className="text-slate-500 font-medium max-w-xl">
              Add, update, or remove Python job positions across all supported global nodes.
            </p>
          </div>
          <Link 
            to="/admin/publish"
            className="bg-brand-yellow text-brand-blue px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Publish New Job
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <Loader2 className="h-10 w-10 text-brand-blue animate-spin" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Records...</span>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Position</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-bold text-brand-blue mb-1">{job.job_title}</div>
                        <div className="text-xs font-bold text-slate-400 flex items-center gap-2">
                          {job.company_name} <span className="text-[10px] opacity-50 px-1 border border-slate-200 rounded">{job.slug}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="text-sm font-semibold text-slate-600">{job.city_id}</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.country_id}</div>
                      </td>
                      <td className="px-8 py-6">
                        {job.is_active ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-bold">
                            <CheckCircle className="h-3 w-3" /> LIVE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-400 rounded-full text-xs font-bold">
                            <Clock className="h-3 w-3" /> HIDDEN
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <Link 
                            to={`/${slugifyLocation(job.country_id)}/${slugifyLocation(job.state_id || 'all')}/${slugifyLocation(job.city_id)}/${job.slug}`}
                            className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-all"
                            title="View on Site"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Link>
                          <button 
                            onClick={() => toggleVisibility(job.id!, !!job.is_active)}
                            disabled={!!actionLoading}
                            className="p-2 text-slate-400 hover:text-brand-blue hover:bg-slate-100 rounded-lg transition-all"
                          >
                            {actionLoading === job.id ? <Loader2 className="h-4 w-4 animate-spin" /> : job.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                          <button 
                            onClick={() => deleteJob(job.id!)}
                            disabled={!!actionLoading}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {jobs.length === 0 && (
                <div className="py-32 text-center">
                  <AlertCircle className="h-16 w-16 text-slate-200 mx-auto mb-6" />
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No job listings found.</p>
                  <Link to="/admin/publish" className="text-brand-blue mt-4 inline-block font-bold hover:underline">
                    Create the first listing +
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
