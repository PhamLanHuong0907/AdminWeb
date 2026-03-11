import React, { useState, useMemo } from "react";
import * as Icons from "lucide-react";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export const IconPicker = ({ value, onChange }: IconPickerProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Lấy danh sách tên tất cả các icon từ Lucide
  const allIconNames = Object.keys(Icons).filter(
    (key) => typeof (Icons as any)[key] === "function" || typeof (Icons as any)[key] === "object"
  );

  // Filter và giới hạn hiển thị (tăng lên 20 cái cho dễ chọn nếu muốn)
  const filteredIcons = useMemo(() => {
    if (!searchTerm) return allIconNames.slice(0, 20);
    
    return allIconNames
      .filter((name) => name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 20);
  }, [searchTerm, allIconNames]);

  const SelectedIcon = (Icons as any)[value] || Icons.HelpCircle;

  return (
    <div className="relative w-full">
      {/* Nút bấm mở Dropdown */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 h-10 border rounded-md bg-background text-foreground hover:bg-accent/50 transition-colors focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <div className="flex items-center gap-2">
          {/* Icon hiển thị mặc định */}
          <SelectedIcon size={18} className="shrink-0" />
          <span className="text-sm truncate">{value || "Chọn Icon"}</span>
        </div>
        <Icons.ChevronDown size={16} className="text-muted-foreground opacity-50" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg bg-popover text-popover-foreground ">
          {/* Ô tìm kiếm cố định ở đầu */}
          <div className="p-2 border-b">
            <input
              autoFocus
              type="text"
              placeholder="Tìm icon (vd: star)..."
              className="w-full px-2 py-1.5 text-sm bg-transparent border rounded-md focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Danh sách cuộn được */}
          <div className="max-h-[200px] overflow-y-auto p-1 grid grid-cols-1 gap-1">
            {filteredIcons.length > 0 ? (
              filteredIcons.map((name) => {
                const Icon = (Icons as any)[name];
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => {
                      onChange(name);
                      setIsOpen(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left cursor-pointer"
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{name}</span>
                  </button>
                );
              })
            ) : (
              <p className="text-xs text-center text-muted-foreground py-4">
                Không tìm thấy icon
              </p>
            )}
          </div>
        </div>
      )}
      
      {/* Backdrop vô hình để đóng dropdown khi click ra ngoài (Optional nhưng UX tốt hơn) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};