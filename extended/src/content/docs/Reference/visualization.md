---
title: "Visualization API"
description: "Build and plot expression DAGs"
sidebar:
  order: 5
---

```python
from extended_einsum.visualization import (
    build_expression_dag,
    plot_expression_dag,
)
```

## `build_expression_dag(program)`

Returns a NetworkX directed graph whose nodes are SSA tensor IDs. Edges point from an instruction result to the values it depends on. Input tensors are leaves. Operation nodes include operator metadata; einsum nodes also include the format string.

## `plot_expression_dag(...)`

```python
ax = plot_expression_dag(
    program,
    save_path=None,
    ax=None,
    input_labels=None,
    show=False,
    show_edge_labels=False,
    figsize=None,
    collapse_fused_einsums=True,
    show_tensor_ids=True,
    vertical_spacing=1.0,
    horizontal_spacing=1.0,
    max_operator_label_width=24,
)
```

Returns a Matplotlib axes. `input_labels` may be a sequence or an input-ID-to-label mapping. `save_path` accepts any format supported by Matplotlib. When `collapse_fused_einsums=True`, recognized stack/take/einsum groups are displayed as one fused operation.
