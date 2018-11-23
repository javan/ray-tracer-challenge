import { Color } from "./color"

export class Material {
  static create(attributes = {}) {
    return new Material(attributes)
  }

  constructor({ color, pattern, ambient, diffuse, specular, shininess, reflective, refractive, transparency } = {}) {
    this.color        = color || Color.WHITE
    this.pattern      = pattern
    this.ambient      = typeof ambient      == "number" ? ambient      : 0.1
    this.diffuse      = typeof diffuse      == "number" ? diffuse      : 0.9
    this.specular     = typeof specular     == "number" ? specular     : 0.9
    this.shininess    = typeof shininess    == "number" ? shininess    : 200
    this.reflective   = typeof reflective   == "number" ? reflective   : 0.0
    this.refractive   = typeof refractive   == "number" ? refractive   : 1.0
    this.transparency = typeof transparency == "number" ? transparency : 0.0
  }

  lighting({ object, light, point, eyev, normalv, shadowed }) {
    const color = this.pattern ? this.pattern.colorAtShape(object, point) : this.color
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
