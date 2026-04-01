---
title: 'Input Language'
layout: '../layouts/base.astro'
---
## Structure
The input consists of up to five blocks:

Parameters and variables:
 - These blocks introduce input tensors by name, followed by their order (an integer).
 - Any alphanumeric symbol that begins with a letter is a valid tensor name, unless it is already used as a function name.
 - Multiple specifications on the same line should be separated by a comma.
 - Only variables are subject to the optimization.

Objective function ("min" or "max"):
 - The expression specified after the "min" or "max" keyword is the optimization target.

Common subexpressions ("cse"; optional):
 - Specify a (recurring) expression in the form "{name} = {expression}".
 - In the following, the specified expression will be substituted whenever {name} appears.
 - Multiple expressions may be specified.

Constraints ("st"; optional):
 - Specify one or multiple constraints by combining two expressions with "==" (or "="), "<", ">", "<=" or ">=".
 - Example: $||\text{theta}|| == 1$


## *Einsum*
The *einsum* notation expresses tensor aggregations using index strings.
We use the symbol # to denote the beginning of an *einsum* expression, and the overall pattern is:

$\#('[\text{operand indices}]~\rightarrow~[\text{result indices}]',~[\text{operands}])$

The table below shows how to convert common operations from linear algebra into *einsum* notation.
Note, however, that *einsum* allows more than two operands as well as operands with more than two indices.

| Operation           | Linear algebra | *Einsum*                            |
| ------------------- | :------------: | ----------------------------------- |
| Elementwise product |   $x\odot y$   | $\#('i,i~\rightarrow~i', x, y)$     |
| Inner product       |   $x^\top y$   | $\#('i, i~\rightarrow~', x, y)$     |
| Outer product       |   $xy^\top$    | $\#('i, j~\rightarrow~ij', x, y)$   |
| Matrix transpose    |    $A^\top$    | $\#('ij~\rightarrow~ji', A)$        |
| Matrix diagonal     |   diag$(A)$    | $\#('ii~\rightarrow~i', A)$         |
| Diagonal matrix     |   diag$(v)$    | $\#('i~\rightarrow~ii', v)$         |
| Matrix product      |  $A \cdot B$   | $\#('ij, jk~\rightarrow~ik', A, B)$ |

Apart from the availability of duplicate indices in the result index string, our use of *einsum* is equivalent to that of existing frameworks.
See [numpy.einsum](https://numpy.org/doc/stable/reference/generated/numpy.einsum.html) for more information.

## Elementwise functions
The following unary and binary functions are applied elementwise to the operand tensor(s):

 - $A+B$, $A-B$, $-A$,
 - $\exp(A)$, $\log(A)$, 
 - $\text{abs}(A)$ (or $|A|$), $\text{sign}(A)$, $\text{relu}(A)$, $\text{sigmoid}(A)$,
 - $\sin(A)$, $\cos(A)$, $\tan(A)$,
 - $\text{asin}(A)$, $\text{acos}(A)$, $\text{atan}(A)$, $\text{tanh}(A)$

## Non-elementwise functions
The following non-elementwise functions from linear algebra are also available:

 - $\text{inv}(A)$, $\text{det}(A)$, $\text{adj}(A)$

## Constant symbols
Constants are fixed (i.e. non-input) tensors. 
Two kinds of constants are permitted:

 - Numbers such as $0$, $1$ and $3.14159$ are interpreted as tensors with that entry in every position. The order is inferred from context.
 - Delta tensors are written as $\text{delta}(o)$, where $o$ is an integer. For example, $\text{delta}(1)$ is the unit matrix.

## Shorthand notations
The following shorthands are internally mapped back to other functions.

 - $\text{sum}(A)$ is the sum of all elements in $A$, e.g. $\text{sum}(A) = \#('ij ~\rightarrow~ ', A)$ for a matrix.
 - Similarly, $\text{trace}(A)$ sums over the diagonal of $A$.
 - $A*B$ computes the elementwise product of $A$ and $B$, e.g. $A*B = \#('ij, ij ~\rightarrow~ ij', A, B)$ for matrices. Scalars are also allowed.

