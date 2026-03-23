// ─────────────────────────────────────────────
// 공통 타입 & 유틸리티
// ─────────────────────────────────────────────

/** 점수 구간별 이모지·라벨 매핑 엔트리 */
type TierEntry = { min: number; emoji: string; labels: string[] };

/**
 * 모듈 레벨 캐시 — 페이지에 머무는 동안 동일 (table, score) 쌍은 항상 같은 결과를 반환.
 * 컴포넌트 mount/unmount, 탭 전환에도 캐시가 유지된다.
 */
const cache = new Map<TierEntry[], Map<number, { emoji: string; label: string }>>();

/** 테이블에서 해당 구간을 찾고, labels[] 중 랜덤으로 하나를 선택하여 반환 (캐시됨) */
function pickFromTier(table: TierEntry[], score: number) {
  let tableCache = cache.get(table);
  if (!tableCache) {
    tableCache = new Map();
    cache.set(table, tableCache);
  }
  const cached = tableCache.get(score);
  if (cached) return cached;

  const tier = table.find((t) => score >= t.min) ?? table[table.length - 1];
  const label = tier.labels[Math.floor(Math.random() * tier.labels.length)];
  const result = { emoji: tier.emoji, label };
  tableCache.set(score, result);
  return result;
}

// ─────────────────────────────────────────────
// 점수 구간별 일반 라벨
// ─────────────────────────────────────────────

export const SCORE_META: TierEntry[] = [
  {
    min: 95,
    emoji: "🏆",
    labels: [
      "그냥 잘 맞는 수준이 아님 💗",
      "설명 안 해도 되는 조합 🌟",
      "이건 따로 맞출 필요 없음 🧲",
      "어떻게 해도 잘 맞는 타입 💎",
      "굳이 노력 안 해도 이어짐 🔗",
    ],
  },
  {
    min: 88,
    emoji: "🔥",
    labels: [
      "거의 웬만하면 다 잘 맞음 💥",
      "크게 틀어질 일이 없는 조합 ⚡",
      "생각보다 훨씬 편하게 맞음 ✨",
      "부딪혀도 금방 정리되는 편 🔄",
      "같이 있으면 자연스럽게 맞춰짐 🎶",
    ],
  },
  {
    min: 80,
    emoji: "✨",
    labels: [
      "꽤 잘 맞는 조합 🌈",
      "잘 맞는 편이긴 함 👍",
      "크게 문제는 없음 🛡️",
      "무난하게 좋은 편 🌤️",
      "서로 이해 가능한 수준 🤝",
    ],
  },
  {
    min: 73,
    emoji: "💫",
    labels: [
      "생각보다 괜찮은 조합 🧪",
      "나름 잘 맞는 편 🎵",
      "가끔 삐걱거림 있음 🔩",
      "조금만 맞추면 괜찮음 🤞",
      "타이밍 맞으면 더 좋음 ⏰",
    ],
  },
  {
    min: 65,
    emoji: "🎯",
    labels: [
      "그냥 무난한 조합 🙂",
      "편하긴 한데 약간 심심함 😶",
      "크게 튀는 건 없음 🫥",
      "적당히 잘 맞는 편 ☕",
      "무난하게 갈 수 있음 🚶",
    ],
  },
  {
    min: 58,
    emoji: "🌿",
    labels: [
      "조금씩 어긋나는 느낌 🍃",
      "맞는 듯 안 맞는 듯 🤔",
      "생각보다 애매한 조합 🫤",
      "상황 따라 다름 🎲",
      "타이밍 영향 많이 받음 ⏳",
    ],
  },
  {
    min: 50,
    emoji: "🤝",
    labels: [
      "그냥 평범한 조합 😐",
      "케이스 바이 케이스 🔀",
      "잘 맞을 수도 있음 ⚖️",
      "나쁘진 않은데 확신은 없음 🤷",
      "무난하지만 애매함 〰️",
    ],
  },
  {
    min: 42,
    emoji: "🌧️",
    labels: [
      "가만히 두면 계속 어긋남 💦",
      "신경 안 쓰면 금방 틀어짐 🔧",
      "맞추려는 쪽이 더 힘들어짐 😮‍💨",
      "생각보다 자주 부딪힘 💥",
      "편하게 두기 어려운 조합 📖",
    ],
  },
  {
    min: 35,
    emoji: "⚠️",
    labels: [
      "결이 꽤 달라서 계속 걸림 🌀",
      "작은 것도 계속 부딪히는 느낌 🪨",
      "맞추려다 지치는 경우 많음 😵‍💫",
      "서로 방식이 계속 어긋남 🪐",
      "편하게 지내기 쉽지 않음 🏔️",
    ],
  },
  {
    min: 25,
    emoji: "🌊",
    labels: [
      "계속 엇나가는 느낌이 강함 🌪️",
      "타이밍이 거의 안 맞는 편 🔭",
      "이해하려고 해도 잘 안 맞음 📡",
      "맞추려다 포기하게 되는 조합 🏳️",
      "자연스럽게 이어지기 어려움 🧊",
    ],
  },
  {
    min: 0,
    emoji: "💀",
    labels: [
      "방향 자체가 다른 느낌 ☠️",
      "같이 있으면 계속 소모됨 🔋",
      "잘 맞추기 자체가 어려움 👽",
      "편해지는 구간이 잘 안 옴 🌌",
      "계속 어긋나는 흐름 💫",
    ],
  },
];

export function getScoreInfo(score: number) {
  return pickFromTier(SCORE_META, score);
}

// ─────────────────────────────────────────────
// 커플 궁합 등급
// ─────────────────────────────────────────────

/**
 * 커플 궁합 등급 테이블.
 * 각 등급별 여러 개의 재치 있는 라벨(labels[])을 보유하며,
 * getCoupleTier()에서 랜덤으로 하나를 선택하여 렌더마다 다른 문구를 보여준다.
 */
export const COUPLE_TIERS: TierEntry[] = [
  {
    min: 90,
    emoji: "💘",
    labels: [
      "전생에 뭐였길래,,,💗",
      "이 조합 실화?! 운명이다 운명 💫",
      "둘이 붙어다니면 주변이 힘듦 🔥",
      "커플링 각 잡아도 됨 💍",
    ],
  },
  {
    min: 75,
    emoji: "💕",
    labels: [
      "찐이야 이건,,,💗",
      "썸 탈 필요 없이 바로 직진 🚀",
      "서로 취향 저격 중 🎯",
      "눈빛만 봐도 통하는 사이 👀",
    ],
  },
  {
    min: 60,
    emoji: "💗",
    labels: [
      "쏠리는 중 💫",
      "좀만 더 밀면 넘어갈 듯 🌊",
      "미묘하게 설레는 거 맞지? 😏",
      "가능성 충분함, 밀어봐 💪",
    ],
  },
  {
    min: 45,
    emoji: "🫠",
    labels: [
      "밀당 각 🎢",
      "좋다가도 갑자기 멀어지는 느낌 🎢",
      "서로 다른 매력에 끌림 그 자체 🧲",
      "노력하면 반전 가능 🔄",
    ],
  },
  {
    min: 30,
    emoji: "🧊",
    labels: [
      "서로 외국어 하는 중 🗣️",
      "말은 통하는데 맥락이 안 맞음 📡",
      "번역기 필요한 관계 🗣️",
      "이해하려면 매뉴얼 필요 📖",
    ],
  },
  {
    min: 0,
    emoji: "💀",
    labels: [
      "이건 사랑이 아니라 도전 🔥",
      "극한 도전: 연애 편 🏔️",
      "서로한테 외계인 👽",
      "호환 불가… 펌웨어 업데이트 필요 🔧",
    ],
  },
];

/**
 * 점수에 해당하는 커플 등급을 찾고, labels[] 중 랜덤으로 하나를 선택하여 반환한다.
 * @returns {{ emoji: string, label: string }}
 */
export function getCoupleTier(score: number) {
  return pickFromTier(COUPLE_TIERS, score);
}

// ─────────────────────────────────────────────
// 연애 vs 친구 한줄 요약
// ─────────────────────────────────────────────

/**
 * 궁합 점수 구간별 "연애 vs 친구" 한줄 비교 문구.
 * 궁합 맵/그룹 궁합 팝업에서 사용된다.
 * 이모지는 텍스트 뒤에 배치한다.
 */
const LOVE_FRIEND_LINES = [
  {
    min: 90,
    line: "연애는 운명급, 친구로는 소울메이트 💘🤝",
  },
  {
    min: 75,
    line: "연애도 좋고, 친구해도 찐한 사이 💕😎",
  },
  {
    min: 60,
    line: "연애는 노력하면 꽃피고, 친구는 꽤 잘 맞음 🌸🤜",
  },
  {
    min: 45,
    line: "연애는 노력 필요, 친구는 적당히 편한 사이 🫠☕",
  },
  {
    min: 30,
    line: "연애는 험난, 친구로는 가끔 통하는 정도 🧊🤏",
  },
  {
    min: 0,
    line: "연애도 친구도 서로 다른 세계관 💀🌌",
  },
];

/**
 * 점수에 해당하는 "연애 vs 친구" 한줄 요약을 반환한다.
 * 궁합 맵 팝업 및 그룹 궁합 팝업에서 호출된다.
 */
export function getLoveFriendLine(score: number): string {
  const entry =
    LOVE_FRIEND_LINES.find((e) => score >= e.min) ??
    LOVE_FRIEND_LINES[LOVE_FRIEND_LINES.length - 1];
  return entry.line;
}
