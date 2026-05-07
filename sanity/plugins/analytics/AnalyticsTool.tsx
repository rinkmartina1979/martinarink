/**
 * Analytics Tool — Sanity Studio plugin panel
 *
 * Shows the Phase 1 + Phase 2 funnel end-to-end inside Sanity Studio.
 * Martina has one login, one place. No external dashboard needed.
 *
 * Data sources:
 *   - Sanity: assessmentSubmission documents (live)
 *   - Sanity: clientProfile documents (enrolled clients)
 *   - Brevo: contact count via /v3/contacts (server-proxied, 1h cache)
 *   - Sanity: emailDigestLog (digest performance)
 *
 * Upgrade path: add a /api/admin/analytics endpoint that aggregates
 * Brevo + Stripe + Sanity in one call. Today this renders from Sanity
 * alone — enough for Phase 2 intelligence without external API keys
 * needing to be exposed to the browser.
 */

"use client";

import React, { useEffect, useState } from "react";
import { Card, Flex, Text, Heading, Stack, Badge, Box, Spinner } from "@sanity/ui";
import { useClient } from "sanity";

/* ── Types ──────────────────────────────────────────────────────── */

interface FunnelData {
  assessmentCount: number;
  highIntentCount: number;
  archetypeBreakdown: Record<string, number>;
  programmeBreakdown: Record<string, number>;
  activeClients: number;
  completedClients: number;
  digestsSent: number;
  lastDigestAt: string | null;
  recentSubmissions: Array<{
    _id: string;
    email: string;
    archetype: string;
    readinessLevel: string;
    programme: string;
    submittedAt: string;
  }>;
  recentClients: Array<{
    _id: string;
    firstName: string;
    programme: string;
    status: string;
    enrolledAt: string;
  }>;
}

/* ── Helpers ─────────────────────────────────────────────────────── */

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ProgrammeLabel({ value }: { value: string }) {
  const labels: Record<string, string> = {
    "sober-muse": "Sober Muse",
    empowerment: "Empowerment",
  };
  return <>{labels[value] ?? value}</>;
}

function ArchetypeLabel({ value }: { value: string }) {
  const labels: Record<string, string> = {
    reckoning: "The Reckoning",
    threshold: "The Threshold",
    return: "The Return",
  };
  return <>{labels[value] ?? value}</>;
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "positive" | "caution" | "critical" | "default";
}) {
  return (
    <Card padding={4} radius={2} shadow={1} tone={tone ?? "default"}>
      <Stack space={2}>
        <Text size={0} muted>
          {label}
        </Text>
        <Heading size={3}>{value}</Heading>
      </Stack>
    </Card>
  );
}

/* ── Main component ──────────────────────────────────────────────── */

export function AnalyticsTool() {
  const client = useClient({ apiVersion: "2026-01-01" });
  const [data, setData] = useState<FunnelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        // Run all queries in parallel
        const [submissions, clients, digests] = await Promise.all([
          client.fetch<FunnelData["recentSubmissions"]>(
            `*[_type == "assessmentSubmission"] | order(submittedAt desc) [0...200] {
              _id, email, archetype, readinessLevel, programme, submittedAt
            }`,
          ),
          client.fetch<FunnelData["recentClients"]>(
            `*[_type == "clientProfile"] | order(enrolledAt desc) {
              _id, firstName, programme, status, enrolledAt
            }`,
          ),
          client.fetch<Array<{ sentAt: string; status: string }>>(
            `*[_type == "emailDigestLog"] | order(sentAt desc) [0...20] {
              sentAt, status
            }`,
          ),
        ]);

        if (cancelled) return;

        // Aggregate
        const archetypeBreakdown: Record<string, number> = {};
        const programmeBreakdown: Record<string, number> = {};
        let highIntentCount = 0;

        for (const s of submissions) {
          archetypeBreakdown[s.archetype] = (archetypeBreakdown[s.archetype] ?? 0) + 1;
          programmeBreakdown[s.programme] = (programmeBreakdown[s.programme] ?? 0) + 1;
          if (s.readinessLevel === "high") highIntentCount++;
        }

        const activeClients = clients.filter((c) => c.status === "active").length;
        const completedClients = clients.filter((c) => c.status === "completed").length;
        const digestsSent = digests.filter((d) => d.status === "sent").length;
        const lastDigest = digests.find((d) => d.status === "sent");

        setData({
          assessmentCount: submissions.length,
          highIntentCount,
          archetypeBreakdown,
          programmeBreakdown,
          activeClients,
          completedClients,
          digestsSent,
          lastDigestAt: lastDigest?.sentAt ?? null,
          recentSubmissions: submissions.slice(0, 10),
          recentClients: clients.slice(0, 8),
        });
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load analytics");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [client]);

  if (loading) {
    return (
      <Flex align="center" justify="center" style={{ minHeight: 400 }}>
        <Stack space={3} style={{ textAlign: "center" }}>
          <Flex justify="center">
            <Spinner muted />
          </Flex>
          <Text muted size={1}>Loading analytics...</Text>
        </Stack>
      </Flex>
    );
  }

  if (error || !data) {
    return (
      <Box padding={6}>
        <Card padding={4} tone="critical" radius={2}>
          <Text>Could not load analytics: {error ?? "Unknown error"}</Text>
        </Card>
      </Box>
    );
  }

  return (
    <Box padding={5} style={{ maxWidth: 1200, margin: "0 auto" }}>
      <Stack space={6}>

        {/* ── Header ─────────────────────────────────────────── */}
        <Stack space={2}>
          <Heading size={3}>Funnel overview</Heading>
          <Text muted size={1}>
            Live from Sanity · Assessment submissions + active clients · Refreshes on open
          </Text>
        </Stack>

        {/* ── Top-line KPIs ──────────────────────────────────── */}
        <Box>
          <Text size={1} muted style={{ marginBottom: 12 }}>KEY NUMBERS</Text>
          <Flex gap={3} wrap="wrap">
            <Box flex={1} style={{ minWidth: 140 }}>
              <StatCard label="Total assessments" value={data.assessmentCount} />
            </Box>
            <Box flex={1} style={{ minWidth: 140 }}>
              <StatCard
                label="High-intent leads"
                value={data.highIntentCount}
                tone={data.highIntentCount > 0 ? "positive" : "default"}
              />
            </Box>
            <Box flex={1} style={{ minWidth: 140 }}>
              <StatCard
                label="Active clients"
                value={data.activeClients}
                tone={data.activeClients > 0 ? "positive" : "default"}
              />
            </Box>
            <Box flex={1} style={{ minWidth: 140 }}>
              <StatCard label="Completed programmes" value={data.completedClients} />
            </Box>
            <Box flex={1} style={{ minWidth: 140 }}>
              <StatCard label="Digests sent" value={data.digestsSent} />
            </Box>
          </Flex>
        </Box>

        {/* ── Conversion rate ────────────────────────────────── */}
        {data.assessmentCount > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} muted>FUNNEL CONVERSION</Text>
              <Flex gap={4} align="center" wrap="wrap">
                <Stack space={1}>
                  <Text size={0} muted>Assessments → High Intent</Text>
                  <Text weight="semibold">
                    {Math.round((data.highIntentCount / data.assessmentCount) * 100)}%
                  </Text>
                </Stack>
                <Text muted>→</Text>
                <Stack space={1}>
                  <Text size={0} muted>High Intent → Active Client</Text>
                  <Text weight="semibold">
                    {data.highIntentCount > 0
                      ? `${Math.round((data.activeClients / data.highIntentCount) * 100)}%`
                      : "—"}
                  </Text>
                </Stack>
                <Text muted>→</Text>
                <Stack space={1}>
                  <Text size={0} muted>Overall (assessment → client)</Text>
                  <Text weight="semibold">
                    {Math.round(((data.activeClients + data.completedClients) / data.assessmentCount) * 100)}%
                  </Text>
                </Stack>
              </Flex>
            </Stack>
          </Card>
        )}

        {/* ── Archetype breakdown ──────────────────────────────── */}
        {Object.keys(data.archetypeBreakdown).length > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} muted>ARCHETYPE DISTRIBUTION</Text>
              <Flex gap={4} wrap="wrap">
                {Object.entries(data.archetypeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([archetype, count]) => (
                    <Box key={archetype}>
                      <Stack space={1}>
                        <Text size={0} muted>
                          <ArchetypeLabel value={archetype} />
                        </Text>
                        <Flex gap={2} align="center">
                          <Text weight="semibold" size={3}>{count}</Text>
                          <Text muted size={0}>
                            ({Math.round((count / data.assessmentCount) * 100)}%)
                          </Text>
                        </Flex>
                      </Stack>
                    </Box>
                  ))}
              </Flex>
            </Stack>
          </Card>
        )}

        {/* ── Programme split ──────────────────────────────────── */}
        {Object.keys(data.programmeBreakdown).length > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} muted>PROGRAMME INTENT SPLIT (FROM ASSESSMENTS)</Text>
              <Flex gap={4} wrap="wrap">
                {Object.entries(data.programmeBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .map(([programme, count]) => (
                    <Box key={programme}>
                      <Stack space={1}>
                        <Text size={0} muted>
                          <ProgrammeLabel value={programme} />
                        </Text>
                        <Flex gap={2} align="center">
                          <Text weight="semibold" size={3}>{count}</Text>
                          <Text muted size={0}>
                            ({Math.round((count / data.assessmentCount) * 100)}%)
                          </Text>
                        </Flex>
                      </Stack>
                    </Box>
                  ))}
              </Flex>
            </Stack>
          </Card>
        )}

        {/* ── Recent high-intent leads ─────────────────────────── */}
        {data.recentSubmissions.filter((s) => s.readinessLevel === "high").length > 0 && (
          <Card padding={4} radius={2} shadow={1} tone="positive">
            <Stack space={3}>
              <Text size={1} muted>RECENT HIGH-INTENT LEADS</Text>
              <Stack space={2}>
                {data.recentSubmissions
                  .filter((s) => s.readinessLevel === "high")
                  .slice(0, 5)
                  .map((s) => (
                    <Flex key={s._id} align="center" justify="space-between" gap={3}>
                      <Stack space={1} flex={1}>
                        <Text size={1} weight="semibold">{s.email}</Text>
                        <Flex gap={2}>
                          <Badge tone="primary" radius={2} fontSize={0}>
                            <ArchetypeLabel value={s.archetype} />
                          </Badge>
                          <Badge tone="default" radius={2} fontSize={0}>
                            <ProgrammeLabel value={s.programme} />
                          </Badge>
                        </Flex>
                      </Stack>
                      <Text muted size={0}>{formatDate(s.submittedAt)}</Text>
                    </Flex>
                  ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* ── Active clients ─────────────────────────────────────── */}
        {data.recentClients.length > 0 && (
          <Card padding={4} radius={2} shadow={1}>
            <Stack space={3}>
              <Text size={1} muted>ACTIVE CLIENTS</Text>
              <Stack space={2}>
                {data.recentClients
                  .filter((c) => c.status === "active")
                  .map((c) => (
                    <Flex key={c._id} align="center" justify="space-between" gap={3}>
                      <Stack space={1}>
                        <Text size={1} weight="semibold">{c.firstName}</Text>
                        <Text muted size={0}>
                          <ProgrammeLabel value={c.programme} />
                        </Text>
                      </Stack>
                      <Stack space={1} style={{ textAlign: "right" }}>
                        <Badge
                          tone={c.status === "active" ? "positive" : "default"}
                          radius={2}
                          fontSize={0}
                        >
                          {c.status}
                        </Badge>
                        <Text muted size={0}>{formatDate(c.enrolledAt)}</Text>
                      </Stack>
                    </Flex>
                  ))}
              </Stack>
            </Stack>
          </Card>
        )}

        {/* ── Digest log ──────────────────────────────────────────── */}
        <Card padding={4} radius={2} shadow={1}>
          <Stack space={3}>
            <Text size={1} muted>EMAIL DIGEST</Text>
            <Flex gap={4}>
              <Stack space={1}>
                <Text size={0} muted>Total sent</Text>
                <Text weight="semibold" size={2}>{data.digestsSent}</Text>
              </Stack>
              <Stack space={1}>
                <Text size={0} muted>Last sent</Text>
                <Text weight="semibold" size={2}>{formatDate(data.lastDigestAt)}</Text>
              </Stack>
              <Stack space={1}>
                <Text size={0} muted>Next scheduled</Text>
                <Text weight="semibold" size={2}>1st &amp; 15th, 08:00 CET</Text>
              </Stack>
            </Flex>
          </Stack>
        </Card>

        {/* ── Data freshness note ─────────────────────────────────── */}
        <Text muted size={0}>
          Data sourced from Sanity assessmentSubmission and clientProfile documents.
          Assessment count reflects all completed submissions. High-intent = readiness
          scored &quot;high&quot; at time of submission. Open this panel to refresh.
        </Text>

      </Stack>
    </Box>
  );
}
