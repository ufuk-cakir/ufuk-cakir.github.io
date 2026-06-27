---
title: Markov Decision Process
description: A short encyclopedia-style note on Markov decision processes.
status: seed
author: Ufuk Cakir
reviewer: open
first_version: 21 June 2026
---

A Markov decision process is a model of sequential decision-making in which the next state depends on the present state and action, not on the full past.

## Contents

1. [Definition](#definition)
2. [Informal Interpretation](#informal-interpretation)
3. [Prerequisites and Relations](#prerequisites-and-relations)
4. [References](#references)
5. [Review and Updates](#review-and-updates)

## 1. Definition

In the common discounted setting, a Markov decision process is a tuple `(S, A, P, R, gamma)`. Here `S` is a set of states, `A` is a set of actions, `P(s' | s, a)` is a transition law, `R(s, a, s')` is a reward signal, and `gamma` is a discount factor.

The Markov assumption says that the conditional distribution of the next state is determined by the current state and action. The past matters only through what has already been summarized in the current state.

## 2. Informal Interpretation

At each step, an agent observes a state, chooses an action, receives a reward, and moves to another state. A policy tells the agent how to choose actions. Reinforcement learning asks how such a policy can be evaluated or improved from interaction data.

## 3. Prerequisites and Relations

- **Prerequisites:** Probability distributions; conditional expectation; Markov property.
- **Used by:** Value functions; Bellman equations; dynamic programming; temporal-difference learning.
- **Related concepts:** Markov reward process; partially observable Markov decision process; controlled Markov chain.

## 4. References

1. Bellman, R. (1957). *Dynamic Programming*. Princeton University Press.
2. Puterman, M. L. (1994). *Markov Decision Processes: Discrete Stochastic Dynamic Programming*. Wiley.
3. Sutton, R. S., and Barto, A. G. (2018). *Reinforcement Learning: An Introduction*, 2nd edition. MIT Press.

## 5. Review and Updates

This entry is a seed and has not yet had external review. Substantive changes should be proposed through GitHub before the page is marked as reviewed.

- [Open a review issue](https://github.com/ufuk-cakir/ufuk-cakir.github.io/issues/new?title=Notes%3A%20Markov%20decision%20process)
- [View update history](https://github.com/ufuk-cakir/ufuk-cakir.github.io/commits/main/notes/entries/markov-decision-process.md)
