// src/app/releases/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ReleaseDetailClient from "./ReleaseDetailClient";
import { RELEASE_STEPS } from "@/lib/steps";

export const dynamic = "force-dynamic";

interface Release {
  id: string;
  name: string;
  date: string;
  additionalInfo: string;
  completedSteps: string[];
  createdAt: string; // ✅ add createdAt if you want to display it
}

interface Props {
  params: Promise<{ id: string }>; // params is a Promise in App Router
}

export default async function ReleaseDetailPage({ params }: Props) {
  const { id: releaseId } = await params; // unwrap promise
  if (!releaseId) return notFound();

  const dbRelease = await prisma.release.findUnique({
    where: { id: releaseId },
  });

  if (!dbRelease) return notFound();

  // ✅ Convert Date objects to strings for TypeScript compatibility
  const release: Release = {
    ...dbRelease,
    date: dbRelease.date.toISOString(),
    createdAt: dbRelease.createdAt.toISOString(),
    additionalInfo: dbRelease.additionalInfo ?? "",
  };

  const completed = release.completedSteps?.length ?? 0;
  const status =
    completed === 0
      ? "planned"
      : completed === RELEASE_STEPS.length
      ? "done"
      : "ongoing";

  return <ReleaseDetailClient release={release} status={status} />;
}