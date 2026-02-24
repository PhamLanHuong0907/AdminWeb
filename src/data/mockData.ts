import { NavItem, IntroduceService, ServiceHeroSection, ProductService, Product, Project, Testimonial } from "@/types/admin";

export const mockNavItems: NavItem[] = [
  { id: "1", label: "TRANG CHỦ", href: "/" },
  {
    id: "2",
    label: "GIỚI THIỆU",
    href: "#about",
    dropdown: [
      { label: "Giới thiệu chung", href: "/about" },
      { label: "Đội ngũ lãnh đạo", href: "/about/leadership" },
      { label: "Khách hàng", href: "/about/customers" },
    ],
  },
  {
    id: "3",
    label: "SẢN PHẨM",
    href: "#services",
    dropdown: [
      { label: "Hệ thống ERP", href: "/erp" },
      { label: "Hệ thống MES", href: "/mes" },
      { label: "Hệ thống AIoT", href: "/AI&IoT" },
      { label: "Kho dữ liệu tập trung", href: "/datawarehouse" },
    ],
  },
  {
    id: "4",
    label: "NỔI BẬT",
    href: "#highlights",
    dropdown: [
      { label: "Dự án", href: "/#projects" },
      { label: "Giải thưởng", href: "/prize" },
      { label: "Triển lãm", href: "#exhibitions" },
    ],
  },
  { id: "5", label: "TIN TỨC", href: "#blog" },
];

export const mockServices: IntroduceService[] = [
  {
    id: "1",
    title: "Hệ thống ERP",
    description: "Cung cấp giải pháp ERP tổng thể cho doanh nghiệp và nhà máy",
    features: [
      "ERP cho doanh nghiệp và nhà máy sản xuất",
      "ERP & BI - Phân tích dữ liệu, báo cáo quản trị",
      "Tích hợp hệ thống sản xuất (MES/SCADA)",
      "Giải pháp Nhà máy thông minh",
    ],
    icon: "Factory",
    gradient: "from-blue-500 to-cyan-500",
    images: [
      { id: "1", url: "/placeholder.svg", alt: "ERP Image 1" },
      { id: "2", url: "/placeholder.svg", alt: "ERP Image 2" },
    ],
    href: "/erp",
  },
  {
    id: "2",
    title: "Hệ thống MES",
    description: "Giải pháp MES giúp quản lý, giám sát và điều hành sản xuất",
    features: [
      "Quản lý hiệu suất thiết bị OEE",
      "Quản lý lệnh sản xuất",
      "Giám sát băng tải thông minh",
      "Quản lý bảo trì, bảo dưỡng",
    ],
    icon: "Home",
    gradient: "from-emerald-500 to-teal-500",
    images: [
      { id: "1", url: "/placeholder.svg", alt: "MES Image 1" },
    ],
    href: "/mes",
  },
  {
    id: "3",
    title: "Hệ thống AIoT",
    description: "Nền tảng tích hợp IoT và Trí tuệ nhân tạo (AI)",
    features: [
      "Khảo sát & Thăm dò thông minh",
      "Giám sát & An toàn ứng dụng AI",
      "Cảm biến hình ảnh với AI",
      "Hệ thống quản lý tập trung",
    ],
    icon: "Globe",
    gradient: "from-violet-500 to-purple-500",
    images: [],
    href: "/AI&IoT",
  },
];

export const mockHeroSections: ServiceHeroSection[] = [
  {
    id: "1",
    serviceId: "3",
    serviceName: "Hệ thống AIoT",
    backgroundImage: "https://cdn-media.sforum.vn/storage/app/media/ctvseo_15/Background%20xanh/background-xanh-1.jpg",
    title: "HỆ THỐNG AIoT",
    subtitle: "Artificial Intelligence of Things",
    slogan: "Kết nối thông minh - Phân tích chi tiết - Cảnh báo kịp thời",
    cards: [
      {
        id: "1",
        title: "Tích hợp thông minh",
        description: "Nền tảng tích hợp IoT và Trí tuệ nhân tạo (AI)",
        image: "/placeholder.svg",
      },
      {
        id: "2",
        title: "Phân tích & Dự báo",
        description: "Phân tích thông minh giúp giám sát, dự báo",
        image: "/placeholder.svg",
      },
    ],
  },
];

export const mockProductServices: ProductService[] = [
  {
    id: "1",
    serviceId: "3",
    serviceName: "Hệ thống AIoT",
    products: [
      {
        id: "1",
        title: "Khảo sát & Thăm dò thông minh",
        description: "Ứng dụng công nghệ Drone và phân tích dữ liệu địa lý",
        image: "/placeholder.svg",
        icon: "Map",
        path: "/AI&IoT/smart-survey",
      },
      {
        id: "2",
        title: "Giám sát & An toàn AI",
        description: "Nâng tầm hệ thống an ninh với công nghệ AI",
        image: "/placeholder.svg",
        icon: "ShieldCheck",
        path: "/AIoT/safety_security",
      },
    ],
  },
];

export const mockProducts: Product[] = [
  {
    id: "1",
    systemId: "3",
    systemName: "Hệ thống AIoT",
    path: "/AI&IoT/smart-survey",
    title: "Khảo sát & Thăm dò thông minh",
    highlight: "Công nghệ Drone tiên tiến",
    description: "ECOTEL tiên phong ứng dụng tổ hợp công nghệ Drone và hệ thống phân tích dữ liệu địa lý",
    image: "/placeholder.svg",
    features: [
      {
        tag: { icon: "Plane", text: "Drone", colorClass: "bg-primary/10 text-primary" },
        title: "Drone Khảo sát",
        description: "Khảo sát địa hình với thiết bị bay không người lái",
        image: "/placeholder.svg",
      },
    ],
    info: [
      {
        icon: "Activity",
        text: "Khảo sát địa hình",
        subText: "Thực hiện khảo sát địa hình, giám sát hoạt động",
      },
    ],
  },
];

export const mockProjects: Project[] = [
  {
    id: "1",
    title: "Dự án kiểm soát ra vào",
    client: "Công ty Than Thống nhất",
    description: "Giới thiệu giải pháp và bộ chuyển đổi số ứng dụng trong ngành than",
    category: "Công nghiệp",
    path: "/projects/1",
    urlWord: "",
  },
  {
    id: "2",
    title: "Phần mềm quản lý máy móc thiết bị",
    client: "Công ty CP Than Cao Sơn",
    description: "Tự động hóa quy trình sản xuất và quản lý kho vận thông minh",
    category: "Công nghiệp",
    path: "/projects/2",
    urlWord: "",
  },
  {
    id: "3",
    title: "Phần mềm khoán chi phí",
    client: "Công ty CP Than Hà Lầm",
    description: "Giải pháp toàn diện quản lý vật tư, tài sản trong khoán",
    category: "Công nghiệp",
    path: "/projects/3",
    urlWord: "",
  },
];

export const mockTestimonials: Testimonial[] = [
  {
    id: "1",
    content: "ECOTEL đã giúp chúng tôi số hóa toàn bộ quy trình sản xuất, tiết kiệm 30% thời gian quản lý.",
    author: "Nguyễn Văn A",
    position: "Giám đốc điều hành",
    company: "Công ty ABC",
  },
  {
    id: "2",
    content: "Hệ thống MES của ECOTEL giúp chúng tôi theo dõi sản xuất theo thời gian thực rất hiệu quả.",
    author: "Trần Thị B",
    position: "Trưởng phòng CNTT",
    company: "Công ty XYZ",
  },
];
