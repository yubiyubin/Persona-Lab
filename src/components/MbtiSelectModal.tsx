"use client";

import type { MbtiType } from "@/data/compatibility";
import { MBTI_GROUPS } from "@/data/groups";

type Props = {
  onSelect: (mbti: MbtiType) => void;
};

export default function MbtiSelectModal({ onSelect }: Props) {
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md rounded-3xl p-8 flex flex-col gap-6"
          style={{
            background: "#0f0f1a",
            border: "1px solid rgba(168,85,247,0.2)",
            boxShadow: "0 0 60px rgba(168,85,247,0.12)",
          }}
        >
          <div className="text-center flex flex-col gap-2">
            <p className="text-3xl">🧬</p>
            <h2
              className="text-2xl font-black"
              style={{
                color: "#ffffffce",
                textShadow: "0 0 8px rgba(168,85,247,0.4)",
              }}
            >
              내 MBTI는?
            </h2>
            <p className="text-white/40 text-sm">
              선택하면 바로 궁합을 볼 수 있어요
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {MBTI_GROUPS.map((group) => (
              <div key={group.label} className="flex flex-col gap-1.5">
                <p className="text-[11px] text-white/30 font-medium pl-1">
                  {group.label}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {group.types.map((type) => (
                    <button
                      key={type}
                      onClick={() => onSelect(type)}
                      className="py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 hover:scale-105"
                      style={{
                        background: "rgba(168,85,247,0.08)",
                        border: "0.5px solid rgba(168,85,247,0.2)",
                        color: "rgba(255,255,255,0.75)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(168,85,247,0.25)";
                        e.currentTarget.style.borderColor =
                          "rgba(168,85,247,0.5)";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.boxShadow =
                          "0 4px 20px rgba(168,85,247,0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(168,85,247,0.08)";
                        e.currentTarget.style.borderColor =
                          "rgba(168,85,247,0.2)";
                        e.currentTarget.style.color =
                          "rgba(255,255,255,0.75)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
