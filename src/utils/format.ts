import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

export function normalize(data: string) {
  return data.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

export function date(
  date: string | Date,
  format: string,
  localTime: boolean = false
) {
  return dayjs(date).utc(localTime).format(format);
}

export function normalizeEmail(data: string) {
  return data.toLowerCase();
}

export function normalizePhone(data: string) {
  return data?.replace(/[^0-9]/g, "");
}

export function formatPhone(data: string) {
  const DDD = data.split("").slice(0, 2).join("");
  const firstPart = data.slice(2, 7);
  const secondPart = data.slice(7);
  return `(${DDD}) ${firstPart}-${secondPart}`;
}

export function formatCPF(data: string) {
  const firstPart = data.slice(0, 3);
  const secondPart = data.slice(3, 6);
  const thirdPart = data.slice(6, 9);
  const fourthPart = data.slice(9);
  return `${firstPart}.${secondPart}.${thirdPart}-${fourthPart}`;
}

export function formatCEP(data: string) {
  const firstPart = data.slice(0, 5);
  const secondPart = data.slice(5);
  return `${firstPart}-${secondPart}`;
}

export function toProperCase(input: string): string | undefined {
  if (!input) return;
  return input
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function maskEmail(email: string) {
  let [username, domain] = email.split("@");

  if (!domain || !username) throw "Invalid email";

  let [domainName, domainExtension] = domain.split(".");

  if (!domainName || !domainExtension) throw "Invalid email";

  let maskedUsername = username.slice(0, 3) + "*".repeat(username.length - 3);

  let maskedDomainName =
    domainName.slice(0, 3) + "*".repeat(domainName.length - 3);

  return `${maskedUsername}@${maskedDomainName}.${domainExtension}`;
}
