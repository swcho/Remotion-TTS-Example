import * as React from 'react';
import {AbsoluteFill} from 'remotion';
import {MDXProvider} from '@mdx-js/react';
import {fromMarkdown} from 'mdast-util-from-markdown'
import {mdxJsxFromMarkdown} from 'mdast-util-mdx-jsx'
import {mdxJsx} from 'micromark-extension-mdx-jsx'
import * as acorn from "acorn"

import Content from '!!raw-loader!./steps.mdx';
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
	React.useEffect(() => {
		const tree = fromMarkdown(Content, {
			extensions: [mdxJsx({acorn, addResult: true})],
			mdastExtensions: [mdxJsxFromMarkdown()]
		})
		const result = fromMarkdown(Content)
		console.log({ result, tree })
	}, [])
	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<StepContextProvider>
				<MDXProvider components={COMPONENTS}>
					{Content}
				</MDXProvider>
			</StepContextProvider>
		</AbsoluteFill>
	);
}

export default React.memo(Talk);
