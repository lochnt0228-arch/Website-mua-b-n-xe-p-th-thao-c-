const fs = require('fs');
const path = require('path');

const staticDir = path.join(__dirname);
const includesDir = path.join(staticDir, 'includes');

if (!fs.existsSync(includesDir)) {
    fs.mkdirSync(includesDir);
}

// Lấy template header và footer từ index.html
const indexContent = fs.readFileSync(path.join(staticDir, 'index.html'), 'utf8');

// Header từ đầu đến hết </header>
const headerEndIndex = indexContent.indexOf('</header>') + '</header>'.length;
let headerContent = indexContent.substring(0, headerEndIndex);

// Thay thế các link .html thành .php trong headerContent
headerContent = headerContent.replace(/href="([^"]+)\.html"/g, 'href="$1.php"');
fs.writeFileSync(path.join(includesDir, 'header.php'), headerContent);

// Footer từ <!-- Start Footer --> đến hết
const footerStartIndex = indexContent.indexOf('<!-- Start Footer -->');
let footerContent = indexContent.substring(footerStartIndex);

// Sẽ không cắt phần script dùng chung vì index.html có nhiều script đặc thù. 
// Thay vào đó footerContent sẽ chỉ lấy phần Footer Area: từ <!-- Start Footer --> đến hết </footer>
const footerEndIndex = indexContent.indexOf('</footer>') + '</footer>'.length;
let footerOnlyContent = indexContent.substring(footerStartIndex, footerEndIndex);
fs.writeFileSync(path.join(includesDir, 'footer.php'), footerOnlyContent);

console.log('Created header.php and footer.php');

// Đọc tất cả các file .html
const files = fs.readdirSync(staticDir);
const htmlFiles = files.filter(f => f.endsWith('.html'));

htmlFiles.forEach(file => {
    let content = fs.readFileSync(path.join(staticDir, file), 'utf8');

    // Cắt phần Header (từ đầu tới </header>) và thay bằng <?php include 'includes/header.php'; ?>
    const hEnd = content.indexOf('</header>') + '</header>'.length;
    if (hEnd > '</header>'.length) {
        content = "<?php include 'includes/header.php'; ?>\n" + content.substring(hEnd);
    }

    // Cắt phần Footer (từ <!-- Start Footer --> tới </footer>) và thay bằng <?php include 'includes/footer.php'; ?>
    const fStart = content.indexOf('<!-- Start Footer -->');
    const fEnd = content.indexOf('</footer>') + '</footer>'.length;
    if (fStart !== -1 && fEnd !== -1) {
        content = content.substring(0, fStart) + "<?php include 'includes/footer.php'; ?>\n" + content.substring(fEnd);
    }

    // Cập nhật tất cả các link .html còn lại trong body thành .php
    content = content.replace(/href="([^"]+)\.html"/g, 'href="$1.php"');
    
    // Lưu lại thành file .php
    const phpFileName = file.replace('.html', '.php');
    fs.writeFileSync(path.join(staticDir, phpFileName), content);
    console.log(`Converted ${file} to ${phpFileName}`);
    
    // Xóa file html cũ
    fs.unlinkSync(path.join(staticDir, file));
});

// Cập nhật các file JS nếu có điều hướng window.location.href = '...html'
const jsDir = path.join(staticDir, 'js');
if (fs.existsSync(jsDir)) {
    const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js'));
    jsFiles.forEach(file => {
        let jsContent = fs.readFileSync(path.join(jsDir, file), 'utf8');
        let updated = false;
        
        if (jsContent.includes('.html')) {
            jsContent = jsContent.replace(/(['"])([^'"]+)\.html(['"])/g, '$1$2.php$3');
            updated = true;
        }
        
        if (updated) {
            fs.writeFileSync(path.join(jsDir, file), jsContent);
            console.log(`Updated links in ${file}`);
        }
    });
}

console.log('Conversion completed successfully.');
