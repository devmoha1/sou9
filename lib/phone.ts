export function normalizeMauritaniaPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("222")) return digits;
  return `222${digits}`;
}