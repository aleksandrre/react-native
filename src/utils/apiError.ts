export type LocalizedMessage = {
  ka: string;
  en: string;
};

export type ApiError = {
  response?: {
    data?: {
      message?: string | LocalizedMessage;
    };
  };
};

export const extractApiError = (error: ApiError, lang: string): string | null => {
  const message = error?.response?.data?.message;
  if (!message) return null;

  if (typeof message === 'object') {
    return message[lang as keyof LocalizedMessage] ?? message.en ?? null;
  }

  return message;
};
