# HƯỚNG DẪN KẾT NỐI HỆ THỐNG ÔN TẬP AI VỚI GOOGLE SHEET

Tài liệu này hướng dẫn chi tiết từng bước để tạo bảng tính Google Sheet và triển khai mã Google Apps Script để tự động lưu kết quả bài làm của học sinh (Ngày giờ, Khối, Lớp, Họ và tên, Tiết ôn tập, Điểm số, Đánh giá).

---

## BƯỚC 1: TẠO FILE GOOGLE SHEET MỚI

1. Mở trình duyệt web và truy cập vào [Google Sheets](https://sheets.new) (hoặc vào [Google Drive](https://drive.google.com) và tạo một Trang tính mới).
2. Đổi tên file bảng tính thành: **"KẾT QUẢ ÔN TẬP TRÍ TUỆ NHÂN TẠO"** (hoặc tên tùy bạn chọn).

---

## BƯỚC 2: MỞ GOOGLE APPS SCRIPT VÀ DÁN MÃ

1. Trên thanh công cụ của Google Sheet, bấm vào menu:
   - **Tiện ích mở rộng** (Extensions) ➔ **Apps Script**.
2. Một tab trình duyệt mới sẽ mở ra với giao diện lập trình.
3. Trong khung soạn thảo mã (file `Code.gs`):
   - Nhấn `Ctrl + A` để chọn toàn bộ mã mặc định rồi xóa đi.
   - Mở file [GoogleSheet_Backend.gs](file:///d:/DU%20AN/DAY%20H%E1%BB%8CC%20AI/GoogleSheet_Backend.gs) trong thư mục dự án, sao chép (copy) toàn bộ nội dung và dán (paste) vào khung soạn thảo Apps Script.
4. Nhấn phím `Ctrl + S` (hoặc biểu tượng đĩa mềm 💾) để lưu dự án.

> **Mẹo nhỏ:** Bạn có thể bấm chọn hàm `chayThuKhoiTaoBang` ở thanh chọn hàm phía trên rồi bấm **"Chạy" (Run)** để Google Sheet tự tạo sẵn hàng tiêu đề đẹp mắt trước. Lần đầu chạy Google sẽ yêu cầu "Xem lại quyền" ➔ Chọn tài khoản của bạn ➔ Bấm "Nâng cao" (Advanced) ➔ Bấm "Đi tới... (không an toàn)" ➔ Bấm "Cho phép" (Allow).

---

## BƯỚC 3: TRIỂN KHAI THÀNH WEB APP (QUAN TRỌNG NHẤT)

1. Ở góc trên bên phải màn hình Apps Script, bấm vào nút màu xanh **"Triển khai"** (Deploy) ➔ Chọn **"Quản lý bản triển khai mới"** (New deployment).
2. Bấm vào biểu tượng **bánh răng** ⚙️ bên cạnh chữ "Chọn loại" (Select type) ➔ Chọn **"Ứng dụng web"** (Web app).
3. Điền các thông tin như sau:
   - **Mô tả** (Description): `Backend Lưu Điểm Ôn Tập AI`
   - **Thực thi dưới dạng** (Execute as): Chọn **Tôi** (*Me - email của bạn*)
   - **Người có quyền truy cập** (Who has access): Chọn **Bất kỳ ai** (*Anyone*) ⚠️ **LƯU Ý:** Bắt buộc phải chọn mục này để học sinh nộp bài mà không bị yêu cầu đăng nhập tài khoản Google.
4. Bấm nút **"Triển khai"** (Deploy).
5. Nếu Google hỏi cấp quyền truy cập:
   - Bấm **"Ủy quyền truy cập"** (Authorize access).
   - Chọn tài khoản Google của bạn.
   - Bấm nút **"Nâng cao"** (Advanced) ở dưới cùng bên trái.
   - Bấm vào dòng chữ **"Đi tới ... (không an toàn)"** (Go to ... unsafe).
   - Bấm **"Cho phép"** (Allow).
6. Sau khi triển khai xong, Google sẽ cung cấp cho bạn một đường dẫn tại mục **"URL ứng dụng web"** (Web app URL).
   - Đường dẫn có dạng:
     `https://script.google.com/macros/s/AKfycbx.../exec`
7. Hãy **Sao chép (Copy)** đường dẫn URL này!

---

## BƯỚC 4: DÁN URL VÀO TRANG WEB ÔN TẬP

1. Mở trang web [index.html](file:///d:/DU%20AN/DAY%20H%E1%BB%8CC%20AI/index.html) (hoặc [HE_THONG_ON_TAP_AI_ALL_IN_ONE.html](file:///d:/DU%20AN/DAY%20H%E1%BB%8CC%20AI/HE_THONG_ON_TAP_AI_ALL_IN_ONE.html)) bằng trình duyệt.
2. Trên góc phải thanh tiêu đề, bấm vào nút **"🔑 Quản trị"** (Nút chìa khóa).
3. Nhập mật khẩu: **`12345`** rồi bấm **"Mở khóa"**.
4. Nút **"Google Sheet"** sẽ xuất hiện và tự động mở bảng cấu hình:
   - Dán đường dẫn **URL ứng dụng web** (đã sao chép ở Bước 3) vào ô nhập liệu.
   - Bấm **"Kiểm tra kết nối"** (nếu muốn) ➔ Bấm **"Lưu Cấu Hình"**.
5. Trang web sẽ ghi nhớ URL này trên trình duyệt. Từ nay, mỗi khi học sinh làm bài và bấm **"Nộp bài & Lưu kết quả"**, hệ thống sẽ tự động gửi:
   - 📅 **Ngày & Giờ nộp**
   - 🏫 **Khối** (6, 7, 8 hoặc 9)
   - 🏷️ **Lớp** (VD: 6A1, 7/2, 8B, 9A...)
   - 👤 **Họ và tên học sinh**
   - 📖 **Tiết ôn tập**
   - 🎯 **Điểm số** (VD: 9/10)
   - 📊 **Tỷ lệ đúng** (VD: 90%)
   - ⏱️ **Thời gian làm bài**
   - 💬 **Nhận xét kết quả**

---

## MẸO QUẢN TRỊ DÀNH CHO THẦY CÔ
- **Cập nhật mã:** Nếu sau này thầy cô sửa đổi mã Apps Script, hãy vào **Triển khai** > **Quản lý bản triển khai** (Manage deployments) > Bấm icon bút chì ✏️ > Chọn **Phiên bản mới** (New version) > Bấm **Triển khai** để thay đổi có hiệu lực.
- **Thống kê:** Trong Google Sheet, thầy cô có thể dùng các tính năng Lọc (Filter), Pivot Table để lọc xem điểm của từng lớp hoặc từng học sinh vô cùng thuận tiện.

---

> 💡 **Bản quyền phần mềm:** Made by Nguyễn Phi Hùng - Zalo 0938750424

