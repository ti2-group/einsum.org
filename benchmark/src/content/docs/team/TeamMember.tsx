import React from 'react';
import { Card, Link, CardBody, CardFooter, CardHeader, Image } from '@nextui-org/react';

interface Props {
  name: string;
  role: string;
  image: string;
  profileLink: string;
}

const TeamMember: React.FC<Props> = ({ name, role, image, profileLink, children }) => {
  return (
    <Card className="">
      <div className="">{children}</div>
      <div className="p-4 pt-2">
        <h3 className="mt-0">{name}</h3>
        <p>{role}</p>
        <Link href={profileLink} isExternal showAnchorIcon className="mt-4">
          Publications
        </Link>
      </div>
    </Card>
  );
};

export default TeamMember;
