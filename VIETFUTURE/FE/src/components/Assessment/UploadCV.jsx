import React, { useState, useRef, useEffect } from "react";
// 🛠️ IMPORT: Điều hướng trang trong React Router
import { useNavigate } from "react-router-dom";
import { UploadCloud, FileText, X, CheckCircle2, BrainCircuit } from "lucide-react";

function UploadCV({ onClose }) {
  // 🛠️ KHỞI TẠO: Hook điều hướng điều hướng
  const navigate = useNavigate();

  // --- HỆ THỐNG TRẠNG THÁI (STATES) ---
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Chọn vị trí/CV, 2: AI đang đọc, 3: Đánh giá
  const fileRef = useRef(null);

  // 🛠️ STATE HIỆU ỨNG CHUYỂN TRANG
  const [isAnimate, setIsAnimate] = useState(false);

  useEffect(() => {
    // Auth Guard: Only allow logged-in users
    const storedUser = localStorage.getItem("user") || localStorage.getItem("devpath_user");
    if (!storedUser) {
      alert("Vui lòng đăng nhập để có thể tải lên CV và trải nghiệm tính năng này.");
      navigate("/login");
      return;
    }

    // Đưa màn hình lên đầu trang khi vào
    window.scrollTo(0, 0);
    // Kích hoạt hiệu ứng xuất hiện mượt mà sau 50ms
    const animationTimeout = setTimeout(() => {
      setIsAnimate(true);
    }, 50);
    return () => clearTimeout(animationTimeout);
  }, [navigate]);

  // Danh sách 8 ngành nghề chuẩn của hệ thống
  const roles = [
    "Frontend Engineer",
    "Backend Engineer",
    "Fullstack Engineer",
    "Data AI / ML",
    "Mobile App Dev",
    "DevOps Engineer",
    "Cyber Security",
    "UI/UX Designer"
  ];

  // Định dạng hiển thị dung lượng file
  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  // Logic kiểm tra file hợp lệ (Tối đa 20MB)
  const processFile = (file) => {
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      alert("File quá lớn (tối đa 20MB)");
      return;
    }

    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExt = ['pdf', 'doc', 'docx'].includes(fileExtension);

    if (!validTypes.includes(file.type) && !isValidExt) {
      alert("Chỉ chấp nhận file định dạng PDF hoặc DOCX");
      return;
    }

    setFileName(file.name);
    setFileSize(formatFileSize(file.size));
  };

  const handleFileChange = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleClearFile = (e) => {
    e.stopPropagation();
    setFileName("");
    setFileSize("");
    if (fileRef.current) fileRef.current.value = "";
  };

  // --- 🛠️ HÀM KÍCH HOẠT XỬ LÝ AI & CHUYỂN TIẾP SANG LUỒNG ĐÁNH GIÁ ---
  const handleStartAnalysis = () => {
    if (!fileName || !selectedRole) return;

    setLoading(true);
    setCurrentStep(2); // Chuyển sang bước 2 trên thanh tiến trình: AI đang quét dữ liệu

    // Giả lập AI phân tích cú pháp CV mất 2.5 giây
    setTimeout(() => {
      setLoading(false);

      // Định dạng lại tên role chuẩn hóa để đồng bộ dữ liệu với ngân hàng câu hỏi Test
      let standardizedRole = selectedRole;
      if (selectedRole === "Frontend Engineer") standardizedRole = "Frontend Developer";
      if (selectedRole === "Backend Engineer") standardizedRole = "Backend Developer";

      // 1. Khởi tạo bộ dữ liệu phân tách từ CV dưới dạng Mock Data
      const mockAnalysisResult = {
        role: standardizedRole,
        originalRoleName: selectedRole,
        // AI giả lập tìm thấy một số công nghệ nền tảng sẵn có trong CV của bạn
        skills: ["HTML", "CSS", "JavaScript", "Git Basic", "SQL Cơ bản"],
        // Đây là những node công nghệ còn thiếu để vẽ sơ đồ Timeline cho Roadmap2
        missing: [
          "React.js & Hooks Core",
          "Tailwind CSS nâng cao",
          "TypeScript cơ bản",
          "State Management (Zustand/Redux)",
          "Deploy & Tối ưu hóa SEO sản phẩm"
        ]
      };

      // 2. Lưu trữ tạm thời vào Local Storage để các trang sau kế thừa dữ liệu
      localStorage.setItem("devpath_analysis_result", JSON.stringify(mockAnalysisResult));

      // 3. 🛠️ ĐỔI LUỒNG: Chuyển hướng sang trang làm bài đánh giá năng lực (/assessment)
      navigate("/assessment");
      
    }, 2500);
  };

  // Hàm tính toán class CSS động cho các vòng tròn số của thanh tiến trình
  const getStepClass = (stepNumber) => {
    if (currentStep === stepNumber) {
      return { 
        num: "bg-[#00e5ff] text-[#050a14] border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.4)]", 
        text: "text-white font-bold" 
      };
    }
    if (currentStep > stepNumber) {
      return { num: "bg-[#10b981] border-[#10b981] text-white", text: "text-gray-400" };
    }
    return { num: "bg-[#14223c] border-gray-800 text-gray-500", text: "text-gray-500" };
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      {/* 🛠️ WRAPPER ÁP DỤNG HIỆU ỨNG ANIMATION CHO TOÀN BỘ NỘI DUNG - Thay đổi max-w-[480px] thành max-w-[540px] */}
      <div 
        className={`flex flex-col justify-between flex-1 w-full max-w-[540px] mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
          isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header Logo */}
        <div className="flex w-full items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-wide">
            <span className="text-white">DevPath</span>
            <span className="bg-[#00e5ff] bg-clip-text text-transparent">AI</span>
          </div>
        </div>

        {/* FORM CONTAINER TRUNG TÂM */}
        <div className="flex w-full overflow-hidden rounded-[24px] border border-gray-800/60 bg-[#0a1120] shadow-[0_0_50px_rgba(0,0,0,0.8)] my-auto relative flex-col p-6 sm:p-8">
          
          {/* ✕ Đã loại bỏ nút đóng (onClose) dấu x ở vị trí góc trên bên phải tại đây ✕ */}

          <div className="text-center mb-6">
            <h2 className="text-2xl font-extrabold tracking-tight mb-2">
              Khởi tạo <span className="text-[#00e5ff]">Lộ trình IT</span>
            </h2>
            <p className="text-xs text-[#6b7b96] px-2">
              Tải lên CV của bạn để AI phân tích kỹ năng hiện tại và đề xuất bài đánh giá năng lực phù hợp nhất.
            </p>
          </div>

          {/* THANH TIẾN TRÌNH MINI */}
          <div className="flex items-center justify-between border-b border-gray-800/50 pb-5 mb-5 mx-1">
            {/* Bước 1 */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${getStepClass(1).num}`}>
                {currentStep > 1 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "1"}
              </div>
              <span className={`text-[11px] transition-all ${getStepClass(1).text}`}>Vị trí & CV</span>
            </div>
            
            <div className="w-5 h-[1px] bg-gray-800 shrink-0"></div>

            {/* Bước 2 */}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full border flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${getStepClass(2).num}`}>
                {currentStep > 2 ? <CheckCircle2 className="w-3.5 h-3.5" /> : "2"}
              </div>
              <span className={`text-[11px] transition-all ${getStepClass(2).text}`}>AI quét CV</span>
            </div>

            <div className="w-5 h-[1px] bg-gray-800 shrink-0"></div>

            {/* Bước 3 */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border bg-[#14223c] border-gray-800 text-gray-500 flex items-center justify-center font-bold text-[10px]">
                3
              </div>
              <span className="text-[11px] text-gray-500 flex items-center gap-1">
                Đánh giá kỹ năng
              </span>
            </div>
          </div>

          {/* KHU VỰC NỘI DUNG TƯƠNG TÁC */}
          <div className="w-full flex flex-col justify-center">
            
            {/* TRẠNG THÁI 1: HIỂN THỊ CHỌN FILE VÀ NGÀNH NGHỀ */}
            {!loading && (
              <div className="animate-fade-in flex flex-col gap-5">
                <div>
                  <h3 className="text-xs font-bold mb-2.5 text-[#8ea1bf] uppercase tracking-wider">1. Chọn vị trí muốn hướng tới</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all text-center truncate ${
                          selectedRole === role
                            ? "bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff] font-bold shadow-[inset_0_0_8px_rgba(0,229,255,0.1)]"
                            : "bg-[#0f192e] border-gray-800/80 text-[#8ea1bf] hover:border-gray-700 hover:text-white"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold mb-2.5 text-[#8ea1bf] uppercase tracking-wider">2. Tải hồ sơ (CV) của bạn lên</h3>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => !fileName && fileRef.current.click()}
                    className={`group bg-[#0f192e] border-2 border-dashed rounded-xl p-6 text-center transition-all ${
                      fileName ? "border-[#00e5ff]/40 bg-[#0f192e]" : "border-gray-800/80 cursor-pointer"
                    } ${isDragOver ? "border-[#00e5ff] bg-[#101d36] shadow-[0_0_20px_rgba(0,229,255,0.1)]" : "hover:border-gray-700"}`}
                  >
                    <input
                      type="file"
                      ref={fileRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                    />

                    {!fileName ? (
                      <>
                        <div className="text-[#00e5ff] mb-2 flex justify-center filter drop-shadow-[0_0_6px_rgba(0,229,255,0.3)]">
                          <UploadCloud size={32} />
                        </div>
                        <h4 className="text-sm font-bold mb-1">Kéo thả file CV của bạn vào đây</h4>
                        <p className="text-[11px] text-[#6b7b96]">
                          Hỗ trợ PDF, DOCX (Tối đa 20MB) hoặc <span className="text-[#00e5ff] font-semibold group-hover:underline">nhấp chọn file</span>
                        </p>
                      </>
                    ) : (
                      <div className="flex items-center justify-between bg-[#11203b] border border-[#00e5ff]/40 rounded-lg p-3 text-left">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <FileText className="text-[#00e5ff] shrink-0" size={22} />
                          <div className="overflow-hidden">
                            <div className="text-xs font-bold text-white truncate w-full max-w-[220px]">
                              {fileName}
                            </div>
                            <div className="text-[10px] text-[#6b7b96]">{fileSize}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearFile}
                          className="p-1 rounded-md text-red-500 hover:bg-red-500/10 transition-all shrink-0"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* NÚT SUBMIT */}
                <button
                  type="button"
                  onClick={handleStartAnalysis}
                  disabled={!selectedRole || !fileName}
                  className="w-full bg-[#00e5ff] text-[#050a14] py-3 rounded-xl font-bold text-base shadow-[0_0_20px_rgba(0,229,255,0.2)] hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] transition-all disabled:bg-[#1b2638] disabled:text-[#6b7b96] disabled:shadow-none disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2"
                >
                  Tiến hành quét & Kiểm tra năng lực
                </button>
              </div>
            )}

            {/* TRẠNG THÁI 2: ĐANG TRONG QUÁ TRÌNH LOADING VÙNG XOAY */}
            {loading && (
              <div className="py-10 text-center animate-pulse">
                <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-[#00e5ff] rounded-full animate-spin mx-auto mb-4 shadow-[0_0_15px_rgba(0,229,255,0.2)]"></div>
                <h4 className="text-lg font-bold mb-1 text-[#00e5ff]">AI đang đọc và quét CV...</h4>
                <p className="text-xs text-[#6b7b96]">Hệ thống đang trích xuất từ khóa và thiết lập bài kiểm tra tương ứng.</p>
              </div>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className="flex w-full items-center justify-between text-[10px] text-gray-600 mt-6 px-1">
          <span>DevPath AI</span>
          <span>EAUT · Đội DevPath AI - 2025</span>
        </div>
      </div>
    </div>
  );
}

export default UploadCV;