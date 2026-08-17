---
title: "Control routing and layout"
description: "Use take, select, slice, and folding metadata effectively"
sidebar:
  order: 4
---

Extended Einsum makes layout operations explicit so compiler passes can reason about routing instead of rediscovering it from backend indexing code.

## Select one fixed position

```python
first_class = xe.select(scores, index=0, axis=1)
```

`select` removes the selected axis.

## Slice a contiguous interval

```python
first_four = xe.slice(scores, start=0, stop=4, axis=1)
```

`slice` preserves the axis and is often preferable to a gather when consumer-aware folding can arrange values contiguously.

## Route with an index tensor

```python
indices = xe.array(torch.tensor([3, 0, 2], dtype=torch.long))
routed = xe.take(source, indices, axis=0)
```

In the PyTorch backend, `take` maps to `torch.index_select`. The paper demo `probe_address_book_routing.py` compares this with Cirkit-style advanced indexing by replacing the backend’s `take` implementation for a controlled benchmark.

## Stack parallel values

```python
batched = xe.stack([branch_a, branch_b, branch_c], axis=0)
```

All operands must have identical shapes and formats. Folding inserts equivalent stacks automatically when batching compatible operations.

## Pack inputs once

`FoldSameShapedOperations.apply_with_metadata()` returns `input_axis0_orders` and parameter stack orders. If a compiled program will run many times, apply those permutations during data preparation rather than gathering on every forward pass. This can also reduce backward scatter work and saved-tensor memory.
