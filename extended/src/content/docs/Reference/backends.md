---
title: "Backend API"
description: "Backend protocols, bundled implementations, and registration"
sidebar:
  order: 3
---

## Backend protocols

```python
from extended_einsum.backend_translation import (
    BackendArray,
    BackendCompiler,
    BackendFunctions,
    BackendProgram,
)
```

### `BackendArray`

A protocol requiring a `.shape` property.

### `BackendFunctions`

A structural protocol. Implementations provide these static methods:

| Category | Methods |
| --- | --- |
| Gradient | `stop_gradient` |
| Transcendental | `exp`, `log` |
| Reductions | `sum`, `max`, `min` |
| Elementwise | `maximum`, `add`, `subtract`, `multiply`, `divide` |
| Shape | `reshape`, `broadcast_to` |
| Composition | `stack`, `concat` |
| Routing | `take`, `select`, `slice` |
| Tensor operations | `softmax`, `einsum` |

Reduction axes accept `int | tuple[int, ...] | None` and a `keepdims` flag. These exact semantics are necessary for the broadcast scales created by stable translation.

### `BackendCompiler.compile(program, inputs)`

Validates and specializes a `BackendProgram`, returning a callable that takes a sequence of native input arrays.

## Bundled implementations

| Backend | Functions | Compiler behavior |
| --- | --- | --- |
| PyTorch | `TorchBackendFunctions` | `torch.compile(partial(run_program, program))` |
| JAX | `JaxBackendFunctions` | `jax.jit(...).trace(inputs).lower().compile()` |
| NumPy | `NumpyBackendFunctions` | Interprets with `run_program` |

## Registry

```python
from extended_einsum.backends.registry import (
    BACKEND_TO_COMPILER,
    BACKEND_TO_FUNCTIONS,
)
```

`TensorExpression.materialize()` looks up both mappings using the expression’s `.backend` value.

## Backend detection

`get_backend_of_array(array)` recognizes `torch.Tensor`, `numpy.ndarray`, and `jax.Array`, returning `"torch"`, `"numpy"`, or `"jax"`. Unsupported array types raise `ValueError`.

See [write a custom backend](/guides/custom-backend) for an implementation checklist and registration example.
