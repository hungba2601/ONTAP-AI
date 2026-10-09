/**
 * =========================================================================
 * GOOGLE APPS SCRIPT - BACKEND GHI NHẬN KẾT QUẢ ÔN TẬP MÔN TRÍ TUỆ NHÂN TẠO
 * KHỐI 6, 7, 8, 9
 * =========================================================================
 * Bản quyền: Made by Nguyễn Phi Hùng - Zalo 0938750424
 * =========================================================================
 * Hướng dẫn cài đặt:
 * 1. Mở Google Sheet (trang tính mới) của bạn.
 * 2. Trên thanh menu, chọn: Tiện ích mở rộng (Extensions) > Apps Script.
 * 3. Xóa hết mã cũ trong file Code.gs và dán toàn bộ đoạn mã này vào.
 * 4. Nhấn nút "Lưu" (biểu tượng đĩa mềm hoặc Ctrl + S).
 * 5. Nhấn nút "Triển khai" (Deploy) > "Quản lý bản triển khai mới" (New deployment).
 * 6. Chọn loại: "Ứng dụng web" (Web app).
 * 7. Thiết lập cấu hình:
 *    - Mô tả: Backend Lưu Điểm Ôn Tập AI
 *    - Thực thi dưới dạng: Tôi (Execute as: Me)
 *    - Người có quyền truy cập: Bất kỳ ai (Who has access: Anyone)  <-- BẮT BUỘC CHỌN CÁI NÀY!
 * 8. Nhấn "Triển khai" (Deploy), cấp quyền truy cập tài khoản Google của bạn.
 * 9. Sao chép "URL ứng dụng web" (Web App URL có dạng https://script.google.com/macros/s/.../exec)
 *    và dán vào mục Cài Đặt trên trang web ôn tập.
 * =========================================================================
 */

// Tên trang tính mặc định để ghi dữ liệu
const SHEET_NAME = "Kết Quả Ôn Tập AI";

/**
 * Xử lý yêu cầu gửi kết quả từ trang web (POST request)
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // Khóa tạm thời 10 giây để tránh xung đột khi nhiều học sinh nộp bài cùng 1 lúc
  lock.tryLock(10000);

  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);

    // Nếu chưa có trang tính này thì tự động tạo mới và định dạng tiêu đề
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initSheetHeader(sheet);
    } else if (sheet.getLastRow() === 0) {
      initSheetHeader(sheet);
    }

    // Đọc dữ liệu gửi lên (Hỗ trợ cả JSON body và Form Post)
    let data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    // Tự động nâng cấp bảng nếu đang dùng tiêu đề cũ (chưa có cột Trường)
    ensureSchoolColumn(sheet);

    // Chuẩn bị thông tin ghi nhận
    const now = new Date();
    const formattedDate = Utilities.formatDate(now, "Asia/Ho_Chi_Minh", "dd/MM/yyyy HH:mm:ss");

    const timestamp = data.timestamp || formattedDate;
    const school = data.school || data.schoolName || "";
    const grade = data.grade ? "Khối " + data.grade : "";
    const className = data.className || "";
    const studentName = data.studentName || "";
    const lessonTitle = data.lessonTitle || "";
    const score = data.score || "";
    const percentage = data.percentage !== undefined ? data.percentage + "%" : "";
    const timeSpent = data.timeSpent || "";
    const feedback = data.feedback || "";
    const stt = Math.max(1, sheet.getLastRow()); // Số thứ tự tự động tăng

    // Thêm dòng mới vào Google Sheet (11 cột)
    sheet.appendRow([
      stt,
      timestamp,
      school,
      grade,
      className,
      studentName,
      lessonTitle,
      score,
      percentage,
      timeSpent,
      feedback
    ]);

    // Định dạng căn giữa cho các cột ngắn
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setHorizontalAlignment("center"); // STT
    sheet.getRange(lastRow, 2).setHorizontalAlignment("center"); // Thời gian
    sheet.getRange(lastRow, 3).setHorizontalAlignment("center"); // Trường
    sheet.getRange(lastRow, 4).setHorizontalAlignment("center"); // Khối
    sheet.getRange(lastRow, 5).setHorizontalAlignment("center"); // Lớp
    sheet.getRange(lastRow, 8).setHorizontalAlignment("center"); // Điểm số
    sheet.getRange(lastRow, 9).setHorizontalAlignment("center"); // %

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        message: "Lưu kết quả thành công!",
        row: lastRow
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Xử lý khi truy cập trực tiếp URL Web App bằng trình duyệt (GET request)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "online",
      message: "Hệ thống Backend Google Sheet cho Web Ôn Tập AI đang hoạt động tốt!",
      time: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Tự động kiểm tra và thêm cột "Trường" nếu bảng tính đã tạo trước đó theo cấu trúc cũ
 */
function ensureSchoolColumn(sheet) {
  if (sheet.getLastRow() >= 1) {
    const valCol3 = sheet.getRange(1, 3).getValue().toString().trim();
    // Nếu cột 3 là "Khối", nghĩa là bảng cũ chưa có cột "Trường"
    if (valCol3 === "Khối") {
      sheet.insertColumnBefore(3);
      const cellC1 = sheet.getRange(1, 3);
      cellC1.setValue("Trường");
      cellC1.setBackground("#1e293b");
      cellC1.setFontColor("#ffffff");
      cellC1.setFontWeight("bold");
      cellC1.setHorizontalAlignment("center");
      cellC1.setVerticalAlignment("middle");
      sheet.setColumnWidth(3, 170);
    }
  }
}

/**
 * Khởi tạo hàng tiêu đề bảng tính với giao diện chuyên nghiệp
 */
function initSheetHeader(sheet) {
  const headers = [
    "STT",
    "Thời Gian Nộp",
    "Trường",
    "Khối",
    "Lớp",
    "Họ Và Tên Học Sinh",
    "Tiết Ôn Tập",
    "Điểm Số",
    "Tỷ Lệ Đúng",
    "Thời Gian Làm",
    "Đánh Giá / Nhận Xét"
  ];

  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  // Định dạng tiêu đề đẹp mắt (màu xanh navy, chữ trắng in đậm, đóng băng dòng đầu)
  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#1e293b");
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // Đóng băng dòng 1
  sheet.setFrozenRows(1);

  // Cố định độ rộng các cột cơ bản
  sheet.setColumnWidth(1, 60);  // STT
  sheet.setColumnWidth(2, 160); // Thời gian
  sheet.setColumnWidth(3, 170); // Trường
  sheet.setColumnWidth(4, 90);  // Khối
  sheet.setColumnWidth(5, 90);  // Lớp
  sheet.setColumnWidth(6, 200); // Họ tên
  sheet.setColumnWidth(7, 280); // Tiết học
  sheet.setColumnWidth(8, 90);  // Điểm số
  sheet.setColumnWidth(9, 100); // %
  sheet.setColumnWidth(10, 120); // Thời gian làm
  sheet.setColumnWidth(11, 260); // Nhận xét
}

/**
 * Hàm hỗ trợ chạy thủ công trong Script Editor để khởi tạo bảng ngay lập tức
 */
function chayThuKhoiTaoBang() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  initSheetHeader(sheet);
  Logger.log("Đã khởi tạo bảng thành công!");
}
