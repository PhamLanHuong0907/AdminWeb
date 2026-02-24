import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Blog = Tables<"blogs">;
export type BlogInsert = TablesInsert<"blogs">;
export type BlogUpdate = TablesUpdate<"blogs">;

export const useBlogs = () => {
  return useQuery({
    queryKey: ["blogs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Blog[];
    },
  });
};

export const useCreateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (blog: BlogInsert) => {
      const { data, error } = await supabase
        .from("blogs")
        .insert(blog)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Đã thêm bài viết thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useUpdateBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: BlogUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("blogs")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Đã cập nhật bài viết thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useDeleteBlog = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("blogs")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
      toast.success("Đã xóa bài viết thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};
