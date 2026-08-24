---
title: "Write a custom backend"
description: "Implement, register, and validate an array backend with register_backend"
sidebar:
  order: 5
---

A backend plugs in through `extended_einsum.register_backend` and consists of:

1. an array type that exposes `shape`;
2. a `BackendFunctions` subclass providing the primitive tensor operations;
3. optionally a `BackendCompiler` and an `is_array` detection predicate.

Custom backends register at runtime under any name — no changes to the package are needed. Use `extended_einsum/backends/numpy.py` as the minimal reference (primitives only) and `extended_einsum/backends/torch.py` as the full one (overridden defaults and a JIT compiler).

## 1. Subclass `BackendFunctions`

`BackendFunctions` is an abstract base class, generic over the array type. Only twelve primitives are abstract:

`exp`, `log`, `sum`, `max`, `min`, `maximum`, `reshape`, `broadcast_to`, `stack`, `concat`, `take`, and `einsum`.

```python
import extended_einsum as xe

class MyBackendFunctions(xe.BackendFunctions[MyArray]):
    def exp(self, array): return mylib.exp(array)

    def log(self, array): return mylib.log(array)

    def sum(self, array, axis=None, keepdims=False):
        return mylib.sum(array, axis=axis, keepdims=keepdims)

    # ... max, min, maximum, reshape, broadcast_to,
    #     stack, concat, take, einsum
```

The remaining operations have default implementations composed from the primitives or from the array type's standard Python protocols:

- `add`, `subtract`, `multiply`, `divide` use the `+`, `-`, `*`, `/` operators;
- `select` and `slice` use `__getitem__` indexing;
- `softmax` is composed from `max`, `exp`, `sum`, `subtract`, and `divide`;
- `stop_gradient` is the identity.

Override a default when the backend offers a faster or more precise native version (e.g. a fused softmax), or when its arrays do not support the standard operators. **Backends with automatic differentiation must override `stop_gradient`** (`array.detach()` in PyTorch, `jax.lax.stop_gradient` in JAX) — the identity default silently breaks gradients of stable lowerings.

Match the signatures exactly. In particular:

- `axis` may be an integer, a tuple, or `None` for reductions;
- `keepdims` must preserve broadcastable scale shapes;
- `softmax` must support one axis or a tuple of axes.

Because the primitives are abstract, an incomplete subclass fails at instantiation time. Registration also accepts duck-typed objects, but then missing methods are only caught by the registration check.

## 2. Register it

```python
xe.register_backend(
    "mybackend",
    MyBackendFunctions(),
    is_array=lambda array: isinstance(array, MyArray),
)
```

- **Name**: any non-empty string; registering an existing name replaces that backend.
- **Compiler**: omitted here, so programs are interpreted call by call by the built-in `DefaultCompiler`.
- **`is_array`**: lets `xe.array(native_array)` detect the backend automatically. Later-registered predicates take precedence, so a custom backend whose arrays subclass a built-in array type still detects correctly. Without a predicate, wrap arrays explicitly: `xe.array(data, backend="mybackend")`.

## 3. Optionally add a compiler

A compiler turns a `BackendProgram` into a callable, typically by wrapping the included interpreter with the backend's JIT:

```python
from functools import partial
from extended_einsum.backend_translation import run_program

class MyCompiler:
    def compile(self, program, inputs):
        if len(inputs) != program.n_inputs:
            raise ValueError("wrong number of inputs")
        return my_jit(partial(run_program, program))

xe.register_backend("mybackend", MyBackendFunctions(), MyCompiler(), is_array=...)
```

PyTorch uses `torch.compile(partial(run_program, program))`; JAX traces, lowers, and compiles with `jax.jit`.

## 4. Validate with the conformance checker

`extended_einsum.testing.check_backend` runs every supported operator through every stability mode using the backend as registered (including its compiler) and compares the results against the NumPy reference backend:

```python
from extended_einsum.testing import check_backend

check_backend(
    "mybackend",
    from_numpy=to_my_array,      # np.ndarray -> MyArray
    to_numpy=from_my_array,      # MyArray -> np.ndarray
)
```

Operator/mode combinations raising `NotImplementedError` are skipped, matching the library's contract for unsupported combinations; everything else must match the reference, and the raised `AssertionError` lists every failing combination. Loosen `rtol`/`atol` for single-precision backends.

Beyond conformance, also verify gradients (if applicable) for `stop_gradient`, reductions, stable contractions, and routing operations. Tuple-axis softmax and reduction `keepdims=True` are common integration pitfalls.
