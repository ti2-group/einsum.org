---
title: "Write a custom backend"
description: "Implement and register an array backend based on the PyTorch backend"
sidebar:
  order: 5
---

A backend has three pieces:

1. an array type that exposes `shape`;
2. a `BackendFunctions` implementation for primitive tensor operations;
3. a `BackendCompiler` that turns a `BackendProgram` into a callable.

Use `extended_einsum/backends/torch.py` as the complete reference implementation.

## 1. Implement the primitive operations

```python
from collections.abc import Sequence

class MyBackendFunctions:
    @staticmethod
    def stop_gradient(array):
        return mylib.stop_gradient(array)

    @staticmethod
    def exp(array): return mylib.exp(array)

    @staticmethod
    def log(array): return mylib.log(array)

    @staticmethod
    def sum(array, axis=None, keepdims=False):
        return mylib.sum(array, axis=axis, keepdims=keepdims)

    # Also implement max, min, maximum, reshape, broadcast_to,
    # stack, concat, take, select, slice, softmax, einsum,
    # add, subtract, multiply, and divide.
```

Match the protocol signatures exactly. Pay particular attention to:

- `axis` may be an integer, a tuple, or `None` for reductions;
- `keepdims` must preserve broadcastable scale shapes;
- `softmax` must support one axis or a tuple of axes;
- `take`, `select`, and `slice` have distinct shape semantics;
- `stop_gradient` is required for correct and efficient stable lowering.

## 2. Implement a compiler

The simplest compiler uses the included interpreter:

```python
from functools import partial
from extended_einsum.backend_translation.runtime import run_program

class MyCompiler:
    @staticmethod
    def compile(program, inputs):
        if len(inputs) != program.n_inputs:
            raise ValueError("wrong number of inputs")
        return partial(run_program, program)
```

An optimizing backend can wrap this callable with its JIT. PyTorch uses `torch.compile(partial(run_program, program))`; JAX uses its own compilation strategy.

## 3. Teach array detection about the backend

`xe.array(native_array)` calls `get_backend_of_array`, whose return type is currently the closed literal `"torch" | "numpy" | "jax"`. A new first-class backend therefore needs a new literal in `language/types.py` and a matching type check in `backend_translation/backend.py`.

## 4. Register it

```python
from extended_einsum.backends.registry import (
    BACKEND_TO_COMPILER,
    BACKEND_TO_FUNCTIONS,
)

BACKEND_TO_FUNCTIONS["mybackend"] = MyBackendFunctions()
BACKEND_TO_COMPILER["mybackend"] = MyCompiler()
```

For an out-of-tree experiment you can patch the registries at startup, but a full integration should extend the `Backend` type and array detection in the package itself.

## 5. Test every stability mode

Compare the backend against NumPy on small positive inputs for `unstable`, `scaled_sum`, `scaled_min`, `logspace_max`, and `logspace_min`. Also verify gradients for `stop_gradient`, reductions, stable contractions, and routing operations. Tuple-axis softmax and reduction `keepdims=True` are common integration pitfalls.
