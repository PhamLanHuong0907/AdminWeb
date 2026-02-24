import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, ExternalLink, Loader2 } from "lucide-react";
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
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/hooks/useProjects";
import { useServices } from "@/hooks/useServices";

type ProjectWithService = {
  id: string;
  title: string;
  client: string | null;
  description: string | null;
  category_id: string | null;
  path: string | null;
  url_word: string | null;
  image: string | null;
  created_at: string | null;
  updated_at: string | null;
  services: { id: string; title: string } | null;
};

const ProjectsPage = () => {
  const { data: projects, isLoading } = useProjects();
  const { data: services } = useServices();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ProjectWithService | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    client: "",
    description: "",
    category_id: "",
    path: "",
    url_word: "",
    image: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      client: "",
      description: "",
      category_id: "",
      path: "",
      url_word: "",
      image: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: ProjectWithService) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      client: item.client || "",
      description: item.description || "",
      category_id: item.category_id || "",
      path: item.path || "",
      url_word: item.url_word || "",
      image: item.image || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: ProjectWithService) => {
    deleteProject.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      category_id: formData.category_id || null,
    };
    
    if (editingItem) {
      updateProject.mutate({ id: editingItem.id, ...data });
    } else {
      createProject.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const columns = [
    { key: "title", label: "Tên dự án" },
    { key: "client", label: "Khách hàng" },
    { 
      key: "description", 
      label: "Mô tả",
      render: (item: ProjectWithService) => (
        <span className="text-muted-foreground line-clamp-2 max-w-xs">
          {item.description || "-"}
        </span>
      )
    },
    { 
      key: "category", 
      label: "Danh mục",
      render: (item: ProjectWithService) => (
        item.services ? (
          <span className="admin-badge admin-badge-primary">{item.services.title}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    { 
      key: "image", 
      label: "Hình ảnh",
      render: (item: ProjectWithService) => (
        item.image ? (
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    { 
      key: "url_word", 
      label: "File Word",
      render: (item: ProjectWithService) => (
        item.url_word ? (
          <a 
            href={item.url_word} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="w-3 h-3" />
            Xem file
          </a>
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
        title="Quản lý Dự án" 
        subtitle="Quản lý các dự án (Projects) đã thực hiện"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{projects?.length || 0}</span> dự án
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm dự án
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa dự án" : "Thêm dự án mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Tên dự án</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="VD: Dự án kiểm soát ra vào"
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="client">Khách hàng</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="VD: Công ty Than Thống nhất"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Mô tả</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết về dự án..."
                    className="mt-1"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Danh mục (Dịch vụ)</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
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
                  <div>
                    <Label htmlFor="path">Đường dẫn</Label>
                    <Input
                      id="path"
                      value={formData.path}
                      onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                      placeholder="/projects/ten-du-an"
                      className="mt-1"
                    />
                  </div>
                </div>

                <FileUploadInput
                  label="Hình ảnh dự án"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  accept="image/*"
                  folder="projects"
                />

                <FileUploadInput
                  label="File Word"
                  value={formData.url_word}
                  onChange={(value) => setFormData({ ...formData, url_word: value })}
                  accept=".doc,.docx,.pdf"
                  folder="documents"
                  placeholder="Nhập URL hoặc tải file Word/PDF"
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="admin-button-primary"
                    disabled={createProject.isPending || updateProject.isPending}
                  >
                    {(createProject.isPending || updateProject.isPending) && (
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
          data={(projects as ProjectWithService[]) || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
