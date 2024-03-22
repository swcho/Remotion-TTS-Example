import {ReactNode, createContext, memo, useMemo} from 'react';

export type StepContext = {};

const Context = createContext<StepContext>({});

export declare namespace StepContextProvider {
	export type Props = {
		children: ReactNode;
	};
}

export const StepContextProvider = memo((props: StepContextProvider.Props) => {
	const {children} = props;

	const value = useMemo<StepContext>(() => {
		return {};
	}, []);

	return <Context.Provider value={value}>{children}</Context.Provider>;
});
