import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { CreateBookingRequest, CreateBookingResponse } from '../types';

export const useCreateBooking = () => {
  return useMutation<CreateBookingResponse[], Error, CreateBookingRequest[]>({
    mutationFn: (bookings: CreateBookingRequest[]) =>
      Promise.all(bookings.map((booking) => bookingApi.createBooking(booking))),
  });
};
