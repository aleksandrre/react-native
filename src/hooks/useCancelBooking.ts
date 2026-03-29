import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { useAuthStore } from '../store/authStore';

export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId }: { bookingId: string; price?: number }) =>
      bookingApi.cancelBooking(bookingId),
    onSuccess: (_, { price }) => {
      const { user, updateUser } = useAuthStore.getState();
      if (user && price != null) {
        updateUser({ ...user, credits: user.credits + price });
      }
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};
