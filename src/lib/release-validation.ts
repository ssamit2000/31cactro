import { RELEASE_STEPS } from "@/lib/steps";

const releaseStepSet = new Set(RELEASE_STEPS);

export function validateReleaseInput(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Request body must be an object" } as const;
  }

  const input = body as Record<string, unknown>;
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const date = typeof input.date === "string" ? input.date : "";
  const additionalInfo =
    input.additionalInfo == null
      ? null
      : typeof input.additionalInfo === "string"
        ? input.additionalInfo.trim()
        : undefined;

  if (!name) return { error: "Name is required" } as const;
  if (name.length > 200) return { error: "Name must be 200 characters or fewer" } as const;
  if (!date || Number.isNaN(Date.parse(date))) return { error: "A valid date is required" } as const;
  if (additionalInfo === undefined) return { error: "Additional info must be a string" } as const;

  return { name, date: new Date(date), additionalInfo } as const;
}

export function validateCompletedSteps(value: unknown) {
  if (!Array.isArray(value) || !value.every((step) => typeof step === "string")) {
    return { error: "completedSteps must be an array of strings" } as const;
  }

  const steps = [...new Set(value)];
  const invalidStep = steps.find((step) => !releaseStepSet.has(step));
  if (invalidStep) {
    return { error: `Invalid release step: ${invalidStep}` } as const;
  }

  return { steps } as const;
}
