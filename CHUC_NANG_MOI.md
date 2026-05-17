# 🎯 Hệ thống Quản lý Kho — Bản nâng cấp 2026

> Tài liệu giới thiệu tính năng mới cho khách hàng / ban quản lý.
> Tập trung vào **giá trị nghiệp vụ** — không cần kiến thức kỹ thuật.

---

## ❓ Vì sao cần nâng cấp?

Phiên bản trước hệ thống chỉ làm được những việc cơ bản: thêm sản phẩm, ghi chép nhập-xuất, xem tồn kho tổng. Khi kho phát triển, doanh nghiệp gặp các vấn đề thực tế sau:

| ❌ Vấn đề trước đây | ✅ Cách hệ thống mới giải quyết |
|---|---|
| Chỉ quản lý 1 kho — không biết hàng đang ở đâu | **Đa kho + sơ đồ vị trí 5 cấp** (Khu vực → Dãy → Kệ → Tầng → Ô) |
| Không quản lý lô hàng → hàng hết hạn vẫn bán | **Lô hàng + Hạn sử dụng + cảnh báo HSD** |
| Xuất hàng theo cảm tính → còn hàng tồn lâu | **Quy tắc FIFO / LIFO tự động** |
| Nhập hàng kém chất lượng vẫn lên kho | **Quy trình QC trước khi nhập** |
| Không biết SKU nào quan trọng nhất | **Phân tích ABC — top sản phẩm doanh thu** |
| Nhập sai mã thủ công, mất thời gian | **Quét Barcode/QR bằng camera/máy quét** |
| Cảnh báo chỉ có "thiếu hàng" | **Cảnh báo cả: thiếu, dư, sắp hết hạn, đã hết hạn** |

---

## 🆕 14 nhóm tính năng mới

### 1. 🏢 Quản lý đa kho

**Trước**: 1 kho duy nhất, không phân biệt được hàng nằm ở đâu.

**Sau**:
- Tạo nhiều kho (Kho chính, Kho phụ, Showroom...) — mỗi kho có mã, địa chỉ, người quản lý riêng.
- Đánh dấu **kho mặc định** để hệ thống tự động dùng khi không chỉ định.
- Báo cáo tồn kho có thể lọc theo từng kho.

**Tình huống thực tế**: Doanh nghiệp có showroom trung tâm + 2 kho ngoại ô. Có thể biết được mỗi nơi đang có bao nhiêu hàng, hàng đang ở đâu.

---

### 2. 📍 Sơ đồ vị trí trong kho (5 cấp)

**Trước**: Hàng để khắp nơi, nhân viên mới mất 30 phút tìm 1 SKU.

**Sau**: Mỗi sản phẩm gắn với vị trí chuẩn 5 cấp:
> **Khu vực A → Dãy 01 → Kệ 03 → Tầng 02 → Ô 05**
>
> Mã vị trí: `A-01-03-02-05`

- Tự động sinh mã vị trí từ thông tin nhập
- Dễ dàng quản lý sức chứa từng vị trí
- Khi xuất hàng, hệ thống biết vị trí cần lấy

**Lợi ích**: Nhân viên mới có thể tìm hàng trong **30 giây**, giảm sai sót.

---

### 3. 📦 Quản lý Lô hàng + Hạn sử dụng

**Trước**: Hàng nhập về cộng dồn vào 1 con số, không biết lô nào nhập trước, lô nào sắp hết hạn.

**Sau**:
- Mỗi lần nhập tạo **1 lô hàng** riêng với: mã lô, ngày sản xuất, hạn sử dụng, NCC, kho chứa.
- Hệ thống tự động sinh mã lô nếu không nhập (vd: `IMP20260424001-15`)
- Trang **Lô hàng** liệt kê:
  - 🟢 **Còn nhiều thời gian** (HSD > 30 ngày)
  - 🟡 **Sắp hết hạn** (≤ 30 ngày)
  - 🔴 **Đã hết hạn**
  - ⚫ **Đã xuất hết** (DEPLETED)

**Tình huống thực tế**: Quản lý kho thực phẩm/dược phẩm/mỹ phẩm — biết chính xác lô nào cần xuất gấp, lô nào phải hủy.

---

### 4. 🔄 FIFO / LIFO — Quy tắc xuất hàng tự động

**Trước**: Nhân viên xuất hàng theo cảm tính, lô cũ đôi khi tồn lại quá lâu.

**Sau**: Khi tạo phiếu xuất, chọn 1 trong 3 quy tắc:

| Quy tắc | Ý nghĩa | Phù hợp |
|---|---|---|
| **FIFO** (First In First Out) | Lô cũ / sắp hết hạn xuất trước | Thực phẩm, dược phẩm |
| **LIFO** (Last In First Out) | Lô mới xuất trước | Hàng không hạn sử dụng (vật liệu, đồ điện) |
| **Manual** | Nhân viên tự chọn lô | Hàng đặc biệt |

Hệ thống **tự động** chia số lượng cần xuất giữa nhiều lô — vd cần xuất 80, lô A còn 50 → lấy hết, lô B lấy thêm 30. Không cần tính tay.

**Lợi ích**: Giảm 80–95% lượng hàng phải hủy do hết hạn.

---

### 5. 📋 Picking List — Phiếu soạn hàng

**Trước**: Nhân viên cầm phiếu xuất rồi tự đi tìm trong kho.

**Sau**: Bấm 1 nút **"Xem Picking List"** → hệ thống hiển thị:
- Lô nào cần lấy
- Mã lô + HSD
- Số lượng từng lô
- (Pha tiếp) Vị trí cụ thể trong kho

**Tình huống thực tế**: Thay vì 1 đơn hàng mất 15 phút soạn → còn 3–5 phút.

---

### 6. ✅ Quy trình QC (Kiểm tra chất lượng)

**Trước**: Hàng nhập về là tự động cộng vào kho — chất lượng kém vẫn lên hệ thống.

**Sau**: Tích **"Yêu cầu QC"** khi tạo phiếu nhập:
1. Phiếu tạo → trạng thái **PENDING + QC Pending**
2. Nhân viên kiểm hàng vào hệ thống bấm **QC Đạt** hoặc **QC Loại**
3. Chỉ phiếu **QC Đạt** mới được duyệt vào kho
4. Phiếu **QC Loại** không thể duyệt — bảo vệ kho khỏi hàng kém

**Lợi ích**: Tách riêng vai trò Kiểm hàng và Thủ kho, đảm bảo quy trình ISO.

---

### 7. ↔️ Chuyển kho nội bộ

**Trước**: Phải tạo 1 phiếu xuất ở kho A, 1 phiếu nhập ở kho B, dễ sai số liệu.

**Sau**: Workflow chuyển kho 3 bước:
1. **PENDING** — tạo phiếu chuyển từ kho A → kho B
2. **IN_TRANSIT** — admin duyệt, hàng rời kho A (đang vận chuyển)
3. **COMPLETED** — kho B xác nhận đã nhận đủ hàng

Trong lúc **IN_TRANSIT**, hàng không nằm ở kho nào → tránh xuất nhầm.

**Tình huống thực tế**: Chuyển 100 thùng từ Kho HCM → Kho Hà Nội. Trong 3 ngày vận chuyển, không có nhân viên nào ở 2 đầu vô tình bán/xuất hàng đó.

---

### 8. 🗑 Xuất hủy (Disposal)

**Trước**: Hàng hỏng/hết hạn không có cơ chế hủy chính thức.

**Sau**: Tạo phiếu xuất kiểu **DISPOSAL**:
- Khách hàng để trống (không cần)
- Bắt buộc nhập **lý do hủy** (vd: "Hết hạn ngày 2026-04-01")
- Sau khi duyệt, lịch sử có dấu hiệu rõ "Xuất hủy"
- Báo cáo riêng để theo dõi tỷ lệ hàng hủy

**Lợi ích**: Số liệu kế toán chính xác, tách biệt hàng bán vs hàng hủy.

---

### 9. ⚠️ Cảnh báo thông minh 4 cấp

**Trước**: Chỉ có 1 cảnh báo "thiếu hàng".

**Sau**: Dashboard hiển thị 4 loại cảnh báo (chỉ hiện cái đang có vấn đề):

| Cảnh báo | Ý nghĩa | Hành động |
|---|---|---|
| 🟡 **Dưới tồn tối thiểu** | SKU < `min_stock` | Đặt hàng bổ sung |
| 🔵 **Vượt tồn tối đa** | SKU > `max_stock` | Đẩy bán/khuyến mãi |
| 🟠 **Lô sắp hết hạn (30 ngày)** | Cần ưu tiên xuất | Lên kế hoạch khuyến mãi |
| 🔴 **Lô đã hết hạn** | Cần xuất hủy | Tạo phiếu disposal |

Click vào card → đi thẳng đến danh sách chi tiết.

**Lợi ích**: Quản lý không cần đào báo cáo, mọi vấn đề tự nổi lên.

---

### 10. 📊 Phân tích ABC

**Trước**: Không biết SKU nào tạo doanh thu, SKU nào "ngủ trong kho".

**Sau**: Trang **Phân tích ABC** dùng nguyên tắc **Pareto 70/20/10**:

| Nhóm | Đóng góp doanh thu | Số SKU | Chiến lược |
|---|---|---|---|
| **A** | 70% đầu | ~10–20% | Tồn kho dày, ưu tiên đặt hàng |
| **B** | 20% kế | ~30% | Tồn vừa phải |
| **C** | 10% cuối | ~50–60% | Tồn ít, xem xét loại bỏ |

Có thể chuyển giữa **theo doanh thu** ↔ **theo số lượng xuất**, lọc theo khoảng thời gian.

**Lợi ích**: Tập trung quản lý 20% SKU tạo 80% doanh thu.

---

### 11. 📜 Thẻ kho (Stock Card)

**Trước**: Để xem 1 SKU đã biến động thế nào, phải mở từng phiếu nhập/xuất.

**Sau**: 1 trang duy nhất hiển thị **toàn bộ lịch sử biến động** của 1 SKU:

| Thời gian | Loại | Số lượng | Tồn trước | Tồn sau | Phiếu | Người |
|---|---|---|---|---|---|---|
| 24/04 09:30 | 📥 Nhập | +100 | 50 | 150 | IMP...001 | Lan |
| 24/04 14:20 | 📤 Xuất | -30 | 150 | 120 | EXP...005 | Hùng |
| 25/04 10:00 | 🔄 Chuyển đi | -50 | 120 | 70 | TRF...001 | Hùng |
| ... | | | | | | |

- Lọc theo loại (Nhập / Xuất / Chuyển / Hủy / Kiểm kê)
- Lọc theo khoảng thời gian
- Phân trang

**Lợi ích**: Truy vết hàng cực nhanh khi có sự cố — "Hàng X đi đâu rồi?"

---

### 12. 📷 Barcode / QR Code — Quét bằng camera & máy quét

**Trước**: Nhân viên gõ tay SKU → mất thời gian + sai chính tả.

**Sau**: Trang **Quét/In mã**:
- **Camera laptop / điện thoại**: trỏ vào barcode/QR → hiện sản phẩm trong 1 giây
- **Máy quét USB**: cắm vào máy tính, quét → tự động tra cứu (giả lập bàn phím)
- **Nhập tay**: vẫn được, làm dự phòng

Tra cứu theo **3 ưu tiên**: barcode SKU → barcode đơn vị (Thùng riêng / Chai riêng) → SKU.

---

### 13. 🖨 In tem Barcode/QR + Xuất PDF

**Trước**: Không có công cụ in tem.

**Sau**: Sau khi tra SP:
- Chọn loại: **CODE128 / EAN13 / QR**
- Chọn **số bản** (1–100 trên 1 trang)
- Bấm **🖨 In** — mở dialog in
- Bấm **📄 Tải PDF** — tải file PDF về (dùng để gửi email, lưu trữ, in sau)

Tên file tự sinh `tem-NNT-001.pdf`. PDF khổ A4, lề 15mm, ảnh tem co vừa trang.

**Lợi ích**: Có thể in tem hàng loạt, gửi PDF cho người khác in từ xa.

---

### 14. 🔢 Đa đơn vị + Thuộc tính sản phẩm

**Trước**: 1 SP chỉ có 1 đơn vị, không có biến thể (màu/size).

**Sau**:

#### Đa đơn vị quy đổi
Ví dụ nước ngọt:
- **Chai** (đơn vị cơ sở, hệ số = 1)
- **Lốc** (hệ số = 6 → 1 lốc = 6 chai)
- **Thùng** (hệ số = 24 → 1 thùng = 24 chai)

Mỗi đơn vị có thể có **barcode riêng** (mã thùng khác mã chai). Hệ thống tự quy đổi.

#### Thuộc tính biến thể
Ví dụ áo:
- `color: Đỏ`, `color: Xanh`
- `size: M`, `size: L`, `size: XL`

**Lợi ích**: Catalog phong phú hơn, đáp ứng đa dạng ngành hàng.

---

## 📊 Bảng tổng hợp — Trước & Sau

| Tính năng | Trước | Sau |
|---|---|---|
| Số kho quản lý | 1 | Không giới hạn |
| Vị trí trong kho | Không có | 5 cấp |
| Lô hàng + HSD | Không có | Có |
| FIFO/LIFO | Không | FIFO + LIFO + Manual |
| QC chất lượng | Không | Có workflow |
| Chuyển kho nội bộ | Thủ công | Workflow 3 bước |
| Loại phiếu nhập | 1 (mua) | 3 (mua / trả / nhận chuyển) |
| Loại phiếu xuất | 1 (bán) | 3 (bán / hủy / chuyển đi) |
| Cảnh báo | 1 (thiếu hàng) | 4 (thiếu/dư/sắp hết hạn/hết hạn) |
| Báo cáo phân tích | Tồn kho cơ bản | + ABC + Thẻ kho |
| Quét mã | Không | Camera + USB scanner |
| In tem | Không | Print + PDF |
| Đơn vị | 1 | Nhiều + quy đổi |
| Thuộc tính | Không | Tuỳ chỉnh (màu/size...) |

---

## 💰 Lợi ích kinh doanh có thể đo lường

| Chỉ số | Cải thiện kỳ vọng | Cách đo |
|---|---|---|
| ⏱ Thời gian soạn 1 đơn xuất | Giảm 60–70% | Picking List + Vị trí |
| 🗑 Tỷ lệ hàng hủy do hết hạn | Giảm 80–95% | FIFO + Cảnh báo HSD |
| ❌ Sai sót do gõ tay SKU | Giảm 95% | Barcode scanner |
| 🔍 Thời gian tìm 1 sản phẩm trong kho | 30 phút → 30 giây | Sơ đồ vị trí |
| 📦 Mức tồn kho dư thừa | Giảm 20–30% | Cảnh báo tồn tối đa + ABC |
| 📋 Truy vết khi sự cố | Vài giờ → vài giây | Thẻ kho |
| 👥 Đào tạo nhân viên mới | 1 tuần → 1 ngày | UI rõ ràng + sơ đồ vị trí |

---

## 🎯 Đối tượng phù hợp

Hệ thống này phù hợp với:

✅ **Doanh nghiệp đa kho** (chuỗi cửa hàng, công ty có nhiều showroom)
✅ **Hàng có hạn sử dụng** (thực phẩm, dược phẩm, mỹ phẩm, hóa chất)
✅ **Cần truy xuất nguồn gốc** (lô sản xuất, mã barcode)
✅ **Quản lý chất lượng nghiêm ngặt** (cần QC)
✅ **Doanh nghiệp đang scale** (cần phân tích ABC để tối ưu vốn)

---

## 🚀 Khả năng mở rộng tương lai

Hệ thống đã đặt nền tảng kỹ thuật cho các mở rộng sau:
- Tích hợp với **đối tác giao hàng** (GHN, Viettel Post)
- Tích hợp **POS** bán lẻ + đồng bộ tồn
- **Mobile app** cho nhân viên kho (quét mã trực tiếp)
- **API public** cho đối tác/website thương mại điện tử
- **Trí tuệ nhân tạo** dự báo tồn kho dựa trên lịch sử ABC

---

## 📞 Liên hệ trình bày trực tiếp

Nếu cần demo trực tiếp, các trang quan trọng để chỉ:
1. **Dashboard** (`/`) — cảnh báo tự động
2. **Sản phẩm** (`/products`) — đa đơn vị + thuộc tính
3. **Kho** + **Vị trí** (`/warehouses`, `/locations`) — sơ đồ kho
4. **Phiếu nhập** (`/imports`) — QC + lô hàng
5. **Phiếu xuất** (`/exports`) — FIFO + Picking List
6. **Chuyển kho** (`/transfers`) — workflow IN_TRANSIT
7. **Thẻ kho** (`/stock-card`) — truy vết
8. **Phân tích ABC** (`/abc-analysis`) — báo cáo Pareto
9. **Quét mã** (`/scanner`) — camera + in tem PDF

---

> **Tóm 1 câu**: Hệ thống chuyển từ "ghi sổ kho" thành "quản lý vận hành kho hiện đại theo chuẩn doanh nghiệp" — giúp giảm sai sót, tiết kiệm thời gian, tăng hiệu quả vốn tồn kho.
