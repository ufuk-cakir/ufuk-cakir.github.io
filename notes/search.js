const notesSearchEntries = [
  {
    title: "Bellman equation",
    href: "index.html#bellman-equation",
    status: "planned",
    terms: "dynamic programming optimality fixed point backup"
  },
  {
    title: "Markov decision process",
    href: "markov-decision-process.html",
    status: "seed entry",
    terms: "mdp state action reward transition policy controlled markov chain"
  },
  {
    title: "Q-learning",
    href: "index.html#q-learning",
    status: "planned",
    terms: "off policy control action value temporal difference"
  },
  {
    title: "Temporal-difference learning",
    href: "index.html#temporal-difference-learning",
    status: "planned",
    terms: "td bootstrapping prediction sarsa q learning"
  },
  {
    title: "Value function",
    href: "index.html#value-function",
    status: "planned",
    terms: "return v function expected discounted reward"
  }
];

const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "");

const fuzzyScore = (entry, query) => {
  const q = normalize(query);
  const haystack = normalize(`${entry.title} ${entry.terms}`);

  if (!q) return entry.status === "seed entry" ? 2 : 1;
  if (normalize(entry.title) === q) return 100;
  if (normalize(entry.title).startsWith(q)) return 80;
  if (haystack.includes(q)) return 60;

  let qi = 0;
  for (const char of haystack) {
    if (char === q[qi]) qi += 1;
    if (qi === q.length) return 30 + q.length;
  }
  return 0;
};

document.querySelectorAll("[data-search-root]").forEach((root) => {
  const input = root.querySelector("[data-search-input]");
  const results = root.querySelector("[data-search-results]");

  const render = () => {
    const query = input.value.trim();
    const matches = notesSearchEntries
      .map((entry) => ({ entry, score: fuzzyScore(entry, query) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    results.innerHTML = "";

    if (!matches.length) {
      const item = document.createElement("li");
      const empty = document.createElement("span");
      empty.textContent = "No matching entry";
      item.append(empty);
      results.append(item);
      results.hidden = false;
      return;
    }

    matches.forEach(({ entry }) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const status = document.createElement("small");

      link.href = entry.href;
      link.append(document.createTextNode(entry.title));
      link.append(document.createTextNode(" "));
      status.textContent = entry.status;
      link.append(status);
      item.append(link);
      results.append(item);
    });

    results.hidden = false;
  };

  input.addEventListener("input", render);
  input.addEventListener("focus", render);
  input.addEventListener("keydown", (event) => {
    const first = results.querySelector("a");
    if (event.key === "Enter" && first) {
      event.preventDefault();
      window.location.href = first.href;
    }
    if (event.key === "Escape") {
      results.hidden = true;
      input.blur();
    }
  });

  root.addEventListener("submit", (event) => {
    const first = results.querySelector("a");
    if (first) {
      event.preventDefault();
      window.location.href = first.href;
    }
  });

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) results.hidden = true;
  });
});
