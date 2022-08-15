import Renderer from '../renderer/Renderer'
// 新建一个渲染器
const renderer = new Renderer()

// 设置渲染舞台的逻辑尺寸
renderer.setStageSize({ width: 1024, height: 1024, depth: 1024 })

// 新建纹理对象
const texture = renderer.createTexture('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy-ZMC5927eQb5ZrrpbiAQoweJykwYrrpDdCm0a88FCw&s')

/**
 * 创建精灵
 * 在2D渲染中,渲染一个矩形物体,只需要设置宽高、位置、旋转角度这三项
 **/ 
let z =  0
const createSprite = () => {
  const sprite = renderer.createSprite({
    size: { width: 300, height: 300 },
    position: {
      x: Math.random() * 1024,
      y: Math.random() * 1024,
      z: z++,
    },
    rotation: 0,
    texture
  })
  return sprite
}

// 调用 createSprite 创建精灵
const sprite = createSprite()

// 循环调用 batchRender 
setInterval(() => {
  createSprite()
  renderer.batchRender()
}, 300)
