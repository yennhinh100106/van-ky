import { AccessoryItem } from '../types/lookbook';

export const ACCESSORIES_DATA: AccessoryItem[] = [
  {
    id: "khan-dong",
    name: "Khăn đóng (Khăn xếp)",
    category: "headwear",
    period: "Thời Nguyễn (1744 - nay)",
    origin: "Định chế thời chúa Nguyễn Phúc Khoát và vua Minh Mạng",
    meaning: "Biểu trưng cho phong thái đĩnh đạc, trật tự, tôn nghiêm của sĩ phu và quan viên Việt Nam.",
    compatibleWith: [
      "ao-tac", "ao-tac-02",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06"
    ],
    incompatibleWith: ["ao-tu-than", "tu-than-04"],
    incompatibilityReason: "Khăn đóng chữ Nhất/Nhân của phái lễ nghi không nên phối cùng áo tứ thân mộc mạc thôn dã.",
  },
  {
    id: "khan-vanh-day",
    name: "Khăn vành dây",
    category: "headwear",
    period: "Triều Nguyễn (1802 - 1945)",
    origin: "Nghi lễ cung đình Huế dành cho Hậu phi, Công chúa và mệnh phụ",
    meaning: "Biểu tượng của tôn quý tối thượng, phẩm hàm cao quý chốn kinh kỳ.",
    compatibleWith: ["nhat-binh", "ao-nhat-binh", "nhat-binh-01"],
    incompatibleWith: ["ao-tu-than", "tu-than-04", "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03"],
    incompatibilityReason: "Khăn vành dây là phụ kiện cung đình tối cao; phối với áo tứ thân dân gian sẽ gây lệch lạc giai tầng và sai lệch lịch sử nghiêm trọng.",
  },
  {
    id: "non-quai-thao",
    name: "Nón quai thao (Ba tầm)",
    category: "headwear",
    period: "Thế kỷ 12 - đầu thế kỷ 20",
    origin: "Đồng bằng sông Hồng, làng Chuông (Hà Tây cũ)",
    meaning: "Biểu tượng duyên dáng của thiếu nữ Kinh Bắc, đi cùng câu hò quan họ và hội xuân làng quê.",
    compatibleWith: ["ao-tu-than", "tu-than-04", "ao-giao-linh", "giao-linh-05"],
    incompatibleWith: ["nhat-binh", "ao-nhat-binh", "nhat-binh-01", "ao-vien-linh", "vien-linh-08"],
    incompatibilityReason: "Nón quai thao là biểu trưng dân dã Kinh Bắc, không thể dùng cho triều phục hoặc cung thất hoàng gia.",
  },
  {
    id: "non-la",
    name: "Nón lá chóp nhọn",
    category: "headwear",
    period: "Thời phong kiến đến hiện đại",
    origin: "Nón lá bài thơ xứ Huế, làng nón Dạ Lê",
    meaning: "Nét duyên e ấp, che nắng che mưa, gắn liền với tâm hồn dịu dàng của người phụ nữ Việt.",
    compatibleWith: [
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06", "ao-dai-cach-tan", "ao-dai-cach-tan-07",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-tu-than", "tu-than-04"
    ],
    incompatibleWith: ["ao-vien-linh", "vien-linh-08"],
    incompatibilityReason: "Nón lá thông tục không phối với quan phục đại triều Viên Lĩnh.",
  },
  {
    id: "khan-mo-qua",
    name: "Khăn vuông mỏ quạ",
    category: "headwear",
    period: "Thời Lê - Nguyễn",
    origin: "Văn hóa dân gian vùng đồng bằng Bắc Bộ",
    meaning: "Tôn vinh khuôn mặt trái xoan, nụ cười e ấp với hàm răng đen hạt huyền của phụ nữ xưa.",
    compatibleWith: ["ao-tu-than", "tu-than-04", "ao-giao-linh", "giao-linh-05"],
    incompatibleWith: ["nhat-binh", "ao-nhat-binh", "nhat-binh-01"],
    incompatibilityReason: "Khăn mỏ quạ là thức trang sức mộc mạc dân gian, không dùng cho cung đình.",
  },
  {
    id: "man-ngu-sac",
    name: "Mấn đội đầu",
    category: "headwear",
    period: "Thế kỷ 20 - Nay",
    origin: "Cách tân từ khăn vấn thời cận đại",
    meaning: "Nét trang nhã, thanh tú giúp cố định mái tóc trong các dịp hỷ sự và lễ tốt nghiệp.",
    compatibleWith: [
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06", "ao-dai-cach-tan", "ao-dai-cach-tan-07",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-tac", "ao-tac-02"
    ],
  },
  {
    id: "tram-cai-vang",
    name: "Trâm cài tóc khảm ngọc",
    category: "jewelry",
    period: "Lý - Trần - Lê - Nguyễn",
    origin: "Nghề kim hoàn thợ bạc Đồng Xâm, Định Công",
    meaning: "Biểu thị phẩm hạnh đoan trang, tiết thấu cao quý của bậc khuê tú tiểu thư.",
    compatibleWith: [
      "nhat-binh", "ao-nhat-binh", "nhat-binh-01",
      "ao-doi-kham",
      "ao-giao-linh", "giao-linh-05",
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06"
    ],
  },
  {
    id: "vong-kieng",
    name: "Kiềng bạc / vàng chạm cánh sen",
    category: "jewelry",
    period: "Cổ đại đến nay",
    origin: "Trang sức cổ truyền khắp ba miền đất Việt",
    meaning: "Vòng tròn viên mãn, sự trọn vẹn và đức hạnh của người phụ nữ.",
    compatibleWith: [
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06", "ao-dai-cach-tan", "ao-dai-cach-tan-07",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-tu-than", "tu-than-04",
      "ao-doi-kham",
      "ao-tac", "ao-tac-02"
    ],
  },
  {
    id: "chuoi-xa-tich",
    name: "Xà tích bạc móc hông",
    category: "jewelry",
    period: "Thời Nguyễn",
    origin: "Bộ đồ trang sức cài hông của phụ nữ Huế và Bắc Bộ",
    meaning: "Kêu leng keng nhè nhẹ theo nhịp bước, xua đuổi tà khí và tôn vinh vạt áo tha thướt.",
    compatibleWith: [
      "nhat-binh", "ao-nhat-binh", "nhat-binh-01",
      "ao-tu-than", "tu-than-04",
      "ao-tac", "ao-tac-02"
    ],
  },
  {
    id: "that-lung-lua",
    name: "Thắt lưng bao lụa ngũ sắc",
    category: "belt",
    period: "Thời Lê - Nguyễn",
    origin: "Dệt lụa tơ tằm Vạn Phúc - Hà Đông",
    meaning: "Sự khéo léo vun vén, ngũ sắc đại diện ngũ phúc lâm môn (Phú, Quý, Thọ, Khang, Ninh).",
    compatibleWith: [
      "ao-tu-than", "tu-than-04",
      "ao-giao-linh", "giao-linh-05",
      "ao-doi-kham"
    ],
  },
  {
    id: "quat-xep-lua",
    name: "Quạt xếp vẽ tranh thủy mặc",
    category: "handheld",
    period: "Thời Lý - Nguyễn",
    origin: "Làng quạt Chàng Sơn (Hà Nội)",
    meaning: "Thần thái phong nhã, cốt cách tao nhân mặc khách và sự kín đáo khi giao tiếp.",
    compatibleWith: [
      "nhat-binh", "ao-nhat-binh", "nhat-binh-01",
      "ao-tac", "ao-tac-02",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06", "ao-dai-cach-tan", "ao-dai-cach-tan-07",
      "ao-giao-linh", "giao-linh-05",
      "ao-doi-kham",
      "ao-vien-linh", "vien-linh-08"
    ],
  },
  {
    id: "guoc-moc",
    name: "Guốc mộc móng quỷ mũi cong",
    category: "footwear",
    period: "Thời Lê - Nguyễn",
    origin: "Làng guốc Yên Xá, guốc gỗ thông truyền thống",
    meaning: "Âm thanh lốc cốc mộc mạc trên sân gạch Bát Tràng, gìn giữ nếp nhà xưa thanh bạch.",
    compatibleWith: [
      "ao-tu-than", "tu-than-04",
      "ao-ngu-than-tay-chen", "ao-ngu-than", "ngu-than-03",
      "ao-tac", "ao-tac-02",
      "ao-dai", "ao-dai-co-phuc", "ao-dai-hien-dai-06", "ao-dai-cach-tan", "ao-dai-cach-tan-07"
    ],
  }
];

export const PRESET_TONES = [
  {
    id: "cung-dinh",
    name: "Rực rỡ cung đình",
    desc: "Sắc đỏ son, vàng hoàng yến, tím hoa cà vương giả",
    colors: ["#A4161A", "#D4A347", "#6C3461", "#B02E40"]
  },
  {
    id: "co-dien",
    name: "Trầm cổ điển",
    desc: "Xanh chàm đại thanh, nâu củ nâu, xanh rêu sĩ phu",
    colors: ["#1F2A44", "#5D3A24", "#234E42", "#4A3222"]
  },
  {
    id: "genz-pastel",
    name: "Pastel Gen Z",
    desc: "Hồng đào cánh sen, xanh lưu ly nhạt, trắng ngà lụa tơ",
    colors: ["#E5989B", "#90A955", "#8ECAE6", "#F5EBE0"]
  },
  {
    id: "don-sac",
    name: "Đơn sắc trang nhã",
    desc: "Trắng tơ tằm, đen mun lĩnh, xám khói thiền định",
    colors: ["#FAF8F5", "#2B2D42", "#8D99AE", "#495057"]
  }
];

export const TRADITIONAL_COLORS = [
  { name: "Đỏ son chu sa", hex: "#A4161A", element: "Hỏa", desc: "Hỷ sự cát tường, quyền uy và may mắn" },
  { name: "Vàng nghệ hoàng cung", hex: "#D4A347", element: "Thổ", desc: "Trung tâm vương triều, thịnh vượng no ấm" },
  { name: "Xanh chàm mộc", hex: "#1F2A44", element: "Thủy", desc: "Điềm đạm, trang nghiêm, mực thước sĩ phu" },
  { name: "Nâu non đồng nội", hex: "#5D3A24", element: "Thổ", desc: "Mộc mạc, gần gũi, đạo đức khiêm nhường" },
  { name: "Trắng ngà lụa tơ", hex: "#F3EDE2", element: "Kim", desc: "Thanh khiết, trong sáng như tâm hồn người hiền" },
  { name: "Hồng đào cánh sen", hex: "#C95A72", element: "Hỏa", desc: "Duyên dáng xuân thì, hương sắc dịu dàng" },
  { name: "Xanh lục bích", hex: "#234E42", element: "Mộc", desc: "Sức sống trường tồn của thảo mộc non sông" },
  { name: "Tím tử điều (Huế)", hex: "#5E2B4B", element: "Hỏa/Thủy", desc: "Nét đài các trầm mặc của người con xứ cố đô" },
  { name: "Xanh lưu ly thiên thanh", hex: "#2A5C8A", element: "Thủy", desc: "Trời xanh bao la, lòng từ ái vô biên" },
  { name: "Đen mun lĩnh Bưởi", hex: "#1A1A1A", element: "Thủy", desc: "Sâu lắng, đoan chính và huyền bí" }
];
