import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Link as LinkIcon, Loader2 } from "lucide-react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { cn } from "@/lib/utils";

interface FileUploadInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  accept?: string;
  folder?: string;
  placeholder?: string;
}

export const FileUploadInput = ({
  label,
  value,
  onChange,
  accept = "image/*,.doc,.docx,.pdf",
  folder = "general",
  placeholder = "Nhập URL hoặc tải file lên",
}: FileUploadInputProps) => {
  const [mode, setMode] = useState<"url" | "upload">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadFile, isUploading } = useFileUpload();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = await uploadFile(file, folder);
    if (url) {
      onChange(url);
    }
  };

  const handleClear = () => {
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = value && (value.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) || value.includes("image"));

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>{label}</Label>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={mode === "url" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("url")}
            className="h-7 px-2 text-xs"
          >
            <LinkIcon className="w-3 h-3 mr-1" />
            URL
          </Button>
          <Button
            type="button"
            variant={mode === "upload" ? "default" : "outline"}
            size="sm"
            onClick={() => setMode("upload")}
            className="h-7 px-2 text-xs"
          >
            <Upload className="w-3 h-3 mr-1" />
            Upload
          </Button>
        </div>
      </div>

      {mode === "url" ? (
        <div className="relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="pr-8"
          />
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg p-4 transition-colors",
              "hover:border-primary/50 cursor-pointer",
              isUploading && "pointer-events-none opacity-50"
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2 text-center">
              {isUploading ? (
                <>
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Đang tải lên...</span>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Click để chọn file hoặc kéo thả
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2">
          {isImage ? (
            <div className="relative inline-block">
              <img
                src={value}
                alt="Preview"
                className="max-h-24 rounded-lg border"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : value ? (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
              <LinkIcon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm truncate flex-1">{value}</span>
              <button
                type="button"
                onClick={handleClear}
                className="text-muted-foreground hover:text-destructive"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
