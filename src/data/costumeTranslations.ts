export interface CostumeTranslation {
  vietnameseName: string;
  englishSubtitle: string;
  englishPeriod: string;
  englishWearer: string;
  englishShortDesc: string;
  englishHistoryContext: string;
  englishStory: string;
  englishIdentifyingFeatures: string[];
  englishOccasions: string[];
  englishCulturalNotes: string;
  englishContemporaryStyling?: string;
}

export const COSTUME_TRANSLATIONS: Record<string, CostumeTranslation> = {
  'nhat-binh': {
    vietnameseName: 'Áo Nhật Bình',
    englishSubtitle: 'Nhat Binh, royal ceremonial robe of the Nguyen court',
    englishPeriod: 'Nguyen Dynasty (1802 – 1945)',
    englishWearer: 'Women (Empress Dowagers, Empresses, Princesses, and Noble Consorts)',
    englishShortDesc: 'Noble court regalia of Empresses and Princesses featuring a bold rectangular chest band and five-color cyclic fringe ribbons.',
    englishHistoryContext: 'Nhat Binh was the daily court attire of high-ranking royal women in the Nguyen Dynasty. Adapted from earlier East Asian robes, it was uniquely indigenized into a distinctive Vietnamese imperial silhouette. In the late Nguyen era, it also became the prestigious bridal gown of southern gentry.',
    englishStory: 'The name Nhat Binh literally refers to the prominent rectangular collar framed symmetrically across the chest. In the forbidden purple city, intricate floral and wave patterns strictly reflected imperial ranks. Today, Nhat Binh is a treasured icon for weddings and artistic heritage portraits.',
    englishIdentifyingFeatures: [
      'Bold rectangular embroidered collar across the chest',
      'Double side-slit outer robe flowing over inner tunic',
      'Five-color cyclic woven ribbon bands at sleeve cuffs and hem',
      'Wide ceremonial draped sleeves'
    ],
    englishOccasions: [
      'Traditional Lunar New Year (Tet)',
      'Ancestral Vietnamese Wedding ceremonies',
      'Imperial Citadel heritage photography'
    ],
    englishCulturalNotes: 'Strictly avoid five-clawed dragon motifs reserved for the Emperor. Never pair with modern casual shorts or revealing skirts underneath. Walk with measured, dignified grace.',
    englishContemporaryStyling: 'Layer gracefully over clean white high-waisted silk palazzo pants or a neutral maxi silk dress; pair with a braided floral headband for royal poise.'
  },
  'ao-tac': {
    vietnameseName: 'Áo Tấc',
    englishSubtitle: 'Ao Tac, wide-sleeved ceremonial robe of Nguyen dynasty',
    englishPeriod: 'Nguyen Dynasty (From mid-18th century)',
    englishWearer: 'Unisex (Royals, Mandarins, Scholars, and Commoners in rituals)',
    englishShortDesc: 'Universal ceremonial attire across all social strata of the Nguyen era, featuring wide flowing sleeves and five modest buttoned panels.',
    englishHistoryContext: 'Established under the cultural clothing reforms of Lord Nguyen Phuc Khoat to distinguish southern Vietnamese identity, Ao Tac became the quintessential ritual robe for sacred sacrifices, ancestral worship, and formal family unions.',
    englishStory: 'The folk name Ao Tac comes from the sleeve hem measuring exactly one "tac" (approx 4cm in ancient measurements). Its loose, majestic drape gives anyone who wears it an instant aura of scholarly elegance and stately poise, universally flattering across all body shapes.',
    englishIdentifyingFeatures: [
      'Square-cut upright collar (lap linh) hugging the throat',
      'Five overlapping panels symbolizing filial piety and protection',
      'Broad, flowing sleeves extending well past hands',
      'Five buttons down the right seam symbolizing Five Cardinal Virtues'
    ],
    englishOccasions: [
      'Temple and shrine ancestral ceremonies',
      'Engagement and traditional wedding rites',
      'Graduation ceremonies and cultural festivals'
    ],
    englishCulturalNotes: 'Sleeves are broad and long; fold hands gently before the chest when walking or greeting elders. Never roll up the cuffs during formal proceedings.',
    englishContemporaryStyling: 'Choose pastel tones like blush pink or jade green, styled with minimal cloth headbands and leather brogues or Mary Janes for a collegiate heritage vibe.'
  },
  'ao-vien-linh': {
    vietnameseName: 'Áo Viên Lĩnh',
    englishSubtitle: 'Vien Linh, round-collar robe of the Le dynasty',
    englishPeriod: 'Early Le Dynasty (1428 – 1527)',
    englishWearer: 'Men (Mandarin court officials, nobles, and civil scholars)',
    englishShortDesc: 'Stately round-collar formal robe of medieval Dai Viet civil and military officials, adorned with embroidered mandarin chest badges.',
    englishHistoryContext: 'Prevalent during the glorious Ly, Tran, and Le dynasties, Vien Linh represented administrative authority and Confucian legal order in the Thang Long royal court, complete with ranking belt plaques and rank badges.',
    englishStory: 'Unlike later upright collars, Vien Linh features a distinctive snug circular neckline wrapping around the throat with diagonal right-side fastening. Adorned with a square chest badge (bo tu), it radiates the dignified aura of Dai Viet scholars and military strategists.',
    englishIdentifyingFeatures: [
      'Circular snug round collar fastened on the right shoulder',
      'Square embroidered rank badge (bo tu) on front and back',
      'Firm leather or silk sash belt fastened at waist',
      'Deep, spacious sleeves tailored for bureaucratic court etiquette'
    ],
    englishOccasions: [
      'Court festival reenactments',
      'Thang Long historic citadel tours',
      'Solemn cultural ceremonies and historical exhibitions'
    ],
    englishCulturalNotes: 'Keep the round collar securely buttoned. Respect rank symbolism: civil officers wore celestial birds (cranes, egrets) while military commanders wore noble beasts (qilins, white tigers).',
    englishContemporaryStyling: 'Keep styling purist with dark leather shoes, traditional black turban, and clean posture against mossy stone architecture.'
  },
  'ao-giao-linh': {
    vietnameseName: 'Áo Giao Lĩnh',
    englishSubtitle: 'Giao Linh, cross-collar robe of Ly - Tran era',
    englishPeriod: 'Ly – Tran – Early Le Dynasties (11th – 15th century)',
    englishWearer: 'Men & Women (Medieval scholars, nobility, and gentry)',
    englishShortDesc: 'Iconic crossed Y-collar robe embodying the heroic, philosophical essence of the golden Ly - Tran Buddhist era.',
    englishHistoryContext: 'One of the most ancient canonical robes of Vietnamese civilization. Worn across social strata with varying textiles, Giao Linh is characterized by deep flowing sleeves and an elegant crossed neckline.',
    englishStory: 'The defining essence of Giao Linh is the left lapel gently overlapping the right, secured by a flowing sash. Evoking the spirit of medieval Thang Long knights and scholars, it pairs beautifully with ancient stone pagodas and sacred grounds.',
    englishIdentifyingFeatures: [
      'Crossed Y-collar overlapping strictly left over right (Huu Nham)',
      'Loose flowing ceremonial sleeves with contrasting collar piping',
      'Long fabric sash tied naturally at the waist',
      'Natural raw mulberry silk and rustic vegetable-dyed colors'
    ],
    englishOccasions: [
      'Temple pilgrimages and meditation retreats',
      'Autumn poetry readings and cultural tea ceremonies',
      'Historic documentary and fine art portraiture'
    ],
    englishCulturalNotes: 'CRITICAL CANONICAL RULE: Always cross left lapel over right (Huu Nham). Wrapping right over left (Ta Nham) is reserved strictly for shrouding the deceased in ancient tradition.',
    englishContemporaryStyling: 'Pair in neutral oatmeal or raw linen textures with a hand-carved wooden hairpin and minimalist canvas shoes for a wabi-sabi oriental aesthetic.'
  },
  'ao-ngu-than-tay-chen': {
    vietnameseName: 'Áo Ngũ Thân tay chẽn',
    englishSubtitle: 'Ngu Than Tay Chen, five-panel tight-sleeved robe',
    englishPeriod: 'Nguyen Dynasty (1802 – 1945)',
    englishWearer: 'Men & Women (Universal national dress of scholars and citizens)',
    englishShortDesc: 'The canonical universal daily robe of 19th-century Vietnam, featuring five modest panels and practical fitted sleeves.',
    englishHistoryContext: 'Decreed by Emperor Minh Mang as the nationwide formal standard dress for both North and South, uniting Vietnamese sartorial culture under the five-panel philosophy.',
    englishStory: 'The five panels symbolize parental love (four outer panels for parents and parents-in-law, wrapping the inner fifth panel for oneself). Tailored with sleek fitted sleeves, it allowed intellectuals and gentry to move with ease while keeping upright moral decorum.',
    englishIdentifyingFeatures: [
      'Upright standing collar (lap linh) standing 3-4cm tall',
      'Five buttoned panels tailored with modest concealing drape',
      'Fitted narrow sleeves at wrist (tay chen) for agile motion',
      'Five buttons down right torso representing Confucian virtues'
    ],
    englishOccasions: [
      'Temple of Literature visits and graduation portraits',
      'Diplomatic and formal cultural conferences',
      'Daily heritage tours and tea ceremonies'
    ],
    englishCulturalNotes: 'Keep the collar neatly buttoned; choose subtle indigo, olive green, or ivory silk. Avoid oversized synthetic cuts that lose the garment’s modest silhouette.',
    englishContemporaryStyling: 'Wear with cropped tailored trousers, handcrafted wooden clogs or minimalist loafers for an exceptionally sophisticated modern intellectual look.'
  },
  'ao-tu-than': {
    vietnameseName: 'Áo Tứ Thân',
    englishSubtitle: 'Tu Than, northern four-panel folk attire',
    englishPeriod: 'Northern Folklore Heritage (Centuries of tradition)',
    englishWearer: 'Women (Northern agrarian folk maidens and Quan Ho singers)',
    englishShortDesc: 'Poetic northern folk costume with four flowing outer panels revealing an inner scarlet silk halter bodice (yem).',
    englishHistoryContext: 'Born from agrarian river deltas of Northern Vietnam, Ao Tu Than was designed for labor convenience while expressing feminine grace through layered sashes and vibrant silk yems.',
    englishStory: 'Associated with the romantic Quan Ho love duets of Bac Ninh, Ao Tu Than captures the tender charm of northern maidens. The outer rustic brown robe parts to reveal a glimpse of lotus-pink yem, completed with a broad tilted palm hat (non quai thao).',
    englishIdentifyingFeatures: [
      'Four flowing outer panels: two back panels stitched together, two front panels free',
      'Inner halter bodice (yem) in bright rose or peach silk',
      'Flowing silk waist sash in vibrant contrast hues',
      'Large flat palm hat with fringe tassels (non quai thao)'
    ],
    englishOccasions: [
      'Village đình festivals and spring river fairs',
      'Traditional folk singing and performance art',
      'Poetic countryside and banyan tree photography'
    ],
    englishCulturalNotes: 'Do not tie the front panels too high up exposing the midriff. Maintain gentle, modest feminine charm reflecting traditional northern etiquette.',
    englishContemporaryStyling: 'Wear the outer coat unknotted over clean linen culottes and minimalist leather sandals for a bohemian rural-chic weekend vibe.'
  },
  'ao-dai': {
    vietnameseName: 'Áo Dài Truyền Thống',
    englishSubtitle: 'Traditional Vietnamese Ao Dai',
    englishPeriod: '20th Century to Present (Modern Golden Era)',
    englishWearer: 'Women & Men (National Dress of Vietnam)',
    englishShortDesc: 'The world-famous National Dress of Vietnam, characterized by a form-fitting tunic with side slits flowing over wide silk trousers.',
    englishHistoryContext: 'Evolving from the 19th-century Ao Ngu Than into the Lemur and Le Pho modernizations of the 1930s, Ao Dai became the supreme emblem of Vietnamese elegance on the international stage.',
    englishStory: 'Ao Dai embraces every curve with poetic grace while remaining completely modest: "covers everything yet reveals all". Walking in an Ao Dai makes every movement flow like water.',
    englishIdentifyingFeatures: [
      'Mandarin collar or open boat neckline',
      'Deep side slits from waistline down to hem',
      'Floor-length twin panels floating effortlessly over trousers',
      'Wide-leg fluid silk trousers in contrasting or tonal shades'
    ],
    englishOccasions: [
      'National diplomacy and cultural festivals',
      'Weddings and formal receptions',
      'Scenic landmark strolls in Hanoi, Hoi An, and Saigon'
    ],
    englishCulturalNotes: 'Ensure the fabric is not see-through in sunlight. Walk with balanced poise; lift panels gently when mounting stairs or cycling.',
    englishContemporaryStyling: 'Pair with an authentic conical hat (non la), dainty pearl drop earrings, and block-heel sandals for timeless aesthetic perfection.'
  },
  'ao-dai-cach-tan': {
    vietnameseName: 'Áo Dài Cách Tân',
    englishSubtitle: 'Modernized Gen Z Ao Dai',
    englishPeriod: 'Contemporary (2010s – Present)',
    englishWearer: 'Youth & Gen Z (Young women and creative fashion lovers)',
    englishShortDesc: 'Playful, modern interpretation of Ao Dai featuring knee-length hems, puffed sleeves, and relaxed pairing with sneakers or skirts.',
    englishHistoryContext: 'Created to suit modern active lifestyles, modernized Ao Dai reimagines heritage silhouettes with contemporary tailoring, breathable fabrics, and vibrant street energy.',
    englishStory: 'No longer reserved only for solemn rites, this youthful version is beloved by Vietnamese Gen Z for festive cafe strolls, Lunar New Year outings, and creative street editorial shoots.',
    englishIdentifyingFeatures: [
      'Knee-length or midi A-line tunic length',
      'Stylized puff sleeves or sleeveless summer cuts',
      'Paired with pleated culottes, midi skirts, or jeans',
      'Vibrant pastel florals or minimal block colors'
    ],
    englishOccasions: [
      'Weekend street photography and cafe hopping',
      'Youth cultural meetups and graduation celebrations',
      'Spring Tet visits with friends and family'
    ],
    englishCulturalNotes: 'While celebrating youthful freedom, respect the garment’s soul: avoid overly plunging necklines or offensive pop slogans.',
    englishContemporaryStyling: 'Pair with clean white tennis sneakers, a micro shoulder bag, and dainty woven hair ribbons for that quintessential Hanoi Old Quarter chic.'
  }
};
