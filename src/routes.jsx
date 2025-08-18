import React, { Suspense } from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import ProtectedRoute from './authentication/ProtectedRoute';
// import { Spinner } from '@nextui-org/react';


import { Spinner } from '@heroui/react';
import { BrowserRouter, Route, Routes } from 'react-router';
const Layout = React.lazy(() => import('./components/layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Calls = React.lazy(() => import('./pages/Calls'));
const EmailCampaign = React.lazy(() => import('./pages/EmailCampaigns'));
const MarketingBudget = React.lazy(() => import('./pages/MarketingBudget'));
const MarketingCalendar = React.lazy(() => import('./pages/MarketingCalendar'));
const ReferralConnections = React.lazy(() => import('./pages/ReferralConnections'));
const Reviews = React.lazy(() => import('./pages/Reviews'));
const SocialMedia = React.lazy(() => import('./pages/SocialMedia'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Calender = React.lazy(() => import('./pages/Calender'));


function AppRoutes() {
    const routesList = [
        {
            path: "/",
            element: <Layout />,
            children: [
                { path: "/", element: <Dashboard /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "referrals", element: <ReferralConnections /> },
                { path: "analytics", element: <Analytics /> },
                { path: "referral-connections", element: <ReferralConnections /> },
                { path: "calls", element: <Calls /> },
                { path: "reviews", element: <Reviews /> },
                { path: "email-campaigns", element: <EmailCampaign /> },
                { path: "social-media", element: <SocialMedia /> },
                { path: "marketing-calendar", element: <MarketingCalendar /> },
                { path: "budget", element: <MarketingBudget /> },
                { path: "marketing-budget", element: <MarketingBudget /> },
                { path: "reports", element: <Reports /> },
                { path: "social", element: <SocialMedia /> },
                { path: "calender", element: <Calender /> },
            ],
        },

        // { path: "login", element: <Login /> },
        // { path: "signup", element: <Signup /> },
    ];



    return (
        <Suspense fallback={<Spinner label="Loading..." color="success" className="bg-light dark:bg-background w-screen h-screen" />}>
            <BrowserRouter>
                <Routes>
                    {/* {routesList.map(({ path, element, }) => (
                        <Route key={path} path={path} element={element}>
                            {children?.map(({ path, element }) => (
                                <Route key={path} path={path} element={element} />
                            ))}
                        </Route>
                    ))} */}
                    {routesList.map(({ path, element, children }) => (
                        <Route key={path} path={path} element={element}>
                            {children?.map(({ path, element }) => (
                                <Route key={path} path={path} element={element} />
                            ))}
                        </Route>
                    ))}

                </Routes>
            </BrowserRouter>
        </Suspense>
    );
}

export default AppRoutes;