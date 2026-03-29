import { useMutation } from '@tanstack/react-query';
import { bookingApi } from '../api/bookingApi';
import { ValidateCouponRequest } from '../types';

export const useValidateCoupon = () =>
  useMutation({
    mutationFn: (data: ValidateCouponRequest) => bookingApi.validateCoupon(data),
  });
