import { Toaster } from "@/components/ui/toaster"
import { Toaster as SonnerToaster } from 'sonner'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import AdminLayout from '@/components/admin/AdminLayout';
import Dashboard from '@/pages/admin/Dashboard';
import DestinationsAdmin from '@/pages/admin/DestinationsAdmin';
import GuidesAdmin from '@/pages/admin/GuidesAdmin';
import ContactRequestsAdmin from '@/pages/admin/ContactRequestsAdmin';
import UsersAdmin from '@/pages/admin/UsersAdmin';
import Login from '@/pages/Login';
import TestimonialsAdmin from '@/pages/admin/TestimonialsAdmin';
import CountriesAdmin from '@/pages/admin/CountriesAdmin';
import SiteTextsAdmin from '@/pages/admin/SiteTextsAdmin';
import Profile from '@/pages/admin/Profile';


const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

// Component to scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
};

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin, isAuthenticated } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/about" element={<Navigate to="/sobre" replace />} />
      <Route path="/destinations" element={<Navigate to="/destinos" replace />} />
      <Route path="/guides" element={<Navigate to="/guias" replace />} />
      <Route path="/" element={
        <LayoutWrapper currentPageName={mainPageKey}>
          <MainPage />
        </LayoutWrapper>
      } />

      <Route path="/login" element={<Login />} />

      {/* Admin Routes */}
      <Route path="/admin" element={
        isAuthenticated ? (
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/destinations" element={
        isAuthenticated ? (
          <AdminLayout>
            <DestinationsAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/guides" element={
        isAuthenticated ? (
          <AdminLayout>
            <GuidesAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/contacts" element={
        isAuthenticated ? (
          <AdminLayout>
            <ContactRequestsAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/testimonials" element={
        isAuthenticated ? (
          <AdminLayout>
            <TestimonialsAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/countries" element={
        isAuthenticated ? (
          <AdminLayout>
            <CountriesAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/users" element={
        isAuthenticated ? (
          <AdminLayout>
            <UsersAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/site-texts" element={
        isAuthenticated ? (
          <AdminLayout>
            <SiteTextsAdmin />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />
      <Route path="/admin/profile" element={
        isAuthenticated ? (
          <AdminLayout>
            <Profile />
          </AdminLayout>
        ) : (
          <Login />
        )
      } />


      {Object.entries(Pages)
        .filter(([path]) => path !== 'DestinationDetail')
        .map(([path, Page]) => (
          <Route
            key={path}
            path={`/${path.toLowerCase()}`}
            element={
              <LayoutWrapper currentPageName={path}>
                <Page />
              </LayoutWrapper>
            }
          />
        ))}

      {/* Rota dinâmica para os Destinos Individuais usando slug */}
      <Route
        path="/:slug"
        element={
          <LayoutWrapper currentPageName="DestinationDetail">
            <Pages.DestinationDetail />
          </LayoutWrapper>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
        </Router>
        <Toaster />
        <SonnerToaster richColors position="top-right" />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
