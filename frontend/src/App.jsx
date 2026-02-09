import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import ProductList from './pages/products/ProductList';
import CategoryList from './pages/categories/CategoryList';
import StockList from './pages/stocks/StockList';
import ImportList from './pages/imports/ImportList';
import ExportList from './pages/exports/ExportList';
import UserList from './pages/users/UserList';
import Reports from './pages/reports/Reports';
import SupplierList from './pages/suppliers/SupplierList';
import CustomerList from './pages/customers/CustomerList';
import AuditLogList from './pages/audit-logs/AuditLogList';
import InventoryCheckList from './pages/inventory-checks/InventoryCheckList';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoryList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/stocks"
            element={
              <ProtectedRoute>
                <StockList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/imports"
            element={
              <ProtectedRoute>
                <ImportList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/exports"
            element={
              <ProtectedRoute>
                <ExportList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/users"
            element={
              <AdminRoute>
                <UserList />
              </AdminRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/suppliers"
            element={
              <ProtectedRoute>
                <SupplierList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/audit-logs"
            element={
              <AdminRoute>
                <AuditLogList />
              </AdminRoute>
            }
          />

          <Route
            path="/inventory-checks"
            element={
              <ProtectedRoute>
                <InventoryCheckList />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
