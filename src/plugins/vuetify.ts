/**
 * Vuetify theme configuration with custom color scheme
 */

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const lightTheme = {
  colors: {
    surface: '#ffffff', // Crisp white
    'surface-dim': '#d8dadc',
    'surface-bright': '#ffffff', // Crisp white
    'surface-container-lowest': '#ffffff',
    'surface-container-low': '#f2f4f6',
    'surface-container': '#eceef0',
    'surface-container-high': '#e6e8ea',
    'surface-container-highest': '#e0e3e5',
    'on-surface': '#191c1e',
    'on-surface-variant': '#45464d',
    'inverse-surface': '#2d3133',
    'inverse-on-surface': '#eff1f3',
    outline: '#76777d',
    'outline-variant': '#c6c6cd',
    'surface-tint': '#71b084', // Updated to your green
    
    // Core accent changes
    primary: '#71b084', // Your exact highlight color
    'on-primary': '#ffffff',
    'primary-container': '#eaf3ed', // Soft pale green for backgrounds/hovers
    'on-primary-container': '#1a3323',
    'inverse-primary': '#bec6e0',
    
    secondary: '#505f76',
    'on-secondary': '#ffffff',
    'secondary-container': '#d0e1fb',
    'on-secondary-container': '#54647a',
    tertiary: '#000000',
    'on-tertiary': '#ffffff',
    'tertiary-container': '#002109',
    'on-tertiary-container': '#009844',
    error: '#ba1a1a',
    'on-error': '#ffffff',
    'error-container': '#ffdad6',
    'on-error-container': '#93000a',
    'primary-fixed': '#dae2fd',
    'primary-fixed-dim': '#bec6e0',
    'on-primary-fixed': '#131b2e',
    'on-primary-fixed-variant': '#3f465c',
    'secondary-fixed': '#d3e4fe',
    'secondary-fixed-dim': '#b7c8e1',
    'on-secondary-fixed': '#0b1c30',
    'on-secondary-fixed-variant': '#38485d',
    'tertiary-fixed': '#6bff8f',
    'tertiary-fixed-dim': '#4ae176',
    'on-tertiary-fixed': '#002109',
    'on-tertiary-fixed-variant': '#005321',
    
    background: '#ffffff', // Crisp white background
    'on-background': '#191c1e',
    'surface-variant': '#e0e3e5',
    
    // Custom dashboard greens mapped to your highlight color
    success: '#71b084',
    'success-light': '#eaf3ed', // Soft tint for chips/avatars
    'success-button': '#71b084',
    'primary-light': '#eaf3ed',
  },
}

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: lightTheme.colors,
      },
    },
  },
})

export default vuetify