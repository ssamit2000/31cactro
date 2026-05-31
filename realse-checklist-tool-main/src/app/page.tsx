// src/app/page.tsx

import Link from "next/link";
import { RELEASE_STEPS } from "@/lib/steps";

type Release = {
  id: string;
  name: string;
  createdAt: string;
  date: string;
  completedSteps: string[];
};

function computeStatus(completedSteps: string[]) {
  const completed = completedSteps.length;

  if (completed === 0) return "planned";
  if (completed === RELEASE_STEPS.length) return "done";
  return "ongoing";
}

async function getReleases(): Promise<Release[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/releases`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Failed to fetch releases: ${res.status}`);
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching releases:", error);
    return [];
  }
}

export default async function HomePage() {
  const releases = await getReleases();

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
              <Link
                href={`/releases/${release.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <strong>{release.name}</strong>
              </Link>

              <div>
                Created:{" "}
                {new Date(release.createdAt).toLocaleDateString()}
              </div>

              <div>
                Due: {new Date(release.date).toLocaleDateString()}
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