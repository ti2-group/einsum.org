---
title: "Compiler API"
description: "Rich programs, preprocessing passes, translation, and runtime"
sidebar:
  order: 2
---

## `RichProgram`

```python
from extended_einsum.language.rich_program import RichProgram
```

An immutable program record with:

| Field | Meaning |
| --- | --- |
| `instructions` | Topologically ordered `RichInstruction` values |
| `n_inputs` | Number of SSA IDs reserved for external inputs |
| `stability_mode` | Selected direct, scaled, or log-space lowering mode |
| `shapes` | Shape for every input and instruction result |
| `tensor_formats` | `"dense"` or `"sparse"` for every SSA value |
| `parameter_indices` | Input SSA IDs marked as parameters |
| `arguments_of_ssa_id` | Derived argument lookup |
| `consumers_of_ssa_id` | Derived consumer lookup |

`output_ssa` is the final instruction’s result ID. `to_raw_program()` removes rich shape, format, and stability metadata.

## `RichInstruction`

Each instruction contains a `RichOperator` and `argument_ssa_ids`. Input IDs come first; instruction result `i` has SSA ID `program.n_inputs + i`.

## Preprocessing

```python
from extended_einsum.preprocess import (
    FoldSameShapedOperations,
    OptimizeContractionPaths,
)
```

### `FoldSameShapedOperations.apply(program)`

Returns a rewritten program that batches compatible parallel operations.

### `FoldSameShapedOperations.apply_with_metadata(program)`

Returns `FoldSameShapedOperationsResult` with:

- `program`
- `batched_result_orders`
- `non_parameter_stack_orders`
- `parameter_stack_orders`
- `input_axis0_orders`
- `concatenated_batch_orders`

### `OptimizeContractionPaths.apply(program)`

Finds connected einsum components and creates depth-preserving binary plans. The pass uses `sesum` path search and the program’s shape metadata.

### Group inspection helpers

`group_identical_ops_by_output_depth(program, min_group_size=2)` and `group_identical_ops_by_input_depth(...)` expose the grouping analysis used by folding. These are advanced APIs useful when building alternative schedules.

## Translation

```python
from extended_einsum.backend_translation import translate_to_backend_program

backend_program = translate_to_backend_program(program, backend_functions)
```

Translation binds IR operators to backend primitives and inserts the operations required by the selected stability mode.

## `BackendProgram`

| Field | Meaning |
| --- | --- |
| `backend_calls` | Primitive callables accepting a sequence of native arrays |
| `call_arguments` | Positions supplied to each callable |
| `n_inputs` | Number of leading runtime values treated as inputs |

Input arrays occupy the first positions. Every backend call appends one value. The runtime returns the final value.

## Runtime

```python
from extended_einsum.backend_translation import run_program

native_result = run_program(backend_program, native_inputs)
```

`run_program` is the interpreter used directly by NumPy and wrapped by the PyTorch and JAX compilers.
