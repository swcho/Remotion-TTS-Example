import * as React from 'react';

export type Props = {
}

function Action(props: Props) {
	const {
	} = props;

	return (
		<div>
			Action
		</div>
	);
}

export default React.memo(Action)
