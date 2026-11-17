export interface SummarizeOptions {
  /** True when a key exists in localStorage. The key string never enters this function. */
  visitorKeyStored?: boolean;
}

export interface JobNoteSummary {
  summary: string;
  clientDraft: string;
  topic: string;
  followUp: string;
  sent: false;
  notice: string;
}

const TOPICS: { label: string; pattern: RegExp }[] = [
  {
    label: "plumbing",
    pattern: /\b(leaks?|leaking|weeping|pipes?|drains?|toilets?|wax rings?|shutoffs?|faucets?|sinks?)\b/i,
  },
  {
    label: "heating",
    pattern: /\b(furnaces?|thermostats?|boilers?|radiators?|no heat)\b/i,
  },
  {
    label: "electrical",
    pattern: /\b(outlets?|breakers?|switches?|fixtures?|wiring)\b/i,
  },
  {
    label: "roof and gutter",
    pattern: /\b(roofs?|shingles?|gutters?|flashing)\b/i,
  },
  {
    label: "carpentry",
    pattern: /\b(doors?|windows?|hinges?|locksets?)\b/i,
  },
];

const INTERNAL_PATTERN =
  /\b(internal\s*:|do not tell|don't tell|dont tell|not for the client|between us|our fault|we cracked|we broke|keep this off)\b/i;

const ROUGH_PATTERN = /\b(idiots?|stupid|incompetent|cheapskates?|lawsuits?|morons?)\b/i;

function splitSentences(text: string): string[] {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return [];
  const parts = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : [cleaned];
}

function clip(text: string, max: number): string {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = (lastSpace > 40 ? slice.slice(0, lastSpace) : slice).replace(/[.,;:\s]+$/, "");
  return `${cut}…`;
}

function topicFor(text: string): string {
  for (const topic of TOPICS) {
    if (topic.pattern.test(text)) return topic.label;
  }
  return "home repair";
}

function followUpFor(text: string): string {
  if (/\bhuman yes\b|\bwaiting for a (human|person|owner)\b/i.test(text)) {
    return "A person still needs to say yes before the next step.";
  }
  if (/\b(return visit|come back|schedule a)\b/i.test(text)) {
    return "A return visit is the likely next step.";
  }
  const negated = /\b(not|isn't|isnt|never|no)\b[^.]{0,40}\b(complete|finished|resolved)\b/i.test(text);
  if (!negated && /\b(complete|finished|resolved|all set)\b/i.test(text)) {
    return "The visit reads as finished.";
  }
  return "The next step is still open.";
}

function isHoldback(sentence: string): boolean {
  return INTERNAL_PATTERN.test(sentence) || ROUGH_PATTERN.test(sentence);
}

function noticeFor(visitorKeyStored: boolean, waiting: boolean): string {
  if (waiting) {
    const waitingNotice = "Nothing was sent. The desk is waiting for a note.";
    return visitorKeyStored
      ? `${waitingNotice} A visitor key is stored in this browser only. This build did not send the note or the key.`
      : waitingNotice;
  }
  const base = "Nothing was sent, posted, or billed. The summary ran on this machine.";
  return visitorKeyStored
    ? `${base} A visitor key is stored in this browser only. This build did not send the note or the key.`
    : base;
}

export function summarizeJobNote(note: string, options: SummarizeOptions = {}): JobNoteSummary {
  const visitorKeyStored = options.visitorKeyStored === true;
  const sentences = splitSentences(note);
  if (sentences.length === 0) {
    return {
      summary: "Paste an on-site note to draft a night-shift summary.",
      clientDraft: "",
      topic: "none",
      followUp: "",
      sent: false,
      notice: noticeFor(visitorKeyStored, true),
    };
  }

  const fullText = sentences.join(" ");
  const topic = topicFor(fullText);
  const followUp = followUpFor(fullText);
  const safeSentences = sentences.filter((sentence) => !isHoldback(sentence));
  const heldBack = safeSentences.length !== sentences.length;
  const heldLine = heldBack ? "An internal or rough line was held back from the client draft." : "";

  const topicalSentences = safeSentences.filter((sentence) =>
    TOPICS.some((candidate) => candidate.pattern.test(sentence)),
  );
  const quoted = (topicalSentences.length > 0 ? topicalSentences : safeSentences)
    .slice(0, 2)
    .map((sentence) => clip(sentence, 180));
  const summary = clip(
    [
      `Night-shift summary (${topic}).`,
      quoted.length > 0 ? quoted.join(" ") : "The note only had lines that should stay off the client draft.",
      followUp,
      heldLine,
    ]
      .filter(Boolean)
      .join(" "),
    480,
  );

  const topical = safeSentences.find((sentence) =>
    TOPICS.some((candidate) => candidate.pattern.test(sentence)),
  );
  const lead =
    safeSentences.length > 0
      ? clip(topical ?? safeSentences[0], 220)
      : "The note on file needs a person to choose what can be said.";

  const clientDraft = [
    "Hello from Hollow Pines Home Repair.",
    `We reviewed tonight's ${topic} note. ${lead}`,
    `${followUp} A person on our crew will confirm this wording before it is shared any further.`,
    "Thank you for your patience on the night shift.",
  ].join(" ");

  return {
    summary,
    clientDraft,
    topic,
    followUp,
    sent: false,
    notice: noticeFor(visitorKeyStored, false),
  };
}
