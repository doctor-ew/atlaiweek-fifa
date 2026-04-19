import { MatchesSchema as MatchArraySchema } from "../src/lib/matches";
import matchesData from "../public/matches.json";

const result = MatchArraySchema.safeParse(matchesData);

if (!result.success) {
  console.error("matches.json validation failed:");
  console.error(result.error.flatten());
  process.exit(1);
}

console.log(`✓ matches.json valid — ${result.data.length} matches`);
result.data.forEach((m) => {
  console.log(`  ${m.match_id}: ${m.team_a} vs ${m.team_b} (${m.kickoff_utc})`);
});
