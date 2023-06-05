import { Container } from 'pixi.js'

import { SUM_OF_ADJACENT_ANGLES_IN_DEGREE } from '@/data/math'
import { EGameSize } from '@/game'
import { degreeToRadian } from '@/utils/math'

import { PlaneRow, planeRowGenerationDataType } from './components/row'
import { EPlaneBlockType } from './components/row/components/block'

export class Plane extends Container {
  set disabled(value: boolean) {
    this.eventMode = value ? 'none' : 'auto'
  }

  constructor() {
    super()

    const blockSpacing = 5
    const planeGenerationData: readonly planeRowGenerationDataType[] = <const>[
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Obstacle,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ],
      [
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common,
        EPlaneBlockType.Common
      ]
    ]
    planeGenerationData.forEach((rowGenerationData, index, arr) => {
      const row = new PlaneRow(rowGenerationData, blockSpacing)
      //NOTE: revertion for visutal data editing with skew factor
      row.position.y = (arr.length - index - 1) * (row.height + blockSpacing)

      this.addChild(row)
    })

    this.pivot.set(this.width / 2, this.height / 2)
    this.position.set(EGameSize.Width / 2, EGameSize.Height / 2)

    //NOTE: I got it from the reference, but actually I should get it from an artist
    const isometricAngleInDegree = 30
    this.rotation = degreeToRadian(isometricAngleInDegree)
    this.skew.x = degreeToRadian(
      SUM_OF_ADJACENT_ANGLES_IN_DEGREE - isometricAngleInDegree
    )
  }
}
