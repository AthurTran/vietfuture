import React from "react";
import { Rocket, Upload } from "lucide-react";
import "./Hero.css";

function Hero({ onUploadClick }) {
  const scrollToRoadmaps = () => {
    document.getElementById("roadmaps")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="hero-container relative px-6 overflow-hidden">
      {/* Background glow nhiều lớp */}
      <div className="glow glow-1"></div>
      <div className="glow glow-2"></div>

      <div className="relative z-10 w-full flex flex-col items-center text-center">
        {/* Badge */}
        <div className="hero-badge">
          <span className="badge-dot"></span>
          AI-Powered Career Guidance
        </div>

        {/* Title */}
        <h1 className="hero-title">
          <span className="line line-1">Biết chính xác</span>

          <span className="glow-text line line-2">bạn cần học gì</span>

          <span className="hero-sub line line-3">để được tuyển dụng</span>
        </h1>

        {/* Description */}
        <p className="hero-description">
          Upload CV ngay để AI phân tích lỗ hổng kỹ năng và xây dựng lộ trình
          học tập tối ưu dành riêng cho bạn.
        </p>

        {/* Buttons */}
        <div className="hero-actions">
          <button onClick={scrollToRoadmaps} className="btn-primary group">
            <Rocket size={18} className="icon" />
            Khám phá lộ trình
          </button>

          <button onClick={onUploadClick} className="btn-secondary">
            <Upload size={18} className="icon" />
            Upload CV ngay
          </button>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-value">5+</span>
            <span className="stat-label">Lộ trình IT</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">50+</span>
            <span className="stat-label">Kỹ năng được map</span>
          </div>
          <div className="stat-item">
            <span className="stat-value special-color">AI</span>
            <span className="stat-label">Phân tích CV tự động</span>
          </div>
          <div className="stat-item">
            <span className="stat-value special-color">0đ</span>
            <span className="stat-label">Hoàn toàn miễn phí</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
