export interface Booking {
  courtNumber: string;
  date: string;
  time: string;
  cancelled?: boolean;
  rescheduled?: boolean;
}

