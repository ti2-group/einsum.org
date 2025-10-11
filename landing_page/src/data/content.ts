// Sample services data
export const services = [
  {
    id: 1,
    title: 'Einsum Benchmark',
    description: 'Enabling the Development of Next-Generation Tensor Execution Engines.',
    imageUrl: 'https://benchmark.einsum.org/_astro/large_contractions.BD9AaBBe_ZfPWjw.webp',
    url: 'https://benchmark.einsum.org',
  },
  {
    id: 2,
    title: 'Tenvexity',
    description: 'Convexity certificates for einsum expressions',
    imageUrl: 'https://tenvexity.einsum.org/_astro/favicon.bbFTkENz.svg',
    url: 'https://tenvexity.einsum.org',
  },
  {
    id: 3,
    title: 'SQL Einsum',
    description: 'Turn Einsum Expressions into ANSI SQL.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Sql_data_base_with_logo.png/512px-Sql_data_base_with_logo.png?20210130181641',
    url: 'https://sql-einsum.ti2.uni-jena.de/',
  },
  {
    id: 4,
    title: 'Fast contraction paths',
    description: 'Speed up evaluation of large einsum contractions with better contraction paths.',
    imageUrl:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lightning_strike_icon.svg/512px-Lightning_strike_icon.svg.png?20240229051510',
    url: 'https://github.com/ti2-group/hybrid_contraction_tree_optimizer',
  },
];

// Sample research papers data
export const papers = [
  {
    id: 1,
    title: 'Convexity Certificates for Symbolic Tensor Expressions',
    authors: [
      'Paul Gerhardt Rump',
      'Niklas Merk',
      'Julien Klaus',
      'Maurice Wenig',
      'Joachim Giesen',
    ],
    conference: 'International Joint Conferences on Artificial Intelligence (IJCAI)',
    year: 2024,
    url: 'https://www.ijcai.org/proceedings/2024/216',
    abstract: `
      Knowing that a function is convex ensures that any
      local minimum is also a global minimum. Here,
      we implement an approach to certify the convexity
      of twice-differentiable functions by certifying that
      their second-order derivative is positive semidefinite. Both the computation of the second-order
      derivative and the certification of positive semidefiniteness are done symbolically. Previous implementations of this approach assume that the function to be minimized takes scalar or vector input,
      meaning that the second-order derivative is at most
      a matrix. However, the input of many machine
      learning problems is naturally given in the form
      of matrices or higher order tensors, in which case
      the second-order derivative becomes a tensor of at
      least fourth order. The familiar linear algebra notations and known rules for determining whether
      a matrix is positive semidefinite are not sufficient
      to deal with these higher order expressions. Here,
      we present a formal language for tensor expressions that allows us to generalize semidefiniteness
      to higher-order tensors and thereby certify the convexity of a broader class of functions.
    `,
  },
];
