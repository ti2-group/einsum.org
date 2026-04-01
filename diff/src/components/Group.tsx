import React, { type ReactNode } from "react";

interface GroupProps {
  children: ReactNode;
}

const Group: React.FC<GroupProps & { className?: string }> = ({
  children,
  className,
}) => {
  return (
    <div className={`flex place-content-center ${className}`}>{children}</div>
  );
};

export default Group;
