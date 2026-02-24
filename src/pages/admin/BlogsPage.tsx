import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, FileText, ExternalLink, Loader2 } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { useBlogs, useCreateBlog, useUpdateBlog, useDeleteBlog, Blog } from "@/hooks/useBlogs";

const BlogsPage = () => {
  const { data: blogs, isLoading } = useBlogs();
  const createBlog = useCreateBlog();
  const updateBlog = useUpdateBlog();
  const deleteBlog = useDeleteBlog();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Blog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image: "",
    author: "",
    category: "",
    published: false,
    url_word: "",
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      slug: "",
      content: "",
      excerpt: "",
      image: "",
      author: "",
      category: "",
      published: false,
      url_word: "",
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: Blog) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug || "",
      content: item.content || "",
      excerpt: item.excerpt || "",
      image: item.image || "",
      author: item.author || "",
      category: item.category || "",
      published: item.published || false,
      url_word: item.url_word || "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: Blog) => {
    deleteBlog.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      published_at: formData.published ? new Date().toISOString() : null,
    };
    
    if (editingItem) {
      updateBlog.mutate({ id: editingItem.id, ...data });
    } else {
      createBlog.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const columns = [
    { 
      key: "image", 
      label: "Ảnh",
      render: (item: Blog) => (
        item.image ? (
          <img src={item.image} alt={item.title} className="w-12 h-12 rounded object-cover" />
        ) : (
          <div className="w-12 h-12 rounded bg-muted flex items-center justify-center">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
        )
      )
    },
    { key: "title", label: "Tiêu đề" },
    { key: "author", label: "Tác giả" },
    { 
      key: "category", 
      label: "Danh mục",
      render: (item: Blog) => (
        item.category ? (
          <span className="admin-badge admin-badge-primary">{item.category}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    { 
      key: "published", 
      label: "Trạng thái",
      render: (item: Blog) => (
        <span className={`admin-badge ${item.published ? 'admin-badge-accent' : 'admin-badge-muted'}`}>
          {item.published ? "Đã xuất bản" : "Nháp"}
        </span>
      )
    },
    { 
      key: "url_word", 
      label: "File Word",
      render: (item: Blog) => (
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
        title="Quản lý Blog" 
        subtitle="Quản lý các bài viết và tin tức"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{blogs?.length || 0}</span> bài viết
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm bài viết
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        title: e.target.value,
                        slug: formData.slug || generateSlug(e.target.value)
                      });
                    }}
                    placeholder="VD: Giới thiệu hệ thống ERP mới"
                    className="mt-1"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="gioi-thieu-he-thong-erp"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Danh mục</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="VD: Tin tức, Công nghệ"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="author">Tác giả</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="VD: Admin"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="excerpt">Tóm tắt</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    placeholder="Tóm tắt ngắn gọn về bài viết..."
                    className="mt-1"
                    rows={2}
                  />
                </div>

                <div>
                  <Label htmlFor="content">Nội dung</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Nội dung chi tiết của bài viết..."
                    className="mt-1"
                    rows={6}
                  />
                </div>

                <FileUploadInput
                  label="Hình ảnh bìa"
                  value={formData.image}
                  onChange={(value) => setFormData({ ...formData, image: value })}
                  accept="image/*"
                  folder="blogs"
                />

                <FileUploadInput
                  label="File Word"
                  value={formData.url_word}
                  onChange={(value) => setFormData({ ...formData, url_word: value })}
                  accept=".doc,.docx,.pdf"
                  folder="documents"
                  placeholder="Nhập URL hoặc tải file Word/PDF"
                />

                <div className="flex items-center gap-2">
                  <Switch
                    id="published"
                    checked={formData.published}
                    onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                  />
                  <Label htmlFor="published">Xuất bản ngay</Label>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Hủy
                  </Button>
                  <Button 
                    type="submit" 
                    className="admin-button-primary"
                    disabled={createBlog.isPending || updateBlog.isPending}
                  >
                    {(createBlog.isPending || updateBlog.isPending) && (
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
          data={blogs || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default BlogsPage;
