import gsap from 'gsap'
import { Assets } from 'pixi.js'
import { IAnimationStateListener, Spine } from 'pixi-spine'

import { EGameAsset, game, IGameAssetToTypeMap } from '@/game'

import { PlaneRow } from '../plane/components/row'
import { PlaneRowBlock } from '../plane/components/row/components/block'
import { getCharacterPath } from './utils'

const enum EAnimationAxisY {
  Up = 'up',
  Down = 'down'
}

const enum EAnimationAxisX {
  Left = 'L',
  Right = 'R'
}

//NOTE: it is unpossible to implement "Balance_..._..." animation because there are only two animations
export class Character extends Spine {
  private readonly mainTrackIndex = 0
  private readonly animationList = <const>{
    idle: (xOxis: EAnimationAxisX | null, yOxis: EAnimationAxisY | null) => {
      let animationName = 'Idle'
      if (yOxis !== null) {
        animationName += `_${yOxis}`
      }
      if (xOxis !== null) {
        animationName += `_${xOxis}`
      }

      return animationName
    },
    theSamePath: 'Idle_down_tap',
    path: (xOxis: EAnimationAxisX | null, yOxis: EAnimationAxisY | null) => {
      let animationName = 'Walk'
      if (yOxis !== null) {
        animationName += `_${yOxis}`
      }
      if (xOxis !== null) {
        animationName += `_${xOxis}`
      }

      return animationName
    }
  }
  private currentPlaneRowBlock: PlaneRowBlock

  constructor() {
    super(
      Assets.get<IGameAssetToTypeMap[EGameAsset.Character]>(
        EGameAsset.Character
      ).spineData
    )

    this.currentPlaneRowBlock = <PlaneRowBlock>(
      (<PlaneRow>game.plane.getChildAt(4)).getChildAt(4)
    )
    this.currentPlaneRowBlock.getGlobalPosition().copyTo(this.position)
    this.setBaseIdleAnimation()
  }

  private setBaseIdleAnimation() {
    this.state.setAnimation(
      this.mainTrackIndex,
      this.animationList.idle(null, EAnimationAxisY.Down),
      true
    )
  }

  private showTheSamePathAnimation() {
    this.state.setAnimation(
      this.mainTrackIndex,
      this.animationList.theSamePath,
      false
    )

    const listener: IAnimationStateListener = {
      complete: () => {
        this.state.removeListener(listener)
        this.setBaseIdleAnimation()
      }
    }
    this.state.addListener(listener)
  }

  private goByPath(path: PlaneRowBlock[]) {
    const currentPlaneRowBlockPosition =
      this.currentPlaneRowBlock.getGlobalPosition()
    //eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const targetPlaneRowBlock = path.shift()!
    const targetPlaneRowBlockPosition = targetPlaneRowBlock.getGlobalPosition()
    //NOTE: Math.round because of pixi.js issue
    const xAnimationAxis =
      Math.round(currentPlaneRowBlockPosition.x) ===
      Math.round(targetPlaneRowBlockPosition.x)
        ? null
        : currentPlaneRowBlockPosition.x > targetPlaneRowBlockPosition.x
        ? EAnimationAxisX.Left
        : EAnimationAxisX.Right
    const yAnimationAxis =
      Math.round(currentPlaneRowBlockPosition.y) ===
      Math.round(targetPlaneRowBlockPosition.y)
        ? null
        : currentPlaneRowBlockPosition.y > targetPlaneRowBlockPosition.y
        ? EAnimationAxisY.Up
        : EAnimationAxisY.Down

    if (
      this.state.tracks.find(track => track.trackIndex === this.mainTrackIndex)
        ?.animation.name !==
      this.animationList.path(xAnimationAxis, yAnimationAxis)
    ) {
      this.state.setAnimation(
        this.mainTrackIndex,
        this.animationList.path(xAnimationAxis, yAnimationAxis),
        true
      )
    }

    const movingAnimationDuration = 1
    gsap
      .to(this.position, {
        x: targetPlaneRowBlockPosition.x,
        y: targetPlaneRowBlockPosition.y,
        //NOTE: because of isometric in the Plane
        duration:
          xAnimationAxis && yAnimationAxis
            ? movingAnimationDuration
            : Math.hypot(movingAnimationDuration, movingAnimationDuration),
        ease: 'none'
      })
      .then(() => {
        this.currentPlaneRowBlock = targetPlaneRowBlock
        if (path.length === 0) {
          game.plane.disabled = false

          this.state.setAnimation(
            this.mainTrackIndex,
            this.animationList.idle(xAnimationAxis, yAnimationAxis),
            true
          )
        } else {
          this.goByPath(path)
        }
      })
  }

  private getPlaneRowBlockCoordinates(
    planeRowBlock: PlaneRowBlock
  ): IPlaneRowBlockCoordinates {
    const planeRow = <PlaneRow>planeRowBlock.parent

    return {
      row: game.plane.getChildIndex(planeRow),
      column: planeRow.getChildIndex(planeRowBlock)
    }
  }

  goTo(targetPlaneRowBlock: PlaneRowBlock) {
    if (this.currentPlaneRowBlock === targetPlaneRowBlock) {
      this.showTheSamePathAnimation()
      return
    }

    game.plane.disabled = true
    this.goByPath(
      getCharacterPath(
        game.plane.children.map(
          child => <PlaneRowBlock[]>(<PlaneRow>child).children
        ),
        this.getPlaneRowBlockCoordinates(this.currentPlaneRowBlock),
        this.getPlaneRowBlockCoordinates(targetPlaneRowBlock)
      )
    )
  }
}

export interface IPlaneRowBlockCoordinates {
  row: number
  column: number
}
