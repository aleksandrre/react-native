import { useQuery } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useAvailableSlots = (date: Date) => {
  const dateString = formatDate(date);

  return useQuery({
    queryKey: ['availableSlots', dateString],
    queryFn: () => bookingApi.getAvailableSlots(dateString),
  });
};
