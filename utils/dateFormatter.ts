/**
 * Formats a JavaScript Date object into a string suitable for iCalendar (.ics files).
 * @param {Date} date - The date to format.
 * @returns {string} - The formatted date string.
 */
export const formatICSDate = (date: Date): string => {
    const pad = (number: number): string => (number < 10 ? '0' + number : number.toString());
  
    const year = date.getUTCFullYear();
    const month = pad(date.getUTCMonth() + 1); // Months are 0-indexed in JS
    const day = pad(date.getUTCDate());
    const hours = pad(date.getUTCHours());
    const minutes = pad(date.getUTCMinutes());
    const seconds = pad(date.getUTCSeconds());
  
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
  };
  