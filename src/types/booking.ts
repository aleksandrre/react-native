export interface Court {
  id: number;
  title: string;
  price: string;
}

export interface Booking {
  courtNumber: string;
  date: string;
  time: string;
  cancelled?: boolean;
  rescheduled?: boolean;
}

export interface BookingItem {
  court_id: number;
  date: string;
  time: string;
}

export interface CreateBookingRequest {
  use_credit: boolean;
  bookings: BookingItem[];
}

export interface CreateBookingResponse {
  id: number;
  [key: string]: unknown;
}

