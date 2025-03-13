@echo off
echo Starting FutureBlog...
cd blog-site
npm run start-blog

echo نقل المقالات إلى مجلد blog-site\public\articles...
set "ARTICLES_DIR=%~dp0articles"
set "DEST_DIR=%~dp0blog-site\public\articles"

if not exist "%DEST_DIR%" (
    mkdir "%DEST_DIR%"
)

rem استخدام robocopy لنقل الملفات بصمت
robocopy "%ARTICLES_DIR%" "%DEST_DIR%" /E /NFL /NDL /NJH /NJS /nc /ns /np >nul

echo تم تحديث المقالات في %DEST_DIR%
exit /B 0 