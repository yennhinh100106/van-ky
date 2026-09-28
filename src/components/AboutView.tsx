import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, AlertTriangle, Layers, ExternalLink } from 'lucide-react';
import { HeritageCorner, CloudMotif, LotusMotif, VanKySeal } from './TraditionalPattern';

export const AboutView: React.FC = () => {
  const sources = [
    {
      title: "Khâm Định Đại Nam Hội Điển Sự Lệ",
      author: "Nội các triều Nguyễn biên soạn (1851)",
      category: "Điển chế triều đình",
      desc: "Bộ chính thư ghi chép toàn bộ quy chế phẩm trật y phục, đồ trang sức của Hoàng đế, Hậu phi, Hoàng thân và bách quan triều Nguyễn."
    },
    {
      title: "Ngàn Năm Áo Mũ",
      author: "Nhà nghiên cứu Trần Quang Đức (NXB Thế Giới, 2013)",
      category: "Khảo cứu học thuật đương đại",
      desc: "Công trình phục dựng hệ thống trang phục Việt Nam qua nghìn năm từ thời Lý, Trần, Lê sơ, Lê Trung Hưng tới triều Nguyễn dựa trên thư tịch và hiện vật."
    },
    {
      title: "Đại Việt Sử Ký Toàn Thư",
      author: "Ngô Sĩ Liên & Quốc sử quán các triều đại",
      category: "Chính sử Đại Việt",
      desc: "Ghi chép các chiếu chỉ định chế y phục qua các thời Lý, Trần, Lê sơ, quy định trang phục quân vương và thường dân."
    },
    {
      title: "Việt Nam Văn Hóa Sử Cương",
      author: "Học giả Đào Duy Anh (1938)",
      category: "Xã hội & Phong tục học",
      desc: "Khái quát nếp sống, thẩm mỹ may mặc, phong tục vấn khăn, nhuộm răng và tập quán phục sức của người Việt xưa."
    },
    {
      title: "Lịch Triều Hiến Chương Loại Chí (Lễ nghi chí & Quan chức chí)",
      author: "Bác học Phan Huy Chú (1821)",
      category: "Bách khoa thư cổ điển",
      desc: "Khảo cứu cặn kẽ về lễ phục tế tự, quan phục chầu triều, áo cổ tròn Viên Lĩnh và mũ Ô Sa qua các triều đại."
    },
    {
      title: "Tư Liệu Hiện Vật Bảo Tàng Cổ Vật Cung Đình Huế & Bảo Tàng Lịch Sử Quốc Gia",
      author: "Cơ quan lưu trữ di sản quốc gia",
      category: "Hiện vật & Khảo cổ học",
      desc: "Các mẫu áo Nhật Bình gốc của Hoàng hậu Nam Phương, áo Tấc thời Nguyễn, tượng gỗ thế kỷ 17 chùa Bút Tháp và chùa Phật Tích."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Editorial Title Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#B8862B] font-medium mb-1">
          <CloudMotif className="w-6 h-3 text-[#B8862B]" />
          <span>Văn Hiến · Học Thuật · Tôn Trọng</span>
          <CloudMotif className="w-6 h-3 text-[#B8862B] rotate-180" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A1A] leading-tight">
          Giới Thiệu & Nguồn Sử Liệu
        </h1>
        <p className="mt-3 text-sm sm:text-base text-[#4A4A4A] leading-relaxed">
          Sứ mệnh của "VẬN KỲ" là đem tà áo cổ truyền bước ra từ trang sử sách và tủ kính bảo tàng, 
          hòa nhịp cùng phong cách đương đại của người trẻ với sự tôn trọng tuyệt đối dành cho cội nguồn.
        </p>
      </div>

      {/* Tuyên ngôn sứ mệnh */}
      <section className="relative bg-[#FAF6ED] border border-[#D8CEBE] p-6 sm:p-8 rounded shadow-xs">
        <HeritageCorner position="top-right" />
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#A4161A] font-bold mb-2">
            <LotusMotif size={16} />
            <span>Tuyên Ngôn Dự Án</span>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-4 leading-snug">
            "Phối Việt phục theo cách của bạn – nhưng không làm phai mờ hồn cốt tiền nhân"
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#3A3A3A] leading-relaxed">
            <p>
              Cổ phục Việt Nam đang trải qua một thời kỳ phục hưng rực rỡ trong lòng thế hệ trẻ. Từ sân trường ngày bế giảng, lễ cưới truyền thống cho tới những bộ ảnh kỷ yếu, tà Áo ngũ thân, áo tấc hay nhật bình ngày càng hiện diện thân thương.
            </p>
            <p>
              Tuy nhiên, ranh giới giữa <em>"sáng tạo cách tân"</em> và <em>"lai căng sai lệch điển chế"</em> đôi khi còn mong manh do thiếu thốn tư liệu hệ thống hóa. VẬN KỲ ra đời nhằm trở thành một thư viện trực quan, chuẩn xác và sinh động, giúp bất kỳ bạn trẻ nào cũng có thể tự tin tra cứu, thử phối và thấu hiểu chiều sâu văn hóa của bộ trang phục mình khoác lên.
            </p>
            <div className="pt-2 text-xs text-[#7A6B58] italic border-t border-[#E8DEC8]">
              Cố vấn nghiên cứu & khảo dịch thư tịch: TS. Nguyễn Thị Hương, cùng nhóm cộng tác viên phục dựng văn hóa di sản VẬN KỲ.
            </div>
          </div>
        </div>
      </section>

      {/* Quy trình kiểm chứng thông tin 4 bước */}
      <section className="space-y-4">
        <div className="text-center sm:text-left">
          <span className="text-xs uppercase tracking-widest text-[#B8862B] font-medium block">
            Phương Pháp Luận
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A]">
            Quy Trình Kiểm Chứng Thông Tin Văn Hóa
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs space-y-2">
            <div className="w-8 h-8 rounded bg-[#A4161A]/10 text-[#A4161A] font-bold flex items-center justify-center font-serif text-sm">
              01
            </div>
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
              Khảo Sát Thư Tịch Gốc
            </h3>
            <p className="text-[#555] leading-relaxed">
              Truy nguyên các bộ chính sử, hội điển triều đình (Đại Nam Thực Lục, Khâm Định Hội Điển) để xác minh niên đại và điển chế phẩm cấp.
            </p>
          </div>

          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs space-y-2">
            <div className="w-8 h-8 rounded bg-[#B8862B]/10 text-[#B8862B] font-bold flex items-center justify-center font-serif text-sm">
              02
            </div>
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
              Đối Chiếu Hiện Vật
            </h3>
            <p className="text-[#555] leading-relaxed">
              So sánh đồ án hoa văn, chất liệu tơ lụa và kết cấu đường may với các hiện vật thực tế lưu giữ tại các bảo tàng và di tích quốc gia.
            </p>
          </div>

          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs space-y-2">
            <div className="w-8 h-8 rounded bg-[#1F2A44]/10 text-[#1F2A44] font-bold flex items-center justify-center font-serif text-sm">
              03
            </div>
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
              Tham Vấn Chuyên Gia
            </h3>
            <p className="text-[#555] leading-relaxed">
              Đối thoại cùng các nhà nghiên cứu lịch sử trang phục, nghệ nhân may đo cổ truyền và các hội quán cổ phong uy tín tại Hà Nội, Huế, TP.HCM.
            </p>
          </div>

          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center font-serif text-sm">
              04
            </div>
            <h3 className="font-serif font-bold text-sm text-[#1A1A1A] leading-snug">
              Phản Biện & Cập Nhật
            </h3>
            <p className="text-[#555] leading-relaxed">
              Minh bạch mức độ chắc chắn của từng dữ liệu. Sẵn sàng tiếp thu các phát hiện khảo cổ học mới để liên tục hiệu chỉnh dữ liệu.
            </p>
          </div>
        </div>
      </section>

      {/* Danh sách nguồn sử liệu tham khảo */}
      <section className="space-y-4">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#B8862B] font-medium block">
            Tài Liệu Căn Cứ
          </span>
          <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] leading-snug">
            Danh Mục Thư Tịch & Nguồn Tham Khảo
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sources.map((src, idx) => (
            <div
              key={idx}
              className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase text-[#A4161A] tracking-wider">
                    {src.category}
                  </span>
                </div>
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-1">
                  {src.title}
                </h3>
                <div className="text-[11px] text-[#888] italic mb-2">
                  Tác giả / Cơ quan: {src.author}
                </div>
                <p className="text-[#4A4A4A] leading-relaxed">
                  {src.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Ghi chú: Thông tin đang được kiểm chứng */}
      <section className="p-5 bg-[#FFFBEB] border-l-4 border-[#B8862B] rounded-r space-y-2">
        <div className="flex items-center gap-2 text-[#B8862B] font-bold text-sm">
          <AlertTriangle size={18} />
          <span>Ghi Chú Đạo Đức Nghiên Cứu & Tính Khách Quan</span>
        </div>
        <p className="text-xs sm:text-sm text-[#785E23] leading-relaxed">
          Nền văn minh y phục Đại Việt trải qua hàng ngàn năm chiến tranh tao loạn nên nhiều thư tịch và hiện vật đã thất lạc. Các thông tin về thời Lý, Trần, Hậu Lê trên nền tảng VẬN KỲ được xây dựng dựa trên các tranh tượng và khảo dị tốt nhất hiện có. Chúng tôi gắn nhãn rõ <strong>"Mức độ chắc chắn của thông tin"</strong> trên từng trang phục và cam kết không bịa đặt những chi tiết lịch sử chưa có chứng cứ khảo cổ xác đáng.
        </p>
      </section>
    </div>
  );
};
