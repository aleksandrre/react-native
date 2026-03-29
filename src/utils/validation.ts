/** Display name: Latin letters, spaces, hyphen, apostrophe — no Georgian or other scripts. */
export const isValidLatinDisplayName = (name: string): boolean => {
  const s = name.trim();
  if (s.length === 0) return false;
  return /^[a-zA-Z\s'-]+$/.test(s) && /[a-zA-Z]/.test(s);
};

/** Local part + domain in ASCII (Latin letters, digits, common email symbols only). */
export const isValidEmail = (email: string): boolean => {
  const s = email.trim();
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(s);
};

/** Only phone formatting chars; 7–15 digits (E.164-friendly length). No letters. */
export const isValidPhone = (phone: string): boolean => {
  const s = phone.trim();
  if (!/^\+?[\d\s().-]+$/.test(s)) return false;
  const digits = s.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6 && /\d/.test(password);
};
