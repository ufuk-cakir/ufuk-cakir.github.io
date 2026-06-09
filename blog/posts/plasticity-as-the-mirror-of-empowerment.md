---
title: Plasticity as the Mirror of Empowerment
slug: plasticity-as-the-mirror-of-empowerment
kicker: Talk notes
subtitle: A walk from Shannon to a clean impossibility result about agency — and why an agent cannot maximally <em>shape</em> the world and be maximally <em>shaped by</em> it at once.
date: June 2026
venue: GOALS Reading Group
description: An expository walk through Abel et al. (2025), "Plasticity as the Mirror of Empowerment": directed information, the mirror, and the tension between an agent shaping its world and being shaped by it.
paper_url: https://arxiv.org/abs/2505.10361
code_url: https://github.com/ufuk-cakir
---

Two of the most-studied intrinsic drives in reinforcement learning pull in opposite directions, and almost nobody had noticed. **Empowerment** asks an agent to *shape* its world; **plasticity** asks it to be *shaped by* the world. Abel, Barreto, and colleagues show these are not two ideas at all — they are the *same* quantity, read in opposite directions — and that this forces a hard trade-off. This is the write-up of a talk I gave on their paper.^[Abel, Barreto, et al. (2025), *Plasticity as the Mirror of Empowerment*, NeurIPS 2025. The talk deliberately forgets MDPs and reinforcement learning and rebuilds the result from information theory up.]

```anim
name: title
label: none
width: full
caption: The whole story in one line. Everything below is an attempt to earn it.
```

Here is the plan. We forget Markov decision processes entirely and build from the ground up: ordinary information theory, then *directed* information, then the paper's two definitions, and finally the one-line theorem that ties them together. If you remember a single picture, make it the mirror in [Figure 6](#the-mirror).

## Agency has two directions

Drop an agent into an environment and let them interact. Two questions you might ask about that agent feel completely different:

- *How much can the agent **change** about its future?* — its reach, its influence, its grip on outcomes.
- *How much does the agent **respond** to what it sees?* — its sensitivity, its willingness to update, its openness.

The first is **<span class="c-empow">empowerment</span>**. The intuition that made it popular is a reachability picture: an empowered agent is one whose actions *now* fan out into many distinguishable futures *later*.^[Klyubin, Polani & Nehaniv (2005) introduced empowerment as the channel capacity from an agent's actions to its later sensors. The reachable-futures reading is the one most people carry around in their heads.]

```anim
name: empowerment-reach
caption: <span class="c-empow">Empowerment</span> as reach. An agent with more empowerment can steer itself into a larger set of distinguishable futures; the green cells are outcomes its current choices can still reach.
credit: intuition after Myers et al. (2024)
```

The second question is **<span class="c-plast">plasticity</span>**: how much an agent's behaviour bends to what it observes. A rock has none — it does the same thing whatever happens. A thermostat has a little. A good learner has a lot. Hold on to the suspicion that these two qualities might be in conflict; we will make it precise.

## Interaction is a two-way stream

To talk about either quantity we need a clean model of *interaction* — and crucially one with **no MDP, no reward, no state**. There is just an agent and an environment trading symbols over a shared interface.

```anim
name: two-way-stream
caption: The interface. The agent emits an action $A$; the environment answers with an observation $O$; repeat. The whole history is one interleaved stream $A_1\,O_1\,A_2\,O_2\,\ldots$
```

Formally the interface is a pair of finite alphabets $(\mathcal{A}, \mathcal{O})$ with $|\mathcal{A}| \ge 2$ and $|\mathcal{O}| \ge 2$.^[The two-symbol minimum just says both sides can do *something*: an interface with a one-letter alphabet carries no information in that direction, so neither quantity is interesting.] An **agent** is a map from histories ending in an observation to a distribution over the next action, and an **environment** is its mirror image — a map from histories ending in an action to a distribution over the next observation:

$$\lambda : \mathcal{H}_{\cdots\mathcal{O}} \to \Delta(\mathcal{A}), \qquad e : \mathcal{H}_{\cdots\mathcal{A}} \to \Delta(\mathcal{O}).$$

Notice the symmetry already sitting in the definitions: swap the roles of $\mathcal{A}$ and $\mathcal{O}$ and an agent *is* an environment.^[This is Remark 2.8 in the paper. It is the seed of everything: the formalism does not privilege "agent" over "environment" — the labels are a choice of viewpoint on the same stream.] That symmetry is the whole result in embryo.

## A two-minute refresher on information

Information theory measures *choices*, not meaning.^[Shannon (1948), *A Mathematical Theory of Communication*. "Information is about choices" — the semantic content of a message is, famously, irrelevant to its information content.] The uncertainty in a random variable is its entropy,

$$H(X) = -\sum_{x} p(x)\,\log p(x),$$

and the amount that learning $Y$ tells you about $X$ is the **mutual information**, the overlap of the two uncertainties:

```anim
name: mutual-information
caption: Mutual information $I(X;Y) = H(X) - H(X\mid Y)$ is the overlap of two entropies — how much knowing one variable shrinks your uncertainty about the other.
```

The single fact to carry forward is that mutual information is **symmetric**:

$$I(X;Y) = I(Y;X).$$

Knowing the weather tells you exactly as much about the barometer as the barometer tells you about the weather. This symmetry is comforting and, for our purposes, *too coarse*: in a feedback loop the agent's actions and the environment's observations are tangled in time, and we want to separate "the agent drove this" from "the environment drove this." Plain mutual information throws that distinction away.

### Directed information puts the arrow back

Massey's **directed information** keeps the arrow of time. Instead of correlating the whole streams, it sums up, step by step, only what the *past and present* of $X$ tells you about $Y_i$ given $Y$'s own past:

$$\mathbb{I}(X_{1:n}\to Y_{1:n}) \;\stackrel{\text{def}}{=}\; \sum_{i=1}^{n}\mathbb{I}\!\left(X_{1:i};\,Y_i \mid Y_{1:i-1}\right).$$

The conditioning on $Y_{1:i-1}$ is the important part: it credits $X$ only with the *new* influence it has on $Y_i$, after accounting for what $Y$'s own history already explained.^[Massey (1990) coined "directed information"; the idea traces back to Marko's (1973) bidirectional information theory, where a total flow splits into two transfers $K = T_{12} + T_{21}$.] Unlike mutual information, it is **not** symmetric — and that asymmetry is exactly what we were missing.

It does, however, obey a beautiful conservation law. The symmetric mutual information between two streams splits *exactly* into the two directed flows:

$$\mathbb{I}(X_{1:n};\,Y_{1:n}) \;=\; \underbrace{\mathbb{I}(X_{1:n}\to Y_{1:n})}_{\text{forward}} \;+\; \underbrace{\mathbb{I}(Y_{1:n}\hookrightarrow X_{1:n})}_{\text{delayed feedback}}.$$

The forward term is the ordinary directed information; the backward term $\hookrightarrow$ is a *strictly delayed* version (it starts the sum at $i=2$), because in a feedback loop $Y$ can only react to $X$'s past, never its present.^[The hook arrow is the paper's notation for the delayed flow $\mathbb{I}(Y_{1:n}\hookrightarrow X_{1:n}) = \sum_{i=2}^{n}\mathbb{I}(Y_{1:i-1};\,X_i \mid X_{1:i-1})$. The total is conserved: nudging one flow up must push the other down. Keep this law in your pocket — it is the tension, in disguise.]

## The two protagonists, defined

Now point those directed flows at the agent–environment stream. There are only two arrows you can draw, and each is a known quantity.

**<span class="c-empow">Empowerment</span>** is the information that flows *from the agent's actions to the environment's observations* — the agent writing on the world:

```anim
name: empowerment
caption: <span class="c-empow">Empowerment</span> $\mathfrak{E}(\lambda) = \mathbb{I}(A \to O)$ — the directed information from actions to observations, maximised over what the agent could do. How much of the world's response the agent authored.
```

**<span class="c-plast">Plasticity</span>** is the information that flows the *other way*, from the environment's observations into the agent's actions — the world writing on the agent:

```anim
name: plasticity
caption: <span class="c-plast">Plasticity</span> $\mathfrak{P}(\lambda) = \mathbb{I}(O \to A)$ — the directed information from observations to actions. How much the agent's behaviour was authored by what it saw.
credit: Abel et al. (2025), Definition 4.1
```

A constant or open-loop policy has zero plasticity; it ignores its observations. A policy whose actions genuinely depend on what it sees is plastic — and, notably, a *deterministic* agent can still be highly plastic, because plasticity is about dependence on observations, not randomness.^[This trips people up: plasticity is not entropy of the policy. A deterministic but observation-sensitive controller — "if I see this, do that" — has high plasticity. Noise for its own sake does not.] In their general form both quantities carry index ranges $a{:}b$ and $c{:}d$ over which window of the stream we read, and a max over the opponent, but the short forms $\mathbb{I}(A\to O)$ and $\mathbb{I}(O\to A)$ are all we need for the punchline.

## The mirror

Look at the two definitions side by side. <span class="c-empow">Empowerment</span> is $\mathbb{I}(A\to O)$. <span class="c-plast">Plasticity</span> is $\mathbb{I}(O\to A)$. They are the **same functional** — directed information across the interface — evaluated with the direction of influence reversed.

```anim
name: the-mirror
label: Figure 6
width: full
caption: <strong>The mirror.</strong> <span class="c-plast">Plasticity</span> (observations shaping actions, $O\to A$) and <span class="c-empow">empowerment</span> (actions shaping observations, $A\to O$) are one directed-information flow read in opposite directions around the same loop.
```

This is the paper's central observation, and once you see it you cannot unsee it. Because an agent and an environment are *structurally interchangeable* — recall the swap-the-alphabets remark — your empowerment is, from the environment's seat, *its* plasticity, and vice versa:

$$\mathfrak{E}_{c:d}^{\,a:b}(\lambda) \;=\; \mathfrak{P}_{c:d}^{\,a:b}(e), \qquad \mathfrak{P}_{c:d}^{\,a:b}(\lambda) \;=\; \mathfrak{E}_{c:d}^{\,a:b}(e).$$

It is cleanest when the "environment" is another agent. At a poker table, the information I manage to push into your behaviour *is* your plasticity to me; the information you extract from mine *is* my plasticity to you.^[Paper §4.3, the two-player reading. Empowerment and plasticity stop being two intrinsic drives and become two ends of a single shared channel — what one player gains in shaping power, the other concedes in openness.] Two drives that the literature developed independently turn out to be one quantity wearing two hats.

## The tension

The mirror is pretty. The consequence is sharp. Take the conservation law from earlier and read it across the interface: the symmetric mutual information between actions and observations is exactly empowerment plus plasticity,

$$\mathbb{I}(A_{a:b};\,O_{c:d}) \;=\; \underbrace{\mathbb{I}(A\to O)}_{\text{empowerment}} + \underbrace{\mathbb{I}(O\to A)}_{\text{plasticity}}.$$

But the left-hand side is just mutual information through a finite channel, and a finite channel has a finite **capacity**. Over a window, no more than $m$ bits can cross the interface in total:

$$\mathbb{I}(A_{a:b};\,O_{c:d}) \;\le\; m, \qquad m = \min\!\big\{(b-a+1)\log|\mathcal{O}|,\ (d-c+1)\log|\mathcal{A}|\big\}.$$

Substitute, and the two protagonists are forced to share one fixed budget. That is **Theorem 4.8**, the plasticity–empowerment tension:

$$\boxed{\;\mathfrak{E} + \mathfrak{P} \;\le\; m\;}$$

```anim
name: tension-frontier
label: Figure 7
width: full
caption: <strong>The frontier.</strong> Every agent lives in the blue feasible triangle $\mathfrak{E} + \mathfrak{P} \le m$. The hatched region is impossible. You can be maximally <span class="c-empow">empowered</span> or maximally <span class="c-plast">plastic</span>, but every bit of one is a bit you cannot spend on the other.
```

The geometry says it all. The reachable agents form a triangle bounded by the line $\mathfrak{E} + \mathfrak{P} = m$. Pure empowerment ($\mathfrak{P}=0,\ \mathfrak{E}=m$) sits in one corner — an agent that shapes the world maximally while ignoring it. Pure plasticity ($\mathfrak{E}=0,\ \mathfrak{P}=m$) sits in the other — an agent infinitely shaped by a world it cannot touch. Everyone else is on or under the frontier, trading one for the other bit for bit. There is no corner where both are large.

This is not a fact about any particular algorithm; it is a fact about *information through a finite interface*. The environment — through the alphabet sizes and the window length — sets the budget, and the agent only gets to choose how to split it.^[A corollary the paper draws out: when the environment is rich and the agent's action channel is narrow, $m$ is small and the agent is squeezed on both fronts at once. The environment really does have the final say over how much agency is even on the table.]

## Why I care about this

I find this result clarifying because the two drives it unifies are usually sold as unambiguously good. We want empowered agents; we want plastic, adaptable agents. The mirror says you cannot have a single window that maximises both — and that the very symmetry making empowerment attractive (your reach into the world) is the symmetry making plasticity unavoidable (the world's reach into you). Any objective that asks for "more agency" has to say *which direction*, and on *whose budget*.

```anim
name: closing
label: none
width: full
caption: One quantity, two directions, one budget.
```

*Slides, Manim source, and the full deck are [on GitHub](https://github.com/ufuk-cakir). Errors in this write-up are mine, not the authors'.*
