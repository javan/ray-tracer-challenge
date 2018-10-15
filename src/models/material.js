import { Color } from "./color"

export class Material {
  constructor() {
    this.color = Color.WHITE
    this.ambient = 0.1
    this.diffuse = 0.9
    this.specular = 0.9
    this.shininess = 200
  }

  lighting(light, point, eyev, normalv) {
    const effectiveColor = this.color.multiplyBy(light.intensity)
    const lightv = light.position.subtract(point).normalize
    const ambient = effectiveColor.multiplyBy(this.ambient)
    const lightDotNormal = lightv.dotProduct(normalv)
    let diffuse, specular

    if (lightDotNormal < 0) {
      diffuse = Color.BLACK
      specular = Color.BLACK
    } else {
      diffuse = effectiveColor.multiplyBy(this.diffuse).multiplyBy(lightDotNormal)

      const reflectv = lightv.negate.reflect(normalv)
      const reflectDotEye = Math.pow(reflectv.dotProduct(eyev), this.shininess)

      if (reflectDotEye <= 0) {
        specular = Color.BLACK
      } else {
        specular = light.intensity.multiplyBy(this.specular).multiplyBy(reflectDotEye)
      }
    }

    return ambient.add(diffuse).add(specular)
  }
}
