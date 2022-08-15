// import vertexShaderSource from '../glsl/verticle.glsl'
// import fragShaderSource from '../glsl/frag.glsl'
// import { initShader } from '../webgl/initial.js'
// //通过getElementById()方法获取canvas画布
// const canvas = document.getElementById('webgl')
// //通过方法getContext()获取WebGL上下文
// const gl = canvas.getContext('webgl')
// // 获取 vao 扩展
// const vaoExt = gl.getExtension('OES_vertex_array_object')
// //初始化着色器
// const program = initShader(gl, vertexShaderSource, fragShaderSource)
// const red = [255, 128, 128, 255]
// const grey = [100, 100, 100, 255]

// function renderMultiRectangle(
//   multiRectVerticles,
//   multiVerticalColors,
//   multiRectIndexes,
// ) {
//   // 顶点数据为一个值 4 字节，一个顶点 2 个值， 颜色数据为一个值 1 字节， 一个颜色 4 个值
//   const verticlArraybuffer = new ArrayBuffer(
//     multiRectVerticles.length * 4 + multiVerticalColors.length * 1,
//   )
//   const float32View = new Float32Array(verticlArraybuffer)
//   const uint8View = new Uint8Array(verticlArraybuffer)
//   // 赋值坐标数据
//   for (let i = 0; i < multiRectVerticles.length; i += 2) {
//     const verticleIndex = Math.floor(i / 2) // 当前是第几个顶点
//     const offset = verticleIndex * 3 // 在 arraybuffer 中的偏移量
//     float32View[offset] = multiRectVerticles[i]
//     float32View[offset + 1] = multiRectVerticles[i + 1]
//   }
//   // 赋值颜色数据
//   for (let i = 0; i < multiVerticalColors.length; i += 4) {
//     const verticleIndex = Math.floor(i / 4) // 当前是第几个顶点
//     const offset = verticleIndex * 12 + 8 // 在 arraybuffer 中的偏移量
//     uint8View[offset] = multiVerticalColors[i]
//     uint8View[offset + 1] = multiVerticalColors[i + 1]
//     uint8View[offset + 2] = multiVerticalColors[i + 2]
//     uint8View[offset + 3] = multiVerticalColors[i + 3]
//   }

//   // 顶点索引数据
//   const indexArrayBuffer = new ArrayBuffer(multiRectIndexes.length * 2)
//   const uint16View = new Uint16Array(indexArrayBuffer)
//   for (let i = 0; i < multiRectIndexes.length; i++) {
//     const offset = i
//     uint16View[offset] = multiRectIndexes[i]
//   }

//   const vao = vaoExt.createVertexArrayOES()
//   vaoExt.bindVertexArrayOES(vao)

//   const aposBuffer = gl.createBuffer()
//   gl.bindBuffer(gl.ARRAY_BUFFER, aposBuffer)
//   gl.bufferData(gl.ARRAY_BUFFER, verticlArraybuffer, gl.STATIC_DRAW)

//   const indexBuffer = gl.createBuffer()
//   gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
//   gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexArrayBuffer, gl.STATIC_DRAW)

//   const aposLocation = gl.getAttribLocation(program, 'apos')
//   gl.enableVertexAttribArray(aposLocation)
//   gl.vertexAttribPointer(aposLocation, 2, gl.FLOAT, false, 12, 0)

//   const acolorLocation = gl.getAttribLocation(program, 'a_color')
//   gl.enableVertexAttribArray(acolorLocation)
//   gl.vertexAttribPointer(acolorLocation, 4, gl.UNSIGNED_BYTE, false, 12, 8)

//   vaoExt.bindVertexArrayOES(null)

//   return vao
// }

// // 初始化第一个方块的数据
// const verticles1 = [-0.2, 0.2, 0.2, 0.2, 0.2, -0.2, -0.2, -0.2]
// const color1 = [...red, ...red, ...red, ...red]
// const indexes1 = [0, 1, 2, 0, 2, 3]

// const vao1 = renderMultiRectangle([...verticles1], [...color1], [...indexes1])

// // 初始化第二个方块的数据
// const verticles2 = [0.4, 0.2, 0.8, 0.2, 0.8, -0.2, 0.4, -0.2]
// const color2 = [...grey, ...grey, ...grey, ...grey]
// const indexes2 = [0, 1, 2, 0, 2, 3]

// const vao2 = renderMultiRectangle([...verticles2], [...color2], [...indexes2])

// vaoExt.bindVertexArrayOES(vao1)
// gl.drawElements(gl.TRIANGLES, indexes1.length, gl.UNSIGNED_SHORT, 0)
// vaoExt.bindVertexArrayOES(vao2)
// gl.drawElements(gl.TRIANGLES, indexes2.length, gl.UNSIGNED_SHORT, 0)
