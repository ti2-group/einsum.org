---
title: "Optimize and visualize a program"
description: "Apply folding and contraction-path passes to the extracted IR"
sidebar:
  order: 3
---

Use the explicit compiler API when you need to inspect, transform, visualize, or benchmark a program before backend lowering.

## Extract the IR

```python
import extended_einsum.interface as xe
from extended_einsum.preprocess import (
    FoldSameShapedOperations,
    OptimizeContractionPaths,
)

program, inputs = xe.extract_program(
    expression,
    stability_mode="scaled_sum",
)
```

## Fold matching operations

```python
folded = FoldSameShapedOperations.apply(program)
```

Folding finds independent operations with compatible operator semantics, operand shapes, formats, and graph depth. It introduces a batch axis so multiple equal-shaped operations can run in one backend call. Consumer-aware member ordering aims to replace scattered gathers with contiguous slices.

To inspect input and parameter permutations produced by folding, request metadata:

```python
fold_result = FoldSameShapedOperations.apply_with_metadata(program)
folded = fold_result.program

print(fold_result.input_axis0_orders)
print(fold_result.parameter_stack_orders)
```

Apply these orders when packing inputs or parameters for a long-lived compiled model.

## Replan contraction paths

```python
optimized = OptimizeContractionPaths.apply(folded)
```

The pass finds connected einsum components and replaces them with binary contraction schedules. It uses shape information and avoids increasing the original program’s dependency depth.

## Lower and run manually

```python
from extended_einsum.backend_translation import (
    run_program,
    translate_to_backend_program,
)
from extended_einsum.backends.registry import BACKEND_TO_FUNCTIONS

backend_program = translate_to_backend_program(
    optimized,
    BACKEND_TO_FUNCTIONS[expression.backend],
)
native_inputs = [item.backend_array for item in inputs]
result = run_program(backend_program, native_inputs)
```

## Visualize the DAG

The demo’s `visualize_quad_tree.py` follows this exact pipeline and plots each stage. For your own expression:

```python
import matplotlib.pyplot as plt
from extended_einsum.visualization import plot_expression_dag

ax = plot_expression_dag(
    optimized,
    show_tensor_ids=True,
    collapse_fused_einsums=False,
)
ax.figure.savefig("program.pdf", bbox_inches="tight")
plt.close(ax.figure)
```

The original demo additionally labels parameters and data separately and generates before-folding, after-folding, and optimized-path PDFs for CP and Tucker quad trees.
