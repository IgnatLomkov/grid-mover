import { Container } from 'pixi.js'

import { EPlaneBlockType, PlaneRowBlock } from './components/block'

export class PlaneRow extends Container {
  constructor(generationData: planeRowGenerationDataType, spacing: number) {
    super()

    generationData.forEach((generationDataItem, index) => {
      const block = new PlaneRowBlock(generationDataItem)
      block.position.x = index * (block.width + spacing)

      this.addChild(block)
    })
  }
}

export type planeRowGenerationDataType = readonly EPlaneBlockType[]
