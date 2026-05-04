/**
 * ========================================
 * PRODUCT-DETAILS.JS - Hiển thị chi tiết sản phẩm
 * ========================================
 */

document.addEventListener('DOMContentLoaded', async function () {
    // 1. Lấy ID sản phẩm từ URL (vd: product-details.php?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        alert("Không tìm thấy ID sản phẩm!");
        window.location.href = 'index.php';
        return;
    }

    // 2. Fetch dữ liệu từ Backend
    try {
        const result = await api.get(`/api/bikes/${productId}`);

        if (result.success && result.data) {
            renderProductDetails(result.data);
        } else {
            alert(result.message || "Lỗi khi tải dữ liệu sản phẩm!");
            window.location.href = 'index.php';
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Đã xảy ra lỗi khi kết nối tới máy chủ.");
    }
});

/**
 * Hàm render dữ liệu ra HTML
 */
function renderProductDetails(product) {
    // Format giá tiền VNĐ
    const formatPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price);

    // Điền dữ liệu vào các thẻ
    document.getElementById('pd-title').textContent = product.title;
    document.getElementById('pd-price').textContent = formatPrice;
    document.getElementById('bc-category').textContent = product.category_name || "Danh mục";
    document.getElementById('pd-category').textContent = product.category_name || "N/A";
    document.getElementById('pd-brand').textContent = product.brand_name || "N/A";
    document.getElementById('pd-seller-name').textContent = product.seller_name || "Người dùng";
    document.getElementById('pd-frame-size').textContent = product.frame_size || "N/A";
    document.getElementById('pd-frame-material').textContent = product.frame_material || "N/A";
    
    // Status badges
    let statusText = "Đang bán";
    if (product.status === 'SOLD') statusText = "Đã bán";
    else if (product.status === 'PENDING') statusText = "Đang giao dịch";
    else if (product.status === 'HIDDEN') statusText = "Đã ẩn";
    document.getElementById('pd-status').textContent = statusText;

    // Date
    const dateObj = new Date(product.created_at);
    document.getElementById('pd-created-at').textContent = dateObj.toLocaleDateString('vi-VN');

    // Description
    document.getElementById('pd-description').textContent = product.description || "Không có mô tả.";

    // ── Xử lý Hình ảnh ──────────────────────────────────────────────────────
    const currentImg = document.getElementById('current');
    const thumbContainer = document.getElementById('thumbnails');
    
    if (product.images && product.images.length > 0) {
        // Có ảnh thật
        const primary = product.images.find(img => img.is_primary) || product.images[0];
        currentImg.src = primary.image_url;

        // Render thumbnails
        thumbContainer.innerHTML = '';
        product.images.forEach((img, index) => {
            const thumb = document.createElement('img');
            thumb.src = img.image_url;
            thumb.alt = `Ảnh ${index + 1}`;
            thumb.style.width = '80px';
            thumb.style.height = '80px';
            thumb.style.objectFit = 'cover';
            thumb.style.cursor = 'pointer';
            thumb.style.borderRadius = '6px';
            thumb.style.border = '2px solid #eee';
            thumb.style.padding = '2px';
            
            if (img.image_url === currentImg.src) {
                thumb.style.borderColor = '#6259ca';
                thumb.style.boxShadow = '0 0 5px rgba(98, 89, 202, 0.5)';
            }

            thumb.addEventListener('click', function() {
                currentImg.src = this.src;
                // Highlight thumb đang chọn
                Array.from(thumbContainer.children).forEach(c => {
                    c.style.borderColor = '#eee';
                    c.style.boxShadow = 'none';
                });
                this.style.borderColor = '#6259ca';
                this.style.boxShadow = '0 0 5px rgba(98, 89, 202, 0.5)';
            });
            thumbContainer.appendChild(thumb);
        });
    } else {
        // Không có ảnh -> dùng placeholder
        currentImg.src = 'assets/images/items-grid/img1.jpg';
        thumbContainer.innerHTML = '<p class="text-muted small">Người bán không cung cấp thêm ảnh.</p>';
    }

    // ── Kiểm tra quyền mua ──────────────────────────────────────────────────
    const currentUser = auth.getCurrentUser();
    const btnBuyNow = document.getElementById('btn-buy-now');
    const msgOwnProduct = document.getElementById('msg-own-product');
    const msgSold = document.getElementById('msg-sold');

    if (product.status !== 'AVAILABLE') {
        msgSold.style.display = 'block';
        btnBuyNow.style.display = 'none';
    } else {
        if (currentUser && currentUser.user_id == product.seller_id) {
            btnBuyNow.style.display = 'none';
            msgOwnProduct.style.display = 'block';
        } else {
            btnBuyNow.style.display = 'block';
            btnBuyNow.href = `checkout.php?id=${product.post_id}`;
        }
    }
}
