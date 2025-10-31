import React, { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import QrGenerator from "./pages/qr-generator/QrGenerator";

// Lazy imports
const ProtectedRoute = React.lazy(() => import("./auth/ProtectedRoute"));
const Layout = React.lazy(() => import("./components/layout/Layout"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Calls = React.lazy(() => import("./pages/Calls"));
const HelpCenter = React.lazy(() => import("./pages/HelpCenter"));
const EmailCampaign = React.lazy(() => import("./pages/EmailCampaigns"));
const MarketingBudget = React.lazy(() => import("./pages/MarketingBudget"));
const MarketingCalendar = React.lazy(() => import("./pages/MarketingCalendar"));
const ReferralManagement = React.lazy(
  () => import("./pages/referral-management/ReferralManagement")
);
const PartnerNetwork = React.lazy(
  () => import("./pages/partner-network/PartnerNetwork")
);
const Reviews = React.lazy(() => import("./pages/reviews/Reviews"));
const SocialMedia = React.lazy(() => import("./pages/SocialMedia"));
const Reports = React.lazy(() => import("./pages/Reports"));
const Calender = React.lazy(() => import("./pages/Calender"));
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
const PlansPage = React.lazy(() => import("./pages/plans/PlansPage"));
const SignIn = React.lazy(() => import("./auth/SignIn")); // ✅ corrected typo
const SignUp = React.lazy(() => import("./auth/SignUp"));
const Success = React.lazy(() => import("./payment/Success"));
const Fail = React.lazy(() => import("./payment/Fail"));
const Support = React.lazy(() => import("./pages/support/SupportPage"));
const Terms = React.lazy(() => import("./pages/terms/TermsPage"));
const PrivacyPolicy = React.lazy(
  () => import("./pages/privacy-policy/PrivacyPolicyPage")
);
const PatientForm = React.lazy(
  () => import("./pages/partner-network/form/PatientForm")
);
const CallTracking = React.lazy(() => import("./pages/call-tracking/CallTracking"));
const ThankYou = React.lazy(() => import("./pages/partner-network/form/ThankYouPage"));


// Route type
interface AppRoute {
  path?: string;
  element: ReactNode;
  index?: boolean;
  children?: AppRoute[];
}

function AppRoutes() {
  const routesList: AppRoute[] = [
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "referrals", element: <ReferralManagement /> },
        { path: "analytics", element: <Analytics /> },
        { path: "partner-network", element: <PartnerNetwork /> },
        { path: "calls", element: <Calls /> },
        { path: "reviews", element: <Reviews /> },
        { path: "email-campaigns", element: <EmailCampaign /> },
        { path: "social-media", element: <SocialMedia /> },
        { path: "marketing-calendar", element: <MarketingCalendar /> },
        { path: "qr-generator", element: <QrGenerator /> },
        { path: "marketing-budget", element: <MarketingBudget /> },
        { path: "reports", element: <Reports /> },
        { path: "social", element: <SocialMedia /> },
        { path: "calender", element: <Calender /> },
        { path: "helpcenter", element: <HelpCenter /> },
        { path: "call-tracking", element: <CallTracking /> },
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
            {
              path: "notification-analytics",
              element: <NotificationAnalytics />,
            },
          ],
        },
      ],
    },
    {
      path: "plans",
      element: <ProtectedRoute component={PlansPage} role="admin" />,
    },
    { path: "signin", element: <SignIn /> },
    { path: "signin", element: <SignIn /> },
    { path: "thank-you", element: <ThankYou /> },
    { path: "success", element: <Success /> },
    { path: "fail", element: <Fail /> },
    { path: "support", element: <Support /> },
    { path: "terms", element: <Terms /> },
    { path: "privacy", element: <PrivacyPolicy /> },
    {
      path: "/referral/", element: <PatientForm />, children: [
        { path: ":id", element: <PatientForm /> }
      ]
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
    //     <Spinner
    //       label="Loading..."
    //       variant="gradient"
    //       color="success"
    //       className="w-screen h-screen"
    //     />
    //   }
    // >
    <BrowserRouter basename="/referral-retrieve">
      <Routes>{renderRoutes(routesList)}</Routes>
    </BrowserRouter>
    // </Suspense>
  );
}

export default AppRoutes;
