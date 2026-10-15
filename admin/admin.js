/* ============================================================
   Razq Admin — لوحة التحكم
   الحماية الحقيقية في قاعدة البيانات (RLS + جدول admins)،
   وليست في إخفاء الرابط أو الدومين.
   ============================================================ */
(function () {
  const CFG = window.RAZQ_CONFIG || {};
  const sb = CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;
  const cur = "د.ك"; // كل الأسعار بالدينار الكويتي
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const money = (n) => (+n || 0).toLocaleString("en", { maximumFractionDigits: 3 });
  const dt = (d) => new Date(d).toLocaleString("ar", { dateStyle: "medium", timeStyle: "short" });

  const P = {
    chart: '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    mega: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    cog: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    plus: '<path d="M5 12h14M12 5v14"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
    moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    cash: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/>',
  };
  const FILL = {
    discord: '<path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>',
    google: '<path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>',
  };
  const ic = (n) => FILL[n] ? `<svg class="ic fill" viewBox="0 0 24 24">${FILL[n]}</svg>` : `<svg class="ic" viewBox="0 0 24 24">${P[n] || ""}</svg>`;

  function toast(msg, err) {
    let box = $(".toasts"); if (!box) { box = document.createElement("div"); box.className = "toasts"; document.body.appendChild(box); }
    const t = document.createElement("div"); t.className = "toast" + (err ? " err" : ""); t.innerHTML = `${err ? "" : ic("check")}<span>${esc(msg)}</span>`;
    box.appendChild(t); setTimeout(() => { t.classList.add("out"); setTimeout(() => t.remove(), 300); }, 3200);
  }
  const theme = () => document.documentElement.getAttribute("data-theme");
  function toggleTheme() { const t = theme() === "dark" ? "light" : "dark"; document.documentElement.setAttribute("data-theme", t); try { localStorage.setItem("razq-theme", t); } catch (e) {} const b = $("#thm"); if (b) b.innerHTML = ic(t === "dark" ? "sun" : "moon"); }

  const app = $("#app");
  let me = null, view = "dash";

  /* ---------- بوابة الدخول (يوزر + باسورد، التحقق داخل Supabase) ---------- */
  function gate(msg, showLogin = true) {
    app.innerHTML = `<div class="gate"><div class="box">
      <img src="../assets/logo.png" alt="Razq"><h2>لوحة تحكم Razq</h2><p>${esc(msg)}</p>
      ${showLogin ? `<form class="stack" id="gf" autocomplete="off">
        <input type="text" id="gu" placeholder="اسم المستخدم" required autocomplete="username">
        <input type="password" id="gp" placeholder="كلمة السر" required autocomplete="current-password">
        <button class="btn btn-primary" type="submit">دخول</button></form>` : `${sb ? `<div class="stack"><button class="btn btn-ghost" id="lo">${ic("out")} تسجيل الخروج</button></div>` : ""}`}
      </div></div>`;
    const gf = $("#gf");
    if (gf) gf.onsubmit = async (e) => {
      e.preventDefault();
      const u = $("#gu").value.trim();
      const email = u.includes("@") ? u : `${u}@${CFG.ADMIN_EMAIL_DOMAIN || "razq.admin"}`;
      const { error } = await sb.auth.signInWithPassword({ email, password: $("#gp").value });
      if (error) return toast("بيانات الدخول غير صحيحة", true);
      boot();
    };
    const lo = $("#lo"); if (lo) lo.onclick = async () => { await sb.auth.signOut(); location.reload(); };
  }

  async function boot() {
    if (!sb) return gate("لم يتم ربط قاعدة البيانات بعد. عبّي config.js (راجع README).", false);
    const { data } = await sb.auth.getSession();
    me = data.session?.user;
    if (!me) return gate("أدخل بيانات الأدمن للمتابعة");
    const { data: row } = await sb.from("admins").select("user_id").eq("user_id", me.id).maybeSingle();
    if (!row) return gate("هذا الحساب لا يملك صلاحية الأدمن.", false);
    shell();
  }

  /* ---------- الهيكل ---------- */
  const NAV = [
    ["dash", "chart", "الإحصائيات"], ["products", "box", "المنتجات"], ["orders", "cart", "الطلبات"],
    ["customers", "users", "العملاء"], ["users", "user", "المسجلين"], ["marketing", "mega", "التسويق"],
    ["reviews", "star", "التقييمات"], ["settings", "cog", "إعدادات الموقع"],
  ];
  const TITLES = Object.fromEntries(NAV.map((n) => [n[0], n[2]]));
  function shell() {
    const m = me.user_metadata || {};
    app.innerHTML = `<div class="layout">
      <aside class="side" id="side">
        <a class="brand"><img src="../assets/logo.png" alt=""><span>Razq<small>ADMIN</small></span></a>
        <nav>${NAV.map(([k, i, t]) => `<button data-v="${k}" class="${k === view ? "on" : ""}">${ic(i)} ${t}</button>`).join("")}</nav>
        <div class="sp"></div>
        <a class="btn btn-ghost btn-sm" href="../index.html">العودة للموقع</a>
        <button class="btn btn-ghost btn-sm" id="lo2">${ic("out")} خروج</button>
      </aside>
      <div class="main">
        <div class="topbar">
          <button class="icon-btn menu-btn" id="mb">${ic("menu")}</button>
          <h1 id="ttl"></h1><div class="sp"></div>
          <span class="muted">${esc(m.full_name || m.name || me.email || "")}</span>
          <button class="icon-btn" id="thm">${ic(theme() === "dark" ? "sun" : "moon")}</button>
        </div>
        <div id="content"></div>
      </div></div>
      <div class="modal" id="modal"><div class="box wide"><button class="x" id="mx">${ic("x")}</button><div id="mbody"></div></div></div>`;
    $("#thm").onclick = toggleTheme;
    $("#mb").onclick = () => $("#side").classList.toggle("show");
    $("#lo2").onclick = async () => { await sb.auth.signOut(); location.reload(); };
    $("#mx").onclick = closeModal;
    $("#modal").addEventListener("click", (e) => { if (e.target.id === "modal") closeModal(); });
    $$(".side nav button").forEach((b) => (b.onclick = () => { view = b.dataset.v; $$(".side nav button").forEach((x) => x.classList.toggle("on", x === b)); $("#side").classList.remove("show"); render(); }));
    render();
  }
  const openModal = (html) => { $("#mbody").innerHTML = html; $("#modal").classList.add("show"); };
  const closeModal = () => $("#modal").classList.remove("show");
  async function render() {
    $("#ttl").textContent = TITLES[view];
    const c = $("#content"); c.innerHTML = `<p class="muted">جارٍ التحميل…</p>`;
    try { await VIEWS[view](c); } catch (e) { c.innerHTML = `<div class="panel">حدث خطأ: ${esc(e.message)}</div>`; }
  }
  const must = (r) => { if (r.error) throw r.error; return r.data; };

  /* ---------- الإحصائيات ---------- */
  async function vDash(c) {
    const [orders, products, users, reviews] = await Promise.all([
      sb.from("orders").select("*").order("created_at", { ascending: false }).then(must),
      sb.from("products").select("id").then(must),
      sb.from("profiles").select("id", { count: "exact", head: true }).then((r) => r.count || 0),
      sb.from("reviews").select("rating").then(must),
    ]);
    const revenue = orders.filter((o) => o.status !== "cancelled" && o.status !== "pending").reduce((s, o) => s + +o.total, 0);
    const pending = orders.filter((o) => o.status === "pending").length;
    const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : "—";
    const S = (i, t, v, d) => `<div class="stat" style="animation-delay:${d}s"><small>${ic(i)} ${t}</small><b>${v}</b></div>`;
    c.innerHTML = `<div class="stats">
      ${S("cash", "الإيرادات (مدفوع/مسلّم)", money(revenue) + " " + cur, 0)}
      ${S("cart", "إجمالي الطلبات", orders.length, .05)}
      ${S("cart", "طلبات بانتظار الدفع", pending, .1)}
      ${S("users", "المسجلين", users, .15)}
      ${S("box", "المنتجات", products.length, .2)}
      ${S("star", "متوسط التقييم", avg, .25)}</div>
      <div class="panel"><h3>${ic("cart")} آخر الطلبات</h3>${ordersTable(orders.slice(0, 8), false)}</div>`;
  }

  /* ---------- المنتجات ---------- */
  async function vProducts(c) {
    const rows = await sb.from("products").select("*").order("sort").order("created_at", { ascending: false }).then(must);
    c.innerHTML = `<div class="panel"><div class="panel-head"><h3>${ic("box")} المنتجات (${rows.length})</h3><button class="btn btn-primary btn-sm" id="np">${ic("plus")} منتج جديد</button></div>
      <div class="tbl"><table><thead><tr><th>الاسم</th><th>القسم</th><th>السعر</th><th>الحالة</th><th></th></tr></thead><tbody>
      ${rows.map((p) => `<tr><td><b>${esc(p.name)}</b>${p.badge ? ` <span class="pill">${esc(p.badge)}</span>` : ""}</td>
        <td>${p.category === "fivem" ? "فايف ام" : "ديسكورد"}</td><td>${money(p.price)} ${cur}</td>
        <td><span class="pill ${p.active ? "delivered" : "off"}">${p.active ? "ظاهر" : "مخفي"}</span></td>
        <td><div class="acts"><button class="icon-btn" data-edit="${p.id}" aria-label="تعديل">${ic("edit")}</button><button class="icon-btn" data-del="${p.id}" aria-label="حذف" style="color:var(--danger)">${ic("trash")}</button></div></td></tr>`).join("") || `<tr><td colspan="5" class="muted">لا توجد منتجات بعد</td></tr>`}
      </tbody></table></div></div>`;
    $("#np").onclick = () => productForm();
    $$("[data-edit]", c).forEach((b) => (b.onclick = () => productForm(rows.find((r) => r.id === b.dataset.edit))));
    $$("[data-del]", c).forEach((b) => (b.onclick = async () => {
      if (!confirm("حذف هذا المنتج نهائياً؟")) return;
      const { error } = await sb.from("products").delete().eq("id", b.dataset.del);
      error ? toast(error.message, true) : (toast("تم الحذف"), render());
    }));
  }
  function productForm(p = {}) {
    openModal(`<h3>${p.id ? "تعديل منتج" : "منتج جديد"}</h3>
      <form class="form-grid" id="pf">
        <div class="field full"><label>اسم المنتج</label><input type="text" name="name" required value="${esc(p.name)}"></div>
        <div class="field full"><label>الوصف</label><textarea name="description" rows="3">${esc(p.description)}</textarea></div>
        <div class="field"><label>القسم</label><select name="category"><option value="discord" ${p.category === "discord" ? "selected" : ""}>ديسكورد</option><option value="fivem" ${p.category === "fivem" ? "selected" : ""}>فايف ام</option></select></div>
        <div class="field"><label>السعر (بالدينار الكويتي ${cur})</label><input type="number" step="0.001" min="0" name="price" required value="${p.price ?? ""}"></div>
        <div class="field"><label>السعر قبل الخصم بالدينار الكويتي (اختياري)</label><input type="number" step="0.001" min="0" name="old_price" value="${p.old_price ?? ""}"></div>
        <div class="field"><label>شارة (مثل: جديد)</label><input type="text" name="badge" value="${esc(p.badge)}"></div>
        <div class="field full"><label>رابط الصورة (اختياري — وإلا تظهر أيقونة القسم)</label><input type="url" name="image_url" value="${esc(p.image_url)}" placeholder="https://..."></div>
        <div class="field"><label>الترتيب</label><input type="number" name="sort" value="${p.sort ?? 0}"></div>
        <div class="field check"><input type="checkbox" name="active" id="act" ${p.active === false ? "" : "checked"}><label for="act" style="margin:0">ظاهر في المتجر</label></div>
        <div class="full"><button class="btn btn-primary btn-block" type="submit">${ic("check")} حفظ</button></div>
      </form>`);
    $("#pf").onsubmit = async (e) => {
      e.preventDefault(); const f = new FormData(e.target);
      const row = {
        name: f.get("name").trim(), description: f.get("description").trim(), category: f.get("category"),
        price: +f.get("price"), old_price: f.get("old_price") ? +f.get("old_price") : null,
        badge: f.get("badge").trim() || null, image_url: f.get("image_url").trim() || null,
        sort: +f.get("sort") || 0, active: !!f.get("active"),
      };
      const { error } = p.id ? await sb.from("products").update(row).eq("id", p.id) : await sb.from("products").insert(row);
      if (error) return toast(error.message, true);
      closeModal(); toast("تم الحفظ"); render();
    };
  }

  /* ---------- الطلبات ---------- */
  const STATUS = { pending: "بانتظار الدفع", paid: "مدفوع", delivered: "تم التسليم", cancelled: "ملغي" };
  function ordersTable(rows, editable = true) {
    if (!rows.length) return `<p class="muted">لا توجد طلبات بعد</p>`;
    return `<div class="tbl"><table><thead><tr><th>#</th><th>العميل</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th>${editable ? "<th></th>" : ""}</tr></thead><tbody>
      ${rows.map((o) => `<tr><td><b>${o.order_no}</b></td><td>${esc(o.customer_name)}</td>
        <td class="muted">${(o.items || []).map((i) => `${esc(i.name)} ×${i.qty}`).join("، ")}${o.coupon ? ` <span class="pill">${esc(o.coupon)}</span>` : ""}</td>
        <td>${money(o.total)} ${cur}</td>
        <td>${editable ? `<select data-st="${o.id}" style="width:auto;padding:6px 10px">${Object.entries(STATUS).map(([k, v]) => `<option value="${k}" ${o.status === k ? "selected" : ""}>${v}</option>`).join("")}</select>` : `<span class="pill ${o.status}">${STATUS[o.status]}</span>`}</td>
        <td class="muted">${dt(o.created_at)}</td>
        ${editable ? `<td><button class="icon-btn" data-odel="${o.id}" style="color:var(--danger);width:34px;height:34px">${ic("trash")}</button></td>` : ""}</tr>`).join("")}
      </tbody></table></div>`;
  }
  async function vOrders(c) {
    const rows = await sb.from("orders").select("*").order("created_at", { ascending: false }).then(must);
    c.innerHTML = `<div class="panel"><h3>${ic("cart")} كل الطلبات (${rows.length})</h3>${ordersTable(rows)}</div>`;
    $$("[data-st]", c).forEach((s) => (s.onchange = async () => {
      const { error } = await sb.from("orders").update({ status: s.value }).eq("id", s.dataset.st);
      error ? toast(error.message, true) : toast("تم تحديث الحالة");
    }));
    $$("[data-odel]", c).forEach((b) => (b.onclick = async () => {
      if (!confirm("حذف الطلب؟")) return;
      const { error } = await sb.from("orders").delete().eq("id", b.dataset.odel);
      error ? toast(error.message, true) : (toast("تم الحذف"), render());
    }));
  }

  /* ---------- العملاء ---------- */
  async function vCustomers(c) {
    const [orders, profs] = await Promise.all([sb.from("orders").select("user_id,total,status,created_at").then(must), sb.from("profiles").select("*").then(must)]);
    const map = {};
    orders.forEach((o) => { const m = (map[o.user_id] ||= { n: 0, sum: 0, last: o.created_at }); m.n++; if (o.status === "paid" || o.status === "delivered") m.sum += +o.total; if (o.created_at > m.last) m.last = o.created_at; });
    const rows = profs.filter((p) => map[p.id]).map((p) => ({ ...p, ...map[p.id] })).sort((a, b) => b.sum - a.sum);
    c.innerHTML = `<div class="panel"><h3>${ic("users")} العملاء (${rows.length})</h3>
      <p class="muted" style="margin-bottom:10px">المجموع محسوب من الطلبات المدفوعة والمسلّمة فقط.</p>
      <div class="tbl"><table><thead><tr><th>العميل</th><th>عدد الطلبات</th><th>إجمالي الشراء</th><th>آخر طلب</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td>${userCell(r)}</td><td>${r.n}</td><td>${money(r.sum)} ${cur}</td><td class="muted">${dt(r.last)}</td></tr>`).join("") || `<tr><td colspan="4" class="muted">لا يوجد عملاء بعد</td></tr>`}
      </tbody></table></div></div>`;
  }
  const userCell = (p) => `<div class="row"><div class="avatar">${p.avatar_url ? `<img src="${esc(p.avatar_url)}" alt="">` : esc((p.name || "?")[0])}</div><div><b>${esc(p.name)}</b><div class="muted" style="font-size:.78rem">${esc(p.email || "")}</div></div></div>`;

  /* ---------- المسجلين ---------- */
  async function vUsers(c) {
    const rows = await sb.from("profiles").select("*").order("created_at", { ascending: false }).then(must);
    c.innerHTML = `<div class="panel"><h3>${ic("user")} المسجلين (${rows.length})</h3><div class="tbl"><table><thead><tr><th>المستخدم</th><th>طريقة التسجيل</th><th>تاريخ التسجيل</th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td>${userCell(r)}</td><td><span class="pill">${r.provider === "discord" ? "ديسكورد" : r.provider === "google" ? "جوجل" : esc(r.provider || "—")}</span></td><td class="muted">${dt(r.created_at)}</td></tr>`).join("") || `<tr><td colspan="3" class="muted">لا يوجد مسجلين بعد</td></tr>`}
      </tbody></table></div></div>`;
  }

  /* ---------- التسويق ---------- */
  async function vMarketing(c) {
    const [coupons, sets] = await Promise.all([sb.from("coupons").select("*").order("created_at", { ascending: false }).then(must), sb.from("settings").select("*").then(must)]);
    const s = Object.fromEntries(sets.map((r) => [r.key, r.value]));
    c.innerHTML = `
      <div class="panel"><h3>${ic("mega")} شريط الإعلان أعلى الموقع</h3>
        <div class="form-grid"><div class="field full"><label>نص الإعلان</label><input type="text" id="ann" value="${esc(s.announcement)}"></div>
        <div class="field check"><input type="checkbox" id="annOn" ${s.announcement_on === "true" ? "checked" : ""}><label for="annOn" style="margin:0">تفعيل الإعلان</label></div>
        <div><button class="btn btn-primary btn-sm" id="saveAnn">${ic("check")} حفظ</button></div></div></div>
      <div class="panel"><h3>${ic("mega")} أكواد الخصم</h3>
        <form class="inline-form" id="cf" style="margin-bottom:14px"><input type="text" name="code" placeholder="الكود (مثال: RAZQ10)" required><input type="number" name="percent" min="1" max="100" placeholder="نسبة الخصم %" required><button class="btn btn-primary btn-sm" type="submit">${ic("plus")} إضافة</button></form>
        <div class="tbl"><table><thead><tr><th>الكود</th><th>الخصم</th><th>الحالة</th><th></th></tr></thead><tbody>
        ${coupons.map((k) => `<tr><td><b>${esc(k.code)}</b></td><td>${k.percent}%</td><td><span class="pill ${k.active ? "delivered" : "off"}">${k.active ? "مفعّل" : "متوقف"}</span></td>
          <td><div class="acts"><button class="btn btn-ghost btn-sm" data-tg="${esc(k.code)}" data-on="${k.active}">${k.active ? "إيقاف" : "تفعيل"}</button><button class="icon-btn" data-cd="${esc(k.code)}" style="color:var(--danger)">${ic("trash")}</button></div></td></tr>`).join("") || `<tr><td colspan="4" class="muted">لا توجد أكواد</td></tr>`}
        </tbody></table></div></div>`;
    $("#saveAnn").onclick = async () => {
      const { error } = await sb.from("settings").upsert([{ key: "announcement", value: $("#ann").value.trim() }, { key: "announcement_on", value: String($("#annOn").checked) }]);
      error ? toast(error.message, true) : toast("تم حفظ الإعلان");
    };
    $("#cf").onsubmit = async (e) => {
      e.preventDefault(); const f = new FormData(e.target);
      const { error } = await sb.from("coupons").insert({ code: f.get("code").trim().toUpperCase(), percent: +f.get("percent") });
      error ? toast(error.message, true) : (toast("تمت إضافة الكود"), render());
    };
    $$("[data-tg]", c).forEach((b) => (b.onclick = async () => { const { error } = await sb.from("coupons").update({ active: b.dataset.on !== "true" }).eq("code", b.dataset.tg); error ? toast(error.message, true) : render(); }));
    $$("[data-cd]", c).forEach((b) => (b.onclick = async () => { if (!confirm("حذف الكود؟")) return; const { error } = await sb.from("coupons").delete().eq("code", b.dataset.cd); error ? toast(error.message, true) : render(); }));
  }

  /* ---------- التقييمات ---------- */
  async function vReviews(c) {
    const rows = await sb.from("reviews").select("*").order("created_at", { ascending: false }).then(must);
    c.innerHTML = `<div class="panel"><h3>${ic("star")} التقييمات (${rows.length})</h3><div class="tbl"><table><thead><tr><th>العميل</th><th>النجوم</th><th>التعليق</th><th></th></tr></thead><tbody>
      ${rows.map((r) => `<tr><td><b>${esc(r.name)}</b><div class="muted" style="font-size:.78rem">${dt(r.created_at)}</div></td><td>${r.rating} / 5</td><td class="muted">${esc(r.comment)}</td>
        <td><button class="icon-btn" data-rd="${r.id}" style="color:var(--danger);width:34px;height:34px">${ic("trash")}</button></td></tr>`).join("") || `<tr><td colspan="4" class="muted">لا توجد تقييمات</td></tr>`}
      </tbody></table></div></div>`;
    $$("[data-rd]", c).forEach((b) => (b.onclick = async () => { if (!confirm("حذف التقييم؟")) return; const { error } = await sb.from("reviews").delete().eq("id", b.dataset.rd); error ? toast(error.message, true) : (toast("تم الحذف"), render()); }));
  }

  /* ---------- إعدادات الموقع ---------- */
  async function vSettings(c) {
    const sets = await sb.from("settings").select("*").then(must);
    const s = Object.fromEntries(sets.map((r) => [r.key, r.value]));
    c.innerHTML = `<div class="panel"><h3>${ic("cog")} إعدادات الموقع</h3>
      <div class="form-grid"><div class="field full"><label>رابط دعوة سيرفر الديسكورد (يظهر بعد إتمام الطلب)</label><input type="url" id="inv" value="${esc(s.discord_invite)}" placeholder="https://discord.gg/xxxx"></div>
      <div><button class="btn btn-primary btn-sm" id="saveSet">${ic("check")} حفظ</button></div></div></div>`;
    $("#saveSet").onclick = async () => {
      const { error } = await sb.from("settings").upsert({ key: "discord_invite", value: $("#inv").value.trim() });
      error ? toast(error.message, true) : toast("تم الحفظ");
    };
  }

  const VIEWS = { dash: vDash, products: vProducts, orders: vOrders, customers: vCustomers, users: vUsers, marketing: vMarketing, reviews: vReviews, settings: vSettings };
  boot();
})();
