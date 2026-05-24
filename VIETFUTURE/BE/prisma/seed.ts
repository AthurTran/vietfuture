import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const frontendQuestions = [
  {
    question:
      "1. Đâu là Hook trong React dùng để quản lý các side effects như gọi API hoặc tương tác với DOM?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    answerIndex: 1,
  },
  {
    question:
      "2. Thuộc tính CSS nào giúp tạo layout dạng lưới linh hoạt theo cả hai chiều (Hàng và Cột)?",
    options: ["Flexbox", "CSS Grid", "Block Layout", "Table Position"],
    answerIndex: 1,
  },
  {
    question:
      "3. Cơ chế nào của JavaScript giúp xử lý các tác vụ bất đồng bộ tuần tự, tránh tình trạng Callback Hell?",
    options: [
      "Promises / Async-Await",
      "For...in loops",
      "Switch-case control",
      "Local Storage Event",
    ],
    answerIndex: 0,
  },
  {
    question:
      "4. Virtual DOM trong các thư viện như React hoạt động theo cơ chế cốt lõi nào để tối ưu hiệu năng?",
    options: [
      "Cập nhật lại toàn bộ cây DOM thật mỗi khi state thay đổi",
      "Tạo một bản sao DOM bằng HTML thuần rồi ghi đè",
      "So sánh sự thay đổi (Diffing) và chỉ cập nhật vùng bị tác động lên DOM thật",
      "Chuyển toàn bộ giao diện thành WebAssembly",
    ],
    answerIndex: 2,
  },
  {
    question:
      "5. Để tránh việc một Component con bị re-render vô điều kiện khi Component cha thay đổi trạng thái, ta sử dụng giải pháp nào?",
    options: [
      "Sử dụng thẻ div thay vì Fragment",
      "Bọc Component con trong React.memo hoặc dùng useMemo/useCallback",
      "Chuyển Component con thành Class Component",
      "Khởi tạo lại biến bằng từ khóa var",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Điểm khác biệt lớn nhất giữa localStorage và sessionStorage trong trình duyệt là gì?",
    options: [
      "localStorage lưu dữ liệu nhiều hơn sessionStorage gấp 10 lần",
      "sessionStorage tự động xóa dữ liệu khi đóng tab hoặc trình duyệt",
      "localStorage chỉ đọc được bằng ngôn ngữ Backend",
      "sessionStorage bảo mật dữ liệu bằng mã hóa AES mặc định",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Trong chuẩn SEO và Accessibility, việc sử dụng các thẻ như <header>, <nav>, <article>, <section> được gọi là gì?",
    options: [
      "Inline Elements",
      "Semantic HTML",
      "Shadow DOM tags",
      "Style Selectors",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Khi gặp lỗi CORS (Cross-Origin Resource Sharing) ở Client, nguyên nhân phổ biến nhất là do đâu?",
    options: [
      "Do file JavaScript bị lỗi cú pháp nghiêm trọng",
      "Trình duyệt chặn do Server API không cấu hình cho phép domain của Client truy cập",
      "Do đường truyền mạng Internet bị ngắt quãng liên tục",
      "Do phiên bản React đang dùng quá cũ",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Trong CSS, sự khác biệt giữa hai đơn vị đo lường 'em' và 'rem' là gì?",
    options: [
      "'em' dựa vào font phần tử cha, còn 'rem' dựa vào font phần tử gốc (HTML)",
      "'rem' dùng cho mobile, 'em' chỉ dùng cho desktop",
      "'em' có giá trị cố định, 'rem' thay đổi theo độ phân giải",
      "Không có sự khác biệt, hai đơn vị này tính giống nhau",
    ],
    answerIndex: 0,
  },
  {
    question:
      "10. State Management toàn cục (như Redux, Zustand) sinh ra nhằm giải quyết triệt để bài toán khó khăn nào trong React?",
    options: [
      "Tăng tốc độ tải ảnh động của trang web",
      "Hạn chế tình trạng lạm dụng Props Drilling truyền qua quá nhiều tầng",
      "Thay thế hoàn toàn cơ chế gọi API bằng Axios",
      "Tự động dịch mã CSS sang JavaScript",
    ],
    answerIndex: 1,
  },
];

const backendQuestions = [
  {
    question:
      "1. Kiến trúc nào quy định chuẩn giao tiếp Stateless (không lưu trạng thái) giữa Client và Server qua các phương thức HTTP?",
    options: [
      "SOAP Protocol",
      "GraphQL API",
      "RESTful API",
      "gRPC Remote Call",
    ],
    answerIndex: 2,
  },
  {
    question:
      "2. Trong cơ sở dữ liệu quan hệ (SQL), từ khóa nào dùng để kết hợp các hàng từ hai hoặc nhiều bảng dựa trên một cột chung?",
    options: ["MERGE", "COMBINE", "JOIN", "APPEND"],
    answerIndex: 2,
  },
  {
    question:
      "3. Khi lưu trữ mật khẩu người dùng vào Database, lập trình viên bắt buộc phải xử lý theo nguyên tắc nào bảo mật nhất?",
    options: [
      "Mã hóa hai chiều bằng thuật toán đối xứng AES",
      "Băm mật khẩu một chiều kèm chuỗi ngẫu nhiên (Hashing với Salt bằng Bcrypt/Argon2)",
      "Lưu dưới dạng chuỗi rõ ràng (Plain-Text) để dễ đối chiếu",
      "Mã hóa chuỗi mật khẩu thành định dạng Base64",
    ],
    answerIndex: 1,
  },
  {
    question:
      "4. Việc tạo Index (Chỉ mục) trong các bảng của Database mang lại lợi ích và tác hại đánh đổi nào?",
    options: [
      "Tăng tốc độ ghi (INSERT) nhưng làm chậm tốc độ đọc (SELECT)",
      "Tăng tốc độ tìm kiếm (SELECT) nhưng làm giảm hiệu năng ghi và tốn dung lượng ổ đĩa",
      "Lưu trữ được nhiều dữ liệu hơn nhưng bảo mật kém đi",
      "Xóa hoàn toàn các dữ liệu bị trùng lặp tự động",
    ],
    answerIndex: 1,
  },
  {
    question:
      "5. Cấu trúc của một chuỗi mã xác thực JWT (JSON Web Token) tiêu chuẩn gồm những phần nào phân cách bởi dấu chấm?",
    options: [
      "Username, Password, SecretKey",
      "Header, Payload, Signature",
      "TokenID, ExpiredTime, RoleData",
      "Request, Response, Status",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Trong thiết kế hệ thống lớn, Redis thường được tích hợp vào kiến trúc Backend with vai trò chủ đạo nào?",
    options: [
      "Lưu trữ tệp tin đa phương tiện như video, hình ảnh nặng",
      "Làm hệ quản trị cơ sở dữ liệu quan hệ thay thế MySQL",
      "Lưu bộ nhớ đệm (Caching trên RAM) để giảm tải DB và tăng tốc phản hồi",
      "Biên dịch mã nguồn Backend thành mã máy",
    ],
    answerIndex: 2,
  },
  {
    question:
      "7. Khái niệm 'Middleware' trong các Framework Backend (như Express, Spring Boot, NestJS) đóng vai trò gì?",
    options: [
      "Là một ứng dụng chạy độc lập để vẽ biểu đồ cơ sở dữ liệu",
      "Là các hàm trung gian xử lý Request trước khi đến Controller (Auth, Log dữ liệu...)",
      "Là công cụ để tối ưu hóa mã CSS giao diện Client",
      "Là hệ thống phần cứng máy chủ trung gian",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Điểm khác biệt cốt lõi về mặt kiến trúc giữa Docker Container và Máy ảo (Virtual Machine - VM) là gì?",
    options: [
      "Container chạy trực tiếp chia sẻ chung Kernel của Host OS, còn VM cần Hệ điều hành khách (Guest OS) riêng biệt",
      "VM khởi động nhanh hơn Container gấp nhiều lần",
      "Container tiêu tốn tài nguyên phần cứng (RAM/CPU) nặng hơn VM",
      "Container chỉ chạy được trên Linux, không chạy được trên Windows",
    ],
    answerIndex: 0,
  },
  {
    question:
      "9. Tính chất 'Atomicity' (Tính nguyên tố) trong bộ nguyên tắc ACID của Transactions Database nghĩa là gì?",
    options: [
      "Dữ liệu sau khi giao dịch phải luôn luôn đồng nhất",
      "Nhiều giao dịch chạy song song không được can thiệp vào nhau",
      "Giao dịch phải thực thi trọn vẹn toàn bộ, nếu một lệnh lỗi thì phải khôi phục lại (Rollback)",
      "Dữ liệu lưu xuống đĩa cứng sẽ duy trì vĩnh viễn",
    ],
    answerIndex: 2,
  },
  {
    question:
      "10. Kiến trúc Microservices (Vi dịch vụ) giải quyết bài toán gì so với kiến trúc Monolith (Nguyên khối)?",
    options: [
      "Giúp code gọn gàng trong duy nhất một thư mục để dễ quản lý",
      "Giảm chi phí thuê máy chủ Cloud xuống mức tối thiểu",
      "Giúp hệ thống dễ dàng mở rộng độc lập, tăng tính cô lập lỗi và phù hợp với dự án lớn",
      "Tăng tốc độ kết nối mạng LAN nội bộ",
    ],
    answerIndex: 2,
  },
];

const fullstackQuestions = [
  {
    question:
      "1. Mô hình kiến trúc kết hợp SSR (Server-Side Rendering) và CSR (Client-Side Rendering) phổ biến trong Next.js/Nuxt.js gọi là gì?",
    options: ["Hydration", "Compilation", "Transpilation", "Obfuscation"],
    answerIndex: 0,
  },
  {
    question:
      "2. Phương thức bảo mật chống tấn công XSS (Cross-Site Scripting) hiệu quả nhất cần phối hợp ở cả 2 phía là gì?",
    options: [
      "Ẩn mã nguồn Frontend và đổi cổng port Backend",
      "Sanitize lọc dữ liệu đầu vào ở Backend và Escape dữ liệu đầu ra khi hiển thị ở Frontend",
      "Sử dụng giao thức HTTPS và cài đặt tường lửa",
      "Mã hóa toàn bộ database thành file text tĩnh",
    ],
    answerIndex: 1,
  },
  {
    question:
      "3. Khi thiết kế hệ thống dữ liệu, trường hợp nào lập trình viên nên ưu tiên chọn NoSQL (MongoDB) thay vì SQL (MySQL)?",
    options: [
      "Hệ thống ngân hàng cần tính toàn vẹn giao dịch ACID nghiêm ngặt",
      "Dữ liệu dạng tài liệu JSON, cấu trúc linh hoạt, không cố định và thay đổi thường xuyên",
      "Khi ứng dụng chỉ có duy nhất một bảng dữ liệu",
      "Khi hệ thống cần truy vấn JOIN hàng chục bảng cùng một lúc",
    ],
    answerIndex: 1,
  },
  {
    question:
      "4. Lợi ích lớn nhất của việc áp dụng GraphQL thay vì chuẩn REST API truyền thống là gì?",
    options: [
      "Tốc độ kết nối mạng Internet nhanh hơn",
      "Cho phép Client định nghĩa chính xác cấu trúc dữ liệu cần lấy, tránh Over-fetching và Under-fetching",
      "Không cần viết code Backend nữa",
      "Bảo mật dữ liệu tự động không cần phân quyền",
    ],
    answerIndex: 1,
  },
  {
    question:
      "5. Cuộc tấn công CSRF (Cross-Site Request Forgery) hoạt động dựa trên cơ chế lừa đảo nào?",
    options: [
      "Đánh cắp mật khẩu trực tiếp qua bàn phím người dùng",
      "Lợi dụng trình duyệt tự động gửi kèm Cookie xác thực khi thực hiện request từ domain độc hại",
      "Tấn công làm sập nguồn điện của server máy chủ",
      "Chèn mã script độc hại vào cơ sở dữ liệu",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Để thiết lập luồng truyền tải dữ liệu đồng bộ thời gian thực (Real-time) liên tục giữa Client và Server, giải pháp nào tối ưu nhất?",
    options: [
      "Cài đặt HTTP Short Polling gọi API mỗi 1 giây",
      "Sử dụng giao thức WebSockets để duy trì kết nối hai chiều liên tục",
      "Gửi dữ liệu qua email tự động",
      "Sử dụng thẻ iframe lồng nhau",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Kỹ thuật 'Database Connection Pooling' sinh ra nhằm mục đích giải quyết vấn đề gì?",
    options: [
      "Tăng dung lượng lưu trữ của ổ đĩa cứng",
      "Tái sử dụng các kết nối cơ sở dữ liệu có sẵn để tránh lãng phí tài nguyên khởi tạo mới liên tục",
      "Mã hóa các câu lệnh SQL thành dạng nhị phân",
      "Tự động sao lưu database sang server dự phòng",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Các bộ công cụ ORM (Object-Relational Mapping) như Prisma, Sequelize hay Hibernate đóng vai trò gì?",
    options: [
      "Tự động thiết kế giao diện Figma cho lập trình viên",
      "Ánh xạ và quản lý dữ liệu bảng quan hệ dưới dạng các đối tượng hướng đối tượng trong code",
      "Kiểm tra tốc độ load trang web Client",
      "Dịch ngôn ngữ JavaScript sang Java",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Biện pháp nào giúp tối ưu và giảm độ trễ (Latency) cho người dùng trên toàn cầu khi truy cập vào tài nguyên tĩnh của trang web?",
    options: [
      "Nâng cấp RAM cho server chính",
      "Sử dụng mạng phân phối nội dung tĩnh CDN đặt ở nhiều khu vực địa lý",
      "Nén tất cả mã nguồn thành 1 dòng duy nhất",
      "Chuyển giao diện từ màu sáng sang màu tối (Darkmode)",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Trong mô hình kiến trúc phần mềm MVC (Model-View-Controller), thành phần nào chịu trách nhiệm xử lý logic nghiệp vụ?",
    options: ["Model", "View", "Controller", "Router"],
    answerIndex: 2,
  },
];

const dataAiQuestions = [
  {
    question:
      "1. Thuật toán Học có giám sát (Supervised Learning) nào thường được sử dụng cho bài toán phân loại nhị phân (Classification)?",
    options: [
      "Linear Regression",
      "Logistic Regression",
      "K-Means Clustering",
      "Apriori Algorithm",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Trong Học máy, hiện tượng 'Overfitting' (Quá khớp) xảy ra khi nào?",
    options: [
      "Mô hình dự đoán sai trên cả tập Train và tập Test",
      "Mô hình học quá chi tiết trên tập Train nhưng cho kết quả dự đoán kém trên tập Test mới",
      "Mô hình mất quá nhiều thời gian để chạy",
      "Kích thước tệp tin dữ liệu quá nhỏ",
    ],
    answerIndex: 1,
  },
  {
    question:
      "3. Hàm kích hoạt (Activation Function) nào phổ biến giúp xử lý tốt vấn đề Vanishing Gradient trong mạng Deep Learning?",
    options: [
      "Sigmoid",
      "Tanh",
      "ReLU (Rectified Linear Unit)",
      "Step Function",
    ],
    answerIndex: 2,
  },
  {
    question:
      "4. Thư viện Python nào được sử dụng phổ biến nhất để thao tác, biến đổi và phân tích dữ liệu dạng bảng (Dataframe)?",
    options: ["Numpy", "Pandas", "Matplotlib", "Scikit-Learn"],
    answerIndex: 1,
  },
  {
    question:
      "5. Đại lượng thống kê nào đo lường mức độ phân tán hoặc biến thiên của tập dữ liệu so với giá trị trung bình?",
    options: [
      "Giá trị trung vị (Median)",
      "Độ lệch chuẩn (Standard Deviation)",
      "Yếu vị (Mode)",
      "Kỳ vọng (Expectation)",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Mục tiêu cốt lõi của thuật toán phân cụm K-Means Clustering trong Học không giám sát là gì?",
    options: [
      "Dự đoán một giá trị số liên tục tương lai",
      "Phân nhóm các dữ liệu không nhãn thành K cụm dựa trên khoảng cách giữa các phần tử",
      "Tìm kiếm các từ khóa bị viết sai chính tả",
      "Phân tách hình ảnh thành các đoạn text ngắn",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Ý nghĩa của Ma trận nhầm lẫn (Confusion Matrix) trong đánh giá mô hình phân loại là gì?",
    options: [
      "Đo lường dung lượng RAM tiêu tốn khi train mô hình",
      "Báo cáo thống kê chi tiết số lượng dự đoán Đúng/Sai qua các chỉ số True/False Positive/Negative",
      "Hiển thị cấu trúc các tầng của mạng Neural",
      "Đo độ phân giải hình ảnh đầu vào",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Phương pháp toán học nào thường dùng để giảm số lượng chiều tính năng (Dimensionality Reduction) mà giữ lại nhiều thông tin nhất?",
    options: [
      "Gradient Descent",
      "PCA (Principal Component Analysis)",
      "Cross Validation",
      "A/B Testing",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Trong mạng thần kinh nhân tạo (Neural Network), quy trình 'Backpropagation' được thực hiện nhằm mục đích gì?",
    options: [
      "Xóa bỏ các node dữ liệu bị trống",
      "Tính toán Gradient lỗi và cập nhật trọng số (Weights) nhằm tối ưu giảm thiểu hàm mất mát",
      "Tăng tốc độ đọc file dữ liệu từ ổ cứng",
      "Mã hóa dữ liệu đầu ra thành chuỗi bảo mật",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Thuật ngữ 'Data Augmentation' (Tăng cường dữ liệu) trong xử lý ảnh (Computer Vision) có nghĩa là gì?",
    options: [
      "Xóa bớt ảnh để giải phóng bộ nhớ lưu trữ",
      "Tạo thêm các biến thể ảnh mới bằng cách xoay, lật, phóng to, thu nhỏ từ dữ liệu gốc",
      "Tăng độ phân giải pixel của ảnh lên mức tối đa",
      "Chuyển ảnh màu thành ảnh đen trắng",
    ],
    answerIndex: 1,
  },
];

const mobileQuestions = [
  {
    question:
      "1. Trong React Native hoặc Flutter, cơ chế nào giúp lập trình viên xem ngay thay đổi giao diện khi sửa code mà không mất trạng thái ứng dụng?",
    options: [
      "Cold Boot",
      "Hot Reload / Stateful Hot Reload",
      "Garbage Collection",
      "Code Compilation",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Điểm khác biệt lớn nhất giữa ứng dụng Native (Swift/Kotlin) và ứng dụng Cross-platform (React Native/Flutter) là gì?",
    options: [
      "Native chỉ chạy được offline không cần internet",
      "Native viết bằng code riêng biệt tối ưu cho từng OS, Cross-platform viết một mã nguồn chạy được cả hai OS",
      "Cross-platform không tốn dung lượng cài đặt",
      "Native không thể kết nối tới cơ sở dữ liệu",
    ],
    answerIndex: 1,
  },
  {
    question:
      "3. Thành phần nào trong hệ điều hành Android chịu trách nhiệm quản lý vòng đời (Lifecycle) và hiển thị một màn hình giao diện cụ thể?",
    options: ["Service", "Broadcast Receiver", "Activity", "Content Provider"],
    answerIndex: 2,
  },
  {
    question:
      "4. Trong lập trình iOS (Swift), cơ chế quản lý bộ nhớ tự động giúp đếm số lượng tham chiếu đến đối tượng được gọi là gì?",
    options: [
      "ARC (Automatic Reference Counting)",
      "Garbage Collector",
      "Memory Pooling",
      "Defragmentation",
    ],
    answerIndex: 0,
  },
  {
    question:
      "5. Để triển khai hệ thống đẩy thông báo (Push Notification) từ Server đến thiết bị di động chính thống trên cả iOS và Android, dịch vụ nào phổ biến nhất?",
    options: [
      "Google Drive API",
      "Firebase Cloud Messaging (FCM)",
      "Socket.io Client",
      "Apple Mail Service",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Hiện tượng nghẽn luồng chính ('Main Thread Blocked') trên ứng dụng di động dẫn đến hậu quả nghiêm trọng nào?",
    options: [
      "Ứng dụng tự động tăng dung lượng bộ nhớ",
      "Giao diện bị đơ, giật lag và có thể bị hệ điều hành cưỡng chế tắt (Lỗi ANR/Crash)",
      "Điện thoại tự động khởi động lại",
      "Mất kết nối mạng wifi ngay lập tức",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Khi xây dựng ứng dụng di động theo mô hình Offline-first (chạy được khi mất mạng), cơ sở dữ liệu cục bộ nào thường được chọn tích hợp?",
    options: [
      "MySQL hoặc PostgreSQL",
      "SQLite / Realm / WatermelonDB",
      "Redis Cache Server",
      "Apache Cassandra",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Trong Flutter, widget nào được sử dụng để hiển thị một danh sách cuộn dài vô hạn với hiệu năng tối ưu nhờ cơ chế tái sử dụng phần tử?",
    options: [
      "Column",
      "SingleChildScrollView",
      "ListView.builder",
      "GridView.count",
    ],
    answerIndex: 2,
  },
  {
    question:
      "9. Để phát hành một ứng dụng iOS lên App Store cho người dùng tải về công khai, lập trình viên bắt buộc phải có tài khoản phí nào?",
    options: [
      "Google Play Console Account",
      "Apple Developer Account",
      "GitHub Enterprise Account",
      "AWS Cloud Account",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Khái niệm 'Deep Linking' trong phát triển ứng dụng di động mang lại tính năng gì?",
    options: [
      "Mã hóa sâu dữ liệu ứng dụng chống hack",
      "Cho phép click vào một đường link web để mở thẳng một màn hình nội dung cụ thể bên trong ứng dụng di động",
      "Tự động dịch ứng dụng sang nhiều ngôn ngữ",
      "Kết nối ngầm điện thoại với máy tính qua bluetooth",
    ],
    answerIndex: 1,
  },
];

const devopsQuestions = [
  {
    question:
      "1. Quy trình Tích hợp liên tục — CI (Continuous Integration) trong DevOps tập trung giải quyết mục tiêu cốt lõi nào?",
    options: [
      "Mua hộ hạ tầng server tự động",
      "Tự động hóa việc kiểm tra, build và chạy test kiểm định mã nguồn ngay khi dev đẩy code mới",
      "Vẽ biểu đồ phân tích doanh thu sản phẩm",
      "Hỗ trợ khách hàng cài đặt phần mềm",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Công cụ quản lý hạ tầng dạng mã (Infrastructure as Code - IaC) nổi tiếng giúp định nghĩa và khởi tạo tài nguyên Cloud qua file cấu hình là gì?",
    options: ["Ansible", "Docker", "Terraform", "Jenkins"],
    answerIndex: 2,
  },
  {
    question:
      "3. Trong hệ sinh thái Kubernetes (K8s), thành phần 'Pod' được định nghĩa là gì?",
    options: [
      "Là một trung tâm dữ liệu vật lý của Google",
      "Là đơn vị triển khai nhỏ nhất, chứa một hoặc một nhóm Docker Container chia sẻ chung tài nguyên",
      "Là một câu lệnh cấu hình mạng",
      "Là tên gọi của hệ quản trị database mới",
    ],
    answerIndex: 1,
  },
  {
    question:
      "4. Bộ đôi công cụ nào thường được tích hợp phối hợp để làm nhiệm vụ Giám sát (Monitoring) metrics hệ thống và hiển thị biểu đồ thời gian thực?",
    options: [
      "Nginx và Apache",
      "Prometheus và Grafana",
      "GitLab và GitHub",
      "Docker và Vagrant",
    ],
    answerIndex: 1,
  },
  {
    question:
      "5. Chiến lược phân nhánh Git chuẩn mang tên 'GitFlow' quy định việc cô lập mã nguồn chạy Production và Đang phát triển qua cặp nhánh nào?",
    options: [
      "main (master) và develop",
      "feature và hotfix",
      "bugfix và release",
      "origin và upstream",
    ],
    answerIndex: 0,
  },
  {
    question:
      "6. Bộ công cụ thu thập, quản lý và phân tích log tập trung (Centralized Logging) nổi tiếng cho hệ thống lớn viết tắt là gì?",
    options: [
      "LAMP Stack",
      "MERN Stack",
      "ELK Stack (Elasticsearch, Logstash, Kibana)",
      "JAMstack",
    ],
    answerIndex: 2,
  },
  {
    question:
      "7. Chiến lược triển khai ứng dụng mang tên 'Blue-Green Deployment' hoạt động theo nguyên lý cốt lõi nào?",
    options: [
      "Nâng cấp mã nguồn trực tiếp trên server đang chạy vào ban đêm",
      "Chạy song song hai môi trường giống hệt nhau, chuyển đổi 100% traffic từ cũ sang mới giúp zero-downtime",
      "Xóa hệ thống cũ đi rồi cài lại hệ thống mới từ đầu",
      "Triển khai ứng dụng trên điện thoại di động trước",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Vai trò chủ đạo của một máy chủ Reverse Proxy (như Nginx) khi đứng trước cụm máy chủ ứng dụng Backend là gì?",
    options: [
      "Lưu trữ mã nguồn dự phòng",
      "Điều hướng request, cân bằng tải (Load Balancing) và bảo vệ ẩn giấu hạ tầng bên trong",
      "Biên dịch mã code Java thành mã máy",
      "Quét virus cho các file tải lên",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Trong chu trình DevSecOps, công cụ quét mã nguồn tĩnh SAST (Static Application Security Testing) dùng để làm gì?",
    options: [
      "Kiểm tra tốc độ phản hồi đường truyền mạng",
      "Phát hiện sớm các lỗ hổng bảo mật, lỗi cú pháp nguy hiểm ngay trong mã nguồn trước khi build",
      "Đo lượng CPU tiêu thụ của server",
      "Tự động viết tài liệu hướng dẫn sử dụng code",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Tính chất 'Idempotency' (Tính bất biến/đồng nhất) trong các công cụ cấu hình như Ansible nghĩa là gì?",
    options: [
      "Hệ thống sẽ bị lỗi nếu chạy file cấu hình lần thứ hai",
      "Chạy file cấu hình một hay nhiều lần trên server vẫn đảm bảo cho ra cùng một trạng thái hệ thống duy nhất",
      "Tự động đổi mật khẩu server sau mỗi lần chạy",
      "Mã hóa dữ liệu file cấu hình thành dạng không đọc được",
    ],
    answerIndex: 1,
  },
];

const cyberSecurityQuestions = [
  {
    question:
      "1. Lỗ hổng tấn công 'SQL Injection' (SQLi) xảy ra xuất phát từ sai lầm cốt lõi nào phía lập trình viên ứng dụng?",
    options: [
      "Đặt mật khẩu database quá ngắn",
      "Không kiểm tra/lọc dữ liệu đầu vào, nối thẳng chuỗi tham số người dùng nhập vào câu truy vấn SQL",
      "Mở quá nhiều cổng port trên modem",
      "Sử dụng hệ điều hành Windows Server đời cũ",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Hình thức tấn công mạng mang tên 'Phishing' (Lừa đảo trực tuyến) được xếp vào nhóm kỹ thuật tấn công nào?",
    options: [
      "Brute Force Attack",
      "Social Engineering (Thao túng tâm lý/Hành vi con người)",
      "DDoS Attack",
      "Man-in-the-middle Attack",
    ],
    answerIndex: 1,
  },
  {
    question:
      "3. Thuật toán mã hóa đối xứng (Symmetric Encryption) tiêu chuẩn bảo mật cao được dùng rộng rãi toàn cầu hiện nay là gì?",
    options: ["RSA", "MD5", "AES (Advanced Encryption Standard)", "SHA-256"],
    answerIndex: 2,
  },
  {
    question:
      "4. Bản chất của cuộc tấn công Từ chối dịch vụ phân tán (DDoS) nhằm phá hoại hệ thống mục tiêu theo cơ chế nào?",
    options: [
      "Đoán mò mật khẩu tài khoản Admin",
      "Huy động mạng lưới máy tính ma (Botnet) gửi lượng request khổng lồ làm nghẽn băng thông hoặc sập tài nguyên máy chủ",
      "Ăn cắp ổ cứng vật lý của server",
      "Gửi email rác chứa mã độc tống tiền",
    ],
    answerIndex: 1,
  },
  {
    question:
      "5. Lỗ hổng kiểm tra phân quyền API mang tên IDOR / BOLA (Broken Object Level Authorization) xảy ra khi nào?",
    options: [
      "Khi hacker chiếm được khóa bí mật JWT",
      "Hệ thống không xác thực quyền sở hữu đối tượng, cho phép truy cập dữ liệu người khác bằng cách thay đổi ID trên URL",
      "Server bị mất kết nối internet",
      "Người dùng gõ sai mật khẩu quá 3 lần",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Giao thức bảo mật HTTPS sử dụng công nghệ cốt lõi nào để mã hóa dữ liệu đường truyền tránh bị nghe lén mạng?",
    options: [
      "Giao thức FTP",
      "Chứng chỉ SSL/TLS",
      "Giao thức SSH",
      "Giao thức SMTP",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Tường lửa bảo vệ ứng dụng Web chuyên dụng WAF (Web Application Firewall) hoạt động chủ yếu ở tầng nào của mô hình OSI?",
    options: [
      "Tầng 3 - Network Layer",
      "Tầng 4 - Transport Layer",
      "Tầng 7 - Application Layer",
      "Tầng 2 - Data Link Layer",
    ],
    answerIndex: 2,
  },
  {
    question:
      "8. Tư tưởng triết lý cốt lõi của mô hình bảo mật hiện đại 'Zero Trust' hướng tới nguyên tắc nào?",
    options: [
      "Tin tưởng hoàn toàn các thiết bị nằm trong mạng LAN nội bộ",
      "Không bao giờ tin tưởng, luôn luôn xác thực và kiểm tra mọi kết nối truy cập dù ở bất kỳ đâu",
      "Chỉ cài phần mềm diệt virus cho máy tính sếp",
      "Mở khóa toàn bộ quyền hạn cho mọi nhân viên",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Mục đích chính thống của việc thực hiện quy trình 'Penetration Testing' (Kiểm thử xâm nhập) đối với doanh nghiệp là gì?",
    options: [
      "Tìm cớ để sa thải nhân viên IT",
      "Chủ động tấn công giả lập vào hệ thống để tìm kiếm và vá các lỗ hổng bảo mật trước khi bị tin tặc khai thác thực tế",
      "Cài đặt thêm các phần mềm quảng cáo",
      "Kiểm tra xem nhân viên có đi làm đúng giờ không",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Kỹ thuật thêm chuỗi ký tự ngẫu nhiên 'Salt' vào trước khi thực hiện băm mật khẩu (Password Hashing) mang lại lợi ích gì?",
    options: [
      "Giúp kích thước file mật khẩu nhỏ đi",
      "Chống lại việc tra cứu giải mã ngược mật khẩu bằng các bảng băm tính sẵn (Rainbow Table)",
      "Tăng tốc độ đăng nhập của người dùng",
      "Tự động đổi mật khẩu định kỳ",
    ],
    answerIndex: 1,
  },
];

const uiUxQuestions = [
  {
    question:
      "1. Trong thiết kế giao diện UI/UX, nguyên tắc 'Visual Hierarchy' (Phân cấp thị giác) được hiểu là gì?",
    options: [
      "Sử dụng càng nhiều màu sắc rực rỡ càng tốt",
      "Sắp xếp, tổ chức các yếu tố đồ họa theo thứ tự quan trọng để dẫn dắt mắt người dùng đọc thông tin khoa học",
      "Đặt tất cả các chữ có cùng một kích thước bằng nhau",
      "Giấu các nút bấm quan trọng vào góc khuất",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Khái niệm bản phác thảo 'Wireframe' đóng vai trò ý nghĩa gì trong quy trình thiết kế sản phẩm?",
    options: [
      "Là bản thiết kế hoàn chỉnh có đầy đủ màu sắc, hình ảnh sắc nét để đem đi code",
      "Là bản phác thảo cấu trúc bố cục đen trắng thô, tập trung sắp xếp vị trí tính năng, nội dung và luồng đi",
      "Là đoạn mã code HTML/CSS giao diện mẫu",
      "Là video quay lại hành vi sử dụng của khách hàng",
    ],
    answerIndex: 1,
  },
  {
    question:
      "3. Hệ màu tiêu chuẩn nào được lựa chọn làm quy chuẩn thiết kế cho các sản phẩm hiển thị trên màn hình kỹ thuật số (Web, App)?",
    options: ["CMYK", "RGB", "PANTONE", "RYB"],
    answerIndex: 1,
  },
  {
    question:
      "4. Thuật ngữ 'Micro-interaction' (Tương tác vi mô) trong UI Design dùng để ám chỉ điều gì?",
    options: [
      "Hệ thống cơ sở dữ liệu siêu nhỏ kết nối với app",
      "Các hiệu ứng phản hồi nhỏ tinh tế khi người dùng tương tác (như nút đổi màu nhẹ, icon rung nhẹ khi click...)",
      "Giao diện thiết kế dành riêng cho đồng hồ thông minh",
      "Việc người dùng chat với nhau bằng icon nhỏ",
    ],
    answerIndex: 1,
  },
  {
    question:
      "5. Định luật UX nào phát biểu rằng: 'Thời gian để người dùng di chuyển đạt được một mục tiêu phụ thuộc vào Khoảng cách và Kích thước của mục tiêu đó'?",
    options: [
      "Luật Miller (Miller's Law)",
      "Luật Jakob (Jakob's Law)",
      "Luật Fitts (Fitts's Law)",
      "Luật Hick (Hick's Law)",
    ],
    answerIndex: 2,
  },
  {
    question:
      "6. Điểm khác biệt bản chất cốt lõi giữa hai khái niệm UI (User Interface) và UX (User Experience) là gì?",
    options: [
      "UI làm trên máy tính, UX phải làm thủ công trên giấy",
      "UI tập trung vào thẩm mỹ và phần nhìn thấy của giao diện; còn UX tập trung vào cảm nhận, trải nghiệm, luồng đi và tính tiện dụng",
      "UI dành cho lập trình viên Backend, UX dành cho Frontend",
      "UI là thiết kế logo, UX là lập trình ứng dụng",
    ],
    answerIndex: 1,
  },
  {
    question:
      "7. Xây dựng một Hệ thống thiết kế nhất quán ('Design System') mang lại giá trị thực tiễn lớn nhất nào cho dự án?",
    options: [
      "Giúp tiết kiệm chi phí mua bản quyền phần mềm Figma",
      "Đảm bảo tính đồng bộ, nhất quán của toàn bộ giao diện và tối ưu tốc độ làm việc phối hợp giữa Designer và Developer",
      "Tự động sửa lỗi code Front-end cho lập trình viên",
      "Tăng dung lượng lưu trữ của máy chủ đám mây",
    ],
    answerIndex: 1,
  },
  {
    question:
      "8. Khoảng trống xung quanh và giữa các phần tử thiết kế (White Space / Negative Space) có tác dụng gì trong bố cục?",
    options: [
      "Là lỗi thiết kế do Designer quên không lấp đầy nội dung",
      "Giúp giao diện thoáng đãng, phân tách các khối rõ ràng, dễ đọc thông tin và giảm áp lực thị giác cho người dùng",
      "Làm cho trang web tải chậm hơn",
      "Dùng để chèn thêm các biểu ngữ quảng cáo ẩn",
    ],
    answerIndex: 1,
  },
  {
    question:
      "9. Tiến hành phương pháp nghiên cứu 'A/B Testing' trên sản phẩm giao diện nhằm mục đích cốt lõi gì?",
    options: [
      "Kiểm tra xem hệ thống có bị nhiễm virus hay không",
      "So sánh hiệu quả thực tế giữa hai phiên bản thiết kế khác nhau (A và B) trên người dùng thật để tìm bản tối ưu chuyển đổi",
      "Đoán mò sở thích của khách hàng không cần dữ liệu",
      "Đếm số dòng code của lập trình viên",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Để đảm bảo tính dễ tiếp cận (Accessibility - WCAG) cho người yếu thị lực, tỷ lệ độ tương phản tối thiểu giữa Chữ và Nền theo chuẩn AA là bao nhiêu?",
    options: ["1.5 : 1", "2.0 : 1", "4.5 : 1", "10 : 1"],
    answerIndex: 2,
  },
];

const defaultQuestions = [
  {
    question:
      "1. Cấu trúc dữ liệu nào hoạt động theo nguyên tắc LIFO (Last In, First Out - Vào sau cùng nhưng ra đầu tiên)?",
    options: [
      "Hàng đợi (Queue)",
      "Ngăn xếp (Stack)",
      "Cây nhị phân (Binary Tree)",
      "Đồ thị mạng lưới (Graph)",
    ],
    answerIndex: 1,
  },
  {
    question:
      "2. Lệnh Git nào được sử dụng để tải toàn bộ mã nguồn và lịch sử commit từ kho lưu trữ từ xa (Remote Server) về máy cá nhân lần đầu tiên?",
    options: ["git pull", "git fetch", "git commit", "git clone"],
    answerIndex: 3,
  },
  {
    question:
      "3. Đâu KHÔNG PHẢI là một phương thức HTTP (HTTP Method) hợp lệ theo tiêu chuẩn giao tiếp mạng?",
    options: ["GET", "POST", "FETCH", "DELETE"],
    answerIndex: 2,
  },
  {
    question:
      "4. Mã trạng thái HTTP (HTTP Status Code) nào báo hiệu rằng tài nguyên yêu cầu không tìm thấy trên máy chủ Server?",
    options: [
      "200 OK",
      "401 Unauthorized",
      "404 Not Found",
      "500 Internal Server Error",
    ],
    answerIndex: 2,
  },
  {
    question:
      "5. Trong lập trình hướng đối tượng (OOP), tính chất nào cho phép một lớp con kế thừa lại các thuộc tính và phương thức của lớp cha?",
    options: [
      "Tính đóng gói (Encapsulation)",
      "Tính kế thừa (Inheritance)",
      "Tính đa hình (Polymorphism)",
      "Tính trừu tượng (Abstraction)",
    ],
    answerIndex: 1,
  },
  {
    question:
      "6. Định dạng trao đổi dữ liệu phổ biến nhất dựa trên văn bản, dễ đọc bởi cả con người và máy tính, dùng trong hầu hết API ngày nay là gì?",
    options: ["XML", "YAML", "JSON", "CSV"],
    answerIndex: 2,
  },
  {
    question:
      "7. Để kiểm tra tốc độ phản hồi và độ trễ mạng tới một địa chỉ IP hoặc Server, kỹ sư thường dùng lệnh terminal nào?",
    options: ["ping", "cd", "mkdir", "ls"],
    answerIndex: 0,
  },
  {
    question:
      "8. Hệ điều hành mã nguồn mở nào được sử dụng phổ biến nhất để triển khai và chạy các ứng dụng Backend trên môi trường Server Cloud?",
    options: ["Windows 11", "macOS", "Linux (Ubuntu/CentOS)", "iOS"],
    answerIndex: 2,
  },
  {
    question:
      "9. Trong quy trình phát triển phần mềm hiện đại, thuật ngữ CI/CD mang ý nghĩa cốt lõi nào?",
    options: [
      "Code Integration / Code Deployment",
      "Continuous Integration / Continuous Deployment (Tích hợp và Triển khai liên tục)",
      "Cyber Intelligence / Cloud Database",
      "Customer Interface / Control Dashboard",
    ],
    answerIndex: 1,
  },
  {
    question:
      "10. Việc mã hóa dữ liệu bảo mật đường truyền HTTPS trên môi trường Web sử dụng giao thức an toàn cốt lõi nào?",
    options: ["FTP", "SSL/TLS", "SSH", "SMTP"],
    answerIndex: 1,
  },
];

const assessmentsData = [
  { name: "Frontend Engineer", questions: frontendQuestions },
  { name: "Backend Engineer", questions: backendQuestions },
  { name: "Fullstack Engineer", questions: fullstackQuestions },
  { name: "Data AI / ML", questions: dataAiQuestions },
  { name: "Mobile App Dev", questions: mobileQuestions },
  { name: "DevOps Engineer", questions: devopsQuestions },
  { name: "Cyber Security", questions: cyberSecurityQuestions },
  { name: "UI/UX Designer", questions: uiUxQuestions },
  { name: "default", questions: defaultQuestions },
];

const coursesData = [
  {
    course_name: "JavaScript Cơ bản",
    provider: "F8",
    description: "Học JS từ con số 0",
    level: "Beginner",
    duration_hours: 20,
  },
  {
    course_name: "ReactJS Siêu Tốc",
    provider: "EAUT",
    description: "Làm chủ React sau 30 ngày",
    level: "Intermediate",
    duration_hours: 30,
  },
  {
    course_name: "Lập trình C++ căn bản",
    provider: "Codelearn",
    description: "Học C++ bài bản",
    level: "Beginner",
    duration_hours: 25,
  },
  {
    course_name: "Thiết kế CSDL MySQL",
    provider: "Udemy",
    description: "Phân tích và thiết kế dữ liệu",
    level: "Intermediate",
    duration_hours: 15,
  },
  {
    course_name: "NodeJS & ExpressJS",
    provider: "F8",
    description: "Xây dựng RESTful API",
    level: "Intermediate",
    duration_hours: 25,
  },
  {
    course_name: "Docker cho người mới",
    provider: "Kipalog",
    description: "Đóng gói ứng dụng",
    level: "Intermediate",
    duration_hours: 10,
  },
  {
    course_name: "Học Machine Learning",
    provider: "Coursera",
    description: "Nhập môn học máy cơ bản",
    level: "Advanced",
    duration_hours: 50,
  },
  {
    course_name: "Thiết kế UI/UX với Figma",
    provider: "EAUT",
    description: "Xây dựng trải nghiệm người dùng",
    level: "Beginner",
    duration_hours: 15,
  },
];

const skillsData = [
  {
    skill_name: "JavaScript",
    category: "Language",
    description: "Ngôn ngữ lập trình phổ biến nhất",
  },
  {
    skill_name: "React",
    category: "Library",
    description: "Thư viện UI của Facebook",
  },
  {
    skill_name: "Node.js",
    category: "Runtime",
    description: "Môi trường chạy JS trên server",
  },
  {
    skill_name: "MySQL",
    category: "Database",
    description: "Hệ quản trị CSDL quan hệ",
  },
  {
    skill_name: "Docker",
    category: "DevOps",
    description: "Nền tảng container hóa",
  },
  {
    skill_name: "Python",
    category: "Language",
    description: "Ngôn ngữ lập trình AI/ML",
  },
];

async function main() {
  console.log("Seeding Roadmaps (CareerPath)...");
  for (const roadmap of roadmapsData) {
    await prisma.careerPath.create({
      data: {
        career_name: roadmap.title,
        description: roadmap.desc,
        demand_level: roadmap.time,
        salary_range: roadmap.skills.toString(),
      },
    });
  }

  console.log("Seeding Assessments and Questions...");
  for (const group of assessmentsData) {
    const assessment = await prisma.assessment.create({
      data: {
        title: group.name,
        description: `Assessment for ${group.name}`,
        duration_minutes: 30,
        total_questions: group.questions.length,
      },
    });

    for (const q of group.questions) {
      await prisma.question.create({
        data: {
          assessment_id: assessment.assessment_id,
          content: q.question,
          question_type: "multiple_choice",
          difficulty_level: "Medium",
          score: 1,
          options: {
            create: q.options.map((opt, i) => ({
              option_text: opt,
              is_correct: i === q.answerIndex,
            })),
          },
        },
      });
    }
  }

  console.log("Seeding Courses...");
  for (const course of coursesData) {
    await prisma.course.create({
      data: course,
    });
  }

  console.log("Seeding Skills...");
  for (const skill of skillsData) {
    await prisma.skill.create({
      data: skill,
    });
  }

  console.log("Seeding default Admin and Student users...");
  const adminPasswordHash = await bcrypt.hash("admin123456", 10);
  await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: {},
    create: {
      full_name: "System Admin",
      email: "admin@gmail.com",
      password_hash: adminPasswordHash,
      role: "admin",
      status: "active",
    },
  });

  const studentPasswordHash = await bcrypt.hash("student123456", 10);
  await prisma.user.upsert({
    where: { email: "student@gmail.com" },
    update: {},
    create: {
      full_name: "Default Student",
      email: "student@gmail.com",
      password_hash: studentPasswordHash,
      role: "student",
      status: "active",
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
