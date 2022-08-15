class UniformSystem {
  constructor(webglContext) {
    this._gl = webglContext
  }

  setShader(shaderProgram) {
    this._shaderProgram = shaderProgram
  }

  bind({ uniformName, value }) {
    const location = this._gl.getUniformLocation(
      this._shaderProgram,
      uniformName,
    )
    const unifromMatrixFn = {
      4: 'uniformMatrix2fv',
      9: 'uniformMatrix3fv',
      16: 'uniformMatrix4fv',
    }
    this._gl[unifromMatrixFn[value.length]](location, false, value)
  }
}


export default UniformSystem