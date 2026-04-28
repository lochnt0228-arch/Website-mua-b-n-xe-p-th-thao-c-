document.addEventListener('DOMContentLoaded', function () {
    const sellForm = document.getElementById('sellForm');
    const btnSubmit = document.getElementById('btnSubmitSell');

    if (sellForm && btnSubmit) {
        sellForm.addEventListener('submit', function (event) {
            // Chặn hành vi submit mặc định của form
            event.preventDefault();

            // Vô hiệu hóa nút và đổi text + thêm spinner
            const originalText = btnSubmit.innerHTML;
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang xử lý...`;

            // Lấy thông tin từ form
            const title = document.getElementById('title').value;
            const price = document.getElementById('price').value;
            const category = document.getElementById('category').value;
            const description = document.getElementById('description').value;

            console.log("Đang gọi API đăng bán xe với dữ liệu:", { title, price, category, description });

            // Mock API request (Giả lập thời gian chờ 2 giây)
            setTimeout(() => {
                console.log("Đăng tin thành công!");
                
                // Khôi phục nút
                btnSubmit.disabled = false;
                btnSubmit.innerHTML = originalText;
                
                // Reset form
                sellForm.reset();

                // Hiển thị thông báo thành công (có thể thay bằng Toast hoặc Alert)
                alert("Đăng tin bán xe thành công!");

            }, 2000);
        });
    }
});
