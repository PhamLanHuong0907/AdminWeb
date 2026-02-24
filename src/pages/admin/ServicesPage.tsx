import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useServices, useCreateService, useUpdateService, useDeleteService, Service } from "@/hooks/useServices";
import { Json } from "@/integrations/supabase/types";
import { generateServicePath } from "@/lib/slugify";
import { Factory, Home, Globe, Cpu, Database, Shield, Zap, Settings } from "lucide-react";

interface ServiceImage {
  id: string;
  url: string;
  alt: string;
}

// Mở rộng interface Service để tránh lỗi TypeScript nếu hook chưa cập nhật type


const iconOptions = ["Factory", "Home", "Globe", "Cpu", "Database", "Shield", "Zap", "Settings"];
const gradientOptions = [
  { label: "Blue → Cyan", value: "from-blue-500 to-cyan-500" },
  { label: "Emerald → Teal", value: "from-emerald-500 to-teal-500" },
  { label: "Violet → Purple", value: "from-violet-500 to-purple-500" },
  { label: "Orange → Red", value: "from-orange-500 to-red-500" },
  { label: "Pink → Rose", value: "from-pink-500 to-rose-500" },
];

const ServicesPage = () => {
  const { data: services, isLoading } = useServices();
  const createService = useCreateService();
  const updateService = useUpdateService();
  const deleteService = useDeleteService();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Service  | null>(null);
  
  // 1. Thêm sort_order vào state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    features: [] as string[],
    icon: "Factory",
    gradient: "from-blue-500 to-cyan-500",
    images: [] as ServiceImage[],
    href: "",
    sort_order: 0, // Mặc định là 0
  });

  // Auto-generate path when title changes
  useEffect(() => {
    if (!editingItem && formData.title) {
      const newPath = generateServicePath(formData.title);
      setFormData(prev => ({ ...prev, href: newPath }));
    }
  }, [formData.title, editingItem]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      features: [],
      icon: "Factory",
      gradient: "from-blue-500 to-cyan-500",
      images: [],
      href: "",
      sort_order: 0, // Reset về 0
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Service ) => {
    setEditingItem(item);
    const parsedFeatures = Array.isArray(item.features) ? (item.features as unknown as string[]) : [];
    const parsedImages = Array.isArray(item.images) ? (item.images as unknown as ServiceImage[]) : [];
    
    setFormData({
      title: item.title,
      description: item.description || "",
      features: parsedFeatures,
      icon: item.icon || "Factory",
      gradient: item.gradient || "from-blue-500 to-cyan-500",
      images: parsedImages,
      href: item.href || "",
      sort_order: item.sort_order || 0, // Lấy giá trị từ item
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Service) => {
    deleteService.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      features: formData.features as unknown as Json,
      images: formData.images as unknown as Json,
    };
    
    if (editingItem) {
      updateService.mutate({ id: editingItem.id, ...data });
    } else {
      createService.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const addImage = () => {
    setFormData({
      ...formData,
      images: [...formData.images, { id: Date.now().toString(), url: "", alt: "" }],
    });
  };

  const updateImage = (index: number, field: string, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData({ ...formData, images: newImages });
  };

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const icon = (icon : string) => {
    switch (icon) {
      case "Factory": return <Factory />;
      case "Home": return <Home />;
      case "Globe": return <Globe />;
      case "Cpu": return <Cpu />;
      case "Database": return <Database />;
      case "Shield": return <Shield />;
      case "Zap": return <Zap />;
      case "Settings": return <Settings />;
      default: return <Factory />;
    }
  }

  // 2. Logic sắp xếp dữ liệu trước khi hiển thị
  const sortedServices = services 
    ? [...services].sort((a: Service , b: Service ) => {
        const orderA = a.sort_order ?? 0;
        const orderB = b.sort_order ?? 0;
        return orderA - orderB; // Sắp xếp tăng dần (bé trước, lớn sau)
      }) 
    : [];

  const columns = [
    // Thêm cột hiển thị thứ tự
    {
      key: "sort_order",
      label: "STT",
      render: (item: Service ) => (
        <span className="font-mono text-muted-foreground">
          #{item.sort_order ?? 0}
        </span>
      )
    },
    { 
      key: "title", 
      label: "Tên dịch vụ",
      render: (item: Service) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${item.gradient || 'from-blue-500 to-cyan-500'} flex items-center justify-center`}>
            {icon(item.icon)}
          </div>
          <span className="font-medium">{item.title}</span>
        </div>
      )
    },
    { 
      key: "description", 
      label: "Mô tả",
      render: (item: Service) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">{item.description || "-"}</span>
      )
    },
    { 
      key: "features", 
      label: "Tính năng",
      render: (item: Service) => {
        const features = item.features as string[] | null;
        return (
          <span className="admin-badge admin-badge-primary">{features?.length || 0} tính năng</span>
        );
      }
    },
    { key: "href", label: "Đường dẫn" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AdminHeader 
        title="Quản lý Dịch vụ" 
        subtitle="Quản lý các dịch vụ (Introduce_Services) hiển thị trên Client Web"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{services?.length || 0}</span> dịch vụ
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm dịch vụ
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                
                {/* Hàng 1: Thứ tự hiển thị (Mới) + Tên dịch vụ */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="col-span-1">
                    <Label htmlFor="sort_order">Thứ tự</Label>
                    <Input
                      id="sort_order"
                      type="number"
                      value={formData.sort_order}
                      onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                  <div className="col-span-3">
                    <Label htmlFor="title">Tên dịch vụ</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Hệ thống ERP"
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                {/* Hàng 2: Đường dẫn */}
                <div>
                    <Label htmlFor="href">Đường dẫn (tự động)</Label>
                    <Input
                      id="href"
                      value={formData.href}
                      onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                      placeholder="Tự động tạo từ tên"
                      className="mt-1"
                    />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về dịch vụ..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={formData.icon}
                      onValueChange={(value) => setFormData({ ...formData, icon: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map((icon) => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gradient</Label>
                    <Select
                      value={formData.gradient}
                      onValueChange={(value) => setFormData({ ...formData, gradient: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {gradientOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded bg-gradient-to-r ${opt.value}`} />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Features */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Danh sách tính năng</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          placeholder={`Tính năng ${index + 1}`}
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="text-destructive hover:text-destructive shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Images with upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Hình ảnh</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addImage}>
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm ảnh
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.images.map((image, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Ảnh {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeImage(index)}
                            className="text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <FileUploadInput
                          label=""
                          value={image.url}
                          onChange={(value) => updateImage(index, "url", value)}
                          accept="image/*"
                          folder="services"
                        />
                        <Input
                          value={image.alt}
                          onChange={(e) => updateImage(index, "alt", e.target.value)}
                          placeholder="Alt text (mô tả ảnh)"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="admin-button-primary"
                    disabled={createService.isPending || updateService.isPending}
                  >
                    {(createService.isPending || updateService.isPending) && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {editingItem ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={columns}
          data={sortedServices} // Sử dụng danh sách đã sắp xếp
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ServicesPage;