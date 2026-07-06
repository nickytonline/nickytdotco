import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const defaultClass =
  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-brand-solid text-white font-semibold text-base hover:bg-brand-solid-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors";

type AsAnchor = { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>;
type AsButton = { href?: never } & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonProps = AsAnchor | AsButton;

const Button = forwardRef<HTMLElement, ButtonProps>(
  ({ className = defaultClass, children, ...props }, ref) => {
    if ("href" in props && props.href !== undefined) {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          className={className}
          {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {children}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={className}
        {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
