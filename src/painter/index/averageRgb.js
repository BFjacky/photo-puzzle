// FIXME: test
// const canvas = document.createElement('canvas')
// document.body.prepend(canvas)
// const ctx = canvas.getContext('2d')
// canvas.width = 1500
// canvas.height = 1500
// canvas.style.cssText = `border:10px solid red;width:50vw;height:50vw;`

/**
 *
 * @param {*} texture
 * @param {*} sumCols 区分为 sumCols 列
 * @param {*} sumRows 区分为 sumRows 行
 */
function convoluteChunks(texture, sumCols, sumRows) {
  const widthPixels = Math.floor(texture.width / sumCols) // 子块宽度像素
  const heightPixels = Math.floor(texture.height / sumRows) // 子块高度像素
  const pixelsChunks = [] // 像素块
  // 当前在遍历第几个像素块
  while (pixelsChunks.length < sumCols * sumRows) {
    const rowStart = Math.floor(
      (Math.floor(pixelsChunks.length / sumCols) / sumRows) * texture.height,
    )
    const rowEnd = rowStart + heightPixels
    const colStart = Math.floor(
      ((pixelsChunks.length % sumCols) / sumCols) * texture.width,
    )
    const colEnd = colStart + widthPixels
    pixelsChunks.push({ rowStart, rowEnd, colStart, colEnd })
  }
  return pixelsChunks
}

/**
 *
 * @param {*} texture
 * @param {*} pixelsChunk
 */
function calculateAverageRGBChunk(texture, pixelsChunk) {
  const imageData = texture.imageData
  const { rowStart, rowEnd, colStart, colEnd } = pixelsChunk
  const sumPixelsValue = [0, 0, 0, 0]
  let sumPixels = 0
  for (let row = rowStart; row < rowEnd; row++) {
    for (let col = colStart; col < colEnd; col++) {
      if (row > texture.height || col > texture.width) continue
      const pixelIndex = row * texture.width + col
      const pixelArrayIndex = pixelIndex * 4
      sumPixelsValue[0] += imageData[pixelArrayIndex]
      sumPixelsValue[1] += imageData[pixelArrayIndex + 1]
      sumPixelsValue[2] += imageData[pixelArrayIndex + 2]
      sumPixelsValue[3] += imageData[pixelArrayIndex + 3]
      sumPixels++
    }
  }
  return sumPixelsValue.map((item) => Math.floor(item / sumPixels))
}

/**
 * @param {*} texture
 */
export default function calculateAverageRGBChunks(texture, sumCols, sumRows) {
  const averagePixels = []
  const pixelsChunks = convoluteChunks(texture, sumCols, sumRows)
  for (const pixelsChunk of pixelsChunks) {
    averagePixels.push(calculateAverageRGBChunk(texture, pixelsChunk))
  }

//   const singlePixelWidth = Math.floor(canvas.width / sumCols)
//   const singlePixelHeight = Math.floor(canvas.height / sumRows)

  // FIXME: test draw on the canvas
  //   if(istest){
  //     for (let i = 0; i < sumRows; i++) {
  //         for (let j = 0; j < sumCols; j++) {
  //           const index = i * sumCols + j
  //           const pixels = averagePixels[index]
  //           ctx.fillStyle = `rgba(${pixels[0]},${pixels[1]},${pixels[2]},${pixels[3]})`
  //           ctx.fillRect(
  //             j * singlePixelWidth,
  //             i * singlePixelHeight,
  //             singlePixelWidth,
  //             singlePixelHeight,
  //           )
  //         }
  //       }
  //   }

  return averagePixels
}
