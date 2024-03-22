import * as React from 'react';
import {AbsoluteFill} from 'remotion';
import {MDXProvider} from '@mdx-js/react';

import Content from './steps.mdx';
import Wrapper from './Wrapper';
import {StepContextProvider} from './StepContext';

const COMPONENTS: React.ComponentProps<typeof MDXProvider>['components'] = {
	wrapper: Wrapper,
	hr: (props) => {
		console.log('hr', props)
		return (
			<hr />
		)
	}
};

function Talk() {
	console.log('Talk');
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<StepContextProvider>
				<MDXProvider components={COMPONENTS}>
					<Content components={COMPONENTS} />
				</MDXProvider>
			</StepContextProvider>
		</AbsoluteFill>
	);
}

export default React.memo(Talk);
