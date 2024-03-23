import * as React from 'react';

export type Props = {
	children: React.ReactNode;
};

function Browser(props: Props) {
	const {children} = props;

	return <div style={{ height: '100%', backgroundColor: 'white'}}>{children}</div>;
}

export default React.memo(Browser);
