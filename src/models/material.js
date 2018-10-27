import { Color } from "./color"

export class Material {
  static create(...args) {
    return new Material(...args)
  }

  constructor({ color, ambient, diffuse, specular, shininess, pattern } = {}) {
    this.color     = color || Color.WHITE
    this.ambient   = typeof ambient   == "number" ? ambient   : 0.1
    this.diffuse   = typeof diffuse   == "number" ? diffuse   : 0.9
    this.specular  = typeof specular  == "number" ? specular  : 0.9
    this.shininess = typeof shininess == "number" ? shininess : 200
    this.pattern   = pattern
  }

  lighting({ object, light, point, eyev, normalv, shadowed }) {
    const color = this.pattern ? this.pattern.colorAt(point, object) : this.color
    const effectiveColor = color.multiplyBy(light.intensity)
    const lightv = light.position.subtract(point).normalize
    const ambient = effectiveColor.multiplyBy(this.ambient)
    if (shadowed) {
      return ambient
    }

    const lightDotNormal = lightv.dotProduct(normalv)
    let diffuse, specular

    if (lightDotNormal < 0) {
      diffuse = Color.BLACK
      specular = Color.BLACK
    } else {
      diffuse = effectiveColor.multiplyBy(this.diffuse).multiplyBy(lightDotNormal)

      const reflectv = lightv.negate.reflect(normalv)
      const reflectvDotEyev = reflectv.dotProduct(eyev)

      if (reflectvDotEyev <= 0) {
        specular = Color.BLACK
      } else {
        specular = light.intensity.multiplyBy(this.specular).multiplyBy(reflectvDotEyev ** this.shininess)
      }
    }

    return ambient.add(diffuse).add(specular)
  }
}
