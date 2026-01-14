import { CalendarPlus, Plus } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const id = useId();
  const menuId = `${id}-menu`;
  const toggleId = `${id}-toggle`;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        isExpanded
      ) {
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isExpanded]);

  // the duration argument is in minutes and needs to be converted to milliseconds
  const durationInMillis = duration * 60 * 1000;

  // endDate is the startDate plus the duration in milliseconds
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);

  return (
    <div ref={containerRef} className="relative w-fit">
      <button
        type="button"
        id={toggleId}
        aria-haspopup="menu"
        aria-controls={menuId}
        aria-expanded={isExpanded}
        aria-label={`Add ${eventName} to calendar`}
        onClick={() => setIsExpanded((prev) => !prev)}
        className="flex gap-2 items-center rounded-md bg-pink-600 text-white px-4 py-2 hover:bg-white dark:hover:bg-gray-900 hover:text-pink-600 dark:hover:text-pink-400 focus-visible:bg-white dark:focus-visible:bg-gray-900 focus-visible:text-pink-600 dark:focus-visible:text-pink-400 border-2 border-pink-600 dark:border-pink-500 hover:border-pink-600 dark:hover:border-pink-500 focus-visible:border-pink-600 dark:focus-visible:border-pink-500 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add to Calendar</span>
      </button>
      <div
        id={menuId}
        role="menu"
        aria-labelledby={toggleId}
        className={`absolute right-0 z-50 mt-2 transform transition-all duration-200 ease-out ${
          isExpanded
            ? "visible opacity-100 scale-100 translate-y-0"
            : "invisible opacity-0 scale-95 -translate-y-1"
        }`}
      >
        <ul className="p-4 grid gap-4 border-2 border-pink-600 rounded-md [&_a]:whitespace-nowrap [&_a]:items-center [&_a]:p-1 bg-white dark:bg-gray-900 shadow-lg">
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
              role="menuitem"
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400 focus-within:text-pink-600 dark:focus-within:text-pink-400 transition-colors focus:outline-none"
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
              role="menuitem"
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400 focus-within:text-pink-600 dark:focus-within:text-pink-400 transition-colors focus:outline-none"
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
              role="menuitem"
              className="flex items-center gap-2 text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-400 focus-within:text-pink-600 dark:focus-within:text-pink-400 transition-colors focus:outline-none"
            >
              <CalendarPlus className="w-4 h-4" />
              iCal/Apple Calendar
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default EventCalendar;
