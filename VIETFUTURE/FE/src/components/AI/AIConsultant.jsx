import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, ChevronLeft, Bot, User, Send, 
  Sparkles, RefreshCw, ShieldCheck, Terminal 
} from 'lucide-react';

function AIConsultant() {
  const navigate = useNavigate();
  const [isAnimate, setIsAnimate] = useState(false);
  const [roleName, setRoleName] = useState('Chuyên viên Công nghệ');
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Ref để tự động cuộn xuống đáy hộp chat khi có tin nhắn mới
  const chatEndRef = useRef(null);

  // 1. Giả lập danh sách tin nhắn ban đầu (Mock Chat History)
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsAnimate(true);

    // ĐỒNG BỘ DỮ LIỆU: Đọc chức danh công việc đã lưu từ các bước trước
    const recommendedRole = localStorage.getItem("courses_recommended_role");
    const dynamicRole = recommendedRole || 'Chuyên viên Công nghệ';
    if (recommendedRole) {
      setRoleName(recommendedRole);
    }

    // AI chủ động gửi lời chào sau khi trang load xong
    setMessages([
      {
        id: 1,
        sender: 'ai',
        text: `Xin chào! Tôi là Trợ lý Nghề nghiệp AI. Tôi đã phân tích toàn bộ hồ sơ CV, kết quả bài test năng lực cũng như tiến độ học tập hiện tại của bạn đối với vị trí **${dynamicRole}**.`
      },
      {
        id: 2,
        sender: 'ai',
        text: `Dựa trên khoảng cách kỹ năng hiện tại, tôi thấy bạn đang tập trung lấp lỗ hổng rất tốt. Bạn có cần tôi tư vấn sâu hơn về cách deal lương, chuẩn bị câu hỏi phỏng vấn hay tối ưu hóa kế hoạch học tập tuần này không?`
      }
    ]);
  }, []);

  // Tự động cuộn hộp chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // 2. Kịch bản câu trả lời giả lập của AI dựa trên từ khóa (Mock Bot Logic)
  const getAIResponse = (userText) => {
    const text = userText.toLowerCase();
    if (text.includes('lương') || text.includes('salary') || text.includes('thu nhập')) {
      return `Mức lương thị trường cho vị trí **${roleName}** hiện dao động từ 15,000,000đ đến 35,000,000đ tùy thuộc vào số năm kinh nghiệm. Với lộ trình hiện tại của bạn, sau khi lấp đầy 2 kỹ năng cốt lõi còn thiếu, bạn hoàn toàn có thể tự tin deal ở mức upper-bound (cận trên).`;
    }
    if (text.includes('phỏng vấn') || text.includes('interview') || text.includes('câu hỏi')) {
      return `Đối với vị trí **${roleName}**, nhà tuyển dụng thường hỏi rất kỹ về các dự án thực tế bạn từng làm. Đặc biệt, họ sẽ xoáy sâu vào cách bạn tối ưu hóa hệ thống hoặc giải quyết xung đột dữ liệu. Hãy chuẩn bị kỹ câu trả lời theo mô hình STAR nhé!`;
    }
    if (text.includes('khóa học') || text.includes('học')) {
      return `Các khóa học tôi gợi ý ở bước trước được trích xuất trực tiếp từ kho học liệu chuẩn của Stanford và Linux Foundation. Bạn nên ưu tiên hoàn thành dứt điểm các module thực hành trước để lấy chứng chỉ đính kèm vào CV.`;
    }
    // Câu trả lời mặc định nếu không khớp từ khóa
    return `Đó là một câu hỏi rất hay về định hướng **${roleName}**. Để hiện thực hóa mục tiêu này, bạn nên tập trung duy trì chuỗi học tập (Streak) liên tục, kết hợp làm mini-project thực tế. Tôi luôn ở đây để đồng hành cùng bạn trên từng chặng đường!`;
  };

  // 3. Xử lý sự kiện gửi tin nhắn
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsg = inputMessage;
    // Thêm tin nhắn của User vào hộp chat
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: userMsg
    }]);
    setInputMessage('');

    // Bật trạng thái AI đang gõ (Hiệu ứng ba chấm nhấp nháy)
    setIsTyping(true);

    // Giả lập độ trễ phản hồi của AI (1.5 giây) để tăng tính chân thật
    setTimeout(() => {
      const aiReply = getAIResponse(userMsg);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiReply
      }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] p-6 text-white font-sans antialiased bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#0d1b33] via-[#070b14] to-[#070b14]">
      
      <div className={`mx-auto max-w-4xl h-[calc(100vh-50px)] flex flex-col transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
        isAnimate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}>
        
        {/* Header trang */}
        <div className="mb-4 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-[#00e5ff] uppercase tracking-wider mb-1">
            <Terminal size={14} />
            <span>AI Career Consultant Core v2.0</span>
          </div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight flex items-center gap-2">
            Thảo Luận Với <span className="bg-gradient-to-r from-[#00e5ff] to-[#7c3aed] bg-clip-text text-transparent">AI Tư Vấn Nghề Nghiệp</span>
          </h1>
        </div>

        {/* ── THANH LUỒNG TRẠNG THÁI HỆ THỐNG (BƯỚC CUỐI CÙNG SÁNG RỰC) ── */}
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-4 pb-3 border-b border-gray-800/40 shrink-0">
          <span className="opacity-20">1. Đánh giá</span>
          <ArrowRight size={10} className="text-gray-700" />
          <span className="opacity-20">2. Lộ trình</span>
          <ArrowRight size={10} className="text-gray-700" />
          <span className="opacity-20">3. Khoảng cách</span>
          <ArrowRight size={10} className="text-gray-700" />
          <span className="opacity-20">4. Khóa học</span>
          <ArrowRight size={10} className="text-gray-700" />
          <span className="opacity-20">5. Tiến độ</span>
          <ArrowRight size={10} className="text-gray-600" />
          <span className="text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.4)]">6. AI Consultant</span>
        </div>

        {/* KHUNG GIAO DIỆN CHAT CHÍNH (MAIN CHAT INTERFACE) */}
        <div className="flex-1 min-h-0 border border-gray-800/80 rounded-2xl bg-[#0d1527]/40 backdrop-blur-md shadow-2xl flex flex-col overflow-hidden">
          
          {/* Thanh trạng thái Bot trên cùng hộp Chat */}
          <div className="px-4 py-3 border-b border-gray-800/60 bg-[#070c16]/60 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00e5ff] to-[#7c3aed] flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                  <Bot size={16} className="text-white" />
                </div>
                <span className="absolute bottom-[-2px] right-[-2px] w-2.5 h-2.5 bg-green-500 border-2 border-[#070b14] rounded-full animate-pulse"></span>
              </div>
              <div>
                <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                  DevPath AI Mentor
                  <Sparkles size={11} className="text-[#00e5ff]" />
                </div>
                <div className="text-[10px] text-gray-500">Đang trực tuyến • Sẵn sàng tư vấn chuyên sâu</div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-[10px] text-gray-400 bg-gray-950/50 px-2.5 py-1 rounded-md border border-gray-800">
              <ShieldCheck size={12} className="text-green-400" /> End-to-End AI Encrypted
            </div>
          </div>

          {/* VÙNG CHỨA TIN NHẮN (MESSAGES CONTAINER) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#070c16]/20">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar người gửi */}
                <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 border text-xs font-bold ${
                  msg.sender === 'user' 
                    ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' 
                    : 'bg-cyan-950/50 border-cyan-500/30 text-cyan-400'
                }`}>
                  {msg.sender === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>

                {/* Bong bóng tin nhắn */}
                <div 
                  className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-l from-[#5b21b6] to-[#7c3aed] text-white rounded-tr-none'
                      : 'bg-[#0d1527] border border-gray-800/80 text-gray-200 rounded-tl-none'
                  }`}
                  dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-[#00e5ff] font-bold">$1</strong>') }}
                />
              </div>
            ))}

            {/* Hiệu ứng AI đang suy nghĩ / gõ chữ */}
            {isTyping && (
              <div className="flex gap-3 mr-auto max-w-[85%] items-center">
                <div className="w-7 h-7 rounded-md flex items-center justify-center shrink-0 bg-cyan-950/50 border border-cyan-500/30 text-cyan-400">
                  <Bot size={14} />
                </div>
                <div className="bg-[#0d1527] border border-gray-800/80 px-4 py-3 rounded-xl rounded-tl-none flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-[#00e5ff] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* FORM Ô NHẬP LIỆU GỬI TIN NHẮN (INPUT MESSAGE FORM) */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-800/60 bg-[#070c16]/80 flex items-center gap-2 shrink-0">
            <button 
              type="button"
              onClick={() => navigate('/progress')}
              className="p-2 text-gray-500 hover:text-white border border-gray-800 rounded-xl hover:bg-gray-800/40 transition-colors shrink-0"
              title="Quay lại kiểm tra Tiến độ"
            >
              <ChevronLeft size={16} />
            </button>

            <input 
              type="text" 
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Hỏi AI về mức lương, bộ câu hỏi phỏng vấn vị trí ${roleName}...`}
              className="flex-1 bg-gray-950/80 border border-gray-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#00e5ff]/50 text-white placeholder-gray-600 transition-colors"
              disabled={isTyping}
            />

            <button 
              type="submit"
              disabled={!inputMessage.trim() || isTyping}
              className={`p-2 rounded-xl transition-all font-bold shrink-0 ${
                inputMessage.trim() && !isTyping
                  ? 'bg-[#00e5ff] text-black shadow-[0_0_12px_rgba(0,229,255,0.25)] active:scale-95'
                  : 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700/50'
              }`}
            >
              <Send size={15} />
            </button>
          </form>

        </div>

        {/* Nút Reset luồng hoặc quay lại trang chủ ở dưới cùng */}
        <div className="mt-3 flex items-center justify-between text-[10px] text-gray-600 shrink-0 px-1">
          <span>Tip: Hãy thử gõ các từ khóa như "lương", "phỏng vấn" để test AI phản hồi mẫu</span>
          <button 
            onClick={() => {
              if(window.confirm("Bạn có muốn xóa dữ liệu giả lập cũ để thực hiện lại bài đánh giá từ đầu không?")) {
                localStorage.clear();
                navigate('/');
              }
            }}
            className="flex items-center gap-1 hover:text-red-400 transition-colors font-semibold"
          >
            <RefreshCw size={10} /> Reset làm lại từ đầu Luồng
          </button>
        </div>

      </div>
    </div>
  );
}

export default AIConsultant;