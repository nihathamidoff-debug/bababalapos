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
// Canlı və təhlükəsiz tranzaksiya / cədvəl sənədləri:
const FIRESTORE_TABLES_DOC_ID = "live_tables_v2";
const FIRESTORE_TX_DOC_ID = "live_transactions_v2";
const FIRESTORE_ARCHIVE_DOC_ID = "shift_archive";

const STORAGE_KEY = "bababala_pos_state_v1";
const ARCHIVE_STORAGE_KEY = "bababala_pos_archive_v1";
const AUDIT_LOG_STORAGE_KEY = "bababala_pos_audit_log_v1";
const THEME_STORAGE_KEY = "bababala_theme_v1";
const ROLE_STORAGE_KEY = "bababala_user_role";
const ROLE_VERIFIED_KEY = "bababala_role_verified_v1";

let activeTableCommittedSnapshot = null; // Masaya daxil olanda əvvəlki təsdiqlənmiş vəziyyət (Draft vs Committed)
let currentVoucherShift = null; // Çap edilən / baxılan cari rəsmi çek
let currentAuditFilter = "all"; // Əməliyyat jurnalının cari filtri

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
  { id: "corek", name: "Çörək", price: 0.50, category: "quru", unit: "ədəd" },
  { id: "peraski_kafe", name: "Peraşki", price: 0.60, category: "quru", unit: "ədəd" },

  // --- İSTİ İÇKİLƏR ---
  { id: "sade_cay", name: "Sadə Çay", price: 2.00, category: "isti_ickiler", unit: "ədəd" },
  { id: "sade_cay_jek", name: "Sadə Çay (1 ₼)", price: 1.00, category: "isti_ickiler", unit: "ədəd" },
  { id: "qend_limon", name: "Qənd & Limon", price: 1.00, category: "isti_ickiler", unit: "pors" },
  { id: "cay_plitka_sokolad", name: "Çay & Plitka Şokolad", price: 4.00, category: "isti_ickiler", unit: "pors" },
  { id: "kofe", name: "Kofe", price: 1.00, category: "isti_ickiler", unit: "ədəd" },

  // --- SOYUQ İÇKİLƏR ---
  { id: "su_qazsiz_05", name: "Su 0.5l", price: 0.50, category: "soyuq_ickiler", unit: "ədəd" },
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

// Silinməz və Anlıq Əməliyyat Jurnalı (Audit Log / History)
function loadAuditLogs() {
  try {
    const raw = localStorage.getItem(AUDIT_LOG_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function saveAuditLogs(logs) {
  try {
    if (Array.isArray(logs)) {
      localStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
    }
  } catch (err) {}
}

function getTableOrderItemsSummaryString(table) {
  if (!table) return "";
  const parts = [];
  Object.entries(table.orders || {}).forEach(([itemId, qty]) => {
    if (qty > 0) {
      const item = MENU_CATALOG.find((m) => m.id === itemId);
      parts.push(`${item ? item.name : itemId} × ${qty}`);
    }
  });
  (table.customOrders || []).forEach((c) => {
    parts.push(`${c.name} × ${c.qty || 1}`);
  });
  return parts.join(", ");
}

function logAuditEvent({
  type = "other",
  typeLabel = "Əməliyyat",
  tableName = "Masa",
  tableId = "",
  amount = 0,
  details = "",
  actorRole = currentUserRole
}) {
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const logItem = {
    id: `log_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    dateTime: getShortDateTimeAz(now),
    date: getBusinessDateKey(now),
    time: timeStr,
    type,
    typeLabel,
    tableId,
    tableName,
    amount: round2(amount),
    details: details || "—",
    actorRole,
    actorName: getRoleDisplayName(actorRole)
  };

  if (typeof state === "object" && state) {
    if (!Array.isArray(state.auditLogs)) state.auditLogs = [];
    state.auditLogs.unshift(logItem);
    saveAuditLogs(state.auditLogs);
  }

  pushGranularLiveSync({ newAuditLogs: [logItem] });

  if (typeof auditLogModal !== "undefined" && auditLogModal && auditLogModal.classList.contains("open")) {
    renderAuditLogModal();
  }
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
    closedBills: [], // Daimi Tranzaksiya Logu (Həm Kafe, həm də Pəncərə çekləri — Source of Truth)
    atmTransfers: [], // Kart ➔ Nağd (ATM Nağdlaşdırma) qeydləri
    auditLogs: loadAuditLogs(), // Silinməz Əməliyyat Jurnalı
    // Pəncərə Satışı:
    windowSalesTotal: 0,
    windowSoldSummary: {},
    windowCart: {}
  };
}

// Hər bir tranzaksiya obyektini standart formata salmaq
function normalizeTransactionRecord(b) {
  if (!b || typeof b !== "object") return null;
  const isPencere = b.source === "pencere" || b.tableId === "pencere";
  const rawRole = b.closedByRole || b.closedBy || "waiter1";
  let roleKey = "waiter1";
  if (rawRole === "admin" || rawRole === "Admin" || rawRole === "Admin (Müdir)") roleKey = "admin";
  else if (rawRole === "waiter2" || rawRole === "2-ci Ofisiant") roleKey = "waiter2";

  const items = Array.isArray(b.items)
    ? b.items
        .map((it) => {
          const qty = Number(it.qty) || 0;
          const price = round2(it.price != null ? it.price : (qty > 0 ? (Number(it.total) || 0) / qty : 0));
          return {
            itemId: it.itemId || null,
            customRecordId: it.customRecordId || null,
            name: it.name || "Məhsul",
            qty,
            price,
            unit: it.unit || "ədəd",
            total: round2(qty * price),
            isCustom: Boolean(it.isCustom)
          };
        })
        .filter((it) => it.qty > 0)
    : [];

  const computedTotal = items.length > 0
    ? round2(items.reduce((sum, it) => sum + it.total, 0))
    : round2(b.total != null ? b.total : b.totalAmount);

  return {
    id: b.id || `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    time: b.time || "00:00",
    date: b.date || getBusinessDateKey(),
    dateTimeLabel: b.dateTimeLabel || b.date || getShortDateTimeAz(),
    source: isPencere ? "pencere" : "kafe",
    tableId: isPencere ? "pencere" : (b.tableId || "masa_1"),
    tableName: isPencere ? "Pəncərə" : (b.tableName || "Masa 1"),
    total: computedTotal,
    totalAmount: computedTotal,
    paymentMethod: b.paymentMethod === "card" ? "card" : "cash",
    items,
    closedBy: getRoleDisplayName(roleKey),
    closedByRole: roleKey,
    deleted: Boolean(b.deleted),
    updatedAt: Number(b.updatedAt) || Date.now()
  };
}

// DAİMİ TRANZAKSİYA LOGUNDAN (SOURCE OF TRUTH) BÜTÜN KASSA VƏ İNVENTAR RƏQƏMLƏRİNİ HESABLAMAQ
function recalculateShiftTotalsFromLedger(targetState = state) {
  if (!targetState || typeof targetState !== "object") return;

  const activeBills = (Array.isArray(targetState.closedBills) ? targetState.closedBills : [])
    .map(normalizeTransactionRecord)
    .filter((b) => b && !b.deleted && b.total > 0);

  targetState.closedBills = activeBills;

  let cafeTotal = 0;
  let winTotal = 0;
  const cafeSoldMap = {};
  const cafeCustomList = [];
  const winSoldMap = {};

  activeBills.forEach((tx) => {
    if (tx.source === "pencere" || tx.tableId === "pencere") {
      winTotal = round2(winTotal + tx.total);
      (tx.items || []).forEach((it) => {
        const winCatalogItem = it.itemId
          ? WINDOW_MENU_CATALOG.find((m) => m.id === it.itemId)
          : WINDOW_MENU_CATALOG.find((m) => m.name === it.name);
        if (winCatalogItem) {
          winSoldMap[winCatalogItem.id] = (Number(winSoldMap[winCatalogItem.id]) || 0) + (Number(it.qty) || 0);
        }
      });
    } else {
      cafeTotal = round2(cafeTotal + tx.total);
      (tx.items || []).forEach((it) => {
        if (it.isCustom) {
          cafeCustomList.push({
            id: it.customRecordId || `sc_${tx.id}_${it.name}`,
            name: it.name,
            qty: Number(it.qty) || 1,
            total: round2(it.total)
          });
        } else {
          const catalogItem = it.itemId
            ? MENU_CATALOG.find((m) => m.id === it.itemId)
            : MENU_CATALOG.find((m) => m.name === it.name);
          if (catalogItem) {
            cafeSoldMap[catalogItem.id] = (Number(cafeSoldMap[catalogItem.id]) || 0) + (Number(it.qty) || 0);
          }
        }
      });
    }
  });

  targetState.completedSalesTotal = round2(cafeTotal);
  targetState.soldItemsSummary = cafeSoldMap;
  targetState.soldCustomItems = cafeCustomList;
  targetState.windowSalesTotal = round2(winTotal);
  targetState.windowSoldSummary = winSoldMap;
}

// İstənilən mənbədən (localStorage və ya Firebase) gələn State obyektini normallaşdırmaq
function normalizeStateObject(parsed) {
  if (!parsed || typeof parsed !== "object") return createDefaultState();

  const tables = INITIAL_TABLES.map((initTable) => {
    let savedTable = null;
    if (Array.isArray(parsed.tables)) {
      savedTable = parsed.tables.find((t) => t && t.id === initTable.id);
    } else if (parsed.tables && typeof parsed.tables === "object") {
      savedTable = parsed.tables[initTable.id] || null;
    }
    return {
      id: initTable.id,
      name: initTable.name,
      group: initTable.group,
      orders: savedTable ? sanitizeOrdersMap(savedTable.orders) : {},
      customOrders: savedTable && Array.isArray(savedTable.customOrders)
        ? savedTable.customOrders
        : [],
      lastWaiter: savedTable && savedTable.lastWaiter ? savedTable.lastWaiter : null,
      updatedAt: savedTable && savedTable.updatedAt ? Number(savedTable.updatedAt) : 0
    };
  });

  const normalizedState = {
    shiftDateKey: parsed.shiftDateKey || getBusinessDateKey(),
    shiftFullDate: parsed.shiftFullDate || getFormattedBusinessDateAz(),
    tables,
    completedSalesTotal: 0,
    soldItemsSummary: {},
    soldCustomItems: [],
    expenses: Array.isArray(parsed.expenses)
      ? parsed.expenses
          .filter((e) => e && !e.deleted)
          .map((e) => ({
            ...e,
            type: e.type === "pencere" ? "pencere" : "kafe",
            addedBy: e.addedBy || "waiter1"
          }))
      : [],
    closedBills: Array.isArray(parsed.closedBills)
      ? parsed.closedBills.map(normalizeTransactionRecord).filter((b) => b && !b.deleted)
      : [],
    atmTransfers: Array.isArray(parsed.atmTransfers)
      ? parsed.atmTransfers
          .filter((a) => a && !a.deleted && Number(a.amount) > 0)
          .map((a) => ({
            id: a.id || `atm_${Date.now()}`,
            amount: round2(a.amount),
            time: a.time || "00:00",
            date: a.date || getBusinessDateKey(),
            note: a.note || "ATM Nağdlaşdırma",
            addedBy: a.addedBy || "admin"
          }))
      : [],
    auditLogs: Array.isArray(parsed.auditLogs) && parsed.auditLogs.length > 0
      ? parsed.auditLogs
      : loadAuditLogs(),
    windowSalesTotal: 0,
    windowSoldSummary: {},
    windowCart: (parsed.windowCart && typeof parsed.windowCart === "object")
      ? parsed.windowCart
      : {}
  };

  recalculateShiftTotalsFromLedger(normalizedState);
  return normalizedState;
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

// Keçmiş Günlərin Arxivini oxumaq (Soft Delete qeydləri gizlədilir)
function loadArchive() {
  try {
    const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((item) => item && !item.isDeleted && !item.deleted) : [];
  } catch (err) {
    return [];
  }
}

// Lokal yaddaşı yeniləmək (Kassa rəqəmləri həmişə Tranzaksiya Logundan hesablanır)
function saveStateLocalOnly() {
  recalculateShiftTotalsFromLedger(state);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveState(options = {}) {
  saveStateLocalOnly();
  pushGranularLiveSync(options);
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
const windowPayCashBtn = document.getElementById("windowPayCashBtn");
const windowPayCardBtn = document.getElementById("windowPayCardBtn");
const windowClearCartBtn = document.getElementById("windowClearCartBtn");
const windowCheckoutBtn = document.getElementById("windowCheckoutBtn");
const windowMenuGridEl = document.getElementById("windowMenuGrid");

const backToMainBtn = document.getElementById("backToMainBtn");
const openTransferTableBtn = document.getElementById("openTransferTableBtn");
const menuSearchInput = document.getElementById("menuSearchInput");
const clearMenuSearchBtn = document.getElementById("clearMenuSearchBtn");
const activeTableNameEl = document.getElementById("activeTableName");
const activeTableBadgeEl = document.getElementById("activeTableBadge");
const orderItemCountEl = document.getElementById("orderItemCount");
const orderListEl = document.getElementById("orderList");
const pinnedQuickGridEl = document.getElementById("pinnedQuickGrid");
const menuSectionTitleEl = document.getElementById("menuSectionTitle");
const menuSectionHintEl = document.getElementById("menuSectionHint");
const quickMenuGridEl = document.getElementById("quickMenuGrid");
const activeTableTotalEl = document.getElementById("activeTableTotal");
const saveOrderBtn = document.getElementById("saveOrderBtn");
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
const exportReportCsvBtn = document.getElementById("exportReportCsvBtn");
const reportPerTableStatsListEl = document.getElementById("reportPerTableStatsList");

const reportGrandNetCashEl = document.getElementById("reportGrandNetCash");
const reportGrandBreakdownEl = document.getElementById("reportGrandBreakdown");
const reportCashOnHandEl = document.getElementById("reportCashOnHand");
const reportCardRemainingEl = document.getElementById("reportCardRemaining");
const reportGrandTotalBoxEl = document.getElementById("reportGrandTotalBox");
const openAtmTransferBtn = document.getElementById("openAtmTransferBtn");
const reportAtmSectionEl = document.getElementById("reportAtmSection");
const reportAtmTransfersListEl = document.getElementById("reportAtmTransfersList");
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
const reportWindowTransactionsListEl = document.getElementById("reportWindowTransactionsList");
const reportWindowSoldItemsEl = document.getElementById("reportWindowSoldItems");
const reportWindowExpensesListEl = document.getElementById("reportWindowExpensesList");

const openArchiveFromReportBtn = document.getElementById("openArchiveFromReportBtn");
const endDayResetBtn = document.getElementById("endDayResetBtn");

// Xüsusi Arxiv Modalı Elementləri
const archiveModal = document.getElementById("archiveModal");
const closeArchiveModalBtn = document.getElementById("closeArchiveModalBtn");
const archiveDaysListEl = document.getElementById("archiveDaysList");

// Təsdiq (Confirm) Modalı Elementləri (Köhnə referanslar təhlükəsizlik üçün)
const confirmResetModal = document.getElementById("confirmResetModal") || document.getElementById("dangerConfirmModal");
const cancelResetBtn = document.getElementById("cancelResetBtn") || document.getElementById("dangerCancelBtn");
const confirmResetBtn = document.getElementById("confirmResetBtn") || document.getElementById("dangerExecuteBtn");

// Ödəniş Metodu (Nağd / Kart) Modalı Elementləri
const paymentMethodModal = document.getElementById("paymentMethodModal");
const payModalTableTitleEl = document.getElementById("payModalTableTitle");
const payModalAmountBadgeEl = document.getElementById("payModalAmountBadge");
const modalPayCashBtn = document.getElementById("modalPayCashBtn");
const modalPayCardBtn = document.getElementById("modalPayCardBtn");
const cancelPaymentMethodBtn = document.getElementById("cancelPaymentMethodBtn");
const confirmCloseBillWithMethodBtn = document.getElementById("confirmCloseBillWithMethodBtn");

// ATM Nağdlaşdırma Modalı Elementləri
const atmTransferModal = document.getElementById("atmTransferModal");
const closeAtmModalBtn = document.getElementById("closeAtmModalBtn");
const atmTransferForm = document.getElementById("atmTransferForm");
const atmModalCardBalanceEl = document.getElementById("atmModalCardBalance");
const atmAmountInput = document.getElementById("atmAmountInput");
const atmFillMaxBtn = document.getElementById("atmFillMaxBtn");

// Bağlanmış Çekin Redaktəsi Modalı Elementləri
const editBillModal = document.getElementById("editBillModal");
const editBillModalTitleEl = document.getElementById("editBillModalTitle");
const editBillModalSubEl = document.getElementById("editBillModalSub");
const closeEditBillModalBtn = document.getElementById("closeEditBillModalBtn");
const editBillCashBtn = document.getElementById("editBillCashBtn");
const editBillCardBtn = document.getElementById("editBillCardBtn");
const editBillItemsListEl = document.getElementById("editBillItemsList");
const editBillAddMenuSelect = document.getElementById("editBillAddMenuSelect");
const editBillAddItemBtn = document.getElementById("editBillAddItemBtn");
const editBillDiffBadgeEl = document.getElementById("editBillDiffBadge");
const editBillNewTotalEl = document.getElementById("editBillNewTotal");
const saveEditedBillBtn = document.getElementById("saveEditedBillBtn");

// Masanı Başqa Masaya Köçür Modalı Elementləri
const transferTableModal = document.getElementById("transferTableModal");
const transferModalTitleEl = document.getElementById("transferModalTitle");
const transferModalSubEl = document.getElementById("transferModalSub");
const closeTransferModalBtn = document.getElementById("closeTransferModalBtn");
const transferMergeConfirmBox = document.getElementById("transferMergeConfirmBox");
const transferMergePromptText = document.getElementById("transferMergePromptText");
const cancelMergeTransferBtn = document.getElementById("cancelMergeTransferBtn");
const confirmMergeTransferBtn = document.getElementById("confirmMergeTransferBtn");
const transferTablesGridEl = document.getElementById("transferTablesGrid");

// Xərc Redaktə / Keçmiş Günə Xərc Modalı Elementləri
const expenseEditModal = document.getElementById("expenseEditModal");
const closeExpenseEditModalBtn = document.getElementById("closeExpenseEditModalBtn");
const expenseEditForm = document.getElementById("expenseEditForm");
const expenseEditModalTitleEl = document.getElementById("expenseEditModalTitle");
const editExpenseTitleInput = document.getElementById("editExpenseTitleInput");
const editExpenseAmountInput = document.getElementById("editExpenseAmountInput");
const saveExpenseEditBtn = document.getElementById("saveExpenseEditBtn");

const toastContainer = document.getElementById("toastContainer");

// Əməliyyat Jurnalı (Tarixçə) Elementləri
const openAuditLogBtn = document.getElementById("openAuditLogBtn");
const auditLogModal = document.getElementById("auditLogModal");
const closeAuditLogBtn = document.getElementById("closeAuditLogBtn");
const auditSearchInput = document.getElementById("auditSearchInput");
const auditFilterChips = document.querySelectorAll(".audit-filter-chips .chip-btn");
const auditLogListEl = document.getElementById("auditLogList");

// Sürətli Axtarış Açılan Nəticələr Elementi
const menuSearchResultsDropdown = document.getElementById("menuSearchResultsDropdown");

// Rəsmi Çek / PDF / WhatsApp Elementləri
const printReportVoucherBtn = document.getElementById("printReportVoucherBtn");
const receiptVoucherModal = document.getElementById("receiptVoucherModal");
const receiptVoucherModalTitle = document.getElementById("receiptVoucherModalTitle");
const receiptVoucherDateSub = document.getElementById("receiptVoucherDateSub");
const closeReceiptVoucherBtn = document.getElementById("closeReceiptVoucherBtn");
const printReceiptDocBtn = document.getElementById("printReceiptDocBtn");
const copyWhatsAppVoucherBtn = document.getElementById("copyWhatsAppVoucherBtn");
const receiptVoucherPaper = document.getElementById("receiptVoucherPaper");

// Günün Statistikası Başlıq və Vizual Faiz Zolağı Elementləri
const reportGrandTotalAmount = document.getElementById("reportGrandTotalAmount");
const splitProgressCash = document.getElementById("splitProgressCash");
const splitProgressCard = document.getElementById("splitProgressCard");
const splitLabelCash = document.getElementById("splitLabelCash");
const splitLabelCard = document.getElementById("splitLabelCard");
const quickAtmTransferBtn = document.getElementById("quickAtmTransferBtn");

// 2 Mərhələli Təhlükəsizlik Kilidi ('SİL') Elementləri
const dangerConfirmModal = document.getElementById("dangerConfirmModal");
const dangerConfirmTitle = document.getElementById("dangerConfirmTitle");
const dangerConfirmText = document.getElementById("dangerConfirmText");
const dangerConfirmInput = document.getElementById("dangerConfirmInput");
const dangerCancelBtn = document.getElementById("dangerCancelBtn");
const dangerExecuteBtn = document.getElementById("dangerExecuteBtn");

// Sadə Kartdan Nağda Keçir Modalı Elementləri
const quickAtmModal = document.getElementById("quickAtmModal");
const quickAtmInput = document.getElementById("quickAtmInput");
const cancelQuickAtmBtn = document.getElementById("cancelQuickAtmBtn");
const confirmQuickAtmBtn = document.getElementById("confirmQuickAtmBtn");

// Hesabat Accordion Elementləri
const accWaiterCard = document.getElementById("accWaiterCard");
const accWaiterHeader = document.getElementById("accWaiterHeader");
const accWaiterContent = document.getElementById("accWaiterContent");
const accWaiterBadge = document.getElementById("accWaiterBadge");

const accTableStatsCard = document.getElementById("accTableStatsCard");
const accTableStatsHeader = document.getElementById("accTableStatsHeader");
const accTableStatsContent = document.getElementById("accTableStatsContent");
const accTableStatsBadge = document.getElementById("accTableStatsBadge");

const accSoldItemsCard = document.getElementById("accSoldItemsCard");
const accSoldItemsHeader = document.getElementById("accSoldItemsHeader");
const accSoldItemsContent = document.getElementById("accSoldItemsContent");
const accSoldItemsBadge = document.getElementById("accSoldItemsBadge");
const reportAllSoldItemsList = document.getElementById("reportAllSoldItemsList");

const accExpensesCard = document.getElementById("accExpensesCard");
const accExpensesHeader = document.getElementById("accExpensesHeader");
const accExpensesContent = document.getElementById("accExpensesContent");
const accExpensesBadge = document.getElementById("accExpensesBadge");

let editingExpenseContext = null; // { expenseId, archiveDayId, isNew }
let selectedWindowPayMethod = "cash"; // Pəncərə satışı üçün default: 💵 Nağd
let selectedTablePayMethod = "cash"; // Masa bağlama üçün default: 💵 Nağd

// Xərc Hesablamaları (Kafe və Pəncərə Ayrımı)
function getCafeExpenses(targetState = state) {
  return round2(
    (targetState.expenses || [])
      .filter((e) => !e.deleted && e.type !== "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

function getWindowExpenses(targetState = state) {
  return round2(
    (targetState.expenses || [])
      .filter((e) => !e.deleted && e.type === "pencere")
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

function getTotalExpenses(targetState = state) {
  return round2(
    (targetState.expenses || [])
      .filter((e) => !e.deleted)
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
  );
}

// NAĞD, KART VƏ ATM NAĞDLAŞDIRMA HESABLAMASI (Source of Truth)
function getCashAndCardBreakdown(targetState = state) {
  const bills = Array.isArray(targetState.closedBills)
    ? targetState.closedBills.filter((b) => b && !b.deleted)
    : [];

  let grossCashSales = 0;
  let grossCardSales = 0;
  let cafeCashSales = 0;
  let cafeCardSales = 0;
  let winCashSales = 0;
  let winCardSales = 0;

  bills.forEach((b) => {
    const amt = round2(b.total != null ? b.total : b.totalAmount);
    const isCard = b.paymentMethod === "card";
    const isPencere = b.source === "pencere" || b.tableId === "pencere";

    if (isCard) {
      grossCardSales = round2(grossCardSales + amt);
      if (isPencere) winCardSales = round2(winCardSales + amt);
      else cafeCardSales = round2(cafeCardSales + amt);
    } else {
      grossCashSales = round2(grossCashSales + amt);
      if (isPencere) winCashSales = round2(winCashSales + amt);
      else cafeCashSales = round2(cafeCashSales + amt);
    }
  });

  const atmWithdrawnTotal = round2(
    (targetState.atmTransfers || [])
      .filter((a) => a && !a.deleted)
      .reduce((sum, a) => sum + (Number(a.amount) || 0), 0)
  );

  const totalExpenses = getTotalExpenses(targetState);
  const cafeExpenses = getCafeExpenses(targetState);
  const winExpenses = getWindowExpenses(targetState);

  // ATM-dən çıxarılan pul Kart balansından çıxılır və Əldə Olan Nağd kassaya əlavə olunur
  const cashOnHand = round2(grossCashSales + atmWithdrawnTotal - totalExpenses);
  const cardRemaining = round2(grossCardSales - atmWithdrawnTotal);
  const grandTotalNet = round2(cashOnHand + cardRemaining);

  return {
    grossCashSales,
    grossCardSales,
    cafeCashSales,
    cafeCardSales,
    winCashSales,
    winCardSales,
    atmWithdrawnTotal,
    totalExpenses,
    cafeExpenses,
    winExpenses,
    cashOnHand,
    cardRemaining,
    grandTotalNet
  };
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
  recalculateShiftTotalsFromLedger(state);
  currentDateEl.textContent = getFormattedDateAz();
  const breakdown = getCashAndCardBreakdown(state);

  if (currentAppMode === "kafe") {
    const grossSales = round2(state.completedSalesTotal);
    const kafeExp = breakdown.cafeExpenses;
    const kafeNet = round2(grossSales - kafeExp);

    if (headerSalesLabelEl) headerSalesLabelEl.textContent = "Kafe Xalis Kassa";
    headerTotalSalesEl.textContent = formatMoney(kafeNet);
    headerSubInfoEl.textContent = `💵 Nağd: ${formatMoney(breakdown.cashOnHand)} | 💳 Kart: ${formatMoney(breakdown.cardRemaining)}`;
  } else {
    const winSales = round2(state.windowSalesTotal);
    const winExp = breakdown.winExpenses;
    const winNet = round2(winSales - winExp);

    if (headerSalesLabelEl) headerSalesLabelEl.textContent = "Pəncərə Xalis Kassa";
    headerTotalSalesEl.textContent = formatMoney(winNet);
    headerSubInfoEl.textContent = `Satış: ${formatMoney(winSales)} (💵 ${formatMoney(breakdown.winCashSales)} / 💳 ${formatMoney(breakdown.winCardSales)})`;
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
function setWindowPaymentMethod(method) {
  selectedWindowPayMethod = method === "card" ? "card" : "cash";
  if (windowPayCashBtn) windowPayCashBtn.classList.toggle("active", selectedWindowPayMethod === "cash");
  if (windowPayCardBtn) windowPayCardBtn.classList.toggle("active", selectedWindowPayMethod === "card");
}

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
  saveState({ syncWindowCart: true });
  renderWindowScreen();
}

function clearWindowCart() {
  state.windowCart = {};
  saveState({ syncWindowCart: true });
  renderWindowScreen();
}

function checkoutWindowCart() {
  const { totalAmount } = getWindowCartSummary();
  if (totalAmount <= 0) return;

  const billItems = [];
  for (const item of WINDOW_MENU_CATALOG) {
    const qty = Number(state.windowCart[item.id]) || 0;
    if (qty > 0) {
      billItems.push({
        itemId: item.id,
        name: item.name,
        qty,
        price: item.price,
        unit: item.unit,
        total: round2(qty * item.price),
        isCustom: false
      });
    }
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  const closedByRoleKey = (currentUserRole === "waiter1" || currentUserRole === "waiter2") ? currentUserRole : "admin";

  const txRecord = normalizeTransactionRecord({
    id: `tx_win_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    time: timeStr,
    date: getBusinessDateKey(now),
    dateTimeLabel: getShortDateTimeAz(now),
    source: "pencere",
    tableId: "pencere",
    tableName: "Pəncərə",
    total: round2(totalAmount),
    totalAmount: round2(totalAmount),
    paymentMethod: selectedWindowPayMethod,
    items: billItems,
    closedBy: getRoleDisplayName(closedByRoleKey),
    closedByRole: closedByRoleKey,
    updatedAt: Date.now()
  });

  state.closedBills.push(txRecord);
  state.windowCart = {};
  setWindowPaymentMethod("cash"); // Növbəti müştəri üçün default Nağd-a qaytar

  saveState({ newTransactions: [txRecord], syncWindowCart: true });

  logAuditEvent({
    type: "bill",
    typeLabel: `Pəncərə Satışı (${selectedWindowPayMethod === "card" ? "Kart" : "Nağd"})`,
    tableName: "Pəncərə",
    tableId: "pencere",
    amount: round2(totalAmount),
    details: billItems.map((it) => `${it.name} × ${it.qty}`).join(", "),
    actorRole: closedByRoleKey
  });

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

// EKRAN 2-ni açmaq (Məhsul seçimi lokal DRAFT olaraq saxlanılır, yalnız təsdiq edildikdə dolur)
function openTableScreen(tableId) {
  activeTableId = tableId;
  const table = state.tables.find((t) => t.id === tableId);
  if (table) {
    activeTableCommittedSnapshot = {
      orders: { ...table.orders },
      customOrders: (table.customOrders || []).map((o) => ({ ...o }))
    };
  } else {
    activeTableCommittedSnapshot = null;
  }
  activeCategory = null; // Həmişə 2 sütunlu kvadrat kateqoriya görünüşü ilə açılır
  currentTeaPrice = 2.00;
  if (menuSearchInput) menuSearchInput.value = "";
  if (clearMenuSearchBtn) clearMenuSearchBtn.style.display = "none";
  if (menuSearchResultsDropdown) {
    menuSearchResultsDropdown.style.display = "none";
    menuSearchResultsDropdown.innerHTML = "";
  }
  mainScreen.classList.remove("active");
  tableScreen.classList.add("active");
  tableScreen.setAttribute("aria-hidden", "false");
  renderTableScreen();
}

// Masadakı sifarişin təsdiqlənməmiş qaralama (draft) olub-olmadığını yoxlamaq
function isTableOrderDraftDirty(table) {
  if (!activeTableCommittedSnapshot || !table) return false;
  const currentOrders = table.orders || {};
  const snapOrders = activeTableCommittedSnapshot.orders || {};
  const allOrderKeys = new Set([...Object.keys(currentOrders), ...Object.keys(snapOrders)]);
  for (const k of allOrderKeys) {
    if ((Number(currentOrders[k]) || 0) !== (Number(snapOrders[k]) || 0)) {
      return true;
    }
  }
  const currentCustom = table.customOrders || [];
  const snapCustom = activeTableCommittedSnapshot.customOrders || [];
  if (currentCustom.length !== snapCustom.length) return true;
  for (let i = 0; i < currentCustom.length; i++) {
    if (
      currentCustom[i].id !== snapCustom[i].id ||
      currentCustom[i].qty !== snapCustom[i].qty ||
      currentCustom[i].price !== snapCustom[i].price ||
      currentCustom[i].name !== snapCustom[i].name
    ) {
      return true;
    }
  }
  return false;
}

// Düymə Vəziyyətləri və Canlı Rəng Keçidi (Draft = Yaşıl Təsdiqlə / Committed = Yaşıl Hesabı Bağla)
function updateTableActionButtonsState(table) {
  if (!table || !saveOrderBtn || !closeBillBtn) return;
  const isDirty = isTableOrderDraftDirty(table);
  const { totalAmount, totalCount } = getTableSummary(table);

  if (isDirty) {
    // Masada təsdiqlənməmiş yeni məhsul (draft) olduqda:
    // Düymə "💾 SİFARİŞİ TƏSDİQLƏ" mətni ilə canlı YAŞIL olur; "💳 HESABI BAĞLA" passiv/boz qalır.
    saveOrderBtn.textContent = totalCount > 0
      ? `💾 SİFARİŞİ TƏSDİQLƏ (${totalCount} MƏHSUL)`
      : `💾 SİFARİŞİ TƏSDİQLƏ (MASAYA YAZ)`;
    saveOrderBtn.className = "save-order-btn btn-vibrant-green";
    saveOrderBtn.disabled = false;

    closeBillBtn.className = "close-bill-btn btn-neutral-muted";
    closeBillBtn.disabled = totalAmount <= 0;
  } else {
    // Təsdiqlənmiş vəziyyət:
    if (totalAmount > 0) {
      // Sifariş təsdiqlənib masaya yazıldıqdan sonra:
      // Sifariş düyməsi "➕ Sifarişi əlavə et" olaraq passiv/boz rəngə keçir;
      // "💳 HESABI BAĞLA" düyməsi dərhal canlı YAŞIL rəngə boyanır!
      saveOrderBtn.textContent = "➕ Sifarişi əlavə et";
      saveOrderBtn.className = "save-order-btn btn-neutral-muted";
      saveOrderBtn.disabled = false;

      closeBillBtn.className = "close-bill-btn btn-vibrant-green";
      closeBillBtn.disabled = false;
    } else {
      // Tamamilə boş masa
      saveOrderBtn.textContent = "💾 SİFARİŞİ TƏSDİQLƏ (MASAYA YAZ)";
      saveOrderBtn.className = "save-order-btn btn-neutral-muted";
      saveOrderBtn.disabled = true;

      closeBillBtn.className = "close-bill-btn btn-neutral-muted";
      closeBillBtn.disabled = true;
    }
  }

  if (openTransferTableBtn) {
    openTransferTableBtn.disabled = totalAmount <= 0;
  }
}

// Sifarişi Masaya Yaz / Təsdiqlə (YALNIZ bu düyməyə basıldıqda masa statusu "dolu"ya çevrilir və Firebase-ə yazılır)
function confirmAndSaveActiveTableOrder() {
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;

  const isDirty = isTableOrderDraftDirty(table);
  if (!isDirty) {
    // Əgər artıq təsdiqlənibsə və "➕ Sifarişi əlavə et" basılıbsa, axtarışı fokusla
    if (menuSearchInput) menuSearchInput.focus();
    return;
  }

  const { totalCount, totalAmount } = getTableSummary(table);
  table.lastWaiter = currentUserRole;
  table.updatedAt = Date.now();

  saveState({ changedTableIds: [table.id] });

  logAuditEvent({
    type: "order",
    typeLabel: "Sifariş Masaya Yazıldı",
    tableName: table.name,
    tableId: table.id,
    amount: totalAmount,
    details: getTableOrderItemsSummaryString(table) || "Sifariş boşaldıldı",
    actorRole: currentUserRole
  });

  // Təsdiqlənmiş yeni vəziyyəti snapshot-a köçürürük
  activeTableCommittedSnapshot = {
    orders: { ...table.orders },
    customOrders: (table.customOrders || []).map((o) => ({ ...o }))
  };

  renderTableScreen();
  showToast(totalCount > 0 ? `💾 ${table.name} sifarişi yazıldı (${formatMoney(totalAmount)})` : `${table.name} saxlanıldı`);
}

// EKRAN 1-ə qayıtmaq (Təsdiqlənmədən çıxılarsa qaralama ləğv edilir, masanın əvvəlki vəziyyəti qorunur)
function closeTableScreen(forceDiscardDraft = true) {
  if (forceDiscardDraft && activeTableCommittedSnapshot && activeTableId) {
    const table = state.tables.find((t) => t.id === activeTableId);
    if (table && isTableOrderDraftDirty(table)) {
      table.orders = { ...activeTableCommittedSnapshot.orders };
      table.customOrders = (activeTableCommittedSnapshot.customOrders || []).map((o) => ({ ...o }));
    }
  }
  activeTableCommittedSnapshot = null;
  activeTableId = null;
  activeCategory = null;
  if (menuSearchInput) menuSearchInput.value = "";
  if (clearMenuSearchBtn) clearMenuSearchBtn.style.display = "none";
  if (menuSearchResultsDropdown) {
    menuSearchResultsDropdown.style.display = "none";
    menuSearchResultsDropdown.innerHTML = "";
  }
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

// TEZ SEÇİM BÖLMƏSİ (Ən çox sifariş olunan 8 əsas məhsul: Sadə Çay, Peraşki, Qənd/Limon, Çörək, Su, Pivə, Araq, Kofe)
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

  // YALNIZ 2 Digər Əsas Məhsul (Pivə NZS və Araq 100q — Sadə Çayla birlikdə cəmi 3 əsas məhsul)
  const topEssentialIds = [
    "suzme_pive_nzs_05",
    "suzme_araq_100q"
  ];

  topEssentialIds.forEach((id) => {
    const item = MENU_CATALOG.find((m) => m.id === id);
    if (item) {
      pinnedQuickGridEl.appendChild(createMenuItemButton(table, item));
    }
  });
}

// 2 Sütunlu Kvadrat Kateqoriya Kartları, Seçilmiş Kateqoriyanın Məhsulları və ya Axtarış Nəticələri
function renderQuickMenu(table) {
  quickMenuGridEl.innerHTML = "";

  const query = menuSearchInput ? menuSearchInput.value.trim().toLowerCase() : "";
  if (query) {
    menuSectionTitleEl.textContent = `Axtarış: "${query}"`;
    menuSectionHintEl.textContent = "Toxunaraq masaya əlavə et";

    const matched = MENU_CATALOG.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.price.toFixed(2).includes(query)
    );

    if (matched.length === 0) {
      quickMenuGridEl.innerHTML = `
        <div class="empty-order-box" style="grid-column: 1 / -1;">
          "${query}" adına uyğun məhsul tapılmadı.
        </div>
      `;
    } else {
      matched.forEach((item) => {
        quickMenuGridEl.appendChild(createMenuItemButton(table, item));
      });
    }
    return;
  }

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
  updateTableActionButtonsState(table);

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

  // Bu masada əvvəl bağlanmış hesabları yalnız Admin roluna göstər ('✏️ Redaktə' və '✕' silmə düyməsi ilə)
  const tableClosedBills = Array.isArray(state.closedBills)
    ? state.closedBills.filter((b) => !b.deleted && b.tableId === table.id)
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
      const waiterLabel = getRoleDisplayName(b.closedByRole || b.closedBy || "waiter1");
      const payTagClass = b.paymentMethod === "card" ? "tag-card" : "tag-cash";
      const payTagText = b.paymentMethod === "card" ? "💳 Kart" : "💵 Nağd";

      card.innerHTML = `
        <div class="closed-bill-header">
          <div>
            <span>Hesab #${tableClosedBills.length - idx}</span>
            <span class="waiter-tag-pill">${waiterLabel}</span>
            <span class="pay-method-tag ${payTagClass}">${payTagText}</span>
          </div>
          <div class="bill-right-actions">
            <span class="closed-bill-time">${b.time}</span>
            <strong class="closed-bill-amount">${formatMoney(b.totalAmount)}</strong>
            <button type="button" class="edit-record-btn" aria-label="Çeki redaktə et" title="Bu çeki redaktə et">✏️ Redaktə</button>
            <button type="button" class="delete-record-btn" aria-label="Çeki sil" title="Bu çeki sil">✕</button>
          </div>
        </div>
        <div class="closed-bill-items">${itemsText}</div>
      `;

      card.querySelector(".edit-record-btn").addEventListener("click", () => {
        openEditBillModal(b.id, null);
      });

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

// Masaya standart məhsul əlavə etmək və ya azaltmaq (DRAFT — yalnız təsdiq edildikdə bazaya yazılır)
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
  table.updatedAt = Date.now();
  renderTableScreen();
}

// Masadakı sərbəst sifarişin sayını dəyişmək (DRAFT — yalnız təsdiq edildikdə bazaya yazılır)
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
  table.updatedAt = Date.now();
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
  table.updatedAt = Date.now();
  closeCustomItemModal();
  renderTableScreen();
});

// ============================================================================
// 2A. MASA KÖÇÜRMƏ FUNKSİYASI ("🔄 Masanı Köçür" — Boş masaya köçür / Dolu masaya birləşdir)
// ============================================================================
let pendingMergeTargetTableId = null;

function openTransferTableModal() {
  const sourceTable = state.tables.find((t) => t.id === activeTableId);
  if (!sourceTable) return;
  const { totalAmount } = getTableSummary(sourceTable);
  if (totalAmount <= 0) return;

  pendingMergeTargetTableId = null;
  if (transferMergeConfirmBox) transferMergeConfirmBox.style.display = "none";
  if (transferModalTitleEl) {
    transferModalTitleEl.textContent = `🔄 ${sourceTable.name} — Masanı Köçür`;
  }
  if (transferModalSubEl) {
    transferModalSubEl.textContent = `Cari hesab (${formatMoney(totalAmount)}) hansı masaya köçürülsün?`;
  }

  renderTransferTableChoices(sourceTable);
  if (transferTableModal) {
    transferTableModal.classList.add("open");
    transferTableModal.setAttribute("aria-hidden", "false");
  }
}

function closeTransferTableModal() {
  pendingMergeTargetTableId = null;
  if (transferMergeConfirmBox) transferMergeConfirmBox.style.display = "none";
  if (transferTableModal) {
    transferTableModal.classList.remove("open");
    transferTableModal.setAttribute("aria-hidden", "true");
  }
}

function renderTransferTableChoices(sourceTable) {
  if (!transferTablesGridEl) return;
  transferTablesGridEl.innerHTML = "";

  const otherTables = state.tables.filter((t) => t.id !== sourceTable.id);
  otherTables.forEach((targetTable) => {
    const { totalAmount, totalCount } = getTableSummary(targetTable);
    const isBusy = totalAmount > 0;

    const card = document.createElement("button");
    card.type = "button";
    card.className = `table-card ${isBusy ? "is-busy" : "is-empty"}`;
    card.innerHTML = `
      <div class="table-card-top">
        <span class="table-card-name">${targetTable.name}</span>
        <span class="table-status-pill">${isBusy ? "Dolu" : "Boş"}</span>
      </div>
      <div class="table-card-bottom">
        <div>
          <span class="table-card-status-text">${isBusy ? formatMoney(totalAmount) : "Boş"}</span>
        </div>
        <span class="table-card-meta">${isBusy ? `${totalCount} sifariş` : "Dərhal köçür"}</span>
      </div>
    `;

    card.addEventListener("click", () => {
      handleSelectTransferTarget(sourceTable.id, targetTable.id);
    });

    transferTablesGridEl.appendChild(card);
  });
}

function handleSelectTransferTarget(sourceId, targetId) {
  const sourceTable = state.tables.find((t) => t.id === sourceId);
  const targetTable = state.tables.find((t) => t.id === targetId);
  if (!sourceTable || !targetTable) return;

  const targetSummary = getTableSummary(targetTable);
  if (targetSummary.totalAmount > 0) {
    // Hədəf masa DOLUDUR -> Xəbərdarlıq göstər: "Masa doludur. Hesablar birləşdirilsin?"
    pendingMergeTargetTableId = targetTable.id;
    if (transferMergePromptText) {
      transferMergePromptText.textContent = `${targetTable.name} doludur (${formatMoney(targetSummary.totalAmount)}). Hesablar birləşdirilsin?`;
    }
    if (transferMergeConfirmBox) {
      transferMergeConfirmBox.style.display = "block";
      transferMergeConfirmBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  } else {
    // Hədəf masa BOŞDUR -> Dərhal köçür
    executeTableTransfer(sourceTable.id, targetTable.id);
  }
}

function executeTableTransfer(sourceId, targetId) {
  const sourceTable = state.tables.find((t) => t.id === sourceId);
  const targetTable = state.tables.find((t) => t.id === targetId);
  if (!sourceTable || !targetTable || sourceId === targetId) return;

  // Standart menyu sifarişlərini hədəf masanın üstünə əlavə et (birləşdir)
  if (!targetTable.orders || typeof targetTable.orders !== "object") {
    targetTable.orders = {};
  }
  Object.entries(sourceTable.orders || {}).forEach(([itemId, qty]) => {
    const numQty = Number(qty) || 0;
    if (numQty > 0) {
      targetTable.orders[itemId] = (Number(targetTable.orders[itemId]) || 0) + numQty;
    }
  });

  // Sərbəst qiymətli sifarişləri hədəf masaya əlavə et
  if (!Array.isArray(targetTable.customOrders)) {
    targetTable.customOrders = [];
  }
  if (Array.isArray(sourceTable.customOrders) && sourceTable.customOrders.length > 0) {
    sourceTable.customOrders.forEach((custom) => {
      targetTable.customOrders.push({ ...custom });
    });
  }

  targetTable.lastWaiter = currentUserRole;
  targetTable.updatedAt = Date.now();

  // Köhnə masanı tamamilə boşalt
  sourceTable.orders = {};
  sourceTable.customOrders = [];
  sourceTable.lastWaiter = null;
  sourceTable.updatedAt = Date.now();

  const sourceName = sourceTable.name;
  const targetName = targetTable.name;
  const transferredSummary = getTableOrderItemsSummaryString(targetTable);

  saveState({ changedTableIds: [sourceTable.id, targetTable.id] });
  closeTransferTableModal();

  logAuditEvent({
    type: "transfer",
    typeLabel: "Masa Köçürüldü",
    tableName: `${sourceName} ➔ ${targetName}`,
    tableId: targetTable.id,
    amount: 0,
    details: transferredSummary,
    actorRole: currentUserRole
  });

  // Köçürüldükdən sonra birbaşa yeni masanın ekranını aç
  activeTableId = targetTable.id;
  renderTableScreen();
  showToast(`${sourceName} ➔ ${targetName} köçürüldü`);
}

// ============================================================================
// 2B. HESABI BAĞLAMA VƏ ÖDƏNİŞ METODU SEÇİMİ (💵 Nağd / 💳 Kart)
// ============================================================================
function setTablePaymentMethod(method) {
  selectedTablePayMethod = method === "card" ? "card" : "cash";
  if (modalPayCashBtn) modalPayCashBtn.classList.toggle("active", selectedTablePayMethod === "cash");
  if (modalPayCardBtn) modalPayCardBtn.classList.toggle("active", selectedTablePayMethod === "card");
}

function openPaymentMethodModal() {
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;
  const { totalAmount } = getTableSummary(table);
  if (totalAmount <= 0) return;

  setTablePaymentMethod("cash"); // Default: 💵 Nağd
  if (payModalTableTitleEl) {
    payModalTableTitleEl.textContent = `${table.name} — Hesabı Bağla`;
  }
  if (payModalAmountBadgeEl) {
    payModalAmountBadgeEl.textContent = formatMoney(totalAmount);
  }
  if (paymentMethodModal) {
    paymentMethodModal.classList.add("open");
    paymentMethodModal.setAttribute("aria-hidden", "false");
  }
}

function closePaymentMethodModal() {
  if (!paymentMethodModal) return;
  paymentMethodModal.classList.remove("open");
  paymentMethodModal.setAttribute("aria-hidden", "true");
}

function closeActiveTableBill() {
  openPaymentMethodModal();
}

function confirmCloseActiveTableBill() {
  const table = state.tables.find((t) => t.id === activeTableId);
  if (!table) return;

  const { totalAmount } = getTableSummary(table);
  if (totalAmount <= 0) return;

  const billItems = [];

  MENU_CATALOG.forEach((item) => {
    const qty = Number(table.orders[item.id]) || 0;
    if (qty > 0) {
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

  // Əməliyyatı edən rolu qeyd et ("Admin", "1-ci Ofisiant", "2-ci Ofisiant")
  const closedByRoleKey = (currentUserRole === "waiter1" || currentUserRole === "waiter2")
    ? currentUserRole
    : (table.lastWaiter || "admin");

  const txRecord = normalizeTransactionRecord({
    id: `tx_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    tableId: table.id,
    tableName: table.name,
    source: "kafe",
    time: timeStr,
    date: getBusinessDateKey(now),
    dateTimeLabel: getShortDateTimeAz(now),
    total: round2(totalAmount),
    totalAmount: round2(totalAmount),
    paymentMethod: selectedTablePayMethod,
    closedBy: getRoleDisplayName(closedByRoleKey),
    closedByRole: closedByRoleKey,
    items: billItems,
    updatedAt: Date.now()
  });

  state.closedBills.push(txRecord);

  table.orders = {};
  table.customOrders = [];
  table.lastWaiter = null;
  table.updatedAt = Date.now();

  saveState({
    changedTableIds: [table.id],
    newTransactions: [txRecord]
  });

  activeTableCommittedSnapshot = null;
  closePaymentMethodModal();
  closeTableScreen(false);

  logAuditEvent({
    type: "bill",
    typeLabel: `Hesab Bağlandı (${selectedTablePayMethod === "card" ? "Kart" : "Nağd"})`,
    tableName: table.name,
    tableId: table.id,
    amount: round2(totalAmount),
    details: billItems.map((it) => `${it.name} × ${it.qty}`).join(", "),
    actorRole: closedByRoleKey
  });

  const payText = selectedTablePayMethod === "card" ? "💳 Kartla" : "💵 Nağd";
  showToast(`${table.name} hesabı bağlandı (${payText}: ${formatMoney(totalAmount)})`);
}

// ============================================================================
// 3. BAĞLANMIŞ ÇEKLƏRİN REDAKTƏ EDİLMƏSİ VƏ SİLİNMƏSİ (Yalnız Admin)
// ============================================================================
let editingBillContext = null; // { billId, archiveDayId, draftPaymentMethod, draftItems, originalTotal, source }

function openEditBillModal(billId, archiveDayId = null) {
  if (currentUserRole !== "admin") return;

  let targetBill = null;
  if (archiveDayId) {
    const archive = loadArchive();
    const dayEntry = archive.find((d) => d.id === archiveDayId);
    if (dayEntry && Array.isArray(dayEntry.closedBills)) {
      targetBill = dayEntry.closedBills.find((b) => b.id === billId);
    }
  } else {
    targetBill = (state.closedBills || []).find((b) => b.id === billId && !b.deleted);
  }

  if (!targetBill) return;

  const isPencere = targetBill.source === "pencere" || targetBill.tableId === "pencere";
  const clonedItems = (targetBill.items || []).map((it) => ({
    itemId: it.itemId || null,
    customRecordId: it.customRecordId || null,
    name: it.name,
    qty: Number(it.qty) || 1,
    price: round2(it.price != null ? it.price : ((Number(it.total) || 0) / (Number(it.qty) || 1))),
    unit: it.unit || "ədəd",
    total: round2(it.total),
    isCustom: Boolean(it.isCustom)
  }));

  editingBillContext = {
    billId: targetBill.id,
    archiveDayId: archiveDayId || null,
    source: isPencere ? "pencere" : "kafe",
    tableName: targetBill.tableName || (isPencere ? "Pəncərə" : "Masa"),
    time: targetBill.time || "",
    originalTotal: round2(targetBill.totalAmount != null ? targetBill.totalAmount : targetBill.total),
    draftPaymentMethod: targetBill.paymentMethod === "card" ? "card" : "cash",
    draftItems: clonedItems
  };

  if (editBillModalTitleEl) {
    editBillModalTitleEl.textContent = `✏️ Çeki Redaktə Et (${editingBillContext.tableName})`;
  }
  if (editBillModalSubEl) {
    editBillModalSubEl.textContent = `Saat ${editingBillContext.time} • Əvvəlki cəm: ${formatMoney(editingBillContext.originalTotal)}`;
  }

  populateEditBillMenuSelect(editingBillContext.source);
  renderEditBillModalContent();

  if (editBillModal) {
    editBillModal.classList.add("open");
    editBillModal.setAttribute("aria-hidden", "false");
  }
}

function closeEditBillModal() {
  editingBillContext = null;
  if (editBillModal) {
    editBillModal.classList.remove("open");
    editBillModal.setAttribute("aria-hidden", "true");
  }
}

function populateEditBillMenuSelect(source) {
  if (!editBillAddMenuSelect) return;
  editBillAddMenuSelect.innerHTML = "";
  const catalog = source === "pencere" ? WINDOW_MENU_CATALOG : MENU_CATALOG;
  catalog.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = `${item.name} — ${formatMoney(item.price)}`;
    editBillAddMenuSelect.appendChild(opt);
  });
}

function renderEditBillModalContent() {
  if (!editingBillContext) return;

  if (editBillCashBtn) {
    editBillCashBtn.classList.toggle("active", editingBillContext.draftPaymentMethod === "cash");
  }
  if (editBillCardBtn) {
    editBillCardBtn.classList.toggle("active", editingBillContext.draftPaymentMethod === "card");
  }

  if (editBillItemsListEl) {
    editBillItemsListEl.innerHTML = "";
    if (editingBillContext.draftItems.length === 0) {
      editBillItemsListEl.innerHTML = `<div class="mini-empty">Çekdə heç bir məhsul qalmayıb. Menyudan əlavə edin.</div>`;
    } else {
      editingBillContext.draftItems.forEach((it, index) => {
        const lineTotal = round2(it.qty * it.price);
        it.total = lineTotal;

        const row = document.createElement("div");
        row.className = "order-row";
        row.innerHTML = `
          <div class="order-item-info">
            <div class="order-item-name">${it.name}</div>
            <div class="order-item-unit">${formatMoney(it.price)} / ${it.unit || "ədəd"}</div>
          </div>
          <div class="order-controls">
            <button type="button" class="qty-btn qty-minus" aria-label="Azalt">−</button>
            <span class="order-item-qty">${it.qty}</span>
            <button type="button" class="qty-btn qty-plus" aria-label="Artır">+</button>
          </div>
          <div class="order-item-total">${formatMoney(lineTotal)}</div>
        `;

        row.querySelector(".qty-minus").addEventListener("click", () => {
          editingBillContext.draftItems[index].qty -= 1;
          if (editingBillContext.draftItems[index].qty <= 0) {
            editingBillContext.draftItems.splice(index, 1);
          }
          renderEditBillModalContent();
        });

        row.querySelector(".qty-plus").addEventListener("click", () => {
          editingBillContext.draftItems[index].qty += 1;
          renderEditBillModalContent();
        });

        editBillItemsListEl.appendChild(row);
      });
    }
  }

  const newTotal = round2(
    editingBillContext.draftItems.reduce((sum, it) => sum + round2(it.qty * it.price), 0)
  );
  const diff = round2(newTotal - editingBillContext.originalTotal);

  if (editBillNewTotalEl) {
    editBillNewTotalEl.textContent = formatMoney(newTotal);
  }
  if (editBillDiffBadgeEl) {
    const sign = diff > 0 ? "+" : "";
    editBillDiffBadgeEl.textContent = `Fərq: ${sign}${diff.toFixed(2)} ₼`;
    editBillDiffBadgeEl.style.color = diff > 0 ? "#16a34a" : (diff < 0 ? "#dc2626" : "#64748b");
  }
  if (saveEditedBillBtn) {
    saveEditedBillBtn.disabled = editingBillContext.draftItems.length === 0;
  }
}

function addMenuItemToEditedBill() {
  if (!editingBillContext || !editBillAddMenuSelect) return;
  const selectedId = editBillAddMenuSelect.value;
  if (!selectedId) return;

  const catalog = editingBillContext.source === "pencere" ? WINDOW_MENU_CATALOG : MENU_CATALOG;
  const catalogItem = catalog.find((m) => m.id === selectedId);
  if (!catalogItem) return;

  const existing = editingBillContext.draftItems.find(
    (it) => !it.isCustom && (it.itemId === catalogItem.id || it.name === catalogItem.name)
  );

  if (existing) {
    existing.qty += 1;
    existing.total = round2(existing.qty * existing.price);
  } else {
    editingBillContext.draftItems.push({
      itemId: catalogItem.id,
      name: catalogItem.name,
      qty: 1,
      price: catalogItem.price,
      unit: catalogItem.unit || "ədəd",
      total: round2(catalogItem.price),
      isCustom: false
    });
  }

  renderEditBillModalContent();
}

function saveEditedBillChanges() {
  if (currentUserRole !== "admin" || !editingBillContext) return;
  if (editingBillContext.draftItems.length === 0) return;

  const updatedItems = editingBillContext.draftItems.map((it) => ({
    ...it,
    qty: Number(it.qty) || 1,
    price: round2(it.price),
    total: round2((Number(it.qty) || 1) * round2(it.price))
  }));
  const newTotal = round2(updatedItems.reduce((sum, it) => sum + it.total, 0));

  if (editingBillContext.archiveDayId) {
    // Arxivdəki çeki yenilə və həmin günün statistikasını yenidən hesabla
    const archive = loadArchive();
    const dayIdx = archive.findIndex((d) => d.id === editingBillContext.archiveDayId);
    if (dayIdx === -1) return;

    const dayEntry = archive[dayIdx];
    if (!Array.isArray(dayEntry.closedBills)) return;
    const billIdx = dayEntry.closedBills.findIndex((b) => b.id === editingBillContext.billId);
    if (billIdx === -1) return;

    const oldBill = dayEntry.closedBills[billIdx];
    const oldTotal = oldBill ? (oldBill.total || 0) : 0;
    const tableName = oldBill ? (oldBill.tableName || "Arxiv Çeki") : "Arxiv Çeki";

    dayEntry.closedBills[billIdx] = normalizeTransactionRecord({
      ...dayEntry.closedBills[billIdx],
      items: updatedItems,
      total: newTotal,
      totalAmount: newTotal,
      paymentMethod: editingBillContext.draftPaymentMethod,
      updatedAt: Date.now()
    });

    recalculateArchiveEntryTotals(dayEntry);
    saveArchive(archive);

    logAuditEvent({
      type: "BILL_EDITED",
      category: "kassa",
      actionTitle: "Arxiv Çeki Redaktə Edildi",
      tableName: tableName,
      amount: newTotal,
      details: `${tableName} redaktə edildi (${oldTotal} ₼ ➔ ${newTotal} ₼, ${editingBillContext.draftPaymentMethod === "card" ? "Kart" : "Nağd"}). Məhsullar: ${updatedItems.map((it) => `${it.qty}x ${it.name}`).join(", ")}`,
      items: updatedItems,
      role: currentUserRole
    });

    closeEditBillModal();
    renderArchiveModal();
    showToast("Arxivdəki çek yeniləndi!");
  } else {
    // Cari növbədəki çeki yenilə (kassa və inventar avtomatik yenidən hesablanır)
    const billIdx = (state.closedBills || []).findIndex((b) => b.id === editingBillContext.billId);
    if (billIdx === -1) return;

    const oldBill = state.closedBills[billIdx];
    const oldTotal = oldBill ? (oldBill.total || 0) : 0;
    const tableName = oldBill ? (oldBill.tableName || "Masa") : "Masa";

    const updatedTx = normalizeTransactionRecord({
      ...state.closedBills[billIdx],
      items: updatedItems,
      total: newTotal,
      totalAmount: newTotal,
      paymentMethod: editingBillContext.draftPaymentMethod,
      updatedAt: Date.now()
    });

    state.closedBills[billIdx] = updatedTx;
    saveState({ newTransactions: [updatedTx] });

    logAuditEvent({
      type: "BILL_EDITED",
      category: "kassa",
      actionTitle: "Çek Redaktə Edildi",
      tableName: tableName,
      amount: newTotal,
      details: `${tableName} redaktə edildi (${oldTotal} ₼ ➔ ${newTotal} ₼, ${editingBillContext.draftPaymentMethod === "card" ? "Kart" : "Nağd"}). Məhsullar: ${updatedItems.map((it) => `${it.qty}x ${it.name}`).join(", ")}`,
      items: updatedItems,
      role: currentUserRole
    });

    closeEditBillModal();
    refreshAllActiveViews();
    showToast("Çek redaktə olundu və kassa yeniləndi!");
  }
}

function deleteClosedBillById(billId) {
  if (currentUserRole !== "admin") return;
  const bill = (state.closedBills || []).find((b) => b.id === billId);
  if (!bill) return;

  openDangerConfirmModal({
    title: "Bağlanmış Çeki Sil",
    text: `"${bill.tableName || "Çek"}" üzrə <strong>${formatMoney(bill.total || 0)}</strong> məbləğindəki çek silinəcək. Bu əməliyyat geri qaytarılmır!<br><br>Təsdiq üçün aşağıdakı xanaya böyük hərflərlə <strong>SİL</strong> yazın:`,
    buttonText: "🗑 Bəli, Çeki Sil",
    onConfirm: () => doDeleteClosedBill(billId)
  });
}

function doDeleteClosedBill(billId) {
  const billIdx = (state.closedBills || []).findIndex((b) => b.id === billId);
  if (billIdx === -1) return;

  const deletedBill = state.closedBills[billIdx];
  deletedBill.deleted = true;
  deletedBill.isDeleted = true;
  deletedBill.deletedAt = Date.now();
  deletedBill.deletedBy = currentUserRole;

  state.closedBills.splice(billIdx, 1);
  saveState({ deletedTransactionIds: [billId] });

  logAuditEvent({
    type: "BILL_DELETED",
    category: "kassa",
    actionTitle: "Çek Silindi (Soft Delete)",
    tableName: deletedBill ? (deletedBill.tableName || "Çek") : "Çek",
    amount: deletedBill ? (deletedBill.total || 0) : 0,
    details: `${deletedBill ? (deletedBill.tableName || "Çek") : "Çek"} silindi: ${deletedBill ? deletedBill.total : 0} ₼ (${deletedBill && deletedBill.paymentMethod === "card" ? "Kart" : "Nağd"}). Məhsullar: ${deletedBill && Array.isArray(deletedBill.items) ? deletedBill.items.map((it) => `${it.qty || 1}x ${it.name}`).join(", ") : ""}`,
    items: deletedBill ? (deletedBill.items || []) : [],
    role: currentUserRole
  });

  refreshAllActiveViews();
  showToast("Çek uğurla silindi.");
}

// Pəncərə satışından test məhsul qeydini silmək (Yalnız Admin)
function deleteWindowSoldItem(itemId) {
  if (currentUserRole !== "admin") return;
  const item = WINDOW_MENU_CATALOG.find((m) => m.id === itemId);
  if (!item) return;

  const deletedTxIds = [];
  const modifiedTxs = [];

  state.closedBills = (state.closedBills || []).filter((tx) => {
    if (tx.source !== "pencere" && tx.tableId !== "pencere") return true;
    if (!Array.isArray(tx.items)) return true;

    const remainingItems = tx.items.filter((it) => it.itemId !== itemId && it.name !== item.name);
    if (remainingItems.length === tx.items.length) return true;

    if (remainingItems.length === 0) {
      deletedTxIds.push(tx.id);
      return false;
    }

    tx.items = remainingItems;
    const nextTotal = round2(remainingItems.reduce((s, it) => s + round2(it.total), 0));
    tx.total = nextTotal;
    tx.totalAmount = nextTotal;
    tx.updatedAt = Date.now();
    modifiedTxs.push(tx);
    return true;
  });

  saveState({
    newTransactions: modifiedTxs,
    deletedTransactionIds: deletedTxIds
  });
  refreshAllActiveViews();
}

// ============================================================================
// 3B. ATM ÇIXARIŞI (Kart ➔ Nağd Transferi — Yalnız Admin)
// ============================================================================
function openAtmTransferModal() {
  if (currentUserRole !== "admin") return;
  const breakdown = getCashAndCardBreakdown(state);
  if (atmModalCardBalanceEl) {
    atmModalCardBalanceEl.textContent = formatMoney(breakdown.cardRemaining);
  }
  if (atmAmountInput) {
    atmAmountInput.value = breakdown.cardRemaining > 0 ? breakdown.cardRemaining.toFixed(2) : "";
  }
  if (atmTransferModal) {
    atmTransferModal.classList.add("open");
    atmTransferModal.setAttribute("aria-hidden", "false");
    setTimeout(() => {
      if (atmAmountInput) atmAmountInput.focus();
    }, 60);
  }
}

function closeAtmTransferModal() {
  if (!atmTransferModal) return;
  atmTransferModal.classList.remove("open");
  atmTransferModal.setAttribute("aria-hidden", "true");
  if (atmTransferForm) atmTransferForm.reset();
}

if (atmFillMaxBtn) {
  atmFillMaxBtn.addEventListener("click", () => {
    const breakdown = getCashAndCardBreakdown(state);
    if (atmAmountInput && breakdown.cardRemaining > 0) {
      atmAmountInput.value = breakdown.cardRemaining.toFixed(2);
      atmAmountInput.focus();
    }
  });
}

if (atmTransferForm) {
  atmTransferForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (currentUserRole !== "admin") return;

    const amount = round2(parseFloat(atmAmountInput.value));
    if (!Number.isFinite(amount) || amount <= 0) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    if (!Array.isArray(state.atmTransfers)) {
      state.atmTransfers = [];
    }

    const atmRecord = {
      id: `atm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      amount,
      time: timeStr,
      date: getBusinessDateKey(now),
      note: "ATM Nağdlaşdırma",
      addedBy: currentUserRole,
      updatedAt: Date.now()
    };

    state.atmTransfers.push(atmRecord);
    saveState({ newAtmTransfers: [atmRecord] });

    logAuditEvent({
      type: "ATM_TRANSFER",
      category: "xerc",
      actionTitle: "ATM Nağdlaşdırma",
      tableName: "Kassa",
      amount: amount,
      details: `${formatMoney(amount)} məbləğində kart gəliri ATM vasitəsilə nağdlaşdırıldı və nağd kassaya əlavə edildi.`,
      items: [],
      role: currentUserRole
    });

    closeAtmTransferModal();
    refreshAllActiveViews();
    showToast(`${formatMoney(amount)} kartdan nağd kassaya köçürüldü!`);
  });
}

function deleteAtmTransferById(atmId) {
  if (currentUserRole !== "admin") return;
  const target = (state.atmTransfers || []).find((a) => a.id === atmId);
  state.atmTransfers = (state.atmTransfers || []).filter((a) => a.id !== atmId);
  saveState({ deletedAtmIds: [atmId] });

  if (target) {
    logAuditEvent({
      type: "ATM_DELETED",
      category: "xerc",
      actionTitle: "ATM Çıxarışı Silindi",
      tableName: "Kassa",
      amount: target.amount || 0,
      details: `${formatMoney(target.amount || 0)} məbləğində ATM çıxarışı ləğv edildi.`,
      items: [],
      role: currentUserRole
    });
  }

  refreshAllActiveViews();
}

// ============================================================================
// 4. XƏRC ƏLAVƏETMƏ SİSTEMİ VƏ YENİ TEZ SEÇİMLƏR (Ofisiant və Admin üçün aktiv)
// ============================================================================
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
  saveState({ deletedExpenseIds: [expenseId] });
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
      <div class="bill-right-actions">
        <strong style="color:#dc2626">${formatNegativeMoney(exp.amount)}</strong>
        <button type="button" class="edit-record-btn" title="Xərci redaktə et">✏️</button>
        <button type="button" class="delete-record-btn" aria-label="Xərci sil">✕</button>
      </div>
    `;

    row.querySelector(".edit-record-btn").addEventListener("click", () => {
      openExpenseEditModal({ isNew: false, expenseId: exp.id, archiveDayId: null });
    });

    row.querySelector(".delete-record-btn").addEventListener("click", () => {
      deleteExpenseById(exp.id);
    });

    expensesListEl.appendChild(row);
  });
}

// Xərc Redaktəsi və Keçmiş Günə Xərc Əlavə Edilməsi Modalı (Yalnız Admin)
function openExpenseEditModal({ isNew = false, expenseId = null, archiveDayId = null } = {}) {
  if (currentUserRole !== "admin") return;
  if (!expenseEditModal) return;

  editingExpenseContext = { isNew, expenseId, archiveDayId };

  if (isNew) {
    if (expenseEditModalTitleEl) {
      expenseEditModalTitleEl.textContent = archiveDayId ? "➕ Keçmiş Günə Xərc Əlavə Et" : "➕ Xərc Əlavə Et";
    }
    if (expenseEditForm.elements["editExpenseType"]) {
      expenseEditForm.elements["editExpenseType"].value = "kafe";
    }
    if (editExpenseTitleInput) editExpenseTitleInput.value = "";
    if (editExpenseAmountInput) editExpenseAmountInput.value = "";
  } else {
    if (expenseEditModalTitleEl) {
      expenseEditModalTitleEl.textContent = "✏️ Xərci Redaktə Et";
    }

    let targetExp = null;
    if (archiveDayId) {
      const archive = loadArchive();
      const dayEntry = archive.find((d) => d.id === archiveDayId);
      if (dayEntry && Array.isArray(dayEntry.expenses)) {
        targetExp = dayEntry.expenses.find((e) => e.id === expenseId);
      }
    } else {
      targetExp = (state.expenses || []).find((e) => e.id === expenseId);
    }

    if (!targetExp) {
      showToast("Xərc tapılmadı!");
      return;
    }

    if (expenseEditForm.elements["editExpenseType"]) {
      expenseEditForm.elements["editExpenseType"].value = targetExp.type === "pencere" ? "pencere" : "kafe";
    }
    if (editExpenseTitleInput) editExpenseTitleInput.value = targetExp.title || "";
    if (editExpenseAmountInput) editExpenseAmountInput.value = Number(targetExp.amount) || "";
  }

  expenseEditModal.classList.add("open");
  expenseEditModal.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    if (editExpenseTitleInput) editExpenseTitleInput.focus();
  }, 100);
}

function closeExpenseEditModal() {
  if (!expenseEditModal) return;
  expenseEditModal.classList.remove("open");
  expenseEditModal.setAttribute("aria-hidden", "true");
  editingExpenseContext = null;
}

function handleExpenseEditFormSubmit(e) {
  e.preventDefault();
  if (currentUserRole !== "admin" || !editingExpenseContext) return;

  const title = (editExpenseTitleInput ? editExpenseTitleInput.value : "").trim();
  const amount = round2(parseFloat(editExpenseAmountInput ? editExpenseAmountInput.value : 0));
  const typeRadio = expenseEditForm.elements["editExpenseType"];
  const expenseType = typeRadio && typeRadio.value === "pencere" ? "pencere" : "kafe";

  if (!title || amount <= 0) {
    showToast("Zəhmət olmasa xərcin adını və düzgün məbləğ daxil edin!");
    return;
  }

  const { isNew, expenseId, archiveDayId } = editingExpenseContext;

  if (archiveDayId) {
    const archive = loadArchive();
    const dayEntry = archive.find((d) => d.id === archiveDayId);
    if (!dayEntry) {
      showToast("Arxiv günü tapılmadı!");
      return;
    }

    if (!Array.isArray(dayEntry.expenses)) dayEntry.expenses = [];

    if (isNew) {
      const newExp = {
        id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title,
        amount,
        type: expenseType,
        addedBy: currentUserRole,
        time: getShortDateTimeAz(),
        updatedAt: Date.now()
      };
      dayEntry.expenses.push(newExp);
      showToast("Xərc keçmiş günün arxivinə əlavə edildi!");
    } else {
      const exp = dayEntry.expenses.find((e) => e.id === expenseId);
      if (!exp) {
        showToast("Xərc tapılmadı!");
        return;
      }
      exp.title = title;
      exp.amount = amount;
      exp.type = expenseType;
      exp.updatedAt = Date.now();
      showToast("Arxivdəki xərc uğurla yeniləndi!");
    }

    recalculateArchiveEntryTotals(dayEntry);
    saveArchive(archive);
    renderArchiveModal();
    closeExpenseEditModal();
  } else {
    if (isNew) {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const newExp = {
        id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        title,
        amount,
        type: expenseType,
        addedBy: currentUserRole,
        time: timeStr,
        updatedAt: Date.now()
      };
      state.expenses.push(newExp);
      saveState({ newExpenses: [newExp] });
      showToast("Xərc kassaya əlavə edildi!");
    } else {
      const exp = (state.expenses || []).find((e) => e.id === expenseId);
      if (!exp) {
        showToast("Xərc tapılmadı!");
        return;
      }
      exp.title = title;
      exp.amount = amount;
      exp.type = expenseType;
      exp.updatedAt = Date.now();
      saveState({ newExpenses: [exp] });
      showToast("Xərc uğurla yeniləndi!");
    }

    refreshAllActiveViews();
    if (reportModal && reportModal.classList.contains("open")) {
      renderReportModal();
    }
    if (expenseModal && expenseModal.classList.contains("open")) {
      renderExpensesList();
    }
    closeExpenseEditModal();
  }
}

function deleteArchiveExpenseById(archiveDayId, expenseId) {
  if (currentUserRole !== "admin") return;
  const archive = loadArchive();
  const dayEntry = archive.find((d) => d.id === archiveDayId);
  if (!dayEntry || !Array.isArray(dayEntry.expenses)) return;

  dayEntry.expenses = dayEntry.expenses.filter((e) => e.id !== expenseId);
  recalculateArchiveEntryTotals(dayEntry);
  saveArchive(archive);
  renderArchiveModal();
  showToast("Xərc arxivdən silindi!");
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

  const expRecord = {
    id: `exp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    title,
    amount,
    type: expenseType,
    addedBy: currentUserRole,
    time: timeStr,
    updatedAt: Date.now()
  };

  state.expenses.push(expRecord);

  saveState({ newExpenses: [expRecord] });

  logAuditEvent({
    type: "expense",
    typeLabel: `Xərc Yazıldı (${expenseType === "pencere" ? "Pəncərə" : "Kafe"})`,
    tableName: expenseType === "pencere" ? "Pəncərə" : "Kafe",
    tableId: expenseType,
    amount: round2(amount),
    details: `${title} (-${formatMoney(amount)})`,
    actorRole: currentUserRole
  });
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

// MASALAR ÜZRƏ HESABAT (15 Masa & Pəncərə Sifariş və Gəlir Statistikası)
function computePerTableStats(closedBillsArray = []) {
  const map = new Map();

  INITIAL_TABLES.forEach((t) => {
    map.set(t.id, {
      id: t.id,
      name: t.name,
      group: t.group,
      orderCount: 0,
      totalAmount: 0,
      itemsMap: {}
    });
  });

  map.set("pencere", {
    id: "pencere",
    name: "🪟 Pəncərə",
    group: "pencere",
    orderCount: 0,
    totalAmount: 0,
    itemsMap: {}
  });

  (closedBillsArray || []).forEach((b) => {
    if (!b || b.deleted) return;
    const isPencere = b.source === "pencere" || b.tableId === "pencere";
    const key = isPencere ? "pencere" : (b.tableId || "masa_1");
    let entry = map.get(key);
    if (!entry) {
      entry = {
        id: key,
        name: b.tableName || (isPencere ? "🪟 Pəncərə" : key),
        group: isPencere ? "pencere" : "kafe",
        orderCount: 0,
        totalAmount: 0,
        itemsMap: {}
      };
      map.set(key, entry);
    }
    entry.orderCount += 1;
    entry.totalAmount = round2(entry.totalAmount + (Number(b.totalAmount != null ? b.totalAmount : b.total) || 0));

    (b.items || []).forEach((it) => {
      const name = it.name || "Məhsul";
      const qty = Number(it.qty) || 1;
      entry.itemsMap[name] = (entry.itemsMap[name] || 0) + qty;
    });
  });

  return Array.from(map.values());
}

function renderPerTableStatsGrid(containerEl, closedBillsArray = []) {
  if (!containerEl) return;
  containerEl.innerHTML = "";
  const stats = computePerTableStats(closedBillsArray);

  stats.forEach((stat) => {
    const card = document.createElement("div");
    const hasSales = stat.orderCount > 0;
    card.className = `per-table-card ${hasSales ? "has-sales" : "is-empty"}`;

    const sortedItems = Object.entries(stat.itemsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => `${name} × ${count}`)
      .join(", ");

    const topItemsText = sortedItems || (hasSales ? "Məhsul təfərrüatı yoxdur" : "Sifariş olmayıb");

    card.innerHTML = `
      <div class="per-table-card-header">
        <strong>${stat.name}</strong>
        <span class="per-table-badge">${stat.orderCount} hesab</span>
      </div>
      <div class="per-table-amount">${formatMoney(stat.totalAmount)}</div>
      <div class="per-table-topitems">${topItemsText}</div>
    `;
    containerEl.appendChild(card);
  });
}

// EXCEL / CSV HESABATI YÜKLƏMƏ (UTF-8 BOM ilə Azərbaycan şriftləri və Nöqtəli Vergül)
function escapeCsvValue(val) {
  if (val == null) return '""';
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
}

function downloadShiftCsv(targetShift = state, filenamePrefix = "BabaBala_Hesabat") {
  if (currentUserRole !== "admin") return;
  if (!targetShift || typeof targetShift !== "object") return;

  recalculateShiftTotalsFromLedger(targetShift);
  const breakdown = getCashAndCardBreakdown(targetShift);

  const activeBills = (Array.isArray(targetShift.closedBills) ? targetShift.closedBills : [])
    .filter((b) => b && !b.deleted);
  const activeExpenses = (Array.isArray(targetShift.expenses) ? targetShift.expenses : [])
    .filter((e) => e && !e.deleted);
  const activeAtm = (Array.isArray(targetShift.atmTransfers) ? targetShift.atmTransfers : [])
    .filter((a) => a && !a.deleted);

  const dateLabel = targetShift.fullDate || targetShift.date || targetShift.shiftFullDate || getFormattedDateAz();
  const dateKey = targetShift.shiftDateKey || getBusinessDateKey();

  const rows = [];
  rows.push([escapeCsvValue("BABA BALA ÇAY EVİ VƏ DÖNƏR - GÜNLÜK KASSA HESABATI")].join(";"));
  rows.push([escapeCsvValue("Hesabat Günü:"), escapeCsvValue(dateLabel)].join(";"));
  rows.push([escapeCsvValue("İxrac Tarixi və Saatı:"), escapeCsvValue(getShortDateTimeAz())].join(";"));
  rows.push([]);

  // 1. BAĞLANMIŞ ÇEKLƏR VƏ TRANZAKSİYALAR
  rows.push([escapeCsvValue("=== 1. BAĞLANMIŞ ÇEKLƏR VƏ SATIŞLAR ===")].join(";"));
  rows.push([
    escapeCsvValue("Tarix və Saat"),
    escapeCsvValue("Masa / Yer"),
    escapeCsvValue("Satılan Məhsullar və Sayları"),
    escapeCsvValue("Ödəniş Növü"),
    escapeCsvValue("Məbləğ (₼)"),
    escapeCsvValue("Əməliyyatı Edən")
  ].join(";"));

  if (activeBills.length === 0) {
    rows.push([escapeCsvValue("Bu gün heç bir hesab bağlanmayıb"), '""', '""', '""', '""', '""'].join(";"));
  } else {
    activeBills.forEach((b) => {
      const itemsSummary = (b.items || []).map((it) => `${it.name} (${it.qty} ${it.unit || "ədəd"})`).join(", ");
      const payMethodText = b.paymentMethod === "card" ? "Kart" : "Nağd";
      const billAmt = Number(b.totalAmount != null ? b.totalAmount : b.total) || 0;
      const actor = b.closedBy || getRoleDisplayName(b.closedByRole);
      rows.push([
        escapeCsvValue(b.time || b.dateTimeLabel || ""),
        escapeCsvValue(b.tableName || (b.source === "pencere" ? "Pəncərə" : b.tableId)),
        escapeCsvValue(itemsSummary || "—"),
        escapeCsvValue(payMethodText),
        escapeCsvValue(billAmt.toFixed(2)),
        escapeCsvValue(actor)
      ].join(";"));
    });
  }
  rows.push([]);

  // 2. KASSA XƏRCLƏRİ
  rows.push([escapeCsvValue("=== 2. KASSA XƏRCLƏRİ ===")].join(";"));
  rows.push([
    escapeCsvValue("Saat"),
    escapeCsvValue("Kassa"),
    escapeCsvValue("Xərcin Təyinatı"),
    escapeCsvValue("Məbləğ (₼)"),
    escapeCsvValue("Qeyd Edən")
  ].join(";"));

  if (activeExpenses.length === 0) {
    rows.push([escapeCsvValue("Xərc qeydə alınmayıb"), '""', '""', '""', '""'].join(";"));
  } else {
    activeExpenses.forEach((exp) => {
      const expType = exp.type === "pencere" ? "Pəncərə" : "Kafe";
      const amt = Number(exp.amount) || 0;
      rows.push([
        escapeCsvValue(exp.time || ""),
        escapeCsvValue(expType),
        escapeCsvValue(exp.title || ""),
        escapeCsvValue((-Math.abs(amt)).toFixed(2)),
        escapeCsvValue(getRoleDisplayName(exp.addedBy))
      ].join(";"));
    });
  }
  rows.push([]);

  // 3. ATM NAĞDLAŞDIRMA
  if (activeAtm.length > 0) {
    rows.push([escapeCsvValue("=== 3. ATM ÇIXARIŞLARI (KARTDAN NAĞDA) ===")].join(";"));
    rows.push([
      escapeCsvValue("Saat"),
      escapeCsvValue("Qeyd"),
      escapeCsvValue("Məbləğ (₼)"),
      escapeCsvValue("İcra Edən")
    ].join(";"));
    activeAtm.forEach((atm) => {
      rows.push([
        escapeCsvValue(atm.time || ""),
        escapeCsvValue(atm.note || "ATM Nağdlaşdırma"),
        escapeCsvValue(Number(atm.amount).toFixed(2)),
        escapeCsvValue(getRoleDisplayName(atm.addedBy))
      ].join(";"));
    });
    rows.push([]);
  }

  // 4. SATILAN MƏHSULLARIN İNVENTAR XÜLASƏSİ
  rows.push([escapeCsvValue("=== 4. SATILAN MƏHSULLARIN XÜLASƏSİ (İNVƏNTAR) ===")].join(";"));
  rows.push([
    escapeCsvValue("Məhsul"),
    escapeCsvValue("Kateqoriya / Növ"),
    escapeCsvValue("Satılan Say"),
    escapeCsvValue("Ölçü Vahidi"),
    escapeCsvValue("Cəmi Məbləğ (₼)")
  ].join(";"));

  const soldCatalog = MENU_CATALOG.filter((it) => (Number((targetShift.soldItemsSummary || {})[it.id]) || 0) > 0);
  soldCatalog.forEach((it) => {
    const qty = Number(targetShift.soldItemsSummary[it.id]) || 0;
    rows.push([
      escapeCsvValue(it.name),
      escapeCsvValue("Kafe"),
      escapeCsvValue(qty),
      escapeCsvValue(it.unit),
      escapeCsvValue((qty * it.price).toFixed(2))
    ].join(";"));
  });

  (targetShift.soldCustomItems || []).forEach((c) => {
    rows.push([
      escapeCsvValue(c.name),
      escapeCsvValue("Kafe (Sərbəst)"),
      escapeCsvValue(c.qty || 1),
      escapeCsvValue("ədəd"),
      escapeCsvValue(Number(c.total || 0).toFixed(2))
    ].join(";"));
  });

  const soldWin = WINDOW_MENU_CATALOG.filter((it) => (Number((targetShift.windowSoldSummary || {})[it.id]) || 0) > 0);
  soldWin.forEach((it) => {
    const qty = Number(targetShift.windowSoldSummary[it.id]) || 0;
    rows.push([
      escapeCsvValue(it.name),
      escapeCsvValue("Pəncərə"),
      escapeCsvValue(qty),
      escapeCsvValue(it.unit),
      escapeCsvValue((qty * it.price).toFixed(2))
    ].join(";"));
  });
  rows.push([]);

  // 5. MASALAR ÜZRƏ HESABAT (15 Masa & Pəncərə)
  rows.push([escapeCsvValue("=== 5. MASALAR ÜZRƏ STATİSTİKA ===")].join(";"));
  rows.push([
    escapeCsvValue("Masa / Yer"),
    escapeCsvValue("Bağlanmış Hesab Sayı"),
    escapeCsvValue("Cəmi Gəlir (₼)"),
    escapeCsvValue("Ən Çox Satılan Məhsullar")
  ].join(";"));

  const tableStats = computePerTableStats(activeBills);
  tableStats.forEach((st) => {
    const topStr = Object.entries(st.itemsMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([n, q]) => `${n} × ${q}`)
      .join(", ");
    rows.push([
      escapeCsvValue(st.name),
      escapeCsvValue(st.orderCount),
      escapeCsvValue(st.totalAmount.toFixed(2)),
      escapeCsvValue(topStr || "—")
    ].join(";"));
  });
  rows.push([]);

  // 6. MALİYYƏ VƏ KASSA YEKUNU (BALANS)
  const cafeGross = round2(targetShift.completedSalesTotal || 0);
  const winGross = round2(targetShift.windowSalesTotal || 0);
  const grandGross = round2(cafeGross + winGross);

  rows.push([escapeCsvValue("=== 6. MALİYYƏ VƏ KASSA YEKUNU ===")].join(";"));
  rows.push([escapeCsvValue("Göstərici"), escapeCsvValue("Məbləğ (₼)")].join(";"));
  rows.push([escapeCsvValue("Cəmi Kafe Satışı (Gross)"), escapeCsvValue(cafeGross.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Cəmi Pəncərə Satışı (Gross)"), escapeCsvValue(winGross.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Ümumi Dövriyyə (Toplam Satış)"), escapeCsvValue(grandGross.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("💵 Cəmi Nağd Satış"), escapeCsvValue(breakdown.grossCashSales.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("💳 Cəmi Kart Satışı"), escapeCsvValue(breakdown.grossCardSales.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("🏧 ATM Nağdlaşdırma (Kart ➔ Nağd)"), escapeCsvValue(breakdown.atmWithdrawnTotal.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Kafe Xərcləri"), escapeCsvValue((-breakdown.cafeExpenses).toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Pəncərə Xərcləri"), escapeCsvValue((-breakdown.winExpenses).toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Toplam Xərclər"), escapeCsvValue((-breakdown.totalExpenses).toFixed(2))].join(";"));
  rows.push([escapeCsvValue("Xalis Qazanc (Net)"), escapeCsvValue(breakdown.grandTotalNet.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("💵 Əldə Olan Nağd Pul (Kassa)"), escapeCsvValue(breakdown.cashOnHand.toFixed(2))].join(";"));
  rows.push([escapeCsvValue("💳 Bank Kartında Qalan"), escapeCsvValue(breakdown.cardRemaining.toFixed(2))].join(";"));

  const csvContent = rows.join("\r\n");
  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(link);
  link.setAttribute("href", url);
  link.setAttribute("download", `${filenamePrefix}_${dateKey}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("📥 Excel / CSV hesabatı uğurla endirildi!");
}

// ============================================================================
// RƏSMİ GÜNLÜK KASSA ÇEKİ / PDF SƏNƏDİ (AZƏRBAYCANCA)
// ============================================================================
function renderReceiptVoucher(targetShift = state) {
  if (!receiptVoucherPaper) return;
  recalculateShiftTotalsFromLedger(targetShift);
  const breakdown = getCashAndCardBreakdown(targetShift);

  const dateLabel = targetShift.fullDate || targetShift.date || targetShift.shiftFullDate || getFormattedBusinessDateAz();
  if (receiptVoucherDateSub) {
    receiptVoucherDateSub.textContent = dateLabel;
  }

  const cafeGross = round2(targetShift.completedSalesTotal || 0);
  const winGross = round2(targetShift.windowSalesTotal || 0);
  const grandGross = round2(cafeGross + winGross);

  // Satılan Kafe və Pəncərə Məhsulları
  const soldRows = [];
  const soldCatalog = MENU_CATALOG.filter((it) => (Number((targetShift.soldItemsSummary || {})[it.id]) || 0) > 0);
  soldCatalog.forEach((it) => {
    const qty = Number(targetShift.soldItemsSummary[it.id]) || 0;
    const sum = round2(qty * it.price);
    soldRows.push(`
      <div class="receipt-table-line">
        <span>${it.name} (${qty} ${it.unit})</span>
        <strong>${formatMoney(sum)}</strong>
      </div>
    `);
  });

  (targetShift.soldCustomItems || []).forEach((c) => {
    soldRows.push(`
      <div class="receipt-table-line">
        <span>${c.name} (${c.qty || 1} ədəd)</span>
        <strong>${formatMoney(c.total || 0)}</strong>
      </div>
    `);
  });

  const soldWin = WINDOW_MENU_CATALOG.filter((it) => (Number((targetShift.windowSoldSummary || {})[it.id]) || 0) > 0);
  soldWin.forEach((it) => {
    const qty = Number(targetShift.windowSoldSummary[it.id]) || 0;
    const sum = round2(qty * it.price);
    soldRows.push(`
      <div class="receipt-table-line">
        <span>${it.name} (${qty} ədəd)</span>
        <strong>${formatMoney(sum)}</strong>
      </div>
    `);
  });

  // Xərclər siyahısı
  const activeExps = (targetShift.expenses || []).filter((e) => !e.deleted);
  const expRows = activeExps.map((e) => `
    <div class="receipt-table-line">
      <span>${e.type === "pencere" ? "[Pəncərə]" : "[Kafe]"} ${e.title}</span>
      <span style="color:#dc2626;">-${formatMoney(e.amount)}</span>
    </div>
  `).join("");

  receiptVoucherPaper.innerHTML = `
    <div class="receipt-paper-header">
      <h2 class="receipt-paper-title">BABA BALA KAFE</h2>
      <p class="receipt-paper-sub">SATIŞ VƏ KASSA HESABATI</p>
      <p class="receipt-paper-sub">${dateLabel}</p>
    </div>

    <hr class="receipt-divider-dashed">

    <div class="receipt-table-line">
      <span>Tarix və Saat:</span>
      <span>${getShortDateTimeAz()}</span>
    </div>
    <div class="receipt-table-line">
      <span>Hesabatı Çıxaran:</span>
      <span>${getRoleDisplayName(currentUserRole)}</span>
    </div>

    <hr class="receipt-divider-dashed">

    <div class="receipt-section-heading">🍽 SATILAN MƏHSULLAR</div>
    <div class="receipt-items-table">
      ${soldRows.length > 0 ? soldRows.join("") : '<div class="receipt-table-line"><span>Satış qeydə alınmayıb</span><span>0.00 ₼</span></div>'}
    </div>

    <hr class="receipt-divider-dashed">

    <div class="receipt-section-heading">💳 SATIŞ VƏ ÖDƏNİŞ BÖLGÜSÜ</div>
    <div class="receipt-table-line bold">
      <span>Ümumi Satış (Brutto):</span>
      <span>${formatMoney(grandGross)}</span>
    </div>
    <div class="receipt-table-line">
      <span>  • 💵 Nağd Satış:</span>
      <span>${formatMoney(breakdown.grossCashSales)}</span>
    </div>
    <div class="receipt-table-line">
      <span>  • 💳 Kart Satışı:</span>
      <span>${formatMoney(breakdown.grossCardSales)}</span>
    </div>
    ${breakdown.atmWithdrawnTotal > 0 ? `
      <div class="receipt-table-line">
        <span>  • 🏧 ATM Nağdlaşdırma (Kart➔Nağd):</span>
        <span>+${formatMoney(breakdown.atmWithdrawnTotal)}</span>
      </div>
    ` : ""}

    <hr class="receipt-divider-dashed">

    <div class="receipt-section-heading">💸 GÜNLÜK XƏRCLƏR</div>
    ${expRows || '<div class="receipt-table-line"><span>Xərc olmayıb</span><span>0.00 ₼</span></div>'}
    <div class="receipt-table-line bold" style="margin-top:6px;">
      <span>Toplam Xərclər:</span>
      <span style="color:#dc2626;">-${formatMoney(breakdown.totalExpenses)}</span>
    </div>

    <hr class="receipt-divider-dashed">

    <div class="receipt-section-heading">💰 YEKUN KASSA VƏ QAZANC</div>
    <div class="receipt-table-line hero-line">
      <span>XALİS GƏLİR:</span>
      <span>${formatMoney(breakdown.grandTotalNet)}</span>
    </div>
    <div class="receipt-table-line bold">
      <span>💵 Əldə Olan Nağd Pul:</span>
      <span>${formatMoney(breakdown.cashOnHand)}</span>
    </div>
    <div class="receipt-table-line bold">
      <span>💳 Bank Kartında Qalan:</span>
      <span>${formatMoney(breakdown.cardRemaining)}</span>
    </div>

    <div class="receipt-paper-footer">
      *** BABA BALA POS SİSTEMİ ***
    </div>
  `;
}

function copyWhatsAppVoucherText(targetShift = state) {
  recalculateShiftTotalsFromLedger(targetShift);
  const breakdown = getCashAndCardBreakdown(targetShift);
  const dateLabel = targetShift.fullDate || targetShift.date || targetShift.shiftFullDate || getFormattedBusinessDateAz();

  const itemLines = [];
  const soldMap = targetShift.soldItemsSummary || {};
  MENU_CATALOG.forEach((it) => {
    const qty = Number(soldMap[it.id]) || 0;
    if (qty > 0) {
      const sum = round2(qty * it.price);
      itemLines.push(`• ${it.name}: ${qty} ${it.unit} — ${sum.toFixed(2)} ₼`);
    }
  });

  (targetShift.soldCustomItems || []).forEach((c) => {
    itemLines.push(`• ${c.name}: ${c.qty || 1} ədəd — ${Number(c.total || 0).toFixed(2)} ₼`);
  });

  const winMap = targetShift.windowSoldSummary || {};
  WINDOW_MENU_CATALOG.forEach((it) => {
    const qty = Number(winMap[it.id]) || 0;
    if (qty > 0) {
      const sum = round2(qty * it.price);
      itemLines.push(`• [Pəncərə] ${it.name}: ${qty} ədəd — ${sum.toFixed(2)} ₼`);
    }
  });

  const activeExps = (targetShift.expenses || []).filter((e) => !e.deleted && !e.isDeleted);
  const expLines = activeExps.map((e) => `• ${e.title}: -${Number(e.amount).toFixed(2)} ₼`);
  const totalGross = round2(breakdown.totalSales || (breakdown.grossCashSales + breakdown.grossCardSales));

  const text = [
    `📊 *BABABALA KAFE — SATIŞ VƏ KASSA HESABATI*`,
    `📅 *Tarix:* ${dateLabel}`,
    `🕒 *Saat:* ${getShortDateTimeAz()}`,
    `👤 *Tərtib Edən:* ${getRoleDisplayName(currentUserRole)}`,
    `----------------------------------------`,
    `🍽 *SATILAN MƏHSULLAR:*`,
    itemLines.length > 0 ? itemLines.join("\n") : "• Satış qeydə alınmayıb",
    `----------------------------------------`,
    `💳 *SATIŞ VƏ ÖDƏNİŞ BÖLGÜSÜ:*`,
    `💰 Ümumi Satış: ${formatMoney(totalGross)}`,
    `💵 Nağd Satış: ${formatMoney(breakdown.grossCashSales)}`,
    `💳 Kart Satışı: ${formatMoney(breakdown.grossCardSales)}`,
    breakdown.atmWithdrawnTotal > 0 ? `🏧 ATM Nağdlaşdırma: +${formatMoney(breakdown.atmWithdrawnTotal)}` : null,
    `----------------------------------------`,
    `💸 *GÜNLÜK XƏRCLƏR:*`,
    expLines.length > 0 ? expLines.join("\n") : "• Xərc olmayıb",
    `🔴 Toplam Xərc: -${formatMoney(breakdown.totalExpenses)}`,
    `----------------------------------------`,
    `⭐ *XALİS KASSA:* ${formatMoney(breakdown.grandTotalNet)}`,
    `💵 Əldə Olan Nağd Pul: ${formatMoney(breakdown.cashOnHand)}`,
    `💳 Bank Kartında Qalan: ${formatMoney(breakdown.cardRemaining)}`,
    `----------------------------------------`,
    `_BabaBala POS sistemi ilə avtomatik tərtib edilmişdir._`
  ].filter(Boolean).join("\n");

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showToast("📋 Mətn WhatsApp üçün kopyalandı!");
    }).catch(() => {
      fallbackCopyText(text);
    });
  } else {
    fallbackCopyText(text);
  }
}

function fallbackCopyText(text) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showToast("📋 Mətn WhatsApp üçün kopyalandı!");
  } catch (err) {
    showToast("Kopyalama xətası");
  }
  document.body.removeChild(ta);
}

function openReceiptVoucherModal(targetShift = state) {
  currentVoucherShift = targetShift;
  renderReceiptVoucher(targetShift);
  if (receiptVoucherModal) {
    receiptVoucherModal.classList.add("open");
    receiptVoucherModal.setAttribute("aria-hidden", "false");
  }
}

function closeReceiptVoucherModal() {
  if (receiptVoucherModal) {
    receiptVoucherModal.classList.remove("open");
    receiptVoucherModal.setAttribute("aria-hidden", "true");
  }
}

// Accordion Açılıb-Bağlanma İdarəetməsi (4 Kart — Default Olaraq Hamısı Bağlı Açılır)
function initReportAccordions() {
  const accConfigs = [
    { header: accWaiterHeader, card: accWaiterCard, content: accWaiterContent },
    { header: accTableStatsHeader, card: accTableStatsCard, content: accTableStatsContent },
    { header: accSoldItemsHeader, card: accSoldItemsCard, content: accSoldItemsContent },
    { header: accExpensesHeader, card: accExpensesCard, content: accExpensesContent }
  ];

  accConfigs.forEach(({ header, card, content }) => {
    if (!header || !card || !content) return;
    card.classList.remove("open");
    header.setAttribute("aria-expanded", "false");
    content.style.display = "none";

    header.onclick = () => {
      const isOpen = card.classList.contains("open");
      card.classList.toggle("open", !isOpen);
      header.setAttribute("aria-expanded", String(!isOpen));
      content.style.display = isOpen ? "none" : "block";
    };
  });
}

// ============================================================================
// SİLİNMƏZ VƏ ANLIQ ƏMƏLİYYAT TARİXÇƏSİ (AUDIT LOG / HISTORY MODALI)
// ============================================================================
function openAuditLogModal() {
  renderAuditLogModal();
  if (auditLogModal) {
    auditLogModal.classList.add("open");
    auditLogModal.setAttribute("aria-hidden", "false");
  }
}

function closeAuditLogModal() {
  if (auditLogModal) {
    auditLogModal.classList.remove("open");
    auditLogModal.setAttribute("aria-hidden", "true");
  }
}

function renderAuditLogModal() {
  if (!auditLogListEl) return;
  const logs = Array.isArray(state.auditLogs) ? state.auditLogs : [];
  const searchQ = auditSearchInput ? auditSearchInput.value.trim().toLowerCase() : "";

  let filtered = logs;
  if (currentAuditFilter && currentAuditFilter !== "all") {
    filtered = filtered.filter((l) => l.type === currentAuditFilter);
  }
  if (searchQ) {
    filtered = filtered.filter((l) => {
      const actorMatch = (l.actorName || "").toLowerCase().includes(searchQ);
      const tableMatch = (l.tableName || "").toLowerCase().includes(searchQ);
      const detailsMatch = (l.details || "").toLowerCase().includes(searchQ);
      const labelMatch = (l.typeLabel || "").toLowerCase().includes(searchQ);
      return actorMatch || tableMatch || detailsMatch || labelMatch;
    });
  }

  auditLogListEl.innerHTML = "";
  if (filtered.length === 0) {
    auditLogListEl.innerHTML = `<div class="mini-empty">Heç bir əməliyyat tapılmadı.</div>`;
    return;
  }

  filtered.forEach((log) => {
    const card = document.createElement("div");
    card.className = "audit-log-card";

    let badgeClass = "audit-badge-other";
    if (log.type === "order") badgeClass = "audit-badge-order";
    else if (log.type === "bill") badgeClass = "audit-badge-bill";
    else if (log.type === "expense") badgeClass = "audit-badge-expense";
    else if (log.type === "transfer") badgeClass = "audit-badge-transfer";
    else if (log.type === "atm") badgeClass = "audit-badge-atm";
    else if (log.type === "edit") badgeClass = "audit-badge-edit";

    card.innerHTML = `
      <div class="audit-log-top">
        <span class="audit-log-time">🕒 ${log.dateTime || log.time}</span>
        <span class="audit-log-actor">👤 ${log.actorName || log.actorRole}</span>
      </div>
      <div class="audit-log-main">
        <span class="audit-log-title">${log.tableName || "Masa"}</span>
        <span class="audit-log-badge ${badgeClass}">${log.typeLabel}</span>
      </div>
      <div class="audit-log-details">${log.details || ""}</div>
      ${log.amount > 0 ? `<div style="text-align:right; font-weight:700; color:var(--text-primary); font-size:0.85rem;">${formatMoney(log.amount)}</div>` : ""}
    `;
    auditLogListEl.appendChild(card);
  });
}

// Ofisiantlar üzrə bağlanmış masa və dövriyyə statistikasını hesablamaq
function computeWaiterStats(closedBillsArray) {
  const stats = {
    waiter1: { label: "1-ci Ofisiant", count: 0, total: 0 },
    waiter2: { label: "2-ci Ofisiant", count: 0, total: 0 },
    admin: { label: "Admin (Müdir)", count: 0, total: 0 }
  };

  (closedBillsArray || []).forEach((b) => {
    if (!b || b.deleted) return;
    if (b.source === "pencere" || b.tableId === "pencere") return;
    const rawRole = b.closedByRole || b.closedBy || "waiter1";
    let roleKey = "waiter1";
    if (rawRole === "waiter2" || rawRole === "2-ci Ofisiant") roleKey = "waiter2";
    else if (rawRole === "admin" || rawRole === "Admin") roleKey = "admin";

    stats[roleKey].count += 1;
    stats[roleKey].total = round2(stats[roleKey].total + (Number(b.totalAmount != null ? b.totalAmount : b.total) || 0));
  });

  return stats;
}

// ============================================================================
// 5. GÜNÜN STATİSTİKASI EKRANI (Yalnız Admin Səlahiyyəti)
// ============================================================================
function openReportModal() {
  if (currentUserRole !== "admin") return;

  // Başlanğıcda hesabat blokları BAĞLI (collapsed) vəziyyətdə olsun (Yığcam screenshot üçün)
  [accWaiterCard, accTableStatsCard, accSoldItemsCard, accExpensesCard].forEach((card) => {
    if (card) card.classList.remove("open");
  });
  [accWaiterContent, accTableStatsContent, accSoldItemsContent, accExpensesContent].forEach((content) => {
    if (content) content.style.display = "none";
  });
  [accWaiterHeader, accTableStatsHeader, accSoldItemsHeader, accExpensesHeader].forEach((hdr) => {
    if (hdr) hdr.setAttribute("aria-expanded", "false");
  });

  renderReportModal();
  reportModal.classList.add("open");
  reportModal.setAttribute("aria-hidden", "false");
}

function closeReportModal() {
  reportModal.classList.remove("open");
  reportModal.setAttribute("aria-hidden", "true");
}

function renderReportModal() {
  recalculateShiftTotalsFromLedger(state);
  reportDateSubEl.textContent = state.shiftFullDate || getFormattedDateAz();

  const breakdown = getCashAndCardBreakdown(state);

  // Kafe Hesablamaları
  const cafeGrossSales = round2(state.completedSalesTotal);
  const cafeExpenses = breakdown.cafeExpenses;
  const cafeNetCash = round2(cafeGrossSales - cafeExpenses);

  // Pəncərə Hesablamaları
  const winGrossSales = round2(state.windowSalesTotal);
  const winExpenses = breakdown.winExpenses;
  const winNetCash = round2(winGrossSales - winExpenses);

  // Ümumi Yekun Xalis Kassa və Dövriyyə
  const grandNetCash = round2(cafeNetCash + winNetCash);
  const totalGrossSales = round2(breakdown.totalSales || (breakdown.grossCashSales + breakdown.grossCardSales));

  // 1. Başlıq Hero: Ümumi Kassa Dövriyyəsi
  if (reportGrandTotalAmount) reportGrandTotalAmount.textContent = formatMoney(totalGrossSales);
  if (reportGrandNetCashEl) reportGrandNetCashEl.textContent = formatMoney(grandNetCash);
  if (reportGrandBreakdownEl) {
    reportGrandBreakdownEl.textContent = `Xalis Kassa: ${formatMoney(breakdown.grandTotalNet)}  |  Xərclər: -${formatMoney(breakdown.totalExpenses)}`;
  }

  // 2. Vizual Faiz Zolağı (Split Progress Bar)
  let cashPct = 100;
  let cardPct = 0;
  if (totalGrossSales > 0) {
    cashPct = Math.round((breakdown.grossCashSales / totalGrossSales) * 100);
    cardPct = 100 - cashPct;
  }
  if (splitProgressCash) splitProgressCash.style.width = `${cashPct}%`;
  if (splitProgressCard) splitProgressCard.style.width = `${cardPct}%`;
  if (splitLabelCash) splitLabelCash.textContent = `💵 Nağd: ${formatMoney(breakdown.grossCashSales)} (%${cashPct})`;
  if (splitLabelCard) splitLabelCard.textContent = `💳 Kart: ${formatMoney(breakdown.grossCardSales)} (%${cardPct})`;

  // 3. Təmizlənmiş 2-li Kassa Qutusu (Əldə Olan Nağd / Kartda Qalan)
  if (reportCashOnHandEl) reportCashOnHandEl.textContent = formatMoney(breakdown.cashOnHand);
  if (reportCardRemainingEl) reportCardRemainingEl.textContent = formatMoney(breakdown.cardRemaining);
  if (reportGrandTotalBoxEl) reportGrandTotalBoxEl.textContent = formatMoney(breakdown.grandTotalNet);

  // Accordion Başlıqlarındakı İndikator / Cəm Məlumatları
  if (accExpensesBadge) accExpensesBadge.textContent = `Cəmi: -${formatMoney(breakdown.totalExpenses)}`;

  // ATM Nağdlaşdırma Tarixçəsi
  const atmList = Array.isArray(state.atmTransfers) ? state.atmTransfers.filter((a) => !a.deleted && !a.isDeleted) : [];
  if (reportAtmSectionEl && reportAtmTransfersListEl) {
    if (atmList.length === 0) {
      reportAtmSectionEl.style.display = "none";
    } else {
      reportAtmSectionEl.style.display = "block";
      reportAtmTransfersListEl.innerHTML = "";
      atmList.slice().reverse().forEach((atm) => {
        const row = document.createElement("div");
        row.className = "mini-row";
        row.innerHTML = `
          <span>🏧 ${atm.note || "ATM Nağdlaşdırma"} (${atm.time})</span>
          <div class="bill-right-actions">
            <strong style="color:#0284c7">💳 ➔ 💵 ${formatMoney(atm.amount)}</strong>
            <button type="button" class="delete-record-btn" title="ATM qeydini sil">✕</button>
          </div>
        `;
        row.querySelector(".delete-record-btn").addEventListener("click", () => {
          deleteAtmTransferById(atm.id);
        });
        reportAtmTransfersListEl.appendChild(row);
      });
    }
  }

  // Ofisiantlar Üzrə Gündəlik Dövriyyə
  const allActiveTx = Array.isArray(state.closedBills) ? state.closedBills.filter((b) => !b.deleted && !b.isDeleted) : [];
  const cafeClosedBills = allActiveTx.filter((b) => b.source !== "pencere" && b.tableId !== "pencere");
  const windowTransactions = allActiveTx.filter((b) => b.source === "pencere" || b.tableId === "pencere");

  // Masalar Üzrə Hesabat (15 Masa & Pəncərə — Kompakt Cədvəl)
  if (reportPerTableStatsListEl) {
    reportPerTableStatsListEl.innerHTML = "";
    const tableStats = computePerTableStats(allActiveTx);
    let activeTableCount = 0;
    tableStats.forEach((t) => {
      if (t.count === 0 && t.total === 0) return;
      activeTableCount++;
      const row = document.createElement("div");
      row.className = "compact-stat-row";
      row.innerHTML = `
        <span class="compact-stat-name">${t.name}</span>
        <span class="compact-stat-detail">${t.count} çek (${formatMoney(t.cash)} N / ${formatMoney(t.card)} K)</span>
        <strong class="compact-stat-val">${formatMoney(t.total)}</strong>
      `;
      reportPerTableStatsListEl.appendChild(row);
    });
    if (activeTableCount === 0) {
      reportPerTableStatsListEl.innerHTML = `<div class="mini-empty">Bu gün hələ heç bir masada hesab bağlanmayıb.</div>`;
    }
    if (accTableStatsBadge) {
      accTableStatsBadge.textContent = `${activeTableCount} masa (${allActiveTx.length} çek)`;
    }
  }

  // Satılan Bütün Məhsullar (Nələr satıldı?) — Kompakt Minimalist Cədvəl
  if (reportAllSoldItemsList) {
    reportAllSoldItemsList.innerHTML = "";
    const allSoldRows = [];
    MENU_CATALOG.forEach((item) => {
      const qty = Number(state.soldItemsSummary[item.id]) || 0;
      if (qty > 0) {
        allSoldRows.push({ name: item.name, qty, unit: item.unit, price: item.price, total: round2(qty * item.price) });
      }
    });
    (state.soldCustomItems || []).forEach((c) => {
      allSoldRows.push({ name: c.name, qty: c.qty || 1, unit: "ədəd", price: c.price, total: round2(c.total || 0) });
    });
    WINDOW_MENU_CATALOG.forEach((item) => {
      const qty = Number(state.windowSoldSummary[item.id]) || 0;
      if (qty > 0) {
        allSoldRows.push({ name: `[Pəncərə] ${item.name}`, qty, unit: "ədəd", price: item.price, total: round2(qty * item.price) });
      }
    });

    if (allSoldRows.length === 0) {
      reportAllSoldItemsList.innerHTML = `<div class="mini-empty">Bu gün hələ heç bir satış qeydə alınmayıb.</div>`;
    } else {
      allSoldRows.forEach((item) => {
        const row = document.createElement("div");
        row.className = "compact-stat-row";
        row.innerHTML = `
          <span class="compact-stat-name">${item.name}</span>
          <span class="compact-stat-detail">${item.qty} ${item.unit} × ${formatMoney(item.price)}</span>
          <strong class="compact-stat-val">${formatMoney(item.total)}</strong>
        `;
        reportAllSoldItemsList.appendChild(row);
      });
    }
    if (accSoldItemsBadge) {
      accSoldItemsBadge.textContent = `${allSoldRows.length} çeşid`;
    }
  }

  if (reportWaiterStatsListEl) {
    const wStats = computeWaiterStats(cafeClosedBills);
    if (accWaiterBadge) {
      accWaiterBadge.textContent = `${cafeClosedBills.length} hesab`;
    }
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

  // Kafe Masaları üzrə Bağlanmış Hesablar ('✏️ Redaktə' və '✕' silmə düyməsi ilə)
  reportTableBillsListEl.innerHTML = "";

  if (cafeClosedBills.length === 0) {
    reportTableBillsListEl.innerHTML = `<div class="mini-empty">Bu gün hələ heç bir masada hesab bağlanmayıb.</div>`;
  } else {
    const tableMap = new Map();
    cafeClosedBills.forEach((bill) => {
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
        const waiterLabel = getRoleDisplayName(b.closedByRole || b.closedBy || "waiter1");
        const payTagClass = b.paymentMethod === "card" ? "tag-card" : "tag-cash";
        const payTagText = b.paymentMethod === "card" ? "💳 Kart" : "💵 Nağd";

        const subItem = document.createElement("div");
        subItem.className = "report-bill-sub-item";
        subItem.innerHTML = `
          <div class="report-bill-sub-left">
            <span>Hesab #${idx + 1} (${b.time}) <span class="waiter-tag-pill">${waiterLabel}</span> <span class="pay-method-tag ${payTagClass}">${payTagText}</span></span>
            ${itemsStr ? `<span class="report-bill-sub-items">${itemsStr}</span>` : ""}
          </div>
          <div class="bill-right-actions">
            <strong>${formatMoney(b.totalAmount)}</strong>
            <button type="button" class="edit-record-btn" title="Bu çeki redaktə et">✏️ Redaktə</button>
            <button type="button" class="delete-record-btn" title="Bu çeki sil">✕</button>
          </div>
        `;

        subItem.querySelector(".edit-record-btn").addEventListener("click", () => {
          openEditBillModal(b.id, null);
        });

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

  // Kafe Xərcləri Siyahısı ('✏️ Redaktə' və '✕' ilə silmək imkanı)
  reportCafeExpensesListEl.innerHTML = "";
  const cafeExpensesList = (state.expenses || []).filter((e) => !e.deleted && e.type !== "pencere");
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
          <button type="button" class="edit-record-btn" title="Xərci redaktə et">✏️ Redaktə</button>
          <button type="button" class="delete-record-btn" title="Xərci sil">✕</button>
        </div>
      `;
      row.querySelector(".edit-record-btn").addEventListener("click", () => {
        openExpenseEditModal({ isNew: false, expenseId: exp.id, archiveDayId: null });
      });
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

  // Pəncərə Çekləri Siyahısı ('✏️ Redaktə' və '✕' ilə silmək imkanı)
  if (reportWindowTransactionsListEl) {
    reportWindowTransactionsListEl.innerHTML = "";
    if (windowTransactions.length === 0) {
      reportWindowTransactionsListEl.innerHTML = `<div class="mini-empty">Bu gün pəncərə satışı qeydə alınmayıb.</div>`;
    } else {
      windowTransactions.slice().reverse().forEach((wTx, idx) => {
        const itemsStr = (wTx.items || []).map((it) => `${it.name} × ${it.qty}`).join(", ");
        const payTagClass = wTx.paymentMethod === "card" ? "tag-card" : "tag-cash";
        const payTagText = wTx.paymentMethod === "card" ? "💳 Kart" : "💵 Nağd";

        const row = document.createElement("div");
        row.className = "report-bill-sub-item";
        row.innerHTML = `
          <div class="report-bill-sub-left">
            <span>Pəncərə #${windowTransactions.length - idx} (${wTx.time}) <span class="pay-method-tag ${payTagClass}">${payTagText}</span></span>
            ${itemsStr ? `<span class="report-bill-sub-items">${itemsStr}</span>` : ""}
          </div>
          <div class="bill-right-actions">
            <strong>${formatMoney(wTx.totalAmount)}</strong>
            <button type="button" class="edit-record-btn" title="Pəncərə çekini redaktə et">✏️ Redaktə</button>
            <button type="button" class="delete-record-btn" title="Pəncərə çekini sil">✕</button>
          </div>
        `;
        row.querySelector(".edit-record-btn").addEventListener("click", () => {
          openEditBillModal(wTx.id, null);
        });
        row.querySelector(".delete-record-btn").addEventListener("click", () => {
          deleteClosedBillById(wTx.id);
        });
        reportWindowTransactionsListEl.appendChild(row);
      });
    }
  }

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

  // Pəncərə Xərcləri Siyahısı ('✏️ Redaktə' və '✕' ilə silmək imkanı)
  reportWindowExpensesListEl.innerHTML = "";
  const winExpensesList = (state.expenses || []).filter((e) => !e.deleted && e.type === "pencere");
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
          <button type="button" class="edit-record-btn" title="Xərci redaktə et">✏️ Redaktə</button>
          <button type="button" class="delete-record-btn" title="Xərci sil">✕</button>
        </div>
      `;
      row.querySelector(".edit-record-btn").addEventListener("click", () => {
        openExpenseEditModal({ isNew: false, expenseId: exp.id, archiveDayId: null });
      });
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
function recalculateArchiveEntryTotals(entry) {
  if (!entry || typeof entry !== "object") return;
  recalculateShiftTotalsFromLedger(entry);
  const breakdown = getCashAndCardBreakdown(entry);

  entry.cafeGross = round2(entry.completedSalesTotal);
  entry.cafeExp = breakdown.cafeExpenses;
  entry.cafeNet = round2(entry.cafeGross - entry.cafeExp);

  entry.winGross = round2(entry.windowSalesTotal);
  entry.winExp = breakdown.winExpenses;
  entry.winNet = round2(entry.winGross - entry.winExp);

  entry.grossSales = round2(entry.cafeGross + entry.winGross);
  entry.totalExpenses = breakdown.totalExpenses;
  entry.netCash = breakdown.grandTotalNet;
  entry.cashOnHand = breakdown.cashOnHand;
  entry.cardRemaining = breakdown.cardRemaining;
}

function buildShiftArchiveRecord(targetState, customDateLabel) {
  recalculateShiftTotalsFromLedger(targetState);
  const breakdown = getCashAndCardBreakdown(targetState);

  const cafeGrossSales = round2(targetState.completedSalesTotal);
  const cafeExpenses = breakdown.cafeExpenses;
  const cafeNetCash = round2(cafeGrossSales - cafeExpenses);

  const winGrossSales = round2(targetState.windowSalesTotal);
  const winExpenses = breakdown.winExpenses;
  const winNetCash = round2(winGrossSales - winExpenses);

  const grandNetCash = round2(cafeNetCash + winNetCash);
  const totalGross = round2(cafeGrossSales + winGrossSales);
  const totalExpenses = breakdown.totalExpenses;

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
    cashOnHand: breakdown.cashOnHand,
    cardRemaining: breakdown.cardRemaining,
    soldItemsSummary: { ...(targetState.soldItemsSummary || {}) },
    soldCustomItems: [...(targetState.soldCustomItems || [])],
    windowSoldSummary: { ...(targetState.windowSoldSummary || {}) },
    expenses: [...(targetState.expenses || [])],
    closedBills: [...(targetState.closedBills || [])],
    atmTransfers: [...(targetState.atmTransfers || [])]
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

// ============================================================================
// 2 MƏRHƏLƏLİ TƏHLÜKƏSİZLİK KİLİDİ ('SİL' TƏSDİQİ İLƏ)
// ============================================================================
let pendingDangerAction = null;

function openDangerConfirmModal({ title, text, buttonText, onConfirm }) {
  if (!dangerConfirmModal) return;
  pendingDangerAction = onConfirm;

  if (dangerConfirmTitle) {
    dangerConfirmTitle.innerHTML = title || "DİQQƏT: Bu əməliyyat geri qaytarılmır!";
  }
  if (dangerConfirmText) {
    dangerConfirmText.innerHTML = text || "Bu əməliyyatı təsdiqləmək üçün aşağıdakı xanaya böyük hərflərlə <strong>SİL</strong> yazın:";
  }
  if (dangerExecuteBtn) {
    dangerExecuteBtn.innerHTML = buttonText || "🗑 Bəli, Sil";
    dangerExecuteBtn.disabled = true;
  }
  if (dangerConfirmInput) {
    dangerConfirmInput.value = "";
  }

  dangerConfirmModal.classList.add("open");
  dangerConfirmModal.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    if (dangerConfirmInput) dangerConfirmInput.focus();
  }, 100);
}

function closeDangerConfirmModal() {
  if (!dangerConfirmModal) return;
  dangerConfirmModal.classList.remove("open");
  dangerConfirmModal.setAttribute("aria-hidden", "true");
  pendingDangerAction = null;
  if (dangerConfirmInput) {
    dangerConfirmInput.value = "";
  }
  if (dangerExecuteBtn) {
    dangerExecuteBtn.disabled = true;
  }
}

function openConfirmResetModal() {
  if (currentUserRole !== "admin") return;
  openDangerConfirmModal({
    title: "Günü Bağla və Sıfırla",
    text: "Cari günün hesabatı arxivə göndəriləcək və bütün masalar/kassa sıfırlanacaq. Bu əməliyyat geri qaytarılmır!<br><br>Təsdiq üçün aşağıdakı xanaya böyük hərflərlə <strong>SİL</strong> yazın:",
    buttonText: "🔒 Bəli, Günü Bağla və Sıfırla",
    onConfirm: executeEndDayAndReset
  });
}

function closeConfirmResetModal() {
  closeDangerConfirmModal();
}

function executeEndDayAndReset() {
  if (currentUserRole !== "admin") return;

  const archive = loadArchive();
  const record = buildShiftArchiveRecord(state, `${state.shiftFullDate || getFormattedBusinessDateAz()} (${getShortDateTimeAz()})`);
  archive.push(record);
  saveArchive(archive);

  logAuditEvent({
    type: "SHIFT_CLOSED",
    category: "kassa",
    actionTitle: "Növbə Bağlandı (Günü Bitir)",
    tableName: "Kassa",
    amount: round2(record.totalNetIncome != null ? record.totalNetIncome : (record.totalSales || 0)),
    details: `Növbə uğurla bağlandı və arxivləşdirildi. Satış: ${formatMoney(record.totalSales || 0)}, Xalis kassa: ${formatMoney(record.totalNetIncome || 0)}.`,
    items: [],
    role: currentUserRole
  });

  state = createDefaultState();
  saveState({ resetShift: true });

  closeDangerConfirmModal();
  closeReportModal();
  setAppMode("kafe");
  showToast("Növbə bağlandı! Hesabat arxivə göndərildi və kassa sıfırlandı.");
}

// ============================================================================
// SADƏ KARTDAN NAĞDA KEÇİRDİLMƏ MODALI
// ============================================================================
function openQuickAtmModal() {
  if (currentUserRole !== "admin") {
    showToast("Kartdan nağda keçirmək yalnız admin üçündür!");
    return;
  }
  if (!quickAtmModal) return;

  const breakdown = getCashAndCardBreakdown(state);
  const cardRemaining = Math.max(0, breakdown.cardRemaining || 0);

  if (quickAtmInput) {
    quickAtmInput.value = "";
    quickAtmInput.placeholder = cardRemaining > 0 ? `Max: ${cardRemaining.toFixed(2)}` : "0.00";
    quickAtmInput.max = cardRemaining > 0 ? String(cardRemaining) : "";
  }

  quickAtmModal.classList.add("open");
  quickAtmModal.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    if (quickAtmInput) quickAtmInput.focus();
  }, 100);
}

function closeQuickAtmModal() {
  if (!quickAtmModal) return;
  quickAtmModal.classList.remove("open");
  quickAtmModal.setAttribute("aria-hidden", "true");
  if (quickAtmInput) {
    quickAtmInput.value = "";
  }
}

function handleConfirmQuickAtm() {
  if (currentUserRole !== "admin") return;
  if (!quickAtmInput) return;

  const amount = round2(parseFloat(quickAtmInput.value));
  if (!Number.isFinite(amount) || amount <= 0) {
    showToast("Zəhmət olmasa düzgün məbləğ daxil edin!");
    return;
  }

  const breakdown = getCashAndCardBreakdown(state);
  if (amount > (breakdown.cardRemaining || 0) + 0.01) {
    showToast(`Kartda kifayət qədər vəsait yoxdur! Maksimum: ${formatMoney(breakdown.cardRemaining || 0)}`);
    return;
  }

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

  if (!Array.isArray(state.atmTransfers)) {
    state.atmTransfers = [];
  }

  const atmRecord = {
    id: `atm_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    amount,
    time: timeStr,
    date: getBusinessDateKey(now),
    note: "Kartdan Nağda Keçid",
    addedBy: currentUserRole,
    updatedAt: Date.now()
  };

  state.atmTransfers.push(atmRecord);
  saveState({ newAtmTransfers: [atmRecord] });

  logAuditEvent({
    type: "ATM_TRANSFER",
    category: "kassa",
    actionTitle: "Kartdan Nağda Keçirildi",
    tableName: "Kassa",
    amount: amount,
    details: `${formatMoney(amount)} məbləğində vəsait kartdan nağd kassaya köçürüldü. Kim: ${currentUserRole}.`,
    items: [],
    role: currentUserRole
  });

  closeQuickAtmModal();
  renderReportModal();
  refreshAllActiveViews();
  showToast(`${formatMoney(amount)} kartdan nağda keçirildi!`);
}

// XÜSUSİ ARXİV MODALI (Detallı Tarixçə, '✏️ Redaktə' və '✕' Silmə İmkanı — Yalnız Admin)
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
  let rawList = [];
  try {
    rawList = JSON.parse(localStorage.getItem(ARCHIVE_STORAGE_KEY) || "[]");
  } catch (e) {
    rawList = [];
  }
  const target = rawList.find((item) => item.id === archiveId);
  if (!target) return;

  openDangerConfirmModal({
    title: "Arxiv Gününü Sil",
    text: `"${target.fullDate || target.date}" tarixli arxiv günü silinəcək. Bu əməliyyat geri qaytarılmır!<br><br>Təsdiq üçün aşağıdakı xanaya böyük hərflərlə <strong>SİL</strong> yazın:`,
    buttonText: "🗑 Bəli, Günü Sil",
    onConfirm: () => doDeleteArchiveDay(archiveId)
  });
}

function doDeleteArchiveDay(archiveId) {
  let rawList = [];
  try {
    rawList = JSON.parse(localStorage.getItem(ARCHIVE_STORAGE_KEY) || "[]");
  } catch (e) {
    rawList = [];
  }
  const target = rawList.find((item) => item.id === archiveId);
  if (!target) return;

  target.isDeleted = true;
  target.deleted = true;
  target.deletedAt = Date.now();
  target.deletedBy = currentUserRole;

  saveArchive(rawList);

  logAuditEvent({
    type: "ARCHIVE_DELETED",
    category: "kassa",
    actionTitle: "Arxiv Günü Silindi (Soft Delete)",
    tableName: "Arxiv",
    amount: target.grandNet || target.netCash || 0,
    details: `${target.fullDate || target.date} tarixli gün arxivdən silindi. Kim: ${currentUserRole}.`,
    items: [],
    role: currentUserRole
  });

  renderArchiveModal();
  showToast("Arxiv günü silindi.");
}

function deleteArchiveBillById(archiveDayId, billId) {
  if (currentUserRole !== "admin") return;
  const archive = loadArchive();
  const dayEntry = archive.find((d) => d.id === archiveDayId);
  if (!dayEntry || !Array.isArray(dayEntry.closedBills)) return;

  const targetBill = dayEntry.closedBills.find((b) => b.id === billId);
  if (!targetBill) return;

  openDangerConfirmModal({
    title: "Arxiv Çekini Sil",
    text: `"${targetBill.tableName || "Çek"}" (${formatMoney(targetBill.total || 0)}) çeki arxivdən silinəcək. Bu əməliyyat geri qaytarılmır!<br><br>Təsdiq üçün aşağıdakı xanaya böyük hərflərlə <strong>SİL</strong> yazın:`,
    buttonText: "🗑 Bəli, Çeki Sil",
    onConfirm: () => doDeleteArchiveBill(archiveDayId, billId)
  });
}

function doDeleteArchiveBill(archiveDayId, billId) {
  const archive = loadArchive();
  const dayEntry = archive.find((d) => d.id === archiveDayId);
  if (!dayEntry || !Array.isArray(dayEntry.closedBills)) return;

  const targetBill = dayEntry.closedBills.find((b) => b.id === billId);
  if (targetBill) {
    targetBill.isDeleted = true;
    targetBill.deleted = true;
    targetBill.deletedAt = Date.now();
    targetBill.deletedBy = currentUserRole;

    logAuditEvent({
      type: "BILL_DELETED",
      category: "kassa",
      actionTitle: "Arxiv Çeki Silindi (Soft Delete)",
      tableName: targetBill.tableName || "Arxiv Çeki",
      amount: targetBill.total || 0,
      details: `Arxivdən (${dayEntry.fullDate || dayEntry.date}) ${targetBill.tableName || "Çek"} silindi: ${targetBill.total || 0} ₼ (${targetBill.paymentMethod === "card" ? "Kart" : "Nağd"}).`,
      items: targetBill.items || [],
      role: currentUserRole
    });
  }

  dayEntry.closedBills = dayEntry.closedBills.filter((b) => b.id !== billId && !b.isDeleted);
  recalculateArchiveEntryTotals(dayEntry);
  saveArchive(archive);
  renderArchiveModal();
  showToast("Arxiv çeki silindi.");
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
    const cashOnHand = entry.cashOnHand != null ? round2(entry.cashOnHand) : grandNet;
    const cardRemaining = entry.cardRemaining != null ? round2(entry.cardRemaining) : 0;

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
          <span class="archive-day-sub">💵 Nağd: ${formatMoney(cashOnHand)} &nbsp;|&nbsp; 💳 Kart: ${formatMoney(cardRemaining)} &nbsp;|&nbsp; Xərc: ${formatNegativeMoney(totalExp)}</span>
        </div>
        <div class="archive-day-right">
          <strong class="archive-day-net">${formatMoney(grandNet)}</strong>
          <button type="button" class="delete-record-btn" title="Bu günü arxivdən sil">✕</button>
        </div>
      </div>

      <div class="archive-day-actions-bar">
        <button type="button" class="print-voucher-btn-mini" title="Rəsmi Çek Formatında Bax / Paylaş">
          🧾 Rəsmi Çek Formatında Bax / Paylaş
        </button>
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
          <h5 class="mini-title">Həmin Günün Çekləri (✏️ Redaktə / ✕ Sil)</h5>
          <div class="mini-list archive-bills-list"></div>
        </div>

        <div class="archive-detail-block">
          <h5 class="mini-title">📊 Masalar Üzrə Hesabat (15 Masa & Pəncərə)</h5>
          <div class="per-table-stats-grid archive-per-table-grid"></div>
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

        <div class="archive-detail-block">
          <div class="archive-expenses-header">
            <h5 class="mini-title" style="margin:0;">Həmin Günün Xərcləri</h5>
            <button type="button" class="btn-add-archive-expense">➕ Bu Günə Xərc Əlavə Et</button>
          </div>
          <div class="mini-list archive-expenses-list"></div>
        </div>
      </div>
    `;

    const printVoucherBtn = card.querySelector(".print-voucher-btn-mini");
    if (printVoucherBtn) {
      printVoucherBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openReceiptVoucherModal(entry);
      });
    }

    const archiveGridEl = card.querySelector(".archive-per-table-grid");
    if (archiveGridEl) {
      renderPerTableStatsGrid(archiveGridEl, entry.closedBills || []);
    }

    const addArchiveExpBtn = card.querySelector(".btn-add-archive-expense");
    if (addArchiveExpBtn) {
      addArchiveExpBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        openExpenseEditModal({ isNew: true, archiveDayId: entry.id });
      });
    }

    const archiveExpListEl = card.querySelector(".archive-expenses-list");
    const dayExpenses = (entry.expenses || []).filter((e) => !e.deleted);
    if (archiveExpListEl) {
      if (dayExpenses.length === 0) {
        archiveExpListEl.innerHTML = `<div class="mini-empty">Bu gün xərc qeydə alınmayıb.</div>`;
      } else {
        dayExpenses.forEach((exp) => {
          const row = document.createElement("div");
          row.className = "mini-row";
          row.innerHTML = `
            <span><span class="expense-badge ${exp.type === "pencere" ? "pencere" : "kafe"}">${exp.type === "pencere" ? "Pəncərə" : "Kafe"}</span> ${exp.title}</span>
            <div class="bill-right-actions">
              <strong style="color:#dc2626">${formatNegativeMoney(exp.amount)}</strong>
              <button type="button" class="edit-record-btn" title="Xərci redaktə et">✏️ Redaktə</button>
              <button type="button" class="delete-record-btn" title="Xərci sil">✕</button>
            </div>
          `;
          row.querySelector(".edit-record-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openExpenseEditModal({ isNew: false, expenseId: exp.id, archiveDayId: entry.id });
          });
          row.querySelector(".delete-record-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteArchiveExpenseById(entry.id, exp.id);
          });
          archiveExpListEl.appendChild(row);
        });
      }
    }

    const archiveBillsListEl = card.querySelector(".archive-bills-list");
    const dayBills = Array.isArray(entry.closedBills) ? entry.closedBills : [];
    if (archiveBillsListEl) {
      if (dayBills.length === 0) {
        archiveBillsListEl.innerHTML = `<div class="mini-empty">Çek qeydi yoxdur</div>`;
      } else {
        dayBills.forEach((b) => {
          const itemsStr = (b.items || []).map((it) => `${it.name} × ${it.qty}`).join(", ");
          const payTagClass = b.paymentMethod === "card" ? "tag-card" : "tag-cash";
          const payTagText = b.paymentMethod === "card" ? "💳 Kart" : "💵 Nağd";
          const billAmt = round2(b.totalAmount != null ? b.totalAmount : b.total);

          const bRow = document.createElement("div");
          bRow.className = "report-bill-sub-item";
          bRow.innerHTML = `
            <div class="report-bill-sub-left">
              <span><strong>${b.tableName || "Masa"}</strong> (${b.time || ""}) <span class="pay-method-tag ${payTagClass}">${payTagText}</span></span>
              ${itemsStr ? `<span class="report-bill-sub-items">${itemsStr}</span>` : ""}
            </div>
            <div class="bill-right-actions">
              <strong>${formatMoney(billAmt)}</strong>
              <button type="button" class="edit-record-btn" title="Bu çeki redaktə et">✏️ Redaktə</button>
              <button type="button" class="delete-record-btn" title="Bu çeki sil">✕</button>
            </div>
          `;
          bRow.querySelector(".edit-record-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            openEditBillModal(b.id, entry.id);
          });
          bRow.querySelector(".delete-record-btn").addEventListener("click", (e) => {
            e.stopPropagation();
            deleteArchiveBillById(entry.id, b.id);
          });
          archiveBillsListEl.appendChild(bRow);
        });
      }
    }

    const topBar = card.querySelector(".archive-day-top");
    const deleteBtn = card.querySelector(".archive-day-top .delete-record-btn");

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
// 8. KRİTİK MƏLUMAT BÜTÖVLÜYÜ (DATA INTEGRITY) VƏ PARÇALI (GRANULAR / APPEND-ONLY) SİNXRONİZASİYA
//    - Bütün state-i tək bir sənədin üstünə full overwrite etmək QƏTİ QADAĞANDIR!
//    - Masalar ayrı-ayrılıqda (tables.[tableId]) sinxronlaşır.
//    - Bağlanmış çeklər (transactions), xərclər (expenses) və ATM çıxarışları (atmTransfers)
//      unikal ID ilə append/merge olunur. Heç bir köhnə keş kassanı sıfırlaya bilməz!
// ============================================================================
let firestoreTablesDocRef = null;
let firestoreTxDocRef = null;
let firestoreArchiveDocRef = null;
let unsubscribeTablesFirestore = null;
let unsubscribeTxFirestore = null;
let unsubscribeArchiveFirestore = null;

let isInitialTablesSyncDone = false;
let isInitialTxSyncDone = false;
let isInitialSyncDone = false;
let isInitialArchiveSyncDone = false;
let isApplyingRemoteSync = false;
let lastPushedSyncId = null;
let lastPushedArchiveSyncId = null;

const localBroadcast = typeof BroadcastChannel !== "undefined"
  ? new BroadcastChannel("bababala_pos_live_channel_v2")
  : null;

if (localBroadcast) {
  localBroadcast.onmessage = (event) => {
    if (!event.data || event.data.clientId === CLIENT_ID) return;
    if (event.data.type === "archive_sync" && Array.isArray(event.data.archive)) {
      localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(event.data.archive));
      if (archiveModal && archiveModal.classList.contains("open")) {
        renderArchiveModal();
      }
    } else if (event.data.state) {
      isApplyingRemoteSync = true;
      try {
        state = normalizeStateObject(event.data.state);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        refreshAllActiveViews();
      } finally {
        isApplyingRemoteSync = false;
      }
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

function markInitialSyncIfReady() {
  if (isInitialTablesSyncDone && isInitialTxSyncDone) {
    isInitialSyncDone = true;
  }
}

// Bazadan gələn Masalar sənədini lokal state-lə birləşdir (digər cihazın masalarını əzmədən)
function applyIncomingTablesSnapshot(data) {
  if (!data || typeof data !== "object") return;
  if (data.syncId && data.syncId === lastPushedSyncId) return;

  isApplyingRemoteSync = true;
  try {
    const incomingTablesMap = (data.tables && typeof data.tables === "object") ? data.tables : {};
    state.tables = INITIAL_TABLES.map((initTable) => {
      const remoteT = incomingTablesMap[initTable.id];
      const localT = state.tables.find((t) => t.id === initTable.id);
      const chosen = remoteT || localT || initTable;
      return {
        id: initTable.id,
        name: initTable.name,
        group: initTable.group,
        orders: sanitizeOrdersMap(chosen.orders),
        customOrders: Array.isArray(chosen.customOrders) ? chosen.customOrders : [],
        lastWaiter: chosen.lastWaiter || null,
        updatedAt: Number(chosen.updatedAt) || 0
      };
    });

    if (data.windowCart && typeof data.windowCart === "object") {
      state.windowCart = data.windowCart;
    }

    saveStateLocalOnly();
    refreshAllActiveViews();
  } finally {
    isApplyingRemoteSync = false;
  }
}

// Bazadan gələn Tranzaksiya / Xərc / ATM sənədini lokal state-lə birləşdir (Source of Truth)
function applyIncomingTransactionsSnapshot(data) {
  if (!data || typeof data !== "object") return;
  if (data.syncId && data.syncId === lastPushedSyncId) return;

  isApplyingRemoteSync = true;
  try {
    if (data.shiftDateKey) state.shiftDateKey = data.shiftDateKey;
    if (data.shiftFullDate) state.shiftFullDate = data.shiftFullDate;

    // 1. Tranzaksiyalar (closedBills) — Silinməmiş bütün qeydləri zamana görə sırala
    const txMap = (data.transactions && typeof data.transactions === "object") ? data.transactions : {};
    const txList = Object.values(txMap)
      .filter((tx) => tx && !tx.deleted)
      .map(normalizeTransactionRecord)
      .filter(Boolean)
      .sort((a, b) => (Number(a.updatedAt) || 0) - (Number(b.updatedAt) || 0));
    state.closedBills = txList;

    // 2. Xərclər (expenses)
    const expMap = (data.expenses && typeof data.expenses === "object") ? data.expenses : {};
    const expList = Object.values(expMap)
      .filter((e) => e && !e.deleted && Number(e.amount) > 0)
      .map((e) => ({
        id: e.id,
        title: e.title,
        amount: round2(e.amount),
        type: e.type === "pencere" ? "pencere" : "kafe",
        addedBy: e.addedBy || "waiter1",
        time: e.time || "00:00",
        updatedAt: Number(e.updatedAt) || 0
      }))
      .sort((a, b) => (Number(a.updatedAt) || 0) - (Number(b.updatedAt) || 0));
    state.expenses = expList;

    // 3. ATM Çıxarışları (atmTransfers)
    const atmMap = (data.atmTransfers && typeof data.atmTransfers === "object") ? data.atmTransfers : {};
    const atmList = Object.values(atmMap)
      .filter((a) => a && !a.deleted && Number(a.amount) > 0)
      .map((a) => ({
        id: a.id,
        amount: round2(a.amount),
        time: a.time || "00:00",
        date: a.date || getBusinessDateKey(),
        note: a.note || "ATM Nağdlaşdırma",
        addedBy: a.addedBy || "admin",
        updatedAt: Number(a.updatedAt) || 0
      }))
      .sort((a, b) => (Number(a.updatedAt) || 0) - (Number(b.updatedAt) || 0));
    state.atmTransfers = atmList;

    // 4. Əməliyyat Jurnalı (auditLogs — Silinməz Tarixçə)
    if (data.auditLogs && typeof data.auditLogs === "object") {
      const incomingLogs = Object.values(data.auditLogs).filter(Boolean);
      if (incomingLogs.length > 0) {
        const existingMap = new Map((state.auditLogs || []).map((l) => [l.id, l]));
        incomingLogs.forEach((log) => {
          if (log && log.id) {
            existingMap.set(log.id, log);
          }
        });
        state.auditLogs = Array.from(existingMap.values())
          .sort((a, b) => (Number(b.timestamp) || 0) - (Number(a.timestamp) || 0))
          .slice(0, 300);
        saveAuditLogs(state.auditLogs);
        if (typeof auditLogModal !== "undefined" && auditLogModal && auditLogModal.classList.contains("open")) {
          renderAuditLogModal();
        }
      }
    }

    saveStateLocalOnly();
    refreshAllActiveViews();
  } finally {
    isApplyingRemoteSync = false;
  }
}

// PARÇALI VƏ APPEND-ONLY SİNXRONİZASİYA FUNKSİYASI (Full Overwrite Qadağandır!)
function pushGranularLiveSync(options = {}) {
  // Eyni браузерdəki digər tabları dərhal məlumatlandır
  if (localBroadcast && !isApplyingRemoteSync) {
    try {
      localBroadcast.postMessage({
        clientId: CLIENT_ID,
        state: JSON.parse(JSON.stringify(state))
      });
    } catch (err) {
      // Ignore broadcast error
    }
  }

  // KRİTİK QORUMA: Firebase-dən ilk canlı snapshotlar gələnə qədər bazaya heç nə yazma!
  if (!isInitialSyncDone || isApplyingRemoteSync) return;

  const nowTs = Date.now();
  const syncId = `${CLIENT_ID}_${nowTs}_${Math.random().toString(36).slice(2, 6)}`;
  lastPushedSyncId = syncId;

  // Əgər "Günü Bitir və Sıfırla" icra olunubsa (yalnız Admin tərəfindən təsdiqlə):
  if (options.resetShift) {
    const emptyTablesMap = {};
    state.tables.forEach((t) => {
      emptyTablesMap[t.id] = {
        id: t.id,
        name: t.name,
        group: t.group,
        orders: {},
        customOrders: [],
        lastWaiter: null,
        updatedAt: nowTs
      };
    });

    if (firestoreTablesDocRef) {
      firestoreTablesDocRef.set({
        syncId,
        clientId: CLIENT_ID,
        updatedAt: nowTs,
        windowCart: {},
        tables: emptyTablesMap
      }).catch((err) => console.error("Firestore tables reset xətası:", err));
    }

    if (firestoreTxDocRef) {
      firestoreTxDocRef.set({
        syncId,
        clientId: CLIENT_ID,
        updatedAt: nowTs,
        shiftDateKey: state.shiftDateKey,
        shiftFullDate: state.shiftFullDate,
        transactions: {},
        expenses: {},
        atmTransfers: {}
      }, { merge: true }).catch((err) => console.error("Firestore transactions reset xətası:", err));
    }
    return;
  }

  // 1. Yalnız dəyişdirilmiş masaları və ya pəncərə səbətini { merge: true } ilə göndər
  const changedTableIds = Array.isArray(options.changedTableIds) ? options.changedTableIds : [];
  if ((changedTableIds.length > 0 || options.syncWindowCart) && firestoreTablesDocRef) {
    const tablesPatch = {
      syncId,
      clientId: CLIENT_ID,
      updatedAt: nowTs
    };

    if (options.syncWindowCart) {
      tablesPatch.windowCart = state.windowCart || {};
    }

    if (changedTableIds.length > 0) {
      tablesPatch.tables = {};
      changedTableIds.forEach((tId) => {
        const tObj = state.tables.find((t) => t.id === tId);
        if (tObj) {
          tablesPatch.tables[tId] = {
            id: tObj.id,
            name: tObj.name,
            group: tObj.group,
            orders: sanitizeOrdersMap(tObj.orders),
            customOrders: Array.isArray(tObj.customOrders) ? tObj.customOrders : [],
            lastWaiter: tObj.lastWaiter || null,
            updatedAt: nowTs
          };
        }
      });
    }

    firestoreTablesDocRef
      .set(tablesPatch, { merge: true })
      .then(() => updateSyncStatusUI("sync-live", "🟢 Canlı"))
      .catch((err) => console.error("Firestore masa sinxronizasiya xətası:", err));
  }

  // 2. Yeni Tranzaksiyaları (Append), Redaktələri, Xərcləri, ATM və Əməliyyat Jurnalını { merge: true } ilə göndər
  const newTxs = Array.isArray(options.newTransactions) ? options.newTransactions : [];
  const deletedTxIds = Array.isArray(options.deletedTransactionIds) ? options.deletedTransactionIds : [];
  const newExps = Array.isArray(options.newExpenses) ? options.newExpenses : [];
  const deletedExpIds = Array.isArray(options.deletedExpenseIds) ? options.deletedExpenseIds : [];
  const newAtms = Array.isArray(options.newAtmTransfers) ? options.newAtmTransfers : [];
  const deletedAtmIds = Array.isArray(options.deletedAtmIds) ? options.deletedAtmIds : [];
  const newAuditLogs = Array.isArray(options.newAuditLogs) ? options.newAuditLogs : [];

  const hasLedgerUpdates =
    newTxs.length > 0 ||
    deletedTxIds.length > 0 ||
    newExps.length > 0 ||
    deletedExpIds.length > 0 ||
    newAtms.length > 0 ||
    deletedAtmIds.length > 0 ||
    newAuditLogs.length > 0;

  if (hasLedgerUpdates && firestoreTxDocRef) {
    const txPatch = {
      syncId,
      clientId: CLIENT_ID,
      updatedAt: nowTs,
      shiftDateKey: state.shiftDateKey,
      shiftFullDate: state.shiftFullDate
    };

    if (newTxs.length > 0 || deletedTxIds.length > 0) {
      txPatch.transactions = {};
      newTxs.forEach((tx) => {
        if (tx && tx.id) {
          txPatch.transactions[tx.id] = { ...tx, deleted: false, updatedAt: nowTs };
        }
      });
      deletedTxIds.forEach((id) => {
        if (id) {
          txPatch.transactions[id] = { id, deleted: true, updatedAt: nowTs };
        }
      });
    }

    if (newExps.length > 0 || deletedExpIds.length > 0) {
      txPatch.expenses = {};
      newExps.forEach((exp) => {
        if (exp && exp.id) {
          txPatch.expenses[exp.id] = { ...exp, deleted: false, updatedAt: nowTs };
        }
      });
      deletedExpIds.forEach((id) => {
        if (id) {
          txPatch.expenses[id] = { id, deleted: true, updatedAt: nowTs };
        }
      });
    }

    if (newAtms.length > 0 || deletedAtmIds.length > 0) {
      txPatch.atmTransfers = {};
      newAtms.forEach((atm) => {
        if (atm && atm.id) {
          txPatch.atmTransfers[atm.id] = { ...atm, deleted: false, updatedAt: nowTs };
        }
      });
      deletedAtmIds.forEach((id) => {
        if (id) {
          txPatch.atmTransfers[id] = { id, deleted: true, updatedAt: nowTs };
        }
      });
    }

    if (newAuditLogs.length > 0) {
      txPatch.auditLogs = {};
      newAuditLogs.forEach((log) => {
        if (log && log.id) {
          txPatch.auditLogs[log.id] = { ...log, updatedAt: nowTs };
        }
      });
    }

    firestoreTxDocRef
      .set(txPatch, { merge: true })
      .then(() => updateSyncStatusUI("sync-live", "🟢 Canlı"))
      .catch((err) => console.error("Firestore tranzaksiya logu yazma xətası:", err));
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

    firestoreTablesDocRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_TABLES_DOC_ID);
    firestoreTxDocRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_TX_DOC_ID);
    firestoreArchiveDocRef = db.collection(FIRESTORE_COLLECTION).doc(FIRESTORE_ARCHIVE_DOC_ID);
    updateSyncStatusUI("sync-live", "🟢 Canlı");

    if (unsubscribeTablesFirestore) unsubscribeTablesFirestore();
    if (unsubscribeTxFirestore) unsubscribeTxFirestore();
    if (unsubscribeArchiveFirestore) unsubscribeArchiveFirestore();

    // 1. Parçalı Masalar Dinləyicisi (Hər masa müstəqil yenilənir)
    unsubscribeTablesFirestore = firestoreTablesDocRef.onSnapshot(
      (docSnap) => {
        updateSyncStatusUI("sync-live", "🟢 Canlı");
        if (docSnap.exists) {
          const data = docSnap.data();
          const isOwnEcho = isInitialTablesSyncDone && data && (data.clientId === CLIENT_ID || data.syncId === lastPushedSyncId);
          if (data && !isOwnEcho) {
            applyIncomingTablesSnapshot(data);
          }
          isInitialTablesSyncDone = true;
          markInitialSyncIfReady();
        } else if (!docSnap.metadata.fromCache) {
          isInitialTablesSyncDone = true;
          markInitialSyncIfReady();
          pushGranularLiveSync({
            changedTableIds: state.tables.map((t) => t.id),
            syncWindowCart: true
          });
        }
      },
      (err) => {
        console.error("Firestore tables onSnapshot xətası:", err);
        updateSyncStatusUI("sync-error", "🔴 Xəta");
      }
    );

    // 2. Sarsılmaz Tranzaksiya Logu Dinləyicisi (Source of Truth — Kassa və Satışlar)
    unsubscribeTxFirestore = firestoreTxDocRef.onSnapshot(
      (docSnap) => {
        updateSyncStatusUI("sync-live", "🟢 Canlı");
        if (docSnap.exists) {
          const data = docSnap.data();
          const isOwnEcho = isInitialTxSyncDone && data && (data.clientId === CLIENT_ID || data.syncId === lastPushedSyncId);
          if (data && !isOwnEcho) {
            applyIncomingTransactionsSnapshot(data);
          }
          isInitialTxSyncDone = true;
          markInitialSyncIfReady();
        } else if (!docSnap.metadata.fromCache) {
          isInitialTxSyncDone = true;
          markInitialSyncIfReady();
          if (state.closedBills.length > 0 || state.expenses.length > 0 || state.atmTransfers.length > 0) {
            pushGranularLiveSync({
              newTransactions: state.closedBills,
              newExpenses: state.expenses,
              newAtmTransfers: state.atmTransfers
            });
          }
        }
      },
      (err) => {
        console.error("Firestore transactions onSnapshot xətası:", err);
        updateSyncStatusUI("sync-error", "🔴 Xəta");
      }
    );

    // 3. Ayrı Arxiv Dinləyicisi
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

// Hər 60 saniyədən bir tarix açarını yoxla
setInterval(checkAndExecuteAutoEndDay, 60000);

// ============================================================================
// HADİSƏ DİNLƏYİCİLƏRİ (EVENT LISTENERS)
// ============================================================================
modeCafeBtn.addEventListener("click", () => setAppMode("kafe"));
modeWindowBtn.addEventListener("click", () => setAppMode("pencere"));

if (windowPayCashBtn) {
  windowPayCashBtn.addEventListener("click", () => setWindowPaymentMethod("cash"));
}
if (windowPayCardBtn) {
  windowPayCardBtn.addEventListener("click", () => setWindowPaymentMethod("card"));
}
windowClearCartBtn.addEventListener("click", clearWindowCart);
windowCheckoutBtn.addEventListener("click", checkoutWindowCart);

backToMainBtn.addEventListener("click", closeTableScreen);
if (saveOrderBtn) {
  saveOrderBtn.addEventListener("click", confirmAndSaveActiveTableOrder);
}
closeBillBtn.addEventListener("click", closeActiveTableBill);

// Menyu Sürətli Axtarış Xanası və Açılan Nəticələr (Dropdown Overlay) Dinləyiciləri
if (menuSearchInput) {
  menuSearchInput.addEventListener("input", () => {
    const query = menuSearchInput.value.trim().toLowerCase();
    if (clearMenuSearchBtn) {
      clearMenuSearchBtn.style.display = query ? "inline-flex" : "none";
    }

    if (!menuSearchResultsDropdown) return;

    if (!query) {
      menuSearchResultsDropdown.style.display = "none";
      menuSearchResultsDropdown.innerHTML = "";
      return;
    }

    const matched = MENU_CATALOG.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.price.toFixed(2).includes(query)
    );

    menuSearchResultsDropdown.innerHTML = "";

    if (matched.length === 0) {
      menuSearchResultsDropdown.innerHTML = `
        <div class="empty-order-box" style="padding: 10px; font-size: 0.88rem;">
          "${query}" adına uyğun məhsul tapılmadı.
        </div>
      `;
    } else {
      matched.slice(0, 12).forEach((item) => {
        const itemEl = document.createElement("div");
        itemEl.className = "menu-search-result-item";
        const catObj = MENU_CATEGORIES.find((c) => c.id === item.category);
        itemEl.innerHTML = `
          <div class="search-res-info">
            <span class="search-res-name">${item.name}</span>
            <span class="search-res-cat">${catObj ? catObj.label : ""} (${item.unit})</span>
          </div>
          <strong class="search-res-price">${formatMoney(item.price)}</strong>
        `;
        itemEl.addEventListener("click", () => {
          const table = state.tables.find((t) => t.id === activeTableId);
          if (table) {
            updateTableItemQty(table.id, item.id, 1);
            menuSearchInput.value = "";
            if (clearMenuSearchBtn) clearMenuSearchBtn.style.display = "none";
            menuSearchResultsDropdown.style.display = "none";
            menuSearchResultsDropdown.innerHTML = "";
            showToast(`➕ ${item.name} masaya əlavə edildi`);
          }
        });
        menuSearchResultsDropdown.appendChild(itemEl);
      });
    }

    menuSearchResultsDropdown.style.display = "flex";
  });
}

if (clearMenuSearchBtn) {
  clearMenuSearchBtn.addEventListener("click", () => {
    if (menuSearchInput) {
      menuSearchInput.value = "";
      clearMenuSearchBtn.style.display = "none";
      if (menuSearchResultsDropdown) {
        menuSearchResultsDropdown.style.display = "none";
        menuSearchResultsDropdown.innerHTML = "";
      }
      menuSearchInput.focus();
    }
  });
}

// Axtarış xanasından kənara kliklədikdə açılan nəticələri gizlət
document.addEventListener("click", (e) => {
  if (menuSearchResultsDropdown && !e.target.closest(".menu-search-wrap")) {
    menuSearchResultsDropdown.style.display = "none";
  }
});

// Ödəniş Metodu (💵 Nağd / 💳 Kart) Modalı Dinləyiciləri
if (modalPayCashBtn) {
  modalPayCashBtn.addEventListener("click", () => setTablePaymentMethod("cash"));
}
if (modalPayCardBtn) {
  modalPayCardBtn.addEventListener("click", () => setTablePaymentMethod("card"));
}
if (cancelPaymentMethodBtn) {
  cancelPaymentMethodBtn.addEventListener("click", closePaymentMethodModal);
}
if (confirmCloseBillWithMethodBtn) {
  confirmCloseBillWithMethodBtn.addEventListener("click", confirmCloseActiveTableBill);
}
if (paymentMethodModal) {
  paymentMethodModal.addEventListener("click", (e) => {
    if (e.target === paymentMethodModal) closePaymentMethodModal();
  });
}

// Masanı Köçür ("🔄 Masanı Köçür") Modalı Dinləyiciləri
if (openTransferTableBtn) {
  openTransferTableBtn.addEventListener("click", openTransferTableModal);
}
if (closeTransferModalBtn) {
  closeTransferModalBtn.addEventListener("click", closeTransferTableModal);
}
if (cancelMergeTransferBtn) {
  cancelMergeTransferBtn.addEventListener("click", () => {
    pendingMergeTargetTableId = null;
    if (transferMergeConfirmBox) transferMergeConfirmBox.style.display = "none";
  });
}
if (confirmMergeTransferBtn) {
  confirmMergeTransferBtn.addEventListener("click", () => {
    if (activeTableId && pendingMergeTargetTableId) {
      executeTableTransfer(activeTableId, pendingMergeTargetTableId);
    }
  });
}
if (transferTableModal) {
  transferTableModal.addEventListener("click", (e) => {
    if (e.target === transferTableModal) closeTransferTableModal();
  });
}

// ATM Çıxarışı ("🏧 Kartdan Nağda Çevir") Modalı Dinləyiciləri
if (openAtmTransferBtn) {
  openAtmTransferBtn.addEventListener("click", openAtmTransferModal);
}
if (closeAtmModalBtn) {
  closeAtmModalBtn.addEventListener("click", closeAtmTransferModal);
}
if (atmTransferModal) {
  atmTransferModal.addEventListener("click", (e) => {
    if (e.target === atmTransferModal) closeAtmTransferModal();
  });
}

// Bağlanmış Çekin Redaktəsi ("✏️ Redaktə") Modalı Dinləyiciləri
if (closeEditBillModalBtn) {
  closeEditBillModalBtn.addEventListener("click", closeEditBillModal);
}
if (editBillCashBtn) {
  editBillCashBtn.addEventListener("click", () => {
    if (!editingBillContext) return;
    editingBillContext.draftPaymentMethod = "cash";
    renderEditBillModalContent();
  });
}
if (editBillCardBtn) {
  editBillCardBtn.addEventListener("click", () => {
    if (!editingBillContext) return;
    editingBillContext.draftPaymentMethod = "card";
    renderEditBillModalContent();
  });
}
if (editBillAddItemBtn) {
  editBillAddItemBtn.addEventListener("click", addMenuItemToEditedBill);
}
if (saveEditedBillBtn) {
  saveEditedBillBtn.addEventListener("click", saveEditedBillChanges);
}
if (editBillModal) {
  editBillModal.addEventListener("click", (e) => {
    if (e.target === editBillModal) closeEditBillModal();
  });
}

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

if (exportReportCsvBtn) {
  exportReportCsvBtn.addEventListener("click", () => {
    downloadShiftCsv(state, "BabaBala_Gunluk_Hesabat");
  });
}

// Xərc Redaktə Modalı Dinləyiciləri
if (expenseEditForm) {
  expenseEditForm.addEventListener("submit", handleExpenseEditFormSubmit);
}
if (closeExpenseEditModalBtn) {
  closeExpenseEditModalBtn.addEventListener("click", closeExpenseEditModal);
}
if (expenseEditModal) {
  expenseEditModal.addEventListener("click", (e) => {
    if (e.target === expenseEditModal) closeExpenseEditModal();
  });
}

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

if (endDayResetBtn) {
  endDayResetBtn.addEventListener("click", openConfirmResetModal);
}

// 2 Mərhələli Təhlükəsizlik Kilidi Dinləyiciləri
if (dangerConfirmInput) {
  dangerConfirmInput.addEventListener("input", () => {
    const val = dangerConfirmInput.value.trim().toUpperCase();
    if (dangerExecuteBtn) {
      dangerExecuteBtn.disabled = val !== "SİL";
    }
  });

  dangerConfirmInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && dangerExecuteBtn && !dangerExecuteBtn.disabled) {
      dangerExecuteBtn.click();
    }
  });
}

if (dangerCancelBtn) {
  dangerCancelBtn.addEventListener("click", closeDangerConfirmModal);
}

if (dangerExecuteBtn) {
  dangerExecuteBtn.addEventListener("click", () => {
    const val = dangerConfirmInput ? dangerConfirmInput.value.trim().toUpperCase() : "";
    if (val !== "SİL") return;
    const action = pendingDangerAction;
    closeDangerConfirmModal();
    if (typeof action === "function") {
      action();
    }
  });
}

if (dangerConfirmModal) {
  dangerConfirmModal.addEventListener("click", (e) => {
    if (e.target === dangerConfirmModal) closeDangerConfirmModal();
  });
}

// Sadə Kartdan Nağda Keçir Dinləyiciləri
if (quickAtmTransferBtn) {
  quickAtmTransferBtn.addEventListener("click", openQuickAtmModal);
}
if (cancelQuickAtmBtn) {
  cancelQuickAtmBtn.addEventListener("click", closeQuickAtmModal);
}
if (confirmQuickAtmBtn) {
  confirmQuickAtmBtn.addEventListener("click", handleConfirmQuickAtm);
}
if (quickAtmModal) {
  quickAtmModal.addEventListener("click", (e) => {
    if (e.target === quickAtmModal) closeQuickAtmModal();
  });
}
if (quickAtmInput) {
  quickAtmInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleConfirmQuickAtm();
    }
  });
}

// Qaranlıq Rejim Düyməsi
if (themeToggleBtn) themeToggleBtn.addEventListener("click", toggleTheme);

// Əməliyyat Jurnalı (Tarixçə) Modalı Dinləyiciləri
if (openAuditLogBtn) {
  openAuditLogBtn.addEventListener("click", openAuditLogModal);
}
if (closeAuditLogBtn) {
  closeAuditLogBtn.addEventListener("click", closeAuditLogModal);
}
if (auditLogModal) {
  auditLogModal.addEventListener("click", (e) => {
    if (e.target === auditLogModal) closeAuditLogModal();
  });
}
if (auditSearchInput) {
  auditSearchInput.addEventListener("input", () => {
    renderAuditLogModal();
  });
}
if (auditFilterChips && auditFilterChips.length > 0) {
  auditFilterChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      auditFilterChips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentAuditFilter = chip.getAttribute("data-filter") || "all";
      renderAuditLogModal();
    });
  });
}

// Rəsmi Çek / Qəbz (PDF, Çap və WhatsApp) Modalı Dinləyiciləri
if (printReportVoucherBtn) {
  printReportVoucherBtn.addEventListener("click", () => {
    openReceiptVoucherModal(state);
  });
}
if (closeReceiptVoucherBtn) {
  closeReceiptVoucherBtn.addEventListener("click", closeReceiptVoucherModal);
}
if (receiptVoucherModal) {
  receiptVoucherModal.addEventListener("click", (e) => {
    if (e.target === receiptVoucherModal) closeReceiptVoucherModal();
  });
}
if (printReceiptDocBtn) {
  printReceiptDocBtn.addEventListener("click", () => {
    window.print();
  });
}
if (copyWhatsAppVoucherBtn) {
  copyWhatsAppVoucherBtn.addEventListener("click", () => {
    const targetShift = currentVoucherShift || state;
    copyWhatsAppVoucherText(targetShift);
  });
}

// ============================================================================
// İLK YÜKLƏMƏ (BAŞLANĞIC)
// ============================================================================
applyTheme(getSavedTheme());
ensureRoleSelectorModal();
initBrandLogoTripleTap();
initReportAccordions();
applyRolePermissions();
setAppMode("kafe");
if (needsInitialRoleSelection) {
  openRoleSelectorModal(preselectedRoleForAuth);
}
initFirebaseSync();
