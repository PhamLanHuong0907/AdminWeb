import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, Loader2, Quote } from "lucide-react";
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
import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, Testimonial } from "@/hooks/useTestimonials";

const TestimonialsPage = () => {
  const { data: testimonials, isLoading } = useTestimonials();
  const createTestimonial = useCreateTestimonial();
  const updateTestimonial = useUpdateTestimonial();
  const deleteTestimonial = useDeleteTestimonial();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [formData, setFormData] = useState({
    content: "",
    author: "",
    position: "",
    company: "",
    avatar: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      content: "",
      author: "",
      position: "",
      company: "",
      avatar: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Testimonial) => {
    setEditingItem(item);
    setFormData({
      content: item.content,
      author: item.author,
      position: item.position || "",
      company: item.company || "",
      avatar: item.avatar || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Testimonial) => {
    deleteTestimonial.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      updateTestimonial.mutate({ id: editingItem.id, ...formData });
    } else {
      createTestimonial.mutate(formData);
    }
    
    setIsDialogOpen(false);
  };

  const columns = [
    { 
      key: "avatar",
      label: "Avatar",
      render: (item: Testimonial) => (
        item.avatar ? (
          <img src={item.avatar} alt={item.author} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs">{item.author.charAt(0)}</span>
          </div>
        )
      )
    },
    { 
      key: "content", 
      label: "Nội dung",
      render: (item: Testimonial) => (
        <div className="flex items-start gap-2 max-w-md">
          <Quote className="w-4 h-4 text-primary/50 shrink-0 mt-1" />
          <span className="text-muted-foreground line-clamp-2">{item.content}</span>
        </div>
      )
    },
    { 
      key: "author", 
      label: "Người đánh giá",
      render: (item: Testimonial) => (
        <div>
          <p className="font-medium">{item.author}</p>
          <p className="text-sm text-muted-foreground">{item.position || "-"}</p>
        </div>
      )
    },
    { 
      key: "company", 
      label: "Công ty",
      render: (item: Testimonial) => (
        item.company ? (
          <span className="admin-badge admin-badge-accent">{item.company}</span>
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
        title="Quản lý Đánh giá" 
        subtitle="Quản lý đánh giá của khách hàng (Testimonials)"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{testimonials?.length || 0}</span> đánh giá
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm đánh giá
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa đánh giá" : "Thêm đánh giá mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="content">Nội dung đánh giá</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nhập nội dung đánh giá của khách hàng..."
                    className="mt-1"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="author">Người đánh giá</Label>
                    <Input
                      id="author"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      placeholder="Nguyễn Văn A"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">Chức vụ</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      placeholder="Giám đốc điều hành"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="company">Công ty</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Công ty ABC"
                    className="mt-1"
                  />
                </div>

                <FileUploadInput
                  label="Avatar"
                  value={formData.avatar}
                  onChange={(value) => setFormData({ ...formData, avatar: value })}
                  accept="image/*"
                  folder="testimonials"
                />

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="admin-button-primary"
                    disabled={createTestimonial.isPending || updateTestimonial.isPending}
                  >
                    {(createTestimonial.isPending || updateTestimonial.isPending) && (
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
          data={testimonials || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default TestimonialsPage;
