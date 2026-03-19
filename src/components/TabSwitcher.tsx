"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  id: string;
  label: string;
  emoji: string;
};

type Props = {
  tabs: Tab[];
};

export default function TabSwitcher({ tabs }: Props) {
  const pathname = usePathname();

  return (
    <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/10">
      {tabs.map((tab) => {
        const isActive = pathname === `/${tab.id}`;
        return (
          <Link
            key={tab.id}
            href={`/${tab.id}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-200 no-underline"
            style={{
              backgroundColor: isActive ? "#a855f720" : "transparent",
              color: isActive ? "#a855f7" : "#ffffff60",
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: isActive ? "#a855f740" : "transparent",
              boxShadow: isActive ? "0 0 16px #a855f730" : "none",
            }}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
