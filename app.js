// ============================================================================
// 1. SABİT FIREBASE KONFİQURASİYASI (ZERO-CONFIG CANLI SİNXRONİZASİYA)
// ============================================================================
const firebaseConfig = {
  apiKey: "AIzaSyC2I9xw1VVzVtPeBOU92Urww-263cbwtUc",
  authDomain: "bababalakafe.firebaseapp.com",
  projectId: "bababalakafe",
  storageBucket: "bababalakafe.firebasestorage.app",
  messagingSenderId: "987440976354",
  appId: "1:987440976354:web:894e433c99b6fa56e029bb"
};
const FIREBASE_CONFIG = firebaseConfig;

const FIRESTORE_COLLECTION = "bababala_data";
const FIRESTORE_DOC_ID = "live_shift";
const FIRESTORE_ARCHIVE_DOC_ID = "shift_archive";

const STORAGE_KEY = "bababala_pos_state_v1";
const ARCHIVE_STORAGE_KEY = "bababala_pos_archive_v1";
const THEME_STORAGE_KEY = "bababala_theme_v1";
const ROLE_STORAGE_KEY = "bababala_user_role";
const ROLE_VERIFIED_KEY = "bababala_role_verified_v1";

// Hər hesab üçün təhlükəsizlik kodları (Bir dəfə seçilib yığıldıqdan sonra həmişəlik yadda qalır)
const ROLE_PINS = {
  admin: "2008",
  waiter1: "1111",
  waiter2: "2222"
};

const CLIENT_ID = `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

// Xərc Növünə Görə Dəqiq Tez Seçim Düymələri
const EXPENSE_PRESETS = {
  kafe: ["Çörək", "Araq", "Pivə", "Xiyar & Pomidor"],
  pencere: ["Un", "Lavaş", "Kartof", "Droj"]
};

// 2 Sütunlu Kvadrat Menyu Kateqoriyaları (İsti və Soyuq içkilər ayrı)
const MENU_CATEGORIES = [
  { id: "seher", label: "Səhər Yeməkləri", fullTitle: "Səhər Yeməkləri" },
  { id: "qazan", label: "Qazan Yeməkləri", fullTitle: "Qazan Yeməkləri" },
  { id: "quru", label: "Quru Yeməklər", fullTitle: "Quru Yeməklər" },
  { id: "isti_ickiler", label: "İsti İçkilər", fullTitle: "İsti İçkilər" },
  { id: "soyuq_ickiler", label: "Soyuq İçkilər", fullTitle: "Soyuq İçkilər" },
  { id: "spirt", label: "Pivə & Spirt", fullTitle: "Spirtli İçkilər (Pivə və Araq)" },
  { id: "mezeler", label: "Məzələr", fullTitle: "Məzələr" }
];

// "BabaBala" Rəsmi Menyu Məlumat Bazası
const MENU_CATALOG = [
  // --- SƏHƏR YEMƏKLƏRİ ---
  { id: "yag_pendir_cay", name: "Yağ & Pendir (şirin çayla)", price: 3.00, category: "seher", unit: "pors" },
  { id: "pomidor_yumurta", name: "Pomidor-Yumurta", price: 4.00, category: "seher", unit: "pors" },
  { id: "sosiska_yumurta", name: "Sosiska & Yumurta", price: 4.00, category: "seher", unit: "pors" },
  { id: "qlazok", name: "Qlazok", price: 3.00, category: "seher", unit: "pors" },
  { id: "cizbiz", name: "Cızbız", price: 5.00, category: "seher", unit: "pors" },

  // --- QAZAN YEMƏKLƏRİ ---
  { id: "merci_sorbasi", name: "Mərci Şorbası", price: 3.00, category: "qazan", unit: "pors" },
  { id: "etli_sous", name: "Ətli sous", price: 6.00, category: "qazan", unit: "pors" },
  { id: "kufteli_bozbas", name: "Küftəli Bozbaş", price: 5.00, category: "qazan", unit: "pors" },
  { id: "etli_bors", name: "Ətli Borş", price: 5.00, category: "qazan", unit: "pors" },
  { id: "xas", name: "Xaş", price: 7.00, category: "qazan", unit: "pors" },
  { id: "piti", name: "Piti", price: 8.00, category: "qazan", unit: "pors" },
  { id: "buglama", name: "Buğlama", price: 9.00, category: "qazan", unit: "pors" },
  { id: "sireli_dana", name: "Şirəli Dana", price: 9.00, category: "qazan", unit: "pors" },

  // --- QURU YEMƏKLƏR ---
  { id: "uc_baci_dolmasi", name: "Üç Bacı Dolması", price: 6.00, category: "quru", unit: "pors" },
  { id: "kelem_dolmasi", name: "Kələm Dolması", price: 6.00, category: "quru", unit: "pors" },
  { id: "yarpaq_dolmasi", name: "Yarpaq Dolması", price: 6.00, category: "quru", unit: "pors" },
  { id: "toyuq_kartof", name: "Toyuq & Kartof", price: 5.00, category: "quru", unit: "pors" },
  { id: "imisli_cigirtmasi", name: "İmişli Çığırtması", price: 5.00, category: "quru", unit: "pors" },
  { id: "pure_kotlet", name: "Püre & Kotlet", price: 5.00, category: "quru", unit: "pors" },
  { id: "makaron_qulyas", name: "Makaron & Qulyaş", price: 5.00, category: "quru", unit: "pors" },
  { id: "qrecka_qulyas", name: "Qreçka & Qulyaş", price: 5.00, category: "quru", unit: "pors" },
  { id: "xengel", name: "Xəngəl", price: 5.00, category: "quru", unit: "pors" },
  { id: "tusonka", name: "Tuşonka", price: 7.00, category: "quru", unit: "pors" },
  { id: "qovurma", name: "Qovurma", price: 8.00, category: "quru", unit: "pors" },

  // --- İSTİ İÇKİLƏR ---
  { id: "sade_cay", name: "Sadə Çay", price: 2.00, category: "isti_ickiler", unit: "ədəd" },
  { id: "sade_cay_jek", name: "Sadə Çay (1 ₼)", price: 1.00, category: "isti_ickiler", unit: "ədəd" },
  { id: "cay_plitka_sokolad", name: "Çay & Plitka Şokolad", price: 4.00, category: "isti_ickiler", unit: "pors" },
  { id: "kofe", name: "Kofe", price: 1.00, category: "isti_ickiler", unit: "ədəd" },

  // --- SOYUQ İÇKİLƏR ---
  { id: "cola_fanta_033", name: "Cola / Fanta 0.33l", price: 1.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "cola_fanta_05", name: "Cola / Fanta 0.5l", price: 2.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "cola_fanta_1l", name: "Cola / Fanta 1l", price: 3.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "duses_terxun_05", name: "Düşes / Tərxun 0.5l", price: 2.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "sirab_1l", name: "Sirab 1l", price: 2.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "ayran_stekan", name: "Ayran (Stəkan)", price: 1.00, category: "soyuq_ickiler", unit: "ədəd" },
  { id: "ayran_bakal", name: "Ayran (Bakal)", price: 2.00, category: "soyuq_ickiler", unit: "ədəd" },

  // --- SPİRTLİ İÇKİLƏR (PİVƏ VƏ ARAQ) ---
  { id: "suzme_pive_nzs_05", name: "Süzmə Pivə NZS (0.5l)", price: 1.70, category: "spirt", unit: "ədəd" },
  { id: "xirdalan_05_suse", name: "Xırdalan (0.5l şüşə)", price: 4.50, category: "spirt", unit: "ədəd" },
  { id: "efsane_nzs_05_suse", name: "Əfsanə / NZS (0.5l şüşə)", price: 4.00, category: "spirt", unit: "ədəd" },
  { id: "suzme_araq_50q", name: "Süzmə Araq (50 qr)", price: 1.00, category: "spirt", unit: "pors" },
  { id: "suzme_araq_100q", name: "Süzmə Araq (100 qr)", price: 2.00, category: "spirt", unit: "pors" },
  { id: "suse_araq_05l", name: "Şüşə Araq 0.5l", price: 10.00, category: "spirt", unit: "ədəd" },
  { id: "suse_araq_07l", name: "Şüşə Araq 0.7l", price: 15.00, category: "spirt", unit: "ədəd" },

  // --- MƏZƏLƏR ---
  { id: "sacaqli_pendir", name: "Saçaqlı Pendir", price: 3.00, category: "mezeler", unit: "pors" },
  { id: "qizardilmis_sacaqli_pendir", name: "Qızardılmış Saçaqlı Pendir", price: 4.00, category: "mezeler", unit: "pors" },
  { id: "cipsi", name: "Çipsi", price: 2.00, category: "mezeler", unit: "pors" },
  { id: "tum", name: "Tum", price: 2.00, category: "mezeler", unit: "pors" },
  { id: "noxud", name: "Noxud", price: 2.00, category: "mezeler", unit: "pors" },
  { id: "bogaz_qizartmasi", name: "Boğaz Qızartması", price: 3.00, category: "mezeler", unit: "pors" },
  { id: "dusbere_qizartmasi", name: "Düşbərə Qızartması", price: 3.00, category: "mezeler", unit: "pors" },
  { id: "petenek_qizartmasi", name: "Pətənək Qızartması", price: 3.00, category: "mezeler", unit: "pors" },
  { id: "petenek_zogal_sousu", name: "Pətənək Qızartması (zoğal sousu ilə)", price: 4.00, category: "mezeler", unit: "pors" },
  { id: "qarisiq_tursu_assorti", name: "Qarışıq Turşu Assorti", price: 4.00, category: "mezeler", unit: "pors" }
];

// "BabaBala" Pəncərə Satışı (Ayaqüstü / Al-Apar) Menyu Məlumat Bazası
const WINDOW_MENU_CATALOG = [
  { id: "win_durmek_et", name: "Ətli qızarmış dürmək", price: 0.60, unit: "ədəd" },
  { id: "win_durmek_sosis", name: "Sosisli qızarmış dürmək", price: 0.50, unit: "ədəd" },
  { id: "win_peraski_boyuk", name: "Böyük peraşki", price: 0.60, unit: "ədəd" },
  { id: "win_peraski_kicik", name: "Kiçik Peraşki", price: 0.30, unit: "ədəd" },
  { id: "win_peraski_mini", name: "Mini peraşki", price: 0.25, unit: "ədəd" }
];

const VALID_ITEM_IDS = new Set(MENU_CATALOG.map((item) => item.id));

// İlkin Masalar: Masalar (1-6) və Həyət (1-9)
const INITIAL_TABLES = [
  { id: "masa_1", name: "Masa 1", group: "daxili", orders: {}, customOrders: [] },
  { id: "masa_2", name: "Masa 2", group: "daxili", orders: {}, customOrders: [] },
  { id: "masa_3", name: "Masa 3", group: "daxili", orders: {}, customOrders: [] },
  { id: "masa_4", name: "Masa 4", group: "daxili", orders: {}, customOrders: [] },
  { id: "masa_5", name: "Masa 5", group: "daxili", orders: {}, customOrders: [] },
  { id: "masa_6", name: "Masa 6", group: "daxili", orders: {}, customOrders: [] },
  { id: "heyet_1", name: "Həyət 1", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_2", name: "Həyət 2", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_3", name: "Həyət 3", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_4", name: "Həyət 4", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_5", name: "Həyət 5", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_6", name: "Həyət 6", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_7", name: "Həyət 7", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_8", name: "Həyət 8", group: "heyet", orders: {}, customOrders: [] },
  { id: "heyet_9", name: "Həyət 9", group: "heyet", orders: {}, customOrders: [] }
];

// Rəqəmləri 2 onluq kəsrlə yuvarlaqlaşdırmaq
function round2(val) {
  return Math.round((Number(val) || 0) * 100) / 100;
}

// Məbləğ formatlama (0.00 ₼)
function formatMoney(amount) {
  const safeVal = round2(amount);
  return `${safeVal.toFixed(2)} ₼`;
}

// Mənfi xərc formatlama (-0.00 ₼)
function formatNegativeMoney(amount) {
  const safeVal = Math.abs(round2(amount));
  return `-${safeVal.toFixed(2)} ₼`;
}

// Azərbaycan dilində tam tarix formatı
function getFormattedDateAz() {
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  const days = [
    "Bazar", "Bazar ertəsi", "Çərşənbə axşamı",
    "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"
  ];
  const now = new Date();
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}, ${days[now.getDay()]}`;
}

// Qısa tarix və saat formatı (Arxiv üçün)
function getShortDateTimeAz(dateObj = new Date()) {
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yyyy = dateObj.getFullYear();
  const hh = String(dateObj.getHours()).padStart(2, "0");
  const min = String(dateObj.getMinutes()).padStart(2, "0");
  return `${dd}.${mm}.${yyyy} (${hh}:${min})`;
}

// Kafe İş Günü Açarı (Saat 05:00-dan növbəti gün 04:59-a qədər 1 növbə sayılır)
function getBusinessDateKey(dateObj = new Date()) {
  const shifted = new Date(dateObj.getTime() - 5 * 3600 * 1000);
  const yyyy = shifted.getFullYear();
  const mm = String(shifted.getMonth() + 1).padStart(2, "0");
  const dd = String(shifted.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getFormattedBusinessDateAz(dateObj = new Date()) {
  const shifted = new Date(dateObj.getTime() - 5 * 3600 * 1000);
  const months = [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun",
    "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ];
  const days = [
    "Bazar", "Bazar ertəsi", "Çərşənbə axşamı",
    "Çərşənbə", "Cümə axşamı", "Cümə", "Şənbə"
  ];
  return `${shifted.getDate()} ${months[shifted.getMonth()]} ${shifted.getFullYear()}, ${days[shifted.getDay()]}`;
}

// Rolun Azərbaycan dilində oxunaqlı adı
function getRoleDisplayName(role) {
  if (role === "admin") return "Admin";
  if (role === "waiter2") return "2-ci Ofisiant";
  return "1-ci Ofisiant";
}

// URL parametrindən və ya localStorage-dən təsdiqlənmiş rolu təyin etmək
function resolveUserRoleFromUrlOrStorage() {
  const savedRole = (localStorage.getItem(ROLE_STORAGE_KEY) || "").trim().toLowerCase();
  const verifiedRole = (localStorage.getItem(ROLE_VERIFIED_KEY) || "").trim().toLowerCase();
  const isAlreadyVerified =
    (savedRole === "admin" || savedRole === "waiter1" || savedRole === "waiter2") &&
    savedRole === verifiedRole;

  let urlRequestedRole = null;
  try {
    const params = new URLSearchParams(window.location.search);
    const rawParam = (params.get("rol") || "").trim().toLowerCase();
    if (rawParam === "admin" || rawParam === "waiter1" || rawParam === "waiter2") {
      urlRequestedRole = rawParam;
    }
  } catch (err) {
    // Ignore URL parse error
  }

  // Əgər URL-də başqa rol istənilibsə və hələ həmin rol təsdiqlənməyibsə, kod tələb et
  if (urlRequestedRole && urlRequestedRole !== savedRole) {
    return {
      role: isAlreadyVerified ? savedRole : "waiter1",
      needsSelection: true,
      preselectedRole: urlRequestedRole,
      hasVerifiedRole: isAlreadyVerified
    };
  }

  // Cihazda artıq kodla təsdiqlənmiş rol varsa, birbaşa həmin hesabda aç (heç nə soruşma)
  if (isAlreadyVerified) {
    return {
      role: savedRole,
      needsSelection: false,
      preselectedRole: null,
      hasVerifiedRole: true
    };
  }

  // İlk dəfə açılırsa, rol seçimi + kod pəncərəsini aç
  return {
    role: "waiter1",
    needsSelection: true,
    preselectedRole: urlRequestedRole,
    hasVerifiedRole: false
  };
}

// Köhnə test məhsul açarlarını təmizləmək
function sanitizeOrdersMap(ordersObj) {
  if (!ordersObj || typeof ordersObj !== "object") return {};
  const cleaned = {};
  for (const [key, val] of Object.entries(ordersObj)) {
    const qty = Number(val) || 0;
    if (VALID_ITEM_IDS.has(key) && qty > 0) {
      cleaned[key] = qty;
    }
  }
  return cleaned;
}

// Default State yaradılması
function createDefaultState() {
  return {
    shiftDateKey: getBusinessDateKey(),
    shiftFullDate: getFormattedBusinessDateAz(),
    tables: JSON.parse(JSON.stringify(INITIAL_TABLES)),
    completedSalesTotal: 0,
    soldItemsSummary: {},
    soldCustomItems: [],
    expenses: [],
    closedBills: [],
    // Pəncərə Satışı:
    windowSalesTotal: 0,
    windowSoldSummary: {},
    windowCart: {}
  };
}

// İstənilən mənbədən (localStorage və ya Firebase) gələn State obyektini normallaşdırmaq
function normalizeStateObject(parsed) {
  if (!parsed || typeof parsed !== "object") return createDefaultState();

  const tables = INITIAL_TABLES.map((initTable) => {
    const savedTable = Array.isArray(parsed.tables)
      ? parsed.tables.find((t) => t.id === initTable.id)
      : null;
    return {
      id: initTable.id,
      name: initTable.name,
      group: initTable.group,
      orders: savedTable ? sanitizeOrdersMap(savedTable.orders) : {},
      customOrders: savedTable && Array.isArray(savedTable.customOrders)
        ? savedTable.customOrders
        : [],
      lastWaiter: savedTable && savedTable.lastWaiter ? savedTable.lastWaiter : null
    };
  });

  return {
    shiftDateKey: parsed.shiftDateKey || getBusinessDateKey(),
    shiftFullDate: parsed.shiftFullDate || getFormattedBusinessDateAz(),
    tables,
    completedSalesTotal: round2(parsed.completedSalesTotal),
    soldItemsSummary: sanitizeOrdersMap(parsed.soldItemsSummary),
    soldCustomItems: Array.isArray(parsed.soldCustomItems) ? parsed.soldCustomItems : [],
    expenses: Array.isArray(parsed.expenses) ? parsed.expenses.map((e) => ({
      ...e,
      type: e.type === "pencere" ? "pencere" : "kafe",
      addedBy: e.addedBy || "waiter1"
    })) : [],
    closedBills: Array.isArray(parsed.closedBills) ? parsed.closedBills.map((b) => ({
      ...b,
      closedBy: b.closedBy || "waiter1"
    })) : [],
    windowSalesTotal: round2(parsed.windowSalesTotal),
    windowSoldSummary: (parsed.windowSoldSummary && typeof parsed.windowSoldSummary === "object")
      ? parsed.windowSoldSummary
      : {},
    windowCart: (parsed.windowCart && typeof parsed.windowCart === "object")
      ? parsed.windowCart
      : {}
  };
}

// Vəziyyəti localStorage-dən oxumaq
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();
    return normalizeStateObject(JSON.parse(raw));
  } catch (err) {
    return createDefaultState();
  }
}

// Keçmiş Günlərin Arxivini oxumaq
function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Vəziyyəti həm localStorage-də saxlamaq, həm də Canlı Sinxronizasiyaya (Firebase live_shift) göndərmək
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  pushLiveSync();
}

// Keçmiş Günlərin Arxivini saxlamaq və ayrıca "shift_archive" sənədinə sinxronlaşdırmaq
function saveArchive(archiveList) {
  localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(archiveList));
  pushArchiveSync(archiveList);
}

let state = loadState();
let activeTableId = null;
let activeCategory = null; // null olduqda 2 sütunlu kvadrat kateqoriya kartları görünür
let currentTeaPrice = 2.00; // Sadə Çay üçün + / - ilə tənzimlənən cari qiymət (default 2.00 ₼)
let currentAppMode = "kafe"; // "kafe" və ya "pencere"
const initialRoleResolution = resolveUserRoleFromUrlOrStorage();
let currentUserRole = initialRoleResolution.role; // "admin" | "waiter1" | "waiter2"
let needsInitialRoleSelection = initialRoleResolution.needsSelection;
let preselectedRoleForAuth = initialRoleResolution.preselectedRole || null;
let hasVerifiedRoleOnDevice = initialRoleResolution.hasVerifiedRole || false;

// DOM Elementləri
const mainScreen = document.getElementById("mainScreen");
const tableScreen = document.getElementById("tableScreen");
const currentDateEl = document.getElementById("currentDate");
const headerSalesLabelEl = document.getElementById("headerSalesLabel");
const headerTotalSalesEl = document.getElementById("headerTotalSales");
const headerSubInfoEl = document.getElementById("headerSubInfo");
const tablesGridEl = document.getElementById("tablesGrid");

// Yuxarı Panel İdarəetmə Elementləri
const syncStatusBtn = document.getElementById("syncStatusBtn");
const syncStatusText = document.getElementById("syncStatusText");
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeToggleIcon = document.getElementById("themeToggleIcon");
const openArchiveHeaderBtn = document.getElementById("openArchiveHeaderBtn");

// Rejim Dəyişdiricisi və Görünüşlər
const modeCafeBtn = document.getElementById("modeCafeBtn");
const modeWindowBtn = document.getElementById("modeWindowBtn");
const cafeViewEl = document.getElementById("cafeView");
const windowViewEl = document.getElementById("windowView");

// Pəncərə Satışı Elementləri
const windowCartCountPillEl = document.getElementById("windowCartCountPill");
const windowCartListEl = document.getElementById("windowCartList");
const windowCartTotalEl = document.getElementById("windowCartTotal");
const windowClearCartBtn = document.getElementById("windowClearCartBtn");
const windowCheckoutBtn = document.getElementById("windowCheckoutBtn");
const windowMenuGridEl = document.getElementById("windowMenuGrid");

const backToMainBtn = document.getElementById("backToMainBtn");
const activeTableNameEl = document.getElementById("activeTableName");
const activeTableBadgeEl = document.getElementById("activeTableBadge");
const orderItemCountEl = document.getElementById("orderItemCount");
const orderListEl = document.getElementById("orderList");
const pinnedQuickGridEl = document.getElementById("pinnedQuickGrid");
const menuSectionTitleEl = document.getElementById("menuSectionTitle");
const menuSectionHintEl = document.getElementById("menuSectionHint");
const quickMenuGridEl = document.getElementById("quickMenuGrid");
const activeTableTotalEl = document.getElementById("activeTableTotal");
const closeBillBtn = document.getElementById("closeBillBtn");
const tableClosedBillsSectionEl = document.getElementById("tableClosedBillsSection");
const tableClosedBillsTotalPillEl = document.getElementById("tableClosedBillsTotalPill");
const tableClosedBillsListEl = document.getElementById("tableClosedBillsList");

// Xərc Modalı Elementləri
const openExpenseBtn = document.getElementById("openExpenseBtn");
const expenseModal = document.getElementById("expenseModal");
const closeExpenseModalBtn = document.getElementById("closeExpenseModalBtn");
const expenseForm = document.getElementById("expenseForm");
const expensePresetChipsEl = document.getElementById("expensePresetChips");
const expenseTitleInput = document.getElementById("expenseTitleInput");
const expenseAmountInput = document.getElementById("expenseAmountInput");
const modalExpenseTotalEl = document.getElementById("modalExpenseTotal");
const expensesListEl = document.getElementById("expensesList");

// Sərbəst Qiymət Modalı Elementləri
const customItemModal = document.getElementById("customItemModal");
const closeCustomItemModalBtn = document.getElementById("closeCustomItemModalBtn");
const customItemForm = document.getElementById("customItemForm");
const customItemNameInput = document.getElementById("customItemNameInput");
const customItemPriceInput = document.getElementById("customItemPriceInput");

// Hesabat Modalı Elementləri
const openReportBtn = document.getElementById("openReportBtn");
const reportModal = document.getElementById("reportModal");
const closeReportModalBtn = document.getElementById("closeReportModalBtn");
const reportDateSubEl = document.getElementById("reportDateSub");

const reportGrandNetCashEl = document.getElementById("reportGrandNetCash");
const reportGrandBreakdownEl = document.getElementById("reportGrandBreakdown");
const reportWaiterStatsListEl = document.getElementById("reportWaiterStatsList");

const reportCafeNetBadgeEl = document.getElementById("reportCafeNetBadge");
const reportCafeSalesEl = document.getElementById("reportCafeSales");
const reportCafeExpensesEl = document.getElementById("reportCafeExpenses");
const openTablesWarningBox = document.getElementById("openTablesWarningBox");
const reportOpenTablesAmountEl = document.getElementById("reportOpenTablesAmount");
const reportTableBillsListEl = document.getElementById("reportTableBillsList");
const reportSoldItemsEl = document.getElementById("reportSoldItems");
const reportCafeExpensesListEl = document.getElementById("reportCafeExpensesList");

const reportWindowNetBadgeEl = document.getElementById("reportWindowNetBadge");
const reportWindowSalesEl = document.getElementById("reportWindowSales");
const reportWindowExpensesEl = document.getElementById("reportWindowExpenses");
const reportWindowSoldItemsEl = document.getElementById("reportWindowSoldItems");
const reportWindowExpensesListEl = document.getElementById("reportWindowExpensesList");

const openArchiveFromReportBtn = document.getElementById("openArchiveFromReportBtn");
const endDayResetBtn = document.getElementById("endDayResetBtn");

// Xüsusi Arxiv Modalı Elementləri
const archiveModal = document.getElementById("archiveModal");
const closeArchiveModalBtn = document.getElementById("closeArchiveModalBtn");
const archiveDaysListEl = document.getElementById("archiveDaysList");

// Təsdiq (Confirm) Modalı Elementləri
const confirmResetModal = document.getElementById("confirmResetModal");
const cancelResetBtn = document.getElementById("cancelResetBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn");

const toastContainer = document.getElementById("toastContainer");

// Xərc Hesablamaları (Kafe və Pəncərə Ayrımı)
function getCafeExpenses() {
  return round2(
    (state.expenses || [])
      .filter((e) => e.type !== "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

function getWindowExpenses() {
  return round2(
    (state.expenses || [])
      .filter((e) => e.type === "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

function getTotalExpenses() {
  return round2(
    (state.expenses || []).reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

// Masanın ümumi hesabını və məhsul sayını hesablamaq
function getTableSummary(table) {
  let totalAmount = 0;
  let totalCount = 0;

  for (const menuItem of MENU_CATALOG) {
    const qty = Number(table.orders[menuItem.id]) || 0;
    if (qty > 0) {
      totalCount += qty;
      totalAmount += qty * menuItem.price;
    }
  }

  if (Array.isArray(table.customOrders)) {
    for (const custom of table.customOrders) {
      const qty = Number(custom.qty) || 0;
      const price = Number(custom.price) || 0;
      if (qty > 0 && price > 0) {
        totalCount += qty;
        totalAmount += qty * price;
      }
    }
  }

  return {
    totalAmount: round2(totalAmount),
    totalCount
  };
}

// Bildiriş göstərmək (Yalnız mühüm sistem hadisələri üçün, qısa və yığcam)
function showToast(message) {
  if (!toastContainer) return;
  toastContainer.innerHTML = "";
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 1300);
}

// Yuxarı Başlıqdakı Kassa Məbləğinin Yenilənməsi
function updateHeaderSales() {
  currentDateEl.textContent = getFormattedDateAz();

  if (currentAppMode === "kafe") {
    const grossSales = round2(state.completedSalesTotal);
    const kafeExp = getCafeExpenses();
    const kafeNet = round2(grossSales - kafeExp);

    if (headerSalesLabelEl) headerSalesLabelEl.textContent = "Kafe Xalis Kassa";
    headerTotalSalesEl.textContent = formatMoney(kafeNet);
    if (kafeExp > 0) {
      headerSubInfoEl.textContent = `Satış: ${formatMoney(grossSales)} | Xərc: -${kafeExp.toFixed(2)} ₼`;
    } else {
      headerSubInfoEl.textContent = `Ümumi satış: ${formatMoney(grossSales)}`;
    }
  } else {
    const winSales = round2(state.windowSalesTotal);
    const winExp = getWindowExpenses();
    const winNet = round2(winSales - winExp);

    if (headerSalesLabelEl) headerSalesLabelEl.textContent = "Pəncərə Xalis Kassa";
    headerTotalSalesEl.textContent = formatMoney(winNet);
    if (winExp > 0) {
      headerSubInfoEl.textContent = `Satış: ${formatMoney(winSales)} | Xərc: -${winExp.toFixed(2)} ₼`;
    } else {
      headerSubInfoEl.textContent = `Ümumi satış: ${formatMoney(winSales)}`;
    }
  }
}

// Rejim Dəyişdirilməsi (Kafe Masaları vs Pəncərə Satışı)
function setAppMode(mode) {
  currentAppMode = mode;
  if (mode === "kafe") {
    modeCafeBtn.classList.add("active");
    modeWindowBtn.classList.remove("active");
    cafeViewEl.style.display = "block";
    windowViewEl.style.display = "none";
    renderMainScreen();
  } else {
    modeCafeBtn.classList.remove("active");
    modeWindowBtn.classList.add("active");
    cafeViewEl.style.display = "none";
    windowViewEl.style.display = "block";
    renderWindowScreen();
  }
  updateHeaderSales();
}

// PƏNCƏRƏ SATIŞI FUNKSİYALARI
function getWindowCartSummary() {
  let totalAmount = 0;
  let totalCount = 0;
  if (state.windowCart && typeof state.windowCart === "object") {
    for (const item of WINDOW_MENU_CATALOG) {
      const qty = Number(state.windowCart[item.id]) || 0;
      if (qty > 0) {
        totalCount += qty;
        totalAmount += qty * item.price;
      }
    }
  }
  return {
    totalAmount: round2(totalAmount),
    totalCount
  };
}

function updateWindowCartQty(itemId, delta) {
  if (!state.windowCart || typeof state.windowCart !== "object") {
    state.windowCart = {};
  }
  const current = Number(state.windowCart[itemId]) || 0;
  const next = current + delta;
  if (next <= 0) {
    delete state.windowCart[itemId];
  } else {
    state.windowCart[itemId] = next;
  }
  saveState();
  renderWindowScreen();
}

function clearWindowCart() {
  state.windowCart = {};
  saveState();
  renderWindowScreen();
}

function checkoutWindowCart() {
  const { totalAmount, totalCount } = getWindowCartSummary();
  if (totalAmount <= 0) return;

  if (!state.windowSoldSummary || typeof state.windowSoldSummary !== "object") {
    state.windowSoldSummary = {};
  }

  for (const item of WINDOW_MENU_CATALOG) {
    const qty = Number(state.windowCart[item.id]) || 0;
    if (qty > 0) {
      state.windowSoldSummary[item.id] = (Number(state.windowSoldSummary[item.id]) || 0) + qty;
    }
  }

  state.windowSalesTotal = round2((Number(state.windowSalesTotal) || 0) + totalAmount);
  state.windowCart = {};
  saveState();

  renderWindowScreen();
  updateHeaderSales();
}

function renderWindowScreen() {
  updateHeaderSales();

  const { totalAmount, totalCount } = getWindowCartSummary();
  windowCartCountPillEl.textContent = `${totalCount} məhsul`;
  windowCartTotalEl.textContent = formatMoney(totalAmount);
  windowCheckoutBtn.disabled = totalAmount <= 0;
  windowClearCartBtn.disabled = totalAmount <= 0;

  // Səbət siyahısı
  windowCartListEl.innerHTML = "";
  const orderedItems = WINDOW_MENU_CATALOG.filter((item) => (Number(state.windowCart[item.id]) || 0) > 0);

  if (orderedItems.length === 0) {
    windowCartListEl.innerHTML = `
      <div class="empty-order-box">
        Səbət boşdur. Aşağıdakı menyudan toxunaraq əlavə edin.
      </div>
    `;
  } else {
    orderedItems.forEach((item) => {
      const qty = Number(state.windowCart[item.id]) || 0;
      const lineTotal = round2(qty * item.price);

      const row = document.createElement("div");
      row.className = "order-row";
      row.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-unit">${formatMoney(item.price)} / ${item.unit}</div>
        </div>
        <div class="order-controls">
          <button type="button" class="qty-btn qty-minus" aria-label="Azalt">−</button>
          <span class="order-item-qty">${qty}</span>
          <button type="button" class="qty-btn qty-plus" aria-label="Artır">+</button>
        </div>
        <div class="order-item-total">${formatMoney(lineTotal)}</div>
      `;

      row.querySelector(".qty-minus").addEventListener("click", () => updateWindowCartQty(item.id, -1));
      row.querySelector(".qty-plus").addEventListener("click", () => updateWindowCartQty(item.id, 1));
      windowCartListEl.appendChild(row);
    });
  }

  // Pəncərə Menyusu Düymələri
  windowMenuGridEl.innerHTML = "";
  WINDOW_MENU_CATALOG.forEach((item) => {
    const qty = Number(state.windowCart[item.id]) || 0;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `menu-btn ${qty > 0 ? "has-qty" : ""}`;

    btn.innerHTML = `
      <div class="menu-btn-top">
        <span class="menu-btn-title">+ ${item.name}</span>
        ${qty > 0 ? `<span class="menu-btn-qty-badge">${qty}</span>` : ""}
      </div>
      <span class="menu-btn-price">${formatMoney(item.price)}</span>
    `;

    btn.addEventListener("click", () => {
      updateWindowCartQty(item.id, 1);
    });

    windowMenuGridEl.appendChild(btn);
  });
}

// EKRAN 1-in yenilənməsi
function renderMainScreen() {
  updateHeaderSales();

  tablesGridEl.innerHTML = "";

  const groups = [
    { id: "daxili", title: "Masalar (1 – 6)" },
    { id: "heyet", title: "Həyət (1 – 9)" }
  ];

  groups.forEach((grp) => {
    const groupTables = state.tables.filter((t) => (t.group || (t.id.startsWith("heyet") ? "heyet" : "daxili")) === grp.id);
    if (groupTables.length === 0) return;

    const headerEl = document.createElement("div");
    headerEl.className = "table-group-header-wrap";
    headerEl.innerHTML = `
      <div class="table-group-title">
        <span>${grp.title}</span>
        <span class="table-group-count">${groupTables.length} masa</span>
      </div>
    `;
    tablesGridEl.appendChild(headerEl);

    groupTables.forEach((table) => {
      const { totalAmount, totalCount } = getTableSummary(table);
      const isBusy = totalAmount > 0;

      // Bu masada bu gün əvvəl bağlanmış hesabları hesabla
      const tableClosedBills = Array.isArray(state.closedBills)
        ? state.closedBills.filter((b) => b.tableId === table.id)
        : [];
      const tableClosedTotal = round2(tableClosedBills.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0));

      const card = document.createElement("button");
      card.type = "button";
      card.className = `table-card ${isBusy ? "is-busy" : "is-empty"}`;

      const isAdmin = currentUserRole === "admin";
      let bottomHtml = "";
      if (isBusy) {
        bottomHtml = `
          <div>
            <span class="table-card-status-text">${formatMoney(totalAmount)}</span>
            ${isAdmin && tableClosedTotal > 0 ? `<div class="table-card-history-badge">Əvvəl: ${formatMoney(tableClosedTotal)}</div>` : ""}
          </div>
          <span class="table-card-meta">${totalCount} sifariş</span>
        `;
      } else {
        bottomHtml = `
          <div>
            <span class="table-card-status-text">Boş</span>
            ${isAdmin && tableClosedTotal > 0 ? `<div class="table-card-history-badge">Əvvəl: ${formatMoney(tableClosedTotal)}</div>` : ""}
          </div>
          <span class="table-card-meta">${isAdmin && tableClosedBills.length > 0 ? `${tableClosedBills.length} hesab bağlanıb` : "Sifariş yoxdur"}</span>
        `;
      }

      card.innerHTML = `
        <div class="table-card-top">
          <span class="table-card-name">${table.name}</span>
          <span class="table-status-pill">${isBusy ? "Dolu" : "Boş"}</span>
        </div>
        <div class="table-card-bottom">
          ${bottomHtml}
        </div>
      `;

      card.addEventListener("click", () => {
        openTableScreen(table.id);
      });

      tablesGridEl.appendChild(card);
    });
  });
}

// EKRAN 2-ni açmaq
function openTableScreen(tableId) {
  activeTableId = tableId;
  activeCategory = null; // Həmişə 2 sütunlu kvadrat kateqoriya görünüşü ilə açılır
  currentTeaPrice = 2.00;
  mainScreen.classList.remove("active");
  tableScreen.classList.add("active");
  tableScreen.setAttribute("aria-hidden", "false");
  renderTableScreen();
}

// EKRAN 1-ə qayıtmaq
function closeTableScreen() {
  activeTableId = null;
  activeCategory = null;
  tableScreen.classList.remove("active");
  tableScreen.setAttribute("aria-hidden", "true");
  mainScreen.classList.add("active");
  renderMainScreen();
}

// Kateqoriya üzrə masada seçilmiş məhsul sayını hesablamaq
function getCategorySelectedCount(table, categoryId) {
  return MENU_CATALOG.reduce((sum, item) => {
    if (item.category === categoryId) {
      return sum + (Number(table.orders[item.id]) || 0);
    }
    return sum;
  }, 0);
}

// Menyu məhsul düyməsini yaratmaq
function createMenuItemButton(table, item) {
  const qty = Number(table.orders[item.id]) || 0;
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = `menu-btn ${qty > 0 ? "has-qty" : ""}`;

  btn.innerHTML = `
    <div class="menu-btn-top">
      <span class="menu-btn-title">+ ${item.name}</span>
      ${qty > 0 ? `<span class="menu-btn-qty-badge">${qty}</span>` : ""}
    </div>
    <span class="menu-btn-price">${formatMoney(item.price)}</span>
  `;

  btn.addEventListener("click", () => {
    updateTableItemQty(table.id, item.id, 1);
  });

  return btn;
}

// TEZ SEÇİM BÖLMƏSİ: Sadə Çay (üzərində 1 ₼ / 2 ₼ çevirmə düyməsi ilə), Pivə 1.70 ₼, Süzmə Araq 100q
function renderPinnedQuickItems(table) {
  pinnedQuickGridEl.innerHTML = "";

  // 1. Sadə Çay (Digər kartlarla eyni ölçüdə, üzərində tək düymə ilə 1 ₼ / 2 ₼ dəyişimi)
  const teaQty2 = Number(table.orders["sade_cay"]) || 0;
  const teaQty1 = Number(table.orders["sade_cay_jek"]) || 0;
  const totalTeaQty = teaQty2 + teaQty1;
  const isOneManat = currentTeaPrice <= 1.00;

  const teaBtn = document.createElement("div");
  teaBtn.setAttribute("role", "button");
  teaBtn.tabIndex = 0;
  teaBtn.className = `menu-btn ${totalTeaQty > 0 ? "has-qty" : ""}`;
  teaBtn.innerHTML = `
    <div class="menu-btn-top">
      <span class="menu-btn-title">+ Sadə Çay</span>
      ${totalTeaQty > 0 ? `<span class="menu-btn-qty-badge">${totalTeaQty}</span>` : ""}
    </div>
    <div class="menu-btn-bottom-row">
      <span class="menu-btn-price">${formatMoney(currentTeaPrice)}</span>
      <button type="button" class="tea-toggle-price-btn ${isOneManat ? "is-one-manat" : ""}">
        ${isOneManat ? "2 ₼ et" : "1 ₼ et"}
      </button>
    </div>
  `;

  // Karta toxunduqda seçilmiş qiymətlə (1.00 ₼ və ya 2.00 ₼) masaya əlavə et
  teaBtn.addEventListener("click", () => {
    const targetTeaId = currentTeaPrice <= 1.00 ? "sade_cay_jek" : "sade_cay";
    updateTableItemQty(table.id, targetTeaId, 1);
  });

  // Üzərindəki tək düymə ilə qiyməti 1 ₼-a çevir və ya 2 ₼-a qaytar
  teaBtn.querySelector(".tea-toggle-price-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    currentTeaPrice = currentTeaPrice <= 1.00 ? 2.00 : 1.00;
    renderPinnedQuickItems(table);
  });

  pinnedQuickGridEl.appendChild(teaBtn);

  // 2. Süzmə Pivə NZS (0.5l) - 1.70 ₼
  const piveItem = MENU_CATALOG.find((item) => item.id === "suzme_pive_nzs_05");
  if (piveItem) {
    pinnedQuickGridEl.appendChild(createMenuItemButton(table, piveItem));
  }

  // 3. Süzmə Araq (100 qr) - 2.00 ₼
  const araq100Item = MENU_CATALOG.find((item) => item.id === "suzme_araq_100q");
  if (araq100Item) {
    pinnedQuickGridEl.appendChild(createMenuItemButton(table, araq100Item));
  }
}

// 2 Sütunlu Kvadrat Kateqoriya Kartları və ya Seçilmiş Kateqoriyanın Məhsulları
function renderQuickMenu(table) {
  quickMenuGridEl.innerHTML = "";

  if (!activeCategory) {
    menuSectionTitleEl.textContent = "Menyu Kateqoriyaları";
    menuSectionHintEl.textContent = "Kateqoriyaya toxunun";

    // Kvadrat Kateqoriya Kartları (Masalar kimi 2 sütunlu)
    MENU_CATEGORIES.forEach((cat) => {
      const catSelectedCount = getCategorySelectedCount(table, cat.id);
      const totalItemsInCat = MENU_CATALOG.filter((item) => item.category === cat.id).length;

      const card = document.createElement("button");
      card.type = "button";
      card.className = `category-square-card ${catSelectedCount > 0 ? "has-active-items" : ""}`;

      card.innerHTML = `
        <div class="category-square-top">
          <span class="category-square-name">${cat.label}</span>
          ${catSelectedCount > 0 ? `<span class="category-square-badge">${catSelectedCount}</span>` : ""}
        </div>
        <div class="category-square-bottom">
          <span class="category-square-count">${totalItemsInCat} çeşid</span>
          <span class="category-square-arrow">›</span>
        </div>
      `;

      card.addEventListener("click", () => {
        activeCategory = cat.id;
        renderQuickMenu(table);
      });

      quickMenuGridEl.appendChild(card);
    });

    // 8-ci Kvadrat Kart: "+ Sərbəst Qiymət"
    const customBtn = document.createElement("button");
    customBtn.type = "button";
    customBtn.className = "menu-btn menu-btn-custom";
    customBtn.innerHTML = `
      <div class="menu-btn-top">
        <span class="menu-btn-title">+ Sərbəst Qiymət</span>
      </div>
      <span class="menu-btn-price">Xüsusi məbləğ ₼</span>
    `;
    customBtn.addEventListener("click", openCustomItemModal);
    quickMenuGridEl.appendChild(customBtn);
  } else {
    const currentCatObj = MENU_CATEGORIES.find((c) => c.id === activeCategory);
    menuSectionTitleEl.textContent = currentCatObj ? currentCatObj.fullTitle : "Menyu";
    menuSectionHintEl.textContent = "Toxunaraq əlavə et";

    // Kateqoriyalara Geri Qayıt düyməsi
    const backBar = document.createElement("button");
    backBar.type = "button";
    backBar.className = "category-back-bar";
    backBar.innerHTML = `
      <span>‹ Kateqoriyalara Qayıt</span>
      <span>Bütün Qruplar</span>
    `;
    backBar.addEventListener("click", () => {
      activeCategory = null;
      renderQuickMenu(table);
    });
    quickMenuGridEl.appendChild(backBar);

    // Seçilmiş kateqoriyanın məhsulları (2 sütunlu)
    const filteredItems = MENU_CATALOG.filter((item) => item.category === activeCategory);
    filteredItems.forEach((item) => {
      quickMenuGridEl.appendChild(createMenuItemButton(table, item));
    });
  }
}

// EKRAN 2-nin yenilənməsi
function renderTableScreen() {
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;

  const { totalAmount, totalCount } = getTableSummary(table);
  const isBusy = totalAmount > 0;

  activeTableNameEl.textContent = table.name;
  activeTableBadgeEl.textContent = isBusy ? "Dolu" : "Boş";
  activeTableBadgeEl.className = `table-badge ${isBusy ? "badge-busy" : "badge-empty"}`;
  orderItemCountEl.textContent = `${totalCount} məhsul`;
  activeTableTotalEl.textContent = formatMoney(totalAmount);
  closeBillBtn.disabled = !isBusy;

  // Sifariş siyahısını qurmaq
  orderListEl.innerHTML = "";
  const orderedCatalogItems = MENU_CATALOG.filter((item) => (Number(table.orders[item.id]) || 0) > 0);
  const customOrders = Array.isArray(table.customOrders) ? table.customOrders : [];

  if (orderedCatalogItems.length === 0 && customOrders.length === 0) {
    orderListEl.innerHTML = `
      <div class="empty-order-box">
        Bu masada aktiv sifariş yoxdur. Tez seçim və ya kateqoriyalardan məhsul əlavə edin.
      </div>
    `;
  } else {
    orderedCatalogItems.forEach((item) => {
      const qty = Number(table.orders[item.id]) || 0;
      const lineTotal = round2(qty * item.price);

      const row = document.createElement("div");
      row.className = "order-row";
      row.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-name">${item.name}</div>
          <div class="order-item-unit">${formatMoney(item.price)} / ${item.unit}</div>
        </div>
        <div class="order-controls">
          <button type="button" class="qty-btn qty-minus" aria-label="Azalt">−</button>
          <span class="order-item-qty">${qty}</span>
          <button type="button" class="qty-btn qty-plus" aria-label="Artır">+</button>
        </div>
        <div class="order-item-total">${formatMoney(lineTotal)}</div>
      `;

      row.querySelector(".qty-minus").addEventListener("click", () => updateTableItemQty(table.id, item.id, -1));
      row.querySelector(".qty-plus").addEventListener("click", () => updateTableItemQty(table.id, item.id, 1));
      orderListEl.appendChild(row);
    });

    customOrders.forEach((custom) => {
      const qty = Number(custom.qty) || 0;
      const lineTotal = round2(qty * custom.price);

      const row = document.createElement("div");
      row.className = "order-row";
      row.innerHTML = `
        <div class="order-item-info">
          <div class="order-item-name">${custom.name}</div>
          <div class="order-item-unit">${formatMoney(custom.price)} / ədəd</div>
        </div>
        <div class="order-controls">
          <button type="button" class="qty-btn qty-minus" aria-label="Azalt">−</button>
          <span class="order-item-qty">${qty}</span>
          <button type="button" class="qty-btn qty-plus" aria-label="Artır">+</button>
        </div>
        <div class="order-item-total">${formatMoney(lineTotal)}</div>
      `;

      row.querySelector(".qty-minus").addEventListener("click", () => updateCustomItemQty(table.id, custom.id, -1));
      row.querySelector(".qty-plus").addEventListener("click", () => updateCustomItemQty(table.id, custom.id, 1));
      orderListEl.appendChild(row);
    });
  }

  // Bu masada əvvəl bağlanmış hesabları yalnız Admin roluna göstər ('✕' silmə düyməsi ilə)
  const tableClosedBills = Array.isArray(state.closedBills)
    ? state.closedBills.filter((b) => b.tableId === table.id)
    : [];

  if (currentUserRole === "admin" && tableClosedBills.length > 0) {
    tableClosedBillsSectionEl.style.display = "flex";
    const closedSum = round2(tableClosedBills.reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0));
    tableClosedBillsTotalPillEl.textContent = `Cəmi: ${formatMoney(closedSum)} (${tableClosedBills.length} dəfə)`;
    tableClosedBillsListEl.innerHTML = "";

    tableClosedBills.slice().reverse().forEach((b, idx) => {
      const card = document.createElement("div");
      card.className = "closed-bill-card";
      const itemsText = (b.items || []).map((it) => `${it.name} × ${it.qty} (${formatMoney(it.total)})`).join(", ") || "Məhsullar qeyd olunmayıb";
      const waiterLabel = getRoleDisplayName(b.closedBy || "waiter1");

      card.innerHTML = `
        <div class="closed-bill-header">
          <div>
            <span>Hesab #${tableClosedBills.length - idx}</span>
            <span class="waiter-tag-pill">${waiterLabel}</span>
          </div>
          <div class="bill-right-actions">
            <span class="closed-bill-time">${b.time}</span>
            <strong class="closed-bill-amount">${formatMoney(b.totalAmount)}</strong>
            <button type="button" class="delete-record-btn" aria-label="Çeki sil" title="Bu çeki sil">✕</button>
          </div>
        </div>
        <div class="closed-bill-items">${itemsText}</div>
      `;

      card.querySelector(".delete-record-btn").addEventListener("click", () => {
        deleteClosedBillById(b.id);
      });

      tableClosedBillsListEl.appendChild(card);
    });
  } else {
    tableClosedBillsSectionEl.style.display = "none";
  }

  renderPinnedQuickItems(table);
  renderQuickMenu(table);
}

// Masaya standart məhsul əlavə etmək və ya azaltmaq
function updateTableItemQty(tableId, itemId, delta) {
  const table = state.tables.find((t) => t.id === tableId);
  if (!table) return;

  const currentQty = Number(table.orders[itemId]) || 0;
  const nextQty = currentQty + delta;

  if (nextQty <= 0) {
    delete table.orders[itemId];
  } else {
    table.orders[itemId] = nextQty;
  }

  table.lastWaiter = currentUserRole;
  saveState();
  renderTableScreen();
}

// Masadakı sərbəst sifarişin sayını dəyişmək
function updateCustomItemQty(tableId, customId, delta) {
  const table = state.tables.find((t) => t.id === tableId);
  if (!table || !Array.isArray(table.customOrders)) return;

  const idx = table.customOrders.findIndex((c) => c.id === customId);
  if (idx === -1) return;

  const nextQty = (Number(table.customOrders[idx].qty) || 0) + delta;
  if (nextQty <= 0) {
    table.customOrders.splice(idx, 1);
  } else {
    table.customOrders[idx].qty = nextQty;
  }

  table.lastWaiter = currentUserRole;
  saveState();
  renderTableScreen();
}

// Sərbəst Qiymət Modalını açmaq / bağlamaq
function openCustomItemModal() {
  customItemForm.reset();
  customItemNameInput.value = "Əlavə sifariş";
  customItemModal.classList.add("open");
  customItemModal.setAttribute("aria-hidden", "false");
  setTimeout(() => customItemPriceInput.focus(), 80);
}

function closeCustomItemModal() {
  customItemModal.classList.remove("open");
  customItemModal.setAttribute("aria-hidden", "true");
}

customItemForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;

  const name = customItemNameInput.value.trim() || "Əlavə sifariş";
  const price = round2(parseFloat(customItemPriceInput.value));
  if (price <= 0) return;

  if (!Array.isArray(table.customOrders)) {
    table.customOrders = [];
  }

  table.customOrders.push({
    id: `custom_${Date.now()}`,
    name,
    price,
    qty: 1
  });

  table.lastWaiter = currentUserRole;
  saveState();
  closeCustomItemModal();
  renderTableScreen();
});

// Hesabı bağlamaq (Ödənildi)
function closeActiveTableBill() {
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;

  const { totalAmount } = getTableSummary(table);
  if (totalAmount <= 0) return;

  const billItems = [];

  MENU_CATALOG.forEach((item) => {
    const qty = Number(table.orders[item.id]) || 0;
    if (qty > 0) {
      state.soldItemsSummary[item.id] = (Number(state.soldItemsSummary[item.id]) || 0) + qty;
      billItems.push({
        itemId: item.id,
        name: item.name,
        qty: qty,
        price: item.price,
        unit: item.unit,
        total: round2(qty * item.price),
        isCustom: false
      });
    }
  });

  if (Array.isArray(table.customOrders)) {
    table.customOrders.forEach((custom) => {
      const cQty = Number(custom.qty) || 1;
      const cPrice = Number(custom.price) || 0;
      const cTotal = round2(cQty * cPrice);
      const customRecordId = `sc_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      state.soldCustomItems.push({
        id: customRecordId,
        name: custom.name,
        qty: cQty,
        total: cTotal
      });
      billItems.push({
        customRecordId,
        name: custom.name,
        qty: cQty,
        price: cPrice,
        unit: "ədəd",
        total: cTotal,
        isCustom: true
      });
    });
  }

  if (!Array.isArray(state.closedBills)) {
    state.closedBills = [];
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  // Əməliyyatı edən ofisiantı qeyd et
  const closedByRole = (currentUserRole === "waiter1" || currentUserRole === "waiter2")
    ? currentUserRole
    : (table.lastWaiter || "admin");

  state.closedBills.push({
    id: `bill_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    tableId: table.id,
    tableName: table.name,
    time: timeStr,
    date: getShortDateTimeAz(now),
    totalAmount: round2(totalAmount),
    closedBy: closedByRole,
    items: billItems
  });

  state.completedSalesTotal = round2(state.completedSalesTotal + totalAmount);

  table.orders = {};
  table.customOrders = [];
  table.lastWaiter = null;

  saveState();
  closeTableScreen();
}

// 3. BAĞLANMIŞ ÇEKİN SİLİNMƏSİ (Test və ya səhv çekləri təmizləmək üçün — Yalnız Admin)
function deleteClosedBillById(billId) {
  if (currentUserRole !== "admin") return;

  const billIdx = (state.closedBills || []).findIndex((b) => b.id === billId);
  if (billIdx === -1) return;

  const bill = state.closedBills[billIdx];
  const billAmount = round2(bill.totalAmount);

  // Kassa cəmindən həmin çekin məbləğini çıx
  state.completedSalesTotal = Math.max(0, round2(state.completedSalesTotal - billAmount));

  // İnventar sayından həmin çekdəki məhsulları çıx
  if (Array.isArray(bill.items)) {
    bill.items.forEach((it) => {
      if (it.isCustom) {
        if (Array.isArray(state.soldCustomItems)) {
          const cIdx = state.soldCustomItems.findIndex(
            (c) => (it.customRecordId && c.id === it.customRecordId) || (c.name === it.name && round2(c.total) === round2(it.total))
          );
          if (cIdx !== -1) {
            state.soldCustomItems.splice(cIdx, 1);
          }
        }
      } else {
        const catalogItem = it.itemId
          ? MENU_CATALOG.find((m) => m.id === it.itemId)
          : MENU_CATALOG.find((m) => m.name === it.name);
        if (catalogItem && state.soldItemsSummary) {
          const currentSold = Number(state.soldItemsSummary[catalogItem.id]) || 0;
          const nextSold = currentSold - (Number(it.qty) || 0);
          if (nextSold <= 0) {
            delete state.soldItemsSummary[catalogItem.id];
          } else {
            state.soldItemsSummary[catalogItem.id] = nextSold;
          }
        }
      }
    });
  }

  state.closedBills.splice(billIdx, 1);
  saveState();
  refreshAllActiveViews();
}

// Pəncərə satışından test məhsul qeydini silmək (Yalnız Admin)
function deleteWindowSoldItem(itemId) {
  if (currentUserRole !== "admin") return;
  const item = WINDOW_MENU_CATALOG.find((m) => m.id === itemId);
  if (!item || !state.windowSoldSummary) return;

  const qty = Number(state.windowSoldSummary[itemId]) || 0;
  if (qty <= 0) return;

  const sumToDeduct = round2(qty * item.price);
  delete state.windowSoldSummary[itemId];
  state.windowSalesTotal = Math.max(0, round2(state.windowSalesTotal - sumToDeduct));

  saveState();
  refreshAllActiveViews();
}

// 4. XƏRC ƏLAVƏETMƏ SİSTEMİ VƏ YENİ TEZ SEÇİMLƏR (Ofisiant və Admin üçün aktiv)
function renderExpensePresetChips(expenseType) {
  if (!expensePresetChipsEl) return;
  const list = expenseType === "pencere" ? EXPENSE_PRESETS.pencere : EXPENSE_PRESETS.kafe;
  expensePresetChipsEl.innerHTML = "";

  list.forEach((label) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "chip-btn";
    btn.setAttribute("data-preset", label);
    btn.textContent = label;
    btn.addEventListener("click", () => {
      expenseTitleInput.value = label;
      expenseAmountInput.focus();
    });
    expensePresetChipsEl.appendChild(btn);
  });
}

function openExpenseModal() {
  const defaultType = currentAppMode === "pencere" ? "pencere" : "kafe";
  if (expenseForm.elements["expenseType"]) {
    expenseForm.elements["expenseType"].value = defaultType;
  }
  renderExpensePresetChips(defaultType);
  if (currentUserRole === "admin") {
    renderExpensesList();
  }
  expenseModal.classList.add("open");
  expenseModal.setAttribute("aria-hidden", "false");
}

function closeExpenseModal() {
  expenseModal.classList.remove("open");
  expenseModal.setAttribute("aria-hidden", "true");
  expenseForm.reset();
}

// Kassa növü (Kafe Xərci / Pəncərə Xərci) dəyişdikdə tez seçim düymələrini yenilə
expenseForm.querySelectorAll('input[name="expenseType"]').forEach((radio) => {
  radio.addEventListener("change", (e) => {
    renderExpensePresetChips(e.target.value);
  });
});

function deleteExpenseById(expenseId) {
  if (currentUserRole !== "admin") return;
  const target = state.expenses.find((item) => item.id === expenseId);
  if (!target) return;

  state.expenses = state.expenses.filter((item) => item.id !== expenseId);
  saveState();
  renderExpensesList();
  refreshAllActiveViews();
}

function renderExpensesList() {
  const totalExp = getTotalExpenses();
  modalExpenseTotalEl.textContent = formatNegativeMoney(totalExp);
  expensesListEl.innerHTML = "";

  if (state.expenses.length === 0) {
    expensesListEl.innerHTML = `<div class="mini-empty">Bu gün heç bir xərc qeydə alınmayıb.</div>`;
    return;
  }

  state.expenses.slice().reverse().forEach((exp) => {
    const isPencere = exp.type === "pencere";
    const badgeClass = isPencere ? "pencere" : "kafe";
    const badgeText = isPencere ? "Pəncərə" : "Kafe";
    const addedByText = exp.addedBy ? ` • ${getRoleDisplayName(exp.addedBy)}` : "";

    const row = document.createElement("div");
    row.className = "mini-row";
    row.innerHTML = `
      <div>
        <div>
          <span class="expense-badge ${badgeClass}">${badgeText}</span>
          <strong>${exp.title}</strong>
        </div>
        <small style="color:#64748b; font-weight:500;">Saat ${exp.time}${addedByText}</small>
      </div>
      <div class="expense-row-right">
        <strong style="color:#dc2626">${formatNegativeMoney(exp.amount)}</strong>
        <button type="button" class="delete-expense-btn" aria-label="Xərci sil">✕</button>
      </div>
    `;

    row.querySelector(".delete-expense-btn").addEventListener("click", () => {
      deleteExpenseById(exp.id);
    });

    expensesListEl.appendChild(row);
  });
}

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = expenseTitleInput.value.trim();
  const amount = round2(parseFloat(expenseAmountInput.value));
  const typeRadio = expenseForm.elements["expenseType"];
  const expenseType = typeRadio && typeRadio.value === "pencere" ? "pencere" : "kafe";

  if (!title || amount <= 0) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  state.expenses.push({
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    amount,
    type: expenseType,
    addedBy: currentUserRole,
    time: timeStr
  });

  saveState();
  expenseForm.reset();
  if (expenseForm.elements["expenseType"]) {
    expenseForm.elements["expenseType"].value = expenseType;
  }
  renderExpensePresetChips(expenseType);

  if (currentUserRole === "admin") {
    renderExpensesList();
  } else {
    closeExpenseModal();
  }
  refreshAllActiveViews();
});

// Ofisiantlar üzrə bağlanmış masa və dövriyyə statistikasını hesablamaq
function computeWaiterStats(closedBillsArray) {
  const stats = {
    waiter1: { label: "1-ci Ofisiant", count: 0, total: 0 },
    waiter2: { label: "2-ci Ofisiant", count: 0, total: 0 },
    admin: { label: "Admin (Müdir)", count: 0, total: 0 }
  };

  (closedBillsArray || []).forEach((b) => {
    const roleKey = (b.closedBy === "waiter2" || b.closedBy === "admin") ? b.closedBy : "waiter1";
    stats[roleKey].count += 1;
    stats[roleKey].total = round2(stats[roleKey].total + (Number(b.totalAmount) || 0));
  });

  return stats;
}

// 5. GÜNÜN SONU / KASSA HESABATI EKRANI (Yalnız Admin Səlahiyyəti)
function openReportModal() {
  if (currentUserRole !== "admin") return;
  renderReportModal();
  reportModal.classList.add("open");
  reportModal.setAttribute("aria-hidden", "false");
}

function closeReportModal() {
  reportModal.classList.remove("open");
  reportModal.setAttribute("aria-hidden", "true");
}

function renderReportModal() {
  reportDateSubEl.textContent = state.shiftFullDate || getFormattedDateAz();

  // Kafe Hesablamaları
  const cafeGrossSales = round2(state.completedSalesTotal);
  const cafeExpenses = getCafeExpenses();
  const cafeNetCash = round2(cafeGrossSales - cafeExpenses);

  // Pəncərə Hesablamaları
  const winGrossSales = round2(state.windowSalesTotal);
  const winExpenses = getWindowExpenses();
  const winNetCash = round2(winGrossSales - winExpenses);

  // Ümumi Yekun Xalis Kassa
  const grandNetCash = round2(cafeNetCash + winNetCash);

  // 1. Başlıq Banneri
  if (reportGrandNetCashEl) reportGrandNetCashEl.textContent = formatMoney(grandNetCash);
  if (reportGrandBreakdownEl) {
    reportGrandBreakdownEl.textContent = `Kafe Xalis: ${formatMoney(cafeNetCash)}  |  Pəncərə Xalis: ${formatMoney(winNetCash)}`;
  }

  // Ofisiantlar Üzrə Gündəlik Dövriyyə
  const allClosedBills = Array.isArray(state.closedBills) ? state.closedBills : [];
  if (reportWaiterStatsListEl) {
    const wStats = computeWaiterStats(allClosedBills);
    reportWaiterStatsListEl.innerHTML = "";
    ["waiter1", "waiter2", "admin"].forEach((key) => {
      const item = wStats[key];
      if (key === "admin" && item.count === 0) return;
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span><strong>${item.label}</strong> (${item.count} masa bağlayıb)</span>
        <strong style="color:#16a34a">${formatMoney(item.total)}</strong>
      `;
      reportWaiterStatsListEl.appendChild(row);
    });
  }

  // 2. Blok A: Kafe Kassası
  if (reportCafeNetBadgeEl) reportCafeNetBadgeEl.textContent = `Xalis: ${formatMoney(cafeNetCash)}`;
  if (reportCafeSalesEl) reportCafeSalesEl.textContent = formatMoney(cafeGrossSales);
  if (reportCafeExpensesEl) reportCafeExpensesEl.textContent = formatNegativeMoney(cafeExpenses);

  const openTablesTotal = round2(
    state.tables.reduce((sum, t) => sum + getTableSummary(t).totalAmount, 0)
  );
  if (openTablesTotal > 0) {
    openTablesWarningBox.style.display = "flex";
    reportOpenTablesAmountEl.textContent = formatMoney(openTablesTotal);
  } else {
    openTablesWarningBox.style.display = "none";
  }

  // Kafe Masaları üzrə Bağlanmış Hesablar ('✕' silmə düyməsi ilə)
  reportTableBillsListEl.innerHTML = "";

  if (allClosedBills.length === 0) {
    reportTableBillsListEl.innerHTML = `<div class="mini-empty">Bu gün hələ heç bir masada hesab bağlanmayıb.</div>`;
  } else {
    const tableMap = new Map();
    allClosedBills.forEach((bill) => {
      if (!tableMap.has(bill.tableId)) {
        tableMap.set(bill.tableId, {
          tableName: bill.tableName,
          bills: [],
          total: 0
        });
      }
      const entry = tableMap.get(bill.tableId);
      entry.bills.push(bill);
      entry.total = round2(entry.total + bill.totalAmount);
    });

    tableMap.forEach((entry) => {
      const groupEl = document.createElement("div");
      groupEl.className = "report-table-group-item";

      const headerDiv = document.createElement("div");
      headerDiv.className = "report-table-group-header";
      headerDiv.innerHTML = `
        <span>${entry.tableName} (${entry.bills.length} hesab)</span>
        <strong class="report-table-group-sum">${formatMoney(entry.total)}</strong>
      `;
      groupEl.appendChild(headerDiv);

      const subListDiv = document.createElement("div");
      subListDiv.className = "report-table-sub-list";

      entry.bills.forEach((b, idx) => {
        const itemsStr = (b.items || []).map((it) => `${it.name} × ${it.qty}`).join(", ");
        const waiterLabel = getRoleDisplayName(b.closedBy || "waiter1");

        const subItem = document.createElement("div");
        subItem.className = "report-bill-sub-item";
        subItem.innerHTML = `
          <div class="report-bill-sub-left">
            <span>Hesab #${idx + 1} (${b.time}) <span class="waiter-tag-pill">${waiterLabel}</span></span>
            ${itemsStr ? `<span class="report-bill-sub-items">${itemsStr}</span>` : ""}
          </div>
          <div class="bill-right-actions">
            <strong>${formatMoney(b.totalAmount)}</strong>
            <button type="button" class="delete-record-btn" title="Bu çeki sil">✕</button>
          </div>
        `;

        subItem.querySelector(".delete-record-btn").addEventListener("click", () => {
          deleteClosedBillById(b.id);
        });

        subListDiv.appendChild(subItem);
      });

      groupEl.appendChild(subListDiv);
      reportTableBillsListEl.appendChild(groupEl);
    });
  }

  // Kafe Satılan Məhsullar (İnventar)
  reportSoldItemsEl.innerHTML = "";
  const soldCatalogItems = MENU_CATALOG.filter((item) => (Number(state.soldItemsSummary[item.id]) || 0) > 0);
  const soldCustoms = Array.isArray(state.soldCustomItems) ? state.soldCustomItems : [];

  if (soldCatalogItems.length === 0 && soldCustoms.length === 0) {
    reportSoldItemsEl.innerHTML = `<div class="mini-empty">Bu gün kafedə hələ bağlanmış satış yoxdur.</div>`;
  } else {
    soldCatalogItems.forEach((item) => {
      const qty = Number(state.soldItemsSummary[item.id]) || 0;
      const sum = round2(qty * item.price);
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span>${item.name}: <strong>${qty} ${item.unit}</strong></span>
        <strong>${formatMoney(sum)}</strong>
      `;
      reportSoldItemsEl.appendChild(row);
    });

    soldCustoms.forEach((custom) => {
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span>${custom.name}: <strong>${custom.qty} ədəd</strong></span>
        <strong>${formatMoney(custom.total)}</strong>
      `;
      reportSoldItemsEl.appendChild(row);
    });
  }

  // Kafe Xərcləri Siyahısı ('✕' ilə silmək imkanı)
  reportCafeExpensesListEl.innerHTML = "";
  const cafeExpensesList = (state.expenses || []).filter((e) => e.type !== "pencere");
  if (cafeExpensesList.length === 0) {
    reportCafeExpensesListEl.innerHTML = `<div class="mini-empty">Bu gün kafe xərci qeydə alınmayıb.</div>`;
  } else {
    cafeExpensesList.forEach((exp) => {
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span>${exp.title} (${exp.time}):</span>
        <div class="bill-right-actions">
          <strong style="color:#dc2626">${formatMoney(exp.amount)}</strong>
          <button type="button" class="delete-record-btn" title="Xərci sil">✕</button>
        </div>
      `;
      row.querySelector(".delete-record-btn").addEventListener("click", () => {
        deleteExpenseById(exp.id);
        renderReportModal();
      });
      reportCafeExpensesListEl.appendChild(row);
    });
  }

  // 3. Blok B: Pəncərə Kassası
  if (reportWindowNetBadgeEl) reportWindowNetBadgeEl.textContent = `Xalis: ${formatMoney(winNetCash)}`;
  if (reportWindowSalesEl) reportWindowSalesEl.textContent = formatMoney(winGrossSales);
  if (reportWindowExpensesEl) reportWindowExpensesEl.textContent = formatNegativeMoney(winExpenses);

  // Pəncərə Satılan Məhsullar (Dürmək və Peraşki Sayı — '✕' ilə silmək imkanı)
  reportWindowSoldItemsEl.innerHTML = "";
  const winSoldItems = WINDOW_MENU_CATALOG.filter(
    (item) => (Number((state.windowSoldSummary || {})[item.id]) || 0) > 0
  );

  if (winSoldItems.length === 0) {
    reportWindowSoldItemsEl.innerHTML = `<div class="mini-empty">Bu gün hələ pəncərə satışı olmayıb.</div>`;
  } else {
    winSoldItems.forEach((item) => {
      const qty = Number(state.windowSoldSummary[item.id]) || 0;
      const sum = round2(qty * item.price);
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span>${item.name}: <strong>${qty} ədəd</strong></span>
        <div class="bill-right-actions">
          <strong>${formatMoney(sum)}</strong>
          <button type="button" class="delete-record-btn" title="Bu pəncərə satışını sil">✕</button>
        </div>
      `;
      row.querySelector(".delete-record-btn").addEventListener("click", () => {
        deleteWindowSoldItem(item.id);
      });
      reportWindowSoldItemsEl.appendChild(row);
    });
  }

  // Pəncərə Xərcləri Siyahısı ('✕' ilə silmək imkanı)
  reportWindowExpensesListEl.innerHTML = "";
  const winExpensesList = (state.expenses || []).filter((e) => e.type === "pencere");
  if (winExpensesList.length === 0) {
    reportWindowExpensesListEl.innerHTML = `<div class="mini-empty">Bu gün pəncərə xərci qeydə alınmayıb.</div>`;
  } else {
    winExpensesList.forEach((exp) => {
      const row = document.createElement("div");
      row.className = "mini-row";
      row.innerHTML = `
        <span>${exp.title} (${exp.time}):</span>
        <div class="bill-right-actions">
          <strong style="color:#dc2626">${formatMoney(exp.amount)}</strong>
          <button type="button" class="delete-record-btn" title="Xərci sil">✕</button>
        </div>
      `;
      row.querySelector(".delete-record-btn").addEventListener("click", () => {
        deleteExpenseById(exp.id);
        renderReportModal();
      });
      reportWindowExpensesListEl.appendChild(row);
    });
  }
}

// ============================================================================
// 6. NÖVBƏ BAĞLAMA, AVTOMATİK GÜN SONU SIFIRLANMASI VƏ XÜSUSİ ARXİV BÖLMƏSİ
// ============================================================================
function buildShiftArchiveRecord(targetState, customDateLabel) {
  const cafeGrossSales = round2(targetState.completedSalesTotal);
  const cafeExpenses = round2(
    (targetState.expenses || [])
      .filter((e) => e.type !== "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
  const cafeNetCash = round2(cafeGrossSales - cafeExpenses);

  const winGrossSales = round2(targetState.windowSalesTotal);
  const winExpenses = round2(
    (targetState.expenses || [])
      .filter((e) => e.type === "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
  const winNetCash = round2(winGrossSales - winExpenses);

  const grandNetCash = round2(cafeNetCash + winNetCash);
  const totalGross = round2(cafeGrossSales + winGrossSales);
  const totalExpenses = round2(cafeExpenses + winExpenses);

  return {
    id: `shift_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    date: customDateLabel || getShortDateTimeAz(),
    fullDate: targetState.shiftFullDate || getFormattedBusinessDateAz(),
    shiftDateKey: targetState.shiftDateKey || getBusinessDateKey(),
    cafeGross: cafeGrossSales,
    cafeExp: cafeExpenses,
    cafeNet: cafeNetCash,
    winGross: winGrossSales,
    winExp: winExpenses,
    winNet: winNetCash,
    grossSales: totalGross,
    totalExpenses: totalExpenses,
    netCash: grandNetCash,
    soldItemsSummary: { ...(targetState.soldItemsSummary || {}) },
    soldCustomItems: [...(targetState.soldCustomItems || [])],
    windowSoldSummary: { ...(targetState.windowSoldSummary || {}) },
    expenses: [...(targetState.expenses || [])],
    closedBills: [...(targetState.closedBills || [])]
  };
}

// Tarix açarının yenilənməsi (Cihazlararası saat fərqinə görə sifarişlərin öz-özünə silinib arxivə düşməməsi üçün avto-sıfırlama ləğv edildi)
function checkAndExecuteAutoEndDay() {
  if (!isInitialSyncDone) return;
  if (!state.shiftDateKey) {
    state.shiftDateKey = getBusinessDateKey();
    state.shiftFullDate = getFormattedBusinessDateAz();
  }
}

function openConfirmResetModal() {
  if (currentUserRole !== "admin") return;
  confirmResetModal.classList.add("open");
  confirmResetModal.setAttribute("aria-hidden", "false");
}

function closeConfirmResetModal() {
  confirmResetModal.classList.remove("open");
  confirmResetModal.setAttribute("aria-hidden", "true");
}

function executeEndDayAndReset() {
  if (currentUserRole !== "admin") return;

  const archive = loadArchive();
  const record = buildShiftArchiveRecord(state, `${state.shiftFullDate || getFormattedBusinessDateAz()} (${getShortDateTimeAz()})`);
  archive.push(record);
  saveArchive(archive);

  state = createDefaultState();
  saveState();

  closeConfirmResetModal();
  closeReportModal();
  setAppMode("kafe");
  showToast("Növbə bağlandı! Hesabat arxivə göndərildi və kassa sıfırlandı.");
}

// XÜSUSİ ARXİV MODALI (Detallı Tarixçə və '✕' Silmə İmkanı — Yalnız Admin)
function openArchiveModal() {
  if (currentUserRole !== "admin") return;
  renderArchiveModal();
  archiveModal.classList.add("open");
  archiveModal.setAttribute("aria-hidden", "false");
}

function closeArchiveModal() {
  if (!archiveModal) return;
  archiveModal.classList.remove("open");
  archiveModal.setAttribute("aria-hidden", "true");
}

function deleteArchiveDayById(archiveId) {
  if (currentUserRole !== "admin") return;
  const archive = loadArchive();
  const target = archive.find((item) => item.id === archiveId);
  if (!target) return;

  const updated = archive.filter((item) => item.id !== archiveId);
  saveArchive(updated);
  renderArchiveModal();
}

function renderArchiveModal() {
  if (!archiveDaysListEl) return;
  const archive = loadArchive();
  archiveDaysListEl.innerHTML = "";

  if (archive.length === 0) {
    archiveDaysListEl.innerHTML = `<div class="mini-empty">Arxivdə hələ heç bir keçmiş iş günü yoxdur.</div>`;
    return;
  }

  archive.slice().reverse().forEach((entry) => {
    const cafeGross = round2(entry.cafeGross != null ? entry.cafeGross : entry.grossSales);
    const cafeExp = round2(entry.cafeExp != null ? entry.cafeExp : entry.totalExpenses);
    const cafeNet = round2(entry.cafeNet != null ? entry.cafeNet : (cafeGross - cafeExp));

    const winGross = round2(entry.winGross || 0);
    const winExp = round2(entry.winExp || 0);
    const winNet = round2(entry.winNet != null ? entry.winNet : (winGross - winExp));

    const totalGross = round2(entry.grossSales != null ? entry.grossSales : (cafeGross + winGross));
    const totalExp = round2(entry.totalExpenses != null ? entry.totalExpenses : (cafeExp + winExp));
    const grandNet = round2(entry.netCash != null ? entry.netCash : (cafeNet + winNet));

    // Satılan Kafe məhsulları siyahısı
    const soldCafeRows = [];
    const soldMap = entry.soldItemsSummary || {};
    MENU_CATALOG.forEach((item) => {
      const qty = Number(soldMap[item.id]) || 0;
      if (qty > 0) {
        soldCafeRows.push(`
          <div class="mini-row">
            <span>${item.name}: <strong>${qty} ${item.unit}</strong></span>
            <strong>${formatMoney(qty * item.price)}</strong>
          </div>
        `);
      }
    });
    (entry.soldCustomItems || []).forEach((custom) => {
      soldCafeRows.push(`
        <div class="mini-row">
          <span>${custom.name}: <strong>${custom.qty} ədəd</strong></span>
          <strong>${formatMoney(custom.total)}</strong>
        </div>
      `);
    });

    // Satılan Pəncərə məhsulları siyahısı
    const soldWinRows = [];
    const winSoldMap = entry.windowSoldSummary || {};
    WINDOW_MENU_CATALOG.forEach((item) => {
      const qty = Number(winSoldMap[item.id]) || 0;
      if (qty > 0) {
        soldWinRows.push(`
          <div class="mini-row">
            <span>${item.name}: <strong>${qty} ədəd</strong></span>
            <strong>${formatMoney(qty * item.price)}</strong>
          </div>
        `);
      }
    });

    // Ofisiant statistikası
    const wStats = computeWaiterStats(entry.closedBills || []);
    const waiterRowsHtml = ["waiter1", "waiter2", "admin"]
      .filter((k) => k !== "admin" || wStats[k].count > 0)
      .map((k) => `
        <div class="mini-row">
          <span>${wStats[k].label} (${wStats[k].count} masa):</span>
          <strong>${formatMoney(wStats[k].total)}</strong>
        </div>
      `)
      .join("");

    // Xərclər siyahısı
    const expRowsHtml = (entry.expenses || [])
      .map((e) => `
        <div class="mini-row">
          <span><span class="expense-badge ${e.type === "pencere" ? "pencere" : "kafe"}">${e.type === "pencere" ? "Pəncərə" : "Kafe"}</span> ${e.title}</span>
          <strong style="color:#dc2626">${formatNegativeMoney(e.amount)}</strong>
        </div>
      `)
      .join("");

    const card = document.createElement("div");
    card.className = "archive-day-card";
    card.innerHTML = `
      <div class="archive-day-top">
        <div class="archive-day-info">
          <span class="archive-day-date">${entry.fullDate || entry.date}</span>
          <span class="archive-day-sub">Satış: ${formatMoney(totalGross)} &nbsp;|&nbsp; Xərc: ${formatNegativeMoney(totalExp)}</span>
        </div>
        <div class="archive-day-right">
          <strong class="archive-day-net">${formatMoney(grandNet)}</strong>
          <button type="button" class="delete-record-btn" title="Bu günü arxivdən sil">✕</button>
        </div>
      </div>

      <div class="archive-day-details">
        <div class="archive-summary-grid">
          <div class="archive-mini-box">
            <span class="archive-mini-label">🍽 Kafe Xalis</span>
            <strong class="archive-mini-val">${formatMoney(cafeNet)}</strong>
            <span class="archive-day-sub">Satış: ${formatMoney(cafeGross)} | Xərc: -${cafeExp.toFixed(2)} ₼</span>
          </div>
          <div class="archive-mini-box">
            <span class="archive-mini-label">🪟 Pəncərə Xalis</span>
            <strong class="archive-mini-val">${formatMoney(winNet)}</strong>
            <span class="archive-day-sub">Satış: ${formatMoney(winGross)} | Xərc: -${winExp.toFixed(2)} ₼</span>
          </div>
        </div>

        <div class="archive-detail-block">
          <h5 class="mini-title">Ofisiantlar Üzrə Dövriyyə</h5>
          <div class="mini-list">${waiterRowsHtml || `<div class="mini-empty">Məlumat yoxdur</div>`}</div>
        </div>

        <div class="archive-detail-block">
          <h5 class="mini-title">🍽 Satılan Kafe Məhsulları (Ədəd / Pors)</h5>
          <div class="mini-list">${soldCafeRows.length > 0 ? soldCafeRows.join("") : `<div class="mini-empty">Kafe satışı olmayıb</div>`}</div>
        </div>

        <div class="archive-detail-block">
          <h5 class="mini-title">🪟 Satılan Pəncərə Məhsulları (Dürmək və Peraşki)</h5>
          <div class="mini-list">${soldWinRows.length > 0 ? soldWinRows.join("") : `<div class="mini-empty">Pəncərə satışı olmayıb</div>`}</div>
        </div>

        ${expRowsHtml ? `
          <div class="archive-detail-block">
            <h5 class="mini-title">Həmin Günün Xərcləri</h5>
            <div class="mini-list">${expRowsHtml}</div>
          </div>
        ` : ""}
      </div>
    `;

    const topBar = card.querySelector(".archive-day-top");
    const deleteBtn = card.querySelector(".delete-record-btn");

    topBar.addEventListener("click", (e) => {
      if (e.target === deleteBtn || deleteBtn.contains(e.target)) return;
      card.classList.toggle("expanded");
    });

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteArchiveDayById(entry.id);
    });

    archiveDaysListEl.appendChild(card);
  });
}

// ============================================================================
// 7. QARANLIQ REJİM (DARK MODE — #121212) VƏ ROL YETKİLƏRİ
// ============================================================================
function getSavedTheme() {
  return localStorage.getItem(THEME_STORAGE_KEY) === "dark" ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.classList.toggle("dark-mode", isDark);
  localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");

  const iconChar = isDark ? "☀️" : "🌙";
  if (themeToggleIcon) themeToggleIcon.textContent = iconChar;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute("content", isDark ? "#0a0e17" : "#0f172a");
  }
}

function toggleTheme() {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(nextTheme);
}

function applyRolePermissions() {
  const isAdmin = currentUserRole === "admin";
  document.body.classList.toggle("role-waiter", !isAdmin);
  document.body.classList.toggle("role-admin", isAdmin);

  if (!isAdmin) {
    closeReportModal();
    closeConfirmResetModal();
    closeArchiveModal();
  }

  refreshAllActiveViews();
}

// ============================================================================
// 7B. BİR DƏFƏLİK ROL SEÇİMİ + KOD TƏSDİQİ (2008 / 1111 / 2222) VƏ 3 TOXUNUŞLA DƏYİŞMƏ
// ============================================================================
let pendingRoleChoice = null;

function getRoleAuthTitle(role) {
  if (role === "admin") return "👑 Müdir (Admin)";
  if (role === "waiter2") return "☕ 2-ci Ofisiant";
  return "☕ 1-ci Ofisiant";
}

function ensureRoleSelectorModal() {
  let modalEl = document.getElementById("roleSelectorModal");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "roleSelectorModal";
    modalEl.className = "modal-overlay confirm-overlay role-auth-overlay";
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="role-selector-dialog">
        <div id="roleStepSelect" class="role-step-view">
          <h3 class="role-selector-title">Bu cihazın rolu:</h3>
          <div class="role-selector-options">
            <button type="button" class="role-select-option-btn role-opt-admin" data-role="admin">
              <span>👑</span>
              <span>Müdir (Admin)</span>
            </button>
            <button type="button" class="role-select-option-btn role-opt-waiter" data-role="waiter1">
              <span>☕</span>
              <span>1-ci Ofisiant</span>
            </button>
            <button type="button" class="role-select-option-btn role-opt-waiter" data-role="waiter2">
              <span>☕</span>
              <span>2-ci Ofisiant</span>
            </button>
          </div>
          <button type="button" id="roleCancelSwitchBtn" class="role-cancel-switch-btn" style="display: none;">Ləğv et</button>
        </div>

        <div id="roleStepPin" class="role-step-view" style="display: none;">
          <h3 id="rolePinTitle" class="role-selector-title">👑 Müdir (Admin)</h3>
          <p class="role-pin-subtitle">Hesabı təsdiqləmək üçün 4 rəqəmli kodu daxil edin:</p>
          <form id="rolePinForm" class="role-pin-form">
            <input
              type="password"
              id="rolePinInput"
              class="role-pin-input"
              inputmode="numeric"
              pattern="[0-9]*"
              maxlength="4"
              placeholder="••••"
              autocomplete="off"
              required
            >
            <div id="rolePinError" class="role-pin-error" style="display: none;">Kod yanlışdır!</div>
            <div class="role-pin-actions">
              <button type="button" id="rolePinBackBtn" class="confirm-btn btn-cancel">‹ Geri</button>
              <button type="submit" class="confirm-btn btn-confirm-role">Təsdiqlə</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(modalEl);
  }

  if (!modalEl.dataset.bound) {
    modalEl.querySelectorAll(".role-select-option-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const chosenRole = btn.getAttribute("data-role") || "waiter1";
        showRolePinStep(chosenRole);
      });
    });

    const backBtn = document.getElementById("rolePinBackBtn");
    if (backBtn) {
      backBtn.addEventListener("click", () => {
        showRoleSelectionStep();
      });
    }

    const cancelSwitchBtn = document.getElementById("roleCancelSwitchBtn");
    if (cancelSwitchBtn) {
      cancelSwitchBtn.addEventListener("click", () => {
        if (hasVerifiedRoleOnDevice) {
          closeRoleSelectorModal();
        }
      });
    }

    const pinInput = document.getElementById("rolePinInput");
    const pinForm = document.getElementById("rolePinForm");
    const pinError = document.getElementById("rolePinError");

    if (pinInput) {
      pinInput.addEventListener("input", () => {
        if (pinError) pinError.style.display = "none";
        const val = pinInput.value.trim();
        if (val.length === 4 && pendingRoleChoice) {
          const expectedPin = ROLE_PINS[pendingRoleChoice];
          if (val === expectedPin) {
            selectAndSaveDeviceRole(pendingRoleChoice);
          }
        }
      });
    }

    if (pinForm) {
      pinForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!pendingRoleChoice || !pinInput) return;
        const val = pinInput.value.trim();
        const expectedPin = ROLE_PINS[pendingRoleChoice];
        if (val === expectedPin) {
          selectAndSaveDeviceRole(pendingRoleChoice);
        } else {
          if (pinError) pinError.style.display = "block";
          pinInput.value = "";
          pinInput.focus();
        }
      });
    }

    modalEl.dataset.bound = "true";
  }

  return modalEl;
}

function showRoleSelectionStep() {
  pendingRoleChoice = null;
  const stepSelect = document.getElementById("roleStepSelect");
  const stepPin = document.getElementById("roleStepPin");
  const cancelSwitchBtn = document.getElementById("roleCancelSwitchBtn");
  if (stepSelect) stepSelect.style.display = "block";
  if (stepPin) stepPin.style.display = "none";
  if (cancelSwitchBtn) {
    cancelSwitchBtn.style.display = hasVerifiedRoleOnDevice ? "block" : "none";
  }
}

function showRolePinStep(role) {
  pendingRoleChoice = (role === "admin" || role === "waiter1" || role === "waiter2") ? role : "waiter1";
  const stepSelect = document.getElementById("roleStepSelect");
  const stepPin = document.getElementById("roleStepPin");
  const pinTitle = document.getElementById("rolePinTitle");
  const pinInput = document.getElementById("rolePinInput");
  const pinError = document.getElementById("rolePinError");

  if (stepSelect) stepSelect.style.display = "none";
  if (stepPin) stepPin.style.display = "block";
  if (pinTitle) pinTitle.textContent = getRoleAuthTitle(pendingRoleChoice);
  if (pinError) pinError.style.display = "none";
  if (pinInput) {
    pinInput.value = "";
    setTimeout(() => pinInput.focus(), 60);
  }
}

function openRoleSelectorModal(preselectedRole = null) {
  const modalEl = ensureRoleSelectorModal();
  if (preselectedRole === "admin" || preselectedRole === "waiter1" || preselectedRole === "waiter2") {
    showRolePinStep(preselectedRole);
  } else {
    showRoleSelectionStep();
  }
  modalEl.classList.add("open");
  modalEl.setAttribute("aria-hidden", "false");
}

function closeRoleSelectorModal() {
  const modalEl = document.getElementById("roleSelectorModal");
  if (!modalEl) return;
  modalEl.classList.remove("open");
  modalEl.setAttribute("aria-hidden", "true");
}

function selectAndSaveDeviceRole(role) {
  const validRole = (role === "admin" || role === "waiter1" || role === "waiter2") ? role : "waiter1";
  localStorage.setItem(ROLE_STORAGE_KEY, validRole);
  localStorage.setItem(ROLE_VERIFIED_KEY, validRole);
  currentUserRole = validRole;
  needsInitialRoleSelection = false;
  hasVerifiedRoleOnDevice = true;
  if (window.location.search) {
    try {
      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (err) {
      // Ignore history error
    }
  }
  closeRoleSelectorModal();
  applyRolePermissions();
}

// Yuxarıdakı "BabaBala" loqosuna ard-arda 3 dəfə toxunduqda (triple tap) rol seçim və kod pəncərəsini aç
let logoTapCount = 0;
let logoLastTapTime = 0;

function initBrandLogoTripleTap() {
  const logoEl = document.getElementById("brandLogoTitle") || document.querySelector(".brand-title");
  if (!logoEl) return;

  logoEl.style.cursor = "pointer";
  logoEl.addEventListener("click", () => {
    const now = Date.now();
    if (now - logoLastTapTime < 550) {
      logoTapCount += 1;
    } else {
      logoTapCount = 1;
    }
    logoLastTapTime = now;

    if (logoTapCount >= 3) {
      logoTapCount = 0;
      openRoleSelectorModal();
    }
  });
}

// ============================================================================
// 8. KRİTİK YAZMA QORUMASI (isInitialSyncDone) VƏ FIREBASE CANLI SİNXRONİZASİYA
//    Canlı növbə: "bababala_data/live_shift"
//    Ayrı Arxiv:  "bababala_data/shift_archive"
// ============================================================================
let firestoreDocRef = null;
let firestoreArchiveDocRef = null;
let unsubscribeFirestore = null;
let unsubscribeArchiveFirestore = null;

let isInitialSyncDone = false;
let isInitialArchiveSyncDone = false;
let isApplyingRemoteSync = false;
let lastPushedSyncId = null;
let lastPushedArchiveSyncId = null;

const localBroadcast = typeof BroadcastChannel !== "undefined"
  ? new BroadcastChannel("bababala_pos_live_channel")
  : null;

if (localBroadcast) {
  localBroadcast.onmessage = (event) => {
    if (!event.data || event.data.clientId === CLIENT_ID) return;
    if (event.data.type === "archive_sync" && Array.isArray(event.data.archive)) {
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(event.data.archive));
      if (archiveModal && archiveModal.classList.contains("open")) {
        renderArchiveModal();
      }
    } else {
      applyIncomingRemoteSync(event.data);
    }
  };
}

window.addEventListener("storage", (event) => {
  if (event.key === STORAGE_KEY && event.newValue) {
    try {
      state = normalizeStateObject(JSON.parse(event.newValue));
      refreshAllActiveViews();
    } catch (err) {
      // Ignore parse error
    }
  } else if (event.key === ARCHIVE_STORAGE_KEY && event.newValue) {
    if (archiveModal && archiveModal.classList.contains("open")) {
      renderArchiveModal();
    }
  } else if (event.key === THEME_STORAGE_KEY && event.newValue) {
    applyTheme(event.newValue);
  }
});

function updateSyncStatusUI(mode, labelText) {
  if (!syncStatusBtn) return;
  const classes = ["sync-local", "sync-live", "sync-error"];
  classes.forEach((c) => syncStatusBtn.classList.remove(c));
  syncStatusBtn.classList.add(mode);

  if (syncStatusText) {
    syncStatusText.textContent = labelText;
  }
}

function refreshAllActiveViews() {
  updateHeaderSales();
  if (tableScreen.classList.contains("active") && activeTableId) {
    renderTableScreen();
  } else if (currentAppMode === "pencere") {
    renderWindowScreen();
  } else {
    renderMainScreen();
  }

  if (reportModal.classList.contains("open") && currentUserRole === "admin") {
    renderReportModal();
  }
  if (expenseModal.classList.contains("open") && currentUserRole === "admin") {
    renderExpensesList();
  }
  if (archiveModal && archiveModal.classList.contains("open") && currentUserRole === "admin") {
    renderArchiveModal();
  }
}

function applyIncomingRemoteSync(payload) {
  if (!payload || typeof payload !== "object") return;
  if (payload.syncId && payload.syncId === lastPushedSyncId) return;

  isApplyingRemoteSync = true;
  try {
    if (payload.state) {
      state = normalizeStateObject(payload.state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    refreshAllActiveViews();
  } finally {
    isApplyingRemoteSync = false;
  }
}

function pushLiveSync() {
  // KRİTİK QORUMA: Firebase-dən ilk canlı snapshot gələnə qədər heç nə yazma!
  if (!isInitialSyncDone || isApplyingRemoteSync) return;

  const nowTs = Date.now();
  const syncId = `${CLIENT_ID}_${nowTs}_${Math.random().toString(36).slice(2, 6)}`;
  lastPushedSyncId = syncId;

  const payload = {
    syncId,
    clientId: CLIENT_ID,
    updatedAt: nowTs,
    state: JSON.parse(JSON.stringify(state))
  };

  if (localBroadcast) {
    try {
      localBroadcast.postMessage(payload);
    } catch (err) {
      // Ignore broadcast error
    }
  }

  if (firestoreDocRef) {
    firestoreDocRef
      .set(payload)
      .then(() => {
        updateSyncStatusUI("sync-live", "🟢 Canlı");
      })
      .catch((err) => {
        console.error("Firestore live_shift yazma xətası:", err);
      });
  }
}

function pushArchiveSync(archiveList) {
  if (!isInitialArchiveSyncDone) return;

  const nowTs = Date.now();
  const syncId = `${CLIENT_ID}_arch_${nowTs}`;
  lastPushedArchiveSyncId = syncId;

  if (localBroadcast) {
    try {
      localBroadcast.postMessage({
        type: "archive_sync",
        clientId: CLIENT_ID,
        archive: archiveList
      });
    } catch (err) {
      // Ignore broadcast error
    }
  }

  if (firestoreArchiveDocRef) {
    firestoreArchiveDocRef
      .set({
        syncId,
        clientId: CLIENT_ID,
        updatedAt: nowTs,
        items: archiveList
      })
      .catch((err) => {
        console.error("Firestore shift_archive yazma xətası:", err);
      });
  }
}

function initFirebaseSync() {
  if (typeof firebase === "undefined" || typeof firebase.firestore !== "function") {
    console.error("Firebase SDK yüklənmədi. İnternet bağlantısını yoxlayın.");
    updateSyncStatusUI("sync-error", "🔴 Oflayn");
    return;
  }

  try {
    const fbApp = !firebase.apps.length
      ? firebase.initializeApp(FIREBASE_CONFIG)
      : firebase.app();

    const db = firebase.firestore(fbApp);

    // Oflayn məlumat davamlılığı (Offline Cache Persistence)
    db.enablePersistence({ synchronizeTabs: true }).catch((err) => {
      if (err.code !== "failed-precondition" && err.code !== "unimplemented") {
        console.error("Firestore Offline Cache xətası:", err);
      }
    });

    firestoreDocRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_DOC_ID);
    firestoreArchiveDocRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_ARCHIVE_DOC_ID);
    updateSyncStatusUI("sync-live", "🟢 Canlı");

    if (unsubscribeFirestore) unsubscribeFirestore();
    if (unsubscribeArchiveFirestore) unsubscribeArchiveFirestore();

    // 1. Canlı Növbə Dinləyicisi ("bababala_data/live_shift")
    unsubscribeFirestore = firestoreDocRef.onSnapshot(
      (docSnap) => {
        updateSyncStatusUI("sync-live", "🟢 Canlı");

        if (docSnap.exists) {
          const data = docSnap.data();
          // Eyni cihazın öz göndərdiyi əks-səda (echo) paketini təkrar öz üzərinə yazma
          const isOwnEcho = isInitialSyncDone && data && (data.clientId === CLIENT_ID || data.syncId === lastPushedSyncId);
          if (data && !isOwnEcho) {
            applyIncomingRemoteSync(data);
          }
          // Köhnə live_shift daxilində arxiv qalmışdısa və yeni shift_archive hələ boşdursa, onu miqrasiya et
          if (data && Array.isArray(data.archive) && data.archive.length > 0 && loadArchive().length === 0) {
            localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(data.archive));
          }
          isInitialSyncDone = true;
        } else if (!docSnap.metadata.fromCache) {
          // Bazada sənəd hələ yoxdursa, ilkin qoruma bayrağını açıb cari vəziyyəti bazaya yarat
          isInitialSyncDone = true;
          pushLiveSync();
        }
      },
      (err) => {
        console.error("Firestore live_shift onSnapshot xətası:", err);
        updateSyncStatusUI("sync-error", "🔴 Xəta");
      }
    );

    // 2. Ayrı Arxiv Dinləyicisi ("bababala_data/shift_archive")
    unsubscribeArchiveFirestore = firestoreArchiveDocRef.onSnapshot(
      (docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();
          const isOwnArchiveEcho = isInitialArchiveSyncDone && data && (data.clientId === CLIENT_ID || data.syncId === lastPushedArchiveSyncId);
          if (data && Array.isArray(data.items) && !isOwnArchiveEcho) {
            localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(data.items));
            if (archiveModal && archiveModal.classList.contains("open")) {
              renderArchiveModal();
            }
          }
          isInitialArchiveSyncDone = true;
        } else if (!docSnap.metadata.fromCache) {
          isInitialArchiveSyncDone = true;
          const existingLocalArchive = loadArchive();
          if (existingLocalArchive.length > 0) {
            pushArchiveSync(existingLocalArchive);
          }
        }
      },
      (err) => {
        console.error("Firestore shift_archive onSnapshot xətası:", err);
      }
    );
  } catch (err) {
    console.error("Firebase qoşulma xətası:", err);
    updateSyncStatusUI("sync-error", "🔴 Xəta");
  }
}

window.addEventListener("online", () => {
  updateSyncStatusUI("sync-live", "🟢 Canlı");
});

// Hər 60 saniyədən bir avto-bağlanma vaxtını (05:00) yoxla
setInterval(checkAndExecuteAutoEndDay, 60000);

// ============================================================================
// HADİSƏ DİNLƏYİCİLƏRİ (EVENT LISTENERS)
// ============================================================================
modeCafeBtn.addEventListener("click", () => setAppMode("kafe"));
modeWindowBtn.addEventListener("click", () => setAppMode("pencere"));

windowClearCartBtn.addEventListener("click", clearWindowCart);
windowCheckoutBtn.addEventListener("click", checkoutWindowCart);

backToMainBtn.addEventListener("click", closeTableScreen);
closeBillBtn.addEventListener("click", closeActiveTableBill);

openExpenseBtn.addEventListener("click", openExpenseModal);
closeExpenseModalBtn.addEventListener("click", closeExpenseModal);
expenseModal.addEventListener("click", (e) => {
  if (e.target === expenseModal) closeExpenseModal();
});

closeCustomItemModalBtn.addEventListener("click", closeCustomItemModal);
customItemModal.addEventListener("click", (e) => {
  if (e.target === customItemModal) closeCustomItemModal();
});

openReportBtn.addEventListener("click", openReportModal);
closeReportModalBtn.addEventListener("click", closeReportModal);
reportModal.addEventListener("click", (e) => {
  if (e.target === reportModal) closeReportModal();
});

if (openArchiveHeaderBtn) {
  openArchiveHeaderBtn.addEventListener("click", openArchiveModal);
}
if (openArchiveFromReportBtn) {
  openArchiveFromReportBtn.addEventListener("click", openArchiveModal);
}
if (closeArchiveModalBtn) {
  closeArchiveModalBtn.addEventListener("click", closeArchiveModal);
}
if (archiveModal) {
  archiveModal.addEventListener("click", (e) => {
    if (e.target === archiveModal) closeArchiveModal();
  });
}

endDayResetBtn.addEventListener("click", openConfirmResetModal);
cancelResetBtn.addEventListener("click", closeConfirmResetModal);
confirmResetBtn.addEventListener("click", executeEndDayAndReset);
confirmResetModal.addEventListener("click", (e) => {
  if (e.target === confirmResetModal) closeConfirmResetModal();
});

// Qaranlıq Rejim Düyməsi
if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

// ============================================================================
// İLK YÜKLƏMƏ (BAŞLANĞIC)
// ============================================================================
applyTheme(getSavedTheme());
ensureRoleSelectorModal();
initBrandLogoTripleTap();
applyRolePermissions();
setAppMode("kafe");
if (needsInitialRoleSelection) {
  openRoleSelectorModal(preselectedRoleForAuth);
}
initFirebaseSync();
