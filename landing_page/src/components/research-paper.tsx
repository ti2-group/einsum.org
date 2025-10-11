import React from 'react';
import { Card, CardBody, Button, Link } from '@heroui/react';
import { Icon } from '@iconify/react';

interface ResearchPaperProps {
  title: string;
  authors: string[];
  conference: string;
  year: number;
  url: string;
  abstract?: string;
}

export const ResearchPaper = ({
  title,
  authors,
  conference,
  year,
  url,
  abstract,
}: ResearchPaperProps) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className="w-full">
      <CardBody className="p-5">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              color="foreground"
              underline="hover"
            >
              {title}
            </Link>
          </h3>

          <p className="text-foreground-500">{authors.join(', ')}</p>

          <div className="flex items-center gap-2 text-sm text-foreground-400">
            <span>{conference}</span>
            <span>•</span>
            <span>{year}</span>
          </div>

          {abstract && (
            <div className="mt-3">
              <Button
                variant="light"
                color="primary"
                size="sm"
                onPress={() => setExpanded(!expanded)}
                endContent={
                  <Icon icon={expanded ? 'lucide:chevron-up' : 'lucide:chevron-down'} width={16} />
                }
              >
                {expanded ? 'Hide Abstract' : 'Show Abstract'}
              </Button>

              {expanded && (
                <p className="mt-3 text-foreground-600 text-sm leading-relaxed">{abstract}</p>
              )}
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <Button
              size="sm"
              variant="flat"
              color="primary"
              as="a"
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              endContent={<Icon icon="lucide:external-link" width={16} />}
            >
              View Paper
            </Button>

            <Button
              size="sm"
              variant="light"
              as="a"
              href={`https://scholar.google.com/scholar?q=${encodeURIComponent(title)}`}
              target="_blank"
              rel="noopener noreferrer"
              endContent={<Icon icon="lucide:quote" width={16} />}
            >
              Cite
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
