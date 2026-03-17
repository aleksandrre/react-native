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

export interface CreateBookingRequest {
  court_id: number;
  date: string;
  time: string;
  use_credit: boolean;
}

export interface CreateBookingResponse {
  id: number;
  [key: string]: unknown;
}

