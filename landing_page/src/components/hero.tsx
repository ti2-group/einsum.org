import React from 'react';
import { Button } from '@heroui/react';
import { Icon } from '@iconify/react';

export const Hero = () => {
  return (
    <section className="py-6 md:py-10 px-4 md:px-8 bg-gradient-to-br from-background to-content2">
      <div className="max-w-5xl mx-auto">
        <div className="space-y-3 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            <span className="text-primary">Einsum</span>: The tensor expression language
          </h1>
          <p className="text-foreground-500 text-sm md:text-base max-w-2xl mx-auto">
            Einsum has become the quasi-standard for tensor expressions. It is widely used in
            machine learning and quantum computing. We work on einsum as a compute backend for
            optimization, learning, and inference, providing efficient execution libraries.
          </p>

          <div className="flex flex-wrap gap-3 pt-2 justify-center">
            <Button
              color="primary"
              size="lg"
              as="a"
              className="no-underline"
              href="mailto:contact@einsum.org"
              endContent={<Icon icon="lucide:mail" />}
            >
              Get in Touch
            </Button>

            <Button
              variant="bordered"
              color="primary"
              size="lg"
              as="a"
              href="https://github.com/ti2-group"
              target="_blank"
              rel="noopener noreferrer"
              endContent={<Icon icon="lucide:github" />}
              className="no-underline"
            >
              GitHub
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
