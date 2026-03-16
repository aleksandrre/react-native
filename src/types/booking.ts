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

