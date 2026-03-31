import type { FormState } from "./ConvexityForm";

export const examples = [
  {
    title: "Minimal example",
    values: {
      expression: "X",
      wrt: "X",
    },
  },
  {
    title: "Diagonal broadcast",
    values: {
      expression: "#(',,i->ii', s, s, d)",
      wrt: "s",
    },
  },
  {
    title: "Least squares regression",
    values: {
      expression: "sum((#('ij,i->j',\n X, w)-y)^2)",
      wrt: "w",
    },
  },
  {
    title: "Logtrace",
    values: {
      expression: "log(trace(X))",
      wrt: "X",
    },
  },
  {
    title: "Exptrace",
    values: {
      expression: "exp(trace(X))",
      wrt: "X",
    },
  },
  {
    title: "tr(X^T * B * X)",
    values: {
      expression: "trace(#('ia,ij,jb->ab',\n X, B, X))",
      wrt: "X",
    },
  },
  {
    title: "UV decomposition",
    values: {
      expression: "sum((A-#('ij,kj->ik',\n U, V))^2)",
      wrt: "V",
    },
  },
  {
    title: "Tucker decomposition",
    values: {
      expression: "sum((X - #('ijk,ia,jb,kc\n->abc', K, A, B, C))^2)",
      wrt: "A",
    },
  },
  {
    title: "Rank 1 decomposition",
    values: {
      expression: "||(X - #('i,j,k->ijk',\n u, v, w))||^2",
      wrt: "u",
    },
  },
  {
    title: "Log-sum-exp",
    values: {
      expression: "log(sum(exp(X)))",
      wrt: "X",
    },
  },
  {
    title: "Logdet",
    values: {
      expression: "log(det(X))",
      wrt: "X",
    },
  },
  {
    title: "Restricted domain",
    values: {
      expression: "#('ab,bc,cd,da->',\n X, B, X, B)",
      wrt: "X",
    },
  },
  {
    title: "Tucker decomposition",
    values: {
      expression: "norm(T - #(ijk,ai,bj,ck->abc; C, u, v, w))^2)",
      wrt: "u",
    },
  },
  {
    title: "Tensor regression (ring network)",
    values: {
      expression: "theta=#(zax,xby,ycz->abc; th0, th1, th2) \n sum((#(nabc,abc->n; X, theta)-y)^2)",
      wrt: "th0",
    },
  },
] as { title: string; values: FormState }[];
