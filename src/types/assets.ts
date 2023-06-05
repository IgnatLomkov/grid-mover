import { ISkeletonData } from '@pixi-spine/base'
import { TextureAtlas } from 'pixi-spine'

export interface ISpineAsset {
  spineData: ISkeletonData
  spineAtlas: TextureAtlas
}
