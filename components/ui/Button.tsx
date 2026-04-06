import { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import Link from "next/link";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface BaseButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface ButtonAsButtonProps
  extends BaseButtonProps,
    ButtonHTMLAttributes<HTMLButtonElement> {
  href?: undefined;
}

interface ButtonAsLinkProps
  extends BaseButtonProps,
    AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#7C3AED] text-white hover:bg-[#A855F7] focus-visible:ring-[#7C3AED]",
  secondary:
    "bg-[#EAB308] text-[#0A0A0A] font-semibold hover:bg-yellow-400 focus-visible:ring-[#EAB308]",
  ghost:
    "bg-transparent text-[#FAFAFA] hover:bg-white/5 focus-visible:ring-white/20",
  outline:
    "border border-white/20 text-[#FAFAFA] hover:border-white/40 hover:bg-white/5 focus-visible:ring-white/20",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-8 px-4 text-xs rounded-full",
  md: "h-10 px-6 text-sm rounded-full",
  lg: "h-12 px-8 text-base rounded-full",
};

function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = classNames(
    "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0A0A0A] disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
