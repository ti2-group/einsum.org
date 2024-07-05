import { Badge, Group, Title } from '@mantine/core';
import classes from './Hero.module.css';

export function Hero() {
  return (
    <Group justify="center" className={classes.title} gap="sm" mb="2rem">
      <Title ta="center">Is it &nbsp;</Title>
      <Badge className={classes.convexBadge} size="xl" color="teal">
        Convex
      </Badge>
      {/* <Badge
        visibleFrom="sm"
        size="xl"
        color="teal"
        pt={4}
        style={{ height: '177.84px', fontSize: '34px' }}
      >
        Convex
      </Badge> */}
      <Title ta="center">&nbsp;?</Title>
    </Group>
  );
}
