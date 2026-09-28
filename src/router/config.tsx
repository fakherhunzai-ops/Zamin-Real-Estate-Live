import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";
import NotFound from "../pages/NotFound";
import Home from "../pages/home/page";
import PropertiesPage from "../pages/properties/page";
import PropertyDetail from "../pages/property/page";
import SellPage from "../pages/sell/page";
import ServicesPage from "../pages/services/page";
import FaqPage from "../pages/faq/page";
import ContactPage from "../pages/contact/page";
import ValuationPage from "../pages/valuation/page";
import AboutPage from "../pages/about/page";
import BlogPage from "../pages/blog/page";
import ArticleDetailPage from "../pages/blog/detail/page";
import ToolsPage from "../pages/tools/page";
import MortgageCalculatorPage from "../pages/tools/mortgage-calculator/page";
import RentalYieldCalculatorPage from "../pages/tools/rental-yield-calculator/page";
import StampDutyCalculatorPage from "../pages/tools/stamp-duty-calculator/page";
import ShortlistPage from "../pages/shortlist/page";
import PrivacyPolicyPage from "../pages/legal/privacy/page";
import TermsOfServicePage from "../pages/legal/terms/page";
import StaysLandingPage from "../pages/stays/page";
import StaySlugResolver from "../pages/stays/SlugResolver";
import StaysHostPage from "../pages/stays/host/page";
import StaysHostApplyPage from "../pages/stays/host/apply/page";
import StaysManagedHostingPage from "../pages/stays/managed-hosting/page";
import BookingPage from "../pages/booking/page";
import AdminLoginPage from "../pages/admin/login/page";
import AdminStaysDashboardPage from "../pages/admin/dashboard/page";
import AdminStaysPage from "../pages/admin/stays/page";
import AdminStayNewPage from "../pages/admin/stays/new/page";
import AdminStayDetailPage from "../pages/admin/stays/detail/page";
import AdminStayEditPage from "../pages/admin/stays/edit/page";
import AdminStaysPendingPage from "../pages/admin/stays/pending/page";
import AdminBookingsPage from "../pages/admin/bookings/page";
import AdminBookingDetailPage from "../pages/admin/bookings/detail/page";
import AdminCalendarPage from "../pages/admin/calendar/page";
import AdminPricingPage from "../pages/admin/pricing/page";
import AdminHostsPage from "../pages/admin/hosts/page";
import AdminGuestsPage from "../pages/admin/guests/page";
import AdminPaymentsPage from "../pages/admin/payments/page";
import AdminPayoutsPage from "../pages/admin/payouts/page";
import AdminReviewsPage from "../pages/admin/reviews/page";
import AdminCleaningPage from "../pages/admin/operations/cleaning/page";
import AdminMaintenancePage from "../pages/admin/operations/maintenance/page";
import AdminDestinationsPage from "../pages/admin/content/destinations/page";
import AdminStayCategoriesPage from "../pages/admin/content/stay-categories/page";
import AdminStaysHomepagePage from "../pages/admin/content/stays-homepage/page";
import AdminAnalyticsPage from "../pages/admin/analytics/page";
import AdminPropertiesPage from "../pages/admin/properties/page";
import AdminPlaceholderPage from "../pages/admin/placeholder/page";
import AdminSettingsPage from "../pages/admin/settings/page";
import HostLoginPage from "../pages/host/login/page";
import HostDashboardPage from "../pages/host/dashboard/page";
import HostStaysPage from "../pages/host/stays/page";
import HostCalendarPage from "../pages/host/calendar/page";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/properties-for-sale",
    element: <PropertiesPage listingType="sale" />,
  },
  {
    path: "/properties-for-rent",
    element: <PropertiesPage listingType="rent" />,
  },
  {
    path: "/property/:id",
    element: <PropertyDetail />,
  },
  {
    path: "/sell-your-property",
    element: <SellPage />,
  },
  {
    path: "/services",
    element: <ServicesPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/faq",
    element: <FaqPage />,
  },
  {
    path: "/contact",
    element: <ContactPage />,
  },
  {
    path: "/valuation",
    element: <ValuationPage />,
  },
  {
    path: "/blog",
    element: <BlogPage />,
  },
  {
    path: "/blog/:slug",
    element: <ArticleDetailPage />,
  },
  {
    path: "/tools/mortgage-calculator",
    element: <MortgageCalculatorPage />,
  },
  {
    path: "/tools/rental-yield-calculator",
    element: <RentalYieldCalculatorPage />,
  },
  {
    path: "/tools/stamp-duty-calculator",
    element: <StampDutyCalculatorPage />,
  },
  {
    path: "/shortlist",
    element: <ShortlistPage />,
  },
  {
    path: "/privacy",
    element: <PrivacyPolicyPage />,
  },
  {
    path: "/terms",
    element: <TermsOfServicePage />,
  },
  {
    path: "/tools",
    element: <ToolsPage />,
  },
  {
    path: "/stays",
    element: <StaysLandingPage />,
  },
  {
    path: "/stays/host",
    element: <StaysHostPage />,
  },
  {
    path: "/stays/host/apply",
    element: <StaysHostApplyPage />,
  },
  {
    path: "/stays/managed-hosting",
    element: <StaysManagedHostingPage />,
  },
  {
    path: "/booking",
    element: <BookingPage />,
  },
  {
    path: "/booking/:reference",
    element: <BookingPage />,
  },
  {
    path: "/stays/:slug",
    element: <StaySlugResolver />,
  },
  {
    path: "/host",
    element: <Navigate to="/host/dashboard" replace />,
  },
  {
    path: "/host/login",
    element: <HostLoginPage />,
  },
  {
    path: "/host/dashboard",
    element: <HostDashboardPage />,
  },
  {
    path: "/host/stays",
    element: <HostStaysPage />,
  },
  {
    path: "/host/calendar",
    element: <HostCalendarPage />,
  },
  {
    path: "/admin",
    element: <Navigate to="/admin/stays-dashboard" replace />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/stays-dashboard",
    element: <AdminStaysDashboardPage />,
  },
  {
    path: "/admin/stays",
    element: <AdminStaysPage />,
  },
  {
    path: "/admin/stays/new",
    element: <AdminStayNewPage />,
  },
  {
    path: "/admin/stays/pending",
    element: <AdminStaysPendingPage />,
  },
  {
    path: "/admin/stays/:id/edit",
    element: <AdminStayEditPage />,
  },
  {
    path: "/admin/stays/:id",
    element: <AdminStayDetailPage />,
  },
  {
    path: "/admin/bookings",
    element: <AdminBookingsPage />,
  },
  {
    path: "/admin/bookings/:id",
    element: <AdminBookingDetailPage />,
  },
  {
    path: "/admin/calendar",
    element: <AdminCalendarPage />,
  },
  {
    path: "/admin/pricing",
    element: <AdminPricingPage />,
  },
  {
    path: "/admin/hosts",
    element: <AdminHostsPage />,
  },
  {
    path: "/admin/guests",
    element: <AdminGuestsPage />,
  },
  {
    path: "/admin/payments",
    element: <AdminPaymentsPage />,
  },
  {
    path: "/admin/payouts",
    element: <AdminPayoutsPage />,
  },
  {
    path: "/admin/reviews",
    element: <AdminReviewsPage />,
  },
  {
    path: "/admin/operations/cleaning",
    element: <AdminCleaningPage />,
  },
  {
    path: "/admin/operations/maintenance",
    element: <AdminMaintenancePage />,
  },
  {
    path: "/admin/content/stays-homepage",
    element: <AdminStaysHomepagePage />,
  },
  {
    path: "/admin/content/destinations",
    element: <AdminDestinationsPage />,
  },
  {
    path: "/admin/content/stay-categories",
    element: <AdminStayCategoriesPage />,
  },
  {
    path: "/admin/content/faqs",
    element: <AdminPlaceholderPage title="FAQs" subtitle="Frequently asked questions shown on ZAMIN Stays." icon="ri-question-answer-line" message="Manage the questions and answers shown across the ZAMIN Stays pages." />,
  },
  {
    path: "/admin/content/policies",
    element: <AdminPlaceholderPage title="Policies" subtitle="Cancellation, house and platform policies." icon="ri-file-shield-2-line" message="Publish the policies referenced by stays and bookings." />,
  },
  {
    path: "/admin/properties",
    element: <AdminPropertiesPage />,
  },
  {
    path: "/admin/enquiries",
    element: <AdminPlaceholderPage title="Enquiries" subtitle="Buyer and renter enquiries from the site." icon="ri-mail-line" message="Enquiries submitted through the real-estate forms appear here." />,
  },
  {
    path: "/admin/valuations",
    element: <AdminPlaceholderPage title="Valuations" subtitle="Property valuation requests." icon="ri-scales-3-line" message="Valuation requests submitted through the site appear here." />,
  },
  {
    path: "/admin/agents",
    element: <AdminPlaceholderPage title="Agents" subtitle="ZAMIN real-estate agents and teams." icon="ri-user-star-line" message="Manage the agents assigned to real-estate listings." />,
  },
  {
    path: "/admin/users",
    element: <AdminPlaceholderPage title="Users" subtitle="Admin users, roles and access." icon="ri-shield-user-line" message="Review the people who can access this admin panel." />,
  },
  {
    path: "/admin/media",
    element: <AdminPlaceholderPage title="Media Library" subtitle="Images and assets used across the site." icon="ri-gallery-line" message="Browse and manage the media used by stays and destinations." />,
  },
  {
    path: "/admin/stays-analytics",
    element: <AdminAnalyticsPage />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;