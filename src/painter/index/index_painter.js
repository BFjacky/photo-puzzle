import Renderer from '../../renderer/renderer/Renderer'
import calculateAverageRGBChunks from './averageRgb'

const renderer = new Renderer()

// 下载图片
window.exportStage = function () {
  return renderer.exportStage()
}

const inputEle = document.createElement('input')
inputEle.setAttribute('type', 'file')
inputEle.setAttribute('accept', '.svg,.jpg,.jpeg,.png')
inputEle.setAttribute('multiple', false)

function chooseFile() {
  // PC 端使用原生文件选择器
  return new Promise((resolve) => {
    inputEle.addEventListener(
      'change',
      (e) => {
        resolve(e.target.files)
      },
      { once: true },
    )
    inputEle.click()
  })
}

// 导出为文件 btn
const exportBtn = document.createElement('div')

exportBtn.style.cssText = `
  width: 100px; 
  height: 50px; 
  border-radius: 25px;
  color: #0170fe;;
  border: 1px solid #0170fe;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
`

exportBtn.innerText = '导出文件'

exportBtn.addEventListener('click', () => {
  return renderer.exportStage()
})

document.body.prepend(exportBtn)

// 选择图片 btn
const startBtn = document.createElement('div')

startBtn.style.cssText = `
  width: 100px; 
  height: 50px; 
  border-radius: 25px;
  color: #fff;
  background: #0170fe;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor: pointer;
`

startBtn.innerText = '选择图片'

startBtn.addEventListener('click', () => {
  chooseFile().then((files) => {
    const file = files[0]
    const imageUrl = URL.createObjectURL(file)
    paintImage(imageUrl)
  })
})

document.body.prepend(startBtn)


// 绘制图片
function paintImage(
  imageUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy-ZMC5927eQb5ZrrpbiAQoweJykwYrrpDdCm0a88FCw&s',
) {
  // 模板 texture
  const textureTemplate = renderer.createTexture(imageUrl)
  // 拼图 texturePuzzles
  const texturePuzzles = [renderer.createTexture(imageUrl)]

  textureTemplate.onload(() => {
    const ratio = 1
    const SUM_COLS = Math.floor(100 * ratio)
    const SUM_ROWS = Math.floor(
      (100 * ratio * textureTemplate.height) / textureTemplate.width,
    )
    // 根据 textureTemplate 设置 webgl 绘制像素
    if (textureTemplate.height > textureTemplate.width) {
      renderer.setStageSize({
        height: renderer.stageSize.height,
        width: Math.floor(
          (renderer.stageSize.width * textureTemplate.width) /
            textureTemplate.height,
        ),
        depth: 1000,
      })
    } else {
      renderer.setStageSize({
        width: renderer.stageSize.width,
        height: Math.floor(
          (renderer.stageSize.height * textureTemplate.height) /
            textureTemplate.width,
        ),
        depth: 1000,
      })
    }

    const averagePixels = calculateAverageRGBChunks(
      textureTemplate,
      SUM_COLS,
      SUM_ROWS,
    )

    console.log(`SUM_COLS:${SUM_COLS},SUM_ROWS:${SUM_ROWS}`, averagePixels)

    for (let i = 0; i < SUM_ROWS; i++) {
      for (let j = 0; j < SUM_COLS; j++) {
        const index = i * SUM_COLS + j
        const pixels = averagePixels[index]
        const texture =
          texturePuzzles[Math.floor(Math.random() * texturePuzzles.length)]
        texture.onload(() => {
          // const singleChunkWidth = textureTemplate.imageHtmlElement.width / SUM_COLS
          // const singleChunkHeight = textureTemplate.imageHtmlElement.height / SUM_ROWS
          // const ratioForWebglStage = renderer.stageSize.height / Math.max(singleChunkHeight,singleChunkWidth)
          if (!texture.averagePixels) {
            texture.averagePixels = calculateAverageRGBChunks(texture, 1, 1)
          }
          const pixelsChange = pixels.map((value, index) => {
            return pixels[index] - texture.averagePixels[0][index]
          })
          const width = renderer.stageSize.width / SUM_COLS
          const height = renderer.stageSize.height / SUM_ROWS
          const position = {
            x: j * width,
            y: renderer.stageSize.height - i * height,
            z: 1000,
          }
          const sprite = renderer.createSprite({
            size: { width, height },
            position,
            rotation: 0,
          })
          sprite.updateProperties({ colorsDelta: pixelsChange })
          renderer.bindSpriteTexture(sprite, texture)
        })
      }
    }

  })
}


setInterval(() => {
  renderer.batchRender()
}, 2000);