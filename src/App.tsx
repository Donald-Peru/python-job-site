import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import JobDetail from './pages/JobDetail';
import PublishJob from './pages/PublishJob';
import PostJobInfo from './pages/PostJobInfo';
import AdminDashboard from './pages/AdminDashboard';
import LocationOverview from './pages/LocationOverview';

import Blog from './pages/Blog';
import InterviewQuestions from './pages/InterviewQuestions';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about-python-job-board" element={<About />} />
          <Route path="/publish-a-job" element={<PostJobInfo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/python-interview-questions" element={<InterviewQuestions />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/publish" element={<PublishJob />} />
          {/* Location Routes */}
          <Route path="/:country" element={<LocationOverview />} />
          <Route path="/:country/:state" element={<LocationOverview />} />
          <Route path="/:country/:state/:city" element={<LocationOverview />} />
          {/* Job Detail Route */}
          <Route path="/:country/:state/:city/:slug" element={<JobDetail />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

