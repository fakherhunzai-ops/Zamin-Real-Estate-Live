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
import AdminBusinessOverviewPage from "../pages/admin/dashboard/page";
import AdminStaysOverviewPage from "../pages/admin/stays-dashboard/page";
import AdminContentOverviewPage from "../pages/admin/content/page";
import AdminSeoOverviewPage from "../pages/admin/seo/page";
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
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: "/admin/login",
    element: <AdminLoginPage />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminBusinessOverviewPage />,
  },
  {
    path: "/admin/stays-dashboard",
    element: <AdminStaysOverviewPage />,
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
    path: "/admin/content",
    element: <AdminContentOverviewPage />,
  },
  {
    path: "/admin/content/homepage",
    element: <AdminPlaceholderPage title="Homepage" subtitle="Homepage blocks and hero content." icon="ri-layout-top-line" message="Update the homepage hero, feature modules and conversion sections from this panel." />,
  },
  {
    path: "/admin/content/buy",
    element: <AdminPlaceholderPage title="Buy Page" subtitle="Buy page messaging and CTAs." icon="ri-home-gear-line" message="Control the buy-page description, funnel copy and lead generation sections." />,
  },
  {
    path: "/admin/content/rent",
    element: <AdminPlaceholderPage title="Rent Page" subtitle="Rental page CMS." icon="ri-home-smile-line" message="Edit the listing and conversion content for the rental market." />,
  },
  {
    path: "/admin/content/sell",
    element: <AdminPlaceholderPage title="Sell Page" subtitle="Seller-focused page content." icon="ri-money-dollar-circle-line" message="Manage the selling journey, value proposition and valuation CTA blocks." />,
  },
  {
    path: "/admin/content/about",
    element: <AdminPlaceholderPage title="About" subtitle="About ZAMIN brand and story." icon="ri-building-3-line" message="Edit the company story, mission and local credibility content." />,
  },
  {
    path: "/admin/content/services",
    element: <AdminPlaceholderPage title="Services" subtitle="Service offerings and packages." icon="ri-tools-fill" message="Add, edit and reorder the services presented to buyers, sellers and tenants." />,
  },
  {
    path: "/admin/content/contact",
    element: <AdminPlaceholderPage title="Contact" subtitle="Contact page details and business info." icon="ri-phone-line" message="Update the contact form, office details and map information used publicly." />,
  },
  {
    path: "/admin/content/location",
    element: <AdminPlaceholderPage title="Locations" subtitle="Locations and destination pages." icon="ri-map-pin-2-line" message="Add or update key ZAMIN areas, neighborhoods and SEO details." />,
  },
  {
    path: "/admin/content/locations",
    element: <AdminPlaceholderPage title="Locations" subtitle="Locations and destination pages." icon="ri-map-pin-2-line" message="Add or update key ZAMIN areas, neighborhoods and SEO details." />,
  },
  {
    path: "/admin/content/testimonials",
    element: <AdminPlaceholderPage title="Testimonials" subtitle="Customer reviews and trust content." icon="ri-chat-quote-line" message="Approve, reorder or deactivate testimonial content from the public site." />,
  },
  {
    path: "/admin/content/header",
    element: <AdminPlaceholderPage title="Header" subtitle="Global navigation and CTA controls." icon="ri-header-line" message="Manage the public navigation, branding link labels and top CTA values." />,
  },
  {
    path: "/admin/content/footer",
    element: <AdminPlaceholderPage title="Footer" subtitle="Footer blocks and legal links." icon="ri-article-line" message="Update footer sections and reusable site links." />,
  },
  {
    path: "/admin/content/ctas",
    element: <AdminPlaceholderPage title="CTAs" subtitle="Reusable conversion prompts and campaign blocks." icon="ri-links-line" message="Update the sitewide conversion prompts used across the public website." />,
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
    path: "/admin/properties/pending",
    element: <AdminPlaceholderPage title="Pending Listings" subtitle="Awaiting review and approval." icon="ri-time-line" message="Approve or request changes for listings pending publication." />,
  },
  {
    path: "/admin/properties/published",
    element: <AdminPlaceholderPage title="Published Listings" subtitle="Live properties on the public site." icon="ri-upload-cloud-2-line" message="Review live listings and update promotional content." />,
  },
  {
    path: "/admin/properties/sold",
    element: <AdminPlaceholderPage title="Sold Properties" subtitle="Completed real-estate transactions." icon="ri-checkbox-circle-line" message="Track sold listings and maintain transaction history." />,
  },
  {
    path: "/admin/properties/rented",
    element: <AdminPlaceholderPage title="Rented Properties" subtitle="Completed rental transactions." icon="ri-key-2-line" message="Manage rented inventory and tenancy lifecycle updates." />,
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
    element: <AdminPlaceholderPage title="Users" subtitle="Customers, owners, hosts and admins." icon="ri-shield-user-line" message="Review the users and roles connected to the ZAMIN portal." />,
  },
  {
    path: "/admin/users/customers",
    element: <AdminPlaceholderPage title="Customers" subtitle="Customer accounts and lead profiles." icon="ri-user-line" message="Manage customer accounts and engagement details." />,
  },
  {
    path: "/admin/users/owners",
    element: <AdminPlaceholderPage title="Property Owners" subtitle="Owner accounts and property access." icon="ri-home-2-line" message="Review owner profiles and portfolio access." />,
  },
  {
    path: "/admin/users/hosts",
    element: <AdminPlaceholderPage title="Hosts" subtitle="ZAMIN Stays host accounts." icon="ri-user-heart-line" message="Manage host onboarding, verification and communication." />,
  },
  {
    path: "/admin/users/agents",
    element: <AdminPlaceholderPage title="Agents" subtitle="Agent user accounts." icon="ri-user-star-line" message="Manage assigned agents and their access levels." />,
  },
  {
    path: "/admin/users/admin",
    element: <AdminPlaceholderPage title="Admin Users" subtitle="Internal admin access and permissions." icon="ri-shield-user-line" message="Maintain admin team roles and access controls." />,
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
    path: "/admin/seo",
    element: <AdminSeoOverviewPage />,
  },
  {
    path: "/admin/seo/page-metadata",
    element: <AdminPlaceholderPage title="Page Metadata" subtitle="SEO page titles and descriptions." icon="ri-file-text-line" message="Set metadata for pages, listings and landing pages." />,
  },
  {
    path: "/admin/seo/social",
    element: <AdminPlaceholderPage title="Social Sharing" subtitle="Open graph and social preview content." icon="ri-share-line" message="Manage title, description and images shown on social platforms." />,
  },
  {
    path: "/admin/seo/redirects",
    element: <AdminPlaceholderPage title="Redirects" subtitle="301 and 302 redirects." icon="ri-route-line" message="Create and manage URL redirects for retired or renamed pages." />,
  },
  {
    path: "/admin/seo/sitemap",
    element: <AdminPlaceholderPage title="Sitemap" subtitle="Site map and index configuration." icon="ri-map-2-line" message="Review and maintain sitemap and indexing settings." />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettingsPage />,
  },
  {
    path: "/admin/settings/general",
    element: <AdminPlaceholderPage title="General" subtitle="Core workspace and website settings." icon="ri-settings-2-line" message="Manage the general platform settings used across the site." />,
  },
  {
    path: "/admin/settings/company",
    element: <AdminPlaceholderPage title="Company" subtitle="Company information and legal profile." icon="ri-building-line" message="Update company details, overview and legal business information." />,
  },
  {
    path: "/admin/settings/branding",
    element: <AdminPlaceholderPage title="Branding" subtitle="Logos, colors and brand assets." icon="ri-palette-line" message="Manage logos, color tokens and brand visuals throughout the site." />,
  },
  {
    path: "/admin/settings/contact",
    element: <AdminPlaceholderPage title="Contact" subtitle="Phone, email and office details." icon="ri-phone-line" message="Keep the public contact info synchronized across the website and forms." />,
  },
  {
    path: "/admin/settings/social",
    element: <AdminPlaceholderPage title="Social" subtitle="Social channels and follow links." icon="ri-share-box-line" message="Manage social profile links and platform references." />,
  },
  {
    path: "/admin/settings/email",
    element: <AdminPlaceholderPage title="Email" subtitle="Email configuration and templates." icon="ri-mail-open-line" message="Manage automated email notifications and sender settings." />,
  },
  {
    path: "/admin/settings/notifications",
    element: <AdminPlaceholderPage title="Notifications" subtitle="Alerts, reminders and triggers." icon="ri-notification-3-line" message="Configure customer and internal notifications." />,
  },
  {
    path: "/admin/settings/payments",
    element: <AdminPlaceholderPage title="Payments" subtitle="Settlement and payment settings." icon="ri-bank-card-line" message="Manage payment configuration and reconciliation settings." />,
  },
  {
    path: "/admin/settings/maps",
    element: <AdminPlaceholderPage title="Maps" subtitle="Map and location configuration." icon="ri-map-pin-line" message="Manage location settings and embedded map content." />,
  },
  {
    path: "/admin/settings/integrations",
    element: <AdminPlaceholderPage title="Integrations" subtitle="Connected services and APIs." icon="ri-plug-line" message="Review integrations for CRM, email, maps and operations tools." />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;