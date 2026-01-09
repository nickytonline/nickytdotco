import { CalendarPlus, Plus } from "lucide-react";
import {
  generateGoogleCalendarUrl,
  generateICalContent,
  generateOutlookUrl,
} from "../utils/date-utils.ts";

interface EventCalendarProps {
  eventName: string;
  eventDate: string;
  duration: number;
  description: string;
  location: string;
}

const EventCalendar = ({
  eventName,
  eventDate,
  duration,
  description,
  location,
}: EventCalendarProps) => {
  console.log(location);
  // the duration argument is in minutes and needs to be converted to milliseconds
  const durationInMillis = duration * 60 * 1000;

  // endDate is the startDate plus the duration in milliseconds
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);

  return (
    <nav className="relative group w-fit">
      <a
        href="#"
        className="flex gap-2 items-center rounded-md  bg-pink-600 text-white px-4 py-2 hover:bg-white border-2 border-pink-600 hover:border-pink-600"
      >
        <Plus className="w-4 h-4" />
        <span>Add to Calendar</span>
      </a>
      <div className="absolute invisible opacity-0 transition-all duration-300 transform -translate-y-1 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:translate-y-0 mt-2">
        <ul className="p-4 grid gap-4 border border-black [&_a]:whitespace-nowrap [&_a]:items-center [&_a]:p-1 bg-white">
          <li>
            <a
              href={generateGoogleCalendarUrl({
                eventName,
                startDate,
                endDate,
                location,
                description,
              })}
              target="_blank"
              className="flex items-center gap-2 focus-within:text-pink-600"
            >
              <CalendarPlus className="w-4 h-4" />
              Google Calendar
            </a>
          </li>
          <li>
            <a
              href={generateOutlookUrl({
                eventName,
                startDate,
                endDate,
                location,
                description,
              })}
              target="_blank"
              className="flex items-center gap-2 focus-within:text-pink-600"
            >
              <CalendarPlus className="w-4 h-4" />
              Outlook Calendar
            </a>
          </li>
          <li>
            <a
              href={generateICalContent({
                eventName,
                startDate,
                endDate,
                location,
                description,
              })}
              download="event.ics"
              className="flex items-center gap-2 focus-within:text-pink-600"
            >
              <CalendarPlus className="w-4 h-4" />
              iCal/Apple Calendar
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default EventCalendar;
