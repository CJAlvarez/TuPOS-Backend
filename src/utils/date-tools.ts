// import { utcToZonedTime, format } from 'date-fns-tz';

// /**
//  * Timezone constant for all date operations in the project.
//  */
// export const TEGUCIGALPA_TZ = 'America/Tegucigalpa';

// /**
//  * Returns the current date/time in the Tegucigalpa timezone.
//  */
// export function nowTegucigalpa(): Date {
//   return utcToZonedTime(new Date(), TEGUCIGALPA_TZ);
// }

// /**
//  * Converts a given date to the Tegucigalpa timezone.
//  * @param date Date or string to convert
//  * @returns Date object in Tegucigalpa timezone
//  */
// export function toTegucigalpa(date: Date | string): Date {
//   return utcToZonedTime(new Date(date), TEGUCIGALPA_TZ);
// }

// /**
//  * Formats a date in Tegucigalpa timezone as string.
//  * @param date Date or string to format
//  * @param fmt Format string (default: 'yyyy-MM-dd HH:mm:ssXXX')
//  * @returns Formatted date string
//  */
// export function formatTegucigalpa(date: Date | string, fmt = 'yyyy-MM-dd HH:mm:ssXXX'): string {
//   return format(utcToZonedTime(new Date(date), TEGUCIGALPA_TZ), fmt, { timeZone: TEGUCIGALPA_TZ });
// }
