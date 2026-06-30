export const formatDateForApi = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Hours 00:00–07:59 are overnight slots that visually belong to the next calendar day.
const DISPLAY_CUTOFF_HOUR = 8;

export const getDisplayDate = (baseDate: Date, time: string): Date => {
  const hour = parseInt(time.split(':')[0], 10);
  const result = new Date(baseDate);
  if (!Number.isNaN(hour) && hour < DISPLAY_CUTOFF_HOUR) {
    result.setDate(result.getDate() + 1);
  }
  return result;
};
