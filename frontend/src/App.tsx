import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'sonner';
import { api } from './services/api';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import AnalysisView from './components/AnalysisView';
import CalculationView from './components/CalculationView';
import DataView from './components/DataView';
import HistoryView from './components/HistoryView';
import DocumentationView from './components/DocumentationView';
import LoginView from './components/LoginView';
import SettingsView from './components/SettingsView';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView onNavigate={setActiveTab} />;
            case 'analysis':
                return <AnalysisView />;
            case 'calculation':
                return <CalculationView />;
            case 'data':
                return <DataView />;
            case 'history':
                return <HistoryView />;
            case 'documentation':
                return <DocumentationView />;
            case 'settings':
                return <SettingsView />;
            default:
                return <div className="text-center p-20 text-slate-500">Page Not Found</div>;
        }
    };

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);

    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await api.login(username, password);
            setCurrentUser(response.user);
            setIsAuthenticated(true);
        } catch (error) {
            throw error; // Let LoginView handle the error
        }
    };

    const handleLogout = () => {
        api.logout();
        setCurrentUser(null);
        setIsAuthenticated(false);
        setActiveTab('dashboard');
        sessionStorage.removeItem('hasBooted'); // Reset boot sequence for next login
    };

    if (!isAuthenticated) {
        return (
            <>
                <Toaster position="top-right" theme="dark" richColors />
                <LoginView onLogin={handleLogin} />
            </>
        );
    }

    return (
        <>
            <Toaster position="top-right" theme="dark" richColors />
            <Layout activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} currentUser={currentUser}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="h-full"
                    >
                        {renderContent()}
                    </motion.div>
                </AnimatePresence>
            </Layout>
        </>
    );
}

export default App;

