import { publicApi } from './config';

export const bookingApi = {
  getAvailableSlots: async (date: string): Promise<string[]> => {
    const response = await publicApi.get<string[]>('/available-slots', {
      params: { date },
    });
    return response.data;
  },
};
