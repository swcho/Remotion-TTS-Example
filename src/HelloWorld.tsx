import * as React from 'react'

import {Audio, Sequence} from 'remotion';
import {
	AbsoluteFill,
	interpolate,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {z} from 'zod';
import {compSchema} from './types';
import {Title} from './HelloWorld/Title';
import {createS3Url} from './tts';
import { getVoices, speak } from './speech';

async function speakSomething() {
		const voices = await getVoices();
		console.log(voices)
		await speak('시간이 얼마나 걸리는지 테스트 해 봅니다.')

}

export const HelloWorld: React.FC<z.infer<typeof compSchema>> = ({
	text,
	titleColor,
	voice,
	displaySpeed,
}) => {
	const frame = useCurrentFrame();
	const videoConfig = useVideoConfig();

	const opacity = interpolate(
		frame,
		[videoConfig.durationInFrames - 25, videoConfig.durationInFrames - 15],
		[1, 0],
		{
			extrapolateLeft: 'clamp',
			extrapolateRight: 'clamp',
		}
	);
	
	React.useEffect(() => {
		speakSomething()
	}, [])

	return (
		<AbsoluteFill style={{backgroundColor: 'white'}}>
			<AbsoluteFill style={{opacity}}>
				{/* <Sequence>
					<SpeechSyn text="직접 " />
				</Sequence> */}
				<Sequence>
					<Title
						displaySpeed={displaySpeed}
						text={text}
						titleColor={titleColor}
					/>
					<Audio src={createS3Url({text, voice})} />
				</Sequence>
			</AbsoluteFill>
		</AbsoluteFill>
	);
};
