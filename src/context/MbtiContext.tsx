"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { MbtiType } from "@/data/compatibility";

type MbtiContextValue = {
  selectedMbti: MbtiType | null;
  showModal: boolean;
  selectMbti: (mbti: MbtiType) => void;
  openModal: () => void;
};

const MbtiContext = createContext<MbtiContextValue | null>(null);

export function MbtiProvider({ children }: { children: ReactNode }) {
  const [selectedMbti, setSelectedMbti] = useState<MbtiType | null>(null);
  const [showModal, setShowModal] = useState(true);

  const selectMbti = useCallback((mbti: MbtiType) => {
    setSelectedMbti(mbti);
    setShowModal(false);
  }, []);

  const openModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <MbtiContext.Provider
      value={{ selectedMbti, showModal, selectMbti, openModal }}
    >
      {children}
    </MbtiContext.Provider>
  );
}

export function useMbti() {
  const ctx = useContext(MbtiContext);
  if (!ctx) throw new Error("useMbti must be used within MbtiProvider");
  return ctx;
}
