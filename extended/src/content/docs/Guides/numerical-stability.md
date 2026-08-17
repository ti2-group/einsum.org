---
title: "Automatic numerical stability"
description: "Choose between direct, log-space, and scaled lowering"
sidebar:
  order: 2
---

Probabilistic circuits repeatedly multiply positive values. Direct floating-point evaluation can underflow even when the final log-likelihood is representable. Extended Einsum solves this at compile time: keep the frontend expression unchanged and select a stability mode when materializing or extracting the program.

```python
stable = expression.materialize(stability_mode="scaled_sum")
```

## Available modes

| Mode | Representation | Best suited for |
| --- | --- | --- |
| `unstable` | Native values | General signed programs, debugging, shallow computations |
| `logspace_max` | Log values with maximum reference shifts | Positive programs and conventional log-space evaluation |
| `logspace_min` | Log values with minimum reference shifts | Specialized positive-value experiments |
| `scaled_sum` | Normalized values plus a broadcastable log scale | Deep positive programs; recommended default for stable evaluation |
| `scaled_min` | Minimum-normalized values plus a log scale | Specialized positive-value experiments |

## How scaled evaluation works

A positive tensor is represented as

$$X = \widehat{X}\,\exp(s),$$

where $s$ is broadcastable to $X$. The implementation keeps one scale per last-axis fiber. Contractions operate on normalized tensors and linear-space parameters, then propagate the scale separately. Full-tensor exponentials and logarithms are avoided where possible.

For differently scaled fibers, the translator selects a common reference scale, applies only the scale differences to normalized values, and restores the reference afterward.

## Detached reference shifts

Maximum shifts and normalization factors choose an equivalent representation. Their contributions cancel exactly when the shift is subtracted and restored. Each backend’s `stop_gradient` primitive removes these unnecessary backward paths (`Tensor.detach()` in PyTorch, `jax.lax.stop_gradient` in JAX).

## Parameters remain linear

Marking an input as `Parameter` lets the translation keep parameter-derived values in linear space during stable contractions:

```python
from extended_einsum.interface.tensor_expression import Parameter

weights = Parameter(xe.array(weight_tensor))
result = xe.einsum("bi,oi->bo", activations, weights)
```

This is especially useful for softmax-normalized circuit weights and dense accelerator kernels.

## Assumptions and limits

Stable translations are designed for positive-valued computations. Arbitrary signed intermediates cannot generally be represented in log space or as a positive normalized tensor plus scale. Subtraction in a stable program therefore requires the result to remain positive. Use `unstable` for unconstrained signed programs.

Softmax remains a raw operation because bundled backend implementations already evaluate it with a stable maximum shift.
