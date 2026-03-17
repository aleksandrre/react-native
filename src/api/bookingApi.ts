import { publicApi, privateApi } from './config';
import { Court, CreateBookingRequest, CreateBookingResponse } from '../types';

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
};
