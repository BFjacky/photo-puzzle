class Shader {
  static createProgram(gl, vertexShaderSource, fragmentShaderSource) {
    //创建顶点着色器对象
    const vertexShader = gl.createShader(gl.VERTEX_SHADER)
    //创建片元着色器对象
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER)
    //引入顶点、片元着色器源代码
    gl.shaderSource(vertexShader, vertexShaderSource)
    gl.shaderSource(fragmentShader, fragmentShaderSource)
    //编译顶点、片元着色器
    gl.compileShader(vertexShader)
    gl.compileShader(fragmentShader)

    //创建程序对象program
    const program = gl.createProgram()
    //附着顶点着色器和片元着色器到program
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    //链接program
    gl.linkProgram(program)
    //使用program
    gl.useProgram(program)
    gl.enable(gl.DEPTH_TEST)
    //返回程序program对象
    return program
  }

  static replaceShaderTextureString(fragShader, maxTextureLimit) {
    let gl_FragColor_shader_string = `if(vTextureId < 1.){
      textureColor = texture2D(uSamplers[0], vTextureCoord);
            }`
    for (let i = 1; i < maxTextureLimit; i++) {
      gl_FragColor_shader_string += `else if(vTextureId < ${i + 1}.){
        textureColor = texture2D(uSamplers[${i}], vTextureCoord);
        }`
    }
    const temp = fragShader.replace(
      '<<<gl_FragColor>>>',
      gl_FragColor_shader_string,
    )
    const result = temp.replace('<<<uSamplerLength>>>', maxTextureLimit)
    return result
  }
}

export default Shader
