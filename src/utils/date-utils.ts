interface EventInfo {
  eventName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  description: string;
}

/**
 * Format date for iCal
 *
 * @param date
 * @returns an ISO date string
 */
export function formatDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

/**
 * Generate Google Calendar URL
 *
 * @param param0
 * @param param0.eventName - the name of the event
 * @param param0.startDate - the start date of the event
 * @param param0.endDate - the end date of the event
 * @param param0.location - the location of the event
 * @param param0.description - the description of the event
 *
 * @returns a URL string
 */
export function generateGoogleCalendarUrl({
  eventName,
  startDate,
  endDate,
  location,
  description,
}: EventInfo) {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventName,
    dates: `${formatDate(startDate)}/${formatDate(endDate)}`,
    details: description,
    location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generate an Outlook Calendar URL
 *
 * @param param0
 * @param param0.eventName - the name of the event
 * @param param0.startDate - the start date of the event
 * @param param0.endDate - the end date of the event
 * @param param0.location - the location of the event
 * @param param0.description - the description of the event
 *
 * @returns a URL string
 */
export function generateOutlookUrl({
  eventName,
  startDate,
  endDate,
  location,
  description,
}: EventInfo) {
  const params = new URLSearchParams({
    subject: eventName,
    startdt: startDate.toISOString(),
    enddt: endDate.toISOString(),
    body: description,
    location,
  });

  return `https://outlook.office.com/calendar/0/deeplink/compose?${params.toString()}`;
}

// Generate iCal/Apple Calendar content
export function generateICalContent({
  eventName,
  startDate,
  endDate,
  location,
  description,
}: EventInfo) {
  const content = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTART:${formatDate(startDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${eventName}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(content)}`;
}
