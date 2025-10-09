import React from 'react';

type SlotProps = {
  screen: React.ReactNode;
  controls: React.ReactNode;
  marquee?: React.ReactNode;
  children?: never;
};

type LegacyChildren = {
  children: React.ReactNode;
  marquee?: React.ReactNode;
  screen?: never;
  controls?: React.ReactNode;
};

export type AppContainerProps = SlotProps | LegacyChildren;

function isSlotProps(props: AppContainerProps): props is SlotProps {
  return Object.prototype.hasOwnProperty.call(props, 'screen');
}

export function AppContainer(props: AppContainerProps) {
  const marquee = props.marquee ?? (
    <h1 className="engraved-title text-xl md:text-4xl">
      DeVOTE PILOT SCENARIO SIMULATOR
    </h1>
  );

  let screen: React.ReactNode;
  let controls: React.ReactNode | null;

  if (isSlotProps(props)) {
    screen = props.screen;
    controls = props.controls;
  } else {
    screen = props.children;
    controls = props.controls ?? null;
  }

  return (
    <div className="arcade-wrapper min-h-dvh bg-gradient-to-b from-[#090d12] via-[#070b0f] to-[#05070a] text-zinc-100">
      <div className="arcade-cabinet mx-auto w-full max-w-6xl p-4 md:p-8 grid min-h-dvh grid-rows-[15%_1fr_20%] gap-4 md:gap-6">
        <header className="marquee row-[1] flex items-center justify-center" role="banner">
          {marquee}
        </header>

        <div className="cabinet-body row-[2] grid grid-cols-[60%_40%] gap-4 md:gap-6">
          <section
            className="screen-bezel relative rounded-lg bg-black/70"
            role="region"
            aria-label="Screen"
          >
            {screen}
          </section>
          <section className="control-panel" role="group" aria-label="Controls">
            {controls}
          </section>
        </div>

        <div className="base row-[3] h-full rounded-b-xl" />
      </div>
    </div>
  );
}
