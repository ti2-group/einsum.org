import { highlightExpression } from '../../utils/highlightCode';
import classes from './HighlightedCode.module.css';

export function HighlightedCode({ expression, style }: { expression: string; style?: any }) {
  return (
    <pre
      className={classes.tenvexityCodeHighlight}
      style={style}
      dangerouslySetInnerHTML={{
        __html: highlightExpression(expression),
      }}
    />
  );
}
