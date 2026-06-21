/* ============================================================
   publications.js — the single source of truth for publications.

   Plain JavaScript, no build step: edit this file and refresh the
   page. The same data also feeds the BibTeX / CV exporter:

       cd assets/os && node gen-citations.mjs
       → writes publications.bib  and  publications.md

   ------------------------------------------------------------
   HOW TO ADD A PAPER
   Copy one { ... } block in `items` and fill it in. Only `title`
   and `year` are strictly required; everything else is optional
   and simply hides itself when empty. Keep the list newest-first.

   FIELDS (per entry)
     key        BibTeX cite key, e.g. "cakir2023gamma" (export only)
     type       BibTeX entry type — one of:
                  "article"        journal paper
                  "inproceedings"  conference / workshop paper
                  "misc"           preprint, poster, dataset, report
                  "mastersthesis" | "phdthesis"
     title      full paper title
     authors    array of full names, in order. The name(s) in
                `me` (below) are bolded on the site automatically.
     venue      SHORT human-readable venue for the list ("ML4PS @ NeurIPS")
     booktitle  optional FULL venue name used only in the BibTeX export
                (falls back to `venue` when omitted)
     year       "2024"
     status     "" (= published) | "preprint" | "under review" | "in prep"
                  → anything non-empty shows a small badge.
     doi        "10.xxxx/..."         (optional, used in citations)
     arxiv      "2309.01234"          (optional, used in citations)
     summary    ONE short line shown in the Publications list
     abstract   longer text shown when the entry is opened
                (these are the papers' original abstracts, verbatim)
     keywords   ["dataset", "astrophysics"]  → filter chips
     media      { type: "image"|"video", src: "assets/..." } hero preview
     links      [{ type, href }] buttons. `type` picks the label:
                  arxiv pdf doi code page slides poster video
                  workshop dataset blog  (anything else → "Link").
                  Pass { label, href } to override the label text.
   ============================================================ */

window.SITE_PUBLICATIONS = {
  /* "View all" button under the list */
  scholar:
    "https://scholar.google.com/citations?user=8K_Vt_0AAAAJ&hl=en&oi=sra",

  /* author name(s) to bold in author lists — substring match */
  me: "Çakır",

  items: [
    {
      key: "cakir2025jaxwildfire",
      type: "inproceedings",
      title: "JaxWildfire: A GPU-Accelerated Wildfire Simulator for Reinforcement Learning",
      authors: ["Ufuk Çakır", "Victor-Alexandru Darvariu", "Bruno Lacerda", "Nick Hawes"],
      venue: "ML4PS @ NeurIPS",
      booktitle: "Machine Learning and the Physical Sciences Workshop, NeurIPS",
      year: "2025",
      status: "",
      doi: "",
      arxiv: "2512.06102",
      summary:
        "A JAX-based, GPU-accelerated wildfire simulator (6–35× faster) for training RL suppression agents.",
      abstract:
        "Artificial intelligence methods are increasingly being explored for managing wildfires and other natural hazards. In particular, reinforcement learning (RL) is a promising path towards improving outcomes in such uncertain decision-making scenarios and moving beyond reactive strategies. However, training RL agents requires many environment interactions, and the speed of existing wildfire simulators is a severely limiting factor. We introduce JaxWildfire, a simulator underpinned by a principled probabilistic fire spread model based on cellular automata. It is implemented in JAX and enables vectorized simulations using vmap, allowing high throughput of simulations on GPUs. We demonstrate that JaxWildfire achieves 6-35x speedup over existing software and enables gradient-based optimization of simulator parameters. Furthermore, we show that JaxWildfire can be used to train RL agents to learn wildfire suppression policies. Our work is an important step towards enabling the advancement of RL techniques for managing natural hazards.",
      keywords: ["reinforcement learning", "wildfire", "JAX"],
      links: [
        { type: "arxiv", href: "https://arxiv.org/abs/2512.06102" },
      ],
    },
    {
      key: "schaible2025rubix",
      type: "inproceedings",
      title: "RUBIX: Differentiable forward modelling of galaxy spectral data cubes for gradient-based parameter estimation",
      authors: [
        "Anna Lena Schaible", "Ufuk Çakır", "Tobias Buck", "Harald Mack",
        "Aura Obreja", "Nihat Oguz", "William H. Oliver", "Horea-Alexandru Cărămizaru",
      ],
      venue: "DiffSys & SciML @ EurIPS",
      booktitle: "Workshop on Differentiable Systems and Scientific Machine Learning, EurIPS",
      year: "2025",
      status: "",
      doi: "",
      arxiv: "2511.17110",
      summary:
        "An end-to-end differentiable JAX pipeline for mock IFU cubes, enabling gradient-based parameter estimation.",
      abstract:
        "Although integral-field spectroscopy enables spatially resolved spectral studies of galaxies, bridging particle-based simulations to observations remains slow and non-differentiable. We present RUBIX, a JAX-based pipeline that models mock integral-field unit (IFU) cubes for galaxies end-to-end and calculates gradients with respect to particle inputs. Our implementation is purely functional, sharded, and differentiable throughout. We validate the gradients against central finite differences and demonstrate gradient-based parameter estimation on controlled setups. While current experiments are limited to basic test cases, they demonstrate the feasibility of differentiable forward modelling of IFU data. This paves the way for future work scaling up to realistic galaxy cubes and enabling machine learning workflows for IFU-based inference. The source code for the RUBIX software is publicly available under https://github.com/AstroAI-Lab/rubix.",
      keywords: ["astrophysics", "JAX", "differentiable"],
      links: [
        { type: "arxiv", href: "https://arxiv.org/abs/2511.17110" },
        { type: "code", href: "https://github.com/AstroAI-Lab/rubix" },
      ],
    },
    {
      key: "cakir2024rubix",
      type: "inproceedings",
      title: "Fast GPU-Powered and Auto-Differentiable Forward Modeling of IFU Data Cubes",
      authors: ["Ufuk Çakır", "Anna Lena Schaible", "Tobias Buck"],
      venue: "ML4PS @ NeurIPS",
      booktitle: "Machine Learning and the Physical Sciences Workshop, NeurIPS",
      year: "2024",
      status: "",
      doi: "",
      arxiv: "2412.08265",
      summary:
        "RUBIX: a JAX tool that forward-models galaxy IFU data cubes from simulations — 600× faster and differentiable.",
      abstract:
        "We present RUBIX, a fully tested, well-documented, and modular Open Source tool developed in JAX, designed to forward model IFU cubes of galaxies from cosmological hydrodynamical simulations. The code automatically parallelizes computations across multiple GPUs, demonstrating performance improvements over state-of-the-art codes by a factor of 600. This optimization reduces compute times from hours to only seconds. RUBIX leverages JAX's auto-differentiation capabilities to enable not only forward modeling but also gradient computations through the entire pipeline paving the way for new methodological approaches such as e.g. gradient-based optimization of astrophysics model parameters. RUBIX is open-source and available on GitHub: https://github.com/ufuk-cakir/rubix.",
      keywords: ["astrophysics", "JAX", "differentiable"],
      links: [
        { type: "arxiv", href: "https://arxiv.org/abs/2412.08265" },
        { type: "code", href: "https://github.com/ufuk-cakir/rubix" },
      ],
    },
    {
      key: "cakir2024eso",
      type: "misc",
      title: "Evolutionary spectrogram optimization for bioacoustics",
      authors: ["Ufuk Çakır" /* TODO: add co-authors in order */],
      venue: "ML4RS @ ICLR (poster)",
      year: "2024",
      status: "",
      doi: "",
      arxiv: "", // no arXiv version → abstract below is a description, not verbatim
      summary:
        "A genetic algorithm that optimises spectrograms for real-time monitoring of endangered species.",
      abstract:
        "A fully-tested, well-documented genetic algorithm that optimises bioacoustic spectrograms to enable real-time monitoring of critically endangered species. Developed with the Machine Learning for Ecology group at AIMS (Cape Town), funded by the Baden-Württemberg-Stipendium. Poster at the 2nd ML4RS Workshop, ICLR Vienna 2024.",
      keywords: ["bioacoustics", "genetic algorithm"],
      media: { type: "image", src: "assets/images/eso logo.png" },
      links: [{ type: "poster", href: "assets/posters/eso-poster.pdf" }],
    },
    {
      key: "cakir2023gamma",
      type: "inproceedings",
      title: "GAMMA: Galactic Attributes of Mass, Metallicity, and Age Dataset",
      authors: ["Ufuk Çakır", "Tobias Buck"],
      venue: "ML4PS @ NeurIPS",
      booktitle: "Machine Learning and the Physical Sciences Workshop, NeurIPS",
      year: "2023",
      status: "",
      doi: "",
      arxiv: "2312.06016",
      summary:
        "A machine-learning-ready dataset of 2D maps and 3D cubes for 11,727 galaxies.",
      abstract:
        "We introduce the GAMMA (Galactic Attributes of Mass, Metallicity, and Age) dataset, a comprehensive collection of galaxy data tailored for Machine Learning applications. This dataset offers detailed 2D maps and 3D cubes of 11 727 galaxies, capturing essential attributes: stellar age, metallicity, and mass. Together with the dataset, we publish our code to extract any other stellar or gaseous property from the raw simulation suite to extend the dataset beyond these initial properties, ensuring versatility for various computational tasks. Ideal for feature extraction, clustering, and regression tasks, GAMMA offers a unique lens to explore galactic structures using computational methods and is a bridge between astrophysical simulations and the field of scientific machine learning (ML). As a first benchmark, we applied Principal Component Analysis (PCA) to this dataset. We find that PCA effectively captures the key morphological features of galaxies with a small number of components. We achieve a dimensionality reduction by a factor of approximately 200 (3650) for 2D images (3D cubes) with a reconstruction accuracy below 5%.",
      keywords: ["dataset", "astrophysics"],
      media: { type: "image", src: "assets/images/gamma_logo_v3.png" },
      links: [
        { type: "arxiv", href: "https://arxiv.org/abs/2312.06016" },
        { type: "dataset", href: "https://doi.org/10.5281/zenodo.8375344" },
        { type: "workshop", href: "https://neurips.cc/virtual/2023/76114" },
        { type: "page", href: "research/gamma.html" },
      ],
    },
    {
      key: "cakir2022eigengalaxies",
      // BibTeX has no bachelor's type; the exporter emits @mastersthesis with
      // type={Bachelor's thesis} when the venue mentions "B.Sc".
      type: "mastersthesis",
      title: "Eigengalaxies — ML models for galaxy morphology",
      // Bachelor's thesis (single author); advised by Tobias Buck, AstroAI-Lab
      // (IWR + ITA, Heidelberg University) — https://astroai-lab.de/
      authors: ["Ufuk Çakır"],
      venue: "B.Sc. thesis · Heidelberg University",
      year: "2022",
      status: "",
      doi: "",
      arxiv: "", // thesis — abstract below is a description, not a verbatim abstract
      summary:
        "Using PCA to compute 'eigengalaxies' that encode galaxy morphology from IllustrisTNG.",
      abstract:
        "Using Principal Component Analysis to compute 'eigengalaxies' — the basis vectors of a transformed galaxy-image space — to encode the morphological information contained in state-of-the-art simulations. Built on data from the IllustrisTNG project.",
      keywords: ["astrophysics"],
      media: { type: "video", src: "assets/videos/eigen10.mp4" },
      links: [{ type: "page", label: "Read more ↗", href: "galaxy-morphology.html" }],
    },
  ],
};
