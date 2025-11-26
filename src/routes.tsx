import React, { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/auth/ProtectedRoute";
import QrGenerator from "./pages/qr-generator/QrGenerator";

const Layout = React.lazy(() => import("./components/layout/Layout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const HelpCenter = React.lazy(() => import("./pages/HelpCenter"));
const EmailCampaign = React.lazy(() => import("./pages/EmailCampaigns"));
const MarketingBudget = React.lazy(() => import("./pages/marketing-budget/MarketingBudget"));
const MarketingCalendar = React.lazy(
  () => import("./pages/marketing-calender/MarketingCalendar")
);
const ReferralManagement = React.lazy(
  () => import("./pages/referral-management/ReferralManagement")
);
const PartnerNetwork = React.lazy(
  () => import("./pages/partner-network/PartnerNetwork")
);
const VisitMap = React.lazy(() => import("./pages/visit-map/VisitMap"));
const Reviews = React.lazy(() => import("./pages/reviews/Reviews"));
const SocialMedia = React.lazy(
  () => import("./pages/social-media/SocialMedia")
);
const Reports = React.lazy(() => import("./pages/Reports"));
const Tasks = React.lazy(() => import("./pages/tasks/Tasks"));
const MediaManagement = React.lazy(
  () => import("./pages/media-management/MediaManagement")
);
const Integrations = React.lazy(
  () => import("./pages/integrations/Integrations")
);
const Settings = React.lazy(() => import("./pages/settings/Settings"));
const Notifications = React.lazy(
  () => import("./pages/settings/Notifications")
);
const Security = React.lazy(() => import("./pages/settings/Security"));
const Billing = React.lazy(() => import("./pages/settings/Billing"));
const Locations = React.lazy(() => import("./pages/settings/Locations"));
const Team = React.lazy(() => import("./pages/settings/Team"));
const General = React.lazy(() => import("./pages/settings/General"));
const IntegrationTests = React.lazy(
  () => import("./pages/settings/IntegrationTests")
);
const PushNotifications = React.lazy(
  () => import("./pages/settings/PushNotifications")
);
const NotificationAnalytics = React.lazy(
  () => import("./pages/settings/NotificationAnalytics")
);
const Profile = React.lazy(() => import("./pages/settings/Profile"));
const SignIn = React.lazy(() => import("./pages/auth/SignIn")); // ✅ corrected typo
const Support = React.lazy(() => import("./pages/support/SupportPage"));
const Terms = React.lazy(() => import("./pages/terms/TermsPage"));
const PrivacyPolicy = React.lazy(
  () => import("./pages/privacy-policy/PrivacyPolicyPage")
);
const PatientForm = React.lazy(
  () => import("./pages/referral-management/PatientForm")
);
const CallTracking = React.lazy(
  () => import("./pages/call-tracking/CallTracking")
);
const ThankYou = React.lazy(
  () => import("./pages/referral-management/ThankYouPage")
);

// Route type
interface AppRoute {
  path?: string;
  element: ReactNode;
  index?: boolean;
  children?: AppRoute[];
}

function AppRoutes() {
  const routesList: AppRoute[] = [
    { path: "visit-map", element: <VisitMap /> },
    {
      path: "/",
      element: (
        // 2. Wrap the Layout element with the ProtectedRoute
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard /> },
        { path: "referrals", element: <ReferralManagement /> },
        { path: "analytics", element: <Analytics /> }, // ... (rest of the children routes remain the same) ...
        { path: "partner-network", element: <PartnerNetwork /> },
        { path: "reviews", element: <Reviews /> },
        { path: "email-campaigns", element: <EmailCampaign /> },
        { path: "social-media", element: <SocialMedia /> },
        { path: "marketing-calendar", element: <MarketingCalendar /> },
        { path: "qr-generator", element: <QrGenerator /> },
        { path: "marketing-budget", element: <MarketingBudget /> },
        { path: "reports", element: <Reports /> },
        { path: "tasks", element: <Tasks /> },
        { path: "media-management", element: <MediaManagement /> },
        { path: "integrations", element: <Integrations /> },
        { path: "helpcenter", element: <HelpCenter /> },
        { path: "call-tracking", element: <CallTracking /> },
        {
          path: "settings",
          element: <Settings />, // Note: Settings itself is protected by its parent Layout
          children: [
            // ... (rest of settings children) ...
            { index: true, element: <Profile /> },
            { path: "notifications", element: <Notifications /> },
            { path: "security", element: <Security /> },
            { path: "billing", element: <Billing /> },
            { path: "locations", element: <Locations /> },
            { path: "team", element: <Team /> },
            { path: "general", element: <General /> },
            { path: "integration-tests", element: <IntegrationTests /> },
            { path: "push-notifications", element: <PushNotifications /> },
            {
              path: "notification-analytics",
              element: <NotificationAnalytics />,
            },
          ],
        },
      ],
    },
    // Public Routes (not wrapped)
    { path: "signin", element: <SignIn /> },
    { path: "thank-you", element: <ThankYou /> },
    { path: "support", element: <Support /> },
    { path: "terms", element: <Terms /> },
    { path: "privacy", element: <PrivacyPolicy /> },
    {
      path: "/referral/",
      element: <PatientForm />,
      children: [{ path: ":id", element: <PatientForm /> }],
    },
  ];

  const renderRoutes = (routes: AppRoute[]): ReactNode =>
    routes.map((route, index) => {
      if ("index" in route && route.index) {
        return <Route key={index} index element={route.element} />;
      }
      return (
        <Route key={index} path={route.path} element={route.element}>
          {route.children && renderRoutes(route.children)}
        </Route>
      );
    });

  return (
    // <Suspense
    //   fallback={
    //     <div className="bg-background flex items-center justify-center p-4 min-h-screen">
    //       <FiLoader className="animate-spin size-10 text-primary" />
    //     </div>
    //   }
    // >
    <BrowserRouter basename="/referral-retrieve/">
      <Routes>{renderRoutes(routesList)}</Routes>
    </BrowserRouter>
    // </Suspense>
  );
}

export default AppRoutes;
