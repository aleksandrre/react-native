import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuthStore } from '../store/authStore';

interface RescheduleParams {
  bookingId: string;
  court_id: number;
  date: string;
  time: string;
  use_credit: boolean;
}

export const useRescheduleBooking = () => {
  const queryClient = useQueryClient();
  const refreshCredits = useAuthStore((s) => s.refreshCredits);

  return useMutation({
    mutationFn: ({ bookingId, ...data }: RescheduleParams) =>
      bookingApi.rescheduleBooking(bookingId, data),
    onSuccess: () => {
      refreshCredits();
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
