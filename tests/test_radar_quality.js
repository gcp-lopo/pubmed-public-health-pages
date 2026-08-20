const assert = require("assert");
const fs = require("fs");
const path = require("path");

const {
  TOPICS,
  parseArticles,
  buildSearchUrl,
  applyTopicGate,
  mergeArticles,
  selectCandidates
} = require("../fetch_pubmed_data");

const fixture = fs.readFileSync(path.join(__dirname, "radar_quality_fixture.xml"), "utf8");
const parsed = parseArticles(fixture);

assert.strictEqual(parsed.length, 1);
assert.strictEqual(parsed[0].id, "99900001");
assert.strictEqual(parsed[0].pubDate, "2026-07-24");
assert.strictEqual(parsed[0].pubDateType, "electronic");
assert.strictEqual(parsed[0].issueDate, "2027-Jan-10");
assert.strictEqual(parsed[0].pubmedDate, "2026-07-25");

const labels = TOPICS.map(topic => topic.label);
assert(labels.includes("统计建模与试验设计方法"));
assert(labels.includes("生存与复杂事件结局方法"));
assert(labels.includes("因果推断、RWE 与卫生经济学"));
assert(!labels.includes("流行病学"));
assert(!labels.includes("生物统计与研究设计"));

for (const topic of TOPICS) {
  const url = new URL(buildSearchUrl(topic));
  const term = url.searchParams.get("term") || "";
  assert(term.includes('"last 14 days"[PDat]'));
}

const statsTopic = TOPICS.find(topic => topic.key === "statistical_methods");
const survivalTopic = TOPICS.find(topic => topic.key === "time_to_event");
const reproducibilityTopic = TOPICS.find(topic => topic.key === "reproducibility");

const genericScopingReview = {
  id: "1",
  title: "Virtual patients and empathy: a scoping review",
  abstract: "This review discusses study design and reports descriptive findings.",
  topics: [],
};
assert.strictEqual(applyTopicGate(genericScopingReview, statsTopic), null);

const elasticNetPaper = {
  id: "2",
  title: "Elastic net regularization for high-dimensional clinical prediction",
  abstract: "A simulation study compares penalized regression strategies.",
  topics: [],
};
const gatedElastic = applyTopicGate(elasticNetPaper, statsTopic);
assert(gatedElastic);
assert(gatedElastic.relevanceScore >= 3);

const winRatioPaper = {
  id: "3",
  title: "Win ratio methods for hierarchical clinical outcomes",
  abstract: "We compare inference strategies for the win ratio.",
  topics: [],
};
assert(applyTopicGate(winRatioPaper, survivalTopic));

const questionnairePaper = {
  id: "4",
  title: "Cross-cultural adaptation, reproducibility, and validation of a questionnaire",
  abstract: "Measurement reproducibility and reliability were assessed.",
  topics: [],
};
assert.strictEqual(applyTopicGate(questionnairePaper, reproducibilityTopic), null);

const reproducibleWorkflowPaper = {
  id: "5",
  title: "A reproducible workflow for clinical data analysis",
  abstract: "The workflow uses version control and scripted analysis.",
  topics: [],
};
assert(applyTopicGate(reproducibleWorkflowPaper, reproducibilityTopic));

const merged = mergeArticles([
  [{ ...gatedElastic, topics: ["A"], topicKeys: ["a"], suggestedAngles: ["x"] }],
  [{ ...gatedElastic, topics: ["B"], topicKeys: ["b"], suggestedAngles: ["y"], relevanceScore: 4 }],
]);
assert.strictEqual(merged.length, 1);
assert.deepStrictEqual(new Set(merged[0].topics), new Set(["A", "B"]));
assert.strictEqual(merged[0].relevanceScore, gatedElastic.relevanceScore + 4);

const diversityInput = [
  ...Array.from({ length: 5 }, (_, index) => ({ id: `heor-${index}`, topicKeys: ["causal_rwe_heor"] })),
  ...Array.from({ length: 2 }, (_, index) => ({ id: `survival-${index}`, topicKeys: ["time_to_event"] })),
];
const selected = selectCandidates(diversityInput);
assert.strictEqual(selected.filter(item => item.topicKeys[0] === "causal_rwe_heor").length, 3);
assert.strictEqual(selected.filter(item => item.topicKeys[0] === "time_to_event").length, 2);
assert.strictEqual(selected.length, 5);

console.log("PubMed radar quality tests passed.");
