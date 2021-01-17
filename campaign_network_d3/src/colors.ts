export type ColorMode = 'light' | 'dark'

declare global {
  var colorMode: ColorMode
}

global.colorMode = 'dark'

export interface Color {
  light: string
  dark: string
}

export const LEGEND_COLORS: {[key: string]: Color} = {
  fuel: {
    dark: '#23F0D5',
    light: '#007CBE',
  },
  speed: {
    dark: '#FBFB9C',
    light: '#F6AE2D',
  },
  gps: {
    dark: '#D597FF',
    light: '#F26419',
  }
}

export const COLORS: { [key: string]: Color } = {
  background: {
    dark: '#032F5E',
    light: '#F5FBFF',
  },
  campaign_banner: {
    dark: '#B3D2EC',
    light: '',
  },
  center_in: {
    dark: 'black',
    light: 'black',
  },
  center_out: {
    dark: '#CBF9F9',
    light: '#97D8C4',
  }
}
