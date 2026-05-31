import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RELEASE_STEPS } from "@/lib/steps";

export const dynamic = "force-dynamic";

type Release = {
  id: string;
  name: string;
  createdAt: Date;
  date: Date;
  completedSteps: string[];
};

function computeStatus(completedSteps: string[]) {
  const completed = completedSteps.length;

  if (completed === 0) return "planned";
  if (completed === RELEASE_STEPS.length) return "done";
  return "ongoing";
}

export default async function HomePage() {
  const releases = await prisma.release.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Release Checklist</h1>

      <Link href="/create">
        <button style={{ marginBottom: "1rem" }}>
          + Create New Release
        </button>
      </Link>

      {releases.length === 0 && <p>No releases yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {releases.map((release) => {
          const status = computeStatus(release.completedSteps);

          return (
            <li
              key={release.id}
              style={{
                border: "1px solid #ccc",
                padding: "1rem",
                marginBottom: "1rem",
                borderRadius: "8px",
              }}
            >
              <Link href={`/releases/${release.id}`}>
                <strong>{release.name}</strong>
              </Link>

              <div>
                Created: {release.createdAt.toLocaleDateString()}
              </div>

              <div>
                Due: {release.date.toLocaleDateString()}
              </div>

              <div>
                Status:{" "}
                <strong
                  style={{
                    color:
                      status === "planned"
                        ? "gray"
                        : status === "ongoing"
                        ? "orange"
                        : "green",
                  }}
                >
                  {status}
                </strong>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}