class TextureSystem {
  constructor(webglContext) {
    this._gl = webglContext
    this._activeTextures = []
  }

  static MAX_TEXTURE_LIMITS(webglContext) {
    return webglContext.getParameter(webglContext.MAX_TEXTURE_IMAGE_UNITS)
  }

  setShader(shaderProgram) {
    this._shaderProgram = shaderProgram
  }

  _setSamplerUniform(texturesLength) {
    for (let i = 0; i < texturesLength; i++) {
      this._gl.uniform1i(
        this._gl.getUniformLocation(this._shaderProgram, `uSamplers[${i}]`),
        i,
      )
    }
  }

  bindTextures(textures) {
    // window.profiler.start('bind_textures', {
    //   interval: 30,
    //   extraText: `纹理数量${texturePool.length}`,
    // })
    this._setSamplerUniform(textures.length)
    const bindedTextureUnits = []
    const willBindTextures = textures.filter((texture) => {
      if (texture.isBind) {
        bindedTextureUnits.push(texture.bindedTextureUnitOrder)
      }
      return !texture.isBind
    })
    const willUnBindTextures = this._activeTextures.filter(
      (texture) => !textures.includes(texture),
    )
    willUnBindTextures.forEach((texture) => {
      texture.unbind()
    })
    let textureUintOrder = 0
    willBindTextures.forEach((texture) => {
      if (!texture.loaded) return
      while (bindedTextureUnits.includes(textureUintOrder)) {
        textureUintOrder++
      }
      const webglTextureId = this._gl[`TEXTURE${textureUintOrder}`]
      // window.profiler.start('bind_one_texture', {
      //   interval: 30,
      // })
      texture.bind(webglTextureId, textureUintOrder)
      // window.profiler.end('bind_one_texture')
      bindedTextureUnits.push(textureUintOrder)
    })
    this._activeTextures = textures
    // window.profiler.end('bind_textures')
  }
}

export default TextureSystem
