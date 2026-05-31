// src/app/page.tsx
import Link from "next/link";
import { RELEASE_STEPS } from "@/lib/steps";

type Release = {
  id: string;
  name: string;
  createdAt: string;   // created date
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
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/releases`, { cache: "no-store" });
  return res.json();
}

export default async function HomePage() {
  const releases = await getReleases();

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Release Checklist</h1>

      <Link href="/create">
        <button style={{ marginBottom: "1rem" }}>+ Create New Release</button>
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
              }}
            >
              <Link href={`/releases/${release.id}`}>
                <strong>{release.name}</strong>
              </Link>
              <div>Created: {new Date(release.createdAt).toLocaleDateString()}</div>
              <div>Due: {new Date(release.date).toLocaleDateString()}</div>

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