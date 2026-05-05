/**
 * Lấy dữ liệu Category Stats và hiển thị lên trang chủ
 */
document.addEventListener('DOMContentLoaded', async function () {
    const statsContainer = document.getElementById('category-stats-list');
    if (!statsContainer) return;

    try {
        // SỬA: Gọi đúng đường dẫn API dựa trên app.use('/api', catalogRoutes)
        const result = await api.get('/api/stats'); 
        
        if (result.success && result.data && result.data.length > 0) {
            const categories = result.data;
            
            // Render HTML
            const html = categories.map(cat => `
                <a href="category.php?id=${cat.category_id}" class="single-cat">
                    <div class="icon">
                        <img src="assets/images/categories/${getCategoryIcon(cat.name)}" alt="${cat.name}">
                    </div>
                    <h3>${cat.name}</h3>
                    <h5 class="total">${cat.total_items}</h5>
                </a>
            `).join('');

            statsContainer.innerHTML = html;

            // Đợi một chút để DOM cập nhật rồi mới chạy Slider
            setTimeout(() => {
                if (window.tns) {
                    try {
                        tns({
                            container: '#category-stats-list', // Dùng ID thay vì Class cho chính xác
                            items: 3,
                            slideBy: 'page',
                            autoplay: false,
                            mouseDrag: true,
                            gutter: 0,
                            nav: false,
                            controls: true,
                            controlsText: ['<i class="lni lni-chevron-left"></i>', '<i class="lni lni-chevron-right"></i>'],
                            responsive: {
                                0: { items: 1, },
                                540: { items: 2, },
                                768: { items: 3, },
                                992: { items: 5, },
                                1170: { items: 6, }
                            }
                        });
                    } catch (e) {
                        console.warn("Tiny Slider init error:", e);
                    }
                }
            }, 100);
        } else {
            // Nếu không có dữ liệu, có thể ẩn section này đi
            const section = document.querySelector('.categories');
            if (section) section.style.display = 'none';
        }
    } catch (error) {
        console.error('Lỗi load category stats:', error);
    }

    function getCategoryIcon(name) {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('leo núi') || lowerName.includes('mtb')) return 'car.svg';
        if (lowerName.includes('đua') || lowerName.includes('road')) return 'laptop.svg';
        if (lowerName.includes('thông thường') || lowerName.includes('city')) return 'hospital.svg';
        if (lowerName.includes('phích') || lowerName.includes('fixie')) return 'matrimony.svg';
        return 'watch.svg';
    }
});
