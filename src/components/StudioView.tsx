import React, { useState, useRef, useEffect } from 'react';
import { 
  Palette, Sparkles, Layers, ShieldAlert, CheckCircle2, Download, 
  Share2, Columns, RefreshCw, Upload, Image as ImageIcon, Info, ChevronRight, Eye,
  Heart, Bookmark, Trash2, X, Copy, Check, ExternalLink, QrCode, Smartphone, Link as LinkIcon, Send,
  Package, ShieldCheck, Compass, Users, Award
} from 'lucide-react';
import lookbookData from '../data/lookbook.json';
import { ACCESSORIES_DATA, TRADITIONAL_COLORS, PRESET_TONES } from '../data/accessories';
import { Costume, CulturalWarning, SavedOutfit, HarmonyScoreResult } from '../types/lookbook';
import { StudioDoll } from './StudioDoll';
import { HeritageCorner } from './TraditionalPattern';
import { normalizeVN } from '../utils/unicode';
import { COSTUME_PRICING, formatVND } from '../data/partners';
import { Language, Currency, formatPrice, UI_TRANSLATIONS, DESTINATIONS_DATA } from '../utils/i18n';
import { isCostumeCanonVerified } from '../utils/partnerStoreSettings';

interface StudioViewProps {
  initialCostumeId?: string;
  onNavigateToCostume?: (costumeId: string) => void;
  onOpenRentalModal?: (costume: Costume, colorName?: string, colorHex?: string, accessories?: string[]) => void;
  onNavigateToGroups?: () => void;
  language?: Language;
  currency?: Currency;
}

export const StudioView: React.FC<StudioViewProps> = ({ 
  initialCostumeId = 'nhat-binh',
  onOpenRentalModal,
  onNavigateToGroups,
  language = 'vi',
  currency = 'VND'
}) => {
  const costumes = React.useMemo(() => normalizeVN(lookbookData as Costume[]), []);
  const t = UI_TRANSLATIONS[language].studio;

  // Parse URL search parameters on initialization for unique shared links
  const urlParams = React.useMemo(() => {
    try {
      const search = window.location.search;
      if (!search) return null;
      const params = new URLSearchParams(search);
      return {
        costume: params.get('costume'),
        color: params.get('color'),
        colorName: params.get('colorName'),
        acc: params.get('acc'),
        scene: params.get('scene'),
        gender: params.get('gender')
      };
    } catch {
      return null;
    }
  }, []);

  // Studio State
  const [selectedCostumeId, setSelectedCostumeId] = useState<string>(() => {
    if (urlParams?.costume && costumes.some(c => c.id === urlParams.costume)) {
      return urlParams.costume;
    }
    return initialCostumeId;
  });
  const currentCostume = costumes.find(c => c.id === selectedCostumeId) || costumes[0];

  const [currentColorHex, setCurrentColorHex] = useState<string>(() => {
    if (urlParams?.color) return urlParams.color;
    return currentCostume.defaultColor || "#A4161A";
  });
  const [currentColorName, setCurrentColorName] = useState<string>(() => {
    if (urlParams?.colorName) return urlParams.colorName;
    return "Đỏ son chu sa";
  });
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>(() => {
    if (urlParams?.acc) {
      const list = urlParams.acc.split(',').filter(Boolean);
      if (list.length > 0) return list;
    }
    if (selectedCostumeId === 'nhat-binh' || selectedCostumeId === 'ao-nhat-binh' || selectedCostumeId === 'nhat-binh-01') {
      return ['khan-vanh-day', 'quat-xep-lua'];
    }
    if (selectedCostumeId === 'ao-tac' || selectedCostumeId === 'ao-tac-02') {
      return ['khan-dong', 'quat-xep-lua'];
    }
    if (selectedCostumeId === 'ao-tu-than' || selectedCostumeId === 'tu-than-04') {
      return ['non-quai-thao', 'khan-mo-qua', 'that-lung-lua'];
    }
    if (selectedCostumeId === 'ao-vien-linh' || selectedCostumeId === 'vien-linh-08') {
      return ['khan-dong'];
    }
    if (selectedCostumeId === 'ao-dai-cach-tan' || selectedCostumeId === 'ao-dai-cach-tan-07') {
      return ['man-ngu-sac'];
    }
    return ['khan-dong'];
  });

  const [modelGender, setModelGender] = useState<'nu' | 'nam'>(() => {
    if (urlParams?.gender === 'nam' || urlParams?.gender === 'nu') {
      return urlParams.gender;
    }
    return currentCostume.gender === 'nam' ? 'nam' : 'nu';
  });
  const [backgroundScene, setBackgroundScene] = useState<string>(() => {
    if (urlParams?.scene && ['hue', 'thanglong', 'hoian', 'nharuong', 'studio'].includes(urlParams.scene)) {
      return urlParams.scene;
    }
    return 'hue';
  });
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  // Sync initialCostumeId prop changes (e.g. from Lookbook tab)
  useEffect(() => {
    if (initialCostumeId && costumes.some(c => c.id === initialCostumeId)) {
      setSelectedCostumeId(initialCostumeId);
    }
  }, [initialCostumeId, costumes]);

  // Tabs: 'costume' | 'color' | 'accessories' | 'check'
  const [activeTab, setActiveTab] = useState<'costume' | 'color' | 'accessories' | 'check'>('costume');

  // Saved Outfits for Comparison (up to 3)
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>([]);
  const [showCompareModal, setShowCompareModal] = useState<boolean>(false);

  // AI Description & Mockup Review state
  const [aiGenerating, setAiGenerating] = useState<boolean>(false);
  const [aiReview, setAiReview] = useState<string | null>(null);

  // Export card modal
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);

  // Share Outfit Modal & Native Share State
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [sharePreviewUrl, setSharePreviewUrl] = useState<string | null>(null);
  const [isGeneratingSharePreview, setIsGeneratingSharePreview] = useState<boolean>(false);
  const [copiedShareLink, setCopiedShareLink] = useState<boolean>(false);
  const [showQrCode, setShowQrCode] = useState<boolean>(false);

  // Favorite / My Collection State (persisted to local state 'my-collection')
  const [myCollection, setMyCollection] = useState<SavedOutfit[]>(() => {
    try {
      const saved = localStorage.getItem('my-collection');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error reading my-collection from localStorage', e);
    }
    return [];
  });
  const [showCollectionModal, setShowCollectionModal] = useState<boolean>(false);
  const [favoriteFeedback, setFavoriteFeedback] = useState<string | null>(null);

  // Sync myCollection with localStorage 'my-collection'
  useEffect(() => {
    try {
      localStorage.setItem('my-collection', JSON.stringify(myCollection));
    } catch (e) {
      console.error('Error writing my-collection to localStorage', e);
    }
  }, [myCollection]);

  // Check if current costume configuration is already in my-collection
  const isCurrentFavorited = myCollection.some(item => 
    item.config.costumeId === selectedCostumeId &&
    item.config.colorHex.toLowerCase() === currentColorHex.toLowerCase() &&
    item.config.modelGender === modelGender &&
    item.config.accessories.slice().sort().join(',') === selectedAccessories.slice().sort().join(',') &&
    item.config.backgroundScene === backgroundScene
  );

  // Favorite toggle handler
  const handleToggleFavorite = () => {
    const existingIndex = myCollection.findIndex(item => 
      item.config.costumeId === selectedCostumeId &&
      item.config.colorHex.toLowerCase() === currentColorHex.toLowerCase() &&
      item.config.modelGender === modelGender &&
      item.config.accessories.slice().sort().join(',') === selectedAccessories.slice().sort().join(',') &&
      item.config.backgroundScene === backgroundScene
    );

    if (existingIndex >= 0) {
      const updated = myCollection.filter((_, idx) => idx !== existingIndex);
      setMyCollection(updated);
      setFavoriteFeedback('Đã gỡ khỏi Bộ sưu tập cá nhân (my-collection)');
      setTimeout(() => setFavoriteFeedback(null), 2500);
    } else {
      const newFav: SavedOutfit = {
        id: `fav-${Date.now()}`,
        title: `${currentCostume.name} (${currentColorName})`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
        config: {
          costumeId: selectedCostumeId,
          colorHex: currentColorHex,
          colorName: currentColorName,
          accessories: [...selectedAccessories],
          backgroundScene,
          modelGender,
          userAvatar
        }
      };
      setMyCollection([newFav, ...myCollection]);
      setFavoriteFeedback('Đã lưu cấu hình vào Bộ sưu tập cá nhân (my-collection)');
      setTimeout(() => setFavoriteFeedback(null), 2500);
    }
  };

  // Quick access: load saved configuration into Studio
  const handleApplyFavorite = (item: SavedOutfit) => {
    setSelectedCostumeId(item.config.costumeId);
    setCurrentColorHex(item.config.colorHex);
    setCurrentColorName(item.config.colorName);
    setSelectedAccessories(item.config.accessories);
    setModelGender(item.config.modelGender);
    setBackgroundScene(item.config.backgroundScene);
    if (item.config.userAvatar) {
      setUserAvatar(item.config.userAvatar);
    }
    setFavoriteFeedback(`Đã áp dụng: ${item.title}`);
    setTimeout(() => setFavoriteFeedback(null), 2000);
  };

  // Remove single item from my-collection
  const handleRemoveFavorite = (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setMyCollection(prev => prev.filter(item => item.id !== id));
  };

  // Clear all in collection
  const handleClearCollection = () => {
    if (window.confirm("Bạn có chắc muốn xóa tất cả cấu hình trong bộ sưu tập?")) {
      setMyCollection([]);
      setFavoriteFeedback('Đã làm trống Bộ sưu tập');
      setTimeout(() => setFavoriteFeedback(null), 2000);
    }
  };

  // Handle costume change
  const handleSelectCostume = (costume: Costume) => {
    setSelectedCostumeId(costume.id);
    setCurrentColorHex(costume.defaultColor);
    const colorMatch = TRADITIONAL_COLORS.find(c => c.hex.toLowerCase() === costume.defaultColor.toLowerCase());
    setCurrentColorName(colorMatch ? colorMatch.name : "Màu truyền thống");
    
    // Set smart default accessories based on costume
    if (costume.id === 'nhat-binh' || costume.id === 'ao-nhat-binh' || costume.id === 'nhat-binh-01') {
      setSelectedAccessories(['khan-vanh-day', 'quat-xep-lua', 'tram-cai-vang']);
      setModelGender('nu');
    } else if (costume.id === 'ao-tac' || costume.id === 'ao-tac-02') {
      setSelectedAccessories(['khan-dong', 'quat-xep-lua']);
    } else if (costume.id === 'ao-tu-than' || costume.id === 'tu-than-04') {
      setSelectedAccessories(['non-quai-thao', 'khan-mo-qua', 'that-lung-lua']);
      setModelGender('nu');
    } else if (costume.id === 'ao-vien-linh' || costume.id === 'vien-linh-08') {
      setSelectedAccessories(['khan-dong']);
      setModelGender('nam');
    } else if (costume.id === 'ao-dai-cach-tan' || costume.id === 'ao-dai-cach-tan-07') {
      setSelectedAccessories(['man-ngu-sac']);
      setModelGender('nu');
    } else {
      setSelectedAccessories(['khan-dong']);
    }
  };

  // Toggle Accessory
  const toggleAccessory = (accId: string) => {
    setSelectedAccessories(prev => 
      prev.includes(accId) ? prev.filter(id => id !== accId) : [...prev, accId]
    );
  };

  // Avatar Upload Handler
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate Color Harmony Algorithm
  const calculateHarmonyScore = (): HarmonyScoreResult => {
    // Convert hex to RGB luminance
    const hex = currentColorHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 150;
    const g = parseInt(hex.substring(2, 4), 16) || 50;
    const b = parseInt(hex.substring(4, 6), 16) || 50;
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    let score = 88;
    let title = "Hài Hòa Cổ Điển";
    let verdict = "Sắc thái trang nhã, đúng tinh thần phục sức Á Đông.";
    let wuxingBalance = "Tương Sinh Hanh Thông";

    if (currentColorHex === '#A4161A' || currentColorHex === '#8A1822') {
      score = 96;
      title = "Chu Sa Cát Tường (Điểm Tuyệt Đối)";
      verdict = "Sắc đỏ son chu sa là gam màu tôn quý bậc nhất thời phong kiến, kết hợp chuẩn mực cùng quần lụa trắng.";
      wuxingBalance = "Hỏa sinh Thổ vượng khí";
    } else if (currentColorHex === '#1F2A44' || currentColorHex === '#2A5C8A') {
      score = 94;
      title = "Thanh Điềm Khí Phách";
      verdict = "Sắc chàm thẫm tạo phong thái đĩnh đạc của bậc danh sĩ, độ tương phản thị giác đạt chuẩn mỹ thuật.";
      wuxingBalance = "Thủy dưỡng Mộc thanh nhã";
    } else if (currentColorHex === '#D4A347' || currentColorHex === '#C59B27') {
      score = 95;
      title = "Hoàng Kim Vương Giả";
      verdict = "Sắc vàng nghệ cung đình rực rỡ nhưng trầm ấm, thể hiện trung tâm vương triều và đất mẹ màu mỡ.";
      wuxingBalance = "Thổ định thiên hạ";
    } else if (lum > 210) {
      score = 92;
      title = "Bạch Lụa Thuần Khiết";
      verdict = "Gam màu sáng tao nhã, thanh thoát như tinh thần thiền tông Lý - Trần.";
      wuxingBalance = "Kim tính cương trực";
    }

    const contrastRatio = (lum / 25.5).toFixed(1) + ":1";
    return { score, title, verdict, wuxingBalance, contrastRatio };
  };

  // Calculate Cultural Warnings
  const checkCulturalRules = (): CulturalWarning[] => {
    const warnings: CulturalWarning[] = [];
    const isTuThan = selectedCostumeId === 'ao-tu-than' || selectedCostumeId === 'tu-than-04';
    const isVienLinh = selectedCostumeId === 'ao-vien-linh' || selectedCostumeId === 'vien-linh-08';
    const isNhatBinh = selectedCostumeId === 'nhat-binh' || selectedCostumeId === 'ao-nhat-binh' || selectedCostumeId === 'nhat-binh-01';

    // Rule 1: Royal headdress with folk attire
    if (isTuThan && selectedAccessories.includes('khan-vanh-day')) {
      warnings.push({
        type: 'danger',
        title: 'Lệch lạc giai tầng văn hóa',
        message: 'Áo Tứ Thân là trang phục lao động và lễ hội dân gian Bắc Bộ. Khăn vành dây là nghi lễ cung đình dành cho bậc Hậu phi triều Nguyễn. Phối hai món này với nhau là lỗi sai nghiêm trọng về giai tầng.',
        reference: 'Khâm Định Đại Nam Hội Điển Sự Lệ & Ngàn Năm Áo Mũ'
      });
    }

    // Rule 2: Non quai thao on court robe
    if ((isVienLinh || isNhatBinh) && selectedAccessories.includes('non-quai-thao')) {
      warnings.push({
        type: 'warning',
        title: 'Bất tương thích ngữ cảnh lễ nghi',
        message: 'Nón quai thao (ba tầm) là nét duyên dân dã Kinh Bắc, không dùng trong triều phục đại triều Viên Lĩnh hoặc áo Nhật Bình cung đình.',
        reference: 'Trang phục triều đình Việt Nam'
      });
    }

    // Rule 3: Khan mo qua with royal robe
    if (isNhatBinh && selectedAccessories.includes('khan-mo-qua')) {
      warnings.push({
        type: 'warning',
        title: 'Sai lệch tính chất lễ chế',
        message: 'Áo Nhật Bình nên đi cùng Khăn vành dây hoặc mấn bọc nhung, tránh dùng khăn vuông mỏ quạ dân tộc thôn dã.',
        reference: 'Tập quán phục sức Cố đô Huế'
      });
    }

    // Rule 4: Non la with Vien Linh
    if (isVienLinh && selectedAccessories.includes('non-la')) {
      warnings.push({
        type: 'danger',
        title: 'Vi phạm quy chuẩn quan phục',
        message: 'Áo Viên Lĩnh của quan lại văn võ khi hành lễ bắt buộc phải đội Mũ Ô Sa (mũ cánh chuồn), tuyệt đối không đội nón lá.',
        reference: 'Lịch Triều Hiến Chương Loại Chí'
      });
    }

    return warnings;
  };

  const harmonyResult = calculateHarmonyScore();
  const culturalWarnings = checkCulturalRules();

  // Save current look for comparison
  const handleSaveForComparison = () => {
    if (savedOutfits.length >= 3) {
      alert("Đã lưu tối đa 3 phương án để so sánh. Bạn hãy xóa bớt 1 phương án trước khi thêm mới.");
      return;
    }
    const newSaved: SavedOutfit = {
      id: Date.now().toString(),
      title: `${currentCostume.name} - ${currentColorName}`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      config: {
        costumeId: selectedCostumeId,
        colorHex: currentColorHex,
        colorName: currentColorName,
        accessories: [...selectedAccessories],
        backgroundScene,
        modelGender,
        userAvatar
      }
    };
    setSavedOutfits([...savedOutfits, newSaved]);
  };

  // Call Server for AI Stylist Review
  const handleGenerateAiReview = async () => {
    setAiGenerating(true);
    setAiReview(null);
    try {
      const activeAccessoriesNames = selectedAccessories.map(id => {
        const item = ACCESSORIES_DATA.find(a => a.id === id);
        return item ? item.name : id;
      });

      const res = await fetch('/api/stylist/describe-look', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          costumeName: currentCostume.name,
          colorName: currentColorName,
          colorHex: currentColorHex,
          accessories: activeAccessoriesNames,
          modelName: modelGender === 'nu' ? 'Nữ giới' : 'Nam giới'
        })
      });
      const data = await res.json();
      if (data.review) {
        setAiReview(normalizeVN(data.review));
      } else {
        setAiReview(normalizeVN("Bản phối của bạn rất hài hòa về bố cục và tôn vinh được đường nét cổ truyền Việt Nam."));
      }
    } catch {
      setAiReview(normalizeVN("Bản phối trang phục mang đậm cốt cách thanh lịch, tôn vinh sắc vóc người mặc và lưu giữ nét văn hiến Đại Việt ngàn năm."));
    } finally {
      setAiGenerating(false);
    }
  };

  // Download Lookbook Poster Card as PNG via Canvas
  // Generate unique URL for the current costume configuration
  const getShareableUrl = () => {
    try {
      const url = new URL(window.location.origin + window.location.pathname);
      url.searchParams.set('tab', 'studio');
      url.searchParams.set('costume', selectedCostumeId);
      url.searchParams.set('color', currentColorHex);
      url.searchParams.set('colorName', currentColorName);
      if (selectedAccessories.length > 0) {
        url.searchParams.set('acc', selectedAccessories.join(','));
      }
      url.searchParams.set('scene', backgroundScene);
      url.searchParams.set('gender', modelGender);
      return url.toString();
    } catch {
      return window.location.href;
    }
  };

  // Sync browser URL in real time without refreshing
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get('tab') === 'studio' || url.searchParams.has('costume')) {
        url.searchParams.set('tab', 'studio');
        url.searchParams.set('costume', selectedCostumeId);
        url.searchParams.set('color', currentColorHex);
        url.searchParams.set('colorName', currentColorName);
        if (selectedAccessories.length > 0) {
          url.searchParams.set('acc', selectedAccessories.join(','));
        } else {
          url.searchParams.delete('acc');
        }
        url.searchParams.set('scene', backgroundScene);
        url.searchParams.set('gender', modelGender);
        window.history.replaceState({}, '', url.toString());
      }
    } catch {
      // Ignore in non-browser context
    }
  }, [selectedCostumeId, currentColorHex, currentColorName, selectedAccessories, backgroundScene, modelGender]);

  // High-fidelity artistic canvas postcard generator with costume image, color swatch and seal
  const renderOutfitCardCanvas = async (): Promise<{ canvas: HTMLCanvasElement; dataUrl: string; blob: Blob | null }> => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Background dó paper
    ctx.fillStyle = '#FAF6ED';
    ctx.fillRect(0, 0, 800, 1000);

    // Double heritage border
    ctx.strokeStyle = '#D8CEBE';
    ctx.lineWidth = 14;
    ctx.strokeRect(20, 20, 760, 960);

    ctx.strokeStyle = '#B8862B';
    ctx.lineWidth = 2;
    ctx.strokeRect(34, 34, 732, 932);

    // Corner decorative marks
    const drawCorner = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.strokeStyle = '#A4161A';
      ctx.lineWidth = 2;
      ctx.strokeRect(-10, -10, 20, 20);
      ctx.fillStyle = '#B8862B';
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();
    };
    drawCorner(44, 44);
    drawCorner(756, 44);
    drawCorner(44, 956);
    drawCorner(756, 956);

    // Header Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#A4161A';
    ctx.font = 'bold 30px "Noto Serif", "Playfair Display", "Times New Roman", serif';
    ctx.fillText('VẬN KỲ · NGHỆ THUẬT VIỆT PHỤC', 400, 82);

    ctx.fillStyle = '#666';
    ctx.font = 'italic 15px "Noto Serif", serif';
    ctx.fillText('Thẻ Phối Đồ Cá Nhân Hóa (Custom Heritage Outfit)', 400, 112);

    // Horizontal divider
    ctx.strokeStyle = '#D8CEBE';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(80, 130);
    ctx.lineTo(720, 130);
    ctx.stroke();

    // Try drawing costume image if available
    let hasImage = false;
    if (currentCostume.image) {
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => reject(new Error('timeout')), 1500);
          img.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject();
          };
          img.src = currentCostume.image;
        });

        // Frame for image
        ctx.save();
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(75, 150, 310, 410);
        ctx.strokeStyle = '#B8862B';
        ctx.lineWidth = 1;
        ctx.strokeRect(75, 150, 310, 410);

        ctx.beginPath();
        ctx.rect(80, 155, 300, 400);
        ctx.clip();
        ctx.drawImage(img, 80, 155, 300, 400);
        ctx.restore();
        hasImage = true;
      } catch {
        hasImage = false;
      }
    }

    const infoLeft = hasImage ? 415 : 100;
    const infoWidth = hasImage ? 305 : 600;

    // Costume Name
    ctx.textAlign = 'left';
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 24px "Noto Serif", serif';
    ctx.fillText(currentCostume.name, infoLeft, 185);

    ctx.fillStyle = '#A4161A';
    ctx.font = 'bold 14px "Be Vietnam Pro", sans-serif';
    ctx.fillText(currentCostume.period, infoLeft, 215);

    // Model gender & scene
    ctx.fillStyle = '#555';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    const sceneName = backgroundScene === 'hue' ? 'Cố đô Huế' : backgroundScene === 'thanglong' ? 'Hoàng thành Thăng Long' : backgroundScene === 'hoian' ? 'Phố cổ Hội An' : backgroundScene === 'nharuong' ? 'Nhà rường cổ' : 'Phông Giấy Dó';
    ctx.fillText(`Quy chế: ${modelGender === 'nu' ? 'Nữ phục' : 'Nam phục'} · Bối cảnh: ${sceneName}`, infoLeft, 245);

    // Color Swatch Box
    ctx.fillStyle = currentColorHex;
    ctx.fillRect(infoLeft, 270, infoWidth, 50);
    ctx.strokeStyle = '#1A1A1A';
    ctx.lineWidth = 1;
    ctx.strokeRect(infoLeft, 270, infoWidth, 50);

    ctx.fillStyle = '#FAF6ED';
    ctx.font = 'bold 16px "Noto Serif", serif';
    ctx.fillText(`${currentColorName} (${currentColorHex})`, infoLeft + 16, 302);

    // Accessories
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 16px "Noto Serif", serif';
    ctx.fillText(`Phụ kiện đi kèm (${selectedAccessories.length} món):`, infoLeft, 355);

    ctx.fillStyle = '#555';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    let accY = 385;
    if (selectedAccessories.length === 0) {
      ctx.fillText('• Không dùng phụ kiện thêm', infoLeft + 8, accY);
    } else {
      selectedAccessories.slice(0, 5).forEach((accId) => {
        const acc = ACCESSORIES_DATA.find(a => a.id === accId);
        if (acc) {
          ctx.fillText(`• ${acc.name}`, infoLeft + 8, accY);
          accY += 24;
        }
      });
    }

    // Harmony & Cultural Assessment Box
    const boxY = hasImage ? 590 : 530;
    ctx.fillStyle = '#FAF6ED';
    ctx.fillRect(80, boxY, 640, 160);
    ctx.strokeStyle = '#D8CEBE';
    ctx.lineWidth = 1;
    ctx.strokeRect(80, boxY, 640, 160);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#1A1A1A';
    ctx.font = 'bold 16px "Noto Serif", serif';
    ctx.fillText('Đánh Giá Thẩm Mỹ & Độ Chuẩn Điển Chế:', 105, boxY + 36);

    ctx.fillStyle = '#A4161A';
    ctx.font = 'bold 22px "Noto Serif", serif';
    ctx.fillText(`${harmonyResult.score}/100 - ${harmonyResult.title}`, 105, boxY + 70);

    ctx.fillStyle = '#555';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    ctx.fillText(`Ngũ hành: ${harmonyResult.wuxingBalance} | Phối sắc: ${harmonyResult.contrastRatio}`, 105, boxY + 98);

    if (culturalWarnings.length === 0) {
      ctx.fillStyle = '#2D6A4F';
      ctx.font = 'bold 14px "Be Vietnam Pro", sans-serif';
      ctx.fillText('✓ ĐẠT CHUẨN ĐIỂN CHẾ: Bản phối chuẩn chỉ theo văn hiến truyền thống', 105, boxY + 128);
    } else {
      ctx.fillStyle = '#B8862B';
      ctx.font = 'bold 13px "Be Vietnam Pro", sans-serif';
      ctx.fillText(`⚠ Lưu ý văn hóa: ${culturalWarnings[0].title}`, 105, boxY + 128);
    }

    // Seal and branding footer
    ctx.textAlign = 'center';
    ctx.fillStyle = '#A4161A';
    ctx.font = 'bold 20px "Noto Serif", serif';
    ctx.fillText('ẤN TRIỆN VẬN KỲ', 400, 890);

    ctx.fillStyle = '#777';
    ctx.font = '13px "Be Vietnam Pro", sans-serif';
    ctx.fillText('Nền tảng phối Việt phục tương tác · vanky.heritage.vn', 400, 920);

    const dataUrl = canvas.toDataURL('image/png');
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    return { canvas, dataUrl, blob };
  };

  // Download Lookbook Poster
  const handleDownloadPoster = async () => {
    try {
      const { dataUrl } = await renderOutfitCardCanvas();
      const link = document.createElement('a');
      link.download = `vanky-lookbook-${currentCostume.id}.png`;
      link.href = dataUrl;
      link.click();
      setFavoriteFeedback('Đã tải ảnh thẻ phối lookbook (PNG)!');
      setTimeout(() => setFavoriteFeedback(null), 2500);
    } catch (e) {
      console.error('Download error:', e);
    }
  };

  // Share Outfit Handler: triggers Web Share API with image preview or opens modal
  const handleShareOutfit = async (forceModal = false) => {
    const shareUrl = getShareableUrl();
    const shareTitle = `Phối Việt phục: ${currentCostume.name} (${currentColorName}) - VẬN KỲ`;
    const shareText = `Xem bản phối ${currentCostume.name} tông ${currentColorName} của tôi trên VẬN KỲ - Nền tảng phối Việt phục truyền thống!`;

    setIsGeneratingSharePreview(true);

    try {
      const { dataUrl, blob } = await renderOutfitCardCanvas();
      setSharePreviewUrl(dataUrl);

      // Check if native Web Share should be attempted
      if (!forceModal && typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
        const filesArray = blob
          ? [new File([blob], `vietphuc-${currentCostume.id}.png`, { type: 'image/png' })]
          : [];

        if (filesArray.length > 0 && typeof navigator.canShare === 'function' && navigator.canShare({ files: filesArray })) {
          try {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
              files: filesArray,
            });
            setFavoriteFeedback('Đã mở hộp thoại chia sẻ!');
            setTimeout(() => setFavoriteFeedback(null), 2500);
            setIsGeneratingSharePreview(false);
            return;
          } catch (err: any) {
            if (err.name === 'AbortError') {
              setIsGeneratingSharePreview(false);
              return;
            }
            console.warn('Native file share failed, trying URL or modal fallback:', err);
          }
        }

        // Try standard share with URL if file share unsupported
        if (typeof navigator.canShare === 'function' && navigator.canShare({ url: shareUrl })) {
          try {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl,
            });
            setFavoriteFeedback('Đã chia sẻ thành công!');
            setTimeout(() => setFavoriteFeedback(null), 2500);
            setIsGeneratingSharePreview(false);
            return;
          } catch (err: any) {
            if (err.name === 'AbortError') {
              setIsGeneratingSharePreview(false);
              return;
            }
            console.warn('Native URL share failed:', err);
          }
        }
      }
    } catch (e) {
      console.error('Error generating share preview:', e);
    } finally {
      setIsGeneratingSharePreview(false);
    }

    // Fallback or explicit modal view
    setShowShareModal(true);
  };

  // Copy shareable link to clipboard
  const handleCopyShareLink = () => {
    const url = getShareableUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedShareLink(true);
        setFavoriteFeedback('Đã sao chép liên kết độc bản vào clipboard!');
        setTimeout(() => setCopiedShareLink(false), 2500);
        setTimeout(() => setFavoriteFeedback(null), 2500);
      }).catch(() => {
        setFavoriteFeedback('Vui lòng chọn và sao chép thủ công liên kết.');
      });
    }
  };

  const handleShareLook = () => {
    handleShareOutfit(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D8CEBE] mb-6 gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-[#B8862B] font-medium">
            Việt Phục Studio · Phòng Thử Đồ Tương Tác
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1A1A1A] leading-snug">
            Tự Do Sáng Tạo Phối Đồ
          </h1>
          {isCostumeCanonVerified(currentCostume.id) && (
            <div className="mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-[#D4A347] text-[#1A1A1A] rounded-xs shadow-xs border border-[#B8862B]">
                <Award size={12} />
                <span>Tiệm cung cấp đã kiểm định điển chế</span>
              </span>
            </div>
          )}
        </div>

        {/* Top Actions: Compare, Favorite, My Collection & Export */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Favorite Toggle Button */}
          <button
            onClick={handleToggleFavorite}
            title={isCurrentFavorited ? "Bỏ yêu thích khỏi bộ sưu tập (my-collection)" : "Lưu cấu hình phối đồ vào bộ sưu tập cá nhân (my-collection)"}
            className={`px-3.5 py-2 border text-xs font-semibold uppercase tracking-wider rounded transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
              isCurrentFavorited
                ? 'bg-[#FDF2F2] border-[#A4161A] text-[#A4161A]'
                : 'bg-[#FAF6ED] hover:bg-[#E8DEC8] border-[#D8CEBE] text-[#1A1A1A]'
            }`}
          >
            <Heart
              size={15}
              className={`transition-transform duration-200 ${
                isCurrentFavorited ? 'fill-[#A4161A] text-[#A4161A] scale-110' : 'text-[#A4161A]'
              }`}
            />
            <span>{isCurrentFavorited ? t.favorited : t.favorite}</span>
          </button>

          {/* My Collection Quick Access Button */}
          {myCollection.length > 0 && (
            <button
              onClick={() => setShowCollectionModal(true)}
              className="px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-semibold uppercase tracking-wider rounded text-[#1A1A1A] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Bookmark size={15} className="text-[#B8862B]" />
              <span>{t.myCollection} ({myCollection.length})</span>
            </button>
          )}

          <button
            onClick={handleSaveForComparison}
            className="px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-semibold uppercase tracking-wider rounded text-[#1A1A1A] transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Columns size={15} />
            <span>{language === 'en' ? 'Save for compare' : 'Lưu so sánh'} ({savedOutfits.length}/3)</span>
          </button>

          {savedOutfits.length > 0 && (
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-2 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={15} />
              <span>{language === 'en' ? 'Compare' : 'Xem so sánh'}</span>
            </button>
          )}

          {/* ĐẶT THUÊ BỘ NÀY BUTTON (REQUIREMENT 2) */}
          <button
            onClick={() => {
              if (onOpenRentalModal) {
                onOpenRentalModal(currentCostume, currentColorName, currentColorHex, selectedAccessories);
              }
            }}
            title="Đặt thuê bộ trang phục này với cấu hình màu & phụ kiện đã chọn"
            className="px-4 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Package size={15} className="text-[#D4A347]" />
            <span>{t.rentThisLook}</span>
            {COSTUME_PRICING[currentCostume.id] && (
              <span className="hidden xl:inline text-[11px] font-normal text-[#FAF6ED]/80">
                ({formatPrice(COSTUME_PRICING[currentCostume.id].pricePerDay, currency)}/{language === 'en' ? 'day' : 'ngày'})
              </span>
            )}
          </button>

          <button
            onClick={() => onNavigateToGroups?.()}
            title="Tạo đơn nhóm cho lớp, kỷ yếu, câu lạc bộ"
            className="px-3.5 py-2 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Users size={15} className="text-[#D4A347]" />
            <span>{language === 'en' ? 'Group Order' : 'Tạo đơn nhóm'}</span>
          </button>

          <button
            onClick={() => handleShareOutfit(false)}
            title="Chia sẻ cấu hình phối đồ (Tạo link / Web Share)"
            className="px-3.5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#B8862B] text-xs font-semibold uppercase tracking-wider rounded text-[#A4161A] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Share2 size={15} className="text-[#A4161A]" />
            <span>{t.shareOutfit}</span>
          </button>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-4 py-2 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Download size={15} className="text-[#D4A347]" />
            <span>{t.exportPoster}</span>
          </button>
        </div>
      </div>

      {/* REQUIREMENT 3: DESTINATION QUICK STRIP IN STUDIO */}
      <div className="bg-[#FAF6ED] border border-[#D8CEBE] px-4 py-2.5 rounded mb-6 flex flex-wrap items-center justify-between gap-3 text-xs shadow-2xs">
        <div className="flex items-center gap-2">
          <Compass size={15} className="text-[#A4161A]" />
          <span className="font-bold text-[#1A1A1A]">
            {language === 'en' ? 'Filter by Destination & Scene:' : 'Khám phá theo Điểm Đến Văn Hóa:'}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {DESTINATIONS_DATA.map((dest) => (
            <button
              key={dest.id}
              onClick={() => {
                if (dest.id === 'hue') setBackgroundScene('hue');
                else if (dest.id === 'ha-noi' || dest.id === 'van-mieu') setBackgroundScene('thanglong');
                else if (dest.id === 'hoi-an') setBackgroundScene('hoian');
                else if (dest.id === 'hcm') setBackgroundScene('studio');

                if (!dest.suggestedCostumeIds.includes(selectedCostumeId)) {
                  setSelectedCostumeId(dest.suggestedCostumeIds[0]);
                }
              }}
              className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer border ${
                (backgroundScene === 'hue' && dest.id === 'hue') ||
                (backgroundScene === 'thanglong' && (dest.id === 'ha-noi' || dest.id === 'van-mieu')) ||
                (backgroundScene === 'hoian' && dest.id === 'hoi-an')
                  ? 'bg-[#A4161A] text-white border-[#A4161A] shadow-2xs'
                  : 'bg-[#F6EFE3] hover:bg-[#EAE0D0] text-[#1A1A1A] border-[#D8CEBE]'
              }`}
            >
              {language === 'en' ? dest.nameEn.split('(')[0].trim() : dest.nameVi.split('(')[0].trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: Large Preview Frame (Doll SVG + Controls) */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Main Paper Doll Display */}
          <div className="relative">
            <StudioDoll
              costumeId={selectedCostumeId}
              colorHex={currentColorHex}
              accessories={selectedAccessories}
              modelGender={modelGender}
              backgroundScene={backgroundScene}
              userAvatar={userAvatar}
            />

            {/* Floating Quick Controls on Image */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
              {/* Gender selector */}
              <div className="bg-[#FAF6ED]/90 backdrop-blur-xs border border-[#D8CEBE] p-1 rounded flex items-center gap-1 text-xs">
                <button
                  onClick={() => setModelGender('nu')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    modelGender === 'nu' ? 'bg-[#A4161A] text-white font-medium' : 'text-[#666] hover:text-[#1A1A1A]'
                  }`}
                >
                  Nữ phục
                </button>
                <button
                  onClick={() => setModelGender('nam')}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                    modelGender === 'nam' ? 'bg-[#1F2A44] text-white font-medium' : 'text-[#666] hover:text-[#1A1A1A]'
                  }`}
                >
                  Nam phục
                </button>
              </div>

              {/* Background scene selector & Floating Favorite Toggle Button */}
              <div className="flex items-center gap-1.5">
                <div className="bg-[#FAF6ED]/90 backdrop-blur-xs border border-[#D8CEBE] px-2 py-1 rounded text-xs">
                  <select
                    value={backgroundScene}
                    onChange={(e) => setBackgroundScene(e.target.value)}
                    className="bg-transparent text-[#1A1A1A] font-medium focus:outline-none cursor-pointer"
                  >
                    <option value="hue">Cố đô Huế</option>
                    <option value="thanglong">Hoàng thành Thăng Long</option>
                    <option value="hoian">Phố cổ Hội An</option>
                    <option value="nharuong">Nhà rường cổ</option>
                    <option value="studio">Phông Giấy Dó tối giản</option>
                  </select>
                </div>

                <button
                  onClick={handleToggleFavorite}
                  title={isCurrentFavorited ? "Bỏ yêu thích khỏi bộ sưu tập (my-collection)" : "Yêu thích cấu hình phối đồ này"}
                  className={`p-1.5 rounded border backdrop-blur-xs transition-all cursor-pointer flex items-center justify-center ${
                    isCurrentFavorited
                      ? 'bg-white border-[#A4161A] text-[#A4161A] shadow-xs'
                      : 'bg-[#FAF6ED]/90 hover:bg-white border-[#D8CEBE] text-[#666] hover:text-[#A4161A]'
                  }`}
                >
                  <Heart
                    size={16}
                    className={`transition-transform ${
                      isCurrentFavorited ? 'fill-[#A4161A] text-[#A4161A] scale-110' : ''
                    }`}
                  />
                </button>

                <button
                  onClick={() => handleShareOutfit(false)}
                  title="Chia sẻ bộ phối (Tạo liên kết / Web Share)"
                  className="p-1.5 rounded border backdrop-blur-xs bg-[#FAF6ED]/90 hover:bg-white border-[#D8CEBE] text-[#666] hover:text-[#A4161A] transition-all cursor-pointer flex items-center justify-center"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>

            {/* Custom Avatar Upload Affordance & Quick Rental Button */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-1.5">
                <label className="bg-[#FAF6ED]/90 hover:bg-[#FAF6ED] backdrop-blur-xs border border-[#D8CEBE] px-3 py-1.5 rounded cursor-pointer text-[#1A1A1A] font-medium flex items-center gap-1.5 shadow-xs transition-colors">
                  <Upload size={14} className="text-[#A4161A]" />
                  <span>{userAvatar ? 'Đổi mặt' : 'Thử mặt'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>

                {userAvatar && (
                  <button
                    onClick={() => setUserAvatar(undefined)}
                    className="bg-red-50 text-[#A4161A] px-2 py-1 rounded text-[11px] border border-red-200"
                  >
                    Gỡ
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  if (onOpenRentalModal) {
                    onOpenRentalModal(currentCostume, currentColorName, currentColorHex, selectedAccessories);
                  }
                }}
                className="bg-[#A4161A]/95 hover:bg-[#850D11] text-white px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-colors backdrop-blur-xs"
              >
                <Package size={14} className="text-[#D4A347]" />
                <span>Thuê phối này</span>
              </button>
            </div>
          </div>

          {/* Quick Access to Favorited Outfits (my-collection) */}
          {myCollection.length > 0 && (
            <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-3 rounded shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1A1A1A]">
                  <Heart size={13} className="fill-[#A4161A] text-[#A4161A]" />
                  <span>Bộ sưu tập yêu thích ({myCollection.length})</span>
                  <span className="text-[10px] text-[#777] font-normal hidden sm:inline">· Chọn để thử nhanh</span>
                </div>
                <button
                  onClick={() => setShowCollectionModal(true)}
                  className="text-[11px] text-[#A4161A] hover:underline font-medium cursor-pointer"
                >
                  Mở rộng ({myCollection.length})
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                {myCollection.map((item) => {
                  const itemCostume = costumes.find(c => c.id === item.config.costumeId) || currentCostume;
                  const isSelected = item.config.costumeId === selectedCostumeId &&
                    item.config.colorHex.toLowerCase() === currentColorHex.toLowerCase() &&
                    item.config.modelGender === modelGender &&
                    item.config.accessories.slice().sort().join(',') === selectedAccessories.slice().sort().join(',') &&
                    item.config.backgroundScene === backgroundScene;

                  return (
                    <div
                      key={item.id}
                      onClick={() => handleApplyFavorite(item)}
                      title={`Bấm để tải nhanh cấu hình: ${item.title}`}
                      className={`flex-shrink-0 px-2.5 py-1.5 rounded border text-xs cursor-pointer transition-all flex items-center gap-2 ${
                        isSelected
                          ? 'bg-[#A4161A] text-white border-[#A4161A] shadow-xs'
                          : 'bg-white hover:bg-[#F6EFE3] text-[#1A1A1A] border-[#D8CEBE]'
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: item.config.colorHex }}
                      />
                      <span className="font-medium whitespace-nowrap">{itemCostume.name}</span>
                      <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-[#777]'}`}>
                        {item.config.modelGender === 'nu' ? 'Nữ' : 'Nam'}
                      </span>
                      <button
                        onClick={(e) => handleRemoveFavorite(item.id, e)}
                        title="Xóa khỏi bộ sưu tập"
                        className={`p-0.5 rounded hover:bg-black/10 transition-colors ml-1 ${
                          isSelected ? 'text-white/80 hover:text-white' : 'text-[#999] hover:text-[#A4161A]'
                        }`}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Stylist Realtime Prompt & Review Trigger */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A4161A] uppercase tracking-wider">
                <Sparkles size={16} className="text-[#D4A347]" />
                <span>Đánh giá từ AI Stylist</span>
              </div>
              <button
                onClick={handleGenerateAiReview}
                disabled={aiGenerating}
                className="px-3 py-1 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-medium rounded transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                {aiGenerating ? <RefreshCw size={13} className="animate-spin" /> : <Sparkles size={13} />}
                <span>{aiGenerating ? 'Đang phân tích...' : 'Tạo nhận xét AI'}</span>
              </button>
            </div>

            {aiReview ? (
              <div className="text-xs text-[#3A3A3A] bg-[#F6EFE3] p-3 rounded border border-[#E8DEC8] leading-relaxed whitespace-pre-line animate-in fade-in">
                {aiReview}
              </div>
            ) : (
              <p className="text-xs text-[#666] italic leading-relaxed">
                Bấm "Tạo nhận xét AI" để chuyên gia Gemini phân tích tính thẩm mỹ, gợi ý địa điểm check-in và ý niệm văn hóa cho bản phối này.
              </p>
            )}
          </div>

          {/* Short Information Card for the Current Costume */}
          <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-xs space-y-2">
            <div className="font-serif font-bold text-sm text-[#1A1A1A] flex items-center justify-between flex-wrap gap-2">
              <span className="flex items-center gap-1.5 flex-wrap">
                <span>{currentCostume.name} ({currentCostume.romanized})</span>
                {isCostumeCanonVerified(currentCostume.id) && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#D4A347] text-[#1A1A1A] rounded-xs shadow-xs border border-[#B8862B] flex items-center gap-0.5">
                    <Award size={11} />
                    <span>Đã kiểm định</span>
                  </span>
                )}
              </span>
              <span className="text-[11px] text-[#A4161A] font-sans font-medium">{currentCostume.period}</span>
            </div>
            <p className="text-[#4A4A4A] leading-relaxed">
              {currentCostume.shortDesc}
            </p>
            <div className="pt-2 border-t border-[#E8DEC8] flex items-center justify-between text-[11px] text-[#666]">
              <span>Người mặc: {currentCostume.wearer.substring(0, 40)}...</span>
              <span className="text-[#B8862B] font-medium">{currentCostume.certaintyLevel}</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 Tabs (Costume, Colors, Accessories, Inspection) */}
        <div className="lg:col-span-7 bg-[#FAF6ED] border border-[#D8CEBE] rounded p-5 sm:p-6 shadow-xs">
          {/* Tab Navigation Header */}
          <div className="flex items-center gap-1 p-1 bg-[#F6EFE3] border border-[#D8CEBE] rounded mb-6 overflow-x-auto">
            <button
              onClick={() => setActiveTab('costume')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'costume' ? 'bg-[#A4161A] text-white shadow-xs' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              <Layers size={14} />
              <span>{language === 'en' ? 'a) Attire' : 'a) Chọn Trang Phục'}</span>
            </button>
            <button
              onClick={() => setActiveTab('color')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'color' ? 'bg-[#A4161A] text-white shadow-xs' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              <Palette size={14} />
              <span>{language === 'en' ? 'b) Colors' : 'b) Đổi Tone Màu'}</span>
            </button>
            <button
              onClick={() => setActiveTab('accessories')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'accessories' ? 'bg-[#A4161A] text-white shadow-xs' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              <Sparkles size={14} />
              <span>{language === 'en' ? `c) Accessories (${selectedAccessories.length})` : `c) Phụ Kiện (${selectedAccessories.length})`}</span>
            </button>
            <button
              onClick={() => setActiveTab('check')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded whitespace-nowrap transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                activeTab === 'check' ? 'bg-[#A4161A] text-white shadow-xs' : 'text-[#555] hover:text-[#1A1A1A]'
              }`}
            >
              <ShieldAlert size={14} />
              <span>{language === 'en' ? 'd) Protocol Check' : 'd) Kiểm Tra & Cảnh Báo'}</span>
            </button>
          </div>

          {/* TAB CONTENT: a) CHỌN TRANG PHỤC */}
          {activeTab === 'costume' && (
            <div className="space-y-4">
              <div className="text-xs text-[#666] mb-3">
                Chọn mẫu trang phục truyền thống làm nền tảng phối đồ:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {costumes.map((costume) => {
                  const isSelected = costume.id === selectedCostumeId;
                  return (
                    <button
                      key={costume.id}
                      onClick={() => handleSelectCostume(costume)}
                      className={`text-left p-2.5 rounded border transition-all flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'border-[#A4161A] bg-[#A4161A]/5 shadow-xs ring-1 ring-[#A4161A]'
                          : 'border-[#D8CEBE] bg-[#F6EFE3] hover:border-[#B8862B]'
                      }`}
                    >
                      <div className="aspect-square w-full rounded overflow-hidden mb-2 bg-stone-900">
                        <img
                          src={costume.coverImage || costume.image}
                          alt={costume.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-xs text-[#1A1A1A] line-clamp-1">
                          {costume.name}
                        </div>
                        <div className="text-[10px] text-[#A4161A] font-medium">
                          {costume.dynasty}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: b) ĐỔI TONE MÀU */}
          {activeTab === 'color' && (
            <div className="space-y-6">
              {/* Active Color Preview & Free Color Picker */}
              <div className="bg-[#F6EFE3] p-4 rounded border border-[#D8CEBE] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full border-2 border-white shadow-md shrink-0"
                    style={{ backgroundColor: currentColorHex }}
                  />
                  <div>
                    <div className="font-serif font-bold text-sm text-[#1A1A1A]">
                      {currentColorName}
                    </div>
                    <div className="text-xs text-[#666] font-mono">
                      Mã màu: {currentColorHex.toUpperCase()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs text-[#666] font-medium">Chọn tự do:</label>
                  <input
                    type="color"
                    value={currentColorHex}
                    onChange={(e) => {
                      setCurrentColorHex(e.target.value);
                      setCurrentColorName("Màu tùy biến");
                    }}
                    className="w-8 h-8 rounded border border-[#B8862B] cursor-pointer p-0"
                  />
                </div>
              </div>

              {/* Bảng Màu Truyền Thống Có Tên */}
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-3">
                  Bảng Màu Truyền Thống Việt Nam
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {TRADITIONAL_COLORS.map((col, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentColorHex(col.hex);
                        setCurrentColorName(col.name);
                      }}
                      className={`p-2 rounded border text-left flex flex-col justify-between cursor-pointer transition-all ${
                        currentColorHex.toLowerCase() === col.hex.toLowerCase()
                          ? 'border-[#A4161A] bg-[#A4161A]/10 shadow-xs'
                          : 'border-[#D8CEBE] bg-[#F6EFE3] hover:border-[#A4161A]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 shrink-0 shadow-2xs"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span className="text-[10px] text-[#A4161A] font-bold">Hành {col.element}</span>
                      </div>
                      <div className="font-serif text-xs font-bold text-[#1A1A1A] line-clamp-1">
                        {col.name}
                      </div>
                      <div className="text-[10px] text-[#666] line-clamp-1 mt-0.5">
                        {col.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset Tones */}
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-3">
                  Bộ Preset Tông Sắc Đề Xuất
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PRESET_TONES.map((preset) => (
                    <div
                      key={preset.id}
                      className="p-3 bg-[#F6EFE3] border border-[#D8CEBE] rounded flex flex-col justify-between"
                    >
                      <div>
                        <div className="font-serif font-bold text-xs text-[#1A1A1A]">
                          {preset.name}
                        </div>
                        <div className="text-[11px] text-[#666] mb-2">
                          {preset.desc}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {preset.colors.map((c, i) => (
                          <button
                            key={i}
                            onClick={() => {
                              setCurrentColorHex(c);
                              setCurrentColorName(`${preset.name} #${i + 1}`);
                            }}
                            className="w-7 h-7 rounded border border-white shadow-xs hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT: c) CHỌN PHỤ KIỆN */}
          {activeTab === 'accessories' && (
            <div className="space-y-4">
              <div className="text-xs text-[#666] mb-2">
                Bật/tắt phụ kiện chuẩn phong cách. Mỗi phụ kiện đều có chú thích nguồn gốc và ý nghĩa văn hóa:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ACCESSORIES_DATA.map((acc) => {
                  const isChecked = selectedAccessories.includes(acc.id);
                  const isWarning = acc.incompatibleWith?.includes(selectedCostumeId);

                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.id)}
                      className={`p-3 rounded border text-left flex items-start gap-3 cursor-pointer transition-all ${
                        isChecked
                          ? isWarning
                            ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                            : 'border-[#A4161A] bg-[#A4161A]/5 shadow-xs'
                          : 'border-[#D8CEBE] bg-[#F6EFE3] hover:border-[#B8862B]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}}
                        className="mt-1 rounded text-[#A4161A] focus:ring-0 cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-serif font-bold text-xs text-[#1A1A1A]">
                            {acc.name}
                          </span>
                          <span className="text-[10px] text-[#A4161A] font-medium">
                            {acc.period}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#555] mt-1 leading-snug">
                          {acc.origin}
                        </p>
                        <p className="text-[10px] text-[#777] italic mt-0.5">
                          Ý nghĩa: {acc.meaning}
                        </p>

                        {/* Inline Warning if incompatible */}
                        {isWarning && isChecked && (
                          <div className="mt-2 p-1.5 bg-amber-100/70 border border-amber-300 rounded text-[10px] text-amber-900 flex items-start gap-1">
                            <ShieldAlert size={12} className="shrink-0 mt-0.5 text-amber-700" />
                            <span>{acc.incompatibilityReason}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB CONTENT: d) KIỂM TRA & CẢNH BÁO */}
          {activeTab === 'check' && (
            <div className="space-y-6">
              {/* 1. Chấm điểm hài hòa màu sắc */}
              <div className="bg-[#F6EFE3] border border-[#D8CEBE] p-4 sm:p-5 rounded">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-[#A4161A] font-semibold">
                      Thuật Toán Mỹ Thuật
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#1A1A1A]">
                      Chấm Điểm Hài Hòa Màu Sắc
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="font-serif text-3xl font-bold text-[#A4161A]">
                      {harmonyResult.score}
                    </span>
                    <span className="text-xs text-[#666]">/100</span>
                  </div>
                </div>

                <div className="w-full bg-[#D8CEBE] h-2 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-[#A4161A] transition-all duration-500"
                    style={{ width: `${harmonyResult.score}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#4A4A4A] mb-3">
                  <div className="bg-[#FAF6ED] p-2 rounded border border-[#E8DEC8]">
                    <span className="text-[#888] block text-[10px]">Đánh giá:</span>
                    <strong className="text-[#1A1A1A]">{harmonyResult.title}</strong>
                  </div>
                  <div className="bg-[#FAF6ED] p-2 rounded border border-[#E8DEC8]">
                    <span className="text-[#888] block text-[10px]">Cân bằng Ngũ Hành:</span>
                    <strong className="text-[#1A1A1A]">{harmonyResult.wuxingBalance}</strong>
                  </div>
                  <div className="bg-[#FAF6ED] p-2 rounded border border-[#E8DEC8]">
                    <span className="text-[#888] block text-[10px]">Độ tương phản lụa:</span>
                    <strong className="text-[#1A1A1A]">{harmonyResult.contrastRatio}</strong>
                  </div>
                </div>

                <p className="text-xs text-[#3A3A3A] leading-relaxed">
                  {harmonyResult.verdict}
                </p>
              </div>

              {/* 2. Cảnh báo văn hóa */}
              <div>
                <h3 className="font-serif font-bold text-sm text-[#1A1A1A] mb-3 flex items-center gap-1.5">
                  <ShieldAlert size={16} className="text-[#B8862B]" />
                  <span>Kiểm Tra Quy Chuẩn & Cảnh Báo Văn Hóa</span>
                </h3>

                {culturalWarnings.length === 0 ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-900 flex items-start gap-2.5">
                    <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-medium">Bản phối đạt chuẩn quy chế văn hiến</strong>
                      <p className="mt-0.5 text-emerald-800">
                        Không phát hiện sự lệch lạc giữa giai tầng trang phục và phụ kiện. Bạn có thể tự tin diện bản phối này tại các sự kiện văn hóa, di tích lịch sử hoặc ngày lễ trọng đại.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {culturalWarnings.map((warn, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-r text-xs text-amber-950 space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-amber-900 text-sm">
                          <ShieldAlert size={16} className="text-amber-600" />
                          <span>{warn.title}</span>
                        </div>
                        <p className="leading-relaxed text-amber-900">
                          {warn.message}
                        </p>
                        <div className="text-[11px] text-amber-700 italic pt-1 border-t border-amber-200">
                          Nguồn tham chiếu: {warn.reference}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* COMPARE MODAL: Side-by-Side Comparison of up to 3 Outfits */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-5xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D8CEBE] mb-6">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                So Sánh Các Phương Án Phối Đồ ({savedOutfits.length}/3)
              </h2>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-xs text-[#A4161A] font-bold hover:underline cursor-pointer"
              >
                Đóng
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedOutfits.map((outfit) => {
                const costume = costumes.find(c => c.id === outfit.config.costumeId) || costumes[0];
                return (
                  <div
                    key={outfit.id}
                    className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-serif font-bold text-sm text-[#1A1A1A]">
                          {outfit.title}
                        </span>
                        <button
                          onClick={() => setSavedOutfits(savedOutfits.filter(o => o.id !== outfit.id))}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Xóa
                        </button>
                      </div>

                      {/* Mini Preview */}
                      <div className="h-60 rounded overflow-hidden border border-[#E8DEC8] mb-3">
                        <StudioDoll
                          costumeId={outfit.config.costumeId}
                          colorHex={outfit.config.colorHex}
                          accessories={outfit.config.accessories}
                          modelGender={outfit.config.modelGender}
                          backgroundScene={outfit.config.backgroundScene}
                        />
                      </div>

                      <div className="space-y-1 text-xs text-[#555]">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-black/10 inline-block"
                            style={{ backgroundColor: outfit.config.colorHex }}
                          />
                          <span>{outfit.config.colorName}</span>
                        </div>
                        <div>Số phụ kiện: {outfit.config.accessories.length} món</div>
                        <div>Niên đại: {costume.period}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCostumeId(outfit.config.costumeId);
                        setCurrentColorHex(outfit.config.colorHex);
                        setCurrentColorName(outfit.config.colorName);
                        setSelectedAccessories(outfit.config.accessories);
                        setModelGender(outfit.config.modelGender);
                        setBackgroundScene(outfit.config.backgroundScene);
                        setShowCompareModal(false);
                      }}
                      className="mt-4 w-full py-2 bg-[#A4161A] text-white text-xs font-semibold rounded uppercase tracking-wider"
                    >
                      Dùng phương án này
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MY COLLECTION (BỘ SƯU TẬP CÁ NHÂN) MODAL */}
      {showCollectionModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-6 text-left max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8CEBE] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FAF6ED] border border-[#D8CEBE] rounded-full">
                  <Heart size={20} className="fill-[#A4161A] text-[#A4161A]" />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#A4161A]">
                    Bộ Sưu Tập Của Tôi (My Collection)
                  </h2>
                  <p className="text-xs text-[#666]">
                    Lưu trữ các cấu hình phối đồ yêu thích vào trạng thái cục bộ để xem lại và thử nhanh bất cứ lúc nào.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCollectionModal(false)}
                className="p-1.5 text-[#666] hover:text-[#1A1A1A] rounded-md hover:bg-black/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-4">
              {myCollection.length === 0 ? (
                <div className="text-center py-12 bg-[#FAF6ED] rounded border border-[#D8CEBE]">
                  <Heart size={36} className="mx-auto text-[#D8CEBE] mb-2" />
                  <p className="text-sm font-medium text-[#1A1A1A]">Chưa có bộ phối nào trong bộ sưu tập</p>
                  <p className="text-xs text-[#777] mt-1 max-w-sm mx-auto">
                    Hãy bấm nút "Yêu thích" trên thanh công cụ hoặc góc ảnh để lưu lại các cấu hình phối đồ ưng ý vào đây!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myCollection.map((fav) => {
                    const favCostume = costumes.find(c => c.id === fav.config.costumeId) || currentCostume;
                    const isSelected = fav.config.costumeId === selectedCostumeId &&
                      fav.config.colorHex.toLowerCase() === currentColorHex.toLowerCase() &&
                      fav.config.modelGender === modelGender &&
                      fav.config.accessories.slice().sort().join(',') === selectedAccessories.slice().sort().join(',') &&
                      fav.config.backgroundScene === backgroundScene;

                    return (
                      <div
                        key={fav.id}
                        className={`bg-[#FAF6ED] border rounded p-4 flex flex-col justify-between transition-all relative ${
                          isSelected ? 'border-[#A4161A] ring-1 ring-[#A4161A] shadow-sm' : 'border-[#D8CEBE] hover:border-[#B8862B]'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-serif font-bold text-sm text-[#1A1A1A]">
                                {favCostume.name}
                              </h3>
                              <span className="text-[10px] text-[#A4161A] font-medium block">
                                {favCostume.period}
                              </span>
                            </div>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6EFE3] text-[#555] font-medium uppercase border border-[#E8DEC8]">
                              {fav.config.modelGender === 'nu' ? 'Nữ phục' : 'Nam phục'}
                            </span>
                          </div>

                          <div className="space-y-1.5 text-xs text-[#555] my-3">
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 inline-block shrink-0"
                                style={{ backgroundColor: fav.config.colorHex }}
                              />
                              <span className="font-medium text-[#1A1A1A]">{fav.config.colorName}</span>
                            </div>
                            <div className="text-[11px] text-[#666]">
                              Phụ kiện: {fav.config.accessories.length > 0 ? `${fav.config.accessories.length} món đi kèm` : 'Không có'}
                            </div>
                            <div className="text-[11px] text-[#666]">
                              Bối cảnh: {fav.config.backgroundScene === 'hue' ? 'Cố đô Huế' : fav.config.backgroundScene === 'thanglong' ? 'Thăng Long' : fav.config.backgroundScene === 'hoian' ? 'Hội An' : 'Nhà rường / Studio'}
                            </div>
                            <div className="text-[10px] text-[#999] pt-1">
                              Đã lưu: {fav.timestamp}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#E8DEC8] flex items-center gap-2 mt-2">
                          <button
                            onClick={() => {
                              handleApplyFavorite(fav);
                              setShowCollectionModal(false);
                            }}
                            className={`flex-1 py-1.5 text-xs font-semibold rounded uppercase tracking-wider transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#2D6A4F] text-white'
                                : 'bg-[#A4161A] hover:bg-[#850D11] text-white'
                            }`}
                          >
                            {isSelected ? 'Đang dùng' : 'Thử ngay'}
                          </button>
                          <button
                            onClick={(e) => handleRemoveFavorite(fav.id, e)}
                            title="Xóa khỏi bộ sưu tập"
                            className="p-1.5 text-[#888] hover:text-[#A4161A] hover:bg-red-50 rounded transition-colors cursor-pointer border border-[#D8CEBE]"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#D8CEBE] mt-4 flex items-center justify-between">
              {myCollection.length > 0 ? (
                <button
                  onClick={handleClearCollection}
                  className="text-xs text-red-600 hover:text-red-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Xóa tất cả</span>
                </button>
              ) : <div />}

              <button
                onClick={() => setShowCollectionModal(false)}
                className="px-4 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-medium rounded text-[#1A1A1A] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SHARE OUTFIT MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-5 sm:p-6 text-left max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D8CEBE] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#FAF6ED] border border-[#D8CEBE] rounded-full text-[#A4161A]">
                  <Share2 size={20} />
                </div>
                <div>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#A4161A]">
                    Chia Sẻ Bộ Phối Việt Phục
                  </h2>
                  <p className="text-xs text-[#666]">
                    Liên kết độc bản lưu trọn vẹn cấu hình trang phục kèm ảnh thẻ phối lookbook nghệ thuật.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="p-1.5 text-[#666] hover:text-[#1A1A1A] rounded-md hover:bg-black/5 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body: 2 Columns */}
            <div className="overflow-y-auto pr-1 flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Left Column: Image Preview Card */}
              <div className="md:col-span-5 flex flex-col items-center bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded text-center">
                <div className="text-xs font-semibold text-[#1A1A1A] mb-2 flex items-center gap-1.5">
                  <ImageIcon size={14} className="text-[#A4161A]" />
                  <span>Ảnh Thẻ Phối Đồ Nghệ Thuật (Preview)</span>
                </div>

                {isGeneratingSharePreview ? (
                  <div className="w-full aspect-[4/5] bg-[#F6EFE3] border border-dashed border-[#B8862B] rounded flex flex-col items-center justify-center text-xs text-[#666] p-4 gap-2">
                    <RefreshCw size={24} className="animate-spin text-[#A4161A]" />
                    <span>Đang kết xuất ảnh thẻ phối...</span>
                  </div>
                ) : sharePreviewUrl ? (
                  <div className="w-full relative group">
                    <img
                      src={sharePreviewUrl}
                      alt={`Thẻ phối ${currentCostume.name}`}
                      className="w-full max-h-[360px] object-contain rounded border border-[#D8CEBE] shadow-md bg-white mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-[4/5] bg-[#F6EFE3] rounded flex items-center justify-center text-xs text-[#666]">
                    <span>Chưa có ảnh xem trước</span>
                  </div>
                )}

                <div className="w-full mt-3 flex items-center gap-2">
                  <button
                    onClick={handleDownloadPoster}
                    className="flex-1 py-2 px-3 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-semibold rounded text-[#1A1A1A] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download size={14} className="text-[#A4161A]" />
                    <span>Tải ảnh PNG</span>
                  </button>
                  <button
                    onClick={() => handleShareOutfit(true)}
                    title="Làm mới ảnh xem trước"
                    className="p-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs rounded text-[#666] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} />
                  </button>
                </div>
              </div>

              {/* Right Column: Unique URL, Native Share & Socials */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                {/* Unique URL Card */}
                <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider flex items-center gap-1.5">
                      <LinkIcon size={14} className="text-[#A4161A]" />
                      <span>Liên kết độc bản cho bộ phối này (Unique URL)</span>
                    </label>
                    <span className="text-[10px] text-[#2D6A4F] bg-[#E8F5E9] px-2 py-0.5 rounded font-medium">
                      Đã lưu trọn cấu hình
                    </span>
                  </div>
                  <p className="text-xs text-[#666]">
                    Bất kỳ ai mở liên kết này đều sẽ được đưa thẳng vào phòng Studio với đúng trang phục, sắc màu, phụ kiện và bối cảnh bạn đã chọn.
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      readOnly
                      value={getShareableUrl()}
                      onClick={(e) => (e.target as HTMLInputElement).select()}
                      className="flex-1 bg-white border border-[#D8CEBE] px-3 py-2 text-xs rounded text-[#1A1A1A] font-mono focus:outline-none focus:border-[#A4161A] select-all truncate"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      className={`py-2 px-4 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs ${
                        copiedShareLink
                          ? 'bg-[#2D6A4F] text-white'
                          : 'bg-[#A4161A] hover:bg-[#850D11] text-white'
                      }`}
                    >
                      {copiedShareLink ? (
                        <>
                          <Check size={14} />
                          <span>Đã sao chép!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={14} />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Native Device Share Button (if supported or on mobile) */}
                {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
                  <button
                    onClick={() => handleShareOutfit(false)}
                    className="w-full py-2.5 px-4 bg-[#1F2A44] hover:bg-[#121A2D] text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Smartphone size={16} />
                    <span>Mở hộp thoại chia sẻ của thiết bị (Hệ điều hành / Zalo / App)</span>
                  </button>
                )}

                {/* Social Share Buttons */}
                <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-4 rounded space-y-2.5">
                  <div className="text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                    Chia sẻ nhanh lên mạng xã hội
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getShareableUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-[#1877F2] hover:bg-[#166FE5] text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Facebook</span>
                    </a>
                    <a
                      href={`https://zalo.me/share?url=${encodeURIComponent(getShareableUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-[#0068FF] hover:bg-[#005AD9] text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Zalo</span>
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Tôi vừa phối bộ ${currentCostume.name} sắc ${currentColorName} trên VẬN KỲ!`)}&url=${encodeURIComponent(getShareableUrl())}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-[#000000] hover:bg-[#222222] text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>X (Twitter)</span>
                    </a>
                    <a
                      href={`https://t.me/share/url?url=${encodeURIComponent(getShareableUrl())}&text=${encodeURIComponent(`Tôi vừa phối bộ ${currentCostume.name} sắc ${currentColorName} trên VẬN KỲ!`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-[#24A1DE] hover:bg-[#208EC4] text-white text-xs font-medium rounded flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <span>Telegram</span>
                    </a>
                  </div>
                </div>

                {/* QR Code Quick Scan for Mobile */}
                <div className="bg-[#FAF6ED] border border-[#D8CEBE] p-3 rounded">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A]">
                      <QrCode size={15} className="text-[#A4161A]" />
                      <span>Mã QR quét trên điện thoại</span>
                    </div>
                    <button
                      onClick={() => setShowQrCode(!showQrCode)}
                      className="text-xs text-[#A4161A] hover:underline font-semibold cursor-pointer"
                    >
                      {showQrCode ? 'Ẩn mã QR' : 'Hiện mã QR'}
                    </button>
                  </div>

                  {showQrCode && (
                    <div className="mt-3 p-3 bg-white rounded border border-[#D8CEBE] flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left animate-in fade-in">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&margin=4&data=${encodeURIComponent(getShareableUrl())}`}
                        alt="QR Code"
                        className="w-28 h-28 border border-[#E8DEC8] rounded"
                      />
                      <div className="text-xs text-[#666] space-y-1 max-w-xs">
                        <p className="font-semibold text-[#1A1A1A]">Dùng camera điện thoại để quét</p>
                        <p>Mở tức thì bản phối này trên điện thoại của bạn bè hoặc chụp màn hình đăng story.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Outfit Configuration Summary */}
                <div className="text-[11px] text-[#666] bg-[#FAF6ED]/70 p-3 rounded border border-[#D8CEBE] flex items-center justify-between flex-wrap gap-2">
                  <div><strong>Trang phục:</strong> {currentCostume.name}</div>
                  <div><strong>Sắc màu:</strong> {currentColorName} ({currentColorHex})</div>
                  <div><strong>Phụ kiện:</strong> {selectedAccessories.length} món</div>
                  <div><strong>Bối cảnh:</strong> {backgroundScene === 'hue' ? 'Huế' : backgroundScene === 'thanglong' ? 'Thăng Long' : backgroundScene === 'hoian' ? 'Hội An' : 'Nhà rường'}</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-[#D8CEBE] mt-4 flex items-center justify-between">
              <div className="text-xs text-[#888]">
                VẬN KỲ · Nền tảng Việt Phục Tương Tác
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 bg-[#FAF6ED] hover:bg-[#E8DEC8] border border-[#D8CEBE] text-xs font-medium rounded text-[#1A1A1A] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXPORT LOOKBOOK POSTER MODAL */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="relative w-full max-w-lg bg-[#F6EFE3] border border-[#B8862B] shadow-2xl rounded p-6 text-center">
            <h2 className="font-serif text-2xl font-bold text-[#A4161A] mb-2">
              Xuất Thẻ Lookbook Nghệ Thuật
            </h2>
            <p className="text-xs text-[#555] mb-6">
              Thẻ ảnh kích thước chuẩn poster nghệ thuật bao gồm chi tiết cổ phục, bảng màu ngũ hành và huy hiệu chuẩn chỉ văn hóa.
            </p>

            <div className="bg-[#FAF6ED] p-4 rounded border border-[#D8CEBE] text-left text-xs space-y-2 mb-6">
              <div><strong>Trang phục:</strong> {currentCostume.name}</div>
              <div><strong>Tông màu:</strong> {currentColorName} ({currentColorHex})</div>
              <div><strong>Phụ kiện:</strong> {selectedAccessories.length} món</div>
              <div><strong>Điểm hài hòa:</strong> {harmonyResult.score}/100</div>
              <div><strong>Tình trạng:</strong> {culturalWarnings.length === 0 ? 'Đạt chuẩn văn hiến' : 'Có lưu ý văn hóa'}</div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDownloadPoster}
                className="flex-1 py-3 bg-[#A4161A] hover:bg-[#850D11] text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Download size={16} className="text-[#D4A347]" />
                <span>Tải ảnh PNG</span>
              </button>
              <button
                onClick={() => {
                  setShowExportModal(false);
                  handleShareOutfit(false);
                }}
                className="py-3 px-5 border border-[#B8862B] text-[#B8862B] hover:bg-[#B8862B]/10 text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 size={16} />
                <span>Chia sẻ bộ phối</span>
              </button>
              <button
                onClick={() => setShowExportModal(false)}
                className="py-3 px-4 text-xs text-[#666] hover:text-[#1A1A1A] cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING FEEDBACK TOAST */}
      {favoriteFeedback && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-white text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 border border-[#B8862B] animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 size={16} className="text-[#D4A347]" />
          <span>{favoriteFeedback}</span>
        </div>
      )}
    </div>
  );
};
