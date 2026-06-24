/**
 * scripts/seed-learn.ts
 *
 * Seeds the seven "Facts about Alcohol & Women" clinical education blocks
 * into Sanity as learnArticle documents.
 *
 * Content authored by Ruta Nürnberger, patent engineer and clinical partner.
 *
 * Run once from the project root (after configuring env):
 *   npx dotenv -e .env.local -- npx tsx scripts/seed-learn.ts
 *
 * The script is idempotent: it upserts by _id, so re-running is safe.
 */

import { createClient } from "@sanity/client";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "").replace(/[^a-z0-9-]/g, "").trim();
const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production").trim();
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2026-02-01",
  token,
  useCdn: false,
});

interface ArticleSeed {
  _id: string;
  _type: "learnArticle";
  title: string;
  titleDe: string;
  slug: { _type: "slug"; current: string };
  category: string;
  bodyEn: string;
  bodyDe: string;
  attribution: string;
  programme: string;
  sortOrder: number;
}

const articles: ArticleSeed[] = [
  {
    _id: "learn-physiological",
    _type: "learnArticle",
    title: "How Alcohol Affects the Female Body",
    titleDe: "Wie Alkohol den weiblichen Körper beeinflusst",
    slug: { _type: "slug", current: "how-alcohol-affects-the-female-body" },
    category: "physiological",
    bodyEn: `Women process alcohol differently from men — not just in degree, but in kind.

The same drink hits a woman's bloodstream faster and at higher concentration. This is because women have a lower proportion of body water relative to total body weight, which means alcohol is diluted less before it reaches the bloodstream. Women also have lower levels of alcohol dehydrogenase (ADH) — the primary enzyme responsible for metabolising alcohol in the stomach — so more alcohol passes directly into the blood before the body can break it down.

The result: a woman drinking the same amount as a man will reach a blood alcohol concentration 30–50% higher, even after adjusting for body weight. She will feel the effects sooner, more intensely, and for longer.

This is not a weakness. It is biology — and understanding it clearly is the first step to working with your body rather than against it.`,
    bodyDe: `Frauen verarbeiten Alkohol anders als Männer — nicht nur in Ausmaß, sondern grundsätzlich anders.

Derselbe Drink gelangt schneller und in höherer Konzentration in den Blutkreislauf einer Frau. Dies liegt daran, dass Frauen einen geringeren Anteil an Körperwasser im Verhältnis zum Gesamtkörpergewicht haben, was bedeutet, dass Alkohol weniger verdünnt wird, bevor er ins Blut gelangt. Frauen haben auch niedrigere Spiegel der Alkohol-Dehydrogenase (ADH) — dem primären Enzym, das für den Alkoholabbau im Magen verantwortlich ist — sodass mehr Alkohol direkt ins Blut gelangt, bevor der Körper ihn abbauen kann.

Das Ergebnis: Eine Frau, die dieselbe Menge trinkt wie ein Mann, erreicht eine 30–50 % höhere Blutalkoholkonzentration, selbst nach Anpassung an das Körpergewicht. Sie spürt die Wirkung früher, intensiver und länger.

Das ist keine Schwäche. Es ist Biologie — und dieses Wissen klar zu verstehen, ist der erste Schritt, um mit dem eigenen Körper zu arbeiten, anstatt gegen ihn.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 10,
  },
  {
    _id: "learn-hormonal",
    _type: "learnArticle",
    title: "Alcohol and the Hormonal Cycle",
    titleDe: "Alkohol und der Hormonzyklus",
    slug: { _type: "slug", current: "alcohol-and-the-hormonal-cycle" },
    category: "hormonal",
    bodyEn: `Alcohol does not interact with the female body uniformly across the month. The hormonal cycle matters.

In the luteal phase — the two weeks before menstruation — oestrogen levels drop and progesterone rises. This hormonal environment accelerates alcohol absorption and heightens its sedative and anxiolytic effects. Many women notice they feel drunk faster, sleep more disturbed, and experience more pronounced low mood the next day, during this phase.

Alcohol also disrupts oestrogen metabolism directly. It inhibits the liver enzymes responsible for breaking down oestrogen, which can lead to elevated oestrogen levels over time. Chronically elevated oestrogen is associated with increased risk of hormone-sensitive breast cancer — one reason why even moderate, consistent alcohol intake carries measurable risk for women.

Around menopause, alcohol can intensify hot flushes and night sweats by dilating blood vessels and disrupting thermoregulation. Sleep disruption — already a common feature of perimenopause — is made significantly worse.

The body keeps a precise hormonal balance. Alcohol is a disruptor of that balance, and the disruption is cumulative.`,
    bodyDe: `Alkohol interagiert nicht gleichmäßig mit dem weiblichen Körper — der Hormonzyklus spielt eine entscheidende Rolle.

In der Lutealphase — den zwei Wochen vor der Menstruation — sinkt der Östrogenspiegel, während Progesteron ansteigt. Dieses hormonelle Umfeld beschleunigt die Alkoholaufnahme und verstärkt die sedierenden und angstlösenden Wirkungen. Viele Frauen bemerken in dieser Phase, dass sie schneller betrunken werden, unruhiger schlafen und am nächsten Tag eine ausgeprägtere gedrückte Stimmung erleben.

Alkohol stört den Östrogenmetabolismus auch direkt. Er hemmt die Leberenzyme, die für den Abbau von Östrogen verantwortlich sind, was langfristig zu erhöhten Östrogenspiegeln führen kann. Chronisch erhöhtes Östrogen ist mit einem erhöhten Risiko für hormonempfindlichen Brustkrebs verbunden — ein Grund, warum selbst mäßiger, regelmäßiger Alkoholkonsum ein messbares Risiko für Frauen darstellt.

Rund um die Menopause kann Alkohol Hitzewallungen und Nachtschweiß verstärken, indem er Blutgefäße erweitert und die Thermoregulation stört. Schlafstörungen — ohnehin ein häufiges Merkmal der Perimenopause — werden dadurch deutlich verschlimmert.

Der Körper hält ein präzises hormonelles Gleichgewicht aufrecht. Alkohol ist ein Störer dieses Gleichgewichts, und die Störung ist kumulativ.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 20,
  },
  {
    _id: "learn-tolerance",
    _type: "learnArticle",
    title: "Tolerance and Dependence",
    titleDe: "Toleranz und Abhängigkeit",
    slug: { _type: "slug", current: "tolerance-and-dependence" },
    category: "tolerance",
    bodyEn: `Tolerance develops when the brain adapts to regular alcohol exposure by becoming less sensitive to it. What once produced a noticeable effect begins to require more — more to relax, more to feel the same relief, more to sleep.

This adaptation happens faster in women than in men. Research shows that women develop alcohol-related organ damage — to the liver, heart, and brain — at lower levels of consumption and after shorter periods of use than men. The clinical term for this is "telescoping": women progress from first use to dependence and to serious health consequences along a compressed timeline.

Dependence is a physical state. When the brain has adapted to a constant presence of alcohol, its absence creates a gap the nervous system fills with hyperactivity: anxiety, tremor, insomnia, and in severe cases, seizure. This is not a character failure. It is a neurological adjustment that the brain makes in response to a substance it has come to expect.

Recognising tolerance is one of the clearest early signals that the relationship with alcohol has changed — and that the body is asking for attention.`,
    bodyDe: `Toleranz entwickelt sich, wenn das Gehirn sich durch regelmäßige Alkoholexposition anpasst und weniger empfindlich darauf reagiert. Was früher eine spürbare Wirkung hatte, erfordert zunehmend mehr — mehr zum Entspannen, mehr für die gleiche Erleichterung, mehr zum Schlafen.

Diese Anpassung geschieht bei Frauen schneller als bei Männern. Studien zeigen, dass Frauen alkoholbedingte Organschäden — an Leber, Herz und Gehirn — bei niedrigeren Konsummengen und nach kürzeren Zeiträumen als Männer entwickeln. Der klinische Begriff dafür lautet "Telescoping": Frauen schreiten von der ersten Nutzung zur Abhängigkeit und zu ernsthaften Gesundheitsfolgen auf einem komprimierten Zeitrahmen voran.

Abhängigkeit ist ein körperlicher Zustand. Wenn sich das Gehirn an eine ständige Alkoholpräsenz angepasst hat, erzeugt dessen Fehlen eine Lücke, die das Nervensystem mit Hyperaktivität füllt: Angst, Zittern, Schlaflosigkeit und in schweren Fällen Krampfanfälle. Dies ist kein Charakterversagen. Es ist eine neurologische Anpassung, die das Gehirn als Reaktion auf eine Substanz vornimmt, die es erwartet hat.

Toleranz zu erkennen ist eines der klarsten frühen Signale, dass sich die Beziehung zum Alkohol verändert hat — und dass der Körper nach Aufmerksamkeit verlangt.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 30,
  },
  {
    _id: "learn-withdrawal",
    _type: "learnArticle",
    title: "What Withdrawal Looks Like",
    titleDe: "Was Entzug bedeutet",
    slug: { _type: "slug", current: "what-withdrawal-looks-like" },
    category: "withdrawal",
    bodyEn: `Alcohol withdrawal is a spectrum. For most people who drink regularly, stopping or significantly reducing feels uncomfortable but not dangerous. For some, it can be medically serious.

Mild withdrawal — the most common experience — includes anxiety, irritability, mild tremor, poor sleep, and heightened sensitivity to light and sound. These symptoms typically begin within 6–24 hours of the last drink and peak around 48–72 hours. They resolve, in most cases, within a week.

More significant withdrawal — affecting a smaller proportion of people with heavier, longer-term use — can include sweating, elevated heart rate and blood pressure, nausea, and in more severe cases, confusion or seizure. These presentations require medical supervision and should not be navigated alone.

If you are unsure which category applies to you, err toward caution. A brief conversation with a physician before reducing intake significantly is not an overreaction — it is information-gathering. Your body's history with alcohol is the guide.

This programme does not provide medical withdrawal management. If you have concerns about physical symptoms, please speak with your doctor.`,
    bodyDe: `Alkoholentzug ist ein Spektrum. Für die meisten Menschen, die regelmäßig trinken, fühlt sich das Aufhören oder deutliche Reduzieren unangenehm, aber nicht gefährlich an. Für manche kann es medizinisch ernst sein.

Milder Entzug — die häufigste Erfahrung — umfasst Angstzustände, Reizbarkeit, leichtes Zittern, schlechten Schlaf und erhöhte Empfindlichkeit gegenüber Licht und Geräuschen. Diese Symptome beginnen typischerweise innerhalb von 6–24 Stunden nach dem letzten Drink und erreichen ihren Höhepunkt nach etwa 48–72 Stunden. In den meisten Fällen klingen sie innerhalb einer Woche ab.

Bedeutsamerer Entzug — der einen kleineren Anteil von Menschen mit stärkerem, längerfristigem Konsum betrifft — kann Schwitzen, erhöhte Herzfrequenz und Blutdruck, Übelkeit und in schwereren Fällen Verwirrtheit oder Krampfanfälle umfassen. Diese Verläufe erfordern ärztliche Aufsicht und sollten nicht allein bewältigt werden.

Wenn Sie unsicher sind, welche Kategorie auf Sie zutrifft, neigen Sie zur Vorsicht. Ein kurzes Gespräch mit einem Arzt, bevor Sie die Aufnahme deutlich reduzieren, ist keine Überreaktion — es ist Informationsgewinnung. Die Geschichte Ihres Körpers mit Alkohol ist der Leitfaden.

Dieses Programm bietet kein medizinisches Entzugsmanagement. Wenn Sie Bedenken bezüglich körperlicher Symptome haben, wenden Sie sich bitte an Ihren Arzt.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 40,
  },
  {
    _id: "learn-social",
    _type: "learnArticle",
    title: "Social Pressures and Psychological Patterns",
    titleDe: "Sozialer Druck und psychologische Muster",
    slug: { _type: "slug", current: "social-pressures-and-psychological-patterns" },
    category: "social",
    bodyEn: `Alcohol occupies a particular social position for women — one that is both prescribed and policed in contradictory ways.

Women are expected, in many social contexts, to drink: at networking events, dinner parties, celebrations, after-work gatherings. Declining is often read as a statement — about sobriety, about personality, about being difficult. The question "why aren't you drinking?" is rarely asked of a man.

At the same time, women who drink too much are judged far more harshly than men in equivalent situations. The cultural double standard is precise and well-documented: moderation is expected, excess is a moral failing.

For many women, alcohol becomes entangled with identity — the sophisticated one who appreciates wine, the social one who can keep up, the relaxed mother who has earned her evening glass. These identities are real, and unpicking them takes time.

Psychologically, alcohol is frequently used to manage anxiety, transition between roles (professional to parent, public to private), and suppress emotions that feel unsafe to express directly. The glass of wine at the end of the day is often not about the wine — it is about permission to decompress.

Understanding the function alcohol is serving is more useful than judging its presence.`,
    bodyDe: `Alkohol nimmt für Frauen eine besondere gesellschaftliche Stellung ein — eine, die auf widersprüchliche Weise sowohl vorgeschrieben als auch kontrolliert wird.

In vielen sozialen Kontexten wird von Frauen erwartet, dass sie trinken: bei Netzwerkveranstaltungen, Dinnerpartys, Feiern, After-Work-Treffen. Ablehnen wird oft als Statement gelesen — über Nüchternheit, über Persönlichkeit, über Schwierigkeit. Die Frage "Warum trinkst du nicht?" wird einem Mann selten gestellt.

Gleichzeitig werden Frauen, die zu viel trinken, weitaus harscher beurteilt als Männer in ähnlichen Situationen. Der kulturelle Doppelstandard ist präzise und gut dokumentiert: Mäßigung wird erwartet, Übermaß ist ein moralisches Versagen.

Für viele Frauen wird Alkohol mit Identität verknüpft — die Weltgewandte, die Wein zu schätzen weiß, die Gesellige, die mithalten kann, die entspannte Mutter, die ihr Abendglas verdient hat. Diese Identitäten sind real, und sie zu entflechten braucht Zeit.

Psychologisch wird Alkohol häufig verwendet, um Angst zu bewältigen, zwischen Rollen zu wechseln (beruflich zu privat, öffentlich zu privat) und Emotionen zu unterdrücken, die sich unsicher anfühlen, direkt auszudrücken. Das Glas Wein am Ende des Tages dreht sich oft nicht um den Wein — es geht um die Erlaubnis, sich zu entspannen.

Die Funktion zu verstehen, die Alkohol erfüllt, ist nützlicher als seine Anwesenheit zu beurteilen.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 50,
  },
  {
    _id: "learn-long-term",
    _type: "learnArticle",
    title: "Long-term Health Considerations",
    titleDe: "Langfristige Gesundheitsaspekte",
    slug: { _type: "slug", current: "long-term-health-considerations" },
    category: "long-term",
    bodyEn: `The long-term health picture of regular alcohol use in women is not subtle.

Liver disease — including alcoholic fatty liver, hepatitis, and cirrhosis — progresses more rapidly in women than in men at equivalent levels of consumption. Women develop cirrhosis after fewer years of drinking and at lower daily amounts.

Breast cancer risk increases with alcohol use in a dose-dependent relationship: for every additional drink per day, risk rises by approximately 7–10%. This relationship holds even at low levels of consumption and is independent of other risk factors. Alcohol is classified by the International Agency for Research on Cancer as a Group 1 carcinogen — the highest risk category.

Cardiovascular effects are mixed. Light consumption may have mild protective effects on the heart. However, heavier use is associated with cardiomyopathy (weakened heart muscle), arrhythmia, and elevated blood pressure. Women develop alcohol-related cardiomyopathy at lower consumption levels than men.

Brain health: women show greater alcohol-related cognitive impairment and brain volume loss at lower consumption levels, and over shorter periods, than men. Recovery of cognitive function after stopping is possible — and is one of the most consistently reported benefits women notice within the first weeks of an alcohol-free period.

The body's capacity to repair is remarkable. Reduction and cessation have measurable benefits at any age.`,
    bodyDe: `Das langfristige Gesundheitsbild regelmäßigen Alkoholkonsums bei Frauen ist nicht subtil.

Lebererkrankungen — einschließlich alkoholischer Fettleber, Hepatitis und Zirrhose — schreiten bei Frauen bei gleichem Konsumniveau schneller voran als bei Männern. Frauen entwickeln Zirrhose nach weniger Trinkvjahren und bei niedrigeren Tagesmengen.

Das Brustkrebsrisiko steigt mit Alkoholkonsum in einer dosisabhängigen Beziehung: Für jeden zusätzlichen Drink pro Tag erhöht sich das Risiko um etwa 7–10 %. Diese Beziehung gilt auch bei niedrigem Konsum und ist unabhängig von anderen Risikofaktoren. Alkohol wird von der Internationalen Agentur für Krebsforschung als Karzinogen der Gruppe 1 eingestuft — der höchsten Risikokategorie.

Kardiovaskuläre Auswirkungen sind gemischt. Leichter Konsum kann milde schützende Wirkungen auf das Herz haben. Schwererer Konsum ist jedoch mit Kardiomyopathie (geschwächtem Herzmuskel), Arrhythmie und erhöhtem Blutdruck verbunden. Frauen entwickeln alkoholbedingte Kardiomyopathie bei niedrigeren Konsumniveaus als Männer.

Gehirngesundheit: Frauen zeigen bei niedrigeren Konsumniveaus und über kürzere Zeiträume stärkere alkoholbedingte kognitive Beeinträchtigungen und Hirnvolumsverlusst als Männer. Die Erholung der kognitiven Funktion nach dem Aufhören ist möglich — und ist eines der am häufigsten berichteten Vorteile, die Frauen innerhalb der ersten Wochen einer alkoholfreien Zeit bemerken.

Die Fähigkeit des Körpers zur Reparatur ist bemerkenswert. Reduktion und Aufgabe haben messbare Vorteile in jedem Alter.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 60,
  },
  {
    _id: "learn-summary",
    _type: "learnArticle",
    title: "What the Research Tells Us",
    titleDe: "Was die Forschung uns sagt",
    slug: { _type: "slug", current: "what-the-research-tells-us" },
    category: "summary",
    bodyEn: `The scientific consensus on women and alcohol has become clearer and less equivocal in recent years.

Women are not smaller men. The female body processes alcohol through distinct biological mechanisms — mechanisms that make women more vulnerable to alcohol-related harm at lower consumption levels, over shorter time periods, and with faster progression to serious consequence.

The risks are real and dose-dependent. They include liver disease, breast cancer, cardiovascular damage, cognitive decline, hormonal disruption, and accelerated dependence. None of this is theoretical; it is drawn from decades of epidemiological and clinical research.

At the same time, the body's capacity for adaptation and repair is also real. Within weeks of significant reduction or cessation: sleep improves, liver enzymes normalise, mood stabilises, skin clarity improves, and cognitive sharpness — the kind that many women notice has quietly diminished — begins to return.

This programme is built on two things: honest information and practical support. The facts are here not to alarm you, but to give you the clearest possible picture of what is happening in your body — so that the choices you make from this point forward are genuinely informed ones.`,
    bodyDe: `Der wissenschaftliche Konsens zu Frauen und Alkohol ist in den letzten Jahren klarer und eindeutiger geworden.

Frauen sind keine kleineren Männer. Der weibliche Körper verarbeitet Alkohol durch unterschiedliche biologische Mechanismen — Mechanismen, die Frauen anfälliger für alkoholbedingte Schäden bei niedrigeren Konsumniveaus, über kürzere Zeiträume und mit schnellerer Progression zu ernsthaften Folgen machen.

Die Risiken sind real und dosisabhängig. Sie umfassen Lebererkrankungen, Brustkrebs, kardiovaskuläre Schäden, kognitiven Abbau, hormonelle Störungen und beschleunigte Abhängigkeit. Nichts davon ist theoretisch; es stammt aus jahrzehntelanger epidemiologischer und klinischer Forschung.

Gleichzeitig ist auch die Fähigkeit des Körpers zur Anpassung und Reparatur real. Innerhalb von Wochen nach einer deutlichen Reduzierung oder dem Aufhören: Schlaf verbessert sich, Leberenzyme normalisieren sich, die Stimmung stabilisiert sich, die Hautklarheit verbessert sich, und geistige Schärfe — die Art, die viele Frauen bemerken, sich leise verringert hat — beginnt zurückzukehren.

Dieses Programm basiert auf zwei Dingen: ehrlichen Informationen und praktischer Unterstützung. Die Fakten sind hier nicht um Sie zu erschrecken, sondern um Ihnen das klarstmögliche Bild dessen zu geben, was in Ihrem Körper passiert — damit die Entscheidungen, die Sie von diesem Punkt an treffen, wirklich informiert sind.`,
    attribution: "Ruta Nürnberger",
    programme: "sober-muse",
    sortOrder: 70,
  },
];

async function seed() {
  console.log(`Seeding ${articles.length} learn articles to Sanity (${projectId}/${dataset})…`);

  const tx = client.transaction();
  for (const article of articles) {
    tx.createOrReplace(article);
  }

  try {
    const result = await tx.commit();
    console.log("✓ Seeded successfully:", result.results.length, "documents");
    for (const r of result.results) {
      console.log(`  · ${r.id}`);
    }
  } catch (err) {
    console.error("✗ Seed failed:", err);
    process.exit(1);
  }
}

seed();
