---
title: "Benchmark Instance Data"
description: "Explanation of the data included for each benchmark instance"
summary: ""
date: 2024-06-06T11:40:09+02:00
lastmod: 2024-06-06T11:40:11+02:00
draft: false
weight: 200
toc: true
---

Every instance in `einsum_benchmark.instances` is a Python `BenchMarkInstance` named tuple, that is used to store all relevant information about the instance. It contains the following fields:

- `format_string` (str): The einsum format string of this instance.
- `tensors` (List): The list of tensors corresponding to the format string.
- `paths` (PathMetas): A nested named tuple that contains information about two paths for this instance. One path was optimized for minimal flops, the other minimizes the maximal intermediate size during the contraction. For more information see below.
- `result_sum` (Any): The sum of all entries in the output tensor after the complete contraction.
- `name` (str): The name of the benchmark instance.

## Path Optimization Target

The `PathMetas` is a nested NamedTuple within the `BenchMarkInstance` NamedTuple. It contains the following fields:

- `opt_size` (PathMeta): A NamedTuple that contains information about the path that minimizes the maximal intermediate size.
- `opt_flops` (PathMeta): A NamedTuple that contains information about the path the minimizes the total number of operations.

## Path Metadata

The `PathMeta` is a nested NamedTuple within the `PathMetas` NamedTuple. It contains the following fields:

- `path` (List[Tuple[int, int]]): A list of tuples that represent the path.
- `size` (float): The `log2` of the size of the largest intermediate tensor.
- `flops` (float): The number operations required to execute this path.
- `min_density` (float): The minimum density of any intermediate tensor.
- `avg_density` (float): The average density of all intermediate tensors, given by the number of nonzero entries across all intermediates divided by the number of (dense) entries across all intermediates. Therefore, large sparse tensors results in a low average while small sparse tensors only have a small impact on this metric. A low average density indicates an efficient execution using a sparse einsum backend.

