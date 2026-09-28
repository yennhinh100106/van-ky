import React from 'react';

interface StudioDollProps {
  costumeId: string;
  colorHex: string;
  accessories: string[];
  modelGender: 'nu' | 'nam';
  backgroundScene: string;
  userAvatar?: string;
}

export const StudioDoll: React.FC<StudioDollProps> = ({
  costumeId,
  colorHex,
  accessories,
  modelGender,
  backgroundScene,
  userAvatar
}) => {
  // Background presets
  const bgStyles: Record<string, { bgClass: string; decor: React.ReactNode }> = {
    hue: {
      bgClass: "from-[#8B2635]/20 via-[#F6EFE3] to-[#B8862B]/20",
      decor: (
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 600">
          <path d="M50 180 Q 200 120 350 180 L 330 200 L 70 200 Z" fill="#8B2635" />
          <rect x="90" y="200" width="220" height="180" fill="none" stroke="#8B2635" strokeWidth="2" />
          <circle cx="200" cy="100" r="45" fill="#D4A347" opacity="0.4" />
        </svg>
      )
    },
    thanglong: {
      bgClass: "from-[#1F2A44]/20 via-[#F6EFE3] to-[#FAF6ED]",
      decor: (
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 600">
          <path d="M40 220 L 200 130 L 360 220" stroke="#1F2A44" strokeWidth="3" fill="none" />
          <path d="M60 250 H 340" stroke="#1F2A44" strokeWidth="2" />
        </svg>
      )
    },
    hoian: {
      bgClass: "from-[#D4A347]/25 via-[#F6EFE3] to-[#A4161A]/15",
      decor: (
        <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none" viewBox="0 0 400 600">
          <circle cx="90" cy="90" r="22" fill="#A4161A" />
          <line x1="90" y1="20" x2="90" y2="70" stroke="#B8862B" strokeWidth="2" />
          <circle cx="310" cy="110" r="18" fill="#D4A347" />
          <line x1="310" y1="40" x2="310" y2="92" stroke="#B8862B" strokeWidth="2" />
        </svg>
      )
    },
    nharuong: {
      bgClass: "from-[#4A3222]/15 via-[#F6EFE3] to-[#FAF6ED]",
      decor: (
        <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" viewBox="0 0 400 600">
          <rect x="70" y="50" width="16" height="500" fill="#4A3222" />
          <rect x="314" y="50" width="16" height="500" fill="#4A3222" />
          <line x1="50" y1="120" x2="350" y2="120" stroke="#4A3222" strokeWidth="8" />
        </svg>
      )
    },
    studio: {
      bgClass: "from-[#F6EFE3] via-[#FAF6ED] to-[#EADECB]",
      decor: (
        <div className="absolute inset-0 bg-do-paper opacity-50 pointer-events-none" />
      )
    }
  };

  const currentBg = bgStyles[backgroundScene] || bgStyles.studio;

  // Normalized costume matchers
  const isNhatBinh = costumeId === 'nhat-binh' || costumeId === 'ao-nhat-binh' || costumeId === 'nhat-binh-01';
  const isAoTac = costumeId === 'ao-tac' || costumeId === 'ao-tac-02';
  const isNguThan = costumeId === 'ao-ngu-than-tay-chen' || costumeId === 'ao-ngu-than' || costumeId === 'ngu-than-03';
  const isTuThan = costumeId === 'ao-tu-than' || costumeId === 'tu-than-04';
  const isGiaoLinh = costumeId === 'ao-giao-linh' || costumeId === 'giao-linh-05';
  const isDoiKham = costumeId === 'ao-doi-kham';
  const isVienLinh = costumeId === 'ao-vien-linh' || costumeId === 'vien-linh-08';
  const isAoDai = costumeId === 'ao-dai' || costumeId === 'ao-dai-co-phuc' || costumeId === 'ao-dai-hien-dai-06';
  const isAoDaiCachTan = costumeId === 'ao-dai-cach-tan' || costumeId === 'ao-dai-cach-tan-07';

  // Has accessories flags
  const hasKhanDong = accessories.includes('khan-dong');
  const hasKhanVanh = accessories.includes('khan-vanh-day');
  const hasNonQuaiThao = accessories.includes('non-quai-thao');
  const hasNonLa = accessories.includes('non-la');
  const hasKhanMoQua = accessories.includes('khan-mo-qua');
  const hasMan = accessories.includes('man-ngu-sac');
  const hasKieng = accessories.includes('vong-kieng');
  const hasTram = accessories.includes('tram-cai-vang');
  const hasXaTich = accessories.includes('chuoi-xa-tich');
  const hasThatLung = accessories.includes('that-lung-lua');
  const hasQuat = accessories.includes('quat-xep-lua');
  const hasGuoc = accessories.includes('guoc-moc');

  return (
    <div className={`relative w-full h-[480px] sm:h-[580px] rounded border border-[#D8CEBE] overflow-hidden bg-gradient-to-b ${currentBg.bgClass} flex items-center justify-center select-none shadow-inner`}>
      {/* Background Decor */}
      {currentBg.decor}

      {/* SVG Canvas Doll Representation */}
      <svg
        viewBox="0 0 400 600"
        className="w-full h-full max-w-[420px] drop-shadow-xl"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Fabric Gradient */}
          <linearGradient id="garmentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colorHex} stopOpacity="1" />
            <stop offset="60%" stopColor={colorHex} stopOpacity="0.94" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>

          {/* Gold Trim Gradient */}
          <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#B8862B" />
            <stop offset="50%" stopColor="#F5D77F" />
            <stop offset="100%" stopColor="#B8862B" />
          </linearGradient>

          {/* Skin Gradient */}
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F9DFCE" />
            <stop offset="100%" stopColor="#E5C4AE" />
          </linearGradient>
        </defs>

        {/* 1. MODEL BODY LAYER */}
        {/* Head & Neck */}
        <g id="model-body">
          {/* Shadow beneath character */}
          <ellipse cx="200" cy="565" rx="85" ry="12" fill="#000000" opacity="0.18" />

          {/* Legs / Silk Trousers Base */}
          <rect x="165" y="420" width="32" height="135" rx="5" fill="#FAF6ED" stroke="#DDD4C5" strokeWidth="1.2" />
          <rect x="203" y="420" width="32" height="135" rx="5" fill="#FAF6ED" stroke="#DDD4C5" strokeWidth="1.2" />

          {/* Neck */}
          <rect x="189" y="142" width="22" height="38" rx="4" fill="url(#skinGrad)" />

          {/* Face */}
          {userAvatar ? (
            <image
              href={userAvatar}
              x="165"
              y="75"
              width="70"
              height="80"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#faceClip)"
            />
          ) : (
            <ellipse cx="200" cy="115" rx="30" ry="38" fill="url(#skinGrad)" />
          )}

          {/* Facial Features (if no avatar) */}
          {!userAvatar && (
            <g opacity="0.8">
              {/* Eyes */}
              <ellipse cx="188" cy="112" rx="3.5" ry="1.5" fill="#2B1E16" />
              <ellipse cx="212" cy="112" rx="3.5" ry="1.5" fill="#2B1E16" />
              {/* Eyebrows */}
              <path d="M182 105 Q 188 102 194 105" stroke="#2B1E16" strokeWidth="1.2" fill="none" />
              <path d="M206 105 Q 212 102 218 105" stroke="#2B1E16" strokeWidth="1.2" fill="none" />
              {/* Nose */}
              <path d="M200 110 L 198 122 L 202 122" stroke="#B8862B" strokeWidth="1" fill="none" opacity="0.4" />
              {/* Lips */}
              <path d="M192 133 Q 200 137 208 133" stroke="#A4161A" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            </g>
          )}

          {/* Hair */}
          <path
            d={
              modelGender === 'nu'
                ? "M170 110 C 170 70 230 70 230 110 C 230 125 220 130 220 135 C 220 100 180 100 180 135 C 180 125 170 120 170 110 Z"
                : "M170 105 C 170 72 230 72 230 105 C 225 90 175 90 170 105 Z"
            }
            fill="#1A1816"
          />
        </g>

        {/* 2. INNER LAYER (White Collar, Yếm if Tu Than) */}
        {isTuThan ? (
          <g id="yem-dao">
            <path d="M185 160 Q 200 152 215 160 L 225 240 L 175 240 Z" fill="#C95A72" />
            <circle cx="200" cy="165" r="4" fill="#B8862B" />
          </g>
        ) : (
          <g id="inner-collar">
            {/* White standing collar lining */}
            <path d="M188 152 H 212 V 172 H 188 Z" fill="#FFFFFF" stroke="#E2DCD0" strokeWidth="1" />
          </g>
        )}

        {/* 3. MAIN COSTUME LAYER (Dynamic SVG depending on costumeId) */}
        <g id="costume-layer">
          {isNhatBinh && (
            // Áo Nhật Bình: rectangular chest band + ngũ sắc sleeves + long front panels
            <g>
              {/* Main Body */}
              <path
                d="M175 165 L 120 220 L 140 370 L 165 310 L 155 490 L 245 490 L 235 310 L 260 370 L 280 220 L 225 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.5"
              />
              {/* Dải ngũ sắc ở cổ tay áo */}
              <g>
                <path d="M120 220 L 140 370 L 148 360 L 130 220 Z" fill="#2A5C8A" />
                <path d="M148 360 L 156 350 L 138 220 L 130 220 Z" fill="#D4A347" />
                <path d="M280 220 L 260 370 L 252 360 L 270 220 Z" fill="#2A5C8A" />
                <path d="M252 360 L 244 350 L 262 220 L 270 220 Z" fill="#D4A347" />
              </g>
              {/* Cổ áo hình chữ nhật đặc trưng của Nhật Bình */}
              <rect x="182" y="165" width="36" height="90" fill="#FAF6ED" stroke="#B8862B" strokeWidth="2" rx="2" />
              <rect x="187" y="170" width="26" height="80" fill="none" stroke="#A4161A" strokeWidth="1.5" />
              {/* Hai dải bồi rủ xuống ngực */}
              <line x1="192" y1="255" x2="192" y2="460" stroke="#D4A347" strokeWidth="3.5" />
              <line x1="208" y1="255" x2="208" y2="460" stroke="#D4A347" strokeWidth="3.5" />
              {/* Hoa văn ngực áo */}
              <circle cx="200" cy="205" r="7" fill="#A4161A" />
              <circle cx="200" cy="205" r="4" fill="#D4A347" />
            </g>
          )}

          {isAoTac && (
            // Áo Tấc: Grand wide sleeves, five-button standing collar
            <g>
              {/* Grand wide flowing sleeves */}
              <path
                d="M175 165 L 85 240 L 95 440 L 165 330 L 155 510 L 245 510 L 235 330 L 305 440 L 315 240 L 225 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.5"
              />
              {/* Standing Collar with 5 Buttons */}
              <path d="M188 152 Q 200 156 212 152 V 175 Q 200 179 188 175 Z" fill="#FAF6ED" stroke="#B8862B" strokeWidth="1.5" />
              {/* Nách phải 5 khuy cúc đồng */}
              <line x1="202" y1="175" x2="218" y2="240" stroke="#333" strokeWidth="1" strokeDasharray="2 2" />
              <circle cx="202" cy="180" r="2.5" fill="#D4A347" />
              <circle cx="206" cy="195" r="2.5" fill="#D4A347" />
              <circle cx="210" cy="210" r="2.5" fill="#D4A347" />
              <circle cx="214" cy="225" r="2.5" fill="#D4A347" />
              <circle cx="218" cy="240" r="2.5" fill="#D4A347" />
              {/* Sleeve fold creases */}
              <path d="M125 310 Q 140 370 120 420" stroke="#000" strokeWidth="1" opacity="0.3" fill="none" />
              <path d="M275 310 Q 260 370 280 420" stroke="#000" strokeWidth="1" opacity="0.3" fill="none" />
            </g>
          )}

          {isNguThan && (
            // Áo Ngũ Thân: tay chẽn ôm sát, 5 vạt, cổ đứng
            <g>
              <path
                d="M178 165 L 138 230 L 152 355 L 168 335 L 160 515 L 240 515 L 232 335 L 248 355 L 262 230 L 222 165 Z"
                fill="url(#garmentGrad)"
                stroke="#8A6B32"
                strokeWidth="1.5"
              />
              {/* Cổ đứng */}
              <path d="M188 152 H 212 V 174 H 188 Z" fill={colorHex} stroke="#B8862B" strokeWidth="1.5" />
              {/* 5 Cúc cẩn ngọc */}
              <circle cx="200" cy="177" r="2.5" fill="#FAF6ED" stroke="#D4A347" strokeWidth="0.8" />
              <circle cx="204" cy="192" r="2.5" fill="#FAF6ED" stroke="#D4A347" strokeWidth="0.8" />
              <circle cx="208" cy="207" r="2.5" fill="#FAF6ED" stroke="#D4A347" strokeWidth="0.8" />
              <circle cx="212" cy="222" r="2.5" fill="#FAF6ED" stroke="#D4A347" strokeWidth="0.8" />
              <circle cx="216" cy="237" r="2.5" fill="#FAF6ED" stroke="#D4A347" strokeWidth="0.8" />
              {/* Sống áo giữa lưng */}
              <line x1="200" y1="174" x2="200" y2="515" stroke="#000000" strokeWidth="1" opacity="0.25" />
            </g>
          )}

          {isTuThan && (
            // Áo Tứ Thân: vạt mở phơi yếm, vạt buộc chéo, dải lưng xanh
            <g>
              {/* Áo khoác ngoài mở tà */}
              <path
                d="M175 165 L 130 230 L 145 350 L 165 320 L 168 470 L 180 500 L 185 360 L 175 240 Z"
                fill="url(#garmentGrad)"
                stroke="#333"
                strokeWidth="1.2"
              />
              <path
                d="M225 165 L 270 230 L 255 350 L 235 320 L 232 470 L 220 500 L 215 360 L 225 240 Z"
                fill="url(#garmentGrad)"
                stroke="#333"
                strokeWidth="1.2"
              />
              {/* Váy Đụp Đen Mun bên dưới */}
              <path d="M165 340 L 235 340 L 245 520 L 155 520 Z" fill="#202020" stroke="#111" strokeWidth="1" />
              {/* Vạt buộc chéo trước bụng */}
              <path d="M178 335 Q 200 355 222 335 L 205 380 L 195 380 Z" fill={colorHex} stroke="#333" strokeWidth="1" />
              {/* Dải lưng lụa xanh màu mạ rủ xuống */}
              <path d="M185 340 L 190 440 L 198 440 L 193 340 Z" fill="#4F772D" />
              <path d="M207 340 L 210 425 L 202 425 L 203 340 Z" fill="#C95A72" />
            </g>
          )}

          {isGiaoLinh && (
            // Áo Giao Lĩnh: Cổ chéo vạt trái đè vạt phải (Hữu Nhậm)
            <g>
              <path
                d="M175 165 L 105 240 L 125 380 L 165 320 L 150 515 L 250 515 L 235 320 L 275 380 L 295 240 L 225 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.5"
              />
              {/* Cổ chéo chữ V vạt trái đè vạt phải */}
              <path d="M180 165 L 220 250 L 212 254 L 175 170 Z" fill="#FAF6ED" stroke="#B8862B" strokeWidth="1.5" />
              <path d="M220 165 L 180 230" stroke="#B8862B" strokeWidth="1.5" />
              {/* Thắt lưng dải ngọc bên sườn */}
              <rect x="175" y="270" width="50" height="12" fill="#B8862B" rx="2" />
            </g>
          )}

          {isDoiKham && (
            // Áo Đối Khâm: hai vạt song song buông thẳng phơi xiêm y
            <g>
              {/* Xiêm váy bên trong */}
              <rect x="175" y="200" width="50" height="310" fill="#FAF6ED" stroke="#D8CEBE" strokeWidth="1" />
              {/* Hai vạt ngoài song song buông thẳng */}
              <path
                d="M175 165 L 105 235 L 125 380 L 165 320 L 160 515 L 185 515 L 185 190 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.2"
              />
              <path
                d="M225 165 L 295 235 L 275 380 L 235 320 L 240 515 L 215 515 L 215 190 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.2"
              />
              {/* Viền nẹp thêu hoa sen */}
              <rect x="180" y="170" width="6" height="345" fill="url(#goldTrim)" />
              <rect x="214" y="170" width="6" height="345" fill="url(#goldTrim)" />
            </g>
          )}

          {isVienLinh && (
            // Áo Viên Lĩnh: Cổ tròn + Bổ Tử trước ngực
            <g>
              <path
                d="M175 165 L 100 240 L 120 400 L 165 330 L 150 515 L 250 515 L 235 330 L 280 400 L 300 240 L 225 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.5"
              />
              {/* Cổ áo tròn ôm khít */}
              <circle cx="200" cy="168" r="18" fill="none" stroke="#FAF6ED" strokeWidth="4" />
              {/* Tấm Bổ Tử (Ngực áo Quan lại) */}
              <rect x="180" y="210" width="40" height="40" fill="#1F2A44" stroke="#D4A347" strokeWidth="2" rx="2" />
              <circle cx="200" cy="230" r="10" fill="#A4161A" />
              <polygon points="200,222 203,235 197,235" fill="#D4A347" />
              {/* Đai lưng ngọc */}
              <rect x="165" y="275" width="70" height="12" fill="#D4A347" stroke="#8A6B32" strokeWidth="1" rx="2" />
            </g>
          )}

          {isAoDai && (
            // Áo Dài Tân Thời / Cổ Phục
            <g>
              <path
                d="M180 165 L 148 230 L 162 345 L 172 320 L 162 525 L 238 525 L 228 320 L 238 345 L 252 230 L 220 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.2"
              />
              {/* Cổ đứng cao thanh lịch */}
              <path d="M190 150 H 210 V 168 H 190 Z" fill={colorHex} stroke="#B8862B" strokeWidth="1.2" />
              {/* Tà áo lượn eo */}
              <path d="M180 230 Q 185 280 178 320" stroke="#000" strokeWidth="0.8" opacity="0.3" fill="none" />
              <path d="M220 230 Q 215 280 222 320" stroke="#000" strokeWidth="0.8" opacity="0.3" fill="none" />
            </g>
          )}

          {isAoDaiCachTan && (
            // Áo Dài Cách Tân / Gen Z: tà lửng, tay bồng nhẹ, dáng suông chữ A
            <g>
              {/* Quần suông / Chân váy bên dưới */}
              <path d="M170 380 L 230 380 L 238 525 L 162 525 Z" fill="#FAF6ED" stroke="#E2DCD0" strokeWidth="1" />
              {/* Tà áo lửng ngang bắp đùi/gối */}
              <path
                d="M180 165 L 145 225 L 158 320 L 170 310 L 160 440 L 240 440 L 230 310 L 242 320 L 255 225 L 220 165 Z"
                fill="url(#garmentGrad)"
                stroke="#B8862B"
                strokeWidth="1.2"
              />
              {/* Cổ thuyền / cổ tròn cách tân */}
              <path d="M188 158 Q 200 168 212 158" stroke="#FAF6ED" strokeWidth="3" fill="none" />
              {/* Tay áo bồng nhẹ */}
              <ellipse cx="146" cy="225" rx="9" ry="14" fill="url(#garmentGrad)" opacity="0.4" />
              <ellipse cx="254" cy="225" rx="9" ry="14" fill="url(#garmentGrad)" opacity="0.4" />
            </g>
          )}
        </g>

        {/* 4. ACCESSORIES LAYER */}
        <g id="accessories-layer">
          {/* Headwear */}
          {hasKhanDong && (
            <g id="acc-khan-dong">
              <ellipse cx="200" cy="95" rx="34" ry="14" fill="#1A1816" stroke="#B8862B" strokeWidth="1.5" />
              {/* 7 nếp khăn xếp */}
              <path d="M170 95 Q 200 90 230 95" stroke="#333" strokeWidth="1" fill="none" />
              <path d="M172 98 Q 200 93 228 98" stroke="#333" strokeWidth="1" fill="none" />
            </g>
          )}

          {hasKhanVanh && (
            <g id="acc-khan-vanh">
              {/* Khăn vành dây hoàng cung Huế */}
              <ellipse cx="200" cy="90" rx="42" ry="18" fill="#D4A347" stroke="#A4161A" strokeWidth="2" />
              <ellipse cx="200" cy="90" rx="36" ry="14" fill="#B8862B" />
              <ellipse cx="200" cy="90" rx="30" ry="10" fill="#1A1816" />
              {/* Ngọc bội cài trên khăn */}
              <circle cx="200" cy="90" r="5" fill="#FAF6ED" stroke="#A4161A" strokeWidth="1" />
            </g>
          )}

          {hasNonQuaiThao && (
            <g id="acc-non-quai-thao">
              {/* Nón ba tầm phẳng tròn nghiêng sau lưng hoặc đội đầu */}
              <ellipse cx="140" cy="220" rx="55" ry="55" fill="#E5D3B3" stroke="#8A6B32" strokeWidth="2.5" opacity="0.95" />
              <circle cx="140" cy="220" r="12" fill="#B8862B" />
              {/* Quai thao màu đen & tua chỉ ngũ sắc */}
              <line x1="140" y1="220" x2="160" y2="340" stroke="#1A1816" strokeWidth="2" />
              <line x1="145" y1="220" x2="165" y2="350" stroke="#C95A72" strokeWidth="1.5" />
            </g>
          )}

          {hasNonLa && (
            <g id="acc-non-la">
              {/* Nón lá chóp nhọn trên đầu hoặc cầm tay */}
              <polygon points="200,45 155,100 245,100" fill="#EFE4CF" stroke="#B8862B" strokeWidth="1.5" />
              <line x1="170" y1="100" x2="195" y2="135" stroke="#C95A72" strokeWidth="1.5" />
              <line x1="230" y1="100" x2="205" y2="135" stroke="#C95A72" strokeWidth="1.5" />
            </g>
          )}

          {hasKhanMoQua && (
            <g id="acc-khan-mo-qua">
              {/* Khăn mỏ quạ tạo góc nhọn ở giữa trán */}
              <polygon points="172,95 200,108 228,95 224,80 176,80" fill="#1A1816" stroke="#333" strokeWidth="1" />
            </g>
          )}

          {hasMan && (
            <g id="acc-man">
              <ellipse cx="200" cy="92" rx="33" ry="12" fill="#A4161A" stroke="#D4A347" strokeWidth="1.5" />
              <circle cx="200" cy="92" r="3" fill="#D4A347" />
            </g>
          )}

          {/* Jewelry & Accessories */}
          {hasKieng && (
            <g id="acc-kieng">
              {/* Kiềng cổ bạc / vàng chạm cánh sen */}
              <path d="M186 166 Q 200 180 214 166" stroke="#D4A347" strokeWidth="4" fill="none" strokeLinecap="round" />
            </g>
          )}

          {hasTram && (
            <g id="acc-tram">
              <line x1="225" y1="95" x2="245" y2="85" stroke="#D4A347" strokeWidth="2.5" />
              <circle cx="245" cy="85" r="4" fill="#A4161A" />
              <circle cx="247" cy="87" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {hasXaTich && (
            <g id="acc-xa-tich">
              {/* Dây xà tích bạc bên hông */}
              <path d="M225 290 Q 235 340 228 390" stroke="#C0C0C0" strokeWidth="2" strokeDasharray="3 2" fill="none" />
              <circle cx="228" cy="390" r="4" fill="#C0C0C0" />
            </g>
          )}

          {hasThatLung && (
            <g id="acc-that-lung">
              <rect x="175" y="280" width="50" height="14" fill="#4F772D" rx="2" />
              <path d="M185 294 L 188 410 L 195 410 L 192 294 Z" fill="#D4A347" />
              <path d="M205 294 L 208 400 L 214 400 L 211 294 Z" fill="#C95A72" />
            </g>
          )}

          {hasQuat && (
            <g id="acc-quat">
              {/* Quạt xếp cầm tay */}
              <path d="M245 315 L 285 270 A 55 55 0 0 1 315 310 Z" fill="#FAF6ED" stroke="#B8862B" strokeWidth="1.5" />
              <line x1="245" y1="315" x2="285" y2="270" stroke="#4A3222" strokeWidth="2" />
              <line x1="245" y1="315" x2="315" y2="310" stroke="#4A3222" strokeWidth="2" />
              {/* Tranh thủy mặc trên quạt */}
              <circle cx="280" cy="295" r="4" fill="#A4161A" opacity="0.7" />
            </g>
          )}

          {hasGuoc && (
            <g id="acc-guoc">
              {/* Guốc mộc móng quỷ đế cong */}
              <path d="M165 555 Q 180 550 195 555 L 195 565 L 165 565 Z" fill="#8B5A2B" />
              <path d="M205 555 Q 220 550 235 555 L 235 565 L 205 565 Z" fill="#8B5A2B" />
              {/* Quai guốc nhung */}
              <path d="M172 554 Q 180 548 188 554" stroke="#A4161A" strokeWidth="3" fill="none" />
              <path d="M212 554 Q 220 548 228 554" stroke="#A4161A" strokeWidth="3" fill="none" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
