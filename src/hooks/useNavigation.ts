import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Navigation = Tables<"navigation">;
export type NavigationInsert = TablesInsert<"navigation">;
export type NavigationUpdate = TablesUpdate<"navigation">;

export const useNavigation = () => {
  return useQuery({
    queryKey: ["navigation"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("navigation")
        .select("*")
        .order("sort_order", { ascending: true });
      
      if (error) throw error;
      return data as Navigation[];
    },
  });
};

export const useCreateNavigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (nav: NavigationInsert) => {
      const { data, error } = await supabase
        .from("navigation")
        .insert(nav)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast.success("Đã thêm menu thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useUpdateNavigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: NavigationUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("navigation")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast.success("Đã cập nhật menu thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useDeleteNavigation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("navigation")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["navigation"] });
      toast.success("Đã xóa menu thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};
