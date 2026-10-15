/* ============================================================
   Razq Store — إعدادات الموقع
   عدّل القيم هنا فقط. اتبع README.md لمعرفة من أين تجيبها.
   ============================================================ */
window.RAZQ_CONFIG = {
  // من لوحة Supabase: Project Settings → API
  SUPABASE_URL: "https://jhnrpbtfwkmhpflnwxdb.supabase.co",
  SUPABASE_ANON_KEY: "",

  // طرق تسجيل الدخول المفعّلة. لإضافة جوجل لاحقاً اكتب: ["discord", "google"]
  AUTH_PROVIDERS: ["discord"],

  // الدخول السري للوحة التحكم: اكتب هذه الكلمة في خانة البحث داخل الموقع ثم Enter
  // (غيّرها لكلمة لا يعرفها أحد). كلمة السر الحقيقية تنحفظ في Supabase وليست هنا.
  ADMIN_KEYWORD: "razq-admin",
  // اسم المستخدم يتحول لإيميل بهذا الدومين الوهمي: owner  ->  owner@razq.admin
  ADMIN_EMAIL_DOMAIN: "razq.admin",

  // رابط دعوة سيرفر الديسكورد (يفتح عند إتمام الطلب)
  DISCORD_INVITE: "https://discord.gg/YOUR_INVITE",

  // الأسعار تُدخل بالدينار الكويتي وتتحول تلقائياً لعملة الزائر حسب دولته

  SITE_NAME: "Razq Store",
};
