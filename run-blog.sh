#!/bin/bash
echo "Starting FutureBlog..."
# الدخول لمجلد blog-site وتشغيل start-blog
cd blog-site || { echo "Failed to change directory to blog-site"; exit 1; }
npm run start-blog

echo "نقل المقالات إلى مجلد blog-site/public/articles..."
# الحصول على مسار السكريبت (دليل المشروع)
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
ARTICLES_DIR="${SCRIPT_DIR}/articles"
DEST_DIR="${SCRIPT_DIR}/blog-site/public/articles"

# إنشاء مجلد الوجهة لو مش موجود
mkdir -p "$DEST_DIR"

# نسخ المقالات باستخدام rsync بصمت (يمكن استبدالها بـ cp -r لو حابب)
rsync -a --delete "$ARTICLES_DIR/" "$DEST_DIR/" > /dev/null

echo "تم تحديث المقالات في $DEST_DIR"

# Create necessary directories if they don't exist
mkdir -p blog-site/public/articles

# Copy articles to public folder
cp -r articles/* blog-site/public/articles/

# Set proper permissions
chmod -R 755 blog-site/public/articles

echo "Articles copied to public folder successfully!"
exit 0