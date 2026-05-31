"use client";

import { useState } from "react";
import { RELEASE_STEPS } from "@/lib/steps";

type Release = {
  id: string;
  name: string;
  date: string;
  additionalInfo: string;
  completedSteps: string[];
  createdAt: string; // ✅ add this
};

type Props = {
  release: Release;
  status: string; // ✅ add this line
};

export default function ReleaseDetailClient({ release: initialRelease }: Props) {
  const [release, setRelease] = useState(initialRelease);
  const [draftSteps, setDraftSteps] = useState([...initialRelease.completedSteps]);
  const [draftInfo, setDraftInfo] = useState(initialRelease.additionalInfo || "");
  const [saving, setSaving] = useState(false);

  const status =
    draftSteps.length === 0
      ? "planned"
      : draftSteps.length === RELEASE_STEPS.length
      ? "done"
      : "ongoing";

  function toggleStep(step: string) {
    setDraftSteps((prev) =>
      prev.includes(step) ? prev.filter((s) => s !== step) : [...prev, step]
    );
  }

  async function saveChanges() {
    setSaving(true);
    try {
      const res = await fetch(`/api/releases/${release.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completedSteps: draftSteps, additionalInfo: draftInfo }),
      });

      if (!res.ok) {
        console.error("Failed to save release", res.status);
        return;
      }

      const updated = await res.json();
      setRelease(updated);
      setDraftSteps(updated.completedSteps);
      setDraftInfo(updated.additionalInfo || "");
    } finally {
      setSaving(false);
    }
  }

  async function deleteRelease() {
    const res = await fetch(`/api/releases/${release.id}`, { method: "DELETE" });
    if (!res.ok) {
      console.error("Failed to delete release", res.status);
      return;
    }
    window.location.href = "/";
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{release.name}</h1>
      <p><strong>Created:</strong> {new Date(release.createdAt).toLocaleDateString()}</p>
      <p><strong>Due:</strong> {new Date(release.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {status}</p>

      <hr />
      <h3>Steps</h3>
      {RELEASE_STEPS.map((step) => (
        <div key={step}>
          <label>
            <input
              type="checkbox"
              checked={draftSteps.includes(step)}
              onChange={() => toggleStep(step)}
            />
            {step}
          </label>
        </div>
      ))}

      <hr />
      <h3>Additional Info</h3>
      <textarea
        value={draftInfo}
        onChange={(e) => setDraftInfo(e.target.value)}
        rows={4}
        style={{ width: "100%" }}
      />

      <hr />
      <button
        onClick={saveChanges}
        disabled={saving}
        style={{ background: "green", color: "white", padding: "8px 12px", border: "none", cursor: "pointer", marginRight: 10 }}
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <button
        onClick={deleteRelease}
        style={{ background: "red", color: "white", padding: "8px 12px", border: "none", cursor: "pointer" }}
      >
        Delete Release
      </button>
    </div>
  );
}