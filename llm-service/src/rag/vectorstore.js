/**
 * Placeholder retrieval layer.
 *
 * Week 5 plan: embed a medical-FAQ + de-identified record-snippet corpus
 * into FAISS/ChromaDB, and replace `search()` below with a real
 * embedding-similarity lookup. Keeping the interface stable now means the
 * chatbot route doesn't need to change when the real vector store lands.
 */

const FAQ_CORPUS = [
  {
    id: "faq-1",
    text: "A persistent fever above 38.5C for more than 3 days should be evaluated by a doctor.",
  },
  {
    id: "faq-2",
    text: "Mild seasonal allergies can often be managed with antihistamines, but worsening symptoms warrant a visit.",
  },
  {
    id: "faq-3",
    text: "Chest pain, shortness of breath, or fainting are emergency symptoms — seek immediate care.",
  },
];

export function search(query, topK = 3) {
  // Naive keyword overlap scoring as a stand-in for embedding similarity.
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean);
  const scored = FAQ_CORPUS.map((doc) => {
    const docTerms = doc.text.toLowerCase();
    const score = terms.reduce((acc, t) => acc + (docTerms.includes(t) ? 1 : 0), 0);
    return { ...doc, score };
  });
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((d) => d.score > 0);
}
