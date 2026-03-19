"use client";

import { useState } from "react";
import { useMbti } from "@/context/MbtiContext";
import MemberInput from "@/components/MemberInput";
import GroupGrid from "@/components/GroupGrid";
import type { Member } from "@/data/compatibility";

export default function GroupMatchPage() {
  const { selectedMbti } = useMbti();
  const [members, setMembers] = useState<Member[]>(() =>
    selectedMbti ? [{ name: "나", mbti: selectedMbti, emoji: "⭐" }] : [],
  );

  return (
    <div className="flex flex-col gap-6">
      <MemberInput members={members} onChange={setMembers} />
      <GroupGrid members={members} />
    </div>
  );
}
