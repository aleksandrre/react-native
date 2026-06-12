import { TimeSlot } from '../types';

/** True when no time slot has status "available" (all courts booked or inactive). */
export const isDateFullyBooked = (slots: TimeSlot[]): boolean =>
  !slots.some((slot) => slot.status === 'available');
