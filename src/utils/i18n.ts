export type Language = 'vi' | 'en';
export type Currency = 'VND' | 'USD';

export const USD_EXCHANGE_RATE = 25000;

export function formatPrice(amountVND: number, currency: Currency = 'VND'): string {
  if (currency === 'USD') {
    const usd = amountVND / USD_EXCHANGE_RATE;
    const formatted = usd % 1 === 0 ? usd.toFixed(0) : usd.toFixed(2);
    return `$${formatted}`;
  }
  return new Intl.NumberFormat('vi-VN').format(amountVND) + ' đ';
}

export interface DestinationInfo {
  id: string;
  nameVi: string;
  nameEn: string;
  taglineVi: string;
  taglineEn: string;
  suggestedCostumeIds: string[];
  nearestStoreId: string;
  nearestStoreNameVi: string;
  nearestStoreNameEn: string;
  storeDistanceVi: string;
  storeDistanceEn: string;
  etiquetteTipsVi: string;
  etiquetteTipsEn: string;
}

export const DESTINATIONS_DATA: DestinationInfo[] = [
  {
    id: 'hue',
    nameVi: 'Kinh Đô Huế (Đại Nội & Lăng Tẩm)',
    nameEn: 'Hue Imperial Citadel & Royal Tombs',
    taglineVi: 'Cố đô ngàn năm quyến rũ với rêu phong cổ thành và cung điện vàng son triều Nguyễn.',
    taglineEn: 'Ancient imperial capital surrounded by poetic mossy citadels and gilded Nguyen royal halls.',
    suggestedCostumeIds: ['nhat-binh', 'ao-tac', 'ao-ngu-than-tay-chen'],
    nearestStoreId: 'store-hue',
    nearestStoreNameVi: 'Tiệm Cổ Phục Huế - Đại Nội',
    nearestStoreNameEn: 'Hue Ancient Court Attire - Imperial Palace',
    storeDistanceVi: 'Cách cửa Hiển Nhơn 200m (Giao tận khách sạn / Resort trong 30 phút)',
    storeDistanceEn: '200m from Hien Nhon Gate (Hotel/Resort delivery within 30 mins)',
    etiquetteTipsVi: 'Trang phục hoàng gia (Nhật Bình, Áo Tấc) tuyệt đối hợp với Ngọ Môn và Điện Thái Hòa. Nên giữ bước đi khoan thai, hai tay chắp trước ngực.',
    etiquetteTipsEn: 'Royal robes (Nhat Binh, Ao Tac) look magnificent at Ngo Mon Gate & Thai Hoa Palace. Walk with graceful cadence, hands gently clasped.'
  },
  {
    id: 'van-mieu',
    nameVi: 'Văn Miếu - Quốc Tử Giám (Hà Nội)',
    nameEn: 'Temple of Literature (Hanoi)',
    taglineVi: 'Trường đại học đầu tiên của Đại Việt, biểu tượng đỉnh cao của đạo học và Nho nhã.',
    taglineEn: 'The first university of Dai Viet, eternal sanctuary of scholarship and Confucian virtue.',
    suggestedCostumeIds: ['ao-ngu-than-tay-chen', 'ao-tac'],
    nearestStoreId: 'store-hanoi',
    nearestStoreNameVi: 'Đại Việt Cổ Y - Thăng Long',
    nearestStoreNameEn: 'Dai Viet Ancient Attire - Thang Long',
    storeDistanceVi: 'Cách Văn Miếu 2.5km (Giao tận khách sạn phố cổ Hà Nội)',
    storeDistanceEn: '2.5km from Temple of Literature (Delivery to Old Quarter hotels)',
    etiquetteTipsVi: 'Chốn tôn nghiêm của đạo học Nho gia: ưu tiên áo cổ đứng (lập lĩnh) kín đáo, tay chẽn gọn gàng, tránh váy ngắn hoặc tà xẻ quá cao.',
    etiquetteTipsEn: 'Solemn temple of Confucius: prioritize modest upright collars (lap linh) and scholar robes; avoid revealing hemlines or casual shorts.'
  },
  {
    id: 'ha-noi',
    nameVi: 'Hoàng Thành Thăng Long & Phố Cổ Hà Nội',
    nameEn: 'Thang Long Imperial Citadel & Hanoi Old Quarter',
    taglineVi: 'Nơi lắng đọng hào khí ngàn năm Lý - Trần - Lê và nhịp sống 36 phố phường tao nhã.',
    taglineEn: 'Heart of a millennial heritage spanning Ly, Tran, Le dynasties and 36 Old Quarter guilds.',
    suggestedCostumeIds: ['ao-vien-linh', 'ao-giao-linh', 'ao-tu-than', 'ao-dai'],
    nearestStoreId: 'store-hanoi',
    nearestStoreNameVi: 'Đại Việt Cổ Y - Thăng Long',
    nearestStoreNameEn: 'Dai Viet Ancient Attire - Thang Long',
    storeDistanceVi: 'Số 28 Phố Hàng Bạc, Q. Hoàn Kiếm (Ngay trung tâm phố cổ)',
    storeDistanceEn: '28 Hang Bac St, Hoan Kiem Dist (Center of Hanoi Old Quarter)',
    etiquetteTipsVi: 'Cổ phục thời Lý - Trần - Lê với cổ tròn (Viên Lĩnh) hoặc cổ chéo (Giao Lĩnh) tôn lên hào khí văn hiến giữa thềm rêu Đoan Môn.',
    etiquetteTipsEn: 'Round-collar (Vien Linh) and cross-collar (Giao Linh) robes honor the glorious spirit of medieval Thang Long kingdoms.'
  },
  {
    id: 'hoi-an',
    nameVi: 'Phố Cổ Hội An (Chùa Cầu & Bến Hoài)',
    nameEn: 'Hoi An Ancient Town (Japanese Bridge & Lanterns)',
    taglineVi: 'Thương cảng cổ kính lấp lánh đèn lồng, tường vàng hoa giấy và mái ngói âm dương.',
    taglineEn: 'Historic merchant trading port bathed in warm lanterns, bougainvillea yellow walls and clay-tile roofs.',
    suggestedCostumeIds: ['ao-tac', 'ao-dai', 'ao-tu-than', 'ao-ngu-than-tay-chen'],
    nearestStoreId: 'store-hoian',
    nearestStoreNameVi: 'Tiệm May & Cổ Phục Phố Hội',
    nearestStoreNameEn: 'Pho Hoi Tailor & Ancient Attire',
    storeDistanceVi: '45 Trần Phú, P. Minh An (Ngay trục phố đi bộ Hội An)',
    storeDistanceEn: '45 Tran Phu St, Minh An Ward (Inside Hoi An walking street)',
    etiquetteTipsVi: 'Áo tấc hoặc áo dài ngũ thân màu xanh ngọc, vàng hoàng yến hoặc đỏ son tạo nên khung hình điện ảnh bên sông Hoài và cầu ngói.',
    etiquetteTipsEn: 'Wide-sleeved Ao Tac or silk Ao Dai in pastel jade, amber or vermilion blend cinematically with Hoi An lantern riversides.'
  },
  {
    id: 'hcm',
    nameVi: 'TP. Hồ Chí Minh (Sài Gòn Xưa & Đương Đại)',
    nameEn: 'Ho Chi Minh City (Heritage & Modern Saigon)',
    taglineVi: 'Sự giao thoa đầy quyến rũ giữa dinh thự di sản Nam Bộ và năng lượng trẻ trung đương đại.',
    taglineEn: 'Charming blend of southern heritage architecture, neoclassical villas and vibrant contemporary fashion.',
    suggestedCostumeIds: ['ao-dai-cach-tan', 'ao-dai', 'nhat-binh'],
    nearestStoreId: 'store-hcm',
    nearestStoreNameVi: 'Vận Kỳ Sài Gòn - Nam Bộ Cổ Các',
    nearestStoreNameEn: 'Van Ky Saigon - Southern Heritage Pavilion',
    storeDistanceVi: '184 Nam Kỳ Khởi Nghĩa, Q.3 (Hỗ trợ giao khách sạn Quận 1, 3 trong 40 phút)',
    storeDistanceEn: '184 Nam Ky Khoi Nghia, Dist 3 (Hotel delivery in Dist 1 & 3 in 40 mins)',
    etiquetteTipsVi: 'Áo dài cách tân trẻ trung hoặc Áo dài lụa tơ tằm mềm mại phối nón lá tạo vẻ duyên dáng khi dạo quanh Bưu điện Thành phố hay Bảo tàng Mỹ thuật.',
    etiquetteTipsEn: 'Modernized Ao Dai or flowing natural silk gowns match the vibrant cosmopolitan flair of Saigon heritage landmarks.'
  }
];

export interface CulturalEtiquetteDetail {
  dosVi: string[];
  dosEn: string[];
  dontsVi: string[];
  dontsEn: string[];
  colorSignificanceVi: string;
  colorSignificanceEn: string;
  tabooMotifsVi: string;
  tabooMotifsEn: string;
}

export const CULTURAL_ETIQUETTE_DATA: Record<string, CulturalEtiquetteDetail> = {
  'nhat-binh': {
    dosVi: [
      'Giữ phong thái đoan trang, khoan thai; bước chân nhịp nhàng uyển chuyển.',
      'Luôn mặc quần lụa trắng dài phủ mắt cá chân bên trong để giữ tính chuẩn mực điển chế.',
      'Nên kết hợp cùng khăn vành dây màu xanh hoặc trâm cài tóc truyền thống.',
      'Khi chụp ảnh, hai tay nên nhẹ nhàng xếp trước bụng hoặc nâng nhẹ quạt xếp.'
    ],
    dosEn: [
      'Maintain an upright, poised, and dignified posture with gentle measured steps.',
      'Always wear traditional full-length white silk trousers underneath down to the ankles.',
      'Pair with an authentic blue circular folded headwrap (khan vanh day) or floral hairpin.',
      'Rest hands gracefully folded at the waist or hold a traditional silk folding fan.'
    ],
    dontsVi: [
      'Tuyệt đối không xắn cao tay áo, không mặc kèm váy ngắn hay quần đùi bên trong.',
      'Tránh tạo dáng tinh nghịch, nhảy nhót quá khích làm xộc xệch dải ngũ sắc trước ngực.',
      'Không mang giày thể thao hầm hố; nên chọn hài thêu mũi cong hoặc guốc mộc thanh lịch.'
    ],
    dontsEn: [
      'Never roll up the sleeves or wear modern shorts/mini-skirts underneath.',
      'Avoid overly playful or athletic poses that distort the ceremonial rectangular neckline.',
      'Do not wear bulky modern sneakers; choose delicate embroidered slippers or wooden clogs.'
    ],
    colorSignificanceVi: 'Màu sắc thể hiện tôn ti triều Nguyễn: Vàng chính sắc dành riêng cho Hoàng hậu (Chính thê hành Thổ), Đỏ xích/Chu sa cho Công chúa, Tím hoa cà (Tử điều) cho các bậc Phi tần.',
    colorSignificanceEn: 'Colors strictly mirrored royal court hierarchy: Imperial Yellow was reserved for the Empress (Earth element central ruler), Vermilion Red for Princesses, and Violet for High Consorts.',
    tabooMotifsVi: 'Tuyệt đối tránh rồng 5 móng (chỉ dành riêng cho Hoàng đế triều Nguyễn). Trang phục nữ quý tộc chỉ thêu chim phượng hoàng, chim loan, hoa đào và hoa văn sóng nước thủy ba tuần hoàn.',
    tabooMotifsEn: 'Strictly avoid five-clawed dragons (the sovereign emblem of the Emperor). Women of nobility wore phoenixes, mythical luan birds, peach blossoms, and cyclic water waves (thuy ba).'
  },
  'ao-tac': {
    dosVi: [
      'Khi đứng hoặc bước đi, nên chắp hai tay trước ngực để giữ tay áo thụng rủ xuống đều đặn.',
      'Nam giới nên đội khăn đóng đen, nữ giới đội khăn lươn hoặc mấn tết hoa nhã nhặn.',
      'Rất thích hợp cho các dịp lễ tết, thăm đền chùa, lăng tẩm và chụp ảnh kỷ yếu thanh lịch.'
    ],
    dosEn: [
      'Gently clasp both hands in front of the chest so wide ceremonial sleeves drape naturally.',
      'Men should wear a black folded turban (khan dong); women should wear a neat headband or man.',
      'Ideal for festive ceremonies, ancestral shrines, historical ruins, and graduation portraits.'
    ],
    dontsVi: [
      'Không xắn ống tay áo lên khi làm lễ hoặc chụp hình kỷ niệm vì sẽ làm hở cánh tay.',
      'Tránh vừa đi vừa vung tay quá mạnh khiến form áo rộng bị bay mất trật tự nếp vải.'
    ],
    dontsEn: [
      'Never roll or pin up the wide sleeve cuffs during ceremonies, which violates etiquette.',
      'Avoid swinging arms vigorously while walking, which causes the wide fabric panels to flutter untidily.'
    ],
    colorSignificanceVi: 'Xanh chàm đại diện cho bậc Nho học mực thước; Đỏ son dùng cho ngày đại hỷ hoặc lễ cưới; Nâu non biểu thị sự trầm tĩnh, hiếu đạo.',
    colorSignificanceEn: 'Indigo Blue symbolizes scholarly uprightness; Vermilion Red is worn for weddings and grand festive blessings; Earthy Brown represents humility and filial piety.',
    tabooMotifsVi: 'Áo tấc dân gian dùng vải trơn hoặc dệt chữ Thọ chìm. Không nên tự ý gắn bổ tử thêu hình thú/chim của quan viên triều đình nếu không phải biểu diễn phục dựng sân khấu.',
    tabooMotifsEn: 'Traditional Ao Tac utilizes plain silk or subtle woven longevity glyphs. Avoid attaching military or civil court badges (bo tu) unless performing historical reenactments.'
  },
  'ao-vien-linh': {
    dosVi: [
      'Thắt đai lưng ngang hông ngay ngắn, giữ cổ áo tròn ôm sát viền cổ đoan chính.',
      'Giữ lưng thẳng, dáng đi oai phong đĩnh đạc đúng phong thái bậc quan lại Đại Việt.'
    ],
    dosEn: [
      'Fasten the waist belt neatly around the hips; keep the round collar snugly fastened at the throat.',
      'Stand with spine straight and walk with regal authority, embodying the dignity of Dai Viet mandarins.'
    ],
    dontsVi: [
      'Không tháo cúc cổ tròn hay để mở vạt áo trước làm mất đi tính trang nghiêm của triều phục.',
      'Không kết hợp các phụ kiện hiện đại lòe loẹt như đồng hồ thể thao to bản hay kính râm hầm hố.'
    ],
    dontsEn: [
      'Do not unbutton the round standing collar or leave the front panels loose.',
      'Avoid modern clashing accessories such as oversized fitness watches or bright reflective sunglasses.'
    ],
    colorSignificanceVi: 'Xanh lục bảo sẫm biểu trưng cho lòng trung trinh liêm chính; Tía/Đỏ dành cho quan đại thần tứ phẩm trở lên.',
    colorSignificanceEn: 'Deep Emerald Green signifies unyielding integrity and wisdom; Deep Purple and Crimson Red were reserved for high-ranking ministers of the 4th rank and above.',
    tabooMotifsVi: 'Bổ tử trước ngực quy định nghiêm ngặt: Quan văn thêu chim (Hạc, Cò, Nhạn), quan võ thêu thú dữ (Kỳ lân, Bạch hổ, Báo). Tuyệt đối không thêu rồng vàng của Thiên tử.',
    tabooMotifsEn: 'Chest badges (bo tu) followed strict protocol: Civil officials wore birds (Cranes, Egrets), while military generals wore fierce beasts (Qilin, White Tigers). Imperial gold dragons were strictly forbidden.'
  },
  'ao-giao-linh': {
    dosVi: [
      'Quy tắc Vàng "Hữu Nhậm": Luôn luôn vạt trái đè lên vạt phải tạo thành cổ chữ Y thanh thoát.',
      'Thắt đai lưng vải mềm tự nhiên, đi cùng guốc mộc hoặc hài vải cổ truyền.'
    ],
    dosEn: [
      'The Golden Rule "Huu Nham": Always cross the left panel OVER the right panel to form the graceful Y-collar.',
      'Tie the fabric sash naturally around the waist; wear traditional wooden clogs or cloth slippers.'
    ],
    dontsVi: [
      'CỰC KỲ KIÊNG KỴ: Tuyệt đối không mặc vạt phải đè lên vạt trái ("Tả Nhậm"), vì trong văn hóa phương Đông đây là cách mặc dành cho người đã khuất.',
      'Không để cổ áo trễ nải lộ ngực khi vào khuôn viên di tích, đình miếu.'
    ],
    dontsEn: [
      'CRITICAL CULTURAL TABOO: Never wrap the right lapel over the left ("Ta Nham") — in East Asian civilization this is exclusively used when shrouding the deceased.',
      'Do not let the neck collar sag loosely to expose the chest when entering sacred temple grounds.'
    ],
    colorSignificanceVi: 'Gam màu be mộc, trắng ngà tơ tằm và đỏ chu đào gợi nhớ tinh thần dung dị, trầm hùng của thời Lý - Trần.',
    colorSignificanceEn: 'Earthy beige, raw ivory silk, and madder crimson evoke the unpretentious, heroic spirit of the medieval Ly-Tran dynasties.',
    tabooMotifsVi: 'Tránh các họa tiết in công nghiệp sặc sỡ. Nên chọn lụa tơ tằm dệt hoa cúc dây, hoa sen thời Trần chuẩn cổ.',
    tabooMotifsEn: 'Avoid loud synthetic screen-prints. Prefer natural mulberry silks woven with flowing chrysanthemum vines or sacred Tran-era lotus medallions.'
  },
  'ao-ngu-than-tay-chen': {
    dosVi: [
      'Cài đủ 5 khuy bên nách phải tượng trưng cho Ngũ Thường (Nhân, Lễ, Nghĩa, Trí, Tín).',
      'Tay chẽn ôm vừa vặn cổ tay giúp cử chỉ nhanh nhẹn, đoan trang, lịch thiệp.'
    ],
    dosEn: [
      'Fasten all five buttons on the right flank, symbolizing the Five Cardinal Virtues (Benevolence, Propriety, Righteousness, Wisdom, Integrity).',
      'The tailored tight cuffs allow graceful yet practical everyday motion, perfect for sightseeing.'
    ],
    dontsVi: [
      'Không may tà áo quá ngắn cũn cỡn làm mất đi phom dáng ngũ thân truyền thống.',
      'Không bung cúc cổ áo nơi công cộng.'
    ],
    dontsEn: [
      'Do not shorten the tunic excessively, which destroys the historic proportion of the five panels.',
      'Avoid unbuttoning the neck collar in public.'
    ],
    colorSignificanceVi: 'Xanh chàm, xanh rêu và đen biểu thị tính khiêm nhường, gần gũi và trí thức của người quân tử và phụ nữ Việt xưa.',
    colorSignificanceEn: 'Indigo, moss green, and polished black represent intellectual modesty, filial devotion, and quiet inner strength.',
    tabooMotifsVi: 'Là trang phục phổ thông trang nhã, tránh đính đá lấp lánh hay thêu rồng phượng cung đình gây lệch lạc giai tầng.',
    tabooMotifsEn: 'As refined everyday cultural attire, avoid glittery rhinestones or palace dragon crests that break historical social boundaries.'
  },
  'ao-tu-than': {
    dosVi: [
      'Mặc bên trong yếm lụa đào hoặc yếm hoa sen, thắt dải lưng lụa buông dài duyên dáng.',
      'Đội nón quai thao che nghiêng e ấp hoặc chít khăn mỏ quạ theo phong cách Bắc Bộ.'
    ],
    dosEn: [
      'Wear a traditional silk yem (halter bodice) underneath; knot the long silk sash gracefully at the waist.',
      'Pair with a broad palm hat (non quai thao) tilted gently, or a traditional crow-beak headscarf (khan mo qua).'
    ],
    dontsVi: [
      'Không buộc hai vạt áo trước quá cao làm lộ hở da thịt phản cảm.',
      'Không phối với các trang sức kim loại hầm hố của văn hóa phương Tây hiện đại.'
    ],
    dontsEn: [
      'Do not tie the two front panels too high up, which exposes the midriff disrespectfully.',
      'Avoid chunky modern western metal chains or punk jewelry.'
    ],
    colorSignificanceVi: 'Nâu non mộc mạc của áo ngoài đối lập với yếm đào đỏ hồng rực rỡ bên trong thể hiện nét đẹp kín đáo nhưng tràn đầy sức sống của phụ nữ Kinh Bắc.',
    colorSignificanceEn: 'The modest earthy brown outer robe contrasted with the vibrant vermilion/pink yem inside expresses the subtle, magnetic charm of Northern Vietnamese folklore.',
    tabooMotifsVi: 'Là y phục dân gian đậm chất đồng nội, tuyệt đối tránh các họa tiết cung đình như rồng phượng, chữ triện hoàng gia.',
    tabooMotifsEn: 'As agrarian folk dress, strictly avoid courtly motifs like royal dragons, imperial phoenixes, or gilded dynasty crests.'
  },
  'ao-dai': {
    dosVi: [
      'Giữ tà áo thẳng thớm, phẳng phiu; di chuyển khoan thai nhẹ nhàng.',
      'Mặc cùng quần lụa ống rộng dài chấm gót chân, mang giày cao gót hoặc hài thanh nhã.'
    ],
    dosEn: [
      'Ensure the panels are crisply pressed; glide forward with a gentle, poise-filled rhythm.',
      'Wear with wide-leg silk trousers reaching heel height, paired with elegant pumps or traditional slippers.'
    ],
    dontsVi: [
      'Tránh chọn vải quá mỏng manh xuyên thấu làm lộ nội y gây phản cảm.',
      'Không thắt lưng quá chật gây khó thở và mất tự nhiên khi di chuyển.'
    ],
    dontsEn: [
      'Never choose overly sheer, transparent fabrics that show undergarments in daylight.',
      'Avoid overly restrictive corsets that hinder effortless breathing and walking poise.'
    ],
    colorSignificanceVi: 'Trắng tinh khôi (học sinh, sinh viên), Hồng sen (duyên dáng thiếu nữ), Đỏ tươi (hỷ sự cưới xin, năm mới may mắn).',
    colorSignificanceEn: 'Pure White (youth and innocence), Lotus Blossom Pink (feminine romance), Bright Crimson (weddings and New Year prosperity).',
    tabooMotifsVi: 'Tôn trọng quốc phục: Không in khẩu hiệu, logo thương hiệu thô thiển lên tà áo dài.',
    tabooMotifsEn: 'Respect the National Dress: Do not print crude commercial logos, offensive cartoons, or slogans on the flowing panels.'
  },
  'ao-dai-cach-tan': {
    dosVi: [
      'Phối cùng quần lụa ống suông hoặc chân váy xếp ly dáng dài thanh thoát.',
      'Có thể phối cùng giày sneaker trắng sạch sẽ hoặc búp bê tạo phong cách Gen Z năng động.'
    ],
    dosEn: [
      'Pair with flowing pleated culottes or an elegant A-line midi skirt.',
      'Clean white sneakers or chic flats create an authentic, dynamic modern Vietnamese Gen Z street style.'
    ],
    dontsVi: [
      'Không cắt tà áo quá ngắn lên trên hông hoặc khoét cổ quá sâu làm biến dạng tà áo truyền thống.'
    ],
    dontsEn: [
      'Do not cut the tunic panels dangerously short above the hip or add excessive plunging necklines.'
    ],
    colorSignificanceVi: 'Gam màu pastel hiện đại: hồng phấn, xanh bơ, be cát tạo cảm giác tươi mới, phù hợp dạo phố cà phê cuối tuần.',
    colorSignificanceEn: 'Modern pastel palette: soft blush, avocado green, and oat beige impart an airy, youthful vibe ideal for weekend cafes.'
    ,
    tabooMotifsVi: 'Tuy là cách tân nhưng vẫn cần giữ nét trang nhã; tránh in hình đầu lâu, khẩu hiệu phản cảm xúc phạm văn hóa.',
    tabooMotifsEn: 'Even in contemporary styling, preserve cultural dignity; avoid skull prints, gothic spikes, or offensive slogans.'
  }
};

export const UI_TRANSLATIONS = {
  vi: {
    nav: {
      brand: 'VẬN KỲ',
      tagline: 'Phục Dựng Văn Hiến',
      home: 'Trang chủ',
      lookbook: 'Lookbook',
      studio: 'Phối đồ',
      orders: 'Đơn của tôi',
      group: 'Đơn nhóm',
      chat: 'Hỏi AI Stylist',
      about: 'Giới thiệu & Nguồn',
      tryStudio: 'Phối đồ ngay'
    },
    filter: {
      destinationsTitle: 'Lọc Theo Điểm Đến Văn Hóa',
      allDestinations: 'Tất cả điểm đến',
      nearestStore: 'Tiệm đối tác gần nhất',
      viewStore: 'Xem tiệm',
      whySuit: 'Vì sao phù hợp nơi này',
      culturalTips: 'Gợi ý phong thái di sản',
      period: 'Thời kỳ',
      group: 'Nhóm trang phục',
      gender: 'Giới tính',
      all: 'Tất cả',
      male: 'Nam phục',
      female: 'Nữ phục',
      unisex: 'Unisex',
      reset: 'Xóa bộ lọc'
    },
    lookbook: {
      title: 'Kho Lưu Trữ Di Sản Cổ Phục',
      subtitle: 'Khảo cứu chuẩn điển chế qua các triều đại Lý, Trần, Lê, Nguyễn. Đọc câu chuyện lịch sử và đặt thuê bảo chứng an toàn.',
      rentFrom: 'Thuê từ',
      perDay: 'ngày',
      deposit: 'Cọc',
      rentNow: 'Đặt thuê bộ này',
      tryInStudio: 'Phối thử tại Studio',
      listenAudio: 'Nghe câu chuyện',
      stopAudio: 'Dừng đọc',
      culturalEtiquette: 'Quy Chuẩn Văn Hóa & Hướng Dẫn Mặc (Cultural Etiquette)',
      dos: 'Nên Làm (Do’s)',
      donts: 'Không Nên Làm (Don’ts)',
      colorSignificance: 'Ý Nghĩa Màu Sắc Ngũ Hành',
      tabooMotifs: 'Họa Tiết Cấm Kỵ & Điển Chế Hoàng Cung',
      historyContext: 'Bối Cảnh Lịch Sử & Điển Chế',
      culturalStory: 'Câu Chuyện & Ý Niệm Văn Hóa',
      identifyingFeatures: 'Đặc Điểm Nhận Dạng Quy Chuẩn',
      traditionalPalette: 'Bảng Màu Truyền Thống & Ngũ Hành',
      wearer: 'Người Sử Dụng',
      occasions: 'Dịp Sử Dụng',
      accessories: 'Phụ Kiện Đi Kèm',
      contemporaryStyling: 'Gợi Ý Phối Đồ Hiện Đại (Gen Z Styling)',
      culturalCaution: 'Lưu Ý Văn Hóa & Tôn Trọng Điển Chế',
      references: 'Nguồn sử liệu tham chiếu'
    },
    studio: {
      title: 'Tự Do Sáng Tạo Phối Đồ',
      subtitle: 'Việt Phục Studio · Phòng Thử Đồ Tương Tác',
      favorite: 'Yêu thích',
      favorited: 'Đã yêu thích',
      myCollection: 'Bộ sưu tập',
      shareOutfit: 'Chia sẻ bộ phối',
      rentThisLook: 'Đặt thuê bộ này',
      exportPoster: 'Tạo lookbook cá nhân',
      harmonyScore: 'Điểm Hài Hòa',
      wuxing: 'Ngũ Hành',
      contrast: 'Tương Phản',
      destinationTag: 'Gợi ý cho điểm đến',
      changeScene: 'Đổi bối cảnh',
      selectCostume: 'Chọn cổ phục',
      selectColor: 'Chọn màu ngũ hành',
      selectAccessories: 'Chọn phụ kiện',
      culturalVerification: 'Kiểm tra điển chế'
    },
    rental: {
      modalTitle: 'Đặt Thuê Cổ Phục Bảo Chứng An Toàn',
      escrowGuarantee: 'Cơ Chế Bảo Chứng Ký Quỹ VẬN KỲ (Escrow Protection)',
      escrowExplanation: 'Tiền của bạn được VẬN KỲ giữ an toàn. Tiệm chỉ nhận tiền thuê sau khi bạn trả đồ, tiền cọc được hoàn lại nếu đồ nguyên vẹn.',
      step1: 'Chọn ngày & Size',
      step2: 'Thanh toán ký quỹ',
      step3: 'Xác nhận đơn',
      sizeLabel: '1. Chọn kích cỡ trang phục (Size)',
      datesLabel: '2. Thời gian thuê trang phục',
      startDate: 'Ngày nhận đồ',
      endDate: 'Ngày trả đồ',
      totalDays: 'Tổng thời gian thuê',
      storeLabel: '3. Chọn tiệm đối tác cung cấp',
      deliveryLabel: '4. Hình thức nhận đồ',
      methodStore: 'Nhận trực tiếp tại tiệm đối tác',
      methodStoreSub: 'Miễn phí · Thử đồ trực tiếp tại tiệm',
      methodHotel: 'Giao & nhận trả tại khách sạn (Hotel Concierge Delivery)',
      methodHotelSub: 'Tiện lợi cho du khách · Giao tận sảnh / Lễ tân khách sạn',
      methodShipping: 'Giao tận nơi địa chỉ riêng',
      methodShippingSub: 'Giao hàng tiêu chuẩn toàn quốc',
      hotelName: 'Tên khách sạn / Resort *',
      hotelRoom: 'Số phòng *',
      hotelAddress: 'Địa chỉ khách sạn / Thành phố *',
      guestName: 'Họ tên khách lưu trú *',
      guestPhone: 'Số điện thoại / WhatsApp / Zalo *',
      hotelNote: 'Lưu ý: Shipper VẬN KỲ sẽ giao đồ và khi trả đồ quý khách chỉ cần gửi lại quầy lễ tân khách sạn.',
      conflictAlert: 'Bộ này đã được đặt trong khoảng ngày này! Vui lòng chọn khoảng ngày khác.',
      financialTable: 'Bảng Chiết Tính Tài Chính Đơn Thuê',
      rentalFee: 'Tiền thuê trang phục',
      depositFee: 'Tiền cọc trang phục (Hoàn lại 100% khi trả đồ)',
      platformFee: 'Phí dịch vụ nền tảng VẬN KỲ',
      shippingFee: 'Phí vận chuyển / Giao khách sạn',
      totalPayment: 'TỔNG THANH TOÁN BAN ĐẦU',
      paymentMethodLabel: 'Chọn phương thức thanh toán giả lập',
      methodCard: 'Thẻ Quốc Tế (Visa, MasterCard, JCB, Amex)',
      methodVietQR: 'Chuyển khoản VietQR',
      methodWallet: 'Ví điện tử / PayPal',
      confirmPay: 'Xác Nhận Thanh Toán & Ký Quỹ Bảo Chứng',
      successTitle: 'Đặt Thuê & Ký Quỹ Thành Công!',
      successSub: 'Mã đơn hàng của bạn:',
      successDesc: 'Tiền thuê và tiền cọc đã được khóa an toàn trong quỹ VẬN KỲ. Tiệm đối tác đang tiến hành chuẩn bị trang phục cho bạn.',
      goToOrders: 'Xem tiến trình tại "Đơn Của Tôi"',
      continueBrowsing: 'Tiếp tục khám phá'
    },
    orders: {
      title: 'Quản Lý Đơn Thuê Của Tôi',
      subtitle: 'Theo dõi hành trình trang phục qua 5 bước nghiêm ngặt. Tiền cọc và tiền thuê được bảo vệ an toàn trong quỹ trung gian đến khi việc kiểm tra hoàn tất.',
      allTab: 'Tất cả',
      activeTab: 'Đang thực hiện',
      completedTab: 'Đã hoàn cọc',
      advanceStepDemo: 'Chuyển sang bước tiếp theo (Demo)',
      stepSequence: 'Tiến Trình Đơn Hàng (5 Bước Bảo Chứng)',
      step1: 'Đã đặt cọc',
      step2: 'Đang giao / Sẵn sàng',
      step3: 'Đang sử dụng',
      step4: 'Đã trả đồ',
      step5: 'Hoàn tất & Hoàn cọc',
      inspectionTitle: 'Biên Bản Nghiệm Thu & Kiểm Tra Hiện Trạng Trang Phục',
      inspectionDesc: 'Khách hàng đã hoàn trả trang phục về tiệm. Tiệm đối tác tiến hành chụp ảnh và đánh giá tình trạng vải, đường thêu để VẬN KỲ thực hiện hoàn cọc.',
      inspectionPhoto: 'Ảnh chụp hiện trạng sau khi trả đồ',
      uploadPhoto: 'Tải lên ảnh tình trạng thực tế',
      changePhoto: 'Đổi ảnh chụp',
      evaluationLabel: 'Đánh giá chất lượng trang phục',
      perfectOption: 'Nguyên vẹn 100% (Hoàn 100% cọc)',
      perfectDesc: 'Vải lụa sạch sẽ, không sứt chỉ, đầy đủ trâm cài/khăn đóng. Hoàn toàn bộ tiền cọc về tài khoản của khách.',
      minorOption: 'Hư hỏng nhẹ (Trừ một phần cọc theo bảng phí)',
      minorDesc: 'Áp dụng biểu phí phục hồi trang phục theo quy chế VẬN KỲ. Phần cọc còn lại sẽ lập tức hoàn trả cho khách.',
      stainDeduction: 'Lem son / Vết bẩn nhẹ (-120.000đ)',
      threadDeduction: 'Sút chỉ tà áo (-150.000đ)',
      inspectionNoteLabel: 'Ghi chú nghiệm thu của tiệm',
      confirmInspection: 'Xác Nhận Nghiệm Thu & Giải Ngân / Hoàn Cọc Ngay',
      ledgerTitle: 'Báo Cáo Dòng Tiền & Ký Quỹ Bảo Chứng (Financial Ledger)',
      ledgerDisbursed: 'Đã Giải Ngân Toàn Bộ',
      ledgerHolding: 'Đang Khóa Trong Quỹ Escrow',
      payoutPartner: 'Tiền thuê chuyển tiệm đối tác',
      platformRevenue: 'Phí dịch vụ nền tảng VẬN KỲ',
      depositRefund: 'Tiền cọc hoàn trả khách',
      payoutNoteDisbursed: '✓ Đã chuyển về tiệm',
      payoutNoteHolding: 'Đang giữ trung gian',
      refundNoteDisbursed: '✓ Đã hoàn về tài khoản khách',
      refundNoteHolding: 'Sẽ hoàn 100% khi trả đồ nguyên vẹn'
    },
    chat: {
      title: 'Vân – Stylist Việt Phục',
      badge: 'Trí tuệ nhân tạo Gemini',
      subtitle: 'Cố vấn trang phục cổ truyền chuẩn điển chế & cá nhân hóa sự kiện',
      welcome: 'Dạ, chào bạn! Mình là Vân – Stylist Việt phục của VẬN KỲ. 🌿\n\nMình ở đây để giúp bạn chọn đúng trang phục truyền thống Việt Nam cho từng điểm đến và sự kiện: Đại Nội Huế, Phố cổ Hội An, Văn Miếu, chụp ảnh kỷ yếu hay cưới hỏi. Hãy cho Vân biết kế hoạch của bạn nhé!',
      placeholder: 'Hỏi Vân về cách phối đồ, điểm đến, quy tắc trang phục...',
      send: 'Gửi',
      reset: 'Làm mới',
      contextTitle: 'Chọn ngữ cảnh tư vấn',
      quickSuggestions: 'Câu hỏi gợi ý nhanh:',
      applyToStudio: 'Thử phối bộ này trên Studio'
    }
  },
  en: {
    nav: {
      brand: 'VAN KY',
      tagline: 'Reviving Heritage',
      home: 'Home',
      lookbook: 'Lookbook',
      studio: 'Styling Studio',
      orders: 'My Orders',
      group: 'Group Orders',
      chat: 'Ask AI Stylist',
      about: 'About & Archives',
      tryStudio: 'Try Studio'
    },
    filter: {
      destinationsTitle: 'Filter By Cultural Destination',
      allDestinations: 'All Destinations',
      nearestStore: 'Nearest Partner Shop',
      viewStore: 'View Store',
      whySuit: 'Why this costume fits here',
      culturalTips: 'Heritage Etiquette Tips',
      period: 'Historical Era',
      group: 'Attire Category',
      gender: 'Gender',
      all: 'All',
      male: 'Men',
      female: 'Women',
      unisex: 'Unisex',
      reset: 'Reset Filters'
    },
    lookbook: {
      title: 'Vietnamese Ancient Attire Archives',
      subtitle: 'Historically authentic traditional garments spanning the Ly, Tran, Le, and Nguyen dynasties. Explore cultural stories, etiquette, and book safe escrow rentals.',
      rentFrom: 'Rent from',
      perDay: 'day',
      deposit: 'Deposit',
      rentNow: 'Rent This Attire',
      tryInStudio: 'Try in Studio',
      listenAudio: 'Listen to Story',
      stopAudio: 'Stop Audio',
      culturalEtiquette: 'Cultural Etiquette & Dress Code Protocol',
      dos: 'Recommended (Do’s)',
      donts: 'Strictly Avoid (Don’ts)',
      colorSignificance: 'Five Elements & Color Symbolism',
      tabooMotifs: 'Taboo Motifs & Court Regalia Protocol',
      historyContext: 'Historical Context & Court Precedent',
      culturalStory: 'Folklore & Cultural Narrative',
      identifyingFeatures: 'Canonical Identifying Features',
      traditionalPalette: 'Traditional Palette & Five Elements',
      wearer: 'Intended Wearer',
      occasions: 'Appropriate Occasions',
      accessories: 'Matching Accessories',
      contemporaryStyling: 'Modern Gen Z Styling Suggestions',
      culturalCaution: 'Cultural Respect & Protocol Reminder',
      references: 'Primary Historical References'
    },
    studio: {
      title: 'Interactive Attire Styling Studio',
      subtitle: 'Van Ky Studio · Multi-Layer Cultural Mannequin',
      favorite: 'Favorite',
      favorited: 'Favorited',
      myCollection: 'My Collection',
      shareOutfit: 'Share Outfit',
      rentThisLook: 'Rent This Outfit',
      exportPoster: 'Export Lookbook Card',
      harmonyScore: 'Harmony Score',
      wuxing: 'Five Elements',
      contrast: 'Contrast',
      destinationTag: 'Recommended for destination',
      changeScene: 'Change Scene',
      selectCostume: 'Select Attire',
      selectColor: 'Select Color Tone',
      selectAccessories: 'Add Accessories',
      culturalVerification: 'Check Protocol'
    },
    rental: {
      modalTitle: 'Safe Escrow-Protected Attire Rental',
      escrowGuarantee: 'VAN KY Escrow Protection Guarantee',
      escrowExplanation: 'Your payment is safely held in escrow by VAN KY. The partner boutique receives rental fees only after you return the costume, and your deposit is refunded upon inspection.',
      step1: 'Date & Sizing',
      step2: 'Escrow Checkout',
      step3: 'Confirmation',
      sizeLabel: '1. Select Costume Size',
      datesLabel: '2. Rental Duration Dates',
      startDate: 'Pick-up / Delivery Date',
      endDate: 'Return Date',
      totalDays: 'Total Rental Duration',
      storeLabel: '3. Select Partner Boutique',
      deliveryLabel: '4. Delivery & Return Method',
      methodStore: 'Pick up at partner boutique',
      methodStoreSub: 'Free · In-store fitting and accessory inspection',
      methodHotel: 'Hotel Concierge Delivery & Return',
      methodHotelSub: 'Top choice for international travelers · Delivered to hotel lobby',
      methodShipping: 'Standard Doorstep Delivery',
      methodShippingSub: 'Standard shipping to private address',
      hotelName: 'Hotel / Resort Name *',
      hotelRoom: 'Room Number *',
      hotelAddress: 'Hotel Address & City *',
      guestName: 'Registered Guest Name *',
      guestPhone: 'Phone / WhatsApp / Mobile *',
      hotelNote: 'Convenience note: VAN KY couriers deliver directly to your hotel. When returning, simply hand the package to your hotel front desk concierge.',
      conflictAlert: 'This costume is already booked during these dates! Please select different dates.',
      financialTable: 'Transparent Rental Financial Breakdown',
      rentalFee: 'Attire Rental Fee',
      depositFee: 'Refundable Security Deposit (100% returned upon safe check)',
      platformFee: 'VAN KY Escrow & Protection Fee',
      shippingFee: 'Hotel Concierge / Delivery Fee',
      totalPayment: 'INITIAL TOTAL PAYMENT',
      paymentMethodLabel: 'Select Payment Method',
      methodCard: 'International Credit / Debit Card (Visa, MasterCard, JCB, Amex)',
      methodVietQR: 'VietQR / Local Bank Transfer',
      methodWallet: 'Digital Wallet / PayPal',
      confirmPay: 'Confirm Payment & Lock in Escrow',
      successTitle: 'Rental Successfully Booked!',
      successSub: 'Your Order Tracking ID:',
      successDesc: 'Rental funds and deposit are securely locked in the VAN KY Escrow Vault. The partner boutique is preparing your attire now.',
      goToOrders: 'Track Status in "My Orders"',
      continueBrowsing: 'Continue Exploring'
    },
    orders: {
      title: 'My Rental Orders & Escrow Tracking',
      subtitle: 'Monitor your attire journey across 5 verified steps. Rental funds and security deposits remain safely protected until return inspection.',
      allTab: 'All Orders',
      activeTab: 'In Progress',
      completedTab: 'Refunded & Completed',
      advanceStepDemo: 'Advance to Next Step (Demo)',
      stepSequence: 'Order Progress (5-Step Escrow Verification)',
      step1: 'Deposit Locked',
      step2: 'In Transit / Ready',
      step3: 'In Use',
      step4: 'Returned',
      step5: 'Completed & Refunded',
      inspectionTitle: 'Attire Return Inspection & Quality Report',
      inspectionDesc: 'The costume has been returned to the boutique. The partner inspects fabric condition and embroidery to trigger instant deposit refund.',
      inspectionPhoto: 'Post-return condition photo',
      uploadPhoto: 'Upload condition photo',
      changePhoto: 'Change photo',
      evaluationLabel: 'Costume Quality Assessment',
      perfectOption: '100% Pristine Condition (100% Deposit Refunded)',
      perfectDesc: 'Silk fabric is clean, seams intact, accessories complete. Full deposit refunded immediately.',
      minorOption: 'Minor Wear / Stain (Partial Deposit Deduction)',
      minorDesc: 'Standard restoration fee applied according to VAN KY protocol. Remaining deposit is returned immediately.',
      stainDeduction: 'Lipstick / light stain cleaning (-$4.80 / -120.000đ)',
      threadDeduction: 'Loose seam repair (-$6.00 / -150.000đ)',
      inspectionNoteLabel: 'Boutique inspection notes',
      confirmInspection: 'Confirm Inspection & Disburse Payout / Refund Now',
      ledgerTitle: 'Escrow Cash Flow & Financial Ledger',
      ledgerDisbursed: 'Fully Disbursed',
      ledgerHolding: 'Locked in Escrow Vault',
      payoutPartner: 'Rental fee paid to boutique',
      platformRevenue: 'VAN KY platform service fee',
      depositRefund: 'Security deposit refunded to customer',
      payoutNoteDisbursed: '✓ Transferred to boutique',
      payoutNoteHolding: 'Holding in escrow',
      refundNoteDisbursed: '✓ Refunded to customer',
      refundNoteHolding: '100% refunded when returned clean'
    },
    chat: {
      title: 'Van – AI Attire Stylist',
      badge: 'Powered by Gemini AI',
      subtitle: 'Traditional Vietnamese dress code & event styling advisor',
      welcome: 'Hello! I am Van, your Vietnamese Ancient Attire Stylist at VAN KY. 🌿\n\nI can help you select the most historically authentic costume tailored to your destination and occasion: Hue Imperial Citadel, Hoi An Ancient Town, Hanoi Temple of Literature, or graduation photos. Where are you heading?',
      placeholder: 'Ask Van about dress codes, destinations, color rules...',
      send: 'Send',
      reset: 'Reset',
      contextTitle: 'Select Styling Context',
      quickSuggestions: 'Quick Suggestions:',
      applyToStudio: 'Try this look in Studio'
    }
  }
};
