import { ReactNode } from "react";
import Link from "next/link";

interface CardProps {
  title: string;
  description?: string;
  badge?: string;
  meta?: string;
  href?: string;
  children?: ReactNode;
  className?: string;
}

export default function Card({
  title,
  description,
  badge,
  meta,
  href,
  children,
  className = "",
}: CardProps) {
  const content = (
    <div
      className={`group relative rounded-xl border border-white/8 bg-[#141414] p-6 transition-colors hover:border-[#7C3AED]/40 hover:bg-[#1a1a1a] ${className}`}
    >
      {badge && (
        <span className="mb-3 inline-block rounded-full bg-[#7C3AED]/15 px-2.5 py-0.5 text-xs font-medium text-[#A855F7]">
          {badge}
        </span>
      )}
      <h3 className="mb-2 font-semibold text-[#FAFAFA] leading-snug">
        {title}
      </h3>
      {description && (
        <p className="text-sm leading-relaxed text-[#9B9B9B]">{description}</p>
      )}
      {children}
      {meta && (
        <p className="mt-4 text-xs text-[#6B6B6B]">{meta}</p>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
