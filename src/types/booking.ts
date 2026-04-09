export interface TimeSlot {
  time: string;
  status: 'available' | 'full' | 'inactive';
}

export interface Court {
  id: number;
  court_number: string;
  price: string;
  status?: 'active' | 'inactive';
  reason?: string;
}

export interface Booking {
  courtNumber: string;
  rawDate: string; // ISO "YYYY-MM-DD"
  time: string;
  price?: number;
  cancelled?: boolean;
  rescheduled?: boolean;
}

export interface BookingItem {
  court_id: number;
  date: string;
  time: string;
}

export interface CreateBookingRequest {
  coupon_code?: string;
  bookings: BookingItem[];
}

export interface CreateBookingResponse {
  message: string;
  booking_ids?: number[];
  booking_id?: number;
  [key: string]: unknown;
}

export interface InitiatePaymentRequest {
  name: string;
  email: string;
  phone: string;
  coupon_code?: string;
  use_partial_credits?: boolean;
  bookings: BookingItem[];
}

export interface InitiatePaymentResponse {
  redirect_url: string;
}

export interface ApiBooking {
  id: string;
  court_id: string;
  user_id: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  price: string;
  status: string;
  created_at: string;
  court_number: string;
}

export interface ApiBookingsResponse {
  upcoming: ApiBooking[];
  past: ApiBooking[];
}

export interface CouponBookingItem {
  court_id: number;
  time: string;
}

export interface ValidateCouponRequest {
  coupon_code: string;
  bookings: CouponBookingItem[];
}

export interface CouponValidationResponse {
  success: boolean;
  code?: string;
  discount_type?: string;
  amount?: number;
  subtotal?: number;
  discount?: number;
  total?: number;
  message?: string;
}

export interface LockSlotRequest {
  court_id: number;
  date: string;
  time: string;
}

export interface LockSlotResponse {
  success: boolean;
  expires_at?: string;
}

