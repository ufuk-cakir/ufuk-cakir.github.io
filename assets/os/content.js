/* ============================================================
   content.js — all of the real content for Ufuk Çakır's desktop.
   Plain JavaScript (no build step). Edit and refresh.

   Item fields (used across publications / projects / talks / outreach):
     title | name        headline
     venue | meta         e.g. "ML4PS @ NeurIPS"
     year                 "2024"
     blurb                1–3 sentence description (detail window)
     abstract             longer text (publications)
     keywords: []         tag chips
     media: {type, src}   "video" | "image" — sneak-peek preview
     links: [{label, href}]   buttons that open in a new tab
   An item with no blurb/abstract/media/keywords just opens its link.
   ============================================================ */

window.SITE = {
  identity: {
    name: "Ufuk Çakır",
    initial: "Ç",
    role: "DPhil · Intelligent Earth CDT · University of Oxford",
    roleShort: "DPhil · University of Oxford",
    tagline:
      "AI for the environment, with roots in physics, scientific machine learning, and galaxy morphology.",
    location: "Oxford",
    photo: "assets/images/ufuk-img.jpeg",
    photoThumb: "assets/os/portrait-thumb.jpg",
    scatter: { a: "Ufuk", b: "Çakır", c: "DPHIL · OXFORD · 2026" },
    currently: [
      "Thinking about how to tackle wildfire suppression.",
      "Training RL agents in our own JaxWildfire Simulator.",
    ],
  },

  links: {
    email: "ufukcakir@robots.ox.ac.uk",
    scholar:
      "https://scholar.google.com/citations?user=8K_Vt_0AAAAJ&hl=en&oi=sra",
    github: "https://github.com/ufuk-cakir",
    twitter: "https://twitter.com/ufuk_cakir_",
    linkedin: "https://www.linkedin.com/in/cakir-ufuk/",
    orcid: "https://orcid.org/0009-0005-9196-1986",
  },

  /* the Mail app */
  contact: {
    subject: "Hello Ufuk",
    blurb:
      "If you have any questions about my work, feel free to message me and I'll get back to you. :))",
  },

  about: {
    p: "DPhil student at the Intelligent Earth UKRI CDT in AI for the Environment, University of Oxford, working with the GOALS group at the Oxford Robotics Institute. I have a background in physics, with projects in scientific machine learning to study galaxy morphology, passive accoustic monitoring for endangered species, and wildfire suppression.",
  },

  /* Affiliation badges on the desktop (open a detail card). */
  groups: {
    ori: {
      title: "Oxford Robotics Institute — GOALS",
      venue: "Goal-Oriented Long-Lived Systems group",
      logo: "talks/logos/ori-logo.png",
      blurb:
        "I'm a DPhil student in the GOALS group (Goal-Oriented Long-Lived Systems) at the Oxford Robotics Institute, led by Prof. Nick Hawes. The group works on decision-making under uncertainty and long-term autonomy — planning for agents that must act well over long horizons in dynamic, uncertain environments.",
      keywords: ["decision-making", "uncertainty", "autonomy", "planning"],
      links: [
        { label: "GOALS group ↗", href: "https://ori.ox.ac.uk/labs/goals/" },
        { label: "Oxford Robotics Institute ↗", href: "https://ori.ox.ac.uk/" },
      ],
    },
    ie: {
      title: "Intelligent Earth CDT",
      venue: "UKRI CDT in AI for the Environment · Oxford",
      logo: "talks/logos/ie-logo.png",
      blurb:
        "My DPhil is part of Intelligent Earth, the UKRI Centre for Doctoral Training in AI for the Environment at the University of Oxford. This programme bridges environmental science and AI across climate, biodiversity, natural hazards, and environmental solutions, with students co-advised across departments.",
      keywords: ["AI for the environment", "CDT", "climate", "Oxford"],
      links: [
        {
          label: "Intelligent Earth CDT ↗",
          href: "https://www.ox.ac.uk/admissions/graduate/courses/intelligent-earth-cdt",
        },
      ],
    },
  },

  background: {
    heading: "Background",
    by: "~/Desktop/Background.txt",
    body: [
      {
        lead: true,
        text: "DPhil student at the Intelligent Earth UKRI CDT in AI for the Environment, University of Oxford, working with the GOALS group at the Oxford Robotics Institute.",
      },
      {
        text: "In physics class during school, we covered introductions to Quantum Physics. I remember I was so excited and confused when I was told how electrons behave in the double slit experiment. I was asking myself: How the hell do they know if they are observed or not? After a bachelors and masters degree in Physics from the University of Heidelberg, I think I still do not know the full answer.",
      },
      {
        text: "But I think it was these experience that sparked my interest in Science. Asking questions about the very foundations of Nature. Is that not exciting?",
      },
    ],
  },

  whyresearch: {
    heading: "Why Research?",
    by: "~/Desktop/Why Research?.txt — last edited just now",
    body: [
      {
        lead: true,
        text: "A personal note on what pulls me toward research",
      },
      {
        text: "I think this is always a very deep question to ask a scientist: What makes you want to do research?",
      },
      {
        text: "After finishing my Master of Science in Physics, it was clear that I wanted to do a PhD. I had done reserach and published papers in the field of computational astrophysics already, and I loved everything about the process or writing code to answer questions. Then the big Turkey-Syria Earthquake in 2023 hit. I know the exact moment, sitting in front of the TV, watching the News and asking myself: What can I do to prevent such suffering in the future?",
      },
      {
        ph: false,
        text: "When I saw that a new CDT at Oxford called Intelligent Earth had a specific stream dedicated to tackling Natural Hazard using AI approaches, it was a natural fit. So here we are.",
      },
    ],
  },

  publications: [
    {
      title: "GAMMA: Galactic Attributes of Mass, Metallicity and Age",
      venue: "ML4PS @ NeurIPS",
      year: "2023",
      abstract:
        "A dataset of 2D maps and 3D cubes for 11,727 galaxies capturing essential attributes (stellar age, metallicity and mass) tailored for machine-learning applications. It ships with an interactive dashboard for exploring the lower-dimensional image space. Accepted at the Machine Learning and the Physical Sciences workshop at NeurIPS 2023.",
      keywords: ["dataset", "astrophysics"],
      media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
      links: [
        {
          label: "Workshop @ NeurIPS ↗",
          href: "https://neurips.cc/virtual/2023/76114",
        },
        { label: "Project page ↗", href: "research/gamma.html" },
      ],
    },
    {
      title: "Eigengalaxies — ML models for galaxy morphology",
      venue: "B.Sc. thesis",
      year: "2022",
      abstract:
        "Using Principal Component Analysis to compute 'eigengalaxies' — the basis vectors of a transformed galaxy-image space — to encode the morphological information contained in state-of-the-art simulations. Built on data from the IllustrisTNG project.",
      keywords: ["astrophysics"],
      media: { type: "video", src: "assets/videos/eigen10.mp4" },
      links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }],
    },
    {
      title: "Evolutionary spectrogram optimization for bioacoustics",
      venue: "ML4RS @ ICLR (poster)",
      year: "2024",
      abstract:
        "A fully-tested, well-documented genetic algorithm that optimises bioacoustic spectrograms to enable real-time monitoring of critically endangered species. Developed with the Machine Learning for Ecology group at AIMS (Cape Town), funded by the Baden-Württemberg-Stipendium. Poster at the 2nd ML4RS Workshop, ICLR Vienna 2024.",
      keywords: ["bioacoustics", "genetic algorithm"],
      media: { type: "image", src: "assets/images/eso logo.png" },
      links: [
        { label: "Poster (PDF) ↗", href: "assets/posters/eso-poster.pdf" },
      ],
    },
    {
      title: "Full publication list →",
      venue: "Google Scholar",
      year: "",
      links: [
        {
          href: "https://scholar.google.com/citations?user=8K_Vt_0AAAAJ&hl=en&oi=sra",
        },
      ],
    },
  ],

  projects: [
    {
      name: "RUBIX",
      meta: "JAX · open source",
      blurb:
        "A modular, fully-tested, well-documented JAX tool that forward-models mock IFU cubes from cosmological simulations such as IllustrisTNG. It ships predefined telescope configs (e.g. MUSE) and standard spectral libraries, and parallelises across GPUs for ~600× speedups — turning hours of compute into seconds.",
      keywords: ["astrophysics", "JAX"],
      media: { type: "image", src: "assets/images/rubix-logo.svg" },
      links: [
        { label: "GitHub ↗", href: "https://github.com/ufuk-cakir/rubix" },
      ],
      body: [
        {
          type: "media",
          media: { type: "image", src: "assets/images/rubix-logo.svg" },
        },
        {
          type: "p",
          text: "RUBIX (Reconstruction Using Bayesian Inference eXperiments) is a modular, fully-tested, well-documented tool written in JAX that forward-models mock IFU (integral field unit) data cubes from cosmological simulations such as IllustrisTNG.",
        },
        { type: "h", text: "Why JAX" },
        {
          type: "p",
          text: "By writing the whole pipeline in JAX it is differentiable end-to-end and parallelises across multiple GPUs, demonstrating performance improvements over state-of-the-art codes by a factor of ~600 — reducing compute times from hours to seconds.",
        },
        {
          type: "p",
          text: "It ships predefined telescope configurations (e.g. MUSE) and supports standard spectral libraries, and it is open source so the astrophysics community can build on it.",
        },
        {
          type: "links",
          links: [
            { label: "GitHub ↗", href: "https://github.com/ufuk-cakir/rubix" },
          ],
        },
      ],
    },
    {
      name: "GAMMA dataset",
      meta: "Dataset · 2023",
      blurb:
        "2D maps and 3D cubes of 11,727 galaxies (stellar age, metallicity, mass) built for machine learning, with an interactive dashboard for the lower-dimensional image space.",
      keywords: ["dataset", "galaxies"],
      media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
      links: [
        { label: "Project page ↗", href: "research/gamma.html" },
        {
          label: "Workshop @ NeurIPS ↗",
          href: "https://neurips.cc/virtual/2023/76114",
        },
      ],
      body: [
        {
          type: "media",
          media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
        },
        {
          type: "p",
          text: "GAMMA (Galactic Attributes of Mass, Metallicity and Age) is a comprehensive dataset of galaxy data tailored for machine-learning applications.",
        },
        {
          type: "p",
          text: "It provides detailed 2D maps and 3D cubes of 11,727 galaxies, capturing essential attributes: stellar age, metallicity, and mass. I also built an interactive online dashboard to visualise the lower-dimensional image space.",
        },
        {
          type: "media",
          media: { type: "image", src: "assets/images/publication-viz.png" },
          caption: "Exploring the learned image space.",
        },
        {
          type: "p",
          text: "This work was accepted at the Machine Learning and the Physical Sciences workshop at NeurIPS 2023.",
        },
        {
          type: "links",
          links: [
            { label: "Project page ↗", href: "research/gamma.html" },
            {
              label: "Workshop @ NeurIPS ↗",
              href: "https://neurips.cc/virtual/2023/76114",
            },
          ],
        },
      ],
    },
    {
      name: "Eigengalaxies",
      meta: "B.Sc. thesis · 2022",
      blurb:
        "PCA basis vectors of galaxy images from IllustrisTNG, used to model galaxy morphology in a compact, interpretable space.",
      keywords: ["galaxies", "thesis"],
      media: { type: "video", src: "assets/videos/eigen10.mp4" },
      links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }],
      body: [
        {
          type: "media",
          media: { type: "video", src: "assets/videos/eigen10.mp4" },
          caption: "Reconstructing a galaxy from a handful of eigengalaxies.",
        },
        {
          type: "p",
          text: "For my Bachelor thesis I investigated how machine learning can build galaxy-morphology models and encode the information contained in modern, state-of-the-art galaxy simulations.",
        },
        {
          type: "p",
          text: "Using simulation data from the IllustrisTNG project, I computed the 'eigengalaxies' — the basis vectors of the transformed image space — via Principal Component Analysis. A galaxy can then be represented (and reconstructed) from just a few of these components.",
        },
        {
          type: "links",
          links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }],
        },
      ],
    },
    {
      name: "Evolutionary Spectrogram Optimization",
      meta: "AIMS · 2024",
      blurb:
        "A genetic algorithm to optimise bioacoustic spectrograms for real-time monitoring of endangered species, developed with the ML for Ecology group at AIMS.",
      keywords: ["bioacoustics", "genetic algorithm"],
      media: { type: "image", src: "assets/images/eso logo.png" },
      links: [
        { label: "Poster (PDF) ↗", href: "assets/posters/eso-poster.pdf" },
      ],
    },
    {
      name: "Differentiable galaxy image pipeline",
      meta: "M.Sc. thesis",
      blurb:
        "A differentiable JAX pipeline that generates galaxy images from physical input parameters, implementing astrophysical processes so the whole pipeline can be embedded inside a larger ML framework. Open source, by design.",
      keywords: ["JAX", "astrophysics"],
      media: { type: "image", src: "assets/images/ml_astro.png" },
    },
    {
      name: "CZS Summer School 2023",
      meta: "Local organiser",
      blurb:
        "Helped organise the Carl-Zeiss-Stiftung Summer School on Scientific Machine Learning at IWR Heidelberg — on the local organising committee, and built the conference website.",
      keywords: ["organising", "scientific ML", "Heidelberg"],
      media: { type: "video", src: "assets/videos/czs.mp4" },
      links: [
        {
          label: "Conference site ↗",
          href: "https://astroai-lab.de/conferences/czs-school-2023/",
        },
      ],
    },
    {
      name: "Cleaning Up Our Planet — Lindau Sciathon",
      meta: "Lindau · 2024",
      blurb:
        "A 4th Lindau Online Sciathon project with the Lindau Alumni Network, combining molecular simulations and machine learning to improve the efficiency of plastic-degrading enzymes. Selected as a finalist; I animated and edited the video.",
      keywords: ["sciathon", "ML", "sustainability", "finalist"],
      media: { type: "video", src: "assets/videos/lindau-sciathon-2024.mp4" },
      links: [
        {
          label: "Watch on YouTube ↗",
          href: "https://www.youtube.com/watch?v=_3ahZlp7I7k",
        },
        {
          label: "Sciathon results ↗",
          href: "https://sciathon.org/results-2024/",
        },
      ],
    },
  ],

  /* Talks — Manim-animated slide decks (reveal.js). Each opens its deck
     inside the OS. `deck` is the HTML file under /slides.
     (GAMMA, the ESO poster, etc. live under Publications, not here.) */
  talks: [
    {
      title: "IE Student Talk",
      venue: "Intelligent Earth CDT",
      year: "2025",
      blurb:
        "My Intelligent Earth CDT student talk — a Manim-animated reveal.js slide deck. Click to open the deck; use the arrow keys to advance.",
      keywords: ["Intelligent Earth", "Manim", "talk"],
      deck: "slides/ie-student-talk-25-final.html",
    },
    {
      title: "RUM Workshop",
      venue: "RUM Workshop",
      year: "2025",
      blurb:
        "A Manim-animated presentation given at the RUM workshop. Click to open the deck; use the arrow keys to advance.",
      keywords: ["RUM", "Manim", "workshop"],
      deck: "slides/rum_presentation.html",
    },
    {
      title: "Manim Tutorial",
      venue: "Tutorial",
      year: "",
      blurb:
        "A tutorial on creating mathematical animations with Manim, presented as an animated deck.",
      keywords: ["Manim", "tutorial", "animation"],
      deck: "slides/final-manim-talk.html",
    },
    {
      title: "Plasticity as the Mirror of Empowerment",
      venue: "Manim talk",
      year: "2026",
      blurb:
        "The talk for our reading group walks from Shannon to results discussing the foundations of agency.",
      keywords: ["empowerment", "agency", "Manim", "talk"],
      deck: "slides/plasticity-empowerment.html",
    },
  ],

  /* News & announcements (newest first) — shown in the News app. */
  news: [
    {
      date: "2024",
      tag: "Honour",
      title: "Young Scientist — 73rd Lindau Nobel Laureate Meeting",
      body: "Selected as a Young Scientist to attend the 73rd Lindau Nobel Laureate Meeting, engaging with Nobel Laureates and young scientists from around the world.",
      media: { type: "image", src: "assets/images/sciathon-discussion.JPEG" },
    },
    {
      date: "2024",
      tag: "Finalist",
      title: "Lindau Sciathon project selected as a finalist",
      body: "Our 4th Lindau Online Sciathon project — combining molecular simulations and machine learning to improve plastic-degrading enzymes — was selected as a finalist and presented at the Lindau Nobel Laureate Meeting.",
      href: "https://www.youtube.com/watch?v=_3ahZlp7I7k",
    },
  ],

  /* Writing — blog posts. Each post opens in the Reader (full-screen +
     #read/<slug> deep-link) and is served from the existing /blog build.
     Add an entry here whenever you publish a new post. */
  writing: [
    {
      slug: "plasticity-as-the-mirror-of-empowerment",
      title: "Plasticity as the Mirror of Empowerment",
      kind: "Work in progress",
      date: "2026",
      wip: true,
      url: "blog/plasticity-as-the-mirror-of-empowerment.html",
    },
  ],

  /* "Outreach": my science-communication animations. */
  outreach: [
    {
      name: "About these animations.txt",
      meta: "read me",
      type: "txt",
      doc: {
        heading: "Animations & Outreach",
        by: "~/Outreach/About these animations.txt",
        body: [
          {
            lead: true,
            text: "I love making animations to visualize science — turning equations and abstract concepts into something you can actually watch.",
          },
          {
            text: "Most of these are built in Adobe After Effects and Premiere Pro, with a few in Python. They've been used for public outreach, science-communication projects, and conference talks — from quantum-simulation explainers to relaxation dynamics in disordered spin systems.",
          },
          {
            text: "If a concept is hard to picture, that's usually the one I want to animate. Double-click the clips in this folder to watch a few.",
          },
        ],
      },
    },
    {
      name: "Disordered quantum spin dynamics",
      meta: "Quantum Dynamics Lab",
      blurb:
        "A Python animation of relaxation dynamics in disordered quantum spin systems, made for public outreach during my undergraduate research at the Quantum Dynamics Lab.",
      keywords: ["animation", "quantum", "outreach"],
      media: { type: "video", src: "assets/videos/spin_animation.mp4" },
    },
    {
      name: "Glass phase animation",
      meta: "Science communication",
      blurb:
        "An After Effects animation visualising a glass phase transition — one of a series of pieces I make to communicate physics concepts.",
      keywords: ["animation", "After Effects"],
      media: { type: "video", src: "assets/videos/Glass Phase Animation.mp4" },
    },
    {
      name: "Schrödinger equation",
      meta: "Science communication",
      blurb:
        "An animation illustrating the evolution of a quantum wavefunction under the Schrödinger equation.",
      keywords: ["animation", "quantum"],
      media: { type: "video", src: "assets/videos/schroedinger.mp4" },
    },
    {
      name: "Quantum Simulation — Science Young-to-Young",
      meta: "4EU+ · 2023",
      blurb:
        "An animated explainer on quantum simulation produced with international students (Sorbonne, Milan, Heidelberg) for the 4EU+ Science Young-to-Young programme. I coordinated, animated, and edited it in After Effects and Premiere Pro.",
      keywords: ["science communication", "animation", "4EU+"],
      media: { type: "video", src: "assets/videos/syty intro.mp4" },
      links: [
        {
          label: "Full video (Sorbonne) ↗",
          href: "https://sorbonne-universite.cloud.panopto.eu/Panopto/Pages/Viewer.aspx?id=b92c0e54-205f-4e1b-a59d-aeca00a3f13e",
        },
      ],
    },
  ],

  /* ---- Concepts: math / concept notes, written in Markdown ----
     Each is a node in the Graph view. Use String.raw`` for the `md` so
     you can paste LaTeX without escaping backslashes. Link concepts to
     each other with [[concept-id]] (or [[concept-id|custom label]]).
     `tags` connect nodes that share a topic; `related` are explicit links.
     Reference a concept from a blog post via the post's `concepts: [...]`. */
  concepts: [
    {
      id: "information-theory",
      title: "Information Theory",
      tags: ["information theory"],
      related: ["entropy", "kl-divergence", "mutual-information"],
      md: String.raw`The mathematics of *uncertainty* and *communication*, founded by Claude Shannon (1948). It gives us a way to measure information in bits.

The core quantities all build on one idea — the surprise of an event $x$ is $-\log p(x)$. From there we get [[entropy]], [[kl-divergence]], and [[mutual-information]].`,
    },
    {
      id: "entropy",
      title: "Entropy",
      tags: ["information theory"],
      related: ["kl-divergence", "mutual-information"],
      md: String.raw`The **entropy** of a random variable $X$ is the average surprise — how uncertain we are about its outcome:

$$H(X) = -\sum_x p(x)\,\log p(x)$$

It is maximal for a uniform distribution and zero when $X$ is deterministic. Measured in bits when $\log$ is base 2.

See also [[kl-divergence]] and [[mutual-information]].`,
    },
    {
      id: "kl-divergence",
      title: "KL Divergence",
      tags: ["information theory"],
      related: ["entropy", "mutual-information"],
      md: String.raw`The **Kullback–Leibler divergence** measures how much a distribution $P$ diverges from a reference $Q$:

$$D_{KL}(P \,\|\, Q) = \sum_x P(x)\,\log\frac{P(x)}{Q(x)}$$

It is non-negative, and zero **iff** $P = Q$. It is *not* symmetric, so it is a divergence, not a distance.

It is the "extra bits" you pay for coding samples from $P$ using a code optimised for $Q$. Built on [[entropy]].`,
    },
    {
      id: "mutual-information",
      title: "Mutual Information",
      tags: ["information theory"],
      related: ["entropy", "empowerment"],
      md: String.raw`**Mutual information** measures how much knowing $Y$ reduces uncertainty about $X$:

$$I(X; Y) = \sum_{x,y} p(x,y)\,\log\frac{p(x,y)}{p(x)\,p(y)} = H(X) - H(X \mid Y)$$

It is symmetric and non-negative, and equals the [[kl-divergence]] between the joint and the product of marginals. It underpins [[empowerment]].`,
    },
    {
      id: "empowerment",
      title: "Empowerment",
      tags: ["information theory", "agency"],
      related: ["mutual-information"],
      md: String.raw`**Empowerment** is an information-theoretic measure of an agent's *influence* over its environment — the channel capacity from its actions $A$ to future sensory states $S'$:

$$\mathfrak{E} = \max_{p(a)} \, I(A; S')$$

Intuitively: how many distinguishable futures can the agent reliably bring about? It is a special case of [[mutual-information]].`,
    },
    {
      id: "pca",
      title: "Principal Component Analysis",
      tags: ["PCA", "machine learning"],
      related: [],
      md: String.raw`**PCA** finds an orthogonal basis that captures the most variance in the data. The principal components are the eigenvectors of the covariance matrix $C$:

$$C = \frac{1}{n} X^\top X, \qquad C v_i = \lambda_i v_i$$

Projecting onto the top-$k$ eigenvectors gives the best rank-$k$ linear reconstruction — exactly the trick behind the *eigengalaxies* basis.`,
    },
  ],
};
