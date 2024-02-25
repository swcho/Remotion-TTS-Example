import {Composition} from 'remotion';
import {compSchema} from './types';
import {HelloWorld} from './HelloWorld';
import {getAudioDurationInSeconds} from '@remotion/media-utils';
import {audioAlreadyExists, createS3Url, synthesizeSpeech} from './tts';
import {waitForNoInput} from './debounce';

// text: 'Working with TTS (Azure + AWS S3)',
const TARGET_TEXT = '안녕하세요. TTS 예제 입니다.';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="HelloWorld"
				component={HelloWorld}
				durationInFrames={150}
				fps={30}
				width={1920}
				height={1080}
				defaultProps={{
					text: TARGET_TEXT,
					titleColor: 'black',
					voice: 'ko-KR-SunHiNeural',
					displaySpeed: 10,
				}}
				calculateMetadata={async ({props, abortSignal}) => {
					await waitForNoInput(abortSignal, 1000);
					const exists = await audioAlreadyExists({
						text: props.text,
						voice: props.voice,
					});
					if (!exists) {
						await synthesizeSpeech(props.text, props.voice);
					}

					const fileName = createS3Url({
						text: props.text,
						voice: props.voice,
					});

					const duration = await getAudioDurationInSeconds(fileName);
					
					console.log(RemotionRoot.name, {fileName, duration})

					return {props, durationInFrames: Math.ceil(duration * 30)};
				}}
				schema={compSchema}
			/>
		</>
	);
};
