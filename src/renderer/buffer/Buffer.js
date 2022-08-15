/*
  squareDatas[index] = {
  verticles: [
    ...leftTopPoint,
    ...leftBottomPoint,
    ...rightBottomPoint,
    ...rightTopPoint,
  ],
  colors,
  indexes: [0, 1, 2, 0, 2, 3],
  textureCoord: [
    0.0, // index 0
    0.0,
    0.0, // index 1
    1.0,
    1.0, // index 2
    1.0,
    1.0, // index 3
    0.0,
  ],
  textureId: [0,0,0,0]
*/
const POINT_COUNT_PER_TRIANGLE = 3
class Buffer {
  constructor(verArrayBuffer, verticleAttributes, indexArrayBuffer, indexesLength) {
    this._verArrayBuffer = verArrayBuffer
    this._indexArrayBuffer = indexArrayBuffer
    this.strideBytes = 36
    this.indexesLength = indexesLength
    this._verticleAttributes = verticleAttributes
  }

  bind(webglContext, shaderProgram) {
    const verticlesBuffer = webglContext.createBuffer()
    webglContext.bindBuffer(webglContext.ARRAY_BUFFER, verticlesBuffer)
    webglContext.bufferData(
      webglContext.ARRAY_BUFFER,
      this._verArrayBuffer,
      webglContext.STATIC_DRAW,
    )

    const indexBuffer = webglContext.createBuffer()
    webglContext.bindBuffer(webglContext.ELEMENT_ARRAY_BUFFER, indexBuffer)
    webglContext.bufferData(
      webglContext.ELEMENT_ARRAY_BUFFER,
      this._indexArrayBuffer,
      webglContext.STATIC_DRAW,
    )

    const dataTypeMap = {
      4: webglContext.FLOAT,
      2: webglContext.SHORT,
      1: webglContext.UNSIGNED_BYTE,
    }

    const strideBytes = this._verticleAttributes.reduce((acc, cur) => {
      return acc + cur.countPerVerticle * cur.bytePerValue
    }, 0)

    let offset = 0
    for (const verAttribute of this._verticleAttributes) {
      const location = webglContext.getAttribLocation(
        shaderProgram,
        verAttribute.attribute,
      )
      webglContext.enableVertexAttribArray(location)
      webglContext.vertexAttribPointer(
        location,
        verAttribute.countPerVerticle,
        dataTypeMap[verAttribute.bytePerValue],
        false,
        strideBytes,
        offset,
      )
      offset += verAttribute.countPerVerticle * verAttribute.bytePerValue
    }
  }

  // 计算容纳这些 triangles 顶点数据\顶点索引数据所需的 arraybuffer 容量
  static calculateArrayBufferByteLength(triangles) {
    const BYTE_LENGTH_PER_INDEX = 4
    let verticleBytesLength = 0
    if (triangles[0]) {
      for (const key in triangles[0]) {
        if (key === 'baseIndexes' || key === 'indexes') continue
        verticleBytesLength +=
          triangles[0][key].bytePerValue * triangles[0][key].countPerVerticle
      }
    }
    const verticleAttributeABByteLength = verticleBytesLength * triangles.length * POINT_COUNT_PER_TRIANGLE
    const verticleIndexABByteLength =  triangles.length * POINT_COUNT_PER_TRIANGLE * BYTE_LENGTH_PER_INDEX
    return  {verticleAttributeABByteLength,verticleIndexABByteLength}
  }

  // 创建对应长度的 ArrayBuffer
  static createArrayBuffer(verticleAttributeABByteLength, verticleIndexABByteLength) {
    const verArrayBuffer = new ArrayBuffer(
      verticleAttributeABByteLength
    )
    const arrayBufferViewMap = {
      4: new Float32Array(verArrayBuffer),
      2: new Int16Array(verArrayBuffer),
      1: new Uint8Array(verArrayBuffer),
    }

    const indexArrayBuffer = new ArrayBuffer(verticleIndexABByteLength)
    const indexUint32View = new Uint32Array(indexArrayBuffer)
    return {verArrayBuffer,arrayBufferViewMap,indexArrayBuffer,indexUint32View}
  }

  // 提取 triangles 数据中顶点属性相关的数据,过滤掉索引数据
  static extractVerticleAtributes(triangles) {
    const verticleAttributes = []
    if (triangles[0]) {
      for (const key in triangles[0]) {
        if (key === 'baseIndexes' || key === 'indexes') continue
        verticleAttributes.push({
          key: key,
          attribute: triangles[0][key].attribute,
          bytePerValue: triangles[0][key].bytePerValue,
          countPerVerticle: triangles[0][key].countPerVerticle,
        })
      }
    }
    return verticleAttributes
  }

  static from(triangles) {
    const verticleAttributes = Buffer.extractVerticleAtributes(triangles)
    const {verticleAttributeABByteLength, verticleIndexABByteLength} = Buffer.calculateArrayBufferByteLength(triangles)
    const {verArrayBuffer,arrayBufferViewMap,indexArrayBuffer,indexUint32View} = Buffer.createArrayBuffer(verticleAttributeABByteLength, verticleIndexABByteLength)

    let verBytesOffset = 0
    let idxBytesOffset = 0
    // 逐形状
    for (let i = 0; i < triangles.length; i++) {
      // 逐顶点
      for (let verIdx = 0; verIdx < POINT_COUNT_PER_TRIANGLE; verIdx++) {
        for (const attribute of verticleAttributes) {
          const { key, bytePerValue, countPerVerticle } = attribute
          for (
            let countIndex = 0;
            countIndex < countPerVerticle;
            countIndex++
          ) {
            arrayBufferViewMap[bytePerValue][verBytesOffset / bytePerValue] =
              triangles[i][key].data[verIdx * countPerVerticle + countIndex]
            verBytesOffset += bytePerValue
          }
        }
      }
      // 逐索引
      for (
        let indexIdx = 0;
        indexIdx < triangles[i].indexes.length;
        indexIdx++
      ) {
        indexUint32View[idxBytesOffset / 4] = triangles[i].indexes[indexIdx]
        idxBytesOffset += 4
      }
    }

    return new Buffer(
      verArrayBuffer,
      verticleAttributes,
      indexArrayBuffer,
      indexUint32View.length,
    )
  }
}

export default Buffer
