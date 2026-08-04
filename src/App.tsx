import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./context/ProtectedRoute";
import { KapookProvider } from "./context/KapookContext";
import { MobileViewport } from "./components/MobileViewport";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Home } from "./pages/Home";
import { Accounts } from "./pages/Accounts";
import { Settings } from "./pages/Settings";
import { Salak } from "./pages/Salak";
import { SalakInfo } from "./pages/SalakInfo";
import { SalakBuyList } from "./pages/SalakBuyList";
import { BuySalak } from "./pages/BuySalak";
import { TransactionHistory } from "./pages/TransactionHistory";
import { KapookOnboarding } from "./pages/KapookOnboarding";
import { KapookGoalSetup } from "./pages/KapookGoalSetup";
import { KapookTracker } from "./pages/KapookTracker";
import { KapookDeposit } from "./pages/KapookDeposit";
import { KapookWithdraw } from "./pages/KapookWithdraw";
import { KapookBuyFromPiggy } from "./pages/KapookBuyFromPiggy";

export function App() {
  return (
    <AuthProvider>
      <KapookProvider>
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
            path="/salak/buy"
            element={
              <ProtectedRoute>
                <SalakBuyList />
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
          <Route
            path="/salak/info"
            element={
              <ProtectedRoute>
                <SalakInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook/open"
            element={
              <ProtectedRoute>
                <KapookOnboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook/goal/new"
            element={
              <ProtectedRoute>
                <KapookGoalSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook"
            element={
              <ProtectedRoute>
                <KapookTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook/deposit"
            element={
              <ProtectedRoute>
                <KapookDeposit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook/withdraw"
            element={
              <ProtectedRoute>
                <KapookWithdraw />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kapook/buy"
            element={
              <ProtectedRoute>
                <KapookBuyFromPiggy />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MobileViewport>
      </KapookProvider>
    </AuthProvider>
  );
}
