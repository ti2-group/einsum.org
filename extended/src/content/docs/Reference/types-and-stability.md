---
title: "Types and stability modes"
description: "Core literals, protocols, formats, and numerical assumptions"
sidebar:
  order: 4
---

Core aliases live in `extended_einsum.language.types`.

```python
Shape = tuple[int, ...]
TensorFormat = Literal["dense", "sparse"]
Backend = Literal["torch", "numpy", "jax"]
StabilityMode = Literal[
    "unstable",
    "scaled_min",
    "scaled_sum",
    "logspace_min",
    "logspace_max",
]
```

## Structural protocols

- `HasShape`: exposes `.shape -> Shape`.
- `HasBackend`: exposes `.backend -> Backend`.
- `HasFormat`: exposes `.format -> TensorFormat`.
- `Array`: combines all three.

`TArray` is a type variable bounded by `Array`.

## Tensor formats

The frontend records `"dense"` or `"sparse"` on every SSA value. Unary operators preserve the input format. Elementwise binary operators and einsums currently require consistent operand formats. This metadata gives preprocessing and future lowering passes a place to make format-aware decisions; it is not by itself a sparse storage conversion.

## Stability modes

### `unstable`

One direct backend call per IR instruction. This is the only mode intended for unrestricted signed intermediates.

### `scaled_sum` / `scaled_min`

Represent positive values as normalized tensors plus broadcastable log scales. The suffix chooses the last-axis fiber normalizer. Normalizers and common scales are passed through `stop_gradient` because their represented-value derivative cancels.

### `logspace_max` / `logspace_min`

Keep eligible values in log space, shifting contractions by a reference reduction before exponentiation. Parameter-derived inputs remain linear in the contraction where possible.

:::caution
The stable modes assume positive values. A program with arbitrary sign changes, negative results, or zeros at logarithm boundaries may produce invalid results. Validate model-specific invariants or use `unstable`.
:::
