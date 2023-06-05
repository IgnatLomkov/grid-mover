import { ITrackEntry as IOriginalTrackEntry } from 'pixi-spine'

declare module 'pixi-spine' {
  //NOTE: spine types is a little wrong ;)
  export interface ITrackEntry extends IOriginalTrackEntry {
    animation: {
      name: string
    }
  }
}
