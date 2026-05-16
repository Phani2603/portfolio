"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import { AvatarCircles } from "@/components/ui/avatar-circles";
import GitHubStarButton from "@/components/ui/github-star";
import type { WorkItem } from "./landing-content";
import {
  CutoutCard,
  CutoutCardContent,
  CutoutCardAction,
  CutoutCardFooter,
  CutoutCardImage,
  CutoutCardInsetLabel,
  CutoutCardMedia,
  CutoutCardOverlay,
  CutoutCardPin,
  CutoutCorner,
  cutoutCardSurfaceClassName,
  useCutoutCard,
  useCutoutContentStaggerVariants,
} from "@/components/ui/cutout-card";

type WorkCardProps = {
  item: WorkItem;
};

export function WorkCard({ item }: WorkCardProps) {
  const stagger = useCutoutContentStaggerVariants();
  const skills = item.skills ?? [];
  const avatarUrls = item.avatarUrls ?? [];
  const deploymentState = item.deploymentState ?? "Development";
  const isProduction = deploymentState === "Production";
  const pinToneClassName = isProduction
    ? "bg-emerald-500 text-white"
    : "bg-slate-500 text-white";
  const pinDotClassName = isProduction ? "bg-emerald-300" : "bg-slate-300";

  return (
    <CutoutCard className={cutoutCardSurfaceClassName}>
      <CutoutCardMedia className="h-72">
        <WorkCardMedia item={item} />
        <CutoutCardOverlay />

        <CutoutCardInsetLabel className="bottom-0 left-0 rounded-tr-[20px] bg-card px-5 py-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {deploymentState}
          </span>
          <CutoutCorner className="absolute -right-[31px] -bottom-px rotate-90 text-card" />
          <CutoutCorner className="absolute -top-[31px] -left-px rotate-90 text-card" />
        </CutoutCardInsetLabel>

        <CutoutCardPin className={`top-0 right-0 rounded-bl-[16px] px-4 py-2 shadow-foreground/10 shadow-md ring-1 ring-border/30 ${pinToneClassName}`}>
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span className={`h-2.5 w-2.5 rounded-full ${pinDotClassName}`} />
            {isProduction ? "Live" : "Development"}
          </span>
          <CutoutCorner
            className={`absolute top-0 -left-[23px] -rotate-90 ${isProduction ? "text-emerald-500" : "text-slate-500"}`}
            size={24}
          />
          <CutoutCorner
            className={`absolute right-0 -bottom-[23px] -rotate-90 ${isProduction ? "text-emerald-500" : "text-slate-500"}`}
            size={24}
          />
        </CutoutCardPin>
      </CutoutCardMedia>

      <CutoutCardContent>
        <motion.div
          animate="show"
          className="contents"
          initial="hidden"
          variants={stagger.container}
        >
          <motion.h3
            className="mb-2 text-balance text-xl leading-snug font-semibold text-card-foreground sm:text-2xl"
            variants={stagger.item}
          >
            {item.title}
          </motion.h3>

          <motion.p
            className="mb-4 text-pretty text-lg leading-relaxed text-muted-foreground sm:text-base line-clamp-3"
            variants={stagger.item}
            aria-label={item.description}
          >
            {item.description}
          </motion.p>

          <motion.div className="mb-5" variants={stagger.item}>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                  Skills
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-black/10 bg-white px-3 py-1 text-xs font-medium text-black shadow-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="ml-4 flex items-center">
                {(() => {
                  try {
                    // Prefer explicit githubUrl on the WorkItem when present
                    const github = item.githubUrl ?? item.href ?? ""
                    const href = typeof github === "string" ? github : ""
                    const url = href.startsWith("http") ? new URL(href) : null
                    if (url && url.hostname.includes("github.com")) {
                      const parts = url.pathname.split("/").filter(Boolean)
                      if (parts.length >= 2) {
                        const owner = parts[0]
                        const repo = parts[1].replace(/\.git$/, "")
                        return (
                          <GitHubStarButton
                            owner={owner}
                            repo={repo}
                            className="ml-2"
                          />
                        )
                      }
                    }
                  } catch {
                    // ignore parsing errors and don't render the CTA
                  }
                  return null
                })()}
              </div>
            </div>
          </motion.div>

          <motion.div variants={stagger.item}>
            <CutoutCardFooter className="border-border/80 border-t pt-4">
              <AvatarCircles avatarUrls={avatarUrls} className="scale-90 origin-left" />
              <span className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                {deploymentState}
              </span>
            </CutoutCardFooter>
          </motion.div>
        </motion.div>
      </CutoutCardContent>

      <CutoutCardAction className="right-5 bottom-5">
        <Link
          href={item.href}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-md transition-transform duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] active:scale-[0.97]"
        >
          Read more
        </Link>
      </CutoutCardAction>
    </CutoutCard>
  );
}

type WorkCardMediaProps = {
  item: WorkItem;
};

function WorkCardMedia({ item }: WorkCardMediaProps) {
  const { hovered } = useCutoutCard();
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !item.videoSrc) return;

    if (hovered) {
      video.play().catch(() => {
        // ignore play failures (e.g. browser restrictions)
      });
      return;
    }

    video.pause();
    video.currentTime = 0;
  }, [hovered, item.videoSrc]);

  if (item.videoSrc) {
    return (
      <video
        className="h-full w-full object-cover transition-[filter,transform] duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] grayscale group-hover/cutout:grayscale-0 group-hover/cutout:scale-110"
        muted
        playsInline
        preload="metadata"
        ref={videoRef}
      >
        <source src={item.videoSrc} type="video/mp4" />
      </video>
    );
  }

  return (
    <CutoutCardImage
      alt={item.title}
      sizes="(max-width: 768px) 100vw, 448px"
      src={item.image}
    />
  );
}