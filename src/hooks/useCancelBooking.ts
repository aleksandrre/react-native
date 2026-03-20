import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuthStore } from '../store/authStore';

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const refreshCredits = useAuthStore((s) => s.refreshCredits);

  return useMutation({
    mutationFn: (bookingId: string) => bookingApi.cancelBooking(bookingId),
    onSuccess: () => {
      refreshCredits();
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
