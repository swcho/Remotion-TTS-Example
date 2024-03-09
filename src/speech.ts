
let VOICES: SpeechSynthesisVoice[] = []
const LANG = 'ko-KR'

function updateVoices() {
	VOICES = speechSynthesis.getVoices().filter(({ lang }) => lang === LANG)
}

updateVoices()

window.speechSynthesis.onvoiceschanged = function() {
	console.log('onvoiceschanged')
	updateVoices()
}

export async function getVoices() {
	console.log('getVoices')
	return new Promise<SpeechSynthesisVoice[]>((resolve) => {
		if (VOICES.length) {
			resolve(VOICES)
		}
	})
}

const utterance = new SpeechSynthesisUtterance()

export async function speak(text: string) {
	utterance.voice = VOICES[0]
	utterance.lang = LANG
	utterance.pitch = 1
	utterance.rate = 1
	return new Promise<void>((resolve) => {
		utterance.text = text
		console.log('speak', LANG, text)
		window.speechSynthesis.speak(utterance)
		utterance.onstart = () => {
			console.log('onstart')
		}
		utterance.onend = () => {
			console.log('onend')
			resolve()
		}
		utterance.onerror = () => {
			console.log('onerror')
		}
	})

}
