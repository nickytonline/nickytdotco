import { forwardRef } from "react";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const defaultClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-solid px-5 py-2.5 text-base font-semibold leading-6 text-brand-foreground transition-colors hover:bg-brand-solid-hover focus:bg-brand-solid-hover focus:outline-none";

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
