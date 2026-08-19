type HealthResponse = {
  ok?: boolean;
  database?: string;
};

export async function waitForHealth(origin: string, timeoutMs = 5_000): Promise<void> {
  const started = Date.now();
  let lastError: unknown;

  while (Date.now() - started < timeoutMs) {
    try {
      const res = await fetch(`${origin}/api/health`, { method: "GET" });
      if (res.ok) {
        const body = (await res.json()) as HealthResponse;
        if (body.ok === true && body.database === "ok") return;
        lastError = new Error(`Health not ready: ${JSON.stringify(body)}`);
      } else {
        lastError = new Error(`Health HTTP ${res.status}`);
      }
    } catch (err) {
      lastError = err;
    }
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  const detail = lastError instanceof Error ? lastError.message : String(lastError);
  throw new Error(`Timeout waiting for /api/health at ${origin} (${detail})`);
}
