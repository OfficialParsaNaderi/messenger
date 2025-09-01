/** @type {import('next').NextConfig} */
const nextConfig = {
  // Turbopack رو غیرفعال می‌کنه
  // این تنظیمات برای حل خطای بیلد در Vercel مناسب است
  experimental: {
    // حذف `appDir: true` چون در نسخه‌های جدید Next.js به صورت پیش‌فرض فعال است و باعث خطا می‌شود.
    // اگر باز هم با مشکل مواجه شدید، می‌توانید از گزینه‌های دیگر مثل `useNextjs` یا `useWasmBinary` که قبلاً بهتون گفتم استفاده کنید.
  },
  images: {
    domains: [
      "res.cloudinary.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;