import * as React from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { SquareArrowOutUpRight } from "lucide-react";

function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

export type CardStackItem = {
  id: string | number;
  title: string;
  description?: string;
  imageSrc?: string;
  href?: string;
  ctaLabel?: string;
  tag?: string;
};

export type CardStackProps<T extends CardStackItem> = {
  items: T[];

  /** Selected index on mount */
  initialIndex?: number;

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number;

  /** Card width in px */
  cardWidth?: number;

  /** Card height in px */
  cardHeight?: number;

  /** How much cards overlap/spread horizontally (0..1, higher = wider spread) */
  overlap?: number;

  /** Total fan rotation spread in degrees */
  spreadDeg?: number;

  /** Perspective depth in px */
  perspectivePx?: number;

  /** Depth drop in px per step away from active */
  depthPx?: number;

  /** Tilt angle in deg per step away from active */
  tiltXDeg?: number;

  /** Vertical offset in px for the active card */
  activeLiftPx?: number;

  /** Vertical drop in px per step away from active */
  activeScale?: number;

  /** Scale of inactive cards */
  inactiveScale?: number;

  /** Spring stiffness */
  springStiffness?: number;

  /** Spring damping */
  springDamping?: number;

  /** Wrap around at ends */
  loop?: boolean;

  /** Auto advance through cards */
  autoAdvance?: boolean;

  /** Auto advance interval in ms */
  intervalMs?: number;

  /** Pause auto advance while hovered */
  pauseOnHover?: boolean;

  /** Show pagination dots and optional external link */
  showDots?: boolean;

  /** Optional className on outer wrapper */
  className?: string;

  /** Callback whenever active index changes */
  onChangeIndex?: (index: number, item: T) => void;

  /** Custom card renderer */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode;
};

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0;
  return ((n % len) + len) % len;
}

function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active;
  if (!loop || len <= 1) return raw;

  const alt = raw > 0 ? raw - len : raw + len;
  return Math.abs(alt) < Math.abs(raw) ? alt : raw;
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,
  cardWidth = 520,
  cardHeight = 320,
  overlap = 0.48,
  spreadDeg = 48,
  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,
  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,
  springStiffness = 280,
  springDamping = 28,
  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,
  showDots = true,
  className,
  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion();
  const len = items.length;

  const [active, setActive] = React.useState(() =>
    wrapIndex(initialIndex, len),
  );
  const [hovering, setHovering] = React.useState(false);

  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len));
  }, [len]);

  React.useEffect(() => {
    if (!len) return;
    onChangeIndex?.(active, items[active]!);
  }, [active, len, items, onChangeIndex]);

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2));

  const cardSpacing = Math.max(10, Math.round(cardWidth * (1 - overlap)));
  const stepDeg = maxOffset > 0 ? spreadDeg / maxOffset : 0;

  const canGoPrev = loop || active > 0;
  const canGoNext = loop || active < len - 1;

  const prev = React.useCallback(() => {
    if (!len) return;
    if (!canGoPrev) return;
    setActive((a) => wrapIndex(a - 1, len));
  }, [canGoPrev, len]);

  const next = React.useCallback(() => {
    if (!len) return;
    if (!canGoNext) return;
    setActive((a) => wrapIndex(a + 1, len));
  }, [canGoNext, len]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  React.useEffect(() => {
    if (!autoAdvance) return;
    if (reduceMotion) return;
    if (!len) return;
    if (pauseOnHover && hovering) return;

    const id = window.setInterval(() => {
      if (loop || active < len - 1) next();
    }, Math.max(700, intervalMs));

    return () => window.clearInterval(id);
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ]);

  if (!len) return null;

  const activeItem = items[active]!;

  return (
    <div
      className={cn("w-full select-none outline-none", className)}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="relative w-full"
        style={{ height: Math.max(240, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* Subtle ambient spotlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-6 mx-auto h-48 w-[70%] rounded-full bg-black/5 blur-3xl"
          aria-hidden="true"
        />

        {/* Ground shadow */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-40 w-[76%] rounded-full bg-black/10 blur-3xl"
          aria-hidden="true"
        />

        <div
          className="relative flex h-full w-full items-center justify-center"
          style={{
            perspective: `${perspectivePx}px`,
          }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop);
              const abs = Math.abs(off);
              const visible = abs <= maxOffset;

              if (!visible) return null;

              const rotateZ = off * stepDeg;
              const x = off * cardSpacing;
              const y = abs * 10;
              const z = -abs * depthPx;

              const isFront = off === 0;

              const scale = isFront ? activeScale : inactiveScale;

              const elevateY = isFront ? -activeLiftPx : 0;

              const rotateX = isFront ? 0 : tiltXDeg;

              const zIndex = 100 - abs;

              const dragProps = isFront
                ? {
                    drag: "x" as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.45,
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return;
                      const travel = info.offset.x;
                      const v = info.velocity.x;
                      if (travel > 65 || v > 450) prev();
                      else if (travel < -65 || v < -450) next();
                    },
                  }
                : {};

              return (
                <motion.div
                  key={item.id}
                  className={cn(
                    "absolute bottom-8 rounded-2xl border-4 border-white/80 overflow-hidden shadow-2xl",
                    "will-change-transform select-none bg-stone-100",
                    isFront
                      ? "cursor-grab active:cursor-grabbing"
                      : "cursor-pointer",
                  )}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: "preserve-3d",
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          scale: 0.92,
                          x: x + 40,
                          y: y + 30,
                          z,
                          rotateZ,
                          rotateX,
                        }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + elevateY,
                    z,
                    rotateZ,
                    rotateX,
                    scale,
                  }}
                  exit={
                    reduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          scale: 0.9,
                          z: -depthPx * (maxOffset + 1),
                        }
                  }
                  transition={{
                    type: "spring",
                    stiffness: springStiffness,
                    damping: springDamping,
                  }}
                  whileDrag={
                    isFront
                      ? {
                          scale: activeScale * 1.02,
                        }
                      : undefined
                  }
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="h-full w-full"
                    style={{
                      transform: `translateZ(${isFront ? 0 : -1}px)`,
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isFront })
                    ) : (
                      <ImageOnlyCard item={item} />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots + optional link */}
      {showDots ? (
        <div className="mt-6 flex items-center justify-center gap-3">
          <div className="flex items-center gap-2">
            {items.map((it, idx) => {
              const on = idx === active;
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-200",
                    on
                      ? "bg-[#8C2D40] w-5"
                      : "bg-stone-300 hover:bg-stone-500",
                  )}
                  aria-label={`Go to ${it.title}`}
                />
              );
            })}
          </div>
          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="text-stone-500 hover:text-[#8C2D40] transition-colors"
              aria-label="Open link"
            >
              <SquareArrowOutUpRight className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function ImageOnlyCard({ item }: { item: CardStackItem }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-stone-100">
      {item.imageSrc ? (
        <img
          src={item.imageSrc}
          alt={item.title}
          className="h-full w-full object-cover"
          draggable={false}
          loading="eager"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-stone-100 text-sm text-stone-500">
          No image
        </div>
      )}
    </div>
  );
}
