import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seed() {
  const jobs = [
    {
      job_title: "Senior AI Engineer (Python)",
      company_name: "Eventable AI",
      job_description: "We are looking for a Senior Python Developer to lead our AI initiatives. You will be responsible for building scalable data pipelines and integrating LLMs into our core product. Requirements: 5+ years Python, Experience with PyTorch or TensorFlow, Strong background in distributed systems.",
      salary_min: 150000,
      salary_max: 220000,
      salary_currency: "USD",
      job_type: "Full-time",
      work_setup: "Remote",
      seniority_level: "Senior",
      country_id: "USA",
      city_id: "New York",
      address_country_code: "US",
      slug: "usa/new-york/senior-ai-engineer-eventable-ai-apr-2026",
      is_active: true,
      is_approved: true,
      published_date: new Date(),
      created_at: new Date()
    },
    {
      job_title: "Full Stack Python Developer",
      company_name: "FinFlow Solutions",
      job_description: "Join our fintech team to build the future of payments. We use Django, React, and AWS. You will work on high-availability systems managing millions of transactions daily.",
      salary_min: 120000,
      salary_max: 160000,
      salary_currency: "USD",
      job_type: "Full-time",
      work_setup: "Hybrid",
      seniority_level: "Mid",
      country_id: "UK",
      city_id: "London",
      address_country_code: "GB",
      slug: "uk/london/full-stack-python-developer-finflow-apr-2026",
      is_active: true,
      is_approved: true,
      published_date: new Date(),
      created_at: new Date()
    }
  ];

  for (const job of jobs) {
    await addDoc(collection(db, 'jobs'), job);
    console.log(`Seeded: ${job.job_title}`);
  }
}

seed();
