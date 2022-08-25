import vertexShaderSource from './glsl/verticle.glsl'
import fragShaderSource from './glsl/frag.glsl'
import { getCubeDrawableData } from './webgl/indexes.js'
import {
  bindTexture,
  initShader,
  bindIndexes,
  bindAttribute,
  initTextures,
} from './webgl/initial.js'
import { rotateVerticles } from './webgl/motion.js'

//通过getElementById()方法获取canvas画布
const canvas = document.getElementById('webgl')
//通过方法getContext()获取WebGL上下文
const gl = canvas.getContext('webgl')
window.gl = gl
//初始化着色器
const program = initShader(gl, vertexShaderSource, fragShaderSource)
// 初始点数据
const verticles = [
  vec3.fromValues(-0.2, 0.2, 0.0), //三角形顶点1坐标
  vec3.fromValues(0.2, 0.2, 0.0), //三角形顶点1坐标
  vec3.fromValues(0.2, -0.2, 0.0), //三角形顶点1坐标
  vec3.fromValues(-0.2, -0.2, 0.0), //三角形顶点1坐标

  vec3.fromValues(-0.2, 0.2, 1), //三角形顶点1坐标
  vec3.fromValues(0.2, 0.2, 1), //三角形顶点1坐标
  vec3.fromValues(0.2, -0.2, 1), //三角形顶点1坐标
  vec3.fromValues(-0.2, -0.2, 1), //三角形顶点1坐标
]

const verticles2 = [
  vec3.fromValues(-0.3, 0.3, 0.0), //三角形顶点1坐标
  vec3.fromValues(0.3, 0.3, 0.0), //三角形顶点1坐标
  vec3.fromValues(0.3, -0.3, 0.0), //三角形顶点1坐标
  vec3.fromValues(-0.3, -0.3, 0.0), //三角形顶点1坐标

  vec3.fromValues(-0.3, 0.3, 0.5), //三角形顶点1坐标
  vec3.fromValues(0.3, 0.3, 0.5), //三角形顶点1坐标
  vec3.fromValues(0.3, -0.3, 0.5), //三角形顶点1坐标
  vec3.fromValues(-0.3, -0.3, 0.5), //三角形顶点1坐标
]

let init = false

const draw1 = function () {
  rotateVerticles(verticles, 0.5)
  // drawElements(verticles)
  const data = getCubeDrawableData(verticles)
  bindAttribute(program, data.verticleData, data.colorData)
  if(!init){
    initTextures(program)
  }
  gl.drawArrays(gl.TRIANGLES, 0, 36)
}
const draw2 = function () {
  rotateVerticles(verticles2, -0.5)
  // drawElements(verticles2)
  const { colorData, verticleData } = getCubeDrawableData(verticles2)
  bindAttribute(program, verticleData, colorData)
  if(!init){
    initTextures(program)
  }
  gl.drawArrays(gl.TRIANGLES, 0, 36)
}


/**
 * webgl drawArrays 的调用仅能在同一个宏任务内叠加画多个物体，在不同的宏任务中后执行的 drawArrays 会覆盖之前的 drawArrays，在同一个宏任务中的不同 drawArrays 会同时执行在画布上
 * 可以通过去掉下面代码的 setTimeout 进行验证
 **/ 
setInterval(() => {
  draw1()
  draw2()
  init =true
}, 100)
