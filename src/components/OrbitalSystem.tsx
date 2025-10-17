'use client';

import React, { useEffect, useState } from 'react';

interface Orb {
  id: string;
  spawnTime: number;
}

interface OrbitalSystemProps {
  completionCount: number;
  disableAnimations?: boolean;
}

/**
 * OrbitalSystem creates and manages glowing orbs that spawn when questions are answered.
 * Each orb orbits around the keypad perimeter following a curved red-line path.
 * Multiple orbs can orbit simultaneously at different positions.
 */
export function OrbitalSystem({
  completionCount,
  disableAnimations = false,
}: OrbitalSystemProps) {
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [prevCount, setPrevCount] = useState(0);

  // Spawn new orb when completionCount increases
  useEffect(() => {
    if (disableAnimations || completionCount <= prevCount) {
      setPrevCount(completionCount);
      return;
    }

    const newOrb: Orb = {
      id: `orb-${Date.now()}`,
      spawnTime: Date.now(),
    };
    console.log('✨ Spawning orb:', { orbId: newOrb.id, totalOrbs: orbs.length + 1, completionCount });
    setOrbs((prev) => [...prev, newOrb]);
    setPrevCount(completionCount);
  }, [completionCount, disableAnimations, prevCount, orbs.length]);

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
      className="orbital-orb absolute h-2 w-2 rounded-full bg-industrial-orange shadow-[0_0_12px_rgba(255,107,53,0.7)]"
      style={{
        animation: `orbital-spawn 0.6s ease-out forwards, orbital-perimeter 14s linear infinite`,
        animationDelay: `${spawnDelay}s, ${spawnDelay + 0.6}s`,
        '--orbital-offset': `${orbitalOffset}deg`,
      } as React.CSSProperties & { '--orbital-offset': string }}
      aria-hidden="true"
    />
  );
}
