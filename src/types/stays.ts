export type StayStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'VERIFIED'
  | 'PUBLISHED'
  | 'PAUSED'
  | 'ARCHIVED';

export type ManagementType = 'LISTED' | 'MANAGED';

export type StayDestination = {
  id: string;
  slug: string;
  name: string;
  region: string | null;
  tagline: string | null;
  description: string | null;
  hero_image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type StayArea = {
  id: string;
  destination_id: string;
  slug: string;
  name: string;
  sort_order: number;
};

export type StayCategory = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

export type StayAmenity = {
  id: string;
  slug: string;
  name: string;
  icon: string | null;
  category: string | null;
  sort_order: number;
};

export type StayImage = {
  id: string;
  stay_id: string;
  url: string;
  alt: string | null;
  is_cover: boolean;
  sort_order: number;
};

export type Stay = {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  description: string | null;
  category_id: string | null;
  management_type: ManagementType;
  destination_id: string | null;
  area_id: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  guest_capacity: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  base_nightly_rate: number;
  currency: string;
  cleaning_fee: number;
  service_fee_percent: number;
  check_in_time: string | null;
  check_out_time: string | null;
  cancellation_policy: string | null;
  house_rules: string | null;
  host_name: string | null;
  host_email: string | null;
  host_phone: string | null;
  status: StayStatus;
  verified: boolean;
  featured: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  // joined relations
  category?: StayCategory | null;
  destination?: StayDestination | null;
  area?: StayArea | null;
  images?: StayImage[];
  amenity_links?: { amenity: StayAmenity | null }[];
};

export type StayRateRuleType = 'DATE_RANGE' | 'WEEKEND' | 'SEASONAL' | 'PEAK';

export type StayRateRule = {
  id: string;
  stay_id: string;
  label: string;
  rule_type: StayRateRuleType;
  start_date: string | null;
  end_date: string | null;
  nightly_rate: number;
  min_nights: number;
  priority: number;
  is_active: boolean;
  created_at: string;
};

export type StayBlockReason = 'BLOCKED' | 'MAINTENANCE' | 'OWNER_STAY';

export type StayAvailabilityBlock = {
  id: string;
  stay_id: string;
  start_date: string;
  end_date: string;
  reason: StayBlockReason;
  note: string | null;
  created_by: string | null;
  created_at: string;
};

export type BookingStatus =
  | 'PENDING'
  | 'AWAITING_PAYMENT'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'REFUNDED';

export type Booking = {
  id: string;
  reference: string;
  stay_id: string;
  guest_name: string;
  guest_email: string | null;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  discount: number;
  total: number;
  currency: string;
  status: BookingStatus;
  source: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  stay?: {
    id: string;
    title: string;
    slug: string;
    destination?: { name: string } | null;
    area?: { name: string } | null;
  } | null;
};

export type StayQuote = {
  available: boolean;
  reason: string | null;
  nights: number;
  nightly_subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  service_fee_percent: number;
  discount: number;
  discount_percent: number;
  total: number;
  currency: string;
  guest_capacity?: number;
  breakdown?: { date: string; rate: number }[];
};

export type StayCalendar = {
  blocks: { start: string; end: string; reason: string }[];
  booked: { start: string; end: string }[];
};

export type StaySettings = {
  id: number;
  default_service_fee_percent: number;
  long_stay_discount_percent: number;
  long_stay_min_nights: number;
  default_currency: string;
  default_commission_percent: number;
  default_cleaning_fee: number;
  min_booking_notice_days: number;
  max_advance_booking_days: number;
  default_check_in_time: string;
  default_check_out_time: string;
  cancellation_policy: string | null;
  support_email: string | null;
  support_phone: string | null;
  support_whatsapp: string | null;
  notifications: Record<string, boolean>;
  updated_at: string;
};

export type BookingConfirmation = {
  found: boolean;
  reference: string;
  status: BookingStatus;
  guest_name: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  subtotal: number;
  cleaning_fee: number;
  service_fee: number;
  discount: number;
  total: number;
  currency: string;
  created_at: string;
  stay_title: string | null;
  stay_slug: string | null;
  destination: string | null;
  area: string | null;
};

export type HostStatus = 'ACTIVE' | 'SUSPENDED';

export type Host = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  status: HostStatus;
  notes: string | null;
  created_at: string;
};

export type ReviewStatus = 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';

export type StayReview = {
  id: string;
  stay_id: string;
  booking_id: string | null;
  guest_name: string;
  guest_email: string | null;
  rating: number;
  comment: string | null;
  status: ReviewStatus;
  created_at: string;
  updated_at: string;
  stay?: { id: string; title: string; slug: string } | null;
};

export type CleaningStatus = 'TO_DO' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'ISSUE';

export type CleaningTaskRecord = {
  id: string;
  stay_id: string;
  booking_id: string | null;
  assigned_to: string | null;
  status: CleaningStatus;
  scheduled_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  stay?: { id: string; title: string; slug: string } | null;
};

export type MaintenancePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type MaintenanceStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

export type MaintenanceIssue = {
  id: string;
  stay_id: string;
  title: string;
  description: string | null;
  priority: MaintenancePriority;
  assigned_to: string | null;
  cost: number;
  status: MaintenanceStatus;
  reported_date: string;
  resolved_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  stay?: { id: string; title: string; slug: string } | null;
};