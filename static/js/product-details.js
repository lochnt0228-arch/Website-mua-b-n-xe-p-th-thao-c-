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
    
    // Status badges
    let statusText = "Đang bán";
    if (product.status === 'SOLD') statusText = "Đã bán";
    else if (product.status === 'PENDING') statusText = "Đang giao dịch";
    else if (product.status === 'HIDDEN') statusText = "Đã ẩn";
    document.getElementById('pd-status').textContent = statusText;

    // Date
    const dateObj = new Date(product.created_at);
    document.getElementById('pd-created-at').textContent = dateObj.toLocaleDateString('vi-VN');

    // Mở rộng
    document.getElementById('pd-description').textContent = product.description || "Không có mô tả.";
    document.getElementById('pd-frame-size').textContent = product.frame_size || "Không xác định";
    document.getElementById('pd-frame-material').textContent = product.frame_material || "Không xác định";
    
    // Thông tin người bán
    document.getElementById('pd-seller-name').textContent = product.seller_name || "Người dùng ẩn danh";

    // 3. Xử lý nút Mua Hàng
    const btnBuyNow = document.getElementById('btn-buy-now');
    const msgOwnProduct = document.getElementById('msg-own-product');
    const msgSold = document.getElementById('msg-sold');

    const currentUser = auth.getCurrentUser();

    if (product.status !== 'AVAILABLE') {
        // Nếu không AVAILABLE thì ẩn nút, hiện thông báo
        btnBuyNow.style.display = 'none';
        msgSold.style.display = 'block';
    } else {
        // Đang AVAILABLE
        if (currentUser && currentUser.id === product.seller_id) {
            // Nếu người đang xem là người đăng bán
            btnBuyNow.style.display = 'none';
            msgOwnProduct.style.display = 'block';
        } else {
            // Người xem hợp lệ
            btnBuyNow.style.display = 'block';
            btnBuyNow.href = `checkout.php?id=${product.post_id}`; // Redirect tới checkout
        }
    }
}
