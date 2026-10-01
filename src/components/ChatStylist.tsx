import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Sparkles, User, RefreshCw, AlertCircle, ArrowRight, 
  MapPin, Calendar, CloudSun, DollarSign, Shirt, MessageSquare, Trash2
} from 'lucide-react';
import { VanKySeal, LotusMotif } from './TraditionalPattern';
import { normalizeVN } from '../utils/unicode';
import { Language, UI_TRANSLATIONS } from '../utils/i18n';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  outfitConfig?: {
    costumeId: string;
    costumeName?: string;
    colorHex?: string;
    colorName?: string;
    accessories?: string[];
  } | null;
  timestamp: string;
}

interface ChatStylistProps {
  onApplyOutfitToStudio: (config: {
    costumeId: string;
    colorHex?: string;
    colorName?: string;
    accessories?: string[];
  }) => void;
  language?: Language;
}

export const ChatStylist: React.FC<ChatStylistProps> = ({ 
  onApplyOutfitToStudio, 
  language = 'vi' 
}) => {
  const t = UI_TRANSLATIONS[language].chat;

  // Chat History
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'en'
        ? `Hello! I am **Van – Your Vietnamese Traditional Attire Stylist** at VẬN KỲ. 🌿\n\nI am here to assist you with choosing, styling, and understanding authentic Vietnamese heritage attire:\n- What to wear when visiting Temple of Literature (Hanoi) or the Imperial Citadel of Hue?\n- Five-element color matching philosophy for respectful elegance.\n- Royal court etiquette & motifs to avoid.\n\nFeel free to pick one of the quick questions below or customize your destination context!`
        : `Dạ, chào bạn! Mình là **Vân – Stylist Việt phục** của VẬN KỲ. 🌿\n\nMình luôn ở đây để giúp bạn giải đáp mọi băn khoăn khi lựa chọn, may đo hoặc phối đồ truyền thống Việt Nam:\n- Mặc gì khi đi kỷ yếu ở Văn Miếu hay Đại Nội Huế?\n- Phối màu ngũ hành thế nào cho trang nghiêm mà vẫn trẻ trung?\n- Quy chuẩn tránh phạm húy, lệch lạc giai tầng khi kết hợp phụ kiện?\n\nBạn có thể bấm vào các câu hỏi gợi ý bên dưới hoặc chọn ngữ cảnh cụ thể để Vân cố vấn nhé!`,
      timestamp: language === 'en' ? 'Just now' : 'Vừa xong'
    }
  ]);

  // Update welcome message if language switches and only 1 message
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'welcome') {
        return [{
          id: 'welcome',
          role: 'assistant',
          content: language === 'en'
            ? `Hello! I am **Van – Your Vietnamese Traditional Attire Stylist** at VẬN KỲ. 🌿\n\nI am here to assist you with choosing, styling, and understanding authentic Vietnamese heritage attire:\n- What to wear when visiting Temple of Literature (Hanoi) or the Imperial Citadel of Hue?\n- Five-element color matching philosophy for respectful elegance.\n- Royal court etiquette & motifs to avoid.\n\nFeel free to pick one of the quick questions below or customize your destination context!`
            : `Dạ, chào bạn! Mình là **Vân – Stylist Việt phục** của VẬN KỲ. 🌿\n\nMình luôn ở đây để giúp bạn giải đáp mọi băn khoăn khi lựa chọn, may đo hoặc phối đồ truyền thống Việt Nam:\n- Mặc gì khi đi kỷ yếu ở Văn Miếu hay Đại Nội Huế?\n- Phối màu ngũ hành thế nào cho trang nghiêm mà vẫn trẻ trung?\n- Quy chuẩn tránh phạm húy, lệch lạc giai tầng khi kết hợp phụ kiện?\n\nBạn có thể bấm vào các câu hỏi gợi ý bên dưới hoặc chọn ngữ cảnh cụ thể để Vân cố vấn nhé!`,
          timestamp: language === 'en' ? 'Just now' : 'Vừa xong'
        }];
      }
      return prev;
    });
  }, [language]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Context Selectors
  const [showContextPanel, setShowContextPanel] = useState<boolean>(false);
  const [contextLocation, setContextLocation] = useState<string>('Hà Nội (Văn Miếu, Phố Cổ)');
  const [contextEvent, setContextEvent] = useState<string>('Chụp ảnh kỷ yếu tốt nghiệp');
  const [contextWeather, setContextWeather] = useState<string>('Mát mẻ mùa thu đông');
  const [contextGender, setContextGender] = useState<string>('Nữ giới');
  const [contextBudget, setContextBudget] = useState<string>('Học sinh - Sinh viên');
  const [contextStyle, setContextStyle] = useState<string>('Thuần cổ phục chuẩn chỉ');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Quick prompt chips
  const quickChips = language === 'en' ? [
    "What should I wear for photos at Temple of Literature?",
    "Which traditional attire is best for pagodas & shrines?",
    "Styling tips for graduation photos in Imperial Hue?",
    "What attire suits an evening stroll in Hoi An ancient town?",
    "Best traditional outfit for Lunar New Year in Hanoi?"
  ] : [
    "Đi Văn Miếu chụp ảnh kỷ yếu nên mặc gì?",
    "Đi chùa nên mặc bộ nào?",
    "Lễ tốt nghiệp ở Huế phối gì?",
    "Đi Hội An buổi tối?",
    "Đi Tết ở Hà Nội?"
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputPrompt.trim();
    if (!query || isLoading) return;

    setErrorMsg(null);
    const userMsgId = Date.now().toString();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/stylist/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          lang: language,
          context: {
            location: contextLocation,
            event: contextEvent,
            weather: contextWeather,
            gender: contextGender,
            budget: contextBudget,
            style: contextStyle
          }
        })
      });

      if (!res.ok) {
        throw new Error(language === 'en' ? 'Server did not respond, please try again.' : 'Máy chủ chưa phản hồi, vui lòng thử lại.');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: normalizeVN(data.text || ''),
        outfitConfig: data.outfitConfig ? normalizeVN(data.outfitConfig) : null,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Không thể kết nối tới Stylist AI. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: `Dạ, chào bạn! Mình là Vân – Stylist Việt phục. Lịch sử trò chuyện đã được làm mới. Hãy cho Vân biết dịp sắp tới của bạn nhé!`,
        timestamp: 'Vừa xong'
      }
    ]);
    setErrorMsg(null);
  };

  const formatStylistContent = (text: string) => {
    return text
      .replace(/```(?:json|config)?[\s\S]*?```/g, '')
      .replace(/\{\s*"trangPhuc"[\s\S]*?\}/g, '')
      .replace(/\{\s*"costumeId"[\s\S]*?\}/g, '')
      .trim();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Profile */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-5 rounded mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="relative w-12 h-12 rounded-full border-2 border-[#A4161A] overflow-hidden bg-[#1F2A44] flex items-center justify-center shrink-0">
            <span className="font-serif text-lg font-bold text-[#D4A347]">VÂN</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-xl font-bold text-[#1A1A1A] leading-snug">
                {language === 'en' ? 'Van – Vietnamese Attire Stylist' : 'Vân – Stylist Việt Phục'}
              </h1>
              <span className="px-2 py-0.5 bg-[#A4161A]/10 text-[#A4161A] text-[10px] font-bold uppercase rounded">
                {language === 'en' ? 'Gemini AI Advisor' : 'Trí tuệ nhân tạo Gemini'}
              </span>
            </div>
            <p className="text-xs text-[#555] mt-0.5">
              {language === 'en' 
                ? 'Heritage etiquette advisor & customized event outfit recommendations'
                : 'Cố vấn trang phục cổ truyền chuẩn điển chế & cá nhân hóa sự kiện'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowContextPanel(!showContextPanel)}
            className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors cursor-pointer flex items-center gap-1.5 ${
              showContextPanel ? 'bg-[#A4161A] text-white border-[#A4161A]' : 'bg-[#F6EFE3] text-[#1A1A1A] border-[#D8CEBE] hover:border-[#A4161A]'
            }`}
          >
            <Calendar size={14} />
            <span>
              {showContextPanel 
                ? (language === 'en' ? 'Hide Context' : 'Thu gọn ngữ cảnh') 
                : (language === 'en' ? 'Select Context' : 'Chọn ngữ cảnh tư vấn')}
            </span>
          </button>

          <button
            onClick={handleResetChat}
            className="p-1.5 text-[#666] hover:text-[#A4161A] hover:bg-[#E8DEC8] rounded transition-colors cursor-pointer"
            title={language === 'en' ? 'Reset conversation' : 'Làm mới cuộc trò chuyện'}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Context Selection Panel */}
      {showContextPanel && (
        <div className="bg-[#FAF6ED] border border-[#B8862B] p-4 sm:p-5 rounded mb-6 shadow-xs animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#A4161A] mb-3 pb-2 border-b border-[#E8DEC8]">
            <Sparkles size={14} className="text-[#D4A347]" />
            <span>{language === 'en' ? 'Customize Your Styling Context' : 'Thiết Lập Ngữ Cảnh Tư Vấn Của Bạn'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
            {/* Context: Địa điểm */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <MapPin size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Destination:' : 'Địa điểm đến:'}</span>
              </label>
              <select
                value={contextLocation}
                onChange={(e) => setContextLocation(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Hà Nội (Văn Miếu, Phố Cổ)">Hà Nội (Văn Miếu, Hồ Gươm, Hoàng thành)</option>
                <option value="Cố đô Huế (Đại Nội, Lăng tẩm)">Cố đô Huế (Đại Nội, Lăng tẩm, Chùa Thiên Mụ)</option>
                <option value="Phố cổ Hội An (Bến sông, Đèn lồng)">Phố cổ Hội An (Chùa Cầu, Bến sông Hoài)</option>
                <option value="TP. Hồ Chí Minh (Bảo tàng, Nhà hát)">TP. Hồ Chí Minh (Bảo tàng Mỹ thuật, Lăng Ông)</option>
                <option value="Chùa chiền cổ kính (Chùa Thầy, Bái Đính)">Chùa chiền thanh tịnh (Chùa Thầy, Hương, Yên Tử)</option>
              </select>
            </div>

            {/* Context: Sự kiện */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <Calendar size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Event / Purpose:' : 'Sự kiện / Mục đích:'}</span>
              </label>
              <select
                value={contextEvent}
                onChange={(e) => setContextEvent(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Chụp ảnh kỷ yếu tốt nghiệp">{language === 'en' ? 'Graduation photo shoot' : 'Chụp ảnh kỷ yếu tốt nghiệp học sinh/sinh viên'}</option>
                <option value="Lễ cưới hỏi, đón dâu truyền thống">{language === 'en' ? 'Traditional wedding ceremony' : 'Lễ cưới hỏi, đính hôn, rước dâu'}</option>
                <option value="Đi lễ chùa, cầu an đầu năm">{language === 'en' ? 'Pagoda visit / spiritual blessings' : 'Đi lễ chùa, tế lễ gia tiên đầu xuân'}</option>
                <option value="Dạo phố Tết, du xuân chụp ảnh">{language === 'en' ? 'Spring festival / street photos' : 'Dạo phố ngày Tết, du xuân cùng bạn bè'}</option>
                <option value="Hội nghị, giao lưu văn hóa quốc tế">{language === 'en' ? 'International cultural exchange' : 'Hội thảo, giao lưu văn hóa quốc tế'}</option>
              </select>
            </div>

            {/* Context: Thời tiết */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <CloudSun size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Weather:' : 'Thời tiết:'}</span>
              </label>
              <select
                value={contextWeather}
                onChange={(e) => setContextWeather(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Mát mẻ mùa thu đông">{language === 'en' ? 'Cool autumn / winter (20 - 25°C)' : 'Mát mẻ mùa thu đông (20 - 25°C)'}</option>
                <option value="Nắng hè oi bức">{language === 'en' ? 'Hot summer (over 30°C)' : 'Nắng hè oi bức (trên 30°C)'}</option>
                <option value="Se lạnh đầu xuân">{language === 'en' ? 'Crisp early spring with light mist' : 'Se lạnh đầu xuân có mưa phùn'}</option>
              </select>
            </div>

            {/* Context: Giới tính */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <User size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Wearer:' : 'Người mặc:'}</span>
              </label>
              <select
                value={contextGender}
                onChange={(e) => setContextGender(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Nữ giới">{language === 'en' ? 'Female' : 'Nữ giới'}</option>
                <option value="Nam giới">{language === 'en' ? 'Male' : 'Nam giới'}</option>
                <option value="Cặp đôi (Nam & Nữ)">{language === 'en' ? 'Couple matching' : 'Cặp đôi (Nam & Nữ tông xuyệt tông)'}</option>
                <option value="Nhóm bạn bè kỷ yếu">{language === 'en' ? 'Group of friends' : 'Nhóm bạn bè kỷ yếu tập thể'}</option>
              </select>
            </div>

            {/* Context: Ngân sách */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <DollarSign size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Budget range:' : 'Ngân sách dự tính:'}</span>
              </label>
              <select
                value={contextBudget}
                onChange={(e) => setContextBudget(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Học sinh - Sinh viên (thuê đồ tiết kiệm)">{language === 'en' ? 'Budget friendly / Student' : 'Học sinh - Sinh viên (thuê đồ tiết kiệm dưới 300k)'}</option>
                <option value="Tầm trung phổ thông (500k - 1tr)">{language === 'en' ? 'Mid-range standard' : 'Tầm trung phổ thông (500k - 1 triệu)'}</option>
                <option value="May đo cao cấp lụa tơ tằm thượng phẩm">{language === 'en' ? 'Premium hand-tailored silk' : 'May đo cao cấp lụa tơ tằm thượng phẩm'}</option>
              </select>
            </div>

            {/* Context: Phong cách */}
            <div>
              <label className="flex items-center gap-1 text-[#666] font-medium mb-1">
                <Shirt size={13} className="text-[#A4161A]" />
                <span>{language === 'en' ? 'Style preference:' : 'Phong cách ưu tiên:'}</span>
              </label>
              <select
                value={contextStyle}
                onChange={(e) => setContextStyle(e.target.value)}
                className="w-full bg-[#F6EFE3] border border-[#CFC3B0] rounded p-2 text-[#1A1A1A] focus:outline-none focus:border-[#A4161A]"
              >
                <option value="Thuần cổ phục chuẩn chỉ điển chế">{language === 'en' ? 'Strict historical authenticity' : 'Thuần cổ phục chuẩn chỉ điển chế'}</option>
                <option value="Cách tân hiện đại trẻ trung">{language === 'en' ? 'Modernized & comfortable' : 'Cách tân hiện đại trẻ trung tiện lợi'}</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Suggested Quick Question Chips */}
      <div className="mb-4">
        <span className="text-xs text-[#777] block mb-2 font-medium">
          {language === 'en' ? 'Suggested Quick Inquiries:' : 'Gợi ý câu hỏi nhanh:'}
        </span>
        <div className="flex flex-wrap gap-2">
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-[#FAF6ED] hover:bg-[#A4161A]/10 border border-[#D8CEBE] hover:border-[#A4161A] text-xs text-[#2A2A2A] rounded-full transition-colors cursor-pointer text-left disabled:opacity-50"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] rounded p-4 sm:p-6 min-h-[420px] max-h-[620px] overflow-y-auto space-y-6 shadow-inner">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-serif ${
                  isUser
                    ? 'bg-[#1F2A44] text-white'
                    : 'bg-[#A4161A] text-[#FAF6ED] border border-[#D4A347]'
                }`}
              >
                {isUser ? <User size={16} /> : 'VÂN'}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[78%] flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-4 rounded text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                    isUser
                      ? 'bg-[#1F2A44] text-[#FAF6ED]'
                      : 'bg-[#F6EFE3] text-[#1A1A1A] border border-[#E0D5C3]'
                  }`}
                >
                  {/* Clean up the config/JSON code block from message display if present */}
                  {formatStylistContent(msg.content)}
                </div>

                {/* Interactive Action Card if AI Suggested an Outfit */}
                {!isUser && msg.outfitConfig && (
                  <div className="mt-3 p-3.5 bg-[#FAF6ED] border-2 border-[#B8862B] rounded w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs animate-in zoom-in-95">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[#A4161A] tracking-wider">
                        {language === 'en' ? "Van's Recommended Outfit:" : 'Gợi ý phối đồ từ Vân:'}
                      </div>
                      <div className="font-serif font-bold text-sm text-[#1A1A1A]">
                        {msg.outfitConfig.costumeName || msg.outfitConfig.costumeId}
                      </div>
                      {msg.outfitConfig.colorName && (
                        <div className="text-[11px] text-[#555] flex items-center gap-1.5 mt-0.5">
                          {msg.outfitConfig.colorHex && (
                            <span
                              className="w-3 h-3 rounded-full border border-black/10 inline-block"
                              style={{ backgroundColor: msg.outfitConfig.colorHex }}
                            />
                          )}
                          <span>{msg.outfitConfig.colorName}</span>
                        </div>
                      )}
                      {msg.outfitConfig.accessories && msg.outfitConfig.accessories.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {msg.outfitConfig.accessories.map((acc, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] px-1.5 py-0.5 bg-[#F6EFE3] border border-[#D8CEBE] rounded text-[#444]"
                            >
                              {acc}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => onApplyOutfitToStudio(msg.outfitConfig!)}
                      className="px-3.5 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold rounded uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                    >
                      <Sparkles size={14} className="text-[#D4A347]" />
                      <span>{language === 'en' ? 'Try this in Studio' : 'Thử phối bộ này'}</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                )}

                <span className="text-[10px] text-[#888] mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#A4161A] text-[#FAF6ED] border border-[#D4A347] flex items-center justify-center shrink-0 font-serif text-xs">
              VÂN
            </div>
            <div className="bg-[#F6EFE3] border border-[#E0D5C3] p-4 rounded text-xs text-[#666] flex items-center gap-2">
              <RefreshCw size={15} className="animate-spin text-[#A4161A]" />
              <span>{language === 'en' ? 'Van is reviewing historical archives and composing your styling advice...' : 'Vân đang tra cứu sử liệu và soạn bài tư vấn cho bạn...'}</span>
            </div>
          </div>
        )}

        {/* Error Notice with Retry */}
        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={15} className="text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
            <button
              onClick={() => handleSendMessage()}
              className="text-xs font-semibold text-red-900 underline ml-3 cursor-pointer"
            >
              {language === 'en' ? 'Retry' : 'Thử lại'}
            </button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-4 flex items-center gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder={language === 'en' ? 'Ask Van about choosing attire, etiquette, colors, occasions...' : 'Hỏi Vân về cách chọn cổ phục, dịp mặc, phối màu, phụ kiện...'}
            className="w-full bg-[#FAF6ED] border border-[#D8CEBE] rounded px-4 py-3 text-xs sm:text-sm text-[#1A1A1A] placeholder-[#888] focus:outline-none focus:border-[#A4161A] pr-10 shadow-xs"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={!inputPrompt.trim() || isLoading}
          className="px-5 py-3 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-xs"
        >
          <span>{language === 'en' ? 'Send' : 'Gửi'}</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
};
