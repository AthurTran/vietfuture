import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
// Import thêm ArrowRight từ thư viện lucide-react để đồng bộ icon cho nút bấm mới
import { ArrowRight } from "lucide-react";

export default function Roadmap2() {
  const navigate = useNavigate();
  
  // ── STATE MANAGEMENT ──
  const [aiData, setAiData] = useState(null);
  const [currentNodeId, setCurrentNodeId] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const treeWrapRef = useRef(null);
  const svgRef = useRef(null);

  // ── HOOK LOAD DATA & FALLBACK ──
  useEffect(() => {
    // Mô phỏng hiệu ứng quét AI chạy mượt trong 800ms
    const timer = setTimeout(() => {
      let storedData = null;
      try {
        // Kiểm tra cả 2 key lưu trữ để tránh lỗi đồng bộ
        const raw = localStorage.getItem("devpath_ai_result") || localStorage.getItem("devpath_analysis_result");
        if (raw) storedData = JSON.parse(raw);
      } catch (e) {
        console.error("Lỗi đọc dữ liệu roadmap từ localStorage", e);
      }

      // Nếu dữ liệu từ UploadCV truyền sang ở dạng rút gọn, ta map nó vào cấu trúc giao diện chuẩn
      if (storedData && !storedData.nodes) {
        storedData = generateFullDataFromSimple(storedData.role, storedData.missing || [], storedData.hasCV);
      }

      // Nếu hoàn toàn chưa có data, sử dụng bộ Demo Data chuẩn Backend của HTML làm mặc định
      if (!storedData) {
        storedData = getDemoBackendData();
        storedData.hasCV = true;
      }

      setAiData(storedData);
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // ── HỆ THỐNG VẼ ĐƯỜNG NỐI SVG ĐỘNG ──
  const drawConnectors = () => {
    if (!aiData || !svgRef.current || !treeWrapRef.current) return;

    const svg = svgRef.current;
    const wrap = treeWrapRef.current;
    svg.style.height = `${wrap.offsetHeight}px`;
    svg.innerHTML = "";
    const wRect = wrap.getBoundingClientRect();

    (aiData.connections || []).forEach(([fromId, toId]) => {
      const fromEl = document.getElementById(`node-${fromId}`);
      const toEl = document.getElementById(`node-${toId}`);
      if (!fromEl || !toEl) return;

      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();

      const x1 = fr.right - wRect.left;
      const y1 = fr.top + fr.height / 2 - wRect.top + 10;
      const x2 = tr.left - wRect.left;
      const y2 = tr.top + tr.height / 2 - wRect.top + 10;
      const mx = (x1 + x2) / 2;

      // Sửa đổi an toàn: Lấy trực tiếp từ object nodes theo ID thay vì theo chỉ mục mảng
      const fromNode = aiData.nodes[fromId];
      const isDone = fromNode && fromNode.status === "done";

      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`);
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", isDone ? "rgba(34,197,94,.35)" : "rgba(30,42,58,.9)");
      path.setAttribute("stroke-width", isDone ? "1.5" : "1");
      if (!isDone) path.setAttribute("stroke-dasharray", "4,4");

      svg.appendChild(path);
    });
  };

  // Kích hoạt vẽ lại đường nối khi đổi dữ liệu, đổi node hoặc resize cửa sổ
  useEffect(() => {
    if (!loading && aiData) {
      // Đợi DOM render ổn định 100ms rồi vẽ đường nối
      const t = setTimeout(drawConnectors, 100);
      window.addEventListener("resize", drawConnectors);
      return () => {
        window.removeEventListener("resize", drawConnectors);
        clearTimeout(t);
      };
    }
  }, [loading, aiData, currentNodeId]);

  // ── LOGIC INTERACTION TỪNG NODE KỸ NĂNG ──
  const openNode = (id) => {
    setCurrentNodeId(id);
  };

  const closePanel = () => {
    setCurrentNodeId(null);
  };

  const toggleCheck = (nodeId, idx, isChecked) => {
    const updatedData = { ...aiData };
    const node = updatedData.nodes[nodeId];
    node.checkState[idx] = isChecked;

    const checkedCount = node.checkState.filter(Boolean).length;
    node.pct = Math.round((checkedCount / node.checkState.length) * 100);

    if (node.pct === 100) {
      node.status = "done";
    } else if (node.pct > 0) {
      node.status = "in-progress";
    } else {
      node.status = "todo";
    }

    setAiData(updatedData);
    localStorage.setItem("devpath_ai_result", JSON.stringify(updatedData));
  };

  const toggleDoneDirectly = (nodeId) => {
    const updatedData = { ...aiData };
    const node = updatedData.nodes[nodeId];
    
    node.status = "done";
    node.pct = 100;
    node.checkState = node.checkState.map(() => true);

    setAiData(updatedData);
    localStorage.setItem("devpath_ai_result", JSON.stringify(updatedData));
  };

  // Tính toán tiến độ học tập tổng quát ở Sidebar
  const getAllProgressStats = () => {
    if (!aiData) return { pct: 0, done: 0, todo: 0 };
    const nodesArray = Object.values(aiData.nodes);
    const done = nodesArray.filter(n => n.status === "done").length;
    const pct = Math.round((done / nodesArray.length) * 100) || 0;
    return { pct, done, todo: nodesArray.length - done };
  };

  const stats = getAllProgressStats();
  const activeNode = currentNodeId ? aiData?.nodes[currentNodeId] : null;

  // Render trạng thái Loading ban đầu
  if (loading) {
    return (
      <div className="bg-[#080c10] text-white min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-400/20 border-t-[#00e5ff] rounded-full animate-spin mb-4"></div>
        <p className="text-[#6b7a95] font-medium text-sm tracking-wide">AI đang đồng bộ sơ đồ tư duy...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#080c10] text-[#e8edf5] min-h-screen font-sans flex flex-col relative overflow-x-hidden select-none antialiased">
      
      {/* CSS Cốt lõi của hiệu ứng hạt Drift & hạt lưới */}
      <style>{`
        .grain-bg::before {
          content: ''; position: fixed; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 0; opacity: 0.4;
        }
        .grid-bg::after {
          content: ''; position: fixed; inset: 0;
          background-image: linear-gradient(rgba(0,229,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.02) 1px, transparent 1px);
          background-size: 60px 60px; pointer-events: none; z-index: 0;
        }
        @keyframes drift { from { transform: translate(0,0) } to { transform: translate(40px,30px) } }
        .animate-drift-1 { animation: drift 8s ease-in-out infinite alternate; }
        .animate-drift-2 { animation: drift 10s ease-in-out infinite alternate-reverse; }
        .shimmer-effect { background: linear-gradient(90deg, #1e2a3a 25%, #0e1420 50%, #1e2a3a 75%); background-size: 400% 100%; animation: shimmerAnim 1.6s infinite; }
        @keyframes shimmerAnim { 0% { background-position: 100% 0 } 100% { background-position: -100% 0 } }
      `}</style>

      <div className="grain-bg grid-bg"></div>
      
      {/* Hào quang nền (Glow Effect) */}
      <div className="fixed w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(0,229,255,0.06)_0%,transparent_70%)] top-[-100px] left-[-150px] pointer-events-none z-0 animate-drift-1"></div>
      <div className="fixed w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)] bottom-[-80px] right-[-100px] pointer-events-none z-0 animate-drift-2"></div>

      {/* ── 1. HEADER NAVIGATION ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 bg-[#080c10]/85 backdrop-blur-md border-b border-[#1e2a3a]">
        <span onClick={() => navigate("/")} className="font-bold text-xl tracking-tight text-white cursor-pointer select-none">
          Dev<span className="text-[#00e5ff]">Path</span> AI
        </span>
        <div className="hidden md:flex items-center gap-1.5 text-xs text-[#6b7a95]">
          <span>Lộ trình</span>
          <span className="text-[#1e2a3a]">/</span>
          <span className="text-white font-medium">{aiData.role}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00e5ff] to-[#7c3aed] flex items-center justify-center text-xs font-bold text-[#080c10]">
            {aiData.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <span className="hidden sm:inline text-xs font-medium text-[#6b7a95]">{aiData.username || "Học viên"}</span>
        </div>
      </nav>

      {/* ── 2. AI SCORES BANNER ── */}
      <div className="relative z-10 bg-gradient-to-r from-[#00e5ff]/5 to-[#7c3aed]/5 border-b border-[#00e5ff]/10 px-6 md:px-12 py-3 mt-[65px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-xs text-[#6b7a95] flex-1">
          {aiData.hasCV ? (
            <>🤖 AI phân tích CV và thiết lập bản đồ hành trình <strong className="text-white font-semibold">{aiData.role}</strong>. Độ tương thích hiện tại: <strong className="text-[#00e5ff]">{aiData.score}%</strong>.</>
          ) : (
            <>⚙️ Bản đồ hành trình phát triển <strong className="text-white font-semibold">{aiData.role}</strong> được tối ưu hóa dựa trên các khối công nghệ tiêu chuẩn.</>
          )}
        </div>
        
        <div className="flex items-center gap-2.5 flex-wrap">
          {aiData.hasCV && (
            <div className="flex items-center gap-1.5 bg-[#111927] border border-[#1e2a3a] rounded-lg px-3 py-1 text-xs">
              <span className={`font-bold text-base ${aiData.score >= 75 ? "text-green-400" : "text-amber-400"}`}>{aiData.score}</span>
              <span className="text-[#6b7a95]">/100 Điểm CV</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 bg-[#111927] border border-[#1e2a3a] rounded-lg px-3 py-1 text-xs">
            <span className="font-bold text-base text-green-400">{Object.values(aiData.nodes).filter(n => aiData.hasCV ? n.cvMatch : n.status === "done").length}</span>
            <span className="text-[#6b7a95]">{aiData.hasCV ? "Sẵn có" : "Đã đạt"}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#111927] border border-[#1e2a3a] rounded-lg px-3 py-1 text-xs">
            <span className="font-bold text-base text-amber-500">{Object.values(aiData.nodes).filter(n => aiData.hasCV ? !n.cvMatch : n.status !== "done").length}</span>
            <span className="text-[#6b7a95]">Cần bồi dưỡng</span>
          </div>
        </div>
      </div>

      {/* ── OVERLAY CLICK CLOSE PANEL ── */}
      {currentNodeId && (
        <div className="fixed inset-0 bg-[#080c10]/40 z-40 transition-all duration-300" onClick={closePanel}></div>
      )}

      {/* ── 3. MAIN COMPONENT LAYOUT ── */}
      <div className="flex flex-1 relative z-10">
        
        {/* ── LEFT SIDEBAR (TIẾN TRÌNH & DANH SÁCH) ── */}
        <aside className="w-[260px] hidden md:flex flex-col border-r border-[#1e2a3a] bg-[#0e1420]/60 backdrop-blur-sm sticky top-0 h-[calc(100vh-120px)] overflow-y-auto">
          <div className="p-4 border-b border-[#1e2a3a]">
            <div className="flex items-center gap-2.5 mb-3.5">
              <span className="text-2xl">{aiData.roleEmoji}</span>
              <div>
                <div className="font-bold text-xs text-white tracking-tight">{aiData.role}</div>
                <div className="text-[10px] text-[#6b7a95] mt-0.5">{aiData.roleMeta}</div>
              </div>
            </div>
            
            {/* Thanh tiến độ tổng */}
            <div className="bg-[#111927] border border-[#1e2a3a] rounded-xl p-3">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10px] uppercase text-[#6b7a95] font-semibold tracking-wider">Tiến độ tổng hợp</span>
                <span className="font-bold text-sm text-[#00e5ff]">{stats.pct}%</span>
              </div>
              <div className="h-1 bg-[#1e2a3a] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] transition-all duration-500" style={{ width: `${stats.pct}%` }}></div>
              </div>
              <div className="flex justify-between text-[10px] text-[#6b7a95] mt-2 font-medium">
                <span><strong>{stats.done}</strong> Đã đạt</span>
                <span><strong>{stats.todo}</strong> Cần học</span>
              </div>
            </div>
          </div>

          {/* Cây danh mục rút gọn dọc theo Sidebar */}
          <div className="py-2 flex-1">
            {aiData.phases.map((phase, pi) => (
              <div key={pi} className="mb-4">
                <div className="px-4 py-1 text-[9px] font-bold tracking-widest text-[#6b7a95]/70 uppercase block mb-1">
                  Giai đoạn {pi + 1} — {phase.label}
                </div>
                {aiData.cols[pi].map((nid) => {
                  if (nid === "_") return null;
                  const node = aiData.nodes[nid];
                  if (!node) return null;
                  
                  const isActive = currentNodeId === nid;
                  const dotColor = node.status === "done" ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : node.status === "in-progress" ? "bg-[#00e5ff] animate-pulse" : "bg-[#1e2a3a]";

                  return (
                    <div
                      key={nid}
                      onClick={() => openNode(nid)}
                      className={`flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-[#6b7a95] hover:bg-[#00e5ff]/5 hover:text-white cursor-pointer transition-all border-l-2 ${isActive ? "bg-[#00e5ff]/10 border-[#00e5ff] text-white" : "border-transparent"}`}
                    >
                      <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`}></div>
                      <span className="truncate flex-1">{node.title}</span>
                      <span className="text-[9px] bg-[#0e1420] border border-[#1e2a3a] text-[#6b7a95] px-1.5 py-0.5 rounded">{node.pct}%</span>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* ── RIGHT MAIN GRAPH CONTENT ── */}
        <main className="flex-1 p-6 md:p-8 overflow-x-auto min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 bg-[#00e5ff]/10 border border-[#00e5ff]/20 rounded-full px-3 py-0.5 text-[10px] font-bold text-[#00e5ff] uppercase tracking-wide mb-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]"></div>
                Lộ trình AI cá nhân hoá · Đã tối ưu theo CV
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
                Bản Đồ Phát Triển <span>{aiData.role}</span>
              </h1>
              <p className="text-xs text-[#6b7a95]">Click vào từng khối công nghệ để tra cứu tài liệu học và checklist chi tiết.</p>
            </div>

            {/* VÙNG CHỨA CÁC NÚT ĐIỀU HƯỚNG CHỨC NĂNG */}
            <div className="flex gap-2 flex-wrap items-center shrink-0">
              {aiData.hasCV && (
                <button onClick={() => navigate("/upload")} className="inline-flex items-center gap-1.5 px-3 py-2 bg-transparent border border-[#1e2a3a] hover:border-[#00e5ff] text-xs font-medium text-[#6b7a95] hover:text-white rounded-lg transition-all h-[38px]">
                  🔄 Phân tích CV khác
                </button>
              )}
              <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1e2a3a] hover:bg-[#253449] border border-gray-700/30 text-xs font-bold text-white rounded-lg transition-all h-[38px]">
                🖨️ Xuất PDF
              </button>
              
              {/* ── NÚT BẤM TIẾP THEO THEO USER FLOW ── */}
              {aiData.hasCV && (
                <button 
                  onClick={() => navigate('/skill-gap')} 
                  className="flex items-center gap-2 px-4 py-2 bg-[#00e5ff] text-black font-bold text-xs rounded-lg hover:bg-[#00b2cc] transition-all shadow-[0_0_15px_rgba(0,229,255,0.25)] h-[38px]"
                >
                  <span>Xem khoảng cách kỹ năng</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Ghi chú màu sắc */}
          <div className="flex gap-4 mb-6 flex-wrap text-xs text-[#6b7a95]">
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-green-500"></div> Đã sở hữu</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-[#00e5ff]"></div> Đang học</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-[#1e2a3a]"></div> Chưa bắt đầu</div>
            <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded bg-transparent border-2 border-green-500/70"></div> Nhận diện từ CV</div>
          </div>

          {/* SƠ ĐỒ MẠNG LƯỚI GRAPH (TREE GRAPH WRAPPER) */}
          <div className="relative" id="tree-wrap" ref={treeWrapRef}>
            
            {/* Header Giai Đoạn */}
            <div className="flex mb-4 w-full" id="phase-labels">
              {aiData.phases.map((phase, index) => (
                <div key={index} className="flex-1 text-center">
                  <span className={`inline-block text-[10px] font-bold tracking-wide uppercase px-3 py-1 rounded-md bg-[#111927] border border-[#1e2a3a] ${phase.cls === "p1" ? "text-green-400 border-green-500/20" : phase.cls === "p2" ? "text-cyan-400 border-cyan-500/20" : phase.cls === "p3" ? "text-amber-400 border-amber-500/20" : "text-violet-400 border-violet-500/20"}`}>
                    {phase.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Canvas vẽ các đường dẫn SVG kết nối */}
            <svg className="absolute top-0 left-0 w-full pointer-events-none z-0" id="tree-svg" ref={svgRef}></svg>

            {/* Lưới phân phối Node mạng học tập */}
            <div className="flex relative z-10 w-full" id="tree-grid">
              {aiData.cols.map((col, ci) => (
                <div key={ci} className="flex-1 flex flex-col gap-4 px-2 items-center">
                  {col.map((nid, ni) => {
                    if (nid === "_") {
                      return <div key={`spacer-${ni}`} className="h-[105px] w-[160px] shrink-0"></div>;
                    }

                    const node = aiData.nodes[nid];
                    if (!node) return null;

                    const isSelected = currentNodeId === nid;
                    
                    // Style động theo trạng thái của nút học tập
                    let borderStyle = "border-[#1e2a3a] bg-[#111927]";
                    let statusDot = "bg-[#1e2a3a]";
                    let progressFill = "bg-[#1e2a3a]";

                    if (node.status === "done") {
                      borderStyle = "border-green-500/40 bg-green-500/5 hover:border-green-400";
                      statusDot = "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.6)]";
                      progressFill = "bg-green-500";
                    } else if (node.status === "in-progress") {
                      borderStyle = "border-cyan-500/50 bg-cyan-500/5 hover:border-cyan-400";
                      statusDot = "bg-[#00e5ff] shadow-[0_0_5px_rgba(0,229,255,0.6)] animate-pulse";
                      progressFill = "bg-[#00e5ff]";
                    }

                    return (
                      <div
                        key={nid}
                        id={`node-${nid}`}
                        onClick={() => openNode(nid)}
                        style={{ outline: isSelected ? "2px solid rgba(0,229,255,0.5)" : "none" }}
                        className={`w-[160px] rounded-xl border p-3.5 cursor-pointer relative transition-all duration-200 transform hover:-translate-y-0.5 shadow-md ${borderStyle} ${node.cvMatch ? "ring-2 ring-green-500/30" : ""}`}
                      >
                        <div className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${statusDot}`}></div>
                        <div className="text-xl mb-1">{node.icon}</div>
                        <div className="font-bold text-xs text-white leading-tight mb-0.5 line-clamp-1">{node.title}</div>
                        <div className="text-[10px] text-[#6b7a95] line-clamp-2 leading-relaxed h-7">{node.sub}</div>
                        
                        {/* Thanh mini tiến độ của từng ô */}
                        <div className="h-0.5 bg-[#1e2a3a] w-full rounded-full mt-2 overflow-hidden">
                          <div className={`h-full ${progressFill}`} style={{ width: `${node.pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </main>
      </div>

      {/* ── 4. RIGHT SLIDE-OUT DETAIL DRAWER (BẢNG THÔNG TIN CHI TIẾT) ── */}
      <div
        id="detail-panel"
        className={`fixed top-0 right-0 bottom-0 w-[330px] max-w-full bg-[#0e1420] border-l border-[#1e2a3a] z-50 flex flex-col transition-transform duration-300 ease-in-out overflow-y-auto ${activeNode ? "translate-x-0" : "translate-x-full"}`}
      >
        {activeNode && (
          <>
            <div className="p-5 border-b border-[#1e2a3a] sticky top-0 bg-[#0e1420] z-10">
              <button onClick={closePanel} className="absolute top-4 right-4 text-[#6b7a95] hover:text-white text-xl font-medium transition-colors">✕</button>
              <div className="text-3xl mb-2">{activeNode.icon}</div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded ${activeNode.status === "done" ? "bg-green-500/10 text-green-400 border border-green-500/20" : activeNode.status === "in-progress" ? "bg-cyan-500/10 text-[#00e5ff] border border-cyan-500/20" : "bg-[#1e2a3a] text-[#6b7a95]"}`}>
                  {activeNode.status === "done" ? "✅ Đã xong" : activeNode.status === "in-progress" ? "🔵 Đang học" : "⬜ Chưa bắt đầu"}
                </span>
                {aiData.hasCV && activeNode.cvMatch && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 flex items-center gap-1">📄 Từ CV</span>
                )}
              </div>
              <h2 className="font-bold text-base text-white mb-1.5 leading-snug">{activeNode.title}</h2>
              <p className="text-xs text-[#6b7a95] leading-relaxed">{activeNode.desc}</p>
            </div>

            <div className="p-5 flex flex-col gap-5 overflow-y-auto flex-1">
              {/* Vùng tiến trình của kỹ năng đang xem */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#6b7a95] mb-2">Tiến độ nhánh kĩ năng</div>
                <div className="bg-[#111927] border border-[#1e2a3a] rounded-xl p-3">
                  <div className="flex justify-between text-xs mb-1 font-medium">
                    <span className="text-[#6b7a95]">{activeNode.status === "done" ? "Hoàn tất" : "Đang tích lũy"}</span>
                    <span className="text-[#00e5ff] font-bold">{activeNode.pct}%</span>
                  </div>
                  <div className="h-1 bg-[#1e2a3a] rounded-full overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${activeNode.status === "done" ? "bg-green-500" : "bg-[#00e5ff]"}`} style={{ width: `${activeNode.pct}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Vùng checklist nhiệm vụ */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#6b7a95] mb-2">Nhiệm vụ trọng tâm</div>
                <div className="flex flex-col gap-2">
                  {(activeNode.checklist || []).map((item, idx) => {
                    const isChecked = activeNode.checkState[idx];
                    return (
                      <label key={idx} className={`flex items-start gap-2.5 text-xs p-2 rounded-lg bg-[#111927]/40 border border-[#1e2a3a]/40 cursor-pointer select-none transition-all ${isChecked ? "text-gray-400 line-through decoration-[#1e2a3a]" : "text-[#e8edf5] hover:bg-[#111927]"}`}>
                        <input
                          type="checkbox"
                          checked={isChecked || false}
                          onChange={(e) => toggleCheck(currentNodeId, idx, e.target.checked)}
                          className="mt-0.5 accent-[#00e5ff] cursor-pointer"
                        />
                        <span>{item}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Vùng học liệu tham khảo */}
              <div>
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#6b7a95] mb-2">Tài nguyên được AI chọn lọc</div>
                <div className="flex flex-col gap-2">
                  {(activeNode.resources || []).map((res, ri) => (
                    <div key={ri} className="flex items-center gap-3 p-2.5 bg-[#111927] border border-[#1e2a3a] rounded-xl hover:border-[#00e5ff]/40 transition-colors cursor-pointer">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${res.tag === "free" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                        {res.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{res.title}</div>
                        <div className="text-[10px] text-[#6b7a95] truncate">{res.meta}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${res.tag === "free" ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-500"}`}>
                        {res.tag === "free" ? "Miễn phí" : "Premium"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Nút bấm Đánh Dấu Hoàn Thành Nhanh ở đáy Drawer */}
            <div className="p-4 border-t border-[#1e2a3a] sticky bottom-0 bg-[#0e1420]">
              <button
                disabled={activeNode.status === "done"}
                onClick={() => toggleDoneDirectly(currentNodeId)}
                className={`w-full py-2.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md ${activeNode.status === "done" ? "bg-green-500 text-[#080c10] font-extrabold" : "bg-[#00e5ff] hover:bg-[#00e5ff]/90 text-[#080c10]"}`}
              >
                {activeNode.status === "done" ? "✓ Kỹ Năng Đã Hoàn Thành" : "🎯 Đánh Dấu Hoàn Thành Toàn Bộ"}
              </button>
            </div>
          </>
        )}
      </div>

      {/* ── 5. FOOTER COMPONENT ── */}
      <footer className="relative z-10 border-t border-[#1e2a3a] px-6 md:px-12 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#6b7a95] mt-auto bg-[#080c10]">
        <div className="font-bold text-xs text-white">Dev<span className="text-[#00e5ff]">Path</span> AI</div>
        <div>Dự án nghiên cứu Khoa CNTT — Trường Đại học Công nghệ Đông Á (EAUT) · 2026</div>
      </footer>

    </div>
  );
}

// ── HÀM BỔ TRỢ 1: MOCK LẠI FULL CẤU TRÚC KHI CHỈ NHẬN ĐƯỢC 3 THÔNG TIN TỪ UPLOAD CV ──
function generateFullDataFromSimple(role, missingSkills, hasCV) {
  const base = getDemoBackendData();
  base.role = role || "IT Engineer";
  base.hasCV = hasCV !== false;
  
  Object.keys(base.nodes).forEach(key => {
    const isMissing = missingSkills.some(s => s.toLowerCase().includes(key.toLowerCase()) || base.nodes[key].title.toLowerCase().includes(s.toLowerCase()));
    if (isMissing) {
      base.nodes[key].status = "todo";
      base.nodes[key].pct = 0;
      base.nodes[key].cvMatch = false;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => false);
    } else {
      base.nodes[key].status = "done";
      base.nodes[key].pct = 100;
      base.nodes[key].cvMatch = true;
      base.nodes[key].checkState = base.nodes[key].checkState.map(() => true);
    }
  });

  const allNodes = Object.values(base.nodes);
  const matchNodes = allNodes.filter(n => n.cvMatch).length;
  base.score = Math.round((matchNodes / allNodes.length) * 100);

  return base;
}

// ── HÀM BỔ TRỢ 2: TRẢ VỀ BỘ DEMO KỸ NĂNG BACKEND ĐỂ RENDER CHUẨN HTML MẪU ──
function getDemoBackendData() {
  return {
    username: "Học Viên DevPath",
    role: "Backend Engineer",
    roleEmoji: "⚙️",
    roleMeta: "10 kỹ năng cốt lõi · Lộ trình 3–6 tháng",
    score: 70,
    phases: [
      { label: "Nền tảng IT", cls: "p1" },
      { label: "Ngôn ngữ & API", cls: "p2" },
      { label: "Cơ sở dữ liệu", cls: "p3" },
      { label: "Hạ tầng Cloud", cls: "p4" }
    ],
    cols: [
      ["internet", "linux", "git"],
      ["_", "nodejs", "restapi", "_"],
      ["_", "sql", "nosql", "_"],
      ["auth", "docker", "redis"]
    ],
    connections: [
      ["internet", "nodejs"], ["linux", "nodejs"], ["git", "nodejs"],
      ["linux", "restapi"], ["git", "restapi"],
      ["nodejs", "sql"], ["nodejs", "nosql"],
      ["restapi", "sql"], ["restapi", "nosql"],
      ["sql", "auth"], ["nosql", "auth"],
      ["sql", "docker"], ["nosql", "redis"],
      ["auth", "docker"], ["auth", "redis"]
    ],
    nodes: {
      internet: {
        icon: "🌐", title: "Internet & HTTP", sub: "DNS, TCP/IP, HTTP Methods, Status codes",
        desc: "Thấu hiểu nguyên lý vận hành của Internet toàn cầu và cấu trúc giao thức HTTP làm tiền đề giao tiếp Client-Server.",
        status: "done", pct: 100, cvMatch: true,
        checklist: ["HTTP methods: GET, POST, PUT, DELETE", "Status codes (2xx, 3xx, 4xx, 5xx)", "Hệ thống phân giải tên miền DNS", "Headers, Cookies và Session quản trị"],
        checkState: [true, true, true, true],
        resources: [{ icon: "📖", type: "doc", title: "MDN — HTTP Overview Guide", meta: "mozilla.org", tag: "free" }, { icon: "🎬", type: "free", title: "CS50 Web — Internet Mechanics", meta: "Harvard University", tag: "free" }]
      },
      linux: {
        icon: "🐧", title: "Linux Terminal", sub: "Terminal commands, File system, Permissions",
        desc: "Thành thạo kỹ năng thao tác trên dòng lệnh Terminal Linux, quản trị thư mục và phân quyền máy chủ VPS.",
        status: "done", pct: 100, cvMatch: true,
        checklist: ["Điều hướng thư mục Linux nâng cao", "Quản trị quyền tệp tin: Chmod & Chown", "Quản lý tiến trình (Process Management)", "Cấu hình SSH kết nối Remote Server"],
        checkState: [true, true, true, true],
        resources: [{ icon: "🎬", type: "free", title: "Linux Terminal Fundamentals", meta: "FreeCodeCamp", tag: "free" }]
      },
      git: {
        icon: "🔀", title: "Git & GitHub", sub: "Branching, merging, Pull Request flow",
        desc: "Quản lý phiên bản mã nguồn dự án chặt chẽ với Git, phối hợp nhóm hiệu quả qua GitHub Workflow.",
        status: "done", pct: 100, cvMatch: true,
        checklist: ["Làm chủ Git add, commit, push, clone", "Phân nhánh Branch & xử lý Merge Conflict", "Tạo và kiểm duyệt Pull Request (PR)"],
        checkState: [true, true, true],
        resources: [{ icon: "🎮", type: "free", title: "Learn Git Branching Interactive", meta: "learngitbranching", tag: "free" }]
      },
      nodejs: {
        icon: "🟢", title: "Node.js & Express", sub: "Event loop, Async, Middleware routing",
        desc: "Xây dựng ứng dụng máy chủ bất đồng bộ hiệu năng cao sử dụng môi trường Node.js và kiến trúc định tuyến Express.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Hiểu cơ chế hoạt động Single-threaded Event Loop", "Xử lý bất đồng bộ Async/Await & Promises", "Viết Custom Middleware kiểm soát luồng request", "Xử lý tập tin nâng cao với Stream & Buffer FS"],
        checkState: [false, false, false, false],
        resources: [{ icon: "📖", type: "doc", title: "Node.js Official Documentation", meta: "nodejs.org", tag: "free" }]
      },
      restapi: {
        icon: "⚡", title: "RESTful API Design", sub: "Endpoints, JSON, Status codes, Validation",
        desc: "Thiết kế chuẩn mực giao tiếp dữ liệu giữa Client và Server đáp ứng các tiêu chuẩn công nghiệp RESTful.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Quy chuẩn đặt tên Endpoints số nhiều danh từ", "Xử lý lọc bộ lọc dữ liệu (Filtering, Paging, Sorting)", "Sử dụng thư viện kiểm định dữ liệu đầu vào (Joi / Zod)"],
        checkState: [false, false, false],
        resources: [{ icon: "🎬", type: "free", title: "REST API Design Best Practices", meta: "Fireship", tag: "free" }]
      },
      sql: {
        icon: "💾", title: "Relational DB (SQL)", sub: "PostgreSQL/MySQL, Joins, Indexing",
        desc: "Làm chủ cơ sở dữ liệu quan hệ, tối ưu câu lệnh truy vấn phức tạp và cấu hình chuẩn hóa sơ đồ thực thể.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Thiết kế bảng dữ liệu và khóa ngoại Foreign Key", "Thực thi câu lệnh kết nối INNER/LEFT/RIGHT JOIN", "Tạo lập chỉ mục Index tăng tốc độ truy vấn gấp 10 lần"],
        checkState: [false, false, false],
        resources: [{ icon: "📖", type: "doc", title: "PostgreSQL Tutorial Handbook", meta: "postgresqltutorial", tag: "free" }]
      },
      nosql: {
        icon: "🍃", title: "NoSQL (MongoDB)", sub: "Documents, Collections, Aggregation",
        desc: "Lưu trữ dữ liệu dạng phi cấu trúc linh hoạt linh động với MongoDB Document, đáp ứng mở rộng quy mô dữ liệu nhanh chóng.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Tạo schema động linh hoạt trong Collection", "Thao tác mảng dữ liệu lồng nhau phức tạp", "Sử dụng bộ công cụ xử lý nâng cao Aggregation Framework"],
        checkState: [false, false, false],
        resources: [{ icon: "🎬", type: "free", title: "MongoDB Complete Course 2026", meta: "Net Ninja", tag: "free" }]
      },
      auth: {
        icon: "🔑", title: "Authentication JWT", sub: "Sessions, JWT Tokens, Cookies, RBAC",
        desc: "Bảo mật hệ thống đầu cuối nghiêm ngặt với giải pháp cấp phát token JWT ký điện tử kết hợp cơ chế phân quyền tài khoản.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Mã hóa bảo mật mật khẩu với thư viện bcrypt", "Cấp phát Access Token & Refresh Token", "Phân quyền người dùng dựa trên vai trò (RBAC)"],
        checkState: [false, false, false, false],
        resources: [{ icon: "📖", type: "doc", title: "Introduction to JSON Web Tokens", meta: "jwt.io", tag: "free" }]
      },
      docker: {
        icon: "🐳", title: "Đóng gói Docker", sub: "Containers, Dockerfile, Docker Compose",
        desc: "Đóng gói toàn bộ ứng dụng và môi trường chạy vào bên trong Container nhằm triệt tiêu lỗi cục bộ khi triển khai máy chủ.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Viết file cấu hình Dockerfile tối ưu", "Quản lý đa dịch vụ qua Docker Compose", "Tạo ổ đĩa lưu trữ Volume & thiết lập Network"],
        checkState: [false, false, false],
        resources: [{ icon: "🎬", type: "free", title: "Docker Containerization Crash Course", meta: "TechWorld with Nana", tag: "free" }]
      },
      redis: {
        icon: "⚡", title: "Redis Caching", sub: "In-memory store, Cache patterns, TTL",
        desc: "Tăng cường năng lực xử lý chịu tải hệ thống gấp 10 lần nhờ giải pháp bộ nhớ đệm In-memory siêu tốc Redis.",
        status: "todo", pct: 0, cvMatch: false,
        checklist: ["Ứng dụng cấu hình Cache-aside pattern", "Thiết lập thời gian hủy bộ đệm (TTL)", "Sử dụng Redis lưu trữ dữ liệu tạm thời"],
        checkState: [false, false, false],
        resources: [{ icon: "🎬", type: "free", title: "Redis Crash Course", meta: "Amigoscode", tag: "free" }]
      }
    }
  };
}