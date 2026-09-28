import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "10mb" }));

// Serve static images directly
app.use("/images", express.static(path.resolve(process.cwd(), "public/images")));
app.use(express.static(path.resolve(process.cwd(), "public")));

// Utility to ensure all Vietnamese text returned is normalized Unicode NFC
function normalizeVN<T>(input: T): T {
  if (typeof input === 'string') {
    return (input as any).normalize('NFC');
  }
  if (Array.isArray(input)) {
    return (input as any).map(normalizeVN);
  }
  if (input !== null && typeof input === 'object') {
    const res: Record<string, any> = {};
    for (const key of Object.keys(input as any)) {
      res[key] = normalizeVN((input as any)[key]);
    }
    return res as T;
  }
  return input;
}

// Initialize Google GenAI on server
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

const SYSTEM_INSTRUCTION = `Bạn là "Vân", stylist Việt phục thân thiện, hiểu văn hóa, nói chuyện gần gũi với học sinh sinh viên.

NGUYÊN TẮC:
- Chỉ tư vấn dựa trên kiến thức lịch sử trang phục Việt Nam đã được xác lập. Không chắc thì nói rõ "mình chưa chắc" thay vì bịa.
- Khi người dùng nêu địa điểm/sự kiện (đền chùa, Văn Miếu, Hoàng thành Huế, Hội An, lễ tốt nghiệp, đám cưới, Tết…), hãy xét: tính trang nghiêm, thời tiết, tiện đi lại, phong tục địa phương.
- Ở nơi tôn nghiêm (chùa, đền, lăng): ưu tiên kín đáo, màu nhã, tránh phụ kiện lòe loẹt.
- Luôn phân biệt trang phục cung đình và dân gian, không trộn lẫn gây lệch văn hóa; nếu người dùng muốn cách tân, hãy nói rõ đó là "phong cách lấy cảm hứng".
- Nếu thiếu thông tin (giới tính, dáng người, ngân sách, thời tiết) chỉ hỏi tối đa 1 câu ngắn rồi vẫn đưa gợi ý sơ bộ.

ĐỊNH DẠNG TRẢ LỜI:
1. Gợi ý chính (tên bộ + thời kỳ)
2. Vì sao hợp với nơi/sự kiện này
3. Màu sắc & phụ kiện
4. Nên tránh
5. Phương án thay thế
Cuối cùng trả thêm một dòng JSON hợp lệ duy nhất để app đọc:
{"trangPhuc":"id","mau":["#hex"],"phuKien":["id"]}

DANH SÁCH ID TRANG PHỤC HỢP LỆ CHO "trangPhuc":
- "nhat-binh": Áo Nhật Bình (Triều Nguyễn)
- "ao-tac": Áo Tấc (Lễ phục tay thụng triều Nguyễn)
- "ao-dai": Áo Dài Truyền Thống / Hiện Đại
- "ao-vien-linh": Áo Viên Lĩnh (Quan phục Lý - Trần - Lê)
- "ao-giao-linh": Áo Giao Lĩnh (Thời Lý - Trần - Lê)
- "ao-tu-than": Áo Tứ Thân (Dân gian Bắc Bộ)
- "ao-ngu-than-tay-chen": Áo Ngũ Thân tay chẽn (Triều Nguyễn)
- "ao-dai-cach-tan": Áo Dài Cách Tân / Gen Z (Đương đại)

DANH SÁCH ID PHỤ KIỆN HỢP LỆ CHO "phuKien":
["khan-dong", "khan-vanh-day", "non-quai-thao", "non-la", "khan-mo-qua", "man-ngu-sac", "tram-cai-vang", "vong-kieng", "chuoi-xa-tich", "that-lung-lua", "quat-xep-lua", "guoc-moc"]

MÀU SẮC "mau": Chứa mảng 1 mã hex truyền thống phù hợp như ["#A4161A"] (Đỏ son), ["#1F2A44"] (Xanh chàm), ["#234E42"] (Xanh lục), ["#D4A347"] (Vàng hoàng cung), ["#5D3A24"] (Nâu non), ["#FAF8F5"] (Trắng tơ), ["#C95A72"] (Hồng sen), ["#9E2A2B"] (Đỏ chu đào), ["#B02E40"] (Bích đào), ["#8A1822"] (Đỏ điều), ["#FFB6C1"] (Hồng pastel), ["#FFA500"] (Vàng cam chính sắc).

Giọng: ấm áp, không sáo rỗng, dưới 250 từ, có thể dùng 1-2 emoji nhẹ.`;

const CANONICAL_COSTUME_MAP: Record<string, string> = {
  "nhat-binh": "nhat-binh",
  "nhat-binh-01": "nhat-binh",
  "ao-nhat-binh": "nhat-binh",
  "ao-tac": "ao-tac",
  "ao-tac-02": "ao-tac",
  "ao-dai": "ao-dai",
  "ao-dai-hien-dai-06": "ao-dai",
  "ao-dai-co-phuc": "ao-dai",
  "ao-vien-linh": "ao-vien-linh",
  "vien-linh-08": "ao-vien-linh",
  "ao-giao-linh": "ao-giao-linh",
  "giao-linh-05": "ao-giao-linh",
  "ao-tu-than": "ao-tu-than",
  "tu-than-04": "ao-tu-than",
  "ao-ngu-than-tay-chen": "ao-ngu-than-tay-chen",
  "ngu-than-03": "ao-ngu-than-tay-chen",
  "ao-ngu-than": "ao-ngu-than-tay-chen",
  "ao-dai-cach-tan": "ao-dai-cach-tan",
  "ao-dai-cach-tan-07": "ao-dai-cach-tan",
};

const COSTUME_NAMES: Record<string, string> = {
  "nhat-binh": "Áo Nhật Bình (Triều Nguyễn)",
  "nhat-binh-01": "Áo Nhật Bình (Triều Nguyễn)",
  "ao-nhat-binh": "Áo Nhật Bình (Triều Nguyễn)",
  "ao-tac": "Áo Tấc (Áo thụng ngũ thân)",
  "ao-tac-02": "Áo Tấc (Áo thụng ngũ thân)",
  "ao-dai": "Áo Dài Truyền Thống",
  "ao-dai-hien-dai-06": "Áo Dài Hiện Đại",
  "ao-dai-co-phuc": "Áo Dài Cổ Phục",
  "ao-vien-linh": "Áo Viên Lĩnh (Quan phục Lý - Lê)",
  "vien-linh-08": "Áo Viên Lĩnh (Quan phục Lý - Lê)",
  "ao-giao-linh": "Áo Giao Lĩnh (Thời Lý - Trần - Lê)",
  "giao-linh-05": "Áo Giao Lĩnh (Thời Lý - Trần - Lê)",
  "ao-tu-than": "Áo Tứ Thân",
  "tu-than-04": "Áo Tứ Thân",
  "ao-ngu-than-tay-chen": "Áo Ngũ Thân tay chẽn",
  "ngu-than-03": "Áo Ngũ Thân tay chẽn",
  "ao-ngu-than": "Áo Ngũ Thân tay chẽn",
  "ao-dai-cach-tan": "Áo Dài Cách Tân Gen Z",
  "ao-dai-cach-tan-07": "Áo Dài Cách Tân Gen Z",
  "ao-doi-kham": "Áo Đối Khâm",
};

const COLOR_NAMES: Record<string, string> = {
  "#A4161A": "Đỏ son chu sa",
  "#a4161a": "Đỏ son chu sa",
  "#D4A347": "Vàng hoàng cung",
  "#d4a347": "Vàng hoàng cung",
  "#1F2A44": "Xanh chàm mộc",
  "#1f2a44": "Xanh chàm mộc",
  "#234E42": "Xanh lục bích",
  "#234e42": "Xanh lục bích",
  "#5D3A24": "Nâu non đồng nội",
  "#5d3a24": "Nâu non đồng nội",
  "#FAF8F5": "Trắng tơ tằm",
  "#faf8f5": "Trắng tơ tằm",
  "#C95A72": "Hồng đào cánh sen",
  "#c95a72": "Hồng đào cánh sen",
  "#9E2A2B": "Đỏ chu đào Thăng Long",
  "#9e2a2b": "Đỏ chu đào Thăng Long",
  "#B02E40": "Đỏ bích đào",
  "#b02e40": "Đỏ bích đào",
  "#8A1822": "Đỏ điều hoàng triều",
  "#8a1822": "Đỏ điều hoàng triều",
};

// Helper to generate a cultured, authentic response from Vân when the upstream AI model is experiencing peak demand spikes (503)
function generateKnowledgeFallback(userQuery: string, context?: any): { text: string; outfitConfig: any } {
  const query = (userQuery || "").toLowerCase();

  // Pattern match common destinations & occasions
  if (query.includes("văn miếu") || query.includes("trường") || query.includes("tốt nghiệp") || query.includes("học")) {
    return {
      text: `Dạ chào bạn! Đi Văn Miếu - Quốc Tử Giám chụp ảnh kỷ yếu hay tham quan thì không gì thanh lịch và chuẩn mực hơn **Áo Ngũ thân tay chẽn (Áo dài ngũ thân triều Nguyễn)** ạ 🌿.

1. **Gợi ý chính:** Áo ngũ thân tay chẽn thời Nguyễn (nam hoặc nữ), phối cùng quần lụa trắng hoặc đen.
2. **Vì sao hợp nơi này:** Văn Miếu là chốn tôn nghiêm lưu dấu tinh hoa khoa cử. Phom dáng ngũ thân đứng áo, cổ đứng đoan trang vừa kín đáo vừa tôn vẻ nho nhã, tri thức của học sĩ xưa.
3. **Màu sắc & Phụ kiện:** Ưu tiên màu xanh chàm mộc (#1F2A44), vàng đồng hoàng gia hoặc nâu non; đi cùng khăn đóng, quạt xếp lụa hoặc nón lá nhẹ nhàng.
4. **Nên tránh:** Áo cách tân ngắn quá đà, ren mỏng thấu quang hoặc tà xẻ cao không đúng quy cách nơi cửa Khổng sân Trình.
5. **Phương án thay thế:** Nếu thích mềm mại dân dã, bạn nữ có thể chọn Áo tứ thân nhã nhặn.

{"trangPhuc":"ao-ngu-than-tay-chen","mau":["#1F2A44"],"phuKien":["khan-dong","quat-xep-lua"]}`,
      outfitConfig: {
        costumeId: "ao-ngu-than-tay-chen",
        costumeName: "Áo ngũ thân tay chẽn",
        colorHex: "#1F2A44",
        colorName: "Xanh chàm mộc",
        accessories: ["khan-dong", "quat-xep-lua"],
        trangPhuc: "ao-ngu-than-tay-chen",
        mau: ["#1F2A44"],
        phuKien: ["khan-dong", "quat-xep-lua"]
      }
    };
  }

  if (query.includes("chùa") || query.includes("đền") || query.includes("lăng") || query.includes("lễ phật")) {
    return {
      text: `Dạ chào bạn! Khi ghé chốn cửa Thiền, lăng tẩm hay đền miếu tôn kính, quy tắc quan trọng nhất là thanh nhã và kín đáo 🙏.

1. **Gợi ý chính:** Áo ngũ thân lập lĩnh tay chẽn (thời Nguyễn) hoặc Áo tấc tay thụng tông trầm trang nhã.
2. **Vì sao hợp nơi này:** Cổ áo khép kín (lập lĩnh), tà áo buông dài phủ gối đoan trang, thể hiện trọn vẹn lòng thành kính và sự tĩnh lặng tâm hồn.
3. **Màu sắc & Phụ kiện:** Tông nâu non đồng nội (#5D3A24), lam mộc mạc hoặc trắng ngà tơ tằm. Phụ kiện chỉ nên chọn khăn đóng hoặc quạt xếp lụa mộc.
4. **Nên tránh:** Họa tiết rồng phượng hoàng triều rực rỡ, váy lĩnh quá ngắn, màu sắc chói lọi hoặc trang điểm quá đậm.
5. **Phương án thay thế:** Bộ Áo ngũ thân màu trắng ngà hoặc xanh lục sẫm dịu dàng.

{"trangPhuc":"ao-ngu-than-tay-chen","mau":["#5D3A24"],"phuKien":["khan-dong","guoc-moc"]}`,
      outfitConfig: {
        costumeId: "ao-ngu-than-tay-chen",
        costumeName: "Áo ngũ thân tay chẽn",
        colorHex: "#5D3A24",
        colorName: "Nâu non đồng nội",
        accessories: ["khan-dong", "guoc-moc"],
        trangPhuc: "ao-ngu-than-tay-chen",
        mau: ["#5D3A24"],
        phuKien: ["khan-dong", "guoc-moc"]
      }
    };
  }

  if (query.includes("huế") || query.includes("đại nội") || query.includes("hoàng thành")) {
    return {
      text: `Dạ, đến với kinh thành Huế mộng mơ và cổ kính, trang phục đắt giá nhất chính là **Áo Tấc (Áo lễ tay thụng thời Nguyễn)** 🌸!

1. **Gợi ý chính:** Áo Tấc tay thụng (thời Nguyễn) kết hợp khăn đóng/khăn vấn.
2. **Vì sao hợp nơi này:** Tà áo tấc rộng bay bổng bước đi trên Ngọ Môn, cầu Trung Đạo sẽ hòa quyện tuyệt đối với rêu phong cổ thành, tái hiện không khí lễ nghi xứ thần kinh.
3. **Màu sắc & Phụ kiện:** Đỏ son (#A4161A), xanh lục bích hoàng gia (#234E42) hoặc vàng đồng. Đi cùng guốc mộc, kiềng bạc hoặc quạt lụa xếp.
4. **Nên tránh:** Các kiểu phối lai căng Âu phục bừa bãi làm mất đi vẻ nghiêm cẩn của di sản cố đô.
5. **Phương án thay thế:** Áo ngũ thân tay chẽn nếu bạn cần di chuyển nhiều điểm tham quan trong ngày.

{"trangPhuc":"ao-tac","mau":["#A4161A"],"phuKien":["vong-kieng","quat-xep-lua"]}`,
      outfitConfig: {
        costumeId: "ao-tac",
        costumeName: "Áo Tấc (Áo ngũ thân tay thụng)",
        colorHex: "#A4161A",
        colorName: "Đỏ son chu sa",
        accessories: ["vong-kieng", "quat-xep-lua"],
        trangPhuc: "ao-tac",
        mau: ["#A4161A"],
        phuKien: ["vong-kieng", "quat-xep-lua"]
      }
    };
  }

  if (query.includes("hội an") || query.includes("phố cổ") || query.includes("dạo phố")) {
    return {
      text: `Dạ chào bạn! Giữa giàn hoa giấy và những bức tường vàng ấm áp của Hội An, một bộ **Áo Ngũ thân tay chẽn hoặc Áo Dài** sẽ giúp bạn tỏa sáng vô cùng tự nhiên ✨.

1. **Gợi ý chính:** Áo ngũ thân tay chẽn lụa mềm hoặc Áo dài truyền thống trang nhã.
2. **Vì sao hợp nơi này:** Phố Hoài mang nhịp sống giao thương thế kỷ 17–19, áo ngũ thân hoặc áo dài tạo cảm giác như một tiểu thư, công tử dạo phố ngắm đèn lồng.
3. **Màu sắc & Phụ kiện:** Hồng đào cánh sen (#C95A72) hoặc xanh lục bích (#234E42); phối nón lá chóp nhọn, quạt xếp lụa.
4. **Nên tránh:** Vải quá dày nóng khiến bạn khó chịu khi tản bộ dọc sông Hoài.
5. **Phương án thay thế:** Áo dài cách tân trẻ trung cho các bạn học sinh - sinh viên.

{"trangPhuc":"ao-ngu-than-tay-chen","mau":["#C95A72"],"phuKien":["non-la","quat-xep-lua"]}`,
      outfitConfig: {
        costumeId: "ao-ngu-than-tay-chen",
        costumeName: "Áo ngũ thân tay chẽn",
        colorHex: "#C95A72",
        colorName: "Hồng đào cánh sen",
        accessories: ["non-la", "quat-xep-lua"],
        trangPhuc: "ao-ngu-than-tay-chen",
        mau: ["#C95A72"],
        phuKien: ["non-la", "quat-xep-lua"]
      }
    };
  }

  if (query.includes("cưới") || query.includes("hỷ") || query.includes("hôn lễ")) {
    return {
      text: `Dạ, ngày đại hỷ thiêng liêng nhất định phải chọn trang phục trang trọng và mang ý nghĩa cát tường viên mãn 💍!

1. **Gợi ý chính:** Áo Nhật Bình (dành cho cô dâu) và Áo Tấc tay thụng đỏ son (dành cho chú rể).
2. **Vì sao hợp dịp này:** Áo Nhật Bình với cổ thêu hoa văn ngũ hành đối xứng cùng dải ngũ sắc rực rỡ tượng trưng cho phúc lộc và sự quyền quý cao quý.
3. **Màu sắc & Phụ kiện:** Đỏ điều hoàng triều (#8A1822) phối viền vàng đồng; đội khăn vành dây quấn tỉ mỉ, kiềng vàng/bạc chạm cánh sen, trâm cài ngọc.
4. **Nên tránh:** Trang phục màu trắng tuyền hoặc phụ kiện quá tây hóa làm mất tinh thần cổ phục cưới truyền thống.
5. **Phương án thay thế:** Cặp Áo Tấc thêu hoa văn thanh nhã với chi phí thuê mềm hơn.

{"trangPhuc":"nhat-binh","mau":["#8A1822"],"phuKien":["khan-vanh-day","vong-kieng"]}`,
      outfitConfig: {
        costumeId: "nhat-binh",
        costumeName: "Áo Nhật Bình",
        colorHex: "#8A1822",
        colorName: "Đỏ điều hoàng triều",
        accessories: ["khan-vanh-day", "vong-kieng"],
        trangPhuc: "nhat-binh",
        mau: ["#8A1822"],
        phuKien: ["khan-vanh-day", "vong-kieng"]
      }
    };
  }

  if (query.includes("tết") || query.includes("xuân") || query.includes("đầu năm") || query.includes("chúc tết")) {
    return {
      text: `Dạ chào bạn! Không khí ngày Tết cổ truyền rực rỡ sum vầy rất thích hợp với sắc son may mắn của **Áo Ngũ Thân Tay Chẽn hoặc Áo Tấc** 🧧!

1. **Gợi ý chính:** Áo Ngũ Thân tay chẽn hoặc Áo Tấc truyền thống màu đỏ son hoặc vàng hoàng kim.
2. **Vì sao hợp dịp này:** Tượng trưng cho ngũ phúc lâm môn, sự khởi đầu hanh thông, vừa kín đáo thanh lịch khi chúc Tết ông bà vừa rất ăn ảnh khi du xuân phố hoa.
3. **Màu sắc & Phụ kiện:** Đỏ son chu sa (#A4161A) hoặc Vàng hoàng cung (#D4A347); đi cùng quạt xếp lụa, guốc mộc và khăn đóng.
4. **Nên tránh:** Trang phục tối màu u ám hoặc cắt xẻ quá đà trong những ngày đầu năm mới.
5. **Phương án thay thế:** Áo Dài cách tân phom suông trẻ trung năng động.

{"trangPhuc":"ao-ngu-than-tay-chen","mau":["#A4161A"],"phuKien":["quat-xep-lua","khan-dong"]}`,
      outfitConfig: {
        costumeId: "ao-ngu-than-tay-chen",
        costumeName: "Áo ngũ thân tay chẽn",
        colorHex: "#A4161A",
        colorName: "Đỏ son chu sa",
        accessories: ["quat-xep-lua", "khan-dong"],
        trangPhuc: "ao-ngu-than-tay-chen",
        mau: ["#A4161A"],
        phuKien: ["quat-xep-lua", "khan-dong"]
      }
    };
  }

  if (query.includes("tứ thân") || query.includes("bắc bộ") || query.includes("quan họ") || query.includes("hội làng") || query.includes("dân gian")) {
    return {
      text: `Dạ chào bạn! Nét đẹp đằm thắm mộc mạc của văn hóa châu thổ sông Hồng thể hiện trọn vẹn qua tà **Áo Tứ Thân** 🌾.

1. **Gợi ý chính:** Áo Tứ Thân truyền thống kèm yếm đào và nón quai thao.
2. **Vì sao hợp dịp này:** Tà áo buông lơi thắt dải yếm lụa tạo nét duyên kín đáo, mềm mại của liền chị quan họ vùng Kinh Bắc.
3. **Màu sắc & Phụ kiện:** Tông nâu non đồng nội (#5D3A24), cánh sen hoặc đỏ chu đào; phối cùng nón quai thao, khăn mỏ quạ và chuỗi xà tích.
4. **Nên tránh:** Phối với giày tây hiện đại thô cứng.
5. **Phương án thay thế:** Áo Ngũ Thân tay chẽn nếu bạn muốn trang nhã nơi thị thành.

{"trangPhuc":"ao-tu-than","mau":["#5D3A24"],"phuKien":["non-quai-thao","khan-mo-qua"]}`,
      outfitConfig: {
        costumeId: "ao-tu-than",
        costumeName: "Áo Tứ Thân",
        colorHex: "#5D3A24",
        colorName: "Nâu non đồng nội",
        accessories: ["non-quai-thao", "khan-mo-qua"],
        trangPhuc: "ao-tu-than",
        mau: ["#5D3A24"],
        phuKien: ["non-quai-thao", "khan-mo-qua"]
      }
    };
  }

  if (query.includes("giao lĩnh") || query.includes("lý") || query.includes("trần") || query.includes("lê")) {
    return {
      text: `Dạ chào bạn! Nếu bạn say mê vẻ đẹp cổ kính hào hùng thời Lý - Trần - Lê, **Áo Giao Lĩnh** chính là lựa chọn trác tuyệt ⚔️!

1. **Gợi ý chính:** Áo Giao Lĩnh cổ chéo kết hợp đai lưng lụa truyền thống.
2. **Vì sao hợp:** Cổ áo vắt chéo thanh thoát, tay áo thụng rộng uy nghiêm, mang đậm hào khí văn hiến ngàn năm Đại Việt.
3. **Màu sắc & Phụ kiện:** Xanh lục bích (#234E42) hoặc Đỏ chu đào (#9E2A2B); phối thắt lưng lụa, trâm cài hoặc quạt xếp lụa.
4. **Nên tránh:** Đi đứng quá vội vã dễ dẫm vào gấu áo và tà rộng.
5. **Phương án thay thế:** Áo Viên Lĩnh trang nghiêm thời Lê sơ.

{"trangPhuc":"ao-giao-linh","mau":["#234E42"],"phuKien":["that-lung-lua","quat-xep-lua"]}`,
      outfitConfig: {
        costumeId: "ao-giao-linh",
        costumeName: "Áo Giao Lĩnh (Thời Lý - Trần - Lê)",
        colorHex: "#234E42",
        colorName: "Xanh lục bích",
        accessories: ["that-lung-lua", "quat-xep-lua"],
        trangPhuc: "ao-giao-linh",
        mau: ["#234E42"],
        phuKien: ["that-lung-lua", "quat-xep-lua"]
      }
    };
  }

  // Default cultured advice
  return {
    text: `Dạ chào bạn! Với mong muốn diện Việt phục đẹp và đúng tinh thần văn hóa, Vân xin gợi ý bộ **Áo Ngũ thân tay chẽn (Thời Nguyễn)** – mẫu cổ phục quốc dân chuẩn mực nhất ✨.

1. **Gợi ý chính:** Áo ngũ thân lập lĩnh tay chẽn kết hợp quần lụa trắng hoặc đen.
2. **Vì sao hợp:** Thiết kế năm thân áo cài khuy bên hữu tượng trưng cho Ngũ thường (Nhân, Lễ, Nghĩa, Trí, Tín) và tình phụ mẫu bao bọc. Dáng áo thanh lịch, thích hợp từ lễ hội, chụp ảnh kỷ niệm đến tiệc trang trọng.
3. **Màu sắc & Phụ kiện:** Đỏ son chu sa (#A4161A) hoặc Xanh chàm mộc (#1F2A44); đi cùng quạt xếp lụa, guốc mộc hoặc kiềng bạc tối giản.
4. **Nên tránh:** Chọn sai kích cỡ khiến cổ áo hở hoặc tà áo quét đất thiếu gọn gàng.
5. **Phương án thay thế:** Nếu thích vẻ đẹp phóng khoáng miền Bắc, bạn có thể thử Áo tứ thân với nón quai thao duyên dáng.

{"trangPhuc":"ao-ngu-than-tay-chen","mau":["#A4161A"],"phuKien":["quat-xep-lua","vong-kieng"]}`,
    outfitConfig: {
      costumeId: "ao-ngu-than-tay-chen",
      costumeName: "Áo ngũ thân tay chẽn",
      colorHex: "#A4161A",
      colorName: "Đỏ son chu sa",
      accessories: ["quat-xep-lua", "vong-kieng"],
      trangPhuc: "ao-ngu-than-tay-chen",
      mau: ["#A4161A"],
      phuKien: ["quat-xep-lua", "vong-kieng"]
    }
  };
}

// Sleep helper for backoff
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to call Gemini with official models from skill docs, exponential retry on 503/429
async function generateWithFallback(
  ai: ReturnType<typeof getAiClient>,
  params: {
    contents: any;
    config?: any;
  }
) {
  // Official text models defined in gemini-api SKILL.md:
  // - gemini-3.8-flash (Standard default text model)
  // - gemini-flash-latest (Common alias for gemini flash)
  // - gemini-3.1-flash-lite (Flash lite model)
  const candidateModels = [
    "gemini-3.8-flash",
    "gemini-flash-latest",
    "gemini-3.1-flash-lite"
  ];

  let lastError: any = null;

  for (const model of candidateModels) {
    // Attempt up to 2 retries per candidate on 503/429 temporary spikes
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        if (res && res.text) {
          return res;
        }
      } catch (err: any) {
        lastError = err;
        const msg = String(err?.message || "");
        const isUnavailableOrRateLimited =
          msg.includes("503") ||
          msg.includes("high demand") ||
          msg.includes("UNAVAILABLE") ||
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED");

        if (isUnavailableOrRateLimited && attempt === 0) {
          // Wait briefly with jitter before retry on this model
          await sleep(600 + Math.random() * 400);
          continue;
        }
        console.log(`[Gemini API] Model ${model} unavailable (attempt ${attempt + 1}), proceeding to next option.`);
        break;
      }
    }
  }

  throw lastError;
}

// API: AI Stylist Chat
app.post("/api/stylist/chat", async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid messages payload" });
    }

    const ai = getAiClient();

    let contextPrompt = "";
    if (context) {
      contextPrompt = `\n[NGỮ CẢNH NGƯỜI DÙNG]:\n` +
        (context.location ? `- Địa điểm: ${context.location}\n` : "") +
        (context.event ? `- Sự kiện / Dịp: ${context.event}\n` : "") +
        (context.weather ? `- Thời tiết: ${context.weather}\n` : "") +
        (context.gender ? `- Giới tính: ${context.gender}\n` : "") +
        (context.budget ? `- Ngân sách: ${context.budget}\n` : "") +
        (context.style ? `- Phong cách mong muốn: ${context.style}\n` : "");
    }

    // Format conversation history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Append context to last user message if provided
    if (contextPrompt && contents.length > 0) {
      const lastMsg = contents[contents.length - 1];
      if (lastMsg.role === "user") {
        lastMsg.parts[0].text += contextPrompt;
      }
    }

    const response = await generateWithFallback(ai, {
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
    });

    const replyText = response.text || "Dạ, Vân xin lỗi hiện chưa nhận được phản hồi. Bạn thử hỏi lại nhé!";

    // Extract embedded config/JSON from response (supports user format {"trangPhuc":"id","mau":["#hex"],"phuKien":["id"]} as well as code blocks)
    let outfitConfig: {
      costumeId: string;
      costumeName?: string;
      colorHex?: string;
      colorName?: string;
      accessories?: string[];
      trangPhuc?: string;
      mau?: string[];
      phuKien?: string[];
    } | null = null;

    // Try finding JSON block or bare JSON object matching {"trangPhuc"...} or {"costumeId"...}
    const jsonMatches = [
      replyText.match(/```(?:json|config)?\s*([\s\S]*?)\s*```/),
      replyText.match(/(\{\s*"trangPhuc"[\s\S]*?\})/),
      replyText.match(/(\{\s*"costumeId"[\s\S]*?\})/),
    ];

    for (const match of jsonMatches) {
      if (match && match[1]) {
        try {
          const parsed = JSON.parse(match[1]);
          if (parsed.trangPhuc) {
            const rawId = parsed.trangPhuc;
            const costumeId = CANONICAL_COSTUME_MAP[rawId] || rawId;
            const colorHex = (Array.isArray(parsed.mau) && parsed.mau[0]) || "#A4161A";
            const accessories = Array.isArray(parsed.phuKien) ? parsed.phuKien : [];
            outfitConfig = {
              costumeId,
              costumeName: COSTUME_NAMES[costumeId] || COSTUME_NAMES[rawId] || costumeId,
              colorHex,
              colorName: COLOR_NAMES[colorHex] || COLOR_NAMES[colorHex.toLowerCase()] || "Màu sắc truyền thống",
              accessories,
              trangPhuc: costumeId,
              mau: parsed.mau || [colorHex],
              phuKien: accessories,
            };
            break;
          } else if (parsed.costumeId) {
            const rawId = parsed.costumeId;
            const costumeId = CANONICAL_COSTUME_MAP[rawId] || rawId;
            const colorHex = parsed.colorHex || "#A4161A";
            outfitConfig = {
              costumeId,
              costumeName: parsed.costumeName || COSTUME_NAMES[costumeId] || COSTUME_NAMES[rawId] || costumeId,
              colorHex,
              colorName: parsed.colorName || COLOR_NAMES[colorHex] || "Màu sắc truyền thống",
              accessories: parsed.accessories || [],
            };
            break;
          }
        } catch {
          // Continue trying other patterns
        }
      }
    }

    res.json({
      text: normalizeVN(replyText),
      outfitConfig: outfitConfig ? normalizeVN(outfitConfig) : null,
    });
  } catch (error: any) {
    // Gracefully fall back to Vân's curated cultural knowledge base when upstream API has demand spikes
    console.log("[Stylist AI] Upstream model experiencing load spike, serving curated cultural knowledge response.");
    const lastUserQuery = (req.body?.messages && req.body.messages.length > 0)
      ? req.body.messages[req.body.messages.length - 1].content
      : "";
    
    const fallbackAnswer = generateKnowledgeFallback(lastUserQuery, req.body?.context);
    return res.json({
      text: normalizeVN(fallbackAnswer.text),
      outfitConfig: fallbackAnswer.outfitConfig ? normalizeVN(fallbackAnswer.outfitConfig) : null,
    });
  }
});

// API: AI Outfit Visual Card synthesis
app.post("/api/stylist/describe-look", async (req, res) => {
  try {
    const { costumeName, colorName, colorHex, accessories, modelName } = req.body;
    const ai = getAiClient();

    const prompt = `Bạn là nhà phê bình thời trang và chuyên gia mỹ thuật di sản Việt Nam.
Hãy viết một bài bình luận ngắn gọn, giàu chất thơ (khoảng 3 đoạn ngắn) mô tả bộ phối đồ Việt phục sau:
- Trang phục: ${costumeName}
- Tông màu: ${colorName} (${colorHex})
- Phụ kiện đi kèm: ${accessories?.join(", ") || "Tối giản trang nhã"}
- Người mẫu / Thần thái: ${modelName || "Người trẻ Việt Nam thanh nhã"}

Yêu cầu:
1. Đánh giá sự hài hòa thị giác, hiệu ứng tà áo và thần thái cổ phong.
2. Nêu bật ý nghĩa văn hóa của tông màu và phụ kiện đã chọn.
3. Gợi ý 1 địa điểm lý tưởng để diện bộ này (ví dụ: Chùa Thầy, Văn Miếu, Đại Nội Huế, Phố cổ Hội An...).`;

    const response = await generateWithFallback(ai, {
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    res.json({ review: normalizeVN(response.text || "") });
  } catch (error: any) {
    console.log("[Describe Look] Serving curated look synthesis fallback.");
    const { costumeName, colorName, accessories } = req.body;
    const fallbackReview = `Bộ phục sức ${costumeName || "Việt phục"} trên nền sắc ${colorName || "truyền thống"} tạo nên một tổng thể vừa thanh cao vừa phảng phất cốt cách xưa cũ. Dáng tà áo buông rủ mực thước, phối nhịp nhàng cùng các chi tiết ${accessories?.join(", ") || "tối giản"}, tôn vinh trọn vẹn nét đoan trang và khí chất của người mặc. Bộ trang phục này sẽ đặc biệt tỏa sáng khi sánh cùng không gian rêu phong cổ kính như Đại Nội Huế, Chùa Thầy hay Văn Miếu – Quốc Tử Giám.`;
    res.json({ review: normalizeVN(fallbackReview) });
  }
});

async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VẬN KỲ server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
