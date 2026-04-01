export const examples = [
  {
    title: 'Minimal example',
    value: `X`,
    wrt: 'X',
  },
  {
    title: 'Diagonal broadcast',
    value: `#(',,i->ii', s, s, d)`,
    wrt: 's',
  },
  {
    title: 'Least squares regression',
    value: `sum((#('ij,i->j',X, w)-y)^2)`,
    wrt: 'w',
  },
  {
    title: 'Logtrace',
    value: `log(trace(X))`,
    wrt: 'X',
  },
  {
    title: 'Exptrace',
    value: `exp(trace(X))`,
    wrt: 'X',
  },
  {
    title: 'tr(X^T * B * X)',
    value: `trace(#('ia,ij,jb->ab',X, B, X))`,
    wrt: 'X',
  },
  {
    title: 'UV decomposition',
    value: `sum((A-#('ij,kj->ik',U, V))^2)`,
    wrt: 'V',
  },
  {
    title: 'Tucker decomposition',
    value: `sum((X - #('ijk,ia,jb,kc->abc', K, A, B, C))^2)`,
    wrt: 'A',
  },
  {
    title: 'Rank 1 decomposition',
    value: `||(X - #('i,j,k->ijk',u, v, w))||^2`,
    wrt: 'u',
  },
  {
    title: 'Log-sum-exp',
    value: `log(sum(exp(X)))`,
    wrt: 'X',
  },
  {
    title: 'Logdet',
    value: `log(det(X))`,
    wrt: 'X',
  },
  {
    title: 'Restricted domain',
    value: `#('ab,bc,cd,da->',X, B, X, B)`,
    wrt: 'X',
  },
  {
    title: 'Tucker decomposition',
    value: `norm(T - #(ijk,ai,bj,ck->abc; C, u, v, w))^2)`,
    wrt: 'u',
  },
  {
    title: 'Tensor regression (ring network)',
    value: `theta=#(zax,xby,ycz->abc; th0, th1, th2) 
sum((#(nabc,abc->n; X, theta)-y)^2)`,
    wrt: 'th0',
  },
] as { title: string; value: string; wrt: string }[];
