import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export const ProtectedRoute = () => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <span className="text-destructive text-2xl">⚠</span>
          </div>
          <h1 className="text-xl font-bold mb-2">Không có quyền truy cập</h1>
          <p className="text-muted-foreground mb-4">
            Tài khoản của bạn không có quyền truy cập vào trang quản trị. 
            Vui lòng liên hệ quản trị viên.
          </p>
          <a href="/auth" className="text-primary hover:underline">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};
