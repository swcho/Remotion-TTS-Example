import * as React from 'react';

export type Props = {
	code: string;
	focus: string;
	lang: string;
	tab: string;
	tabs: string[];
};

function Editor(props: Props) {
	const {code} = props;

	const [mdx, setMdx] = React.useState('');
	React.useEffect(() => {
		import(`!!raw-loader!./demo/${code}`).then((module) => {
			setMdx(module.default);
		});
	}, [code]);

	console.log('Editor', props, mdx);
	return (
		<div style={{ backgroundColor: 'white' }}>
			<pre>
				<code>{mdx}</code>
			</pre>
		</div>
	);
}

export default React.memo(Editor);
