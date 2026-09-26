import { prisma } from "@/lib/prisma";
import { RELEASE_STEPS } from "@/lib/steps";
import { validateReleaseInput } from "@/lib/release-validation";
import { NextResponse } from "next/server";

export async function GET() {
  const releases = await prisma.release.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(releases);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = validateReleaseInput(body);

    if ("error" in input) {
      return NextResponse.json({ error: input.error }, { status: 400 });
    }

    const initialSteps = RELEASE_STEPS.reduce((acc, step) => {
      acc[step] = false;
      return acc;
    }, {} as Record<string, boolean>);

    const release = await prisma.release.create({
      data: {
        name: input.name,
        date: input.date,
        additionalInfo: input.additionalInfo,
        steps: initialSteps,
        completedSteps: [],
      },
    });

    return NextResponse.json(release, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }
}
