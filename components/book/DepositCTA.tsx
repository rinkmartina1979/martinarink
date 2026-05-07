"use client";

import { useState } from "react";

export function DepositCTA() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();

      if (!res.ok || !data.url) {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-[1px] bg-plum text-cream uppercase tracking-[0.18em] font-medium text-[0.75rem] px-7 py-4 md:px-10 md:py-[18px] transition-colors duration-300 ease-out hover:bg-plum-deep disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Redirecting…" : "Reserve with €450 deposit →"}
      </button>
      {error && (
        <p className="mt-3 text-[13px] text-plum">{error}</p>
      )}
    </div>
  );
}
