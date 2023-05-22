export const ENV_LOCAL = 'local'
export const ENV_PROD = 'prod'

export const AVAILABLE_ENVS = [ENV_LOCAL, ENV_PROD]

export const API: {
    [key: string]: string
  } = {
    [ENV_LOCAL]: 'http://localhost:8000',
    [ENV_PROD]: 'https://us-central1-music-search.cloudfunctions.net/api',
  }