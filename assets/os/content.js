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
      "→ AI for the environment",
      "→ decision-making under uncertainty",
      "→ open to collaborate",
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
      "Always happy to talk research, collaborations, or science communication — drop me a line and I'll get back to you.",
  },

  about: {
    p:
      "DPhil student at the Intelligent Earth UKRI CDT in AI for the Environment, University of Oxford, working with the GOALS group at the Oxford Robotics Institute. Trained as a physicist, with roots in scientific machine learning and galaxy morphology.",
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
        "My DPhil is part of Intelligent Earth, the UKRI Centre for Doctoral Training in AI for the Environment at the University of Oxford — a programme bridging environmental science and AI across climate, biodiversity, natural hazards, and environmental solutions, with students co-advised across departments.",
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
        text:
          "DPhil student at the Intelligent Earth UKRI CDT in AI for the Environment, University of Oxford, working with the GOALS group at the Oxford Robotics Institute.",
      },
      {
        text:
          "I trained as a physicist in Heidelberg, working where scientific machine learning meets astrophysics — from galaxy morphology and cosmological simulations (IllustrisTNG) to differentiable, JAX-based modelling tools.",
      },
      {
        text:
          "Along the way I've enjoyed building open-source research software (RUBIX), datasets (GAMMA), and science-communication animations, and I care about open, reproducible science.",
      },
    ],
  },

  whyresearch: {
    heading: "Why Research?",
    by: "~/Desktop/Why Research?.txt — last edited just now",
    body: [
      {
        lead: true,
        text:
          "A short note on what pulls me toward research — these are my own words, and a work in progress.",
      },
      {
        text:
          "I keep coming back to the same thing: using machine learning to understand the physical world, and building tools that let other scientists do the same. The part I love was never just the prediction — it's turning messy, high-dimensional scientific data into something we can reason about and act on.",
      },
      {
        text:
          "My path runs from physics and galaxy morphology toward decision-making and AI for the environment. The common thread is the same throughout: careful, open, reproducible science in service of questions that actually matter.",
      },
      {
        ph: true,
        text:
          "[ Replace this paragraph with your own motivation — the problem that keeps you up at night, and why you, why now. ]",
      },
    ],
  },

  publications: [
    {
      title: "GAMMA: Galactic Attributes of Mass, Metallicity and Age",
      venue: "ML4PS @ NeurIPS",
      year: "2023",
      abstract:
        "A dataset of 2D maps and 3D cubes for 11,727 galaxies capturing essential attributes — stellar age, metallicity and mass — tailored for machine-learning applications. It ships with an interactive dashboard for exploring the lower-dimensional image space. Accepted at the Machine Learning and the Physical Sciences workshop at NeurIPS 2023.",
      keywords: ["dataset", "galaxies", "IllustrisTNG", "machine learning"],
      media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
      links: [
        { label: "Workshop @ NeurIPS ↗", href: "https://neurips.cc/virtual/2023/76114" },
        { label: "Project page ↗", href: "research/gamma.html" },
      ],
    },
    {
      title: "Eigengalaxies — ML models for galaxy morphology",
      venue: "B.Sc. thesis",
      year: "2022",
      abstract:
        "Using Principal Component Analysis to compute 'eigengalaxies' — the basis vectors of a transformed galaxy-image space — to encode the morphological information contained in state-of-the-art simulations. Built on data from the IllustrisTNG project.",
      keywords: ["PCA", "morphology", "IllustrisTNG"],
      media: { type: "video", src: "assets/videos/eigen10.mp4" },
      links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }],
    },
    {
      title: "Evolutionary spectrogram optimization for bioacoustics",
      venue: "ML4RS @ ICLR (poster)",
      year: "2024",
      abstract:
        "A fully-tested, well-documented genetic algorithm that optimises bioacoustic spectrograms to enable real-time monitoring of critically endangered species. Developed with the Machine Learning for Ecology group at AIMS (Cape Town), funded by the Baden-Württemberg-Stipendium. Poster at the 2nd ML4RS Workshop, ICLR Vienna 2024.",
      keywords: ["bioacoustics", "genetic algorithm", "conservation"],
      media: { type: "image", src: "assets/images/eso logo.png" },
      links: [{ label: "Poster (PDF) ↗", href: "assets/posters/eso-poster.pdf" }],
    },
    {
      title: "Full publication list →",
      venue: "Google Scholar",
      year: "",
      links: [
        { href: "https://scholar.google.com/citations?user=8K_Vt_0AAAAJ&hl=en&oi=sra" },
      ],
    },
  ],

  projects: [
    {
      name: "RUBIX",
      meta: "JAX · open source",
      blurb:
        "A modular, fully-tested, well-documented JAX tool that forward-models mock IFU cubes from cosmological simulations such as IllustrisTNG. It ships predefined telescope configs (e.g. MUSE) and standard spectral libraries, and parallelises across GPUs for ~600× speedups — turning hours of compute into seconds.",
      keywords: ["JAX", "IFU", "GPU", "open source"],
      media: { type: "image", src: "assets/images/rubix-logo.svg" },
      links: [{ label: "GitHub ↗", href: "https://github.com/ufuk-cakir/rubix" }],
      body: [
        { type: "media", media: { type: "image", src: "assets/images/rubix-logo.svg" } },
        { type: "p", text: "RUBIX (Reconstruction Using Bayesian Inference eXperiments) is a modular, fully-tested, well-documented tool written in JAX that forward-models mock IFU (integral field unit) data cubes from cosmological simulations such as IllustrisTNG." },
        { type: "h", text: "Why JAX" },
        { type: "p", text: "By writing the whole pipeline in JAX it is differentiable end-to-end and parallelises across multiple GPUs, demonstrating performance improvements over state-of-the-art codes by a factor of ~600 — reducing compute times from hours to seconds." },
        { type: "p", text: "It ships predefined telescope configurations (e.g. MUSE) and supports standard spectral libraries, and it is open source so the astrophysics community can build on it." },
        { type: "links", links: [{ label: "GitHub ↗", href: "https://github.com/ufuk-cakir/rubix" }] },
      ],
    },
    {
      name: "GAMMA dataset",
      meta: "Dataset · 2023",
      blurb:
        "2D maps and 3D cubes of 11,727 galaxies (stellar age, metallicity, mass) built for machine learning, with an interactive dashboard for the lower-dimensional image space.",
      keywords: ["dataset", "galaxies", "ML"],
      media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
      links: [
        { label: "Project page ↗", href: "research/gamma.html" },
        { label: "Workshop @ NeurIPS ↗", href: "https://neurips.cc/virtual/2023/76114" },
      ],
      body: [
        { type: "media", media: { type: "image", src: "assets/images/gamma_logo_v3.png" } },
        { type: "p", text: "GAMMA (Galactic Attributes of Mass, Metallicity and Age) is a comprehensive dataset of galaxy data tailored for machine-learning applications." },
        { type: "p", text: "It provides detailed 2D maps and 3D cubes of 11,727 galaxies, capturing essential attributes: stellar age, metallicity, and mass. I also built an interactive online dashboard to visualise the lower-dimensional image space." },
        { type: "media", media: { type: "image", src: "assets/images/publication-viz.png" }, caption: "Exploring the learned image space." },
        { type: "p", text: "This work was accepted at the Machine Learning and the Physical Sciences workshop at NeurIPS 2023." },
        { type: "links", links: [{ label: "Project page ↗", href: "research/gamma.html" }, { label: "Workshop @ NeurIPS ↗", href: "https://neurips.cc/virtual/2023/76114" }] },
      ],
    },
    {
      name: "Eigengalaxies",
      meta: "B.Sc. thesis · 2022",
      blurb:
        "PCA basis vectors of galaxy images from IllustrisTNG, used to model galaxy morphology in a compact, interpretable space.",
      keywords: ["PCA", "morphology"],
      media: { type: "video", src: "assets/videos/eigen10.mp4" },
      links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }],
      body: [
        { type: "media", media: { type: "video", src: "assets/videos/eigen10.mp4" }, caption: "Reconstructing a galaxy from a handful of eigengalaxies." },
        { type: "p", text: "For my Bachelor thesis I investigated how machine learning can build galaxy-morphology models and encode the information contained in modern, state-of-the-art galaxy simulations." },
        { type: "p", text: "Using simulation data from the IllustrisTNG project, I computed the 'eigengalaxies' — the basis vectors of the transformed image space — via Principal Component Analysis. A galaxy can then be represented (and reconstructed) from just a few of these components." },
        { type: "links", links: [{ label: "Read more ↗", href: "galaxy-morphology.html" }] },
      ],
    },
    {
      name: "Evolutionary Spectrogram Optimization",
      meta: "AIMS · 2024",
      blurb:
        "A genetic algorithm to optimise bioacoustic spectrograms for real-time monitoring of endangered species, developed with the ML for Ecology group at AIMS.",
      keywords: ["bioacoustics", "genetic algorithm", "conservation"],
      media: { type: "image", src: "assets/images/eso logo.png" },
      links: [{ label: "Poster (PDF) ↗", href: "assets/posters/eso-poster.pdf" }],
    },
    {
      name: "Differentiable galaxy image pipeline",
      meta: "M.Sc. thesis",
      blurb:
        "A differentiable JAX pipeline that generates galaxy images from physical input parameters, implementing astrophysical processes so the whole pipeline can be embedded inside a larger ML framework. Open source, by design.",
      keywords: ["JAX", "differentiable", "galaxies"],
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
        { label: "Conference site ↗", href: "https://astroai-lab.de/conferences/czs-school-2023/" },
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
        { label: "Watch on YouTube ↗", href: "https://www.youtube.com/watch?v=_3ahZlp7I7k" },
        { label: "Sciathon results ↗", href: "https://sciathon.org/results-2024/" },
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
        "The talk version of the essay — a Manim-animated walk from Shannon to a clean impossibility result about agency.",
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
      body:
        "Selected as a Young Scientist to attend the 73rd Lindau Nobel Laureate Meeting, engaging with Nobel Laureates and young scientists from around the world.",
      media: { type: "image", src: "assets/images/sciathon-discussion.JPEG" },
    },
    {
      date: "2024",
      tag: "Finalist",
      title: "Lindau Sciathon project selected as a finalist",
      body:
        "Our 4th Lindau Online Sciathon project — combining molecular simulations and machine learning to improve plastic-degrading enzymes — was selected as a finalist and presented at the Lindau Nobel Laureate Meeting.",
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
      kind: "Essay",
      date: "June 2026",
      blurb:
        "A walk from Shannon to a clean impossibility result about agency — and why an agent cannot maximally shape the world and be maximally shaped by it at once.",
      keywords: ["empowerment", "agency", "information theory", "plasticity"],
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
            text:
              "I love making animations to visualize science — turning equations and abstract concepts into something you can actually watch.",
          },
          {
            text:
              "Most of these are built in Adobe After Effects and Premiere Pro, with a few in Python. They've been used for public outreach, science-communication projects, and conference talks — from quantum-simulation explainers to relaxation dynamics in disordered spin systems.",
          },
          {
            text:
              "If a concept is hard to picture, that's usually the one I want to animate. Double-click the clips in this folder to watch a few.",
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
};
