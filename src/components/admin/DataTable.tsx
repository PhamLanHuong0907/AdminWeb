import { ReactNode } from "react";
import { Edit2, Trash2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView 
}: DataTableProps<T>) {
  const hasActions = onEdit || onDelete || onView;

  return (
    <div className="admin-card p-0 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={String(column.key)} className={column.className}>
                  {column.label}
                </th>
              ))}
              {hasActions && <th className="text-right items-end">Thao tác</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (hasActions ? 1 : 0)} className="text-center py-8 text-muted-foreground">
                  Không có dữ liệu
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr key={item.id}>
                  {columns.map((column) => (
                    <td key={`${item.id}-${String(column.key)}`} className={column.className}>
                      {column.render 
                        ? column.render(item) 
                        : String((item as Record<string, unknown>)[column.key as string] ?? "")}
                    </td>
                  ))}
                  {hasActions && (
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        {onView && (
                          <button
                            onClick={() => onView(item)}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            title="Xem"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}
                        {onEdit && (
                          <button
                            onClick={() => onEdit(item)}
                            className="p-2 rounded-lg hover:bg-primary/10 transition-colors text-muted-foreground hover:text-primary"
                            title="Sửa"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(item)}
                            className="p-2 rounded-lg hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
                            title="Xóa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
