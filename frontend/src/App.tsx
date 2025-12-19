import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import ComponentLibrary from './pages/ComponentLibrary';
import ComponentEditor from './pages/ComponentEditor';
import SitePreview from './pages/SitePreview';
import PagesManager from './pages/PagesManager';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProductManager from './pages/admin/ProductManager';
import ServiceManager from './pages/admin/ServiceManager';
import TeamManager from './pages/admin/TeamManager';
import GalleryManager from './pages/admin/GalleryManager';
import './index.css';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects"
                        element={
                            <ProtectedRoute>
                                <Projects />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id"
                        element={
                            <ProtectedRoute>
                                <ProjectDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/pages"
                        element={
                            <ProtectedRoute>
                                <PagesManager />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/pages/:pageId/components"
                        element={
                            <ProtectedRoute>
                                <ComponentLibrary />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/components"
                        element={
                            <ProtectedRoute>
                                <ComponentLibrary />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/components/:componentId/edit"
                        element={
                            <ProtectedRoute>
                                <ComponentEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/pages/:pageId/components/:componentId/edit"
                        element={
                            <ProtectedRoute>
                                <ComponentEditor />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/projects/:id/preview"
                        element={
                            <ProtectedRoute>
                                <SitePreview />
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin Panel routes */}
                    <Route
                        path="/projects/:id/admin"
                        element={
                            <ProtectedRoute>
                                <AdminPanel />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="products" element={<ProductManager />} />
                        <Route path="services" element={<ServiceManager />} />
                        <Route path="team" element={<TeamManager />} />
                        <Route path="gallery" element={<GalleryManager />} />
                    </Route>

                    {/* Default redirect */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
