import { atomWithStorage } from "jotai/utils"
import uiSounds from "@/assets/sfx/ui-sounds.wav"
import { Howl } from "howler"
import { useAtom } from "jotai"

type Sfx = "error" | "success" | "neutral" | "click" | "delete"

const howl = new Howl({
  src: [uiSounds],
  volume: 1,
  sprite: {
    click: [0, 1000],
    delete: [1000, 430],
    error: [1430, 1000],
    neutral: [2430, 1593],
    success: [4023, 1000],
  },
})
export const useSound = () => {
  const [vol] = useVolume()
  const play = (sfx: Sfx) => {
    howl.volume(vol)
    if (sfx === "click") {
      howl.volume(vol !== 0 ? 0.05 : vol)
    }
    howl.play(sfx)
  }
  return play
}
export const volumeAtom = atomWithStorage<number>("volume", 0.5)
export const useVolume = () => useAtom(volumeAtom)
