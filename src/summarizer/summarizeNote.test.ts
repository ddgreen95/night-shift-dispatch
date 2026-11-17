import { describe, expect, it } from "vitest";
import { summarizeJobNote } from "./summarizeNote";

const WREN_NOTE = [
  "Wren Cottage sample ticket, side gate off Maple Lane.",
  "The kitchen sink supply is weeping at the shutoff.",
  "I closed the angle stop and set a pan underneath.",
  "Internal: do not tell the client the old flange was cracked when the toilet was shifted.",
  "Need a human yes before we book a return visit.",
].join(" ");

describe("summarizeJobNote", () => {
  it("asks for a note when the desk is empty", () => {
    const result = summarizeJobNote("  \n\t ");
    expect(result.clientDraft).toBe("");
    expect(result.summary).toMatch(/paste an on-site note/i);
    expect(result.topic).toBe("none");
    expect(result.sent).toBe(false);
    expect(result.notice).toMatch(/nothing was sent/i);
  });

  it("returns the same summary and draft for the same note", () => {
    expect(summarizeJobNote(WREN_NOTE)).toEqual(summarizeJobNote(WREN_NOTE));
  });

  it("keeps a long note shorter than the source", () => {
    const sentence = "The kitchen sink is weeping at the shutoff and the pan is already in place.";
    const note = Array.from({ length: 14 }, () => sentence).join(" ");
    const result = summarizeJobNote(note);
    expect(result.summary.length).toBeLessThan(note.length);
    expect(result.topic).toBe("plumbing");
    expect(result.sent).toBe(false);
  });

  it("holds internal wording out of the client-safe draft", () => {
    const result = summarizeJobNote(WREN_NOTE);
    expect(result.clientDraft.toLowerCase()).not.toContain("cracked");
    expect(result.clientDraft.toLowerCase()).not.toContain("do not tell");
    expect(result.clientDraft.toLowerCase()).not.toContain("flange");
    expect(result.clientDraft).toMatch(/Hollow Pines Home Repair/);
    expect(result.clientDraft).toMatch(/human yes|person still needs to say yes/i);
    expect(result.summary).toMatch(/held back/i);
    expect(result.topic).toBe("plumbing");
  });

  it("drops rough wording from both the summary and the draft", () => {
    const result = summarizeJobNote(
      "The hall outlet is dead and the breaker was reset. The last pass was handled by an idiot.",
    );
    expect(result.summary.toLowerCase()).not.toContain("idiot");
    expect(result.clientDraft.toLowerCase()).not.toContain("idiot");
    expect(result.topic).toBe("electrical");
    expect(result.summary).toMatch(/held back/i);
  });

  it("does not treat a negated finish as a completed visit", () => {
    const result = summarizeJobNote("The furnace is quiet and there is no heat. The visit is not finished.");
    expect(result.topic).toBe("heating");
    expect(result.followUp).not.toMatch(/reads as finished/i);
  });

  it("keeps the words stable when a visitor key is only flagged as stored", () => {
    const plain = summarizeJobNote(WREN_NOTE, { visitorKeyStored: false });
    const flagged = summarizeJobNote(WREN_NOTE, { visitorKeyStored: true });
    expect(flagged.summary).toBe(plain.summary);
    expect(flagged.clientDraft).toBe(plain.clientDraft);
    expect(flagged.sent).toBe(false);
    expect(flagged.notice).toMatch(/did not send the note or the key/i);
    expect(flagged.notice).not.toContain("hollow-pines.night-shift.visitor-key");
  });
});
