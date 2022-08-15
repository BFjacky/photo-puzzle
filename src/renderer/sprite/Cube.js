import BaseTriangle from './BaseTriangle'
class CubeSprite {
  constructor({ position, size, rotation }) {
    this._triangles = []
    this.position = position // {x,y}
    this.size = size // {width,height}
    // this.baseIndexes = [0, 1, 2, 0, 2, 3]
    this.colorsDelta = [0, 0, 0, 0] // 渲染目标颜色偏移
    this.textures = null
    // 记录角色的顺时针旋转角度
    this.rotation = rotation // 一般以逆时针为正角度方向(平面坐标系 x 轴正方向)角度 0~360

    this.next = null // sprite 使用双向链表互相链接,方便按纹理顺序插入
    this.prev = null // sprite 使用双向链表互相链接,方便按纹理顺序插入

    this._webglData = null

    this._points = [{}, {}, {}, {}, {}, {}, {}, {}] // webgl 约定使用右手坐标系, z 轴为由屏幕向外为正方向
  }

  get webglData() {
    if (!this._webglData) this._webglData = this.calculateWebglData()
    return this._webglData
  }

  updateProperties({ rotation, size, position, colorsDelta, textures }) {
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
    if (textures !== undefined) {
      this.textures = textures
      this._webglData = null
    }
  }

  /**
   * *一个立方体 8 个顶点*
   */
  calculateWebglData() {
    const leftBackTop = { x: -1, y: 1, z: -1 }
    const leftBackBottom = { x: -1, y: -1, z: -1 }
    const leftFrontTop = { x: -1, y: 1, z: 1 }
    const leftFrontBottom = { x: -1, y: -1, z: 1 }
    const rightBackTop = { x: 1, y: 1, z: -1 }
    const rightBackBottom = { x: 1, y: -1, z: -1 }
    const rightFrontTop = { x: 1, y: 1, z: 1 }
    const rightFrontBottom = { x: 1, y: -1, z: 1 }

    // 因各个点的纹理坐标和纹理单元是不一致的, 6 个面仍然需要 24 个点
    // 左面四点
    // 每一个面四个点的排列顺序都是从左上角开始顺时针顺序排列
    this._points = [
      { ...leftBackTop },
      { ...leftFrontTop },
      { ...leftFrontBottom },
      { ...leftBackBottom },

      { ...rightBackTop },
      { ...rightFrontTop },
      { ...rightFrontBottom },
      { ...rightBackBottom },

      { ...leftBackTop },
      { ...rightBackTop },
      { ...rightFrontTop },
      { ...leftFrontTop },

      { ...leftBackBottom },
      { ...rightBackBottom },
      { ...rightFrontBottom },
      { ...leftFrontBottom },

      { ...leftBackTop },
      { ...rightBackTop },
      { ...rightBackBottom },
      { ...leftBackBottom },

      { ...leftFrontTop },
      { ...rightFrontTop },
      { ...rightFrontBottom },
      { ...leftFrontBottom },
    ]

    this._points.forEach((point, index) => {
      // 确定纹理坐标
      if (index % 4 === 0) {
        point.textureCoord = [0, 0]
      } else if (index % 4 === 1) {
        point.textureCoord = [0, 1]
      } else if (index % 4 === 2) {
        point.textureCoord = [1, 1]
      } else {
        point.textureCoord = [1, 0]
      }

      // 确定纹理编号
      if (this.textures) {
        point.texture = this.textures[Math.floor(index / 4)]
      }
    })

    const spriteModelMatrix = this._renderer.matrixSystem.update3DSpriteModelMatrix(
      {
        size: this.size,
        rotation: this.rotation,
        position: this.position,
        localSize: {width:2,height:2,depth:2}
      },
    )
    this._points.forEach((point) => {
      const newPoint = this._renderer.matrixSystem.transform3DSpritePoints({
        spriteModelMatrix,
        point,
      })
      point.x = newPoint.x
      point.y = newPoint.y
      point.z = newPoint.z
    })

    this._points.forEach((point) => {
      point.color = [255, 255, 255, 255]
      point.colorsDelta = this.colorsDelta
    })

    this._triangles = [
      new BaseTriangle([this._points[0], this._points[1], this._points[2]]), // 左面-1
      new BaseTriangle([this._points[0], this._points[2], this._points[3]]), // 左面-2
      new BaseTriangle([this._points[4], this._points[5], this._points[6]]), // 正面-1
      new BaseTriangle([this._points[4], this._points[6], this._points[7]]), // 正面-2
      new BaseTriangle([this._points[8], this._points[9], this._points[10]]), // 右面-1
      new BaseTriangle([this._points[8], this._points[10], this._points[11]]), // 右面-2
      new BaseTriangle([this._points[12], this._points[13], this._points[14]]), // 背面-1
      new BaseTriangle([this._points[12], this._points[14], this._points[15]]), // 背面-2
      new BaseTriangle([this._points[16], this._points[17], this._points[18]]), // 顶面-1
      new BaseTriangle([this._points[16], this._points[18], this._points[19]]), // 顶面-2
      new BaseTriangle([this._points[20], this._points[21], this._points[22]]), // 底面-1
      new BaseTriangle([this._points[20], this._points[22], this._points[23]]), // 底面-2
    ]

    return this._triangles.map((triangle) => triangle.webglData)
  }

  setRenderer(renderer) {
    this._renderer = renderer
  }
}

export default CubeSprite
