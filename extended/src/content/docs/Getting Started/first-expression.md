---
title: "Your first expression"
description: "Build, inspect, and materialize an Extended Einsum program"
sidebar:
  order: 2
---

Extended Einsum records tensor operations lazily. Calling a frontend function returns a `TensorExpression`; computation begins when you call `materialize()`.

## Wrap native arrays

```python
import torch
import extended_einsum.interface as xe

features = xe.array(torch.rand(64, 32) + 0.1)
weight_logits = xe.array(torch.randn(12, 32))
```

The wrapper preserves shape, backend, and tensor-format metadata. Use `format="sparse"` to annotate sparse inputs; current bundled lowering still delegates the actual operations to the selected backend.

## Compose the expression

```python
weights = xe.softmax(weight_logits, axis=1)
scores = xe.einsum("bi,oi->bo", features, weights)
log_scores = xe.log(scores)

print(log_scores.shape)    # (64, 12)
print(log_scores.backend)  # "torch"
```

Intermediate expressions are first-class values. Reusing the same Python expression object creates a shared value in the compiler’s DAG instead of duplicating its computation.

## Materialize

```python
result = log_scores.materialize(stability_mode="scaled_sum")
native = result.backend_array

print(type(native))  # <class 'torch.Tensor'>
```

The returned object is another Extended Einsum array wrapper. Read `.backend_array` when passing the result to ordinary PyTorch, JAX, or NumPy code.

## Inspect the program

```python
program, inputs = xe.extract_program(log_scores, stability_mode="scaled_sum")

print(program.n_inputs)
print(program.instructions)
print(program.shapes[program.output_ssa])
```

`extract_program` produces topologically ordered SSA instructions. Inputs occupy IDs `0..n_inputs-1`; every subsequent ID is the result of one instruction.

:::note
The stability mode belongs to the extracted program. It changes lowering, not the expression’s mathematical definition.
:::
