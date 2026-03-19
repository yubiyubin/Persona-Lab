"use client";

import { useRef } from "react";
import { useMbti } from "@/context/MbtiContext";
import MbtiGrid from "@/components/MbtiGrid";
import MbtiGraph from "@/components/MbtiGraph";

export default function MbtiMapPage() {
  const { selectedMbti } = useMbti();
  const graphRef = useRef<HTMLDivElement>(null);

  if (!selectedMbti) return null;

  return (
    <MbtiGrid selectedMbti={selectedMbti} onSelect={() => {}}>
      <div ref={graphRef}>
        <MbtiGraph selectedMbti={selectedMbti} />
      </div>
    </MbtiGrid>
  );
}
