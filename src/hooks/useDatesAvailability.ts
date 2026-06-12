import { useMemo } from 'react';
import { useQueries } from '@tanstack/react-query';
import { isBefore } from 'date-fns';
import { bookingApi } from '../api/bookingApi';
import { formatDateForApi } from '../utils/date';
import { isDateFullyBooked } from '../utils/booking';

export const useDatesAvailability = (dates: Date[], today: Date) => {
  const futureDates = useMemo(
    () => dates.filter((date) => !isBefore(date, today)),
    [dates, today],
  );

  const results = useQueries({
    queries: futureDates.map((date) => {
      const dateString = formatDateForApi(date);
      return {
        queryKey: ['availableSlots', dateString],
        queryFn: () => bookingApi.getAvailableSlots(dateString),
      };
    }),
  });

  const fullyBookedDateKeys = useMemo(() => {
    const keys = new Set<string>();
    futureDates.forEach((date, index) => {
      const result = results[index];
      if (result?.isSuccess && result.data && isDateFullyBooked(result.data)) {
        keys.add(formatDateForApi(date));
      }
    });
    return keys;
  }, [futureDates, results]);

  const isLoading = results.some((r) => r.isLoading);

  return { fullyBookedDateKeys, isLoading };
};
