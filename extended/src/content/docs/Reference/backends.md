---
title: "Backend API"
description: "Backend base classes, bundled implementations, registration, and detection"
sidebar:
  order: 3
---

## Backend types

```python
from extended_einsum import BackendCompiler, BackendFunctions, register_backend
from extended_einsum.backend_translation import (
    BackendArray,
    BackendProgram,
    DefaultCompiler,
    run_program,
)
```

### `BackendArray`

A protocol requiring a `.shape` property returning a sequence of ints.

### `BackendFunctions`

An abstract base class, generic over the array type. Abstract primitives every backend must implement:

| Category | Methods |
| --- | --- |
| Transcendental | `exp`, `log` |
| Reductions | `sum`, `max`, `min` |
| Elementwise | `maximum` |
| Shape | `reshape`, `broadcast_to` |
| Composition | `stack`, `concat` |
| Routing | `take` |
| Tensor operations | `einsum` |

Defaulted methods, overridable for faster or more precise native versions:

| Method | Default implementation |
| --- | --- |
| `add`, `subtract`, `multiply`, `divide` | the array type's `+`, `-`, `*`, `/` operators |
| `select`, `slice` | `__getitem__` indexing |
| `softmax` | composed from `max`, `exp`, `sum`, `subtract`, `divide` |
| `stop_gradient` | identity — backends with automatic differentiation must override it |

Reduction axes accept `int | tuple[int, ...] | None` and a `keepdims` flag. These exact semantics are necessary for the broadcast scales created by stable translation.

### `BackendCompiler.compile(program, inputs)`

Validates and specializes a `BackendProgram`, returning a callable that takes a sequence of native input arrays. `DefaultCompiler` is the fallback implementation: it validates the input count and interprets the program call by call with `run_program`.

## Bundled implementations

| Backend | Functions | Compiler behavior |
| --- | --- | --- |
| PyTorch | `TorchBackendFunctions` | `torch.compile(partial(run_program, program))` |
| JAX | `JaxBackendFunctions` | `jax.jit(...).trace(inputs).lower().compile()` |
| NumPy | `NumpyBackendFunctions` | Interprets with `DefaultCompiler` |

NumPy is the reference backend: it implements only the abstract primitives and exercises every `BackendFunctions` default.

## Registration

```python
register_backend(name, functions, compiler=None, *, is_array=None)
```

Registers an execution backend under `name` (any non-empty string; re-registering a name replaces the previous backend).

- `functions`: preferably a `BackendFunctions` subclass, so missing primitives fail at instantiation time. Duck-typed objects are accepted but checked for the required methods at registration time.
- `compiler`: optional; defaults to `DefaultCompiler`.
- `is_array`: optional predicate `object -> bool` used for backend detection (below).

The built-in backends register themselves through the same mechanism on import; JAX only if importable. `TensorExpression.materialize()` looks up the registered functions and compiler using the expression's `.backend` name. Looking up an unregistered name raises `ValueError` naming the registered backends.

## Backend detection

`xe.array(native_array)` detects the backend by testing the registered `is_array` predicates, later-registered predicates first — so a custom backend whose arrays subclass a built-in array type still detects correctly. The built-ins recognize `numpy.ndarray`, `torch.Tensor`, and `jax.Array`.

For a backend registered without a predicate, pass the name explicitly: `xe.array(data, backend="mybackend")`. An array no predicate matches raises `ValueError`.

## Conformance testing

`extended_einsum.testing.check_backend(backend, *, from_numpy, to_numpy, rtol=1e-5, atol=1e-8)` runs every supported operator through every stability mode against the NumPy reference and raises `AssertionError` listing all failing combinations.

See [write a custom backend](/guides/custom-backend) for an implementation walkthrough.
