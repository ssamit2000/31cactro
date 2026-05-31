import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/releases/:id
export async function GET(_: Request, { params }: RouteContext) {
  const { id } = await params;

  const release = await prisma.release.findUnique({
    where: { id },
  });

  if (!release) {
    return NextResponse.json({ error: "Release not found" }, { status: 404 });
  }

  return NextResponse.json(release);
}

// PATCH /api/releases/:id
export async function PATCH(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  const release = await prisma.release.update({
    where: { id },
    data: {
      completedSteps: body.completedSteps,
      additionalInfo: body.additionalInfo,
    },
  });

  return NextResponse.json(release);
}

// DELETE /api/releases/:id
export async function DELETE(_: Request, { params }: RouteContext) {
  const { id } = await params;

  await prisma.release.delete({
    where: { id },
  });

  return new NextResponse(null, { status: 204 });
}