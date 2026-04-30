document.addEventListener('DOMContentLoaded', function () {
    const checkoutForm = document.getElementById('checkoutForm');
    const btnSubmit = document.getElementById('btnSubmitOrder');

    if (checkoutForm && btnSubmit) {
        checkoutForm.addEventListener('submit', function (event) {
            // Chặn hành vi submit mặc định của form
            event.preventDefault();

            // Vô hiệu hóa nút và đổi text + thêm spinner
            const originalText = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...`;

            // Lấy thông tin từ form
            const fullName = document.getElementById('fullName').value;
            const phone = document.getElementById('phone').value;
            const address = document.getElementById('address').value;
            const notes = document.getElementById('notes').value;
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

            console.log("Đang gọi API tạo đơn hàng với dữ liệu:", { fullName, phone, address, notes, paymentMethod });

            // Mock API request (Giả lập thời gian chờ 2 giây)
            setTimeout(() => {
                console.log("Đặt hàng thành công!");
                
                // Khôi phục nút
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalText;
                
                // Reset form
                checkoutForm.reset();

                // Hiển thị thông báo thành công và chuyển hướng
                alert("Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại Chợ Xe Đạp Cũ.");
                window.location.href = "index.html"; // Trở về trang chủ sau khi mua

            }, 2000);
        });
    }
});
