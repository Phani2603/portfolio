"use client"
/**
 * Note: Use position fixed according to your needs
 * Desktop navbar is better positioned at the bottom
 * Mobile navbar is better positioned at bottom right.
 * For top center positioning, add topCentered={true} prop
 **/

import { cn } from "@/lib/utils";
import { IconLayoutNavbarCollapse } from "@tabler/icons-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import React, { useState } from "react";
import { useRef } from "react";

export const FloatingDock = ({
  items,
  desktopClassName,
  mobileClassName,
  topCentered = false,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  desktopClassName?: string;
  mobileClassName?: string;
  topCentered?: boolean;
}) => {
  return (
    <>
      <FloatingDockDesktop items={items} className={desktopClassName} topCentered={topCentered} />
      <FloatingDockMobile items={items} className={mobileClassName} />
    </>
  );
};

const FloatingDockMobile = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const [activeItemIndex, setActiveItemIndex] = useState<number | null>(null);

  return (
    <div className={cn("bottom-6 right-6 z-50 relative block md:hidden", className)}>
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute bottom-full right-0 mb-7 flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {items.map((item, index) => (
              <div key={item.href} className="relative">
                {/* Tooltip/label that shows when active */}
                <AnimatePresence>
                  {activeItemIndex === index && (
                    <motion.div
                      className="absolute right-14 top-1/2 -translate-y-1/2 rounded-lg bg-gray-50 px-3 py-1.5 dark:bg-neutral-800 z-20"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                        {item.title}
                      </span>
                      {/* Add a small triangle/arrow pointing to the icon */}
                      <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-[6px] border-l-gray-50 dark:border-l-neutral-800"></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Icon button stays the same size */}
                <div
                  className="flex items-center justify-center rounded-full bg-gray-50 dark:bg-neutral-800 h-10 w-10"
                  onClick={() => setActiveItemIndex(activeItemIndex === index ? null : index)}
                >
                  <div className="cursor-pointer">{item.icon}</div>
                </div>

                {/* Navigation behavior */}
                <a
                  href={item.href}
                  className="absolute inset-0 z-10"
                  onClick={(e) => {
                    if (activeItemIndex !== index) {
                      e.preventDefault();
                      setActiveItemIndex(index);
                    }else{
                      setOpen(false);
                      setActiveItemIndex(null);
                    }
                  }}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 shadow-lg dark:bg-neutral-800"
      >
        <IconLayoutNavbarCollapse className="h-6 w-6 text-neutral-800 dark:text-neutral-400" />
      </button>
    </div>
  );
};

const FloatingDockDesktop = ({
  items,
  className,
  topCentered,
}: {
  items: { title: string; icon: React.ReactNode; href: string }[];
  className?: string;
  topCentered?: boolean;
}) => {
  const mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto hidden h-16 items-end gap-4 rounded-2xl bg-gray-50 px-4 pb-3 md:flex dark:bg-neutral-900",
        topCentered ? "fixed top-0 left-1/2 transform -translate-x-1/2" : "",
        className,
      )}
    >
      {items.map((item) => (
        <IconContainer mouseX={mouseX} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

function IconContainer({
  mouseX,
  title,
  icon,
  href,
}: {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href: string;
}) {  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };

    return val - bounds.x - bounds.width / 2;
  });

  const widthTransform = useTransform(distance, [-150, 0, 150], [32, 60, 32]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [32, 60, 32]);

  const widthTransformIcon = useTransform(distance, [-150, 0, 150], [20, 40, 20]);
  const heightTransformIcon = useTransform(
    distance,
    [-150, 0, 100],
    [20, 40, 20],
  );
  const width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const height = useSpring(heightTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const widthIcon = useSpring(widthTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  const heightIcon = useSpring(heightTransformIcon, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <a href={href}>
      <motion.div
        ref={ref}
        style={{ width, height }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-gray-200 dark:bg-neutral-800"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 2, x: "-50%" }}
              className="absolute -bottom-8 left-1/2 w-fit rounded-md border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs whitespace-pre text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-white"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: widthIcon, height: heightIcon }}
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
    </a>
  );
}
