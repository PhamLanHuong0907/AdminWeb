import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type HeroSection = Tables<"hero_sections">;
export type HeroSectionInsert = TablesInsert<"hero_sections">;
export type HeroSectionUpdate = TablesUpdate<"hero_sections">;

export const useHeroSections = () => {
  return useQuery({
    queryKey: ["hero_sections"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("hero_sections")
        .select(`
          *,
          services:service_id (id, title)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateHeroSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (heroSection: HeroSectionInsert) => {
      const { data, error } = await supabase
        .from("hero_sections")
        .insert(heroSection)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_sections"] });
      toast.success("Đã thêm Hero Section thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useUpdateHeroSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: HeroSectionUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("hero_sections")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_sections"] });
      toast.success("Đã cập nhật Hero Section thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useDeleteHeroSection = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("hero_sections")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero_sections"] });
      toast.success("Đã xóa Hero Section thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};
