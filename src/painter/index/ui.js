export default function ({ renderer, paintImage }) {
  const targetImageContainer = document.getElementById('targetImageContainer')
  const puzzleImagesContainer = document.getElementById('puzzleImagesContainer')

  function createImage(src) {
    const image = new Image(100, 100)
    image.src = src
    return image
  }

  const inputEle = document.createElement('input')
  inputEle.setAttribute('type', 'file')
  inputEle.setAttribute('accept', '.svg,.jpg,.jpeg,.png')
  inputEle.setAttribute('multiple', false)

  let targetImage = null
  const puzzleImages = []

  function chooseFile({ multiple }) {
    inputEle.setAttribute('multiple', multiple)
    // PC 端使用原生文件选择器
    return new Promise((resolve) => {
      inputEle.addEventListener(
        'change',
        (e) => {
          console.log(`触发 change 事件`, e.target.files)
          resolve(e.target.files)
        },
        { once: true },
      )
      inputEle.click()
    })
  }

  function clearInputValue() {
    inputEle.value = ''
  }

  const exportImageBtn = document.getElementById('exportImage')
  exportImageBtn.addEventListener('click', () => {
    return renderer.exportStage()
  })

  const chooseTargetImageBtn = document.getElementById('chooseTargetImage')
  chooseTargetImageBtn.addEventListener('click', () => {
    chooseFile({ multiple: false }).then((files) => {
      targetImage = URL.createObjectURL(files[0])
      clearInputValue()
      if (targetImageContainer.childNodes.length) {
        targetImageContainer.childNodes[0].src = targetImage
      } else {
        targetImageContainer.prepend(createImage(targetImage))
      }
    })
  })

  const choosePuzzleImageBtn = document.getElementById('choosePuzzleImage')
  choosePuzzleImageBtn.addEventListener('click', () => {
    chooseFile({ multiple: true }).then((files) => {
      for (let i = 0; i < files.length; i++) {
        const imageUrl = URL.createObjectURL(files[i])
        puzzleImages.push(imageUrl)
        puzzleImagesContainer.prepend(createImage(imageUrl))
      }
      clearInputValue()
    })
  })

  const startRenderBtn = document.getElementById('startRender')
  startRenderBtn.addEventListener('click', () => {
    if (!targetImage) alert('请选择目标图片!')
    if (!puzzleImages.length) alert('请选择拼图图片!')
    paintImage(targetImage, puzzleImages)
  })
}

// 更新 canvas 渲染宽高
export function updateCanvasSize(stageSize) {
  const canvasEle = document.getElementById('webgl')
  const rect = canvasEle.getBoundingClientRect()
  if (window.innerHeight > window.innerWidth) {
    const newHeight = (stageSize.height / stageSize.width) * rect.width
    canvasEle.style.height = `${newHeight}px`
  } else {
    const newWidth = (stageSize.width / stageSize.height) * rect.height
    canvasEle.style.width = `${newWidth}px`
  }
}
