import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { IconPicker } from "@/components/IconPicker";
import { Plus, Loader2, X, ChevronDown, ChevronUp } from "lucide-react"; // ĐÃ THÊM: ChevronDown, ChevronUp
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
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useServices } from "@/hooks/useServices";
import { Json } from "@/integrations/supabase/types";
import { generateProductPath } from "@/lib/slugify";

// Interface
interface InfoItem {
  iconName: string;
  text: string;
  subText: string;
}

interface Feature {
  tag: {
    icon: string;
    text: string;
    colorClass: string;
  };
  title: string;
  description: string;
  image: string;
  floatingBadge: {
    icon: string; 
    title: string;
    subtitle: string;
    iconBgClass: string;
    iconColorClass: string;
  };
  items: InfoItem[];
}

type ProductWithService = {
  id: string;
  title: string;
  path: string | null;
  highlight: string | null;
  description: string | null;
  image: string | null;
  features: Json | null;
  service_id: string | null;
  created_at: string | null;
  updated_at: string | null;
  services: { id: string; title: string } | null;
};

const ProductsPage = () => {
  const { data: products, isLoading } = useProducts();
  const { data: services } = useServices();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductWithService | null>(null);
  
  // --- MỚI: State quản lý các Feature đang được mở rộng ---
  const [expandedFeatures, setExpandedFeatures] = useState<number[]>([0]); // Mặc định mở phần tử đầu tiên

  const [formData, setFormData] = useState({
    title: "",
    service_id: "",
    path: "",
    highlight: "",
    description: "",
    image: "",
    features: [] as Feature[],
  });

  useEffect(() => {
    if (formData.title && formData.service_id) {
      const selectedService = services?.find(s => s.id === formData.service_id);
      if (selectedService) {
        const newPath = generateProductPath(selectedService.title, formData.title);
        setFormData(prev => ({ ...prev, path: newPath }));
      }
    }
  }, [formData.title, formData.service_id, services, editingItem]);

  const handleAdd = () => {
    setEditingItem(null);
    setExpandedFeatures([0]); // Reset lại trạng thái mở khi thêm mới
    setFormData({
      title: "",
      service_id: "",
      path: "",
      highlight: "",
      description: "",
      image: "",
      features: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ProductWithService) => {
    setEditingItem(item);
    setExpandedFeatures([0]); // Mặc định chỉ mở phần tử đầu tiên khi edit để đỡ rối

    const parsedFeatures = Array.isArray(item.features)
      ? (item.features as unknown as any[]).map(f => ({
          tag: f.tag || { icon: "Star", text: "", colorClass: "" },
          title: f.title || "",
          description: f.description || "",
          image: f.image || "",
          floatingBadge: f.floatingBadge || {
            icon: "Star",
            title: "",
            subtitle: "",
            iconBgClass: "bg-primary",
            iconColorClass: "text-primary-foreground",
          },
          items: f.items || f.infos || []
        }))
      : [];

    setFormData({
      title: item.title,
      service_id: item.service_id || "",
      path: item.path || "",
      highlight: item.highlight || "",
      description: item.description || "",
      image: item.image || "",
      features: parsedFeatures,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ProductWithService) => {
    deleteProduct.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = {
      ...formData,
      service_id: formData.service_id || null,
      features: formData.features as unknown as Json,
    };

    if (editingItem) {
      updateProduct.mutate({ id: editingItem.id, ...data });
    } else {
      createProduct.mutate(data);
    }

    setIsDialogOpen(false);
  };

  const addFeature = () => {
    const newFeatureIndex = formData.features.length;
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        {
          tag: { icon: "Star", text: "", colorClass: "bg-primary/10 text-primary" },
          title: "",
          description: "",
          image: "",
          floatingBadge: {
            icon: "Star",
            title: "",
            subtitle: "",
            iconBgClass: "bg-primary",
            iconColorClass: "text-primary-foreground",
          },
          items: [],
        },
      ],
    });
    // Tự động mở Feature vừa thêm mới
    setExpandedFeatures(prev => [...prev, newFeatureIndex]);
  };

  const updateFeature = (index: number, field: string, value: string | number | boolean) => {
    const newFeatures = [...formData.features];
    
    if (field.startsWith("tag.")) {
      const tagField = field.replace("tag.", "");
      newFeatures[index] = {
        ...newFeatures[index],
        tag: { ...newFeatures[index].tag, [tagField]: value },
      };
    } 
    else if (field.startsWith("floatingBadge.")) {
      const badgeField = field.replace("floatingBadge.", "");
      newFeatures[index] = {
        ...newFeatures[index],
        floatingBadge: { ...newFeatures[index].floatingBadge, [badgeField]: value },
      };
    } 
    else {
      newFeatures[index] = { ...newFeatures[index], [field]: value };
    }
    setFormData({ ...formData, features: newFeatures });
  };

  const addInfoToFeature = (featureIndex: number) => {
    const newFeatures = [...formData.features];
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      items: [...newFeatures[featureIndex].items, { iconName: "Info", text: "", subText: "" }],
    };
    setFormData({ ...formData, features: newFeatures });
  };

  const updateInfoInFeature = (featureIndex: number, infoIndex: number, field: string, value: string) => {
    const newFeatures = [...formData.features];
    const newItems = [...newFeatures[featureIndex].items];
    newItems[infoIndex] = { ...newItems[infoIndex], [field]: value };
    newFeatures[featureIndex] = { ...newFeatures[featureIndex], items: newItems };
    setFormData({ ...formData, features: newFeatures });
  };

  const removeInfoFromFeature = (featureIndex: number, infoIndex: number) => {
    const newFeatures = [...formData.features];
    newFeatures[featureIndex] = {
      ...newFeatures[featureIndex],
      items: newFeatures[featureIndex].items.filter((_, i) => i !== infoIndex),
    };
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
    // Cập nhật lại danh sách mở rộng khi xóa
    setExpandedFeatures(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
  };

  // --- MỚI: Hàm Toggle trạng thái đóng/mở Feature ---
  const toggleFeatureExpansion = (index: number) => {
    setExpandedFeatures(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const columns = [
    {
      key: "image",
      label: "Ảnh",
      render: (item: ProductWithService) => (
        item.image ? (
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
        ) : (
          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs">N/A</span>
          </div>
        )
      )
    },
    { key: "title", label: "Tên sản phẩm" },
    {
      key: "service",
      label: "Hệ thống",
      render: (item: ProductWithService) => (
        item.services ? (
          <span className="admin-badge admin-badge-primary">{item.services.title}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    {
      key: "description",
      label: "Mô tả",
      render: (item: ProductWithService) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">
          {item.description || "-"}
        </span>
      )
    },
    {
      key: "features",
      label: "Features",
      render: (item: ProductWithService) => {
        const features = Array.isArray(item.features) ? item.features : [];
        return (
          <span className="admin-badge admin-badge-accent">
            {features.length} features
          </span>
        );
      }
    },
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
        title="Quản lý Sản phẩm"
        subtitle="Quản lý chi tiết sản phẩm với features (bao gồm thông tin con)"
      />

      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{products?.length || 0}</span> sản phẩm
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tên sản phẩm</Label>
                    <Textarea
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Khảo sát & Thăm dò thông minh"
                      className="mt-1 min-h-[40px] py-2 resize-y"
                      rows={1}
                      required
                    />
                  </div>
                  <div>
                    <Label>Hệ thống (Dịch vụ)</Label>
                    <Select
                      value={formData.service_id}
                      onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Chọn hệ thống" />
                      </SelectTrigger>
                      <SelectContent>
                        {services?.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="path">Đường dẫn</Label>
                    <Input
                      id="path"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      placeholder="/AI&IoT/smart-survey"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="highlight">Highlight</Label>
                    <Textarea
                      id="highlight"
                      value={formData.highlight}
                      onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                      placeholder="VD: Công nghệ Drone tiên tiến"
                      className="mt-1 min-h-[40px] py-2 resize-y"
                      rows={1}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản phẩm..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <FileUploadInput
                  label="Hình ảnh sản phẩm"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  accept="image/*"
                  folder="products"
                />

                {/* Features Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">Features (bao gồm thông tin con)</Label>
                    <div className="flex gap-2">
                       {/* Nút tùy chọn: Thu gọn/Mở rộng tất cả (Dành cho tiện ích) */}
                       <Button 
                         type="button" 
                         variant="ghost" 
                         size="sm" 
                         onClick={() => setExpandedFeatures(
                           expandedFeatures.length === formData.features.length ? [] : formData.features.map((_, i) => i)
                         )}
                       >
                         {expandedFeatures.length === formData.features.length ? "Thu gọn tất cả" : "Mở rộng tất cả"}
                       </Button>
                      <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                        <Plus className="w-4 h-4 mr-1" />
                        Thêm Feature
                      </Button>
                    </div>
                  </div>

                  {formData.features.map((feature, index) => {
                    // Kiểm tra xem phần tử hiện tại có đang mở không
                    const isExpanded = expandedFeatures.includes(index);

                    return (
                      <div key={index} className="border rounded-lg bg-muted/30 overflow-hidden">
                        
                        {/* HEADER CỦA FEATURE (BẤM ĐỂ THU GỌN/MỞ RỘNG) */}
                        <div 
                          className="flex items-center justify-between p-3 bg-muted/50 cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => toggleFeatureExpansion(index)}
                        >
                          <div className="flex items-center gap-2 font-medium">
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            <span>Feature {index + 1} {feature.title ? `- ${feature.title}` : ""}</span>
                          </div>
                          
                          {/* Nút xóa tách biệt, cần event.stopPropagation() để không bị dính vào sự kiện click mở rộng */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFeature(index);
                            }}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8"
                          >
                            <X className="w-4 h-4 md:mr-1" />
                            <span className="hidden md:inline">Xóa</span>
                          </Button>
                        </div>

                        {/* NỘI DUNG CỦA FEATURE - CHỈ HIỂN THỊ KHI isExpanded === true */}
                        {isExpanded && (
                          <div className="p-4 space-y-4 border-t">
                            {/* Tag Info */}
                            <div className="grid grid-cols-3 gap-2">
                              <div className="relative z-20">
                                <IconPicker
                                  value={feature.tag.icon}
                                  onChange={(val) => updateFeature(index, "tag.icon", val)}
                                />
                              </div>
                              
                              <Input
                                placeholder="Tag Text"
                                value={feature.tag.text}
                                onChange={(e) => updateFeature(index, "tag.text", e.target.value)}
                              />
                              <Input
                                placeholder="Tag Color Class"
                                value={feature.tag.colorClass}
                                onChange={(e) => updateFeature(index, "tag.colorClass", e.target.value)}
                              />
                            </div>

                            {/* Feature Main Info */}
                            <Input
                              placeholder="Tiêu đề feature"
                              value={feature.title}
                              onChange={(e) => updateFeature(index, "title", e.target.value)}
                            />
                            <Textarea
                              placeholder="Mô tả feature"
                              value={feature.description}
                              onChange={(e) => updateFeature(index, "description", e.target.value)}
                              rows={2}
                            />
                            <Input
                              placeholder="URL hình ảnh feature"
                              value={feature.image}
                              onChange={(e) => updateFeature(index, "image", e.target.value)}
                            />

                            {/* Floating Badge Inputs */}
                            <div className="pt-2 pb-1 border-t border-b border-dashed">
                              <Label className="text-xs text-muted-foreground mb-2 block">Floating Badge</Label>
                              <div className="grid grid-cols-3 gap-2">
                                  <div className="relative z-20">
                                    <IconPicker
                                      value={feature.floatingBadge.icon}
                                      onChange={(val) => updateFeature(index, "floatingBadge.icon", val)}
                                    />
                                  </div>
                                  <Input
                                    placeholder="Badge Title"
                                    value={feature.floatingBadge.title}
                                    onChange={(e) => updateFeature(index, "floatingBadge.title", e.target.value)}
                                  />
                                  <Input
                                    placeholder="Badge Subtitle"
                                    value={feature.floatingBadge.subtitle}
                                    onChange={(e) => updateFeature(index, "floatingBadge.subtitle", e.target.value)}
                                  />
                              </div>
                            </div>

                            {/* Thông tin con (multiple) */}
                            <div className="pt-2">
                              <div className="flex items-center justify-between mb-2">
                                <Label className="text-sm text-muted-foreground">Thông tin con</Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addInfoToFeature(index)}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Thêm
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {feature.items.map((info, infoIndex) => (
                                  <div key={infoIndex} className="flex gap-2 items-center">
                                    <div className="w-[180px] shrink-0 relative z-10">
                                      <IconPicker
                                        value={info.iconName}
                                        onChange={(val) => updateInfoInFeature(index, infoIndex, "iconName", val)}
                                      />
                                    </div>

                                    <Input
                                      placeholder="Text"
                                      value={info.text}
                                      onChange={(e) => updateInfoInFeature(index, infoIndex, "text", e.target.value)}
                                      className="flex-1"
                                    />
                                    <Input
                                      placeholder="SubText"
                                      value={info.subText}
                                      onChange={(e) => updateInfoInFeature(index, infoIndex, "subText", e.target.value)}
                                      className="flex-1"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeInfoFromFeature(index, infoIndex)}
                                      className="text-destructive hover:text-destructive shrink-0"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))}
                                {feature.items.length === 0 && (
                                  <p className="text-xs text-muted-foreground italic">Chưa có thông tin con</p>
                                )}
                              </div>
                            </div>
                            
                            {/* Nút Thu gọn đặt ở cuối Feature (Tùy chọn thêm để dễ thao tác khi Feature quá dài) */}
                            <div className="flex justify-end mt-4 pt-2 border-t border-border/50">
                               <Button 
                                 type="button" 
                                 variant="ghost" 
                                 size="sm" 
                                 onClick={() => toggleFeatureExpansion(index)}
                                 className="text-muted-foreground"
                               >
                                 <ChevronUp className="w-4 h-4 mr-1" />
                                 Thu gọn
                               </Button>
                            </div>
                            
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-end gap-2 pt-4 sticky bottom-0 bg-background pb-4 mt-8 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    className="admin-button-primary"
                    disabled={createProduct.isPending || updateProduct.isPending}
                  >
                    {(createProduct.isPending || updateProduct.isPending) && (
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
          data={(products as ProductWithService[]) || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductsPage;