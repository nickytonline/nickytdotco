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
  const checkboxRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const id = useId();
  const menuId = `${id}-menu`;
  const toggleId = `${id}-toggle`;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && checkboxRef.current?.checked) {
        checkboxRef.current.checked = false;
        setIsExpanded(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node) &&
        checkboxRef.current?.checked
      ) {
        checkboxRef.current.checked = false;
        setIsExpanded(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // the duration argument is in minutes and needs to be converted to milliseconds
  const durationInMillis = duration * 60 * 1000;

  // endDate is the startDate plus the duration in milliseconds
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);

  return (
    <div ref={containerRef} className="relative group w-fit">
      <input
        ref={checkboxRef}
        type="checkbox"
        id={toggleId}
        className="peer sr-only"
        aria-controls={menuId}
        aria-expanded={isExpanded}
        aria-label={`Add ${eventName} to calendar`}
        onChange={(e) => setIsExpanded(e.target.checked)}
      />
      <label
        htmlFor={toggleId}
        className="flex gap-2 items-center rounded-md bg-pink-600 text-white px-4 py-2 hover:bg-white dark:hover:bg-gray-900 hover:text-pink-600 dark:hover:text-pink-400 peer-focus:bg-white dark:peer-focus:bg-gray-900 peer-focus:text-pink-600 dark:peer-focus:text-pink-400 border-2 border-pink-600 dark:border-pink-500 hover:border-pink-600 dark:hover:border-pink-500 peer-focus:border-pink-600 dark:peer-focus:border-pink-500 transition-colors cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Add to Calendar</span>
      </label>
      <div
        id={menuId}
        className="absolute right-0 invisible opacity-0 scale-95 transition-all duration-200 ease-out transform group-hover:visible group-hover:opacity-100 group-hover:scale-100 peer-checked:visible peer-checked:opacity-100 peer-checked:scale-100 z-50 mt-2 -translate-y-1 group-hover:translate-y-0 peer-checked:translate-y-0"
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
