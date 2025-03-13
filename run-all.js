#!/usr/bin/env node
const { exec } = require('child_process');

function runArticleGenerator() {
  console.log("بدء تشغيل fixedArticleGenerator.js لتوليد مقال جديد...");
  exec('node fixedArticleGenerator.js 1', (error, stdout, stderr) => {
    if (error) {
      console.error(`خطأ في fixedArticleGenerator.js: ${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  });
}

function runBlogScript() {
  console.log("تشغيل سكريبت run-blog.sh لنقل المقالات إلى المجلد العام...");
  // في بيئة لينكس نقوم بتشغيل ملف الشل مباشرةً
  exec('sh run-blog.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`خطأ في run-blog.sh: ${error}`);
      return;
    }
    console.log(stdout);
    if (stderr) {
      console.error(stderr);
    }
  });
}

function runTasks() {
  console.log("\nتنفيذ المهمة: توليد مقال جديد");
  runArticleGenerator();
}

console.log("بدأت عملية التشغيل التلقائي، والمهمة الأساسية لتوليد المقالات هتشتغل كل 30 دقيقة.");

// تشغيل run-blog.sh مرة واحدة فقط عند بدء التشغيل لنقل المقالات
runBlogScript();

// تشغيل مهمة توليد المقال فوراً
runTasks();

// جدولة إعادة التنفيذ كل 30 دقيقة (1800000 مللي ثانية)
setInterval(runTasks, 30 * 60 * 1000);
