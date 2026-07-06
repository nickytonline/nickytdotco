import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from "@floating-ui/react";
import { CalendarPlus, Plus } from "lucide-react";
import { useId, useState } from "react";
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

  const id = useId();
  const menuId = `${id}-menu`;
  const toggleId = `${id}-toggle`;

  const { refs, floatingStyles, context } = useFloating({
    open: isExpanded,
    onOpenChange: setIsExpanded,
    placement: "bottom-end",
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: "menu" });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    click,
    dismiss,
    role,
  ]);

  const durationInMillis = duration * 60 * 1000;
  const startDate = new Date(eventDate);
  const endDate = new Date(startDate.getTime() + durationInMillis);

  return (
    <div className="relative w-fit">
      <Button
        type="button"
        id={toggleId}
        aria-controls={menuId}
        aria-label={`Add ${eventName} to calendar`}
        ref={refs.setReference}
        {...getReferenceProps()}
        className="flex items-center gap-1.5 rounded-md bg-brand-solid text-brand-foreground text-base px-2 py-0.5 hover:bg-background hover:text-brand focus-visible:bg-background focus-visible:text-brand border border-brand hover:border-brand focus-visible:border-brand transition-colors"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add to Calendar</span>
      </Button>
      {isExpanded && (
        <div
          id={menuId}
          ref={refs.setFloating}
          style={floatingStyles}
          {...getFloatingProps()}
          className="z-50"
        >
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
