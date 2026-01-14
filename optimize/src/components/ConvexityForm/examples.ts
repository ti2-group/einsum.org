export const examples = [
  {
    title: 'Minimal example',
    value: "#('i->', x)",
  },
  {
    title: 'Diagonal broadcast',
    value: `#('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)

        #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)
        #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)


        #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)
        #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)
        #('ij,j->ij', X, v)
    #('ij,j->ij', X, v)
    
    #('ij,j->ij', X, v)#('ij,j->ij', X, v)#('ij,j->ij', X, v)

    #('ij,j->ij', X, v)
    `,
  },
] as { title: string; value: string }[];
