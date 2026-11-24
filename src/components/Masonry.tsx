import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Masonry.css';

gsap.registerPlugin(ScrollTrigger);

export interface MasonryItem {
  id: string | number;
  img: string;
  url?: string;
  height: number;
  title?: string;
  desc?: string;
  badge?: string;
  stack?: string[];
  imageFit?: 'cover' | 'contain';
  bgColor?: string;
  [key: string]: any;
}

export interface MasonryProps {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'top' | 'bottom' | 'left' | 'right' | 'center' | 'random' | 'alternate';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onItemClick?: (item: MasonryItem) => void;
  className?: string;
  scrollTrigger?: boolean;
}

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = () => {
    if (typeof window === 'undefined') return defaultValue;
    const matchIndex = queries.findIndex(q => window.matchMedia(q).matches);
    return matchIndex !== -1 ? values[matchIndex] : defaultValue;
  };

  const [value, setValue] = useState<number>(get);

  useEffect(() => {
    const mediaQueries = queries.map(q => window.matchMedia(q));
    const handler = () => setValue(get());
    mediaQueries.forEach(query => query.addEventListener('change', handler));
    return () => mediaQueries.forEach(query => query.removeEventListener('change', handler));
  }, [queries]);

  return value;
};

const useMeasure = (): [React.RefObject<HTMLDivElement | null>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

export const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.96,
  blurToFocus = true,
  colorShiftOnHover = false,
  onItemClick,
  className = '',
  scrollTrigger = false
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1024px)', '(min-width:640px)', '(min-width:400px)'],
    [4, 3, 2, 2],
    1
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item: any, index = 0) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;

    if (animateFrom === 'alternate') {
      direction = index % 2 === 0 ? 'left' : 'right';
    } else if (animateFrom === 'random') {
      const directions: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
      direction = directions[Math.floor(Math.random() * directions.length)];
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: item.x - 110, y: item.y };
      case 'right':
        return { x: item.x + 110, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const { grid, totalHeight } = useMemo(() => {
    if (!width) return { grid: [], totalHeight: 0 };

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;

    const mapped = items.map(child => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const height = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += height;

      return { ...child, x, y, w: columnWidth, h: height };
    });

    const maxColHeight = Math.max(...colHeights, 0);

    return { grid: mapped, totalHeight: maxColHeight };
  }, [columns, items, width]);

  const hasMounted = useRef(false);
  const revealedRef = useRef<Set<string | number>>(new Set());
  const latestGridRef = useRef(grid);
  latestGridRef.current = grid;

  useLayoutEffect(() => {
    if (!imagesReady || grid.length === 0) return;

    const containerEl = containerRef.current;

    if (scrollTrigger && containerEl) {
      const triggers: ScrollTrigger[] = [];

      grid.forEach((item, index) => {
        const el = containerEl.querySelector(`[data-key="${item.id}"]`);
        if (!el) return;

        if (revealedRef.current.has(item.id)) {
          gsap.to(el, {
            x: item.x,
            y: item.y,
            width: item.w,
            height: item.h,
            duration,
            ease,
            overwrite: 'auto'
          });
          return;
        }

        const initialPos = getInitialPosition(item, index);
        gsap.set(el, {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(8px)' })
        });

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 88%',
          once: true,
          onEnter: () => {
            const current = latestGridRef.current.find(g => g.id === item.id) || item;
            revealedRef.current.add(item.id);
            gsap.to(el, {
              opacity: 1,
              x: current.x,
              y: current.y,
              width: current.w,
              height: current.h,
              ...(blurToFocus && { filter: 'blur(0px)' }),
              duration: 0.75,
              ease: 'power3.out',
              delay: (index % Math.max(columns, 1)) * stagger
            });
          }
        });
        triggers.push(st);
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach(t => t.kill());
      };
    }

    if (!hasMounted.current) {
      grid.forEach((item, index) => {
        const selector = containerEl ? containerEl.querySelector(`[data-key="${item.id}"]`) : `[data-key="${item.id}"]`;
        if (!selector) return;

        const animationProps = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h
        };

        const initialPos = getInitialPosition(item, index);
        const initialState = {
          opacity: 0,
          x: initialPos.x,
          y: initialPos.y,
          width: item.w,
          height: item.h,
          ...(blurToFocus && { filter: 'blur(10px)' })
        };

        gsap.fromTo(selector, initialState, {
          opacity: 1,
          ...animationProps,
          ...(blurToFocus && { filter: 'blur(0px)' }),
          duration: 0.8,
          ease: 'power3.out',
          delay: index * stagger
        });
      });
      hasMounted.current = true;
    } else {
      grid.forEach((item) => {
        const selector = containerEl ? containerEl.querySelector(`[data-key="${item.id}"]`) : `[data-key="${item.id}"]`;
        if (!selector) return;

        gsap.to(selector, {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          duration: duration,
          ease: ease,
          overwrite: 'auto'
        });
      });
    }
  }, [grid, imagesReady, columns, stagger, animateFrom, blurToFocus, duration, ease, scrollTrigger]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0.3,
          duration: 0.3
        });
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>, item: MasonryItem) => {
    const element = e.currentTarget;
    const selector = `[data-key="${item.id}"]`;

    if (scaleOnHover) {
      gsap.to(selector, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }

    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay');
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.3
        });
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={`masonry-list ${className}`}
      style={{ height: totalHeight > 0 ? `${totalHeight}px` : 'auto' }}
    >
      {grid.map(item => {
        return (
          <div
            key={item.id}
            data-key={item.id}
            className="masonry-item-wrapper"
            onClick={() => {
              if (onItemClick) {
                onItemClick(item);
              } else if (item.url) {
                window.open(item.url, '_blank', 'noopener');
              }
            }}
            onMouseEnter={e => handleMouseEnter(e, item)}
            onMouseLeave={e => handleMouseLeave(e, item)}
          >
            <div
              className="masonry-item-img"
              style={{
                backgroundImage: `url(${item.img})`,
                ...(item.imageFit ? { backgroundSize: item.imageFit } : {}),
                ...(item.bgColor ? { backgroundColor: item.bgColor } : {})
              }}
            >
              {colorShiftOnHover && (
                <div
                  className="color-overlay"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(45deg, rgba(140,45,64,0.5), rgba(224,122,95,0.5))',
                    opacity: 0,
                    pointerEvents: 'none',
                    borderRadius: '16px'
                  }}
                />
              )}

              {item.title && (
                <div className="absolute top-0 inset-x-0 z-10 px-4 pt-3.5 pb-4 bg-gradient-to-b from-white/95 via-white/80 to-transparent pointer-events-none">
                  <h4 className="font-bold text-sm sm:text-base text-[#1C1917] tracking-tight leading-snug truncate">
                    {item.title}
                  </h4>
                </div>
              )}

              {(item.desc || item.badge || (item.stack && item.stack.length > 0)) && (
                <div className="masonry-item-content z-20">
                  {item.badge && (
                    <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-[#E07A5F] mb-1">
                      {item.badge}
                    </span>
                  )}
                  {item.desc && (
                    <p className="text-xs text-stone-200 line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                  )}
                  {item.stack && item.stack.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.stack.slice(0, 3).map((tech: string, tIdx: number) => (
                        <span key={tIdx} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-stone-200">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Masonry;
