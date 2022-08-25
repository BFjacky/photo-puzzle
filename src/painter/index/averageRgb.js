/**
 * 将一张图片按照一定宽高,切分成若干像素块,并记录块的起始与终止像素
 * @param {*} texture
 * @param {*} sumCols 区分为 sumCols 列
 * @param {*} sumRows 区分为 sumRows 行
 */
function splitChunks(texture, sumCols, sumRows) {
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
 * 计算某一个像素块的平均像素值
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
 * 将一个图片按照一定宽高切分成不同的块后,计算每个块的平均像素值
 * @param {*} texture
 */
export default function calculateAverageRGBChunks(texture, sumCols, sumRows) {
  const averagePixels = []
  const pixelsChunks = splitChunks(texture, sumCols, sumRows)
  for (const pixelsChunk of pixelsChunks) {
    averagePixels.push(calculateAverageRGBChunk(texture, pixelsChunk))
  }
  return averagePixels
}
