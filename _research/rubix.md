---
title: RUBIX 
slug: rubix
tagline: RUBIX
image: /images/research/rubix-speed.png
preview: Fast GPU-Powered and Auto-Differentiable Forward Modeling of IFU Data Cubes
date: 2024-05-20
authors: Ufuk Çakır
github: https://github.com/AstroAI-Lab/rubix
paper:  https://arxiv.org/abs/2412.08265
---


# 🚀 RUBIX — GPU-Turbo Forward Modeling for IFU Data Cubes

**Fast, JAX-powered & auto-differentiable**  
[📄 Read the paper](https://arxiv.org/abs/2412.08265)

| 💡 Why it matters | 🛠️ What RUBIX does | ⚡ How fast? |
|:------------------|:-------------------|:------------|
| Bridging the gap between simulations and observations of galaxies | End-to-end pipeline in **JAX** that turns hydro-sim data into realistic IFU cubes | **600×** faster than GalCraft on an NVIDIA A100 |
| Enables gradient-based ML & simulation-based inference | Runs natively on **multiple GPUs** with `pmap` + XLA | From **1.4 h → 8.6 s** for a 6M-particle galaxy |
| Open-source, modular, fully tested | Auto-diff through every step (SSP lookup → Doppler shift → PSF/LSF → noise) | Scales to 8 GPUs (needs tuning for perfect efficiency) |

---

## 🔍 Key ingredients
- ⚡ **Vectorised kernels** (`vmap`) — no slow Python loops
- ⚡ **Just-in-time compilation** — XLA fuses ops for extra speed
- ⚙️ **JSON-driven configs** — choose telescope, SSP library, distance, orientation, and more

---

## 📈 Results in a snapshot
- 📊 Reproduces expected flux & spectral gradients across galactic radii
- 📉 Strong scaling: runtime grows *sub-linearly* with particle number
- 🔌 Weak scaling: still room to optimise multi-GPU communication

---

## 🛤️ Coming down the pipe
- 🌫️ Gas & dust modelling
- 💡 Radiative-transfer in pure JAX
- 🔄 End-to-end neural-physics hybrids for SBI & Bayesian model comparison

---

## ⭐ Take-away
**RUBIX** turns hours of CPU work into **seconds** on GPUs and provides **gradients** for modern ML workflows — unlocking rapid, differentiable astrophysics! 🚀
