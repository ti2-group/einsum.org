---
title: "Train with PyTorch"
description: "A minimal differentiable training loop with automatic stability"
sidebar:
  order: 1
---

Extended Einsum’s PyTorch backend preserves autograd. Parameters remain ordinary `torch.nn.Parameter` objects owned by your module or optimizer; wrap them when constructing the expression.

## Minimal setup

This example learns a positive, normalized weight vector by maximizing the first output of a small contraction.

```python
import torch
import extended_einsum.interface as xe

torch.manual_seed(0)

data = torch.rand(128, 16) + 0.1
weight_logits = torch.nn.Parameter(torch.randn(4, 16))
optimizer = torch.optim.Adam([weight_logits], lr=1e-2)

for step in range(100):
    optimizer.zero_grad()

    x = xe.array(data)
    logits = xe.array(weight_logits)
    weights = xe.softmax(logits, axis=1)
    probabilities = xe.einsum("bi,oi->bo", x, weights)
    selected = xe.select(probabilities, index=0, axis=1)
    log_likelihood = xe.log(selected)

    output = log_likelihood.materialize(stability_mode="scaled_sum")
    loss = -output.backend_array.mean()
    loss.backward()
    optimizer.step()

    if step % 20 == 0:
        print(step, float(loss))
```

## Where gradients flow

`xe.array(weight_logits)` stores the original tensor; it does not copy or detach it. The backend program therefore operates on the same autograd leaf. The stability compiler detaches only reference shifts and normalizers whose derivatives cancel algebraically—it does not detach model parameters or results.

## Use the result in a larger model

The boundary between Extended Einsum and ordinary PyTorch is explicit:

```python
xe_output = expression.materialize(stability_mode="scaled_sum")
torch_output = xe_output.backend_array
loss = torch.nn.functional.nll_loss(torch_output, target)
```

You can also wrap a native result again with `xe.array(torch_output)` to begin another Extended Einsum expression.

## Performance notes

- Construct the expression so repeated intermediates reuse the same Python object.
- Keep model parameters as native PyTorch tensors and wrap them without copying.
- `materialize()` uses the registered `TorchCompiler`, which calls `torch.compile` on the backend program.
- For benchmarking, separate the first compilation/warm-up step from steady-state iterations.
- Prefer a stable mode for deep products of positive values; use `unstable` for general signed arithmetic.
