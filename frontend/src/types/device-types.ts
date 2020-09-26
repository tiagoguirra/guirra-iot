const categories = ['light', 'switch', 'others']

const categoryLabel = {
  light: 'Light',
  switch: 'Switch',
  others: 'Others',
  smartlock: 'Smartlock',
}
const defaultProperty = {
  light: 'power',
  switch: 'power',
  others: 'power',
  smartlock: 'lock',
}

const pulseSuport = {
  light: true,
  switch: true,
  others: false,
}

const pulseValues = [1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5]
export { categoryLabel, defaultProperty, categories, pulseSuport, pulseValues }
export default {
  categoryLabel,
  defaultProperty,
  categories,
  pulseSuport,
  pulseValues,
}
