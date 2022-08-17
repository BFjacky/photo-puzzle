import Renderer from '../../renderer/renderer/Renderer'
import calculateAverageRGBChunks from './averageRgb'
import ui, { updateCanvasSize } from './ui.js'

const renderer = new Renderer()

ui({ renderer, paintImage })

// 基于渲染目标的尺寸调整舞台大小
function adjustStageSizeWithTarget(textureTarget) {
  const stageSize = { depth: 1000, height: 8192 * 2, width: 8192 * 2 }
  // 根据 textureTarget 设置 webgl 绘制像素
  if (textureTarget.height > textureTarget.width) {
    stageSize.width = Math.floor(
      (stageSize.width * textureTarget.width) / textureTarget.height,
    )
    stageSize.height = stageSize.height
  } else {
    stageSize.width = stageSize.width
    stageSize.height = Math.floor(
      (stageSize.height * textureTarget.height) / textureTarget.width,
    )
  }
  renderer.setStageSize({
    height: stageSize.height,
    width: stageSize.width,
    depth: stageSize.depth,
  })
}

// 绘制一个精灵,实际为渲染块的一个元素
function paintSprite({ targetChunkPixels, position, width, height, texture }) {
  return new Promise((resolve) => {
    texture.onload(() => {
      if (!texture.averagePixels) {
        texture.averagePixels = calculateAverageRGBChunks(texture, 1, 1)
      }
      const pixelsChange = targetChunkPixels.map((value, index) => {
        return targetChunkPixels[index] - texture.averagePixels[0][index]
      })
      const sprite = renderer.createSprite({
        size: { width, height },
        position,
        rotation: 0,
      })
      sprite.updateProperties({ colorsDelta: pixelsChange })
      renderer.bindSpriteTexture(sprite, texture)
      resolve()
    })
  })
}

// 按照块的数量批量绘制精灵
function paintSprites({ SUM_ROWS, SUM_COLS, averagePixels, texturePuzzles }) {
  const paintTasks = []
  for (let i = 0; i < SUM_ROWS; i++) {
    for (let j = 0; j < SUM_COLS; j++) {
      const index = i * SUM_COLS + j
      const pixels = averagePixels[index]
      const texture =
        texturePuzzles[Math.floor(Math.random() * texturePuzzles.length)]
      const width = renderer.stageSize.width / SUM_COLS
      const height = renderer.stageSize.height / SUM_ROWS
      const position = {
        x: j * width,
        y: renderer.stageSize.height - i * height,
        z: 1000,
      }
      paintTasks.push(
        paintSprite({
          targetChunkPixels: pixels,
          texture,
          width,
          height,
          position,
        }),
      )
    }
  }
  return Promise.all(paintTasks)
}

// 绘制图片
function paintImage(targetImage, puzzleImages) {
  renderer.clearSprites()

  // 目标 textureTarget
  const textureTarget = renderer.createTexture(targetImage)
  // 拼图 texturePuzzles
  const texturePuzzles = puzzleImages.map((imageUrl) =>
    renderer.createTexture(imageUrl),
  )

  textureTarget.onload(() => {
    const ratio = 1
    const SUM_COLS = Math.floor(100 * ratio)
    const SUM_ROWS = Math.floor(
      (100 * ratio * textureTarget.height) / textureTarget.width,
    )
    // 调整舞台大小
    adjustStageSizeWithTarget(textureTarget)
    const averagePixels = calculateAverageRGBChunks(
      textureTarget,
      SUM_COLS,
      SUM_ROWS,
    )

    console.log(`SUM_COLS:${SUM_COLS},SUM_ROWS:${SUM_ROWS}`, averagePixels)
    paintSprites({ SUM_ROWS, SUM_COLS, averagePixels, texturePuzzles }).then(
      () => {
        renderer.batchRender()
        updateCanvasSize(renderer.stageSize)
      },
    )
  })
}
