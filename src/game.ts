import 'pixi-spine'

import gsap from 'gsap'
import { Application, Assets } from 'pixi.js'

import { Character } from '@/components/character'
import { Plane } from '@/components/plane'
import { EDOMId } from '@/data/dom'
import { ENodeEnv, env } from '@/data/env'

import { ISpineAsset } from './types/assets'

class Game extends Application {
  private readonly canvasContainer = <HTMLDivElement>(
    document.getElementById(EDOMId.CanvasContainer)
  )

  private _plane!: Plane
  get plane() {
    return this._plane
  }

  private _character!: Character
  get character() {
    return this._character
  }

  constructor() {
    super({
      backgroundColor: '#ffffff',
      width: EGameSize.Width,
      height: EGameSize.Height,
      resolution: window.devicePixelRatio || 1,
      autoStart: false
    })

    this.loadAssets().then(this.startGame.bind(this))
  }

  private async loadAssets() {
    await Assets.load(Object.values(EGameAsset))
  }

  private startGame() {
    this._plane = new Plane()
    this.stage.addChild(this._plane)
    this._character = new Character()
    this.stage.addChild(this._character)

    this.showGame()
    gsap.ticker.add(() => {
      this.ticker.update()
    })

    window.addEventListener('resize', this.onResize.bind(this))
  }

  private showGame() {
    this.canvasContainer.appendChild(<HTMLCanvasElement>this.view)
    this.onResize()
  }

  private onResize() {
    let { innerWidth: width, innerHeight: height } = window
    if (width / height >= EGameSize.AspectRatio) {
      width = height * EGameSize.AspectRatio
    } else {
      height = width / EGameSize.AspectRatio
    }

    const canvas = <HTMLCanvasElement>this.view
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
  }
}

export const enum EGameSize {
  Width = 1920,
  Height = 1080,
  AspectRatio = Width / Height
}

export enum EGameAsset {
  Character = 'Character/index.json'
}

export interface IGameAssetToTypeMap {
  [EGameAsset.Character]: ISpineAsset
}

export const game = new Game()

//NOTE: devtools
if (env.NODE_ENV === ENodeEnv.Development) {
  globalThis.__PIXI_APP__ = game
}
