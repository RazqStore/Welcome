/* ============================================================
   Razq Store — الصفحة الرئيسية: المنتجات والتقييمات
   إذا ما ربطت Supabase يشتغل الموقع بمنتجات تجريبية (للمعاينة فقط)
   ============================================================ */
(function () {
  const { sb, ic, $, $$, esc, fmt, toast, observeReveal, addToCart, getUser, meta, openAuth } = window.Razq;
  document.addEventListener("razq:cur", () => products.length && renderProducts());

  const DEMO_PRODUCTS = [
    { id: "d1", name: "بوستات ديسكورد", description: "بوستات لسيرفرك بتسليم سريع داخل التذكرة.", category: "discord", price: 12, badge: "الأكثر طلباً" },
    { id: "d2", name: "نيترو ديسكورد", description: "اشتراك نيترو بمدة تختارها.", category: "discord", price: 24 },
    { id: "d3", name: "تجهيز سيرفر ديسكورد", description: "رومات، رتب، وبوتات جاهزة بتنسيق احترافي.", category: "discord", price: 35 },
    { id: "f1", name: "سكربت فايف ام", description: "سكربتات مجربة ومتوافقة مع أغلب الفريم ورك.", category: "fivem", price: 40, badge: "جديد" },
    { id: "f2", name: "تجهيز سيرفر فايف ام", description: "تركيب وإعداد كامل لسيرفرك.", category: "fivem", price: 120 },
    { id: "f3", name: "مودات ومابات فايف ام", description: "مابات ومودات بجودة عالية وأداء ممتاز.", category: "fivem", price: 30 },
  ];
  let products = [], filter = "all";

  /* ---------- المنتجات ---------- */
  async function loadProducts() {
    if (sb) {
      const { data, error } = await sb.from("products").select("*").eq("active", true).order("sort", { ascending: true }).order("created_at", { ascending: false });
      products = error ? [] : data || [];
      if (error) toast("تعذر تحميل المنتجات", "err");
    } else products = DEMO_PRODUCTS;
    renderProducts();
  }
  function card(p, i) {
    const thumb = p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.name)}" loading="lazy">` : ic(p.category === "fivem" ? "gamepad" : "gem");
    return `<article class="card reveal" style="--d:${Math.min(i, 8) * 0.06}s">
      <div class="thumb">${thumb}${p.badge ? `<span class="tag">${esc(p.badge)}</span>` : ""}<span class="cat-tag">${p.category === "fivem" ? "فايف ام" : "ديسكورد"}</span></div>
      <div class="card-body"><h3>${esc(p.name)}</h3><p>${esc(p.description || "")}</p>
        <div class="price-row">
          <div class="price">${p.old_price ? `<s>${fmt(p.old_price)}</s>` : ""}${fmt(p.price)}</div>
          <button class="btn btn-primary btn-sm" data-add="${esc(p.id)}">${ic("cart")} أضف للسلة</button>
        </div></div></article>`;
  }
  function renderProducts() {
    const list = products.filter((p) => filter === "all" || p.category === filter);
    $("#grid").innerHTML = list.length ? list.map(card).join("") : `<div class="empty">لا توجد منتجات في هذا القسم حالياً</div>`;
    observeReveal($("#grid"));
  }
  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]"); if (!b) return;
    const p = products.find((x) => String(x.id) === b.dataset.add);
    if (p) addToCart(p);
  });
  $("#tabs").addEventListener("click", (e) => {
    const t = e.target.closest(".tab"); if (!t) return;
    $$("#tabs .tab").forEach((x) => x.classList.toggle("on", x === t));
    filter = t.dataset.f; renderProducts();
  });

  /* ---------- التقييمات ---------- */
  let reviews = [], picked = 0;
  const starsHTML = (n) => `<span class="stars">${[1, 2, 3, 4, 5].map((i) => ic("starf", i <= n ? "" : "off")).join("")}</span>`;
  const ago = (d) => {
    const s = (Date.now() - new Date(d)) / 1000;
    if (s < 60) return "الآن";
    if (s < 3600) return `قبل ${Math.floor(s / 60)} دقيقة`;
    if (s < 86400) return `قبل ${Math.floor(s / 3600)} ساعة`;
    return `قبل ${Math.floor(s / 86400)} يوم`;
  };
  async function loadReviews() {
    if (sb) {
      const { data } = await sb.from("reviews").select("*").order("created_at", { ascending: false }).limit(60);
      reviews = data || [];
    } else {
      try { reviews = JSON.parse(localStorage.getItem("razq-reviews") || "[]"); } catch (e) { reviews = []; }
    }
    renderReviews();
  }
  function renderReviews() {
    const n = reviews.length, avg = n ? reviews.reduce((s, r) => s + r.rating, 0) / n : 0;
    $("#avg").textContent = n ? avg.toFixed(1) : "—";
    $("#avgStars").innerHTML = starsHTML(Math.round(avg));
    $("#count").textContent = n ? `${n} تقييم` : "لا توجد تقييمات بعد";
    $("#reviewList").innerHTML = n ? reviews.map((r, i) => `
      <div class="review reveal" style="--d:${Math.min(i, 6) * 0.05}s">
        <header>
          <div class="avatar">${r.avatar_url ? `<img src="${esc(r.avatar_url)}" alt="">` : esc((r.name || "؟")[0])}</div>
          <div class="who"><b>${esc(r.name)}</b><small>${ago(r.created_at)}</small></div>${starsHTML(r.rating)}
        </header><p>${esc(r.comment)}</p></div>`).join("") : `<div class="empty">كن أول من يقيّم المتجر ✦</div>`;
    observeReveal($("#reviewList"));
  }
  function setPicked(n) {
    picked = n;
    $$("#starInput button").forEach((b) => b.classList.toggle("on", +b.dataset.v <= n));
  }
  function drawStarInput() {
    $("#starInput").innerHTML = [5, 4, 3, 2, 1].map((v) => `<button type="button" data-v="${v}" aria-label="${v} نجوم">${ic("starf")}</button>`).join("");
    $("#starInput").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) setPicked(+b.dataset.v); });
    $("#starInput").addEventListener("mouseover", (e) => { const b = e.target.closest("button"); if (b) $$("#starInput button").forEach((x) => x.style.color = +x.dataset.v <= +b.dataset.v ? "var(--accent2)" : ""); });
    $("#starInput").addEventListener("mouseleave", () => $$("#starInput button").forEach((x) => (x.style.color = "")));
  }
  function syncReviewUI() {
    const u = getUser();
    $("#reviewForm").classList.toggle("show", !!u || !sb);
    $("#reviewLogin").style.display = u || !sb ? "none" : "";
  }
  $("#reviewLogin").onclick = openAuth;
  $("#reviewForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const comment = $("#comment").value.trim();
    if (!picked) return toast("اختر عدد النجوم", "err");
    if (comment.length < 3) return toast("اكتب تعليقاً قصيراً", "err");
    const u = getUser(), m = u ? meta(u) : { name: "زائر", avatar: "" };
    if (sb) {
      const { error } = await sb.from("reviews").upsert({ user_id: u.id, name: m.name, avatar_url: m.avatar, rating: picked, comment }, { onConflict: "user_id" });
      if (error) return toast("تعذر إرسال التقييم: " + error.message, "err");
    } else {
      reviews.unshift({ name: m.name, avatar_url: "", rating: picked, comment, created_at: new Date().toISOString() });
      try { localStorage.setItem("razq-reviews", JSON.stringify(reviews)); } catch (err) {}
    }
    $("#comment").value = ""; setPicked(0);
    toast("شكراً على تقييمك!");
    loadReviews();
  });
  document.addEventListener("razq:auth", syncReviewUI);

  /* ---------- تأثير ميلان خفيف للشعار ---------- */
  const hl = $(".hero-logo");
  if (hl && matchMedia("(pointer:fine)").matches) {
    document.addEventListener("mousemove", (e) => {
      const x = (e.clientX / innerWidth - 0.5) * 14, y = (e.clientY / innerHeight - 0.5) * 14;
      hl.style.setProperty("translate", `${x}px ${y}px`);
    });
  }

  drawStarInput(); syncReviewUI(); loadProducts(); loadReviews();
})();
