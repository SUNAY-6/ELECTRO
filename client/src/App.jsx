import { Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import Home from './pages/Home/Home';
import Login from './pages/Admin/Login';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/Admin/Dashboard';
import ProjectsAdmin from './pages/Admin/ProjectsAdmin';
import AchievementsAdmin from './pages/Admin/AchievementsAdmin';
import SkillsAdmin from './pages/Admin/SkillsAdmin';
import SettingsAdmin from './pages/Admin/SettingsAdmin';
import MessagesAdmin from './pages/Admin/MessagesAdmin';
import Loader from './components/common/Loader';
import ErrorBoundary from './components/common/ErrorBoundary';

function Guard({ children }) {
  const { isAuthed, checking } = useAuth();
  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void">
        <Loader label="VERIFYING ACCESS…" />
      </div>
    );
  }
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin/login" element={<Login />} />
            <Route
              path="/admin"
              element={
                <Guard>
                  <AdminLayout />
                </Guard>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<ProjectsAdmin />} />
              <Route path="achievements" element={<AchievementsAdmin />} />
              <Route path="skills" element={<SkillsAdmin />} />
              <Route path="messages" element={<MessagesAdmin />} />
              <Route path="settings" element={<SettingsAdmin />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}
