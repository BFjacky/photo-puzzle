import BaseTriangle from './BaseTriangle'
class Sprite {
  constructor({ position, size, rotation,texture }) {
    this.position = position // {x,y}
    this.size = size // {width,height}
    this.rotation = rotation // 一般以逆时针为正角度方向(平面坐标系 x 轴正方向)角度 0~360
    this.texture = texture
    this.colorsDelta = [0, 0, 0, 0] // 渲染目标颜色偏移
    this._webglData = null
    this._triangles = []
    this._points = [{}, {}, {}, {}]
  }

  get webglData() {
    if (!this._webglData) this._webglData = this.calculateWebglData()
    return this._webglData
  }

  updateProperties({ rotation, size, position, colorsDelta, texture }) {
    if (rotation !== undefined) {
      this.rotation = rotation
      this._webglData = null
    }
    if (size !== undefined) {
      this.size = size
      this._webglData = null
    }
    if (position !== undefined) {
      this.position = position
      this._webglData = null
    }
    if (colorsDelta !== undefined) {
      this.colorsDelta = colorsDelta
      this._webglData = null
    }
    if (texture !== undefined) {
      this.texture = texture
      this._webglData = null
    }
  }

  /**
   * *一个图形 4 个顶点*
   * 顶点数据为一个值 4 字节，一个顶点 3 个值
   * 颜色数据为一个值 1 字节， 一个顶点 4 个值
   * 纹理坐标数据为一个值 4 字节， 一个顶点 2 个值
   * 纹理编号数据为一个值 4 字节， 一个顶点 1 个值
   * 角色颜色偏移为一个值 2 字节, 一个顶点 4 个值
   */
  calculateWebglData() {
    this._points[0] = {
      x: -1,
      y: 1,
      z: this.position.z,
    }
    this._points[1] = {
      x: -1,
      y: -1,
      z: this.position.z,
    }
    this._points[2] = {
      x: 1,
      y: -1,
      z: this.position.z,
    }
    this._points[3] = {
      x: 1,
      y: 1,
      z: this.position.z,
    }

    const spriteModelMatrix = this._renderer.matrixSystem.update2DSpriteModelMatrix(
      {
        size: this.size,
        rotation: this.rotation,
        position: this.position,
        localSize: {width:2, height:2}
      },
    )
    this._points.forEach((point) => {
      const newPoint = this._renderer.matrixSystem.transform2DSpritePoints({
        spriteModelMatrix,
        point,
      })
      point.x = newPoint.x
      point.y = newPoint.y
    })

    this._points[0].color = [255, 255, 255, 255]
    this._points[1].color = [255, 255, 255, 255]
    this._points[2].color = [255, 255, 255, 255]
    this._points[3].color = [255, 255, 255, 255]

    this._points[0].colorsDelta = this.colorsDelta
    this._points[1].colorsDelta = this.colorsDelta
    this._points[2].colorsDelta = this.colorsDelta
    this._points[3].colorsDelta = this.colorsDelta

    this._points[0].texture = this.texture
    this._points[1].texture = this.texture
    this._points[2].texture = this.texture
    this._points[3].texture = this.texture

    this._points[0].textureCoord = [0, 0]
    this._points[1].textureCoord = [0, 1]
    this._points[2].textureCoord = [1, 1]
    this._points[3].textureCoord = [1, 0]

    this._triangles = [
      new BaseTriangle(this._points.slice(0, 3)),
      new BaseTriangle([this._points[0], this._points[2], this._points[3]]),
    ]

    return this._triangles.map((triangle) => triangle.webglData)
  }

  setRenderer(renderer) {
    this._renderer = renderer
  }
}

export default Sprite
