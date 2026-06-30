import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { Court } from '../types';
import { formatDateForApi } from '../utils/date';

export const useAvailableCourts = (date: Date, selectedSlots: string[]) => {
  const dateString = formatDateForApi(date);
  const results = useQueries({
    queries: selectedSlots.map((time) => {
      return {
        queryKey: ['availableCourts', dateString, time],
        queryFn: () => bookingApi.getAvailableCourts(dateString, time),
        enabled: selectedSlots.length > 0,
      };
    }),
  });

  const courtsBySlot: Record<string, Court[]> = {};
  selectedSlots.forEach((time, index) => {
    courtsBySlot[time] = results[index]?.data ?? [];
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return { courtsBySlot, isLoading, isError };
};
