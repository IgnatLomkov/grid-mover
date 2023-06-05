export const enum ENodeEnv {
  Development = 'development',
  Production = 'production'
}

interface IEnv {
  NODE_ENV: ENodeEnv
}

export const env: IEnv = <const>{
  NODE_ENV: <ENodeEnv>process.env.NODE_ENV
}
