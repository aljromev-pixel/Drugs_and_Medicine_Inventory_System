import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import AddMedicine from './pages/AddMedicine';
import Home from './pages/Home';
import Login from './pages/Login';
import MedicineDetails from './pages/MedicineDetails';
import MedicineList from './pages/MedicineList';

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const showNavbar = location.pathname !== '/login' && location.pathname !== '/';

  return (
    <>
      {showNavbar && <Navbar />}
      <main className="app-shell">
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />}
          />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <Login />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines"
            element={
              <ProtectedRoute>
                <MedicineList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines/add"
            element={
              <ProtectedRoute>
                <AddMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medicines/:id"
            element={
              <ProtectedRoute>
                <MedicineDetails />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
