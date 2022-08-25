import * as mat3 from '../../../gl-matrix/gl-matrix-src/mat3.js'
import * as vec2 from '../../../gl-matrix/gl-matrix-src/vec2.js'
import * as mat4 from '../../../gl-matrix/gl-matrix-src/mat4.js'
import * as vec3 from '../../../gl-matrix/gl-matrix-src/vec3.js'
// 说明: webgl 中, z 轴取值仅影响深度测试,,z轴取值范围(-1,1),越大像素越被压在下面,即在没有任何配置的情况下 WebGL 是默认左手坐标系的
// 但是我们开发过程中是更期望使用右手系的,并不是右手系比左手系更好,只是右手系更常用
const WEBGL_WIDTH = 2
const WEBGL_HEIGHT = 2
const WEBGL_DEPTH = 2 // 0 ~ near 1 ~ far
class Matrix {
  constructor(stageWidth, stageHeight, stageDepth) {
    this.stageWidth = stageWidth
    this.stageHeight = stageHeight
    this.stageDepth = stageDepth
    this.modelMatrix = null
    this.camera = {
      eye: vec3.fromValues(0, 0, 0),
      center: vec3.fromValues(0, 0, -1),
      up: vec3.fromValues(0, 1, 0)
    }
    this.perspective = {
      near: 1,
      fovy: Math.PI * 0.5
    }
    this.update2DStageModelMatrix()
  }

  static degreeToRad(degree) {
    return (degree / 180) * Math.PI
  }
  // 模型矩阵,将坐标信息由自定义舞台坐标系转换为Webgl坐标系
  update2DStageModelMatrix() {
    const scaleMatrix = mat3.fromScaling(mat3.create(), [
      WEBGL_WIDTH / this.stageWidth,
      WEBGL_HEIGHT / this.stageHeight,
    ])
    const translationMatrix = mat3.fromTranslation(mat3.create(), [
      -this.stageWidth / 2,
      -this.stageHeight / 2,
    ])
    this.modelMatrix = mat3.multiply(
      mat3.create(),
      scaleMatrix,
      translationMatrix,
    )
    return this.modelMatrix
  }

  /**
   * 
   * @param {*} obj 
   * @property {number} obj.size.width  世界坐标系下宽度
   * @property {number} obj.size.height 世界坐标系下高度
   * @property {number} obj.rotation    世界坐标系旋转角度
   * @property {number} obj.position.x  世界坐标系中心点 X 坐标
   * @property {number} obj.position.y  世界坐标系中心点 Y 坐标
   * @property {number} obj.localSize.width   局部坐标系下宽度
   * @property {number} obj.localSize.height   局部坐标系下高度
   * @returns 
   */
  update2DSpriteModelMatrix({ size, rotation, position,localSize }) {
    const xScale = size.width / localSize.width
    const yScale = size.height / localSize.height
    const scaleMatrix = mat3.fromScaling(mat3.create(), [xScale, yScale])
    const translationMatrix = mat3.fromTranslation(mat3.create(), [
      position.x / xScale,
      position.y / yScale,
    ])
    const rotationMatrix = mat3.fromRotation(
      mat3.create(),
      Matrix.degreeToRad(rotation),
    )
    const matrix1 = mat3.multiply(
      mat3.create(),
      translationMatrix,
      rotationMatrix,
    )
    this.spriteModelMatrix = mat3.multiply(mat3.create(), scaleMatrix, matrix1)
    return this.spriteModelMatrix
  }

  /**
   * 在 2D 模式下对一个渲染模型进行变换
   * @param {*} param0
   */
  transform2DSpritePoints({ point, spriteModelMatrix }) {
    const pointVec = vec2.fromValues(point.x, point.y)
    const newPointVec = vec2.transformMat3(
      vec2.create(),
      pointVec,
      spriteModelMatrix,
    )
    return { x: newPointVec[0], y: newPointVec[1] }
  }

  // 模型矩阵,将坐标信息由自定义舞台坐标系转换为Webgl坐标系
  update3DStageModelMatrix() {
    // 正交投影 left, right, bottom, top, near(-Znear), far(-Zfar)
    const orthoMatrix = mat4.orthoNO(mat4.create(), 0, this.stageWidth, 0, this.stageHeight, this.stageDepth, 0)
    // 为了方便使用透视投影,在正交投影的基础上进行变换可以避免坐标系原点移动,下面的网站上展示了透视投影所需要的坐标系
    // https://stackoverflow.com/questions/28286057/trying-to-understand-the-math-behind-the-perspective-matrix-in-webgl/28301213 
    // 将目标点的 Z 移动到 frustum 中
    // newPointVecAfterOrtho[2] = (newPointVecAfterOrtho[2] - WEBGL_DEPTH / 2) * 0.5 - this.perspective.near
    const zTranslationMatrix = mat4.create()
    zTranslationMatrix[10] = 0.5
    zTranslationMatrix[14] = - (0.25 * WEBGL_DEPTH + this.perspective.near)
    // 透视投影
    const aspect = this.stageWidth / this.stageHeight
    const near = this.perspective.near
    const far = near + WEBGL_DEPTH / 2
    const fovy = this.perspective.fovy // 60度
    // out, fovy, aspect, near, far
    const perspectiveMatrix = mat4.perspectiveNO(
      mat4.create(),
      fovy,
      aspect,
      near,
      // far, 绝大部分时候我们的 far 应该是 null,视锥体应该是无限远的
    )
    const combinedMatrix = mat4.multiply(mat4.create(),perspectiveMatrix,mat4.multiply(mat4.create(),zTranslationMatrix,orthoMatrix)) 
    // TODO: 在这里可以选择使用透视矩阵 or 正交矩阵(对于兼容 2D 渲染的舞台需要使用正交矩阵)
    

    // 摄像机矩阵
    const cameraMatrix = mat4.lookAt(mat4.create(),this.camera.eye,this.camera.center,this.camera.up)
    const cameraOrthoMatrix = mat4.multiply(mat4.create(), cameraMatrix, combinedMatrix)

    return orthoMatrix
  }

  /**
   * @param {Object} rotation
   * @property {Number} rotation.fromX
   * @property {Number} rotation.fromY
   * @property {Number} rotation.fromZ
   * @returns
   */
  update3DSpriteModelMatrix({
    size,
    rotation,
    position,
    localSize
  }) {
    const rotationFromXMatrix = mat4.create()
    const rotationFromYMatrix = mat4.create()
    const rotationFromZMatrix = mat4.create()
    mat4.fromXRotation(rotationFromXMatrix, Matrix.degreeToRad(rotation.fromX))
    mat4.fromYRotation(rotationFromYMatrix, Matrix.degreeToRad(rotation.fromY))
    mat4.fromZRotation(rotationFromZMatrix, Matrix.degreeToRad(rotation.fromZ))

    const rotationMatrix = mat4.multiply(
      mat4.create(),
      mat4.multiply(mat4.create(), rotationFromXMatrix, rotationFromYMatrix),
      rotationFromZMatrix,
    )
    const xScale = size.width / localSize.width
    const yScale = size.height / localSize.height
    const zScale = size.depth / localSize.depth
    const scaleMatrix = mat4.fromScaling(mat4.create(), [
      xScale,
      yScale,
      zScale,
    ])
    const translationMatrix = mat4.fromTranslation(mat4.create(), [
      position.x / xScale,
      position.y / yScale,
      position.z / zScale,
    ])
    const matrixWithoutRotation = mat4.multiply(
      mat4.create(),
      scaleMatrix,
      translationMatrix,
    )
    const matrixWithRotation = mat4.multiply(
      mat4.create(),
      matrixWithoutRotation,
      rotationMatrix,
    )
    return matrixWithRotation
  }

  transform3DSpritePoints({ point, spriteModelMatrix }) {
    const pointVec = vec3.fromValues(point.x, point.y, point.z)
    const newPointVec = vec3.transformMat4(
      vec3.create(),
      pointVec,
      spriteModelMatrix,
    )
    // this._stageModelMatrix3D = this.update3DStageModelMatrix()
    // const newPointVecAfterPerspect = vec3.transformMat4(
    //   vec3.create(),
    //   newPointVec,
    //   mat4.create(),
    //   this._stageModelMatrix3D,
    // )
    
    return {
      x: newPointVec[0],
      y: newPointVec[1],
      z: newPointVec[2],
    }
  }

  updateStageSize(stageSize) {
    this.stageWidth = stageSize.width
    this.stageHeight = stageSize.height
    this.stageDepth = stageSize.depth
  }


  updateStageModelMatrix(){
    this._stageModelMatrix2D = this.update2DStageModelMatrix()
    this._stageModelMatrix3D = this.update3DStageModelMatrix()
    return {
      stageModelMatrix2D: this._stageModelMatrix2D,
      stageModelMatrix3D: this._stageModelMatrix3D,
    }
  }
}

export default Matrix
