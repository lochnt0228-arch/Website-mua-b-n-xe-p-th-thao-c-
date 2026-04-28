document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('keyword');
    const searchBtn = document.querySelector('.search-btn button');
    let originalBtnText = searchBtn ? searchBtn.innerHTML : '';
    
    if (searchInput) {
        // Debounce function
        function debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                // Hiển thị trạng thái đang tìm kiếm
                if (searchBtn && args[0].trim() !== '') {
                    searchBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Đang tìm...`;
                }
                
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        }

        // The function that performs frontend filtering
        function performSearch(query) {
            const lowerQuery = query.toLowerCase().trim();
            console.log(`[Mock API Call] Searching for: "${query}"`);
            
            // Lấy tất cả các thẻ sản phẩm trên trang (trong khu vực Sản Phẩm Mới Nhất)
            const items = document.querySelectorAll('.single-grid');
            let hasResults = false;

            items.forEach(item => {
                // Tìm tiêu đề xe đạp trong thẻ
                const titleElement = item.querySelector('.title a');
                if (titleElement) {
                    const title = titleElement.innerText.toLowerCase();
                    // So sánh từ khóa
                    if (title.includes(lowerQuery)) {
                        item.parentElement.style.display = 'block'; // Hiển thị lại cột chứa sản phẩm
                        hasResults = true;
                    } else {
                        item.parentElement.style.display = 'none'; // Ẩn cột chứa sản phẩm
                    }
                }
            });

            // Khôi phục text của nút tìm kiếm
            if (searchBtn) {
                searchBtn.innerHTML = originalBtnText;
            }

            // (Tuỳ chọn) Nếu không có kết quả nào, có thể hiện thông báo
            if (!hasResults && lowerQuery !== '') {
                console.log('Không tìm thấy sản phẩm nào khớp với từ khóa.');
            }
        }

        // Attach debounced handler to the input event
        const debouncedSearch = debounce((query) => {
            performSearch(query);
        }, 500); // Tăng delay lên 500ms để dễ nhìn thấy hiệu ứng loading hơn

        searchInput.addEventListener('input', (event) => {
            debouncedSearch(event.target.value);
        });
    }
});
