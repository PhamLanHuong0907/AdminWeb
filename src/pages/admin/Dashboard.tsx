import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCard } from "@/components/admin/StatsCard";
import { 
  Navigation, 
  Layers, 
  FolderKanban, 
  MessageSquareQuote, 
  Box,
  Award,
  FileText
} from "lucide-react";
import { useNavigation } from "@/hooks/useNavigation";
import { useServices } from "@/hooks/useServices";
import { useProjects } from "@/hooks/useProjects";
import { usePrizes } from "@/hooks/usePrizes";
import { useBlogs } from "@/hooks/useBlogs";
import { useTestimonials } from "@/hooks/useTestimonials";
import { useProducts } from "@/hooks/useProducts";

const Dashboard = () => {
  const { data: navigation } = useNavigation();
  const { data: services } = useServices();
  const { data: projects } = useProjects();
  const { data: prizes } = usePrizes();
  const { data: blogs } = useBlogs();
  const { data: testimonials } = useTestimonials();
  const { data: products } = useProducts();

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Dashboard" 
        subtitle="Tổng quan hệ thống quản trị nội dung"
      />
      
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard title="Navigation" value={navigation?.length || 0} icon={Navigation} />
          <StatsCard title="Dịch vụ" value={services?.length || 0} icon={Layers} />
          <StatsCard title="Sản phẩm" value={products?.length || 0} icon={Box} />
          <StatsCard title="Dự án" value={projects?.length || 0} icon={FolderKanban} />
          <StatsCard title="Giải thưởng" value={prizes?.length || 0} icon={Award} />
          <StatsCard title="Blog" value={blogs?.length || 0} icon={FileText} />
          <StatsCard title="Đánh giá" value={testimonials?.length || 0} icon={MessageSquareQuote} />
        </div>

        <div className="admin-card">
          <h2 className="text-lg font-heading font-semibold mb-4">Hướng dẫn sử dụng</h2>
          <div className="space-y-2 text-muted-foreground text-sm">
            <p>• <strong>Dịch vụ:</strong> Quản lý các dịch vụ, danh mục dùng cho Projects và Products</p>
            <p>• <strong>Sản phẩm:</strong> Quản lý sản phẩm với features bao gồm thông tin con</p>
            <p>• <strong>Dự án:</strong> Quản lý dự án, lấy danh mục từ Dịch vụ</p>
            <p>• <strong>Giải thưởng:</strong> Quản lý giải thưởng và thành tích</p>
            <p>• <strong>Blog:</strong> Quản lý bài viết với file Word đính kèm</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
