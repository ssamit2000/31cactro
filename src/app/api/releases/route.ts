import { prisma } from "@/lib/prisma";
import { RELEASE_STEPS } from "@/lib/steps";
import { NextResponse } from "next/server";

export async function GET() {
  const releases = await prisma.release.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(releases);
}

export async function POST(req: Request) {
  const body = await req.json();
  const initialSteps = RELEASE_STEPS.reduce((acc, step) => {
    acc[step] = false;
    return acc;
  }, {} as Record<string, boolean>);

  const release = await prisma.release.create({
    data: {
      name: body.name,
      date: new Date(body.date),
      additionalInfo: body.additionalInfo,
      steps: initialSteps,
      completedSteps: [],
    },
  });

  return NextResponse.json(release, { status: 201 });
}
