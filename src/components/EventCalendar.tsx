import { CalendarPlus, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "./Button";
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
  const [isExpanded, setIsExpanded] = useState(false);

  const durationInMillis = duration * 60 * 1000;
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);
  const toggleMenu = () => setIsExpanded((current) => !current);
  const closeMenu = () => setIsExpanded(false);

  return (
    <div
      className="relative flex w-fit items-center"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      onFocusCapture={() => setIsExpanded(true)}
      onBlurCapture={(event) => {
        const nextFocusTarget = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(nextFocusTarget)) {
          closeMenu();
        }
      }}
    >
      <Button
        type="button"
        aria-expanded={isExpanded}
        aria-haspopup="menu"
        aria-label={`Add ${eventName} to calendar`}
        onClick={toggleMenu}
        className="inline-flex items-center gap-1.5 rounded-md border border-brand/30 bg-brand-soft px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-brand-soft-foreground hover:bg-background hover:text-brand focus-visible:bg-background focus-visible:text-brand focus-visible:border-brand transition-colors"
      >
        <Plus className="w-3 h-3" />
        <span>Add to Calendar</span>
      </Button>
      {isExpanded && (
        <div className="absolute left-0 top-full z-50 mt-2">
          <ul className="p-4 grid gap-4 border-2 border-brand rounded-md text-base [&_a]:text-base [&_a]:whitespace-nowrap [&_a]:items-center [&_a]:p-1 bg-popover text-popover-foreground shadow-lg">
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
                className="flex items-center gap-2 text-popover-foreground hover:text-brand focus-within:text-brand transition-colors focus:outline-none"
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
                className="flex items-center gap-2 text-popover-foreground hover:text-brand focus-within:text-brand transition-colors focus:outline-none"
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
                className="flex items-center gap-2 text-popover-foreground hover:text-brand focus-within:text-brand transition-colors focus:outline-none"
              >
                <CalendarPlus className="w-4 h-4" />
                iCal/Apple Calendar
              </a>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
