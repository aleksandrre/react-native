import { useQueries } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { Court } from '../types';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useAvailableCourts = (date: Date, selectedSlots: string[]) => {
  const dateString = formatDate(date);

  const results = useQueries({
    queries: selectedSlots.map((time) => ({
      queryKey: ['availableCourts', dateString, time],
      queryFn: () => bookingApi.getAvailableCourts(dateString, time),
      enabled: selectedSlots.length > 0,
    })),
  });

  const courtsBySlot: Record<string, Court[]> = {};
  selectedSlots.forEach((time, index) => {
    courtsBySlot[time] = results[index]?.data ?? [];
  });

  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return { courtsBySlot, isLoading, isError };
};
