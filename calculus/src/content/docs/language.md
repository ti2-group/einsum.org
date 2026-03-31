---
title: 'Input Language'
template: 'splash'
---
## Variables
Variable names are alphanumeric symbols that begin with a letter.
If the symbol does not correspond to any known keyword (such as a function name), it is automatically assumed to be a variable.
The order of variables is inferred automatically wherever possible, defaulting to 2.

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

## Shorthands
The following shorthands are internally mapped back to other functions.

 - $\text{sum}(A)$ is the sum of all elements in $A$, e.g. $\text{sum}(A) = \#('ij ~\rightarrow~ ', A)$ for a matrix.
 - Similarly, $\text{trace}(A)$ sums over the diagonal of $A$.
 - $A*B$ computes the elementwise product of $A$ and $B$, e.g. $A*B = \#('ij, ij ~\rightarrow~ ij', A, B)$ for matrices. Scalars are also allowed. 
 - $A@B$ computes the matrix product $\#('ij, jk ~\rightarrow~ ik', A, B)$ of two matrices $A$ and $B$. In general, it contracts the rightmost axis of $A$ with the leftmost axis of $B$.
 - $A@@B$ cumputes the full outer product $\#('ij, kl ~\rightarrow~ ijkl', A, B)$ of $A$ and $B$, regardless of their order.

## Assignments
For convenientce, the main expression may be preceeded by assigments of the form NAME = expression.
Subsequent expressions may use NAME to reference the assigned expression.
The final expression must not be part of an assignment.
Separating assignments with linebreaks is recommended but not required.
