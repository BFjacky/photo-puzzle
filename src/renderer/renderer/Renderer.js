import vertexShaderSource from '../glsl/verticle.glsl'
import fragShaderSource from '../glsl/frag.glsl'
import Buffer from '../buffer/Buffer'
import Profiler from '../profiler/Profiler'
import TextureSystem from '../texture/TextureSystem'
import Texture from '../texture/Texture'
import Shader from '../shader/Shader.js'
import Sprite from '../sprite/Sprite'
import Cube from '../sprite/Cube'
import Matrix from '../matrix/Matrix'
import UniformSystem from '../uniform/UniformSystem'
class Renderer {
  constructor() {
    this._textures = []
    this._sprites = []
    this._3dSprites = []
    this._rootNode = { next: null }
    this.stageSize = {
      width: 8192,
      height: 8192,
      depth: 8192,
    }
    this.matrixSystem = new Matrix(
      this.stageSize.width,
      this.stageSize.height,
      this.stageSize.depth,
    )
    this.init()
  }

  get gl() {
    return this._gl
  }

  get profiler() {
    return this._profiler
  }

  get textureSystem() {
    return this._textureSystem
  }

  init() {
    //通过getElementById()方法获取canvas画布
    const canvas = document.getElementById('webgl')
    canvas.height = this.stageSize.height
    canvas.width = this.stageSize.width
    //通过方法getContext()获取WebGL上下文
    // FIXME: why am i need preserveDrawingBuffer
    this._gl = canvas.getContext('webgl', { preserveDrawingBuffer: true })
    this._canvas = canvas
    this._gl.viewport(0, 0, canvas.width, canvas.height)
    //初始化着色器
    this._shaderProgram = Shader.createProgram(
      this._gl,
      vertexShaderSource,
      Shader.replaceShaderTextureString(
        fragShaderSource,
        TextureSystem.MAX_TEXTURE_LIMITS(this._gl),
      ),
    )
    // 构建 TextureSystem
    this._textureSystem = new TextureSystem(this._gl)
    this._textureSystem.setShader(this._shaderProgram)
    // 构建 unifromSystem
    this._uniformSystem = new UniformSystem(this._gl)
    this._uniformSystem.setShader(this._shaderProgram)
    // 构建 profiler
    this._profiler = new Profiler()
    window.profiler = this._profiler
  }

  setStageSize(stageSize) {
    console.log(
      this._canvas.width,
      this._canvas.height,
      this._gl.drawingBufferWidth,
      this._gl.drawingBufferHeight,
    )
    this.stageSize = stageSize
    this._canvas.width = stageSize.width
    this._canvas.height = stageSize.height
    // TODO: why this._gl.drawingBufferWidth,this._gl.drawingBufferHeight
    this._gl.viewport(
      0,
      0,
      this._gl.drawingBufferWidth,
      this._gl.drawingBufferHeight,
    )
    this.matrixSystem.updateStageSize(this.stageSize)
    this.updateProjectionMatrix()
    // if drawingBufferWidth !== canvas.width , we need to modify canvas's dimension
    console.log(
      this._canvas.width,
      this._canvas.height,
      this._gl.drawingBufferWidth,
      this._gl.drawingBufferHeight,
    )
    if (
      this._gl.drawingBufferWidth !== this._canvas.width ||
      this._gl.drawingBufferHeight !== this._canvas.height
    ) {
      this.setStageSize({
        width: this._gl.drawingBufferWidth,
        height: this._gl.drawingBufferHeight,
        depth: this.stageSize.depth,
      })
    }
  }

  createTexture(image, rate) {
    const texture = new Texture(image, rate)
    texture.setWebglContext(this._gl)
    this._textures.push(texture)
    return texture
  }

  createSprite(params) {
    const sprite = new Sprite(params, this)
    sprite.setRenderer(this)
    this._sprites.push(sprite)
    return sprite
  }

  createCubeSprite(params) {
    const cubeSprite = new Cube(params, this)
    cubeSprite.setRenderer(this)
    this._3dSprites.push(cubeSprite)
    return cubeSprite
  }

  /**
   * @deprecated
   */
  bindSpriteTexture(sprite, texture) {
    sprite.updateProperties({ texture })
  }

  bindSpriteTextures(sprite, textures) {
    sprite.updateProperties({ textures })
  }

  batchRender() {
    const MAX_TEXTURE_LIMITS = TextureSystem.MAX_TEXTURE_LIMITS(this._gl)
    let texturePool = []
    let spritePool = []
    let unPaintedSprite = this._sprites.filter(sprite => {
      sprite.isPainted = false
      return true
    })
    // 绘制二维纹理
    while(true){
      unPaintedSprite = unPaintedSprite.filter(sprite => !sprite.isPainted)
      if(!unPaintedSprite.length){
        break
      }
      for(const sprite of unPaintedSprite){
        if(texturePool.includes(sprite.texture)){
          spritePool.push(sprite)
          sprite.isPainted = true
        }else if(texturePool.length < MAX_TEXTURE_LIMITS){
          texturePool.push(sprite.texture)
          spritePool.push(sprite)
          sprite.isPainted = true
        }else{
          break
        }
      }
      this.batchRenderImpl(spritePool, texturePool)
    }
    // FIXME: 绘制三维纹理(但单个三维纹理的贴图过多时,需要采取分批绘制、雪碧图绘制) MAX_TEXTURE_LIMITS
    for (const sprite of this._3dSprites) {
      texturePool = []
      sprite.textures.forEach((texture) => {
        if (!texturePool.includes(texture)) {
          texturePool.push(texture)
        }
      })
      this.batchRenderImpl([sprite], texturePool)
    }
  }

  batchRenderImpl(batchSprites, texturePool) {
    this.textureSystem.bindTextures(texturePool)
    const geometries = []
    batchSprites.forEach((sprite) => {
      sprite.webglData.forEach((triangle) => {
        triangle.indexes = triangle.baseIndexes.map(
          (i) => i + geometries.length * 3,
        )
        geometries.push(triangle)
      })
    })
    this.renderImpl(geometries)
  }

  renderImpl(geometries) {
    const buffer = Buffer.from(geometries)
    buffer.bind(this._gl, this._shaderProgram)
    var ext = this._gl.getExtension('OES_element_index_uint')
    this._gl.drawElements(
      this._gl.TRIANGLES,
      buffer.indexesLength,
      this._gl.UNSIGNED_INT,
      0,
    )
  }

  exportStage() {
    this._canvas.toBlob(
      function (blob) {
        const a = document.createElement('a')
        document.body.appendChild(a)
        const url = window.URL.createObjectURL(blob)
        a.href = url
        a.download = 'image'
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      },
      'image/png'
    )
  }

  updateCamera(camera) {
    this.matrixSystem.camera = camera
    this.updateProjectionMatrix()
  }

  updatePerspective(perspective) {
    this.matrixSystem.perspective = perspective
    this.updateProjectionMatrix()
  }

  updateProjectionMatrix() {
    const {
      stageModelMatrix2D,
      stageModelMatrix3D,
    } = this.matrixSystem.updateStageModelMatrix(this.stageSize)
    this._uniformSystem.bind({
      uniformName: 'modelMatrix2D',
      value: stageModelMatrix2D,
    })
    this._uniformSystem.bind({
      uniformName: 'modelMatrix3D',
      value: stageModelMatrix3D,
    })
  }
}

export default Renderer
