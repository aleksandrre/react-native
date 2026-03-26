import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { Booking, ApiBooking } from '../types';

const formatTime = (time: string): string => time.slice(0, 5); // "18:00:00" → "18:00"

const mapApiBooking = (b: ApiBooking): Booking & { id: string } => ({
  id: b.id,
  courtNumber: b.court_number,
  rawDate: b.booking_date,
  time: `${formatTime(b.start_time)} - ${formatTime(b.end_time)}`,
  price: parseFloat(b.price),
  cancelled: b.status === 'cancelled',
  rescheduled: b.status === 'rescheduled',
});

export const useBookings = (enabled: boolean) => {
  const query = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingApi.getBookings,
    enabled,
  });

  const upcoming = (query.data?.upcoming ?? []).map(mapApiBooking);
  const past = (query.data?.past ?? []).map(mapApiBooking);

  return {
    upcoming,
    past,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
