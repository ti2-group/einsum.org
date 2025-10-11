import React from 'react';
import { Icon } from '@iconify/react';
import { Button, Card, CardBody, CardFooter, Divider, HeroUIProvider, Link } from '@heroui/react';
import { Hero } from './hero';
import { ServiceCard } from './service-card';
import { ResearchPaper } from './/research-paper';
import { Footer } from './footer';
import { ThemeSwitcher } from './theme-switcher';
import { services, papers } from '../data/content';

export default function App() {
  return (
    <React.StrictMode>
      <HeroUIProvider>
        {/* Services Section */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-2">Our Services</h2>
          <p className="text-foreground-500 mb-8 max-w-2xl">
            Explore our suite of research tools and platforms available on dedicated subdomains.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard
                key={service.id}
                title={service.title}
                description={service.description}
                imageUrl={service.imageUrl}
                url={service.url}
              />
            ))}
          </div>
        </section>

        <Divider className="max-w-7xl mx-auto" />

        {/* Research Papers Section */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold mb-2">Research Papers</h2>
          <p className="text-foreground-500 mb-8 max-w-2xl">
            Our latest contributions to the scientific community.
          </p>

          <div className="space-y-6">
            {papers.map(paper => (
              <ResearchPaper
                key={paper.id}
                title={paper.title}
                authors={paper.authors}
                conference={paper.conference}
                year={paper.year}
                url={paper.url}
                abstract={paper.abstract}
              />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Button
              color="primary"
              variant="flat"
              endContent={<Icon icon="lucide:external-link" className="ml-1" />}
              as="a"
              href="https://scholar.google.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              View All Publications
            </Button>
          </div>
        </section>
      </HeroUIProvider>
    </React.StrictMode>
  );
}
