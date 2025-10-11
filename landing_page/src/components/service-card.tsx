import React from 'react';
import { Card, CardBody, CardFooter, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ServiceCardProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export const ServiceCard = ({ title, description, imageUrl, url }: ServiceCardProps) => {
  return (
    <Card
      isPressable
      isHoverable
      as="a"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
    >
      <CardBody className="p-0">
        <img src={imageUrl} alt={title} className="w-full h-48 object-contain p-5" />
      </CardBody>
      <CardFooter className="flex flex-col items-start text-left p-5">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-foreground-500 text-sm mb-4">{description}</p>
        <Link
          color="primary"
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 mt-auto"
          underline="hover"
        >
          Visit Service <Icon icon="lucide:external-link" className="ml-1" width={16} />
        </Link>
      </CardFooter>
    </Card>
  );
};
