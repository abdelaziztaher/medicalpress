# استخدام صورة Node.js خفيفة
FROM node:18-alpine

# تعيين مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات package.json وتثبيت الاعتماديات
COPY package.json ./
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# نسخ ملف البيئة (يمكنك أيضاً تعريف المتغيرات من خلال إعدادات Coolify)
COPY .env ./

# تعيين متغير البيئة لوضع الإنتاج
ENV NODE_ENV=production

# الأمر الذي يبدأ تشغيل التطبيق
CMD ["node", "run-all.js"]
