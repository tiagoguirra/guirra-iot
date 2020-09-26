const hslToRgb = (h: number = 0, s: number = 0, l: number = 0) => {
  if (h < 0) h = 0
  if (s < 0) s = 0
  if (l < 0) l = 0
  if (h >= 360) h = 359
  if (s > 100) s = 100
  if (l > 100) l = 100
  s /= 100
  l /= 100
  const C = (1 - Math.abs(2 * l - 1)) * s
  const hh = h / 60
  const X = C * (1 - Math.abs((hh % 2) - 1))
  let r = 0
  let g = 0
  let b = 0
  if (hh >= 0 && hh < 1) {
    r = C
    g = X
  } else if (hh >= 1 && hh < 2) {
    r = X
    g = C
  } else if (hh >= 2 && hh < 3) {
    g = C
    b = X
  } else if (hh >= 3 && hh < 4) {
    g = X
    b = C
  } else if (hh >= 4 && hh < 5) {
    r = X
    b = C
  } else {
    r = C
    b = X
  }
  const m = l - C / 2
  r += m
  g += m
  b += m
  r *= 255.0
  g *= 255.0
  b *= 255.0
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  return { red: r, green: g, blue: b }
}

const rgbToHsl = (r: number = 0, g: number = 0, b: number = 0) => {
  if (r < 0) r = 0
  if (g < 0) g = 0
  if (b < 0) b = 0
  if (r > 255) r = 255
  if (g > 255) g = 255
  if (b > 255) b = 255
  r /= 255
  g /= 255
  b /= 255
  const M = Math.max(r, g, b)
  const m = Math.min(r, g, b)
  const d = M - m
  let h = 0
  let l = 0
  let s = 0
  if (d == 0) h = 0
  else if (M == r) h = ((g - b) / d) % 6
  else if (M == g) h = (b - r) / d + 2
  else h = (r - g) / d + 4
  h *= 60
  if (h < 0) h += 360
  l = (M + m) / 2
  if (d == 0) s = 0
  else s = d / (1 - Math.abs(2 * l - 1))
  s *= 100
  l *= 100
  return { hue: h, saturation: s, luminosity: l }
}

export default { hslToRgb, rgbToHsl }
export { hslToRgb, rgbToHsl }
