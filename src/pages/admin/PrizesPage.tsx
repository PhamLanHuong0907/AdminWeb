import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, Award, Loader2 } from "lucide-react";
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
import { usePrizes, useCreatePrize, useUpdatePrize, useDeletePrize, Prize } from "@/hooks/usePrizes";

const PrizesPage = () => {
  const { data: prizes, isLoading } = usePrizes();
  const createPrize = useCreatePrize();
  const updatePrize = useUpdatePrize();
  const deletePrize = useDeletePrize();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Prize | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    period: "",
    description: "",
    icon: "",
    color: "",
    text_color: "",
    border_color: "",
    image: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      period: "",
      description: "",
      icon: "Award",
      color: "from-[#1e5c8b] via-[#338bcf] to-[#4eb9e6]",
      text_color: "text-[#4eb9e6]",
      border_color: "border-[#4eb9e6]/30",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Prize) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      period: item.period || "",
      description: item.description || "",
      icon: item.icon || "",
      color: item.color || "",
      text_color: item.text_color || "",
      border_color: item.border_color || "",
      image: item.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Prize) => {
    deletePrize.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updatePrize.mutate({ id: editingItem.id, ...formData });
    } else {
      createPrize.mutate(formData);
    }
    
    setIsDialogOpen(false);
  };

  const columns = [
    { key: "period", label: "Năm" },
    { key: "title", label: "Tên giải thưởng" },
    { 
      key: "description", 
      label: "Mô tả",
      render: (item: Prize) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">
          {item.description || "-"}
        </span>
      )
    },
    { 
      key: "icon", 
      label: "Icon",
      render: (item: Prize) => (
        <span className="admin-badge admin-badge-primary">{item.icon || "-"}</span>
      )
    },
    { 
      key: "image", 
      label: "Hình ảnh",
      render: (item: Prize) => (
        item.image ? (
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
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
        title="Quản lý Giải thưởng" 
        subtitle="Quản lý các giải thưởng và thành tích"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{prizes?.length || 0}</span> giải thưởng
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm giải thưởng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa giải thưởng" : "Thêm giải thưởng mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="period">Năm</Label>
                    <Input
                      id="period"
                      value={formData.period}
                      onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                      placeholder="VD: 2024"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Input
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      placeholder="VD: Award, Trophy, Star"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Tên giải thưởng</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Giải Sao Khuê 4 Sao"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về giải thưởng..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <FileUploadInput
                  label="Hình ảnh"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  accept="image/*"
                  folder="prizes"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">Gradient Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      placeholder="from-blue-500 to-cyan-500"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="text_color">Text Color</Label>
                    <Input
                      id="text_color"
                      value={formData.text_color}
                      onChange={(e) => setFormData({ ...formData, text_color: e.target.value })}
                      placeholder="text-[#4eb9e6]"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="admin-button-primary"
                    disabled={createPrize.isPending || updatePrize.isPending}
                  >
                    {(createPrize.isPending || updatePrize.isPending) && (
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
          data={prizes || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default PrizesPage;
