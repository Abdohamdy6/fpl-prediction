# 🚀 دليل نشر الموقع على Vercel (Vercel Deployment Guide)

هذا الدليل يشرح بالتفصيل كيفية رفع ونشر مشروع **Premier League Predictor** على منصة **Vercel** مجاناً خطوة بخطوة.

---

## 1. المتغيرات البيئية المطلوبة على Vercel (Environment Variables)

عند إنشاء المشروع على Vercel، اذهب إلى:
**Settings** $\rightarrow$ **Environment Variables** وأضف الـ 3 متغيرات التالية:

| اسم المتغير (Variable Key) | الوصف | القيمة المقترحة (Example Value) |
| :--- | :--- | :--- |
| **`DATABASE_URL`** | رابط الاتصال بقاعدة بيانات PostgreSQL السحابية مجانية (من **Neon.tech** أو **Supabase**) | `postgresql://neondb_owner:password@ep-cool-pool.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| **`NEXTAUTH_SECRET`** | مفتاح تشفير عشوائي آمن لجلسات تسجيل الدخول (أي نص طويل عشوائي) | `c9f8a4b2e1d74653a987c2b51e0f3d6a89c74b1234567890abcdef1234567890` |
| **`NEXTAUTH_URL`** | رابط موقعك على Vercel (أو اتركه فارغاً و Vercel ستتعامل معه تلقائياً) | `https://your-project-name.vercel.app` |

---

## 2. كيفية الحصول على قاعدة بيانات PostgreSQL مجانية في دقيقة واحدة (Neon DB)

1. ادخل على موقع [neon.tech](https://neon.tech/) وسجل دخول مجاناً بحساب Github.
2. أنشئ مشروع جديد باسم `pl-predictor`.
3. انسخ رابط الاتصال **Connection String** (يبدأ بـ `postgresql://...`).
4. ضعه في متغير **`DATABASE_URL`** على Vercel.

*(ملاحظة: إذا كانت قاعدة البيانات في Vercel هي PostgreSQL، فقط غيّر `provider = "sqlite"` إلى `provider = "postgresql"` في ملف `prisma/schema.prisma` قبل الرفع).*

---

## 3. خطوات الرفع على Vercel

1. ارفع الكود على حسابك في **GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Premier League Predictor Full Stack"
   git remote add origin https://github.com/your-username/premier-league-predictor.git
   git push -u origin main
   ```
2. افتح [vercel.com](https://vercel.com/) واضغط **Add New Project** ثم اختر المستودع (Repository).
3. أضف الـ **Environment Variables** المذكورة أعلاه.
4. اضغط **Deploy**.

---

## 4. ملء قاعدة البيانات بالفرق والمباريات بعد النشر (One-Click Seed)

بعد النشر على Vercel، ادخل على صفحة الأدمن:
`https://your-domain.vercel.app/admin`
واضغط على زر **"Fetch & Sync PL Feeds"** لملء قاعدة البيانات السحابية بجميع الفرق الـ 20 الرسمية وشعاراتها وجداول المباريات بضغطة زر واحدة!
