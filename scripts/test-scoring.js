const assert = require("assert");

// Pure Scoring Algorithm under test
function calculatePredictionPoints(predHome, predAway, actualHome, actualAway) {
  const isExactHit = predHome === actualHome && predAway === actualAway;
  const predOutcome = predHome > predAway ? "HOME_WIN" : predHome < predAway ? "AWAY_WIN" : "DRAW";
  const actualOutcome = actualHome > actualAway ? "HOME_WIN" : actualHome < actualAway ? "AWAY_WIN" : "DRAW";
  const isOutcomeHit = predOutcome === actualOutcome;

  if (isExactHit) {
    return { points: 3, isExactHit: true, isOutcomeHit: true };
  } else if (isOutcomeHit) {
    return { points: 1, isExactHit: false, isOutcomeHit: true };
  } else {
    return { points: 0, isExactHit: false, isOutcomeHit: false };
  }
}

console.log("=== RUNNING SCORING ENGINE TESTS ===");

// Test 1: Exact Scoreline Hit (Home Win)
const t1 = calculatePredictionPoints(2, 1, 2, 1);
assert.strictEqual(t1.points, 3, "Test 1 Failed: Expected 3 points for exact hit");
assert.strictEqual(t1.isExactHit, true, "Test 1 Failed: Expected isExactHit to be true");
console.log("✔ Test 1 Passed: Exact score (2-1 vs 2-1) -> 3 PTS");

// Test 2: Exact Scoreline Hit (Draw)
const t2 = calculatePredictionPoints(2, 2, 2, 2);
assert.strictEqual(t2.points, 3, "Test 2 Failed: Expected 3 points for exact draw hit");
assert.strictEqual(t2.isExactHit, true, "Test 2 Failed: Expected isExactHit to be true");
console.log("✔ Test 2 Passed: Exact draw (2-2 vs 2-2) -> 3 PTS");

// Test 3: Correct Outcome (Different Score)
const t3 = calculatePredictionPoints(3, 1, 1, 0);
assert.strictEqual(t3.points, 1, "Test 3 Failed: Expected 1 point for correct outcome");
assert.strictEqual(t3.isExactHit, false, "Test 3 Failed: Expected isExactHit to be false");
assert.strictEqual(t3.isOutcomeHit, true, "Test 3 Failed: Expected isOutcomeHit to be true");
console.log("✔ Test 3 Passed: Correct outcome (3-1 vs 1-0) -> 1 PT");

// Test 4: Correct Draw Outcome (Different Score)
const t4 = calculatePredictionPoints(0, 0, 1, 1);
assert.strictEqual(t4.points, 1, "Test 4 Failed: Expected 1 point for correct draw");
assert.strictEqual(t4.isOutcomeHit, true, "Test 4 Failed: Expected isOutcomeHit to be true");
console.log("✔ Test 4 Passed: Correct draw outcome (0-0 vs 1-1) -> 1 PT");

// Test 5: Wrong Outcome
const t5 = calculatePredictionPoints(2, 1, 0, 2);
assert.strictEqual(t5.points, 0, "Test 5 Failed: Expected 0 points for incorrect prediction");
assert.strictEqual(t5.isOutcomeHit, false, "Test 5 Failed: Expected isOutcomeHit to be false");
console.log("✔ Test 5 Passed: Wrong outcome (2-1 vs 0-2) -> 0 PTS");

console.log("🎉 ALL SCORING ENGINE TESTS PASSED (5/5)!");
