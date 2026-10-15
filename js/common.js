/* ============================================================
   Razq Store — المشترك بين الصفحات:
   الثيم، الأيقونات، الهيدر/الفوتر، تسجيل الدخول، السلة، الإشعارات
   ============================================================ */
(function () {
  const CFG = window.RAZQ_CONFIG || {};
  const configured = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY);
  const sb = configured && window.supabase ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

  /* ---------- أيقونات SVG ---------- */
  const ICONS = {
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    headset: '<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>',
    ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><path d="M13 5v2M13 17v2M13 11v2"/>',
    rules: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    minus: '<path d="M5 12h14"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    gamepad: '<path d="M6 12h4M8 10v4M15 13h.01M18 11h.01"/><rect x="2" y="6" width="20" height="12" rx="4"/>',
    gem: '<path d="M6 3h12l4 6-10 12L2 9z"/><path d="M11 3 8 9l4 12 4-12-3-6M2 9h20"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    up: '<path d="m5 12 7-7 7 7M12 19V5"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  };
  const FILL = {
    discord: '<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>',
    google: '<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>',
    starf: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
  };
  const ic = (n, extra = "") => {
    if (FILL[n]) return `<svg class="ic fill ${extra}" viewBox="0 0 24 24" aria-hidden="true">${FILL[n]}</svg>`;
    return `<svg class="ic ${extra}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n] || ""}</svg>`;
  };

  /* ---------- أدوات ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  /* ---------- العملات: الأسعار تحفظ بالدينار الكويتي وتتحول حسب دولة الزائر ---------- */
  const BASE = "KWD";
  const SYM = { KWD: "د.ك", SAR: "ر.س", AED: "د.إ", QAR: "ر.ق", BHD: "د.ب", OMR: "ر.ع", JOD: "د.أ", EGP: "ج.م", IQD: "د.ع", MAD: "د.م", TRY: "₺", USD: "$", EUR: "€", GBP: "£" };
  const DEC = { KWD: 3, BHD: 3, OMR: 3, JOD: 3, IQD: 0 };
  const COUNTRY_CUR = { KW: "KWD", SA: "SAR", AE: "AED", QA: "QAR", BH: "BHD", OM: "OMR", JO: "JOD", EG: "EGP", IQ: "IQD", MA: "MAD", TR: "TRY", US: "USD", GB: "GBP",
    DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR", BE: "EUR", AT: "EUR", PT: "EUR", IE: "EUR", GR: "EUR", FI: "EUR" };
  let curCode = BASE, rates = { KWD: 1 };
  const num = (v, d) => (+v).toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: d });
  const fmt = (kwd) => {
    const v = (+kwd || 0) * (rates[curCode] || 1), d = DEC[curCode] ?? 2;
    return `${num(v, d)} ${SYM[curCode] || curCode}`;
  };
  const fmtBase = (kwd) => `${num(kwd, 3)} ${SYM.KWD}`;
  async function initCurrency() {
    const sel = $("#curSel");
    const now = Date.now();
    try { const c = JSON.parse(localStorage.getItem("razq-rates") || "null"); if (c && now - c.t < 12 * 3600e3) rates = c.r; } catch (e) {}
    if (Object.keys(rates).length < 3) {
      try {
        const r = await fetch("https://open.er-api.com/v6/latest/KWD").then((x) => x.json());
        if (r && r.rates) { rates = r.rates; localStorage.setItem("razq-rates", JSON.stringify({ t: now, r: rates })); }
      } catch (e) {}
    }
    let want = null;
    try { want = localStorage.getItem("razq-cur"); } catch (e) {}
    if (!want) {
      let cc = null;
      try { cc = (await fetch("https://api.country.is/").then((x) => x.json())).country; } catch (e) {}
      want = COUNTRY_CUR[cc] || (rates[BASE] && cc && rates[COUNTRY_CUR[cc]] ? COUNTRY_CUR[cc] : BASE);
    }
    setCurrency(rates[want] ? want : BASE, false);
    if (sel) {
      const list = Object.keys(SYM).filter((k) => rates[k]);
      sel.innerHTML = list.map((k) => `<option value="${k}">${k} — ${SYM[k]}</option>`).join("");
      sel.value = curCode;
      sel.onchange = () => setCurrency(sel.value, true);
    }
  }
  function setCurrency(code, save) {
    curCode = code;
    if (save) { try { localStorage.setItem("razq-cur", code); } catch (e) {} }
    const sel = $("#curSel"); if (sel) sel.value = code;
    renderCart();
    document.dispatchEvent(new Event("razq:cur"));
  }
  const money = (n) => num(n, 3);
  const cur = SYM.KWD;
  function toast(msg, type = "ok") {
    let box = $(".toasts");
    if (!box) { box = document.createElement("div"); box.className = "toasts"; document.body.appendChild(box); }
    const t = document.createElement("div");
    t.className = "toast " + (type === "err" ? "err" : "");
    t.innerHTML = (type === "err" ? "" : ic("check")) + `<span>${esc(msg)}</span>`;
    box.appendChild(t);
    setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
  }
  function ripple(e) {
    const b = e.target.closest(".btn");
    if (!b) return;
    const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height);
    const s = document.createElement("span");
    s.className = "ripple";
    s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    b.appendChild(s);
    setTimeout(() => s.remove(), 600);
  }
  function observeReveal(root = document) {
    const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: 0.12 });
    $$(".reveal:not(.in)", root).forEach((el) => io.observe(el));
  }

  /* ---------- الثيم (فاتح / داكن) ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("razq-theme", t); } catch (e) {}
    const b = $("#themeBtn");
    if (b) b.innerHTML = `<span class="theme-ic">${ic(t === "dark" ? "sun" : "moon")}</span>`;
  }
  const currentTheme = () => document.documentElement.getAttribute("data-theme") || "dark";

  /* ---------- الهيدر والفوتر والنوافذ ---------- */
  function buildShell() {
    const page = location.pathname.split("/").pop() || "index.html";
    const onHome = page === "" || page === "index.html";
    const hdr = $("#site-header");
    if (hdr) hdr.innerHTML = `
      <header class="hdr"><div class="wrap hdr-in">
        <a class="brand" href="index.html"><img src="assets/logo.png" alt="Razq"><span>Razq<small>STORE</small></span></a>
        <nav class="nav" id="nav">
          <a href="index.html" class="${onHome ? "active" : ""}">الرئيسية</a>
          <a href="index.html#products">المنتجات</a>
          <a href="index.html#reviews">التقييمات</a>
          <a href="rules.html" class="${page === "rules.html" ? "active" : ""}">القوانين</a>
        </nav>
        <div class="hdr-act">
          <select class="cur-sel" id="curSel" aria-label="العملة"><option>KWD</option></select>
          <button class="icon-btn" id="themeBtn" aria-label="تبديل الثيم"></button>
          <button class="icon-btn" id="cartBtn" aria-label="السلة">${ic("cart")}<span class="badge" id="cartBadge">0</span></button>
          <div id="authSlot"></div>
          <button class="icon-btn burger" id="burger" aria-label="القائمة">${ic("menu")}</button>
        </div>
      </div></header>`;

    const ftr = $("#site-footer");
    if (ftr) ftr.innerHTML = `
      <footer><div class="wrap">
        <div class="foot">
          <div><a class="brand" href="index.html"><img src="assets/logo.png" alt="Razq"><span>Razq<small>STORE</small></span></a>
            <p>وجهتك لمنتجات الديسكورد وفايف ام بجودة عالية وتسليم سريع ودعم متواصل.</p></div>
          <div><h4>روابط سريعة</h4><ul>
            <li><a href="index.html#products">${ic("grid")} المنتجات</a></li>
            <li><a href="index.html#reviews">${ic("star")} التقييمات</a></li>
            <li><a href="rules.html">${ic("rules")} القوانين</a></li></ul></div>
          <div><h4>تواصل معنا</h4><ul>
            <li><a href="${esc(CFG.DISCORD_INVITE)}" data-discord target="_blank" rel="noopener">${ic("discord")} سيرفر الديسكورد</a></li>
            <li><a href="${esc(CFG.DISCORD_INVITE)}" data-discord target="_blank" rel="noopener">${ic("ticket")} افتح تذكرة</a></li></ul></div>
        </div>
        <div class="copy">© ${new Date().getFullYear()} Razq Store — جميع الحقوق محفوظة</div>
      </div></footer>
      <button class="icon-btn to-top" id="toTop" aria-label="للأعلى">${ic("up")}</button>`;

    document.body.insertAdjacentHTML("beforeend", `
      <div class="overlay" id="overlay"></div>
      <aside class="drawer" id="drawer" aria-label="السلة">
        <header><h3>${ic("cart")} سلة التسوق</h3><button class="icon-btn" id="closeCart" aria-label="إغلاق">${ic("x")}</button></header>
        <div class="cart-list" id="cartList"></div>
        <div class="cart-foot" id="cartFoot"></div>
      </aside>
      <div class="modal" id="authModal"><div class="box">
        <button class="x" data-close>${ic("x")}</button>
        <img src="assets/logo.png" alt="Razq">
        <h3>أهلاً بك في Razq</h3>
        <p>سجّل أو ادخل بحسابك للتقييم وإتمام الطلبات</p>
        <div class="stack">
          ${(CFG.AUTH_PROVIDERS || ["discord"]).includes("discord") ? `<button class="btn btn-discord" data-provider="discord">${ic("discord")} المتابعة بحساب ديسكورد</button>` : ""}
          ${(CFG.AUTH_PROVIDERS || ["discord"]).includes("google") ? `<button class="btn btn-google" data-provider="google">${ic("google")} المتابعة بحساب جوجل</button>` : ""}
        </div>
        <p class="note" id="authNote"></p>
      </div></div>
      <div class="modal" id="doneModal"><div class="box">
        <button class="x" data-close>${ic("x")}</button>
        <div class="ok-ic">${ic("check")}</div>
        <h3>تم تسجيل طلبك</h3>
        <div class="order-no" id="orderNo"></div>
        <p>الدفع واستلام الطلب يتم داخل الديسكورد.<br><b>روح الديسكورد وافتح تذكرة</b> وأرسل رقم طلبك.</p>
        <a class="btn btn-discord btn-block" data-discord href="${esc(CFG.DISCORD_INVITE)}" target="_blank" rel="noopener">${ic("discord")} روح الديسكورد</a>
      </div></div>`);

    if (!configured) $("#authNote").textContent = "تنبيه: لم يتم ربط قاعدة البيانات بعد (Supabase) — راجع README.";
  }

  /* ---------- تسجيل الدخول ---------- */
  let user = null;
  const getUser = () => user;
  const meta = (u) => {
    const m = u?.user_metadata || {};
    return {
      id: u?.id,
      name: m.full_name || m.name || m.custom_claims?.global_name || m.user_name || (u?.email || "عضو").split("@")[0],
      avatar: m.avatar_url || m.picture || "",
      provider: u?.app_metadata?.provider || "",
    };
  };
  function renderAuth() {
    const slot = $("#authSlot");
    if (!slot) return;
    if (!user) {
      slot.innerHTML = `<button class="btn btn-primary btn-sm" id="loginBtn">${ic("user")} دخول</button>`;
      $("#loginBtn").onclick = openAuth;
    } else {
      const m = meta(user);
      slot.innerHTML = `<div class="user-chip" title="${esc(m.name)}">
        ${m.avatar ? `<img src="${esc(m.avatar)}" alt="">` : `<div class="avatar" style="width:32px;height:32px">${esc(m.name[0] || "?")}</div>`}
        <span>${esc(m.name)}</span>
        <button class="icon-btn" id="logoutBtn" style="width:32px;height:32px;border-radius:10px" aria-label="خروج">${ic("logout")}</button></div>`;
      $("#logoutBtn").onclick = async () => { await sb?.auth.signOut(); user = null; renderAuth(); toast("تم تسجيل الخروج"); document.dispatchEvent(new Event("razq:auth")); };
    }
  }
  function openAuth() { $("#authModal").classList.add("show"); }
  async function signIn(provider) {
    if (!sb) return toast("الربط مع قاعدة البيانات غير مفعّل — راجع README", "err");
    const { error } = await sb.auth.signInWithOAuth({ provider, options: { redirectTo: location.origin + location.pathname } });
    if (error) toast("تعذر تسجيل الدخول: " + error.message, "err");
  }
  async function initAuth() {
    if (!sb) { renderAuth(); return; }
    const { data } = await sb.auth.getSession();
    user = data.session?.user || null;
    renderAuth();
    document.dispatchEvent(new Event("razq:auth"));
    sb.auth.onAuthStateChange((ev, session) => {
      user = session?.user || null;
      renderAuth();
      if (ev === "SIGNED_IN") { $("#authModal").classList.remove("show"); }
      document.dispatchEvent(new Event("razq:auth"));
    });
  }

  /* ---------- السلة ---------- */
  const CART_KEY = "razq-cart";
  let cart = [];
  let coupon = null; // {code, percent}
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]"); } catch (e) {}
  const saveCart = () => { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} };
  const subtotal = () => cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = () => (coupon ? (subtotal() * coupon.percent) / 100 : 0);
  const total = () => Math.max(0, subtotal() - discount());

  function openCart() { $("#drawer").classList.add("show"); $("#overlay").classList.add("show"); }
  function closeCart() { $("#drawer").classList.remove("show"); $("#overlay").classList.remove("show"); }
  function addToCart(p) {
    const ex = cart.find((i) => i.id === p.id);
    if (ex) ex.qty++;
    else cart.push({ id: p.id, name: p.name, price: +p.price, category: p.category, image: p.image_url || "", qty: 1 });
    saveCart(); renderCart();
    const b = $("#cartBadge"); b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump");
    toast("أضيف للسلة: " + p.name);
  }
  function renderCart() {
    const n = cart.reduce((s, i) => s + i.qty, 0);
    const badge = $("#cartBadge");
    if (badge) { badge.textContent = n; badge.classList.toggle("show", n > 0); }
    const list = $("#cartList"), foot = $("#cartFoot");
    if (!list) return;
    if (!cart.length) {
      list.innerHTML = `<div class="cart-empty">${ic("cart")}<b>السلة فارغة</b><button class="btn btn-ghost btn-sm" id="contShop">متابعة التسوق</button></div>`;
      foot.innerHTML = "";
      $("#contShop").onclick = () => { closeCart(); location.hash = "#products"; };
      return;
    }
    list.innerHTML = cart.map((i) => `
      <div class="ci" data-id="${esc(i.id)}">
        <div class="th">${i.image ? `<img src="${esc(i.image)}" alt="">` : ic(i.category === "fivem" ? "gamepad" : "gem")}</div>
        <div><b>${esc(i.name)}</b><small>${fmt(i.price)}</small>
          <div class="qty"><button data-a="dec" aria-label="إنقاص">${ic("minus")}</button><span>${i.qty}</span><button data-a="inc" aria-label="زيادة">${ic("plus")}</button></div></div>
        <button class="rm" data-a="rm" aria-label="حذف">${ic("trash")}</button>
      </div>`).join("");
    foot.innerHTML = `
      <div class="coupon"><input type="text" id="couponIn" placeholder="كود الخصم" value="${coupon ? esc(coupon.code) : ""}"><button class="btn btn-ghost btn-sm" id="couponBtn">تطبيق</button></div>
      <div class="sum"><span>المجموع</span><span>${fmt(subtotal())}</span></div>
      ${coupon ? `<div class="sum"><span>خصم ${coupon.percent}%</span><span>- ${fmt(discount())}</span></div>` : ""}
      <div class="sum total"><span>الإجمالي</span><span>${fmt(total())}</span></div>
      ${curCode !== BASE ? `<div class="sum"><small>السعر الأساسي بالدينار الكويتي (تقريبي بعملتك)</small><small>${fmtBase(total())}</small></div>` : ""}
      <button class="btn btn-primary btn-block" id="checkoutBtn">${ic("ticket")} إتمام الطلب</button>`;
    $("#couponBtn").onclick = applyCoupon;
    $("#checkoutBtn").onclick = checkout;
  }
  async function applyCoupon() {
    const code = $("#couponIn").value.trim().toUpperCase();
    if (!code) { coupon = null; renderCart(); return; }
    if (!sb) return toast("الكوبونات تحتاج ربط قاعدة البيانات", "err");
    const { data } = await sb.from("coupons").select("code,percent").eq("code", code).eq("active", true).maybeSingle();
    if (!data) { coupon = null; renderCart(); return toast("كود الخصم غير صحيح", "err"); }
    coupon = data; renderCart(); toast(`تم تطبيق خصم ${data.percent}%`);
  }
  async function checkout() {
    if (!cart.length) return;
    if (!user) { closeCart(); toast("سجّل دخولك أولاً لإتمام الطلب", "err"); return openAuth(); }
    const btn = $("#checkoutBtn"); btn.disabled = true;
    let orderNo = "—";
    if (sb) {
      const m = meta(user);
      const { data, error } = await sb.from("orders").insert({
        user_id: user.id, customer_name: m.name,
        items: cart.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        total: total(), coupon: coupon?.code || null,
      }).select("order_no").single();
      if (error) { btn.disabled = false; return toast("تعذر إنشاء الطلب: " + error.message, "err"); }
      orderNo = "#" + data.order_no;
    } else {
      orderNo = "#" + Math.floor(1000 + Math.random() * 9000);
    }
    $("#orderNo").textContent = "رقم الطلب " + orderNo;
    cart = []; coupon = null; saveCart(); renderCart(); closeCart();
    $("#doneModal").classList.add("show");
  }
  function bindCartEvents() {
    $("#cartList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-a]"); if (!b) return;
      const id = b.closest(".ci").dataset.id, it = cart.find((i) => String(i.id) === id);
      if (!it) return;
      if (b.dataset.a === "inc") it.qty++;
      if (b.dataset.a === "dec") it.qty = Math.max(1, it.qty - 1);
      if (b.dataset.a === "rm") cart = cart.filter((i) => i !== it);
      saveCart(); renderCart();
    });
  }

  /* ---------- إعدادات من قاعدة البيانات (إعلان + رابط الديسكورد) ---------- */
  async function loadSettings() {
    if (!sb) return;
    const { data } = await sb.from("settings").select("key,value");
    const s = Object.fromEntries((data || []).map((r) => [r.key, r.value]));
    if (s.discord_invite) {
      CFG.DISCORD_INVITE = s.discord_invite;
      $$("[data-discord]").forEach((a) => (a.href = s.discord_invite));
    }
    if (s.announcement_on === "true" && s.announcement) {
      const bar = document.createElement("div");
      bar.className = "announce"; bar.textContent = s.announcement;
      document.body.prepend(bar);
    }
  }

  /* ---------- تشغيل ---------- */
  function init() {
    buildShell();
    applyTheme(currentTheme());
    $("#themeBtn").onclick = () => applyTheme(currentTheme() === "dark" ? "light" : "dark");
    $("#burger").onclick = () => $("#nav").classList.toggle("show");
    $$("#nav a").forEach((a) => a.addEventListener("click", () => $("#nav").classList.remove("show")));
    $("#cartBtn").onclick = openCart;
    $("#closeCart").onclick = closeCart;
    $("#overlay").onclick = closeCart;
    $$(".modal").forEach((m) => m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-close]")) m.classList.remove("show"); }));
    $$("[data-provider]").forEach((b) => (b.onclick = () => signIn(b.dataset.provider)));
    document.addEventListener("click", ripple);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeCart(); $$(".modal").forEach((m) => m.classList.remove("show")); } });
    const toTop = $("#toTop");
    if (toTop) { toTop.onclick = () => window.scrollTo({ top: 0, behavior: "smooth" }); addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 500), { passive: true }); }
    bindCartEvents(); renderCart(); observeReveal(); initAuth(); loadSettings(); initCurrency();
  }

  window.Razq = { CFG, sb, configured, ic, $, $$, esc, money, cur, fmt, toast, observeReveal, addToCart, getUser, meta, openAuth, init };
})();
