---
title: "Installation"
description: "Install Extended Einsum and check your backend"
sidebar:
  order: 1
---

Extended Einsum requires Python 3.13 or newer.

## Install from GitHub

```bash
pip install "extended-einsum @ git+https://github.com/ti2-group/extended_einsum.git"
```

The project is not currently published on PyPI. The GitHub installation includes support for PyTorch, JAX, and NumPy. To request the CUDA-enabled JAX extra from the repository:

```bash
pip install "extended-einsum[cuda] @ git+https://github.com/ti2-group/extended_einsum.git"
```

## Install the development checkout

Use an editable install when contributing or experimenting with compiler passes:

```bash
git clone https://github.com/ti2-group/extended_einsum.git
cd extended_einsum
pip install -e .
```

The repository uses `uv`; this equivalent command creates the complete development environment:

```bash
uv sync --group dev --group demo
```

## Verify the installation

```python
import torch
import extended_einsum.interface as xe

x = xe.array(torch.tensor([[1.0, 2.0], [3.0, 4.0]]))
y = xe.exp(x).materialize()

assert y.backend == "torch"
assert y.shape == (2, 2)
print(y.backend_array)
```

`xe.array(...)` detects the backend from the native array type. All inputs in one expression must use the same backend.

## Next

Build and evaluate a multi-operation program in [your first expression](/getting-started/first-expression).
