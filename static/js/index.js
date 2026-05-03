/**
 * ========================================
 * INDEX.JS - Hiển thị xe đạp trên trang chủ
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('bike-list-container');
    if (!container) return;

    try {
        const result = await api.get('/api/bikes');
        
        if (result.success && result.data && result.data.bikes) {
            const bikes = result.data.bikes;
            
            if (bikes.length === 0) {
                container.innerHTML = '<div class="col-12 text-center"><p>Hiện tại chưa có chiếc xe nào được đăng bán.</p></div>';
                return;
            }

            const localImages = ['assets/images/items-grid/img1.jpg','assets/images/items-grid/img2.jpg','assets/images/items-grid/img3.jpg','assets/images/items-grid/img4.jpg','assets/images/items-grid/img5.jpg','assets/images/items-grid/img6.jpg'];
            const authorImages = ['assets/images/items-grid/author-1.jpg','assets/images/items-grid/author-2.jpg','assets/images/items-grid/author-3.jpg','assets/images/items-grid/author-4.jpg','assets/images/items-grid/author-5.jpg','assets/images/items-grid/author-6.jpg'];

            let html = '';
            bikes.forEach((bike, idx) => {
                const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(bike.price);
                const date = new Date(bike.created_at).toLocaleDateString('vi-VN');
                const bikeImg = localImages[idx % localImages.length];
                const avatarImg = authorImages[idx % authorImages.length];
                
                html += `
                    <div class="col-lg-4 col-md-6 col-12 mb-4">
                        <div class="single-grid" style="visibility: visible;">
                            <div class="image">
                                <a href="product-details.php?id=${bike.post_id}" class="thumbnail">
                                    <img src="${bikeImg}" alt="#">
                                </a>
                                <div class="author">
                                    <div class="author-image">
                                        <a href="javascript:void(0)">
                                            <img src="${avatarImg}" alt="#">
                                            <span>Bởi: <strong>${bike.seller_name}</strong></span>
                                        </a>
                                    </div>
                                    <p class="sale">${bike.status}</p>
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

            container.innerHTML = html;
        } else {
            container.innerHTML = '<div class="col-12 text-center text-danger"><p>Lỗi: Không thể lấy dữ liệu từ máy chủ.</p></div>';
        }
    } catch (error) {
        console.error('Lỗi khi tải danh sách xe:', error);
        container.innerHTML = '<div class="col-12 text-center text-danger"><p>Lỗi kết nối máy chủ.</p></div>';
    }
});
