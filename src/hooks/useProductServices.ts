import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type ProductService = Tables<"product_services">;
export type ProductServiceInsert = TablesInsert<"product_services">;
export type ProductServiceUpdate = TablesUpdate<"product_services">;

export const useProductServices = () => {
  return useQuery({
    queryKey: ["product_services"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_services")
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

export const useCreateProductService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (productService: ProductServiceInsert) => {
      const { data, error } = await supabase
        .from("product_services")
        .insert(productService)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_services"] });
      toast.success("Đã thêm sản phẩm-dịch vụ thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useUpdateProductService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: ProductServiceUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("product_services")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_services"] });
      toast.success("Đã cập nhật sản phẩm-dịch vụ thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useDeleteProductService = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("product_services")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product_services"] });
      toast.success("Đã xóa sản phẩm-dịch vụ thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};
