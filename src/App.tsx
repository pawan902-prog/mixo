import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import ErrorHandler from '@/errors/ErrorHandler';
import ErrorPage from '@/errors/ErrorPage';
import DashboardPage from '@/pages/DashboardPage';
import CampaignsPage from '@/pages/CampaignsPage';
import CampaignDetailPage from '@/pages/CampaignDetailPage';

const App: React.FC = () => {
    return (
        <Provider store={store}>
            <ErrorHandler>
                <div className="dark">
                    <Routes>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/campaigns" element={<CampaignsPage />} />
                        <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
                        <Route path="*" element={<ErrorPage />} />
                    </Routes>
                </div>
            </ErrorHandler>
        </Provider>
    );
};

export default App;

