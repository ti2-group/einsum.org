export const examples = [
  {
    title: 'Tucker decomposition',
    value: `parameters // Input tensors (training data)
  T 3     // The tensor we want to decompose
variables // Variable tensors (model weights)
  C 3     // The core of the decomposition
  u 2, v 2, w 2 // One matrix for each axis
min       // The objective function
  norm(T - #(ijk,ai,bj,ck->abc;C,u,v,w))^2`,
  },
  {
    title: 'Non-negative tensor regression (ring network)',
    value: `parameters // Input tensors (training data)
  X 4, y 1 // Features X and labels y
variables // Variable tensors (model weights)
  th0 3, th1 3, th2 3 // Components of theta
cse       // Reusable (sub)expressions
  theta=#(zax,xby,ycz->abc;th0,th1,th2)
min       // The objective function
  sum((#(nabc,abc->n;X,theta)-y)^2)
st        // Optimization constraints
  theta >= 0`,
  },
  {
    title: 'Spectral clustering (ratio cut)',
    value: `parameters // Input tensors (training data)
  D 2, W 2 // Degree and weight matrix
variables  // Variable tensors
  V 2      // Target matrix
min        // The objective function
  #(ji,jk,ki->;V,D-W,V)  // tr(V^T*(D-W)*V)
st         // Optimization constraints
  #(ji,jk->ik;V,V) == delta(1) // V^T*V = I
    `,
  },
  {
    title: 'Density estimation (tensor train)',
    value: `parameters // Input tensors (training data)
  D0 2, D1 2, D2 2 // One matrix per feature
variables // Variable tensors (model weights)
  th0 2, th1 3, th2 2 // Cores in the tensor train
cse       // Common subexpressions
  theta = #(ax,xby,yc->abc;th0,th1,th2)
max       // The objective function
  sum(log(#(abc,an,bn,cn->n;theta,D0,D1,D2)^2))
st        // Constraints of the optimization
  ||theta||^2 == 1`,
  },
] as { title: string; value: string }[];
