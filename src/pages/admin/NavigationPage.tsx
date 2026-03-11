import { useState, useMemo } from "react"; // Thêm useMemo để tối ưu sort
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { Plus, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch"; 
import { useNavigation, useCreateNavigation, useUpdateNavigation, useDeleteNavigation, Navigation } from "@/hooks/useNavigation";
import { Json } from "@/integrations/supabase/types";

interface DropdownItem {
  label: string;
  href: string;
}

// --- 1. Hàm tạo slug từ tiếng Việt ---
const generateSlug = (str: string) => {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
};

const NavigationPage = () => {
  const { data: navItems, isLoading } = useNavigation();
  const createNavigation = useCreateNavigation();
  const updateNavigation = useUpdateNavigation();
  const deleteNavigation = useDeleteNavigation();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Navigation | null>(null);
  
  // [CẬP NHẬT 1] Thêm sort_order vào state formData
  const [formData, setFormData] = useState({
    label: "",
    href: "",
    is_header: false,
    sort_order: 0, // Giá trị mặc định
    dropdownItems: [{ label: "", href: "" }] as DropdownItem[],
  });

  // [CẬP NHẬT 2] Logic sắp xếp dữ liệu đầu ra dựa trên sort_order
  const sortedNavItems = useMemo(() => {
    if (!navItems) return [];
    // Sắp xếp tăng dần: số nhỏ lên trên, số lớn xuống dưới
    return [...navItems].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  }, [navItems]);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({ 
      label: "", 
      href: "", 
      is_header: false, 
      sort_order: 0, // Reset về 0 hoặc tính toán số lớn nhất + 1 nếu muốn
      dropdownItems: [{ label: "", href: "" }] 
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Navigation) => {
    setEditingItem(item);
    const dropdown = Array.isArray(item.dropdown) ? (item.dropdown as unknown as DropdownItem[]) : [];
    
    setFormData({
      label: item.label,
      href: item.href,
      is_header: item.is_header !== false,
      sort_order: item.sort_order || 0, // [CẬP NHẬT 3] Lấy dữ liệu cũ
      dropdownItems: dropdown.length > 0 ? dropdown : [{ label: "", href: "" }],
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Navigation) => {
    deleteNavigation.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredDropdown = formData.dropdownItems.filter(d => d.label && d.href);
    const data = {
      label: formData.label,
      href: formData.href,
      is_header: formData.is_header,
      sort_order: Number(formData.sort_order), // [CẬP NHẬT 4] Gửi sort_order lên server
      dropdown: filteredDropdown.length > 0 ? (filteredDropdown as unknown as Json) : null,
    };

    if (editingItem) {
      updateNavigation.mutate({ id: editingItem.id, ...data });
    } else {
      createNavigation.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const addDropdownItem = () => {
    setFormData({
      ...formData,
      dropdownItems: [...formData.dropdownItems, { label: "", href: "" }],
    });
  };

  const removeDropdownItem = (index: number) => {
    setFormData({
      ...formData,
      dropdownItems: formData.dropdownItems.filter((_, i) => i !== index),
    });
  };

  const updateDropdownItem = (index: number, field: "label" | "href", value: string) => {
    const updated = [...formData.dropdownItems];
    updated[index][field] = value;

    if (field === "label") {
      const slug = generateSlug(value);
      updated[index].href = slug ? `/${slug}` : "";
    }

    setFormData({ ...formData, dropdownItems: updated });
  };

  const columns = [
    // [CẬP NHẬT 5] Thêm cột hiển thị thứ tự (Optional - giúp dễ quản lý)
    { 
        key: "sort_order", 
        label: "STT",
        render: (item: Navigation) => <span className="font-mono text-xs">{item.sort_order || 0}</span>
    },
    { key: "label", label: "Tên menu" },
    { key: "href", label: "Đường dẫn" },
    { 
      key: "is_header", 
      label: "Vị trí",
      render: (item: Navigation) => (
         <span className={`px-2 py-1 rounded-full text-xs ${item.is_header ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
           {item.is_header ? "Header" : "Khác"}
         </span>
      )
    },
    { 
      key: "dropdown", 
      label: "Menu con",
      render: (item: Navigation) => {
        const dropdown = Array.isArray(item.dropdown) ? item.dropdown : [];
        return dropdown.length > 0 ? (
          <span className="admin-badge admin-badge-primary">{dropdown.length} mục</span>
        ) : (
          <span className="text-muted-foreground">-</span>
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
        title="Quản lý Navigation" 
        subtitle="Quản lý menu điều hướng cho Client Web"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{navItems?.length || 0}</span> menu
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm menu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa menu" : "Thêm menu mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                
                {/* [CẬP NHẬT 6] Input nhập số thứ tự */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                        <Label htmlFor="label">Tên menu</Label>
                        <Input
                        id="label"
                        value={formData.label}
                        onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                        placeholder="VD: TRANG CHỦ"
                        className="mt-1"
                        required
                        />
                    </div>
                    <div className="col-span-1">
                        <Label htmlFor="sort_order">Thứ tự</Label>
                        <Input
                        id="sort_order"
                        type="number"
                        value={formData.sort_order}
                        onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                        className="mt-1"
                        />
                    </div>
                </div>

                <div>
                  <Label htmlFor="href">Đường dẫn</Label>
                  <Input
                    id="href"
                    value={formData.href}
                    onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                    placeholder="VD: /"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <Switch
                    id="is_header"
                    checked={formData.is_header}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_header: checked })}
                  />
                  <Label htmlFor="is_header" className="cursor-pointer">
                    Hiển thị trên Header
                  </Label>
                </div>
                
                {/* Phần Dropdown giữ nguyên */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Menu con (Dropdown)</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addDropdownItem}>
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formData.dropdownItems.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Tên mục"
                            value={item.label}
                            onChange={(e) => updateDropdownItem(index, "label", e.target.value)}
                          />
                          <Input
                            placeholder="Đường dẫn"
                            value={item.href}
                            onChange={(e) => updateDropdownItem(index, "href", e.target.value)}
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDropdownItem(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          ×
                        </Button>
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
                    disabled={createNavigation.isPending || updateNavigation.isPending}
                  >
                    {(createNavigation.isPending || updateNavigation.isPending) && (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    )}
                    {editingItem ? "Cập nhật" : "Thêm mới"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* [CẬP NHẬT 7] Truyền sortedNavItems thay vì navItems gốc */}
        <DataTable
          columns={columns}
          data={sortedNavItems} 
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default NavigationPage;