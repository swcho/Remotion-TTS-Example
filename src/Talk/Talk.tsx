import * as React from 'react';
import {AbsoluteFill} from 'remotion';

import mdxSteps from '!!raw-loader!./steps.mdx';
import TalkLayout from './TalkLayout';

export function notEmpty<TValue>(
  value: TValue | null | undefined | '',
): value is TValue {
  return value !== null && value !== undefined && value !== '';
}

function Talk() {
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<TalkLayout mdx={mdxSteps} />
		</AbsoluteFill>
	);
}

export default React.memo(Talk);
