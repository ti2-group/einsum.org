export const examples = [
  {
    title: 'Tucker decomposition',
    value: `norm(T - #(ijk,ai,bj,ck->abc; C, u, v, w))^2`,
    wrt: 'C',
  },
] as { title: string; value: string; wrt: string }[];
