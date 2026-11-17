import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

function checkIgnore(path) {
  try {
    execFileSync("git", ["check-ignore", "-q", path], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function gitLines(args) {
  try {
    const out = execFileSync("git", args, { encoding: "utf8" }).trim();
    return out ? out.split("\n").filter(Boolean) : [];
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`GUARD: git failed (${args.join(" ")}): ${message}`);
    process.exit(1);
  }
}

if (!existsSync(".gitignore")) {
  console.error("GUARD: .gitignore is missing. Add a rule for .env.");
  process.exit(1);
}

if (!checkIgnore(".env")) {
  console.error("GUARD: .env is not gitignored. Add .env to .gitignore.");
  process.exit(1);
}

if (!checkIgnore(".env.local")) {
  console.error("GUARD: .env.local is not gitignored.");
  process.exit(1);
}

const kiroProbe = ".kiro/steering/product.md";
if (checkIgnore(kiroProbe)) {
  console.error("GUARD: /.kiro is gitignored. Specs and steering must stay committed.");
  process.exit(1);
}

const tracked = gitLines(["ls-files", ".kiro"]);
if (tracked.length === 0) {
  console.error("GUARD: /.kiro is not in the git index. Add and commit it.");
  process.exit(1);
}

const untracked = gitLines(["ls-files", "--others", "--exclude-standard", ".kiro"]);
if (untracked.length > 0) {
  console.error("GUARD: /.kiro has untracked files. Commit them:");
  for (const file of untracked) console.error(`  ${file}`);
  process.exit(1);
}

console.log(`GUARD: .env is gitignored and /.kiro is tracked (${tracked.length} files).`);
