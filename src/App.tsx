import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { MobileViewport } from "./components/MobileViewport";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Salak } from "./pages/Salak";
import { BuySalak } from "./pages/BuySalak";
import { TransactionHistory } from "./pages/TransactionHistory";

export function App() {
  return (
    <AuthProvider>
      <MobileViewport>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salak"
            element={
              <ProtectedRoute>
                <Salak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/salak/buy/:productId"
            element={
              <ProtectedRoute>
                <BuySalak />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts/:accountId/transactions"
            element={
              <ProtectedRoute>
                <TransactionHistory />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileViewport>
    </AuthProvider>
  );
}
