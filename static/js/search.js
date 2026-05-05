/**
 * Xử lý tìm kiếm tại chỗ trên trang chủ (Đồng bộ với index.js)
 */
document.addEventListener('DOMContentLoaded', async function () {
    const categorySelect = document.getElementById('search-category-select');
    const searchInput = document.querySelector('.search-input input');
    const searchBtn = document.querySelector('.search-btn button');
    const bikeListContainer = document.getElementById('bike-list-container');
    const sectionTitle = document.querySelector('.section-title h2');

    // Mảng ảnh mặc định từ index.js
    const localImages = [
        'assets/images/items-grid/img1.jpg',
        'assets/images/items-grid/img2.jpg',
        'assets/images/items-grid/img3.jpg',
        'assets/images/items-grid/img4.jpg',
        'assets/images/items-grid/img5.jpg',
        'assets/images/items-grid/img6.jpg'
    ];

    // 1. Nạp danh mục từ API
    async function loadCategories() {
        try {
            const result = await api.get('/api/');
            if (result.success && result.data) {
                result.data.forEach(cat => {
                    const option = document.createElement('option');
                    option.value = cat.category_id;
                    option.textContent = cat.name;
                    categorySelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Lỗi nạp danh mục:', error);
        }
    }

    // 2. Hàm gọi API lấy danh sách xe và render lại giao diện
    async function performSearch() {
        const keyword = searchInput ? searchInput.value.trim() : '';
        const categoryId = categorySelect ? categorySelect.value : '';

        if (bikeListContainer) {
            bikeListContainer.innerHTML = '<div class="col-12 text-center"><p>Đang tìm kiếm...</p></div>';
        }
        
        if (sectionTitle) {
            sectionTitle.textContent = (keyword || categoryId) ? 'Kết Quả Tìm Kiếm' : 'Sản Phẩm Mới Nhất';
        }

        try {
            let apiUrl = '/api/bikes?limit=12';
            if (categoryId) apiUrl += `&category_id=${categoryId}`;
            if (keyword) apiUrl += `&keyword=${encodeURIComponent(keyword)}`;

            const result = await api.get(apiUrl);

            if (result.success && result.data && result.data.bikes) {
                renderBikes(result.data.bikes);
            } else {
                bikeListContainer.innerHTML = '<div class="col-12 text-center"><p>Không tìm thấy sản phẩm nào phù hợp.</p></div>';
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
            bikeListContainer.innerHTML = '<div class="col-12 text-center text-danger"><p>Lỗi kết nối máy chủ.</p></div>';
        }
    }

    // 3. Hàm render danh sách xe (ĐÃ ĐỒNG BỘ VỚI INDEX.JS)
    function renderBikes(bikes) {
        if (!bikeListContainer) return;
        
        if (bikes.length === 0) {
            bikeListContainer.innerHTML = '<div class="col-12 text-center"><p>Hiện chưa có sản phẩm nào phù hợp.</p></div>';
            return;
        }

        let html = '';
        bikes.forEach((bike, idx) => {
            const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bike.price);
            const date = new Date(bike.created_at).toLocaleDateString('vi-VN');
            
            // Logic lấy ảnh: Nếu không có image_url thì dùng mảng localImages
            const bikeImg = bike.image_url ? bike.image_url : localImages[idx % localImages.length];
            
            html += `
                <div class="col-lg-4 col-md-6 col-12 mb-4">
                    <div class="single-grid" style="visibility: visible;">
                        <div class="image">
                            <a href="product-details.php?id=${bike.post_id}" class="thumbnail">
                                <img src="${bikeImg}" alt="#" style="width: 100%; height: 230px; object-fit: cover; border-radius: 8px 8px 0 0;">
                            </a>
                            <div class="author">
                                <div class="author-image">
                                    <a href="javascript:void(0)">
                                        <span>Bởi: <strong>${bike.seller_name || 'Người dùng'}</strong></span>
                                    </a>
                                </div>
                                <p class="sale">${bike.status === 'AVAILABLE' ? 'ĐANG BÁN' : 'HẾT HÀNG'}</p>
                            </div>
                        </div>
                        <div class="content">
                            <div class="top-content">
                                <a href="javascript:void(0)" class="tag">${bike.category_name}</a>
                                <h3 class="title">
                                    <a href="product-details.php?id=${bike.post_id}">${bike.title}</a>
                                </h3>
                                <p class="update-time">Ngày đăng: ${date}</p>
                            </div>
                            <div class="bottom-content">
                                <p class="price">Giá: <span>${formatPrice}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        bikeListContainer.innerHTML = html;
    }

    // Khởi tạo
    await loadCategories();

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }
});
