import React from "react"; 
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Hero from "./components/Home/Hero";
import Steps from "./components/Home/Steps";
import Roadmaps from "./components/Roadmap/Roadmaps";
import AllRoadmaps from "./components/Roadmap/AllRoadmaps";
import CTA from "./components/Home/CTA";
import Footer from "./components/Layout/Footer";
import UploadCV from "./components/Assessment/UploadCV"; 
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Roadmap2 from "./components/Roadmap/Roadmap2"; 
import Assessment from "./components/Assessment/Assessment";
import SkillGap from "./components/Assessment/SkillGap";
import Courses from "./components/Roadmap/Courses";
import ProgressTracking from "./components/Roadmap/ProgressTracking";
import AIConsultant from "./components/AI/AIConsultant";
import Admin from "./components/Admin/Admin";
import UserProfile from "./components/User/UserProfile";
import { motion } from "framer-motion";

const fadeUp = {
  initial: { opacity: 0, y: 60 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
  viewport: { once: true }
};

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#080c10] text-white min-h-screen">
      {/* Đồng bộ router /upload */}
      <Navbar onUploadClick={() => navigate("/upload")} onLoginClick={() => navigate("/login")} />
      <Hero onUploadClick={() => navigate("/upload")} />
      
      <motion.div {...fadeUp}><Steps /></motion.div>
      <motion.div {...fadeUp}><Roadmaps /></motion.div>
      <motion.div {...fadeUp}><CTA onUploadClick={() => navigate("/upload")} /></motion.div>
      
      <Footer />
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#080c10] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.08)_0%,transparent_70%)] top-[-100px] left-[-150px] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.1)_0%,transparent_70%)] bottom-[-80px] right-[-100px] pointer-events-none"></div>
      <div className="relative z-10 w-full flex justify-center">
        <Login />
      </div>
    </div>
  );
}

function RegisterPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#080c10] min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)] top-[-100px] right-[-150px] pointer-events-none"></div>
      <div className="absolute w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)] bottom-[-80px] left-[-100px] pointer-events-none"></div>
      <div className="relative z-10 w-full flex justify-center">
        <Register onClose={() => navigate("/")} onRegisterSuccess={() => navigate("/login")} onSwitchToLogin={() => navigate("/login")} />
      </div>
    </div>
  );
}

function UploadCVPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#080c10] min-h-screen">
      {/* Thêm onUploadSuccess: Upload xong -> Tự chuyển hướng sang làm bài Đánh giá kỹ năng */}
      <UploadCV 
        onClose={() => navigate("/")} 
        onUploadSuccess={() => navigate("/assessment")} 
      />
    </div>
  );
}

function AssessmentPage() {
  const navigate = useNavigate();
  return (
    <div className="bg-[#080c10] min-h-screen">
      {/* Đánh giá xong -> Tự chuyển hướng sang trang Lộ trình & Khoảng cách kỹ năng */}
      <Assessment 
        onAssessmentComplete={() => navigate("/roadmap")} 
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/upload" element={<UploadCVPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        
        {/* ĐÃ SỬA: Phục hồi Roadmap2 cho /roadmap theo yêu cầu luồng mới */}
        <Route path="/roadmap" element={<Roadmap2 />} />
        <Route path="/roadmap3" element={<Roadmap2 />} />
        
        <Route path="/all-roadmaps" element={<AllRoadmaps />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/progress" element={<ProgressTracking />} />
        <Route path="/ai-consultant" element={<AIConsultant />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;