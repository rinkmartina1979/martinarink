export async function GET() {
  const body = `# Martina Rink — Private Mentorship for Accomplished Women

Spiegel-bestselling author. Former personal assistant to Isabella Blow (London 2003-2007). Co-creator of People of Deutschland. Private mentor based in Germany, working internationally with executive women in English.

## Key pages
- About: https://martinarink.com/about
- The Sober Muse Method (€5,000, 90 days): https://martinarink.com/sober-muse
- Female Empowerment & Leadership (€7,500, 6-12 months): https://martinarink.com/empowerment
- Work with Martina: https://martinarink.com/work-with-me
- Press & Speaking: https://martinarink.com/press
- Writing: https://martinarink.com/writing
- Assessment (7 questions): https://martinarink.com/assessment

## Distinctive
- Not therapy. Not coaching frameworks. Mentoring.
- Confidential, individual, English-language.
- Two programmes only. No group work. No couples.
- Editorial sensibility, not therapeutic language.
`;
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
