import { Button, Tooltip } from '@heroui/react';
import React from 'react';
import type { VarConf } from './ConvexityForm';

const VarConfTags: React.FC<{
  varConf: VarConf;
  variableKey: number;
  isDisabled: boolean;
  updateVariable: (key: number, newValue: VarConf) => void;
}> = ({ varConf, updateVariable, variableKey, isDisabled }) => {
  const activeTags = [...varConf.tags, ...varConf.inferredTags];

  // Toggle tag callback
  const toggleTag = React.useCallback(
    (tag: string) => {
      updateVariable(variableKey, {
        ...varConf,
        tags: varConf.tags.includes(tag)
          ? varConf.tags.filter(t => t !== tag)
          : [...varConf.tags, tag],
      });
    },
    [updateVariable, variableKey, varConf],
  );
  return (
    <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
      {/* <LoadingOverlay
                            visible={loadingState?.includes(varConf.name)}
                            loaderProps={{ size: "xs" }}
                          /> */}

      <Tooltip content="Diagonal" closeDelay={100} offset={2}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('DIA')}
          isDisabled={varConf.inferredTags.includes('DIA') || isDisabled}
          color={activeTags.includes('DIA') ? 'success' : 'default'}
          variant={activeTags.includes('DIA') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('DIA')}
        >
          DIA
        </Button>
      </Tooltip>
      <Tooltip content="Symmetric" closeDelay={100}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('SYM')}
          isDisabled={varConf.inferredTags.includes('SYM') || isDisabled}
          color={activeTags.includes('SYM') ? 'success' : 'default'}
          variant={activeTags.includes('SYM') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('SYM')}
        >
          SYM
        </Button>
      </Tooltip>

      <Tooltip content="Positive definite" closeDelay={100}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('PD')}
          isDisabled={varConf.inferredTags.includes('PD') || isDisabled}
          color={activeTags.includes('PD') ? 'success' : 'default'}
          variant={activeTags.includes('PD') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('PD')}
        >
          PD
        </Button>
      </Tooltip>

      <Tooltip content="Positive semi-definite" closeDelay={100}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('PSD')}
          isDisabled={varConf.inferredTags.includes('PSD') || isDisabled}
          color={activeTags.includes('PSD') ? 'success' : 'default'}
          variant={activeTags.includes('PSD') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('PSD')}
        >
          PSD
        </Button>
      </Tooltip>

      <Tooltip content="Negative definite" closeDelay={100}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('ND')}
          isDisabled={varConf.inferredTags.includes('ND') || isDisabled}
          color={activeTags.includes('ND') ? 'success' : 'default'}
          variant={activeTags.includes('ND') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('ND')}
        >
          ND
        </Button>
      </Tooltip>

      <Tooltip content="Negative semi-definite" closeDelay={100}>
        <Button
          size="sm"
          aria-pressed={activeTags.includes('NSD')}
          isDisabled={varConf.inferredTags.includes('NSD') || isDisabled}
          color={activeTags.includes('NSD') ? 'success' : 'default'}
          variant={activeTags.includes('NSD') ? 'solid' : 'ghost'}
          onPress={() => toggleTag('NSD')}
        >
          NSD
        </Button>
      </Tooltip>
    </div>
  );
};

export default VarConfTags;
