import { Spinner } from '@heroui/react';
import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const Layout = React.lazy(() => import('./components/layout/Layout'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Calls = React.lazy(() => import('./pages/Calls'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const EmailCampaign = React.lazy(() => import('./pages/EmailCampaigns'));
const MarketingBudget = React.lazy(() => import('./pages/MarketingBudget'));
const MarketingCalendar = React.lazy(() => import('./pages/MarketingCalendar'));
const ReferralManagement = React.lazy(() => import('./pages/referral-management/ReferralManagement'));
const ReferralConnections = React.lazy(() => import('./pages/referral-connections/ReferralConnections'));
const Reviews = React.lazy(() => import('./pages//reviews/Reviews'));
const SocialMedia = React.lazy(() => import('./pages/SocialMedia'));
const Reports = React.lazy(() => import('./pages/Reports'));
const Calender = React.lazy(() => import('./pages/Calender'));
const Settings = React.lazy(() => import('./pages/settings/Settings'));
const Notifications = React.lazy(() => import('./pages/settings/Notifications'));
const Security = React.lazy(() => import('./pages/settings/Security'));
const Billing = React.lazy(() => import('./pages/settings/Billing'));
const Locations = React.lazy(() => import('./pages/settings/Locations'));
const Team = React.lazy(() => import('./pages/settings/Team'));
const General = React.lazy(() => import('./pages/settings/General'));
const IntegrationTests = React.lazy(() => import('./pages/settings/IntegrationTests'));
const PushNotifications = React.lazy(() => import('./pages/settings/PushNotifications'));
const NotificationAnalytics = React.lazy(() => import('./pages/settings/NotificationAnalytics'));
const Profile = React.lazy(() => import('./pages/settings/Profile'));

function AppRoutes() {
    const routesList = [
        {
            path: "/",
            element: <Layout />,
            children: [
                { index: true, element: <Dashboard /> },
                { path: "dashboard", element: <Dashboard /> },
                { path: "referrals", element: <ReferralManagement /> },
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
                { path: "helpcenter", element: <HelpCenter /> },
                {
                    path: "settings",
                    element: <Settings />,
                    children: [
                        { index: true, element: <Profile /> },
                        { path: "notifications", element: <Notifications /> },
                        { path: "security", element: <Security /> },
                        { path: "billing", element: <Billing /> },
                        { path: "locations", element: <Locations /> },
                        { path: "team", element: <Team /> },
                        { path: "general", element: <General /> },
                        { path: "integration-tests", element: <IntegrationTests /> },
                        { path: "push-notifications", element: <PushNotifications /> },
                        { path: "notification-analytics", element: <NotificationAnalytics /> },
                    ]
                },
            ],
        },
    ];

    const renderRoutes = (routes) => {
        return routes.map((route, index) => (
            <Route
                key={index}
                path={route.path}
                element={route.element}
                index={route.index}
            >
                {route.children && renderRoutes(route.children)}
            </Route>
        ));
    };

    return (
        <Suspense fallback={<Spinner label="Loading..." variant='gradient' color="success" className="bg-light dark:bg-background w-screen h-screen" />}>
            <BrowserRouter basename="/referral-retrieve">
                <Routes>
                    {renderRoutes(routesList)}
                </Routes>
            </BrowserRouter>
        </Suspense>
    );
}

export default AppRoutes;