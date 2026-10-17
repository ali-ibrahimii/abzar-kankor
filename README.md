# ابزار کانکور — Abzar Kankor

وب‌سایت رسمی **ابزار کانکور**؛ پلتفرم آمادگی امتحان کانکور با درس‌های مکتب، فلش‌کارت تعاملی، کتابخانه، دستیار هوش مصنوعی و داشبورد شخصی.

رابط کاربری با طراحی اختصاصی (الهام‌گرفته از CodeMage) و بر پایهٔ shadcn/ui ساخته شده و **تمام امکانات سایت مرجع را پوشش می‌دهد**.

## اجرا

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build تولید (قبل از آن check:messages اجرا می‌شود)
npm run start      # اجرای build
npm run check:messages   # بررسی هم‌ترازی کلیدهای سه زبان
```

> ⚠️ هنگام اجرای `next start` هرگز `next build` اجرا نکنید؛ ابتدا سرور را متوقف کنید و سپس `.next` را پاک کنید.

## سه‌زبانه بودن (i18n)

- همهٔ متن‌های سایت در `src/messages/{fa,ps,en}.json` نگهداری می‌شوند — هیچ متن کاربری مستقیماً در JSX نوشته نمی‌شود.
- زبان پیش‌فرض **فارسی (RTL)** است؛ پشتو (RTL) و انگلیسی (LTR) هم کامل هستند.
- انتخاب زبان در کوکی `locale` ذخیره می‌شود؛ `<html lang dir>` در سمت سرور ست می‌شود (بدون پرش چیدمان).
- `fa.json` مرجع کلیدهاست و `scripts/check-messages.mjs` کمبود/اضافهٔ کلید در دو زبان دیگر را در `prebuild` می‌گیرد.
- `src/lib/locales.ts` = ثابت‌ها و تایپ‌های امن برای کلاینت؛ `src/lib/i18n.ts` = توابع سروری (`getDictionary`, `getLocale`).

## پشتهٔ فنی

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4** با توکن‌های OKLCH (حالت روشن/تاریک)
- **shadcn/ui** + **Radix UI** (کامپوننت‌های پایه در `src/components/ui` مستقیماً ویرایش شده‌اند)
- **Vazirmatn Variable** (فونت فارسی، OFL) — فایل‌ها در `public/fonts`
- آیکن‌ها: **lucide-react**

## ساختار

```text
src/
├── app/
│   ├── layout.tsx              # lang/dir، متادیتا، هدر/فوتر، تم
│   ├── page.tsx                # صفحهٔ اصلی (۸ بخش)
│   ├── school/                 # مکتب + [slug] موضوع‌ها (فصل و درس)
│   ├── flashcards/             # فلش‌کارت + [slug] دسته‌بندی هر موضوع
│   ├── ai-learning/            # دستیار هوش مصنوعی
│   ├── library/                # کتابخانه + general/ (کتب عمومی)
│   ├── forms/                  # فورم‌های کانکور
│   ├── download/               # دانلود اپلیکیشن
│   ├── about/  contact/        # درباره و تماس (پیام → صندوق داشبورد)
│   ├── login/  register/       # ورود و ثبت‌نام (نسخهٔ نمایشی)
│   ├── get-started/            # برنامه‌ریز سه‌مرحله‌ای مطالعه
│   ├── dashboard/              # داشبورد کاربر (CRUD کامل)
│   ├── not-found.tsx           # ۴۰۴ سفارشی سه‌زبانه
│   └── sitemap.ts / robots.ts
├── components/
│   ├── layout/                 # Header، SiteNav، Footer، LanguageSwitcher
│   ├── sections/               # Hero، Stats، Subjects، Tools، AiSpotlight، Lessons، CtaPanel …
│   ├── school/                 # SubjectGrid (جست‌وجو و فیلتر)
│   ├── flashcards/             # FlashcardsDeck + FlashcardsShell
│   ├── library/                # BooksGrid
│   ├── contact/                # ContactForm
│   ├── auth/                   # AuthForm (ورود/ثبت‌نام)
│   ├── onboarding/             # GetStartedWizard
│   ├── dashboard/              # DashboardApp (کلاینت)
│   ├── providers/              # ThemeProvider
│   ├── shared/                 # PageHeader، پالت کارت‌ها
│   └── ui/                     # shadcn (button, navigation-menu)
├── lib/
│   ├── locales.ts              # ثابت‌ها/تایپ‌های امن کلاینت (Locale، Dictionary)
│   ├── i18n.ts                 # توابع سروری (getDictionary، getLocale)
│   ├── types.ts                # تایپ‌های محتوا (Subject, Lesson, Book, …)
│   └── format.ts               # اعداد/تاریخ
├── messages/                   # fa.json · ps.json · en.json
└── style/globals.css           # توکن‌ها و کلاس‌های سراسری (Tailwind v4)
```

## امکانات (برابری با CodeMage + افزوده‌ها)

| قابلیت | وضعیت |
| --- | --- |
| منوی مگا‌منو با زیرشاخه‌ها | ✅ |
| موضوع‌ها، فصل‌ها و درس‌ها (صفحهٔ اختصاصی هر موضوع) | ✅ |
| فلش‌کارت تعاملی با پیشرفت ذخیره‌شده | ✅ |
| دستیار هوش مصنوعی (صفحهٔ معرفی) | ✅ |
| کتابخانهٔ مکتب و کتابخانهٔ عمومی | ✅ |
| فورم‌ها و دانلود اپلیکیشن | ✅ |
| درباره/تماس (پیام‌ها در داشبورد) | ✅ |
| ورود/ثبت‌نام نمایشی | ✅ |
| داشبورد: نمای کلی، موضوع‌ها، درس‌ها، فلش‌کارت‌ها، کتاب‌ها، پیام‌ها، تنظیمات | ✅ |
| جست‌وجو در موضوع‌ها و جدول‌های داشبورد | ✅ |
| سه زبان (fa/ps/en) + حالت تاریک | ✅ |
| برنامه‌ریز مطالعهٔ سه‌مرحله‌ای | ✅ (افزودهٔ ما) |
| صفحهٔ ۴۰۴ سفارشی، sitemap و robots | ✅ |

## داشبورد

بخش‌های داشبورد: `overview | subjects | lessons | flashcards | books | messages | settings`.
داده‌های نمایشی از دیکشنری ساخته می‌شوند و ویرایش‌ها (افزودن/ویرایش/حذف) در `localStorage["abzar-content"]` ذخیره می‌شوند؛ پیام‌های فرم تماس در `localStorage["abzar-messages"]`، کاربر در `abzar-user` و برنامهٔ مطالعه در `abzar-plan`.
برای اتصال به بک‌اند واقعی کافی است توابع ذخیره‌سازی در `src/components/dashboard/DashboardApp.tsx` و تایپ‌ها در `src/lib/types.ts` جایگزین شوند.

## طراحی

جهت هنری بر اساس سایت **CodeMage**: پنل‌های تیرهٔ سرمه‌ای با گرادیان بنفش/سبز نعنایی، کارت‌های پاستلی، تایپوگرافی Vazirmatn، شعاع‌های بزرگ و ریتم بخش‌های روشن/تیره. توکن‌ها و راهنمای کامل در `docs/design-guide-fa.md`.

## نکات باقی‌مانده

- لینک فروشگاه‌های اپلیکیشن (Google Play / App Store) هنوز واقعی نیست؛ در `/download` به‌صورت «به‌زودی» نمایش داده می‌شود.
- احراز هویت و ذخیره‌سازی داده‌ها نمایشی (localStorage) است و برای محیط واقعی باید به بک‌اند/دیتابیس وصل شود.
- فایل‌های تصویری قدیمی در `public/` (مثل `background.jpg` با ۳۴ مگابایت) دیگر استفاده نمی‌شوند و می‌توانند حذف شوند.
