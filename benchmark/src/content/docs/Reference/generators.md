---
title: "Generators Reference"
description: "List of all available converters"
---

<!-- markdownlint-disable -->

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/__init__.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

## <kbd>module</kbd> `generators`

**Submodules**:

- language_model
- quantum_computing
- random
- structured

<!-- markdownlint-disable -->

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/language_model/__init__.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

## <kbd>module</kbd> `generators.language_model`

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/language_model/generator.py#L142"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `p_first_and_last`

```python
def p_first_and_last(
    mera_depth: int,
    axis_size_hidden: int,
    axis_size_observable: int
) → tuple[str, list[tuple[int, ]]]
```

Generates an einsum query and shape arguments for computing the distribution of the first and last observable in a model with the given parameters.

**Args:**

- <b>`mera_depth`</b> (int): Number of layers in a MERA network with 4th-order tensors.
- <b>`axis_size_hidden`</b> (int): Domain size of hidden variables.
- <b>`axis_size_observable`</b> (int): Domain size of observable variables.

**Returns:**

- <b>`tuple[str, list[tuple[int, ...]]]`</b>: The einsum format string, which is needed to compute the distribution, and the shapes of its arguments.

**Example:**

```python
format_string, argument_shapes = p_first_and_last(mera_depth=1, axis_size_hidden=3, axis_size_observable=11)
```

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/language_model/generator.py#L165"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `sliding_likelihood`

```python
def sliding_likelihood(
    mera_depth: int,
    axis_size_hidden: int,
    axis_size_observable: int,
    batch_size: int
) → tuple[str, list[tuple[int, ]]]
```

Generates an einsum query and shape arguments for computing the likelihood of the model on an imaginary batch of training data.

**Args:**

- <b>`mera_depth`</b> (int): Number of layers in a MERA network with 4th-order tensors.
- <b>`axis_size_hidden`</b> (int): Domain size of hidden variables.
- <b>`axis_size_observable`</b> (int): Domain size of observable variables.
- <b>`batch_size`</b> (int): Number of context windows to compute the likelihood for.

**Returns:**

- <b>`tuple[str, list[tuple[int, ...]]]`</b>: The einsum format string, which is needed to compute the batch likelihood, and the shapes of its arguments.

**Example:**

```python
format_string, shapes = sliding_likelihood(mera_depth=1, axis_size_hidden=3, axis_size_observable=11, batch_size=100)
```

<!-- markdownlint-disable -->

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/quantum_computing/__init__.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

## <kbd>module</kbd> `generators.quantum_computing`

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/quantum_computing/mps_product.py#L8"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `matrix_product_state`

```python
def matrix_product_state(
    n=100,
    phys_dim_min=10,
    phys_dim_max=200,
    bond_dim=20,
    seed=None
)
```

Generates a matrix product state (MPS) for a quantum computing simulation.

**Args:**

- <b>`n`</b> (int): The number of sites in the MPS. Default is 100.
- <b>`phys_dim_min`</b> (int): The minimum physical dimension of each site. Default is 10.
- <b>`phys_dim_max`</b> (int): The maximum physical dimension of each site. Default is 200.
- <b>`bond_dim`</b> (int): The bond dimension between neighboring sites. Default is 20.
- <b>`seed`</b> (int): The seed for the random number generator. Default is None.

**Returns:**

- <b>`tuple`</b>: A tuple containing the einsum string and the shapes of the tensors in the MPS.

**Example:**

```python
format_string, shapes = matrix_product_state(n=100, phys_dim_min=10, phys_dim_max=200, bond_dim=20, seed=0)
```

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/quantum_computing/maxcut.py#L9"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `maxcut`

```python
def maxcut(n=24, reg=3, p=3, seed=1)
```

Generates a Max-Cut quantum circuit using the Quantum Approximate Optimization Algorithm (QAOA).

**Args:**

- <b>`n`</b> (int): Number of nodes in the graph (default: 24).
- <b>`reg`</b> (int): Regularity of the graph (default: 3).
- <b>`p`</b> (int): Number of QAOA steps (default: 3).
- <b>`seed`</b> (int): Seed for random number generation (default: 1).

**Returns:**

- <b>`tuple`</b>: A tuple containing the input string and the arrays of the quantum circuit.

**Example:**

```python
format_string, arrays = maxcut(n=24, reg=3, p=3, seed=1)
```

<!-- markdownlint-disable -->

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/random/__init__.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

## <kbd>module</kbd> `generators.random`

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/random/randreg.py#L8"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `regular`

```python
def regular(n, reg, d_min=2, d_max=3, seed=None)
```

Create a random contraction equation that corresponds to a random regular graph.

The graph must not be connected and for large graphs it will very likely have several components

**Args:**

- <b>`n`</b> (int): The number of terms.
- <b>`reg`</b> (int): The degree of the graph.
- <b>`d_min`</b> (int, optional): The minimum size of an index.
- <b>`d_max`</b> (int, optional): The maximum size of an index.
- <b>`seed`</b> (None or int, optional): Seed for `networkx` and `np.random.default_rng` for repeatability.

**Returns:**

- <b>`Tuple[List[List[str]], List[str], List[Tuple[int]], Dict[str, int]]`</b>: The inputs, output, shapes, and size dictionary.

**Example:**

```python
format_string, shapes = randreg_equation(n=100, reg=3, d_min=2, d_max=4, seed=None)
```

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/random/connected_hypernetwork.py#L10"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `connected_hypernetwork`

```python
def connected_hypernetwork(
    number_of_tensors: int,
    regularity: float,
    max_tensor_order: int = None,
    max_edge_order: int = 2,
    diagonals_in_hyper_edges: bool = False,
    number_of_output_indices: int = 0,
    max_output_index_order: int = 1,
    diagonals_in_output_indices: bool = False,
    number_of_self_edges: int = 0,
    max_self_edge_order: int = 2,
    number_of_single_summation_indices: int = 0,
    global_dim: bool = False,
    min_axis_size: int = 2,
    max_axis_size: int = 10,
    seed: Optional[int] = None,
    return_size_dict: bool = False
) → Union[Tuple[str, Collection[Tuple[int, ]], Dict[str, int]], Tuple[str, Collection[Tuple[int, ]]]]
```

Generate a random connected Hyper Tensor Network (HTN).

Returns an einsum expressions string representing the HTN, shapes of the tensors and optionally a dictionary containing the index sizes.

**Args:**

- <b>`number_of_tensors`</b> (int): Number of tensors/arrays in the TN.
- <b>`regularity`</b> (float): 'Regularity' of the TN. This determines how many indices/axes each tensor shares with others on average (not counting output indices, global dimensions, self edges and single summation indices).
- <b>`max_tensor_order`</b> (int, optional): The maximum order (number of axes/dimensions) of the tensors. If `None`, use an upper bound calculated from other parameters.
- <b>`max_edge_order`</b> (int, optional): The maximum order of hyperedges.
- <b>`diagonals_in_hyper_edges`</b> (bool, optional): Whether diagonals can appear in hyper edges, e.g. in "aab,ac,ad -> bcd" a is a hyper edge with a diagonal in the first tensor.
- <b>`number_of_output_indices`</b> (int, optional): Number of output indices/axes (i.e. the number of non-contracted indices) including global dimensions. Defaults to 0 if global_dim = False, i.e., a contraction resulting in a scalar, and to 1 if global_dim = True.
- <b>`max_output_index_order`</b> (int, optional): Restricts the number of times the same output index can occur.
- <b>`diagonals_in_output_indices`</b> (bool, optional): Whether diagonals can appear in output indices, e.g. in "aab,ac -> abc" a is an output index with a diagonal in the first tensor.
- <b>`number_of_self_edges`</b> (int, optional): The number of self edges/traces (e.g. in "ab,bcdd->ac" d represents a self edge).
- <b>`max_self_edge_order`</b> (int, optional): The maximum order of a self edge e.g. in "ab,bcddd->ac" the self edge represented by d has order 3.
- <b>`number_of_single_summation_indices`</b> (int, optional): The number of indices that are not connected to any other tensors and do not show up in the ouput (e.g. in "ab,bc->c" a is a single summation index).
- <b>`min_axis_size`</b> (int, optional): Minimum size of an axis/index (dimension) of the tensors.
- <b>`max_axis_size`</b> (int, optional): Maximum size of an axis/index (dimension) of the tensors.
- <b>`seed`</b> (int, optional): If not None, seed numpy's random generator with this.
- <b>`global_dim`</b> (bool, optional): Add a global, 'broadcast', dimension to every operand.
- <b>`return_size_dict`</b> (bool, optional): Return the mapping of indices to sizes.

**Returns:**

- <b>`Tuple[str, List[Tuple[int]], Optional[Dict[str, int]]]`</b>: The einsum expression string, the shapes of the tensors/arrays, and the dict of index sizes (only returned if `return_size_dict=True`).

**Examples:**
'usual' Tensor Hyper Networks

```python
eq, shapes, size_dict = random_tensor_hyper_network(
    number_of_tensors=10,
    regularity=2.5,
    max_tensor_order=10,
    max_edge_order=5,
    number_of_output_indices=5,
    min_axis_size=2,
    max_axis_size=4,
    return_size_dict=True,
    seed=12345
)
# Then, eq, shapes, and size_dict are:
eq = 'bdca,abhcdg,cbmd,cfd,ed,e,figj,gl,h,nik->jnmkl'
shapes = [(2, 2, 2, 2), (2, 2, 4, 2, 2, 3), (2, 2, 4, 2), (2, 2, 2), (2, 2), (2,), (2, 4, 3, 3), (3, 2), (4,), (3, 4, 3)]
size_dict = {'a': 2, 'b': 2, 'c': 2, 'd': 2, 'e': 2, 'f': 2, 'g': 3, 'h': 4, 'i': 4, 'j': 3, 'k': 3, 'l': 2, 'm': 4, 'n': 3}
```

Tensor Hyper Networks with self edges (of higher order), single summation indices, output indices of higher order and a global dimension

```python
eq, shapes = random_tensor_hyper_network(
    number_of_tensors=10,
    regularity=2.5,
    max_tensor_order=5,
    max_edge_order=6,
    number_of_output_indices=5,
    max_output_index_order=3,
    number_of_self_edges=4,
    max_self_edge_order=3,
    number_of_single_summation_indices=3,
    global_dim=True,
    min_axis_size=2,
    max_axis_size=4,
    seed=12345
)
# Then, eq and shapes are:
eq = 'cabxk,gkegax,wldxbrb,ctoxdfo,xvdlv,weehx,nfnkx,spgpixqu,xjimhm,ijx->uvwtx'
shapes = [(3, 2, 4, 3, 2), (2, 2, 3, 2, 2, 3), (4, 4, 3, 3, 4, 3, 4), (3, 4, 3, 3, 3, 3, 3), (3, 3, 3, 4, 3), (4, 3, 3, 2, 3), (4, 3, 4, 2, 3), (3, 3, 2, 3, 2, 3, 2, 2), (3, 4, 2, 2, 2, 2), (2, 4, 3)]
```

Tensor Hyper Networks as above but with diagonals in hyper edges and output indices

```python
eq, shapes = random_tensor_hyper_network(
    number_of_tensors=10,
    regularity=3.0,
    max_tensor_order=10,
    max_edge_order=3,
    diagonals_in_hyper_edges=True,
    number_of_output_indices=5,
    max_output_index_order=3,
    diagonals_in_output_indices=True,
    number_of_self_edges=4,
    max_self_edge_order=3,
    number_of_single_summation_indices=3,
    global_dim=True,
    min_axis_size=2,
    max_axis_size=4,
    seed=12345
)
# Then, eq and shapes are:
eq = 'cabxk,gkegax,wldxbrb,ctoxdfo,xvdlv,weehx,nfnkx,spgpixqu,xjimhm,ijx->uvwtx'
shapes = [(3, 2, 4, 3, 2), (2, 2, 3, 2, 2, 3), (4, 4, 3, 3, 4, 3, 4), (3, 4, 3, 3, 3, 3, 3), (3, 3, 3, 4, 3), (4, 3, 3, 2, 3), (4, 3, 4, 2, 3), (3, 3, 2, 3, 2, 3, 2, 2), (3, 4, 2, 2, 2, 2), (2, 4, 3)]
```

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/random/connected_network.py#L11"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `connected_network`

```python
def connected_network(
    number_of_tensors: int,
    regularity: float,
    number_of_output_indices: int = 0,
    min_axis_size: int = 2,
    max_axis_size: int = 10,
    seed: Optional[int] = None,
    global_dim: bool = False,
    return_size_dict: bool = False
) → Union[Tuple[str, Collection[Tuple[int, ]], Dict[str, int]], Tuple[str, Collection[Tuple[int, ]]]]
```

Generate a random connected Tensor Network (TN).

**Args:**

- <b>`number_of_tensors`</b> (int): Number of tensors/arrays in the TN.
- <b>`regularity`</b> (float): 'Regularity' of the TN. This determines how many indices/axes each tensor shares with others on average (not counting output indices and a global dimension).
- <b>`number_of_output_indices`</b> (int, optional): Number of output indices/axes (i.e. the number of non-contracted indices) including the global dimension. Defaults to 0 in case of no global dimension, i.e., a contraction resulting in a scalar, and to 1 in case there is a global dimension.
- <b>`min_axis_size`</b> (int, optional): Minimum size of an axis/index (dimension) of the tensors.
- <b>`max_axis_size`</b> (int, optional): Maximum size of an axis/index (dimension) of the tensors.
- <b>`seed`</b> (int, optional): If not None, seed numpy's random generator with this.
- <b>`global_dim`</b> (bool, optional): Add a global, 'broadcast', dimension to every operand.
- <b>`return_size_dict`</b> (bool, optional): Return the mapping of indices to sizes.

**Returns:**

- <b>`Tuple[str, List[Tuple[int]], Optional[Dict[str, int]]]`</b>: The einsum expression string, the shapes of the tensors/arrays, and the dict of index sizes (only returned if return_size_dict=True).

**Example:**

```python
eq, shapes, size_dict = random_tensor_network(
   number_of_tensors = 10,
   regularity = 3.5,
   number_of_output_indices = 5,
   min_axis_size = 2,
   max_axis_size = 4,
   return_size_dict = True,
   global_dim = False,
   seed = 12345
)
# Then, eq, shapes, and size_dict are:
eq = 'gafoj,mpab,uhlbcdn,cqlipe,drstk,ve,fk,ongmq,hj,i->sturv'
shapes = [(3, 4, 4, 2, 3), (3, 2, 4, 2), (4, 4, 2, 2, 4, 2, 3), (4, 2, 2, 4, 2, 2), (2, 4, 3, 4, 4), (2, 2), (4, 4), (2, 3, 3, 3, 2), (4, 3), (4,)]
size_dict = {'a': 4, 'b': 2, 'c': 4, 'd': 2, 'e': 2, 'f': 4, 'g': 3, 'h': 4, 'i': 4, 'j': 3, 'k': 4, 'l': 2, 'm': 3, 'n': 3, 'o': 2, 'p': 2, 'q': 2, 'r': 4, 's': 3, 't': 4, 'u': 4, 'v': 2}
```

<!-- markdownlint-disable -->

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/structured/__init__.py#L0"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

## <kbd>module</kbd> `generators.structured`

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/structured/matrix_chain.py#L7"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `generate_mcm`

```python
def generate_mcm(
    num_matrices=10,
    min_dim=10,
    max_dim=1000,
    is_shuffle=False,
    seed=None
)
```

Generate a matrix chain multiplication problem.

**Args:**

- <b>`num_matrices`</b> (int): The number of matrices in the chain (default: 10).
- <b>`min_dim`</b> (int): The minimum dimension of each matrix (default: 10).
- <b>`max_dim`</b> (int): The maximum dimension of each matrix (default: 1000).
- <b>`is_shuffle`</b> (bool): Whether to shuffle the einsum string and shapes (default: False).
- <b>`seed`</b> (int): The seed value for reproducibility (default: None).

**Returns:**

- <b>`tuple`</b>: A tuple containing the einsum string and the shapes of the matrices.

**Raises:**

- <b>`AssertionError`</b>: If the lists of einsum string and shapes have different sizes.

**Example:**

```python
generate_mcm(num_matrices=10, min_dim=10, max_dim=1000, is_shuffle=True, seed=0)
```

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/structured/tree.py#L7"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `tree`

```python
def tree(n=100, d_min=4, d_max=12, n_outer=2, seed=1)
```

Create a random contraction equation that corresponds to a tree.

**Args:**

- <b>`n`</b> (int): The number of tensors.
- <b>`d_min`</b> (int, optional): The minimum size of an index.
- <b>`d_max`</b> (int, optional): The maximum size of an index.
- <b>`n_outer`</b> (int, optional): The number of outer indices.
- <b>`seed`</b> (int, optional): Seed for generator.

**Returns:**

- <b>`tuple`</b>: A tuple containing the contraction equation format string and the shapes of the tensors.

---

<a href="https://github.com/ti2-group/einsum_benchmark/blob/main/src/einsum_benchmark/generators/structured/lattice.py#L9"><img align="right" style="float:right;" src="https://img.shields.io/badge/-source-cccccc?style=flat-square" /></a>

### <kbd>function</kbd> `lattice`

```python
def lattice(dims, cyclic=False, d_min=2, d_max=None, seed=None)
```

Create a random contraction equation that corresponds to a lattice.

**Args:**

- <b>`dims`</b> (sequence of int): The size of each dimension, with the dimensionality being the length of the sequence.
- <b>`cyclic`</b> (bool or sequence of bool, optional): Whether each dimension is cyclic or not. If a sequence, must be the same length as `dims`.
- <b>`d_min`</b> (int, optional): The minimum size of an index.
- <b>`d_max`</b> (int, optional): The maximum size of an index. If `None`, defaults to `d_min`, i.e. all indices are the same size.
- <b>`seed`</b> (None or int, optional): Seed for `random.Random` for repeatability.

**Returns:**

- <b>`tuple`</b>: A tuple containing the contraction equation format string and the shapes of the inputs.

**Raises:**

- <b>`TypeError`</b>: If `cyclic` is a sequence but not the same length as `dims`.

