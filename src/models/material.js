import { Color } from "./color"

export class Material {
  static create(...args) {
    return new Material(...args)
  }

  constructor({ color, ambient, diffuse, specular, shininess } = {}) {
    this.color = color || Color.WHITE
    this.ambient = ambient || 0.1
    this.diffuse = diffuse || 0.9
    this.specular = specular || 0.9
    this.shininess = shininess || 200
    Object.freeze(this)
  }

  lighting(light, point, eyev, normalv, shadowed) {
    const effectiveColor = this.color.multiplyBy(light.intensity)
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
