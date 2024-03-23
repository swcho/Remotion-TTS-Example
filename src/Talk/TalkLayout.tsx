import {fromMarkdown} from 'mdast-util-from-markdown';
import {
	MdxJsxAttributeValueExpression,
	MdxJsxFlowElement,
	mdxJsxFromMarkdown,
} from 'mdast-util-mdx-jsx';
import {mdxJsx} from 'micromark-extension-mdx-jsx';
import * as React from 'react';
import * as acorn from 'acorn';
import {Root} from 'mdast-util-from-markdown/lib';
import {IFrame, Video, spring, useCurrentFrame, useVideoConfig} from 'remotion';

import './talk.css';
import speaker from './speaker.webm';
import {Gradient} from './Gradient';
import Editor, { Props as EditorProps } from './Editor';
import Browser from './Browser';

// import Video from './Video';

export type Props = {
	mdx: string;
};

type RootContent = Root['children'][0];

function isJsx(child: RootContent): child is MdxJsxFlowElement {
	return child.type === 'mdxJsxFlowElement';
}

function isName(name: string) {
	return (child: MdxJsxFlowElement) => child.name === name;
}

type Primitives = string | number | boolean | object;

type PrimitivesToLiteral<T extends Primitives> = T extends string
	? 'string'
	: T extends number
	? 'number'
	: T extends boolean
	? 'boolean'
	: 'object';

type ValueAsArray<T, K extends keyof T = keyof T> = Array<T[K]>;

type ToAttrInfoList<T> = ValueAsArray<{
	[K in keyof T]: T[K] extends Primitives
		? {
				name: K;
				type: PrimitivesToLiteral<T[K]>;
		  }
		: never;
}>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isValue(value: any): value is MdxJsxAttributeValueExpression {
	return value.type === 'mdxJsxAttributeValueExpression';
}

function makeAttrFinder<T>(attrs: ToAttrInfoList<T>) {
	return (child?: MdxJsxFlowElement) => {
		if (child) {
			const {attributes} = child;
			return attrs.reduce(
				(ret, {name, type}) => {
					const attribute = attributes.find(
						(a) => a.type === 'mdxJsxAttribute' && a.name === name
					);
					if (attribute) {
						const jsxValue =
							attribute.type === 'mdxJsxAttribute' && attribute.value;
						if (typeof jsxValue === 'string') {
							ret[name] = jsxValue;
						} else if (isValue(jsxValue)) {
							const {value} = jsxValue;
							ret[name] =
								type === 'number'
									? parseInt(value, 10)
									: type === 'boolean'
									? value === 'true'
									: type === 'object'
									? JSON.parse(value)
									: value;
						}
					}
					return ret;
				},
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				{_: attributes} as any
			) as T;
		}
	};
}

type VideoProps = {
	src: string;
	start: number;
	end: number;
};

const getVideoProps = makeAttrFinder<VideoProps>([
	{name: 'src', type: 'string'},
	{name: 'start', type: 'number'},
	{name: 'end', type: 'number'},
]);

type BrowserProps = {
	url: string;
	loadUrl: string;
	zoom: number;
};

const getBrowserProps = makeAttrFinder<BrowserProps>([
	{
		name: 'url',
		type: 'string',
	},
	{
		name: 'loadUrl',
		type: 'string',
	},
	{
		name: 'zoom',
		type: 'number',
	},
]);

const getEditorProps = makeAttrFinder<EditorProps>([
	{name: 'code', type: 'string'},
	{name: 'focus', type: 'string'},
	{name: 'lang', type: 'string'},
	{name: 'tab', type: 'string'},
	{name: 'tabs', type: 'object'},
]);

function TalkLayout(props: Props) {
	const {mdx} = props;

	const steps = React.useMemo(() => {
		const tree = fromMarkdown(mdx, {
			extensions: [mdxJsx({acorn, addResult: true})],
			mdastExtensions: [mdxJsxFromMarkdown()],
		});
		const splits: RootContent[][] = [[]];

		console.log({tree});
		tree.children.forEach((child) => {
			if (child.type === 'thematicBreak') {
				splits.unshift([]);
			} else {
				splits[0].push(child);
			}
		});
		splits.reverse();
		return splits.map((children) => {
			const jsx = children.filter(isJsx);
			const Video = jsx.find(isName('Video'));
			const Browser = jsx.find(isName('Browser'));
			const Editor = jsx.find(isName('Editor'));
			const code = children.find(({type}) => type === 'code');
			return {
				Video: getVideoProps(Video),
				Browser: getBrowserProps(Browser),
				Editor: getEditorProps(Editor),
				code,
			};
		});
	}, [mdx]);

	const frame = useCurrentFrame();
	const {fps} = useVideoConfig();
	const seconds = frame / fps;
	const stepIdxCurrent = steps.findIndex(({Video}) => {
		if (Video) {
			const {start, end} = Video;
			return start <= seconds && seconds <= end;
		}
		return false;
	});
	const stepCurrent = steps[stepIdxCurrent];
	
	if (!stepCurrent) {
		return <>
		{stepIdxCurrent} not found in {seconds}
		</>

	}
	
	const currentStepFirstFrame = (stepCurrent.Video?.start || 0) * fps;

	const stepIdxPrev = Math.max(0, stepIdxCurrent);
	const progress = spring({
		frame: frame - currentStepFirstFrame,
		from: stepIdxPrev,
		to: stepIdxCurrent,
		fps,
		config: {
			stiffness: 70,
			damping: 200,
			mass: 1,
		},
	});

	const demoUrl =
		'https://nextjsconf2020.pomb.us' + (stepCurrent.Browser?.loadUrl || '');

	console.log('TalkLayout', {steps, stepIdxCurrent, progress});
	return (
		<Center>
			<main className="grid">
				<div className="slot-1">
					{stepCurrent.Editor && (
						<Editor  {...stepCurrent.Editor} />
					)}
				</div>
				<div className="slot-2">
					<Browser>
						<IFrame style={{ width: '100%', height: '100%'}} src={demoUrl} />
					</Browser>
				</div>
				<Gradient className="slot-3">
					<SpeakerPanel caption={''} />
				</Gradient>
			</main>
		</Center>
	);
}

function SpeakerPanel({caption}: {caption: string}) {
	return (
		<div className="speaker-panel">
			<div className="video-container">
				<div className="h-full">
					<div className="video-wrapper">
						<Video src={speaker} />
					</div>
				</div>
			</div>
			<div className="captions-container">
				<div className="captions">{caption}</div>
			</div>
		</div>
	);
}

function Center({children}: {children: React.ReactNode}) {
	return (
		<div className="talk-container">
			<div className="talk-scale">{children}</div>
		</div>
	);
}

export default React.memo(TalkLayout);
