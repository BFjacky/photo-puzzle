class BaseTriangle {
  constructor(points) {
    this._points = points
    this.texture = null
    this._webglData = null
  }

  get webglData() {
    return this.calculateWebglData()
  }

  calculateWebglData() {
    const verticles = [
      this._points[0].x,
      this._points[0].y,
      this._points[0].z,
      this._points[1].x,
      this._points[1].y,
      this._points[1].z,
      this._points[2].x,
      this._points[2].y,
      this._points[2].z,
    ]
    const colors = [
      ...this._points[0].color,
      ...this._points[1].color,
      ...this._points[2].color,
    ]
    const textureCoord = [
      ...this._points[0].textureCoord,
      ...this._points[1].textureCoord,
      ...this._points[2].textureCoord,
    ]
    const baseIndexes = [0, 1, 2]
    this._webglData = {
      verticles: {
        data: verticles,
        attribute: 'apos',
        countPerVerticle: 3,
        bytePerValue: 4,
      },
      textureCoord: {
        data: textureCoord,
        attribute: 'aTextureCoord',
        countPerVerticle: 2,
        bytePerValue: 4,
      },
      baseIndexes: baseIndexes,
      colors: {
        data: colors,
        attribute: 'a_color',
        countPerVerticle: 4,
        bytePerValue: 1,
      },
      textureId: {
        data: [
          this._points[0].texture.bindedTextureUnitOrder,
          this._points[1].texture.bindedTextureUnitOrder,
          this._points[2].texture.bindedTextureUnitOrder,
        ],
        attribute: 'aTextureId',
        countPerVerticle: 1,
        bytePerValue: 4,
      },
      colorsDelta: {
        data: [
          ...this._points[0].colorsDelta,
          ...this._points[1].colorsDelta,
          ...this._points[2].colorsDelta,
        ],
        attribute: 'a_color_delta',
        countPerVerticle: 4,
        bytePerValue: 2,
      }
    }
    return this._webglData
  }

  bindTexture(texture) {
    this.texture = texture
  }
}

export default BaseTriangle
