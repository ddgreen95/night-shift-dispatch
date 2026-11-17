export type AgentStatus = "idle" | "working" | "waiting";

export interface DepartmentBase {
  id: string;
  name: string;
  building: string;
  role: string;
  blurb: string;
  position: [number, number, number];
  footprint: [number, number];
  height: number;
  body: string;
}

export interface Department extends DepartmentBase {
  status: AgentStatus;
  statusNote: string;
}

export interface ActivityEvent {
  id: string;
  at: string;
  departmentId: string;
  summary: string;
}

export interface SampleBeat {
  label: string;
  statuses: Record<string, AgentStatus>;
  notes: Record<string, string>;
  log: ActivityEvent[];
}

export const STATUS_META: Record<AgentStatus, { label: string; color: string; hint: string }> = {
  idle: { label: "Idle", color: "#8ea0b8", hint: "Quiet this beat" },
  working: { label: "Working", color: "#f0c36a", hint: "On a sample task" },
  waiting: { label: "Waiting for a human yes", color: "#e08a4f", hint: "Needs a person" },
};

export const DEPARTMENTS: DepartmentBase[] = [
  {
    id: "night-dispatcher",
    name: "Night Dispatcher",
    building: "Lantern Tower",
    role: "Routes overnight sample tickets",
    blurb: "Keeps the lot's sample calls in one order.",
    position: [0, 0, -0.2],
    footprint: [1.55, 1.55],
    height: 3.35,
    body: "#2c2638",
  },
  {
    id: "ticket-triage",
    name: "Ticket Triage",
    building: "Intake Cottage",
    role: "Sorts new sample calls",
    blurb: "Reads each sample ticket before it moves.",
    position: [-3.15, 0, 0.35],
    footprint: [1.9, 1.45],
    height: 1.7,
    body: "#3a2e32",
  },
  {
    id: "parts-runner",
    name: "Parts Runner",
    building: "Parts Shed",
    role: "Stages sample parts on the truck",
    blurb: "Walks the shed for the kit named on the note.",
    position: [3.2, 0, 0.55],
    footprint: [2.25, 1.45],
    height: 1.35,
    body: "#2a332c",
  },
  {
    id: "invoice-drafter",
    name: "Invoice Drafter",
    building: "Ledger Loft",
    role: "Prepares sample invoice wording",
    blurb: "Leaves a draft and waits for a quiet moment.",
    position: [-4.15, 0, -1.85],
    footprint: [1.7, 1.35],
    height: 2.25,
    body: "#332a38",
  },
  {
    id: "callback-keeper",
    name: "Callback Keeper",
    building: "Bell Porch",
    role: "Holds morning callback requests",
    blurb: "Writes down who asked for a morning ring.",
    position: [0.15, 0, 2.7],
    footprint: [2.4, 1.15],
    height: 1.2,
    body: "#2e3330",
  },
  {
    id: "review-requests",
    name: "Review Requests",
    building: "Thank-You Post",
    role: "Holds thank-you notes for a human yes",
    blurb: "Does not send a note until a person agrees.",
    position: [2.55, 0, -2.35],
    footprint: [1.45, 1.45],
    height: 1.85,
    body: "#3a3228",
  },
];

const openingLog: ActivityEvent[] = [
  {
    id: "open-dispatch",
    at: "02:14",
    departmentId: "night-dispatcher",
    summary: "Marked the Maple Lane sample ticket as en route.",
  },
  {
    id: "open-triage",
    at: "02:06",
    departmentId: "ticket-triage",
    summary: "Holding a priority sample call until a human says yes.",
  },
  {
    id: "open-parts",
    at: "01:51",
    departmentId: "parts-runner",
    summary: "Pulled a sample wax-ring kit for the Wren Cottage job.",
  },
  {
    id: "open-invoice",
    at: "01:22",
    departmentId: "invoice-drafter",
    summary: "Left the Cedar Court sample draft on the desk and went quiet.",
  },
  {
    id: "open-callback",
    at: "00:58",
    departmentId: "callback-keeper",
    summary: "Logged a morning callback for the porch-light sample visit.",
  },
  {
    id: "open-review",
    at: "00:40",
    departmentId: "review-requests",
    summary: "Parked a thank-you note until a human says yes.",
  },
];

export const SAMPLE_BEATS: SampleBeat[] = [
  {
    label: "02:14 · opening watch",
    statuses: {
      "night-dispatcher": "working",
      "ticket-triage": "waiting",
      "parts-runner": "working",
      "invoice-drafter": "idle",
      "callback-keeper": "idle",
      "review-requests": "waiting",
    },
    notes: {
      "night-dispatcher": "Coordinating the Maple Lane sample ticket.",
      "ticket-triage": "Needs a human yes on a priority sample call.",
      "parts-runner": "Staging a sample wax-ring kit.",
      "invoice-drafter": "Cedar Court sample draft is sitting still.",
      "callback-keeper": "Morning callback is written down.",
      "review-requests": "Thank-you note is waiting for a human yes.",
    },
    log: openingLog,
  },
  {
    label: "02:21 · triage has a yes",
    statuses: {
      "night-dispatcher": "working",
      "ticket-triage": "working",
      "parts-runner": "working",
      "invoice-drafter": "idle",
      "callback-keeper": "idle",
      "review-requests": "waiting",
    },
    notes: {
      "night-dispatcher": "Still routing the Maple Lane sample ticket.",
      "ticket-triage": "A person said yes. Sorting the priority sample call.",
      "parts-runner": "Still staging the sample wax-ring kit.",
      "invoice-drafter": "Cedar Court sample draft is sitting still.",
      "callback-keeper": "Morning callback is written down.",
      "review-requests": "Thank-you note is still waiting for a human yes.",
    },
    log: [
      {
        id: "yes-triage",
        at: "02:21",
        departmentId: "ticket-triage",
        summary: "A human said yes. Ticket Triage started sorting the priority sample call.",
      },
      ...openingLog,
    ],
  },
  {
    label: "02:36 · kit is on the truck",
    statuses: {
      "night-dispatcher": "working",
      "ticket-triage": "working",
      "parts-runner": "idle",
      "invoice-drafter": "working",
      "callback-keeper": "idle",
      "review-requests": "waiting",
    },
    notes: {
      "night-dispatcher": "Watching the lot while the kit sits on the truck.",
      "ticket-triage": "Priority sample call is in the working pile.",
      "parts-runner": "Sample wax-ring kit is staged. Shed is quiet.",
      "invoice-drafter": "Rewriting the Cedar Court sample draft in plain words.",
      "callback-keeper": "Morning callback is written down.",
      "review-requests": "Thank-you note is still waiting for a human yes.",
    },
    log: [
      {
        id: "kit-ready",
        at: "02:36",
        departmentId: "parts-runner",
        summary: "Left the sample wax-ring kit on the truck and stepped back.",
      },
      {
        id: "invoice-awake",
        at: "02:33",
        departmentId: "invoice-drafter",
        summary: "Picked up the Cedar Court sample draft for another pass.",
      },
      {
        id: "yes-triage",
        at: "02:21",
        departmentId: "ticket-triage",
        summary: "A human said yes. Ticket Triage started sorting the priority sample call.",
      },
      ...openingLog,
    ],
  },
];

export const SAMPLE_NOTE = [
  "Wren Cottage sample ticket, side gate off Maple Lane. Arrived 01:40.",
  "The kitchen sink supply is weeping at the shutoff. I closed the angle stop and set a pan underneath.",
  "The hall bath wax ring is tired and should be replaced on a return visit.",
  "Internal: do not tell the client the old flange was cracked when the toilet was shifted; say only that the seal needs another visit.",
  "Parts on the truck: one sample wax-ring kit. Need a human yes before we book Thursday morning.",
  "The household left the porch light on and was kind.",
].join(" ");

export function rosterForBeat(beat: SampleBeat): Department[] {
  return DEPARTMENTS.map((department) => {
    const status = beat.statuses[department.id];
    const statusNote = beat.notes[department.id];
    if (!status || !statusNote) {
      throw new Error(`Sample beat "${beat.label}" is missing ${department.id}.`);
    }
    return { ...department, status, statusNote };
  });
}

export function departmentName(id: string): string {
  return DEPARTMENTS.find((department) => department.id === id)?.name ?? "Unknown department";
}
