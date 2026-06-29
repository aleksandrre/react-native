const OPENING_HOUR = 8;

export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/** Slots before opening hour (00:00–07:59) belong to the next calendar day. */
export const isOvernightSlot = (time: string): boolean => {
  const hour = parseInt(time.split(':')[0], 10);
  return !Number.isNaN(hour) && hour < OPENING_HOUR;
};

export const getDateForApiSlot = (date: Date, time: string): string => {
  const apiDate = new Date(date);
  if (isOvernightSlot(time)) {
    apiDate.setDate(apiDate.getDate() + 1);
  }
  return formatDateForApi(apiDate);
};
