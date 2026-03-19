"use client";

import { useState, useCallback } from "react";
import { useMbti } from "@/context/MbtiContext";
import CoupleResult from "@/components/CoupleResult";
import type { MbtiType } from "@/data/compatibility";

export default function MbtiLovePage() {
  const { selectedMbti } = useMbti();
  const [partnerMbti, setPartnerMbti] = useState<MbtiType | null>(null);

  const handlePartnerSelect = useCallback((mbti: MbtiType) => {
    setPartnerMbti(mbti);
  }, []);

  if (!selectedMbti) return null;

  return (
    <CoupleResult
      myMbti={selectedMbti}
      partnerMbti={partnerMbti}
      onPartnerSelect={handlePartnerSelect}
    />
  );
}
