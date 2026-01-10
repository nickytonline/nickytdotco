import { CalendarPlus, Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
  const [dropdownPosition, setDropdownPosition] = useState<"below" | "above">(
    "below",
  );
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const checkPosition = () => {
      if (navRef.current) {
        const rect = navRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const menuHeight = 250; // Approximate height of the dropdown menu

        if (spaceBelow < menuHeight && rect.top > menuHeight) {
          setDropdownPosition("above");
        } else {
          setDropdownPosition("below");
        }
      }
    };

    checkPosition();
    window.addEventListener("scroll", checkPosition);
    window.addEventListener("resize", checkPosition);

    return () => {
      window.removeEventListener("scroll", checkPosition);
      window.removeEventListener("resize", checkPosition);
    };
  }, []);

  // the duration argument is in minutes and needs to be converted to milliseconds
  const durationInMillis = duration * 60 * 1000;

  // endDate is the startDate plus the duration in milliseconds
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);

  return (
    <nav ref={navRef} className="relative group w-fit">
      <a
        href="#"
        className="flex gap-2 items-center rounded-md bg-pink-600 text-white px-4 py-2 hover:bg-white hover:text-pink-600 border-2 border-pink-600 hover:border-pink-600 transition-colors focus:outline-none"
      >
        <Plus className="w-4 h-4" />
        <span>Add to Calendar</span>
      </a>
      <div
        className={`absolute invisible opacity-0 scale-95 transition-all duration-200 ease-out transform group-hover:visible group-hover:opacity-100 group-hover:scale-100 group-focus-within:visible group-focus-within:opacity-100 group-focus-within:scale-100 z-50 ${
          dropdownPosition === "above"
            ? "bottom-full mb-2 translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0"
            : "mt-2 -translate-y-1 group-hover:translate-y-0 group-focus-within:translate-y-0"
        }`}
      >
        <ul className="p-4 grid gap-4 border-2 border-pink-600 rounded-md [&_a]:whitespace-nowrap [&_a]:items-center [&_a]:p-1 bg-white shadow-lg">
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
              className="flex items-center gap-2 hover:text-pink-600 focus-within:text-pink-600 transition-colors focus:outline-none"
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
              className="flex items-center gap-2 hover:text-pink-600 focus-within:text-pink-600 transition-colors focus:outline-none"
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
              className="flex items-center gap-2 hover:text-pink-600 focus-within:text-pink-600 transition-colors focus:outline-none"
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
