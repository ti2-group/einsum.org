---
title: "Getting Started"
description: "How to install our python package and using it to load an instance"
---

## Installation

Execute the following command to install the minimal version of our package. **You will need python 3.10 or higher**.

```bash
pip install einsum_benchmark
```

This will only install dependencies that are required to load the benchmark instances. If you want to use our generators or path finding functions you will need to install the respective extra dependencies as well:

```bash
pip install "einsum_benchmark[generators,path]"
```

The quotes may be unecessary depending on your used shell.

## Usage

After the installation you can acccess a single instance like this:

```python
import einsum_benchmark

instance = einsum_benchmark.instances["qc_circuit_n49_m14_s9_e6_pEFGH_simplified"]
```

Or iterate over all instances like this:

```python
import einsum_benchmark
import opt_einsum as oe

for instance in einsum_benchmark.instances:
  print(instance.name)
```

You can execute a single instance like this:

```python
instance = einsum_benchmark.instances["qc_circuit_n49_m14_s9_e6_pEFGH_simplified"]

opt_size_path_meta = instance.paths.opt_size
print("Size optimized path")
print("log10[FLOPS]:", round(opt_size_path_meta.flops, 2))
print("log2[SIZE]:", round(opt_size_path_meta.size, 2))
result = oe.contract(
    instance.format_string, *instance.tensors, optimize=opt_size_path_meta.path
)
print("sum[OUTPUT]:", result.sum(), instance.result_sum)
```

To get more information about the data included for each instance, please read the next section
