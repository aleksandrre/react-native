import { useQuery } from '@tanstack/react-query';
import { format, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';
import { bookingApi } from '../api/bookingApi';
import { useDateLocale } from './useDateLocale';
import { Booking, ApiBooking } from '../types';

const formatTime = (time: string): string => time.slice(0, 5); // "18:00:00" → "18:00"

const extractCourtNumber = (courtTitle: string): string => {
  const match = courtTitle.match(/\d+/);
  return match ? match[0] : courtTitle;
};

const mapApiBooking = (b: ApiBooking, locale: Locale): Booking & { id: string } => ({
  id: b.id,
  courtNumber: extractCourtNumber(b.court_title),
  date: format(parseISO(b.booking_date), 'EEE, d MMM yyyy', { locale }),
  time: `${formatTime(b.start_time)} - ${formatTime(b.end_time)}`,
  cancelled: b.status === 'cancelled',
  rescheduled: b.status === 'rescheduled',
});

export const useBookings = (enabled: boolean) => {
  const locale = useDateLocale();

  const query = useQuery({
    queryKey: ['bookings'],
    queryFn: bookingApi.getBookings,
    enabled,
  });

  const upcoming = (query.data?.upcoming ?? []).map((b) => mapApiBooking(b, locale));
  const past = (query.data?.past ?? []).map((b) => mapApiBooking(b, locale));

  return {
    upcoming,
    past,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
};
