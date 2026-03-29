import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { InitiatePaymentRequest, InitiatePaymentResponse } from '../types';

export const useInitiatePayment = () => {
  return useMutation<InitiatePaymentResponse, Error, InitiatePaymentRequest>({
    mutationFn: (data: InitiatePaymentRequest) => bookingApi.initiatePayment(data),
  });
};
