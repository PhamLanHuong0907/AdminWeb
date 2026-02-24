import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { toast } from "sonner";

export type Prize = Tables<"prizes">;
export type PrizeInsert = TablesInsert<"prizes">;
export type PrizeUpdate = TablesUpdate<"prizes">;

export const usePrizes = () => {
  return useQuery({
    queryKey: ["prizes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prizes")
        .select("*")
        .order("period", { ascending: false });
      
      if (error) throw error;
      return data as Prize[];
    },
  });
};

export const useCreatePrize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (prize: PrizeInsert) => {
      const { data, error } = await supabase
        .from("prizes")
        .insert(prize)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
      toast.success("Đã thêm giải thưởng thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useUpdatePrize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: PrizeUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from("prizes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
      toast.success("Đã cập nhật giải thưởng thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};

export const useDeletePrize = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("prizes")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["prizes"] });
      toast.success("Đã xóa giải thưởng thành công");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
};
