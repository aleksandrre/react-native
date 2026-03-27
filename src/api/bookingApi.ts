import { publicApi, privateApi } from './config';
import {
  Court,
  CreateBookingRequest,
  CreateBookingResponse,
  ApiBookingsResponse,
  LockSlotRequest,
  LockSlotResponse,
  ValidateCouponRequest,
  CouponValidationResponse,
} from '../types';

export const bookingApi = {
  getAvailableSlots: async (date: string): Promise<string[]> => {
    const response = await publicApi.get<string[]>('/available-slots', {
      params: { date },
    });
    return response.data;
  },

  getAvailableCourts: async (date: string, time: string): Promise<Court[]> => {
    const response = await publicApi.get<Court[]>('/available-courts', {
      params: { date, time },
    });
    return response.data;
  },

  createBookings: async (data: CreateBookingRequest): Promise<CreateBookingResponse> => {
    const response = await privateApi.post<CreateBookingResponse>('/bookings', data);
    return response.data;
  },

  getBookings: async (): Promise<ApiBookingsResponse> => {
    const response = await privateApi.get<ApiBookingsResponse>('/bookings');
    return response.data;
  },

  lockSlot: async (data: LockSlotRequest): Promise<LockSlotResponse> => {
    const response = await privateApi.post<LockSlotResponse>('/lock-slot', data);
    return response.data;
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    await privateApi.post(`/bookings/${bookingId}/cancel`);
  },

  unlockSlots: async (): Promise<void> => {
    await privateApi.post('/unlock-slots');
  },

  validateCoupon: async (data: ValidateCouponRequest): Promise<CouponValidationResponse> => {
    const response = await privateApi.post<CouponValidationResponse>(
      '/validate-coupon',
      data
    );
    return response.data;
  },

  rescheduleBooking: async (
    bookingId: string,
    data: { court_id: number; date: string; time: string; use_credit: boolean }
  ): Promise<{ message: string; booking_id: number }> => {
    const response = await privateApi.post<{ message: string; booking_id: number }>(
      `/bookings/${bookingId}/reschedule`,
      data
    );
    return response.data;
  },
};
