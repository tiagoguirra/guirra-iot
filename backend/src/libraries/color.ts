const hsbToRgb = (
  h: number,
  s: number,
  v: number
): { red: number; green: number; blue: number } => {
  let C = v * s
  let hh = h / 60.0
  let X = C * (1.0 - Math.abs((hh % 2) - 1.0))
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
  let m = v - C
  r += m
  g += m
  b += m
  return { red: r, green: g, blue: b }
}

const rgbToHsb = (
  r: number = 0,
  g: number = 0,
  b: number = 0
): { hue: number; saturation: number; brightness: number } => {
  r *= 255.0
  g *= 255.0
  b *= 255.0
  r = Math.round(r)
  g = Math.round(g)
  b = Math.round(b)
  if (r < 0) r = 0
  if (g < 0) g = 0
  if (b < 0) b = 0
  if (r > 255) r = 255
  if (g > 255) g = 255
  if (b > 255) b = 255

  r /= 255
  g /= 255
  b /= 255
  let h = 0
  let M = Math.max(r, g, b)
  let m = Math.min(r, g, b)
  let C = M - m
  if (C == 0) h = 0
  else if (M == r) h = ((g - b) / C) % 6
  else if (M == g) h = (b - r) / C + 2
  else h = (r - g) / C + 4
  h *= 60
  if (h < 0) h += 360
  let v = M
  let s = 0
  if (v == 0) s = 0
  else s = C / v
  return { hue: Number(h.toFixed(0)), saturation: s, brightness: v }
}

export { rgbToHsb, hsbToRgb }
export default { rgbToHsb, hsbToRgb }
