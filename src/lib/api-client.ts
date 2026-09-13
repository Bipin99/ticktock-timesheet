type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; details?: unknown };

async function request<T>(url: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: payload.error ?? "Something went wrong",
        details: payload.details,
      };
    }

    return { ok: true, data: payload as T };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

export function apiGet<T>(url: string) {
  return request<T>(url);
}

export function apiPost<T>(url: string, body: unknown) {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export function apiPut<T>(url: string, body: unknown) {
  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function apiDelete<T>(url: string) {
  return request<T>(url, { method: "DELETE" });
}
