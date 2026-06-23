"use client";

import { useState } from "react";

export function CustomerPortalButton({ token }: { token: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function open() {
    if (loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/members/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error ?? "Could not open billing portal.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={open}
        disabled={loading}
        className="inline-block border border-plum text-plum text-[12px] uppercase tracking-[0.18em] px-6 py-2.5 rounded-[1px] hover:bg-plum hover:text-cream transition-colors duration-200 disabled:opacity-60 cursor-pointer"
      >
        {loading ? "Opening…" : "Manage billing"}
      </button>
      {error && (
        <p className="mt-3 text-[13px] text-pink font-[family-name:var(--font-body)]">{error}</p>
      )}
    </div>
  );
}
