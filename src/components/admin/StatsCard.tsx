import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard = ({ title, value, icon: Icon, trend, className }: StatsCardProps) => {
  return (
    <div className={cn("admin-card", className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-heading font-bold">{value}</p>
          {trend && (
            <p className={cn(
              "text-sm mt-2",
              trend.isPositive ? "text-accent" : "text-destructive"
            )}>
              {trend.isPositive ? "+" : ""}{trend.value}% so với tháng trước
            </p>
          )}
        </div>
        <div className="p-3 rounded-xl bg-primary/10">
          <Icon className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
};
