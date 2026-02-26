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
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "@/hooks/useProducts";
import { useServices } from "@/hooks/useServices";
import { Json } from "@/integrations/supabase/types";
import { generateProductPath } from "@/lib/slugify";

// SỬA 1: Đổi 'icon' thành 'iconName' cho khớp với Client
interface InfoItem {
  iconName: string; 
  text: string;
  subText: string;
}

// SỬA 2: Đổi 'infos' thành 'items'
interface Feature {
  tag: {
    icon: string;
    text: string;
    colorClass: string;
  };
  title: string;
  description: string;
  image: string;
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
    if (editingItem && formData.title && formData.service_id) {
      const selectedService = services?.find(s => s.id === formData.service_id);
      if (selectedService) {
        const newPath = generateProductPath(selectedService.title, formData.title);
        setFormData(prev => ({ ...prev, path: newPath }));
      }
    }
  }, [formData.title, formData.service_id, services, editingItem]);

  const handleAdd = () => {
    setEditingItem(null);
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
    
    // SỬA 3: Map dữ liệu an toàn để tương thích với cả DB cũ và mới
    const parsedFeatures = Array.isArray(item.features) 
      ? (item.features as unknown as (Feature & { infos?: InfoItem[] })[]).map(f => ({
          ...f,
          // Lấy items, nếu không có thì thử lấy infos (DB cũ), nếu vẫn không có thì gán mảng rỗng
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
    setFormData({
      ...formData,
      features: [
        ...formData.features,
        {
          tag: { icon: "Star", text: "", colorClass: "bg-primary/10 text-primary" },
          title: "",
          description: "",
          image: "",
          items: [], // SỬA 4: Dùng items
        },
      ],
    });
  };

  const updateFeature = (index: number, field: string, value: string | number | boolean) => {
    const newFeatures = [...formData.features];
    if (field.startsWith("tag.")) {
      const tagField = field.replace("tag.", "");
      newFeatures[index] = {
        ...newFeatures[index],
        tag: { ...newFeatures[index].tag, [tagField]: value },
      };
    } else {
      newFeatures[index] = { ...newFeatures[index], [field]: value };
    }
    setFormData({ ...formData, features: newFeatures });
  };

  // SỬA 5: Cập nhật các hàm thao tác với thông tin con
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
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: Khảo sát & Thăm dò thông minh"
                      className="mt-1"
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
                    <Input
                      id="highlight"
                      value={formData.highlight}
                      onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                      placeholder="VD: Công nghệ Drone tiên tiến"
                      className="mt-1"
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
                    <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                      <Plus className="w-4 h-4 mr-1" />
                      Thêm Feature
                    </Button>
                  </div>
                  
                  {formData.features.map((feature, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Feature {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFeature(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Xóa
                        </Button>
                      </div>
                      
                      {/* Tag Info */}
                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Icon (VD: Plane)"
                          value={feature.tag.icon}
                          onChange={(e) => updateFeature(index, "tag.icon", e.target.value)}
                        />
                        <Input
                          placeholder="Text (VD: Drone)"
                          value={feature.tag.text}
                          onChange={(e) => updateFeature(index, "tag.text", e.target.value)}
                        />
                        <Input
                          placeholder="Color Class"
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
                      
                      {/* Thông tin con (multiple) */}
                      <div className="pt-2 border-t">
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
                          {/* SỬA 6: Render từ mảng items */}
                          {feature.items.map((info, infoIndex) => (
                            <div key={infoIndex} className="flex gap-2 items-center">
                              <Input
                                placeholder="Tên Icon (VD: ShieldCheck)"
                                value={info.iconName}
                                onChange={(e) => updateInfoInFeature(index, infoIndex, "iconName", e.target.value)}
                                className="flex-1"
                              />
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
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
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