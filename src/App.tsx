import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { MobileViewport } from "./components/MobileViewport";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Accounts } from "./pages/Accounts";
import { Settings } from "./pages/Settings";
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
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <Accounts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
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
