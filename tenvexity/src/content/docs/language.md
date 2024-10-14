# The input language

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
 - $\text{abs}(A)$ (or $|A|$), $\text{sign}(A)$, $\text{relu}(A)$,
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

## Properties
Using the table, input tensors can restricted with a bounding interval.
Even-ordered tensors may also be tagged with specific tensor properties.
We generalize these properties from the matrix case as follows.

### Diagonality
The diagonal of a tensor $A$ of order $2o$ is a tensor of order $o$ (not always a vector), namely $\#('i_1\dots i_o i_1\dots i_o ~\rightarrow~ i_1\dots i_o', A)$.
$A$ is a diagonal tensor if and only if all non-diagonal entries are $0$.

### Symmetry
$A$ is symmetric if and only if $A = \#('i_1\dots i_o j_1\dots j_o ~\rightarrow~ j_1\dots j_o i_1\dots i_o', A)$.

### Definiteness
$A$ is positive semi-definite if and only if for all matching tensors $x$ of order $o$, $\#('i_1\dots i_o,~i_1\dots i_o j_1\dots j_o,~j_1\dots j_o ~\rightarrow~', x, A, x) \geq 0$.

Negative semidefiniteness and both types of strict definiteness are defined analogously.