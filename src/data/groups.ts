import type { MbtiType } from "./compatibility";

export const MBTI_GROUPS: { label: string; types: MbtiType[] }[] = [
  { label: "분석형", types: ["INTJ", "INTP", "ENTJ", "ENTP"] },
  { label: "외교형", types: ["INFJ", "INFP", "ENFJ", "ENFP"] },
  { label: "관리형", types: ["ISTJ", "ISFJ", "ESTJ", "ESFJ"] },
  { label: "탐험형", types: ["ISTP", "ISFP", "ESTP", "ESFP"] },
];
