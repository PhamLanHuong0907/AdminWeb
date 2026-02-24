import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const uploadFile = async (
    file: File,
    folder: string = "general"
  ): Promise<string | null> => {
    setIsUploading(true);
    setProgress(0);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("uploads")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("uploads")
        .getPublicUrl(data.path);

      setProgress(100);
      return urlData.publicUrl;
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error("Lỗi tải file: " + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteFile = async (url: string): Promise<boolean> => {
    try {
      // Extract path from URL
      const urlParts = url.split("/uploads/");
      if (urlParts.length < 2) return false;

      const path = urlParts[1];
      const { error } = await supabase.storage.from("uploads").remove([path]);

      if (error) throw error;
      return true;
    } catch (error: any) {
      console.error("Delete error:", error);
      return false;
    }
  };

  return {
    uploadFile,
    deleteFile,
    isUploading,
    progress,
  };
};
