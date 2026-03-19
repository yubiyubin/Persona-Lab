export const SCORE_EMOJI = [
  { min: 95, emoji: "🏆", label: "천생연분" },
  { min: 88, emoji: "🔥", label: "환상의 궁합" },
  { min: 80, emoji: "✨", label: "최고의 궁합" },
  { min: 73, emoji: "💫", label: "아주 잘 맞아요" },
  { min: 65, emoji: "🎯", label: "잘 맞아요" },
  { min: 58, emoji: "🌿", label: "나쁘지 않아요" },
  { min: 50, emoji: "🤝", label: "보통이에요" },
  { min: 42, emoji: "🌧️", label: "노력이 필요해요" },
  { min: 35, emoji: "⚠️", label: "많이 달라요" },
  { min: 25, emoji: "🌊", label: "쉽지 않아요" },
  { min: 0, emoji: "💀", label: "극과 극이에요" },
];

export function getScoreInfo(score: number) {
  return (
    SCORE_EMOJI.find((e) => score >= e.min) ??
    SCORE_EMOJI[SCORE_EMOJI.length - 1]
  );
}

export const COUPLE_TIERS = [
  { min: 90, emoji: "💘", label: "운명의 상대" },
  { min: 75, emoji: "💕", label: "환상의 커플" },
  { min: 60, emoji: "💗", label: "좋은 궁합" },
  { min: 45, emoji: "💛", label: "노력하면 OK" },
  { min: 30, emoji: "🩹", label: "많이 달라요" },
  { min: 0, emoji: "💔", label: "극과 극" },
];

export function getCoupleTier(score: number) {
  return (
    COUPLE_TIERS.find((t) => score >= t.min) ??
    COUPLE_TIERS[COUPLE_TIERS.length - 1]
  );
}
