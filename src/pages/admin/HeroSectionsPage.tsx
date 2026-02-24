import { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { FileUploadInput } from "@/components/admin/FileUploadInput";
import { Plus, X, Image as ImageIcon, Loader2 } from "lucide-react";
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
import { useHeroSections, useCreateHeroSection, useUpdateHeroSection, useDeleteHeroSection } from "@/hooks/useHeroSections";
import { useServices } from "@/hooks/useServices";
import { Json } from "@/integrations/supabase/types";

interface HeroCard {
  id: string;
  title: string;
  description: string;
  image: string;
}

type HeroSectionWithService = {
  id: string;
  service_id: string | null;
  title: string;
  subtitle: string | null;
  slogan: string | null;
  background_image: string | null;
  cards: Json | null;
  created_at: string | null;
  updated_at: string | null;
  services: { id: string; title: string } | null;
};

const HeroSectionsPage = () => {
  const { data: heroSections, isLoading } = useHeroSections();
  const { data: services } = useServices();
  const createHeroSection = useCreateHeroSection();
  const updateHeroSection = useUpdateHeroSection();
  const deleteHeroSection = useDeleteHeroSection();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HeroSectionWithService | null>(null);
  const [formData, setFormData] = useState({
    service_id: "",
    background_image: "",
    title: "",
    subtitle: "",
    slogan: "",
    cards: [] as HeroCard[],
  });

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      service_id: "",
      background_image: "",
      title: "",
      subtitle: "",
      slogan: "",
      cards: [],
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (item: HeroSectionWithService) => {
    setEditingItem(item);
    const parsedCards = Array.isArray(item.cards) ? (item.cards as unknown as HeroCard[]) : [];
    setFormData({
      service_id: item.service_id || "",
      background_image: item.background_image || "",
      title: item.title,
      subtitle: item.subtitle || "",
      slogan: item.slogan || "",
      cards: parsedCards,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (item: HeroSectionWithService) => {
    deleteHeroSection.mutate(item.id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      service_id: formData.service_id || null,
      cards: formData.cards as unknown as Json,
    };
    
    if (editingItem) {
      updateHeroSection.mutate({ id: editingItem.id, ...data });
    } else {
      createHeroSection.mutate(data);
    }
    
    setIsDialogOpen(false);
  };

  const addCard = () => {
    setFormData({
      ...formData,
      cards: [...formData.cards, { id: String(Date.now()), title: "", description: "", image: "" }],
    });
  };

  const removeCard = (index: number) => {
    setFormData({
      ...formData,
      cards: formData.cards.filter((_, i) => i !== index),
    });
  };

  const updateCard = (index: number, field: keyof HeroCard, value: string) => {
    const updated = [...formData.cards];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, cards: updated });
  };

  const columns = [
    { 
      key: "serviceName", 
      label: "Dịch vụ",
      render: (item: HeroSectionWithService) => (
        item.services ? (
          <span className="admin-badge admin-badge-primary">{item.services.title}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      )
    },
    { key: "title", label: "Tiêu đề" },
    { key: "subtitle", label: "Phụ đề" },
    { 
      key: "cards", 
      label: "Cards",
      render: (item: HeroSectionWithService) => {
        const cards = Array.isArray(item.cards) ? item.cards : [];
        return (
          <span className="admin-badge admin-badge-accent">{cards.length} cards</span>
        );
      }
    },
    { 
      key: "background_image", 
      label: "Ảnh nền",
      render: (item: HeroSectionWithService) => (
        <div className="w-16 h-10 rounded-lg overflow-hidden bg-muted">
          {item.background_image ? (
            <img src={item.background_image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>
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
        title="Quản lý Hero Sections" 
        subtitle="Quản lý phần Hero của các trang dịch vụ"
      />
      
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Tổng cộng: <span className="text-foreground font-medium">{heroSections?.length || 0}</span> hero sections
          </p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAdd} className="admin-button-primary">
                <Plus className="w-4 h-4" />
                Thêm Hero Section
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? "Chỉnh sửa Hero Section" : "Thêm Hero Section mới"}
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

                <FileUploadInput
                  label="Ảnh nền"
                  value={formData.background_image}
                  onChange={(value) => setFormData({ ...formData, background_image: value })}
                  accept="image/*"
                  folder="hero-sections"
                />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Tiêu đề</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="VD: HỆ THỐNG AIoT"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subtitle">Phụ đề</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="VD: Artificial Intelligence of Things"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="slogan">Slogan</Label>
                  <Input
                    id="slogan"
                    value={formData.slogan}
                    onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                    placeholder="Câu slogan cho Hero Section"
                    className="mt-1"
                  />
                </div>
                
                {/* Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Cards</Label>
                    <Button type="button" variant="outline" size="sm" onClick={addCard}>
                      <Plus className="w-3 h-3 mr-1" />
                      Thêm card
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {formData.cards.map((card, index) => (
                      <div key={card.id || index} className="p-4 rounded-lg border border-border bg-muted/30">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium">Card {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeCard(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <Input
                            placeholder="Tiêu đề card"
                            value={card.title}
                            onChange={(e) => updateCard(index, "title", e.target.value)}
                          />
                          <FileUploadInput
                            label=""
                            value={card.image}
                            onChange={(value) => updateCard(index, "image", value)}
                            accept="image/*"
                            folder="hero-cards"
                          />
                          <Textarea
                            placeholder="Mô tả"
                            value={card.description}
                            onChange={(e) => updateCard(index, "description", e.target.value)}
                            rows={2}
                          />
                        </div>
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
                    disabled={createHeroSection.isPending || updateHeroSection.isPending}
                  >
                    {(createHeroSection.isPending || updateHeroSection.isPending) && (
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
          data={(heroSections as HeroSectionWithService[]) || []}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default HeroSectionsPage;
