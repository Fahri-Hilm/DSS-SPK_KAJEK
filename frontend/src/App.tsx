import { useState } from 'react';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import AnalysisView from './components/AnalysisView';
import CalculationView from './components/CalculationView';
import DataView from './components/DataView';
import HistoryView from './components/HistoryView';
import DocumentationView from './components/DocumentationView';

function App() {
    const [activeTab, setActiveTab] = useState('dashboard');

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard':
                return <DashboardView />;
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
            default:
                return <div className="text-center p-20 text-slate-500">Page Not Found</div>;
        }
    };

    return (
        <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
            {renderContent()}
        </Layout>
    );
}

export default App;

