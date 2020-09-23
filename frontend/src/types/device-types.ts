const categories = ['light', 'light_rgb', 'light_brightness', 'smartlock']

const categoryLabel = {
  light: 'Light',
  light_rgb: 'Light rgb',
  light_brightness: 'Light with brightness',
  smartlock: 'Door lock'
}
const defaultProperty = {
  light: 'power',
  light_rgb: 'power',
  light_brightness: 'power',
  smartlock: 'lock'
}

const pulseSuport = {
  light: true,
  light_rgb: true,
  light_brightness: true,
  smartlock: true
}

const pulseValues = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5]
export { categoryLabel, defaultProperty, categories, pulseSuport, pulseValues }
export default {
  categoryLabel,
  defaultProperty,
  categories,
  pulseSuport,
  pulseValues
}
