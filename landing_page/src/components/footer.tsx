import React from 'react';
import { Link, Divider } from '@heroui/react';
import { Icon } from '@iconify/react';

export const Footer = () => {
  return (
    <footer className="bg-content1 border-t border-divider py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Link href="/" className="flex items-left text-foreground mb-4">
              <span className="font-bold text-2xl">einsum</span>
              <span className="text-primary text-2xl font-bold">.org</span>
            </Link>
            <p className="text-foreground-500 max-w-xs">
              Advancing computational research and developing innovative tools for scientific
              discovery.
            </p>
            <div className="flex gap-4 mt-6">
              {/* <Link href="https://twitter.com" isExternal aria-label="Twitter">
                <Icon
                  icon="lucide:twitter"
                  width={20}
                  className="text-foreground-400 hover:text-primary"
                />
              </Link> */}
              <Link href="https://github.com/ti2-group" isExternal aria-label="GitHub">
                <Icon
                  icon="lucide:github"
                  width={20}
                  className="text-foreground-400 hover:text-primary"
                />
              </Link>
              {/* <Link href="https://linkedin.com" isExternal aria-label="LinkedIn">
                <Icon
                  icon="lucide:linkedin"
                  width={20}
                  className="text-foreground-400 hover:text-primary"
                />
              </Link> */}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-foreground-500">
              <li className="flex items-center gap-2">
                <Icon icon="lucide:mail" width={16} />
                <Link href="mailto:contact@einsum.org" color="foreground" underline="hover">
                  contact@einsum.org
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:map-pin" width={16} />
                <span>Campus Inselplatz Jena</span>
              </li>
              <li className="flex items-center gap-2">
                <Icon icon="lucide:phone" width={16} />
                <Link href="tel:+1234567890" color="foreground" underline="hover">
                  +49 3641 9-46310
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Divider className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-foreground-400 text-sm">
            © {new Date().getFullYear()} Theoretical Computer Science II Research Group at
            University of Jena. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            {/* <Link href="/privacy" color="foreground" underline="hover">
              Privacy Policy
            </Link> */}
            <Link
              href="https://www.ti2.uni-jena.de/6/legal-notice"
              color="foreground"
              underline="hover"
            >
              Imprint / Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
