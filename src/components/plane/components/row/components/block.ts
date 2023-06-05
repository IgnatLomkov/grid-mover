import { Graphics } from 'pixi.js'

import { game } from '@/game'

export const enum EPlaneBlockType {
  Common = 'common',
  Obstacle = 'obstacle'
}

export class PlaneRowBlock extends Graphics {
  constructor(readonly type: EPlaneBlockType) {
    super()

    this.beginFill(this.type === EPlaneBlockType.Common ? '#00FF00' : '#FF0000')
    this.drawRect(0, 0, 80, 80)
    this.endFill()

    this.pivot.set(this.width / 2, this.height / 2)

    if (this.type === EPlaneBlockType.Common) {
      this.eventMode = 'static'
      this.cursor = 'pointer'
      this.on('click', this.onPress.bind(this)).on(
        'tap',
        this.onPress.bind(this)
      )
    }
  }

  private onPress() {
    game.character.goTo(this)
  }
}
