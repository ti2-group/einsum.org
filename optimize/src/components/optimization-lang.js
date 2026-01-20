/**
 * Language: Optimization Language
 * Description: A custom optimization language for tensor operations
 * Author: einsum.org
 */

export default function (hljs) {
  // Regex for tensor variable names (letters followed by optional digits)
  const VARIABLE_NAME = /[a-zA-Z][a-zA-Z0-9_]*/;

  // Regex for einsum format strings (single letters)
  const EINSUM_FORMAT = /[a-zA-Z]+/;

  // Built-in functions
  const FUNCTIONS = {
    scope: 'built_in',
    match: /\b(log|exp|sum|delta|norm|tr)\b/,
  };

  // Numbers (integers and floats)
  const NUMBER = {
    scope: 'number',
    match: /\b\d+(\.\d+)?\b/,
    relevance: 0,
  };

  // Operators
  const OPERATORS = {
    scope: 'operator',
    match: /(\+|-|\*|\/|\^|==|<=|>=|<|>|\|\|)/,
    relevance: 0,
  };

  // Einsum expression: #(format_string;input1,input2,...inputn)
  const EINSUM_EXPR = {
    begin: /#\(/,
    end: /\)/,
    contains: [
      {
        // Format string (einsum notation like "ijk,ai,bj,ck->abc")
        scope: 'string',
        begin: /(?<=#\()/,
        end: /(?=;)/,
        relevance: 5,
      },
      {
        // Semicolon separator
        scope: 'punctuation',
        match: /;/,
      },
      {
        // Variable names after semicolon
        scope: 'variable',
        match: VARIABLE_NAME,
      },
      {
        // Commas between variables
        scope: 'punctuation',
        match: /,/,
      },
      'self', // Allow nested einsum expressions
    ],
    relevance: 10,
  };

  // Parameter/variable declarations (name followed by optional dimension)
  const DECLARATION = {
    scope: 'variable',
    match: /[a-zA-Z][a-zA-Z0-9_]*/,
    relevance: 0,
  };

  return {
    name: 'Optimization Language',
    aliases: ['optlang', 'optimization'],
    case_insensitive: false,
    keywords: {
      keyword: ['parameters', 'variables', 'cse', 'min', 'max', 'st'],
    },
    contains: [
      // Line comments
      hljs.COMMENT('//', '$', {
        relevance: 0,
      }),

      // Section keywords at the start of a line
      {
        scope: 'keyword',
        match: /^(parameters|variables|cse|min|max|st)\b/,
        relevance: 10,
      },

      // Einsum expressions
      EINSUM_EXPR,

      // Functions
      FUNCTIONS,

      // Numbers
      NUMBER,

      // Comparison operators
      {
        scope: 'operator',
        match: /(==|<=|>=|<|>)/,
        relevance: 5,
      },

      // Arithmetic operators
      {
        scope: 'operator',
        match: /[\+\-\*\/\^]/,
        relevance: 0,
      },

      // Assignment operator
      {
        scope: 'operator',
        match: /=/,
        relevance: 5,
      },

      // Variable names
      {
        scope: 'variable',
        match: VARIABLE_NAME,
        relevance: 0,
      },

      // Parentheses and brackets
      {
        scope: 'punctuation',
        match: /[\(\)\[\]\{\}]/,
        relevance: 0,
      },

      // Commas
      {
        scope: 'punctuation',
        match: /,/,
        relevance: 0,
      },
    ],
  };
}
