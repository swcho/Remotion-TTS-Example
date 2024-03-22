import * as React from 'react';
import { getStepsFromMDX } from './step-parser';

export type Props = {
	children: React.ReactNode;
}

// [MDX](https://v1.mdxjs.com/guides/wrapper-customization/)

function Wrapper(props: Props) {
	const {
		children,
	} = props;
	React.useMemo(() => getStepsFromMDX(children), [children])
	return (
		<>
			{children}
		</>
	);
}

export default React.memo(Wrapper)
