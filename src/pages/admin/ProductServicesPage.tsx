import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, X, Loader2 } from "lucide-react";
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
import { useProductServices, useCreateProductService, useUpdateProductService, useDeleteProductService } from "@/hooks/useProductServices";
import { useServices } from "@/hooks/useServices";
import { Json } from "@/integrations/supabase/types";
import { generateProductPath } from "@/lib/slugify";

interface ProductItem {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  path: string;
}

type ProductServiceWithService = {
  id: string;
  service_id: string | null;
  products: Json | null;
  created_at: string | null;
  updated_at: string | null;
  services: { id: string; title: string } | null;
};

const iconOptions = ["Map", "ShieldCheck", "ScanEye", "LayoutDashboard", "Factory", "Cpu", "Database", "Settings"];

const ProductServicesPage = () => {
  const { data: productServices, isLoading } = useProductServices();
  const { data: services } = useServices();
  const createProductService = useCreateProductService();
  const updateProductService = useUpdateProductService();
  const deleteProductService = useDeleteProductService();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProductServiceWithService | null>(null);
  const [formData, setFormData] = useState({
    service_id: "",
    products: [] as ProductItem[],
  });

  // Get selected service for auto-path generation
  const selectedService = services?.find(s => s.id === formData.service_id);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      service_id: "",
      products: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ProductServiceWithService) => {
    setEditingItem(item);
    const parsedProducts = Array.isArray(item.products) ? (item.products as unknown as ProductItem[]) : [];
    setFormData({
      service_id: item.service_id || "",
      products: parsedProducts,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ProductServiceWithService) => {
    deleteProductService.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      service_id: formData.service_id || null,
      products: formData.products.filter(p => p.title) as unknown as Json,
    };
    
    if (editingItem) {
      updateProductService.mutate({ id: editingItem.id, ...data });
    } else {
      createProductService.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, { id: String(Date.now()), title: "", description: "", image: "", icon: "Map", path: "" }],
    });
  };

  const removeProduct = (index: number) => {
    setFormData({
      ...formData,
      products: formData.products.filter((_, i) => i !== index),
    });
  };

  const updateProduct = (index: number, field: keyof ProductItem, value: string) => {
    const updated = [...formData.products];
    updated[index] = { ...updated[index], [field]: value };
    
    // Auto-generate path when title changes
    if (field === "title" && selectedService && !editingItem) {
      updated[index].path = generateProductPath(selectedService.title, value);
    }
    
    setFormData({ ...formData, products: updated });
  };

  const columns = [
    { 
      key: "serviceName", 
      label: "Dịch vụ",
      render: (item: ProductServiceWithService) => (
        item.services ? (
          <span className="admin-badge admin-badge-primary">{item.services.title}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    { 
      key: "products", 
      label: "Số sản phẩm",
      render: (item: ProductServiceWithService) => {
        const products = Array.isArray(item.products) ? item.products : [];
        return (
          <span className="admin-badge admin-badge-accent">{products.length} sản phẩm</span>
        );
      }
    },
    { 
      key: "productList", 
      label: "Danh sách",
      render: (item: ProductServiceWithService) => {
        const products = Array.isArray(item.products) ? (item.products as unknown as ProductItem[]) : [];
        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {products.slice(0, 2).map((p, i) => (
              <span key={i} className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                {p.title}
              </span>
            ))}
            {products.length > 2 && (
              <span className="text-xs text-muted-foreground">+{products.length - 2}</span>
            )}
          </div>
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
        title="Quản lý Sản phẩm - Dịch vụ" 
        subtitle="Quản lý danh sách sản phẩm theo từng dịch vụ"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{productServices?.length || 0}</span> nhóm sản phẩm
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm nhóm sản phẩm
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa" : "Thêm nhóm sản phẩm mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label>Dịch vụ</Label>
                  <Select
                    value={formData.service_id}
                    onValueChange={(value) => setFormData({ ...formData, service_id: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn dịch vụ" />
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
                
                {/* Products */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Danh sách sản phẩm</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addProduct}>
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm sản phẩm
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.products.map((product, index) => (
                      <div key={product.id || index} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Sản phẩm {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeProduct(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <Input
                            placeholder="Tên sản phẩm"
                            value={product.title}
                            onChange={(e) => updateProduct(index, "title", e.target.value)}
                          />
                          <Input
                            placeholder="Đường dẫn (tự động)"
                            value={product.path}
                            onChange={(e) => updateProduct(index, "path", e.target.value)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                          <FileUploadInput
                            label=""
                            value={product.image}
                            onChange={(value) => updateProduct(index, "image", value)}
                            accept="image/*"
                            folder="product-services"
                          />
                          <Select
                            value={product.icon}
                            onValueChange={(value) => updateProduct(index, "icon", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {iconOptions.map((icon) => (
                                <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Textarea
                          placeholder="Mô tả sản phẩm"
                          value={product.description}
                          onChange={(e) => updateProduct(index, "description", e.target.value)}
                          rows={2}
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
                    disabled={createProductService.isPending || updateProductService.isPending}
                  >
                    {(createProductService.isPending || updateProductService.isPending) && (
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
          data={(productServices as ProductServiceWithService[]) || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProductServicesPage;
