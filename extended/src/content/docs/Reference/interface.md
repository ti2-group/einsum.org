---
title: "Interface API"
description: "Frontend arrays, expressions, operators, and materialization"
sidebar:
  order: 1
---

The usual import is:

```python
import extended_einsum.interface as xe
```

## Arrays and expressions

### `array(backend_array, format="dense")`

Wraps a native `torch.Tensor`, `numpy.ndarray`, or `jax.Array` in a `BackendArrayWrapper`.

- `backend_array`: native array, retained without copying.
- `format`: `"dense"` or `"sparse"` metadata.
- returns: wrapper with `.backend_array`, `.shape`, `.backend`, and `.format`.

### `TensorExpression`

A lazy operation node. Read-only public properties:

- `shape: tuple[int, ...]`
- `backend: "torch" | "numpy" | "jax"`
- `format: "dense" | "sparse"`
- `operator`
- `arguments`

Arithmetic operators `+`, `-`, `*`, and `/` create elementwise expression nodes. `@` creates a matrix multiplication expression using einsum. Reflected scalar operators and general `__getitem__` indexing are not implemented; wrap arrays and use the explicit layout functions.

### `TensorExpression.materialize(stability_mode="unstable")`

Extracts the rich program, translates it for the expression’s backend, compiles it with the registered compiler, executes it, and returns a `BackendArrayWrapper`. Access the native result through `.backend_array`.

### `extract_program(tensor_expression, stability_mode)`

Returns `(RichProgram, input_arguments)`. This is the entry point for explicit preprocessing, visualization, or manual backend translation.

### `Parameter(array)`

Marks an input as a model parameter so stable translation can distinguish parameter-derived values from data-derived values. Import it from:

```python
from extended_einsum.interface.tensor_expression import Parameter
```

## Contractions and nonlinearities

### `einsum(format_string, *operands)`

Creates an einsum node. Explicit output notation is required, for example `"bij,bjk->bik"`. The number of comma-separated input subscripts must equal the number of operands, and every output label must appear in an input.

### `exp(a)`, `log(a)`

Create pointwise exponential and logarithm nodes.

### `softmax(a, axis=0)`

Creates a softmax node. `axis` may be an integer or a non-empty tuple of axes; negative axes are normalized. The input must have at least one dimension.

The implementation module also defines `sin`, `cos`, `tan`, `sqrt`, and `inverse`, but these are not currently re-exported by `extended_einsum.interface`, and backend translation does not yet lower all of them. Treat them as experimental.

## Layout and routing

### `stack(operands, *, axis=0)`

Stacks a non-empty list of equal-shaped, equal-format operands along a new axis.

### `take(source, index, *, axis=0)`

Selects positions along `axis` using a wrapped backend index array. Both source and index must have at least one dimension.

### `select(source, index, *, axis=0)`

Selects one integer position and removes `axis` from the result.

### `slice(source, start, stop, *, axis=0)`

Selects the half-open interval `[start, stop)` along `axis` and preserves the axis.

## Shape and backend rules

- Every operand in an expression must use the same backend.
- Shapes are inferred when nodes are constructed, so most errors surface before execution.
- Binary arithmetic follows backend broadcasting at execution, with compiler shape inference tracking the expected result.
- Tensor format metadata propagates through unary operations. Binary operations require compatible formats.
