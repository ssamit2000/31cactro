import { prisma } from "@/lib/prisma";
import { validateCompletedSteps } from "@/lib/release-validation";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  const release = await prisma.release.findUnique({ where: { id } });

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  return NextResponse.json(release);
}

export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    const body = await req.json();
    const data: { completedSteps?: string[]; additionalInfo?: string | null } = {};

    if (body.completedSteps !== undefined) {
      const result = validateCompletedSteps(body.completedSteps);
      if ("error" in result) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      data.completedSteps = result.steps;
    }

    if (body.additionalInfo !== undefined) {
      if (body.additionalInfo !== null && typeof body.additionalInfo !== "string") {
        return NextResponse.json({ error: "Additional info must be a string" }, { status: 400 });
      }
      data.additionalInfo = body.additionalInfo === null ? null : body.additionalInfo.trim();
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const release = await prisma.release.update({ where: { id }, data });
    return NextResponse.json(release);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Invalid JSON request body" }, { status: 400 });
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  try {
    await prisma.release.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "P2025") {
      return NextResponse.json({ error: "Release not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to delete release" }, { status: 500 });
  }
}
