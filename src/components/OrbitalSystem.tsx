'use client';

import React, { useEffect, useState } from 'react';

interface Orb {
  id: string;
  spawnTime: number;
}

interface OrbitalSystemProps {
  questionsAnswered: number;
  disableAnimations?: boolean;
}

/**
 * OrbitalSystem creates and manages glowing orbs that spawn when questions are answered.
 * Each orb orbits around the keypad perimeter following a curved red-line path.
 * Multiple orbs can orbit simultaneously at different positions.
 */
export function OrbitalSystem({
  questionsAnswered,
  disableAnimations = false,
}: OrbitalSystemProps) {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [prevQuestionsAnswered, setPrevQuestionsAnswered] = useState(0);

  // Debug logging
  useEffect(() => {
    console.log('🔭 OrbitalSystem props:', { questionsAnswered, disableAnimations, orbCount: orbs.length });
  }, [questionsAnswered, disableAnimations, orbs.length]);

  // Spawn new orb when a question is answered
  useEffect(() => {
    if (disableAnimations) {
      return;
    }

    if (questionsAnswered <= prevQuestionsAnswered) {
      setPrevQuestionsAnswered(questionsAnswered);
      return;
    }

    // New question answered - spawn orb(s)
    const orbsToAdd = questionsAnswered - prevQuestionsAnswered;
    console.log('✨ Spawning orbs:', { orbsToAdd, questionsAnswered, prevQuestionsAnswered });

    for (let i = 0; i < orbsToAdd; i++) {
      const newOrb: Orb = {
        id: `orb-${Date.now()}-${i}`,
        spawnTime: Date.now(),
      };
      setOrbs((prev) => [...prev, newOrb]);
    }

    setPrevQuestionsAnswered(questionsAnswered);
  }, [questionsAnswered, disableAnimations, prevQuestionsAnswered]);

  if (disableAnimations || orbs.length === 0) {
    return null;
  }

  return (
    <div className="orbital-system pointer-events-none">
      {orbs.map((orb, index) => (
        <OrbitalOrb key={orb.id} index={index} totalOrbs={orbs.length} />
      ))}
    </div>
  );
}

interface OrbitalOrbProps {
  index: number;
  totalOrbs: number;
}

/**
 * Individual orb that orbits the keypad perimeter following the red-line path.
 * Each orb has a unique orbital offset based on its index.
 */
function OrbitalOrb({ index, totalOrbs }: OrbitalOrbProps) {
  // Stagger spawn times so orbs don't all appear at once
  const spawnDelay = index * 0.2;
  // Distribute orbs around the orbit path
  const orbitalOffset = (index / Math.max(totalOrbs, 1)) * 360;

  return (
    <div
      className="orbital-orb absolute h-2 w-2 rounded-full bg-emerald-400/90 shadow-[0_0_12px_rgba(16,185,129,0.7)]"
      style={{
        animation: `orbital-spawn 0.6s ease-out forwards, orbital-perimeter 14s linear infinite`,
        animationDelay: `${spawnDelay}s, ${spawnDelay + 0.6}s`,
        '--orbital-offset': `${orbitalOffset}deg`,
      } as React.CSSProperties & { '--orbital-offset': string }}
      aria-hidden="true"
    />
  );
}
