import React from 'react';
import {
  Card,
  CardBody,
  Button,
  Link,
  useDisclosure,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalFooter,
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface ResearchPaperProps {
  title: string;
  authors: string[];
  conference: string;
  year: number;
  url: string;
  abstract?: string;
  bibtex?: string;
}

export const ResearchPaper = ({
  title,
  authors,
  conference,
  year,
  url,
  abstract,
  bibtex,
}: ResearchPaperProps) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [expanded, setExpanded] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const copyBibtex = async () => {
    if (!bibtex) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(bibtex);
      } else {
        // Fallback for older browsers
        const ta = document.createElement('textarea');
        ta.value = bibtex;
        // Move element off-screen
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // swallow - optionally could show UI feedback
      // console.error('Copy failed', err);
    }
  };

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
              endContent={<Icon icon="lucide:quote" width={16} />}
              onPress={onOpen}
            >
              Cite
            </Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              title="BibTeX Citation"
              size="3xl"
              scrollBehavior="inside"
            >
              <ModalContent>
                {onClose => (
                  <>
                    <ModalHeader>
                      <h2 className="text-lg font-semibold">BibTeX Citation</h2>
                    </ModalHeader>
                    <ModalBody>
                      <pre
                        className="text-xs font-mono bg-default p-4 overflow-auto cursor-pointer"
                        onClick={e => {
                          const selection = window.getSelection();
                          const range = document.createRange();
                          range.selectNodeContents(e.currentTarget);
                          selection?.removeAllRanges();
                          selection?.addRange(range);
                        }}
                      >
                        {bibtex}
                      </pre>
                      <Button
                        size="sm"
                        variant="light"
                        color="primary"
                        endContent={
                          <Icon icon={copied ? 'lucide:check' : 'lucide:copy'} width={16} />
                        }
                        onPress={copyBibtex}
                        disabled={!bibtex}
                      >
                        {copied ? 'Copied!' : 'Copy BibTeX'}
                      </Button>
                    </ModalBody>
                    <ModalFooter></ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
