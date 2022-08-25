const canvas = document.createElement('canvas')
const canvasContenxt = canvas.getContext('2d')
class Texture {
  static from(imageSrc) {
    const texture = new Texture(imageSrc)
    return texture
  }

  static getImageHtmlEle(imageSrc) {
    return new Promise((resolve) => {
      const imageHtmlElement = new Image()
      imageHtmlElement.onload = function () {
        resolve(imageHtmlElement)
      }
      imageHtmlElement.src = imageSrc
    })
  }

  constructor(imageSrc, rate = 1) {
    this.imageSrc = imageSrc
    this.bindedTextureUnitOrder = null
    this.isBind = false
    this.webglTexture = null
    this.onloadCallback = []
    this.loaded = false
    Texture.getImageHtmlEle(this.imageSrc).then((imageHtmlEle) => {
      this.width = Math.floor(imageHtmlEle.width * rate)
      this.height = Math.floor(imageHtmlEle.height * rate)
      this.loaded = true
      this.imageHtmlEle = imageHtmlEle
      canvas.width = this.width
      canvas.height = this.height
      canvasContenxt.clearRect(0, 0, canvas.width, canvas.height)
      canvasContenxt.drawImage(imageHtmlEle, 0, 0,imageHtmlEle.width,imageHtmlEle.height,0,0,this.width,this.height)
      const imageData = canvasContenxt.getImageData(
        0,
        0,
        this.width,
        this.height,
      )
      this.imageData = new Uint8Array(imageData.data)
      this.loaded = true
      this.onloadCallback.forEach((callback)=>{
        callback()
      })
    })
  }

  setWebglContext(webglContext) {
    this._gl = webglContext
  }

  /**
   * 绑定 Texture 到当前目标
   * @param {*} bindingTextureId
   * @returns
   */
  bind(bindingTextureId, samplerOrder) {
    if (!this.imageData) {
      // image is not ready
      return
    }
    this.bindedTextureUnitOrder = samplerOrder
    this.bindingTextureId = bindingTextureId
    this._gl.activeTexture(bindingTextureId)
    this.webglTexture = this._gl.createTexture()
    this._gl.bindTexture(this._gl.TEXTURE_2D, this.webglTexture)
    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this.width,
      this.height,
      0,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      this.imageData,
    )
    this._setTexParameteri()
    this.isBind = true
  }

  unbind() {
    this.isBind = false
    this.bindedTextureUnitOrder = null
    this._gl.deleteTexture(this.webglTexture)
  }

  /**
   * 设置 Texture 参数
   */
  _setTexParameteri() {
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_WRAP_S,
      this._gl.CLAMP_TO_EDGE,
    )
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_WRAP_T,
      this._gl.CLAMP_TO_EDGE,
    )
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.LINEAR,
    )
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MAG_FILTER,
      this._gl.LINEAR,
    )
  }

  onload(callback) {
    this.onloadCallback.push(callback)
    if(this.loaded){
      callback()
    }
  }
}

export default Texture
