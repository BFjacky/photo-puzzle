import Renderer from '../renderer/Renderer'
import images from './images'

const renderer = new Renderer()

renderer.setStageSize({ width: 1024, height: 1024, depth: 1024 })

// 新建 texture
const textures = images.map((image) => {
  return renderer.createTexture(image, 0.1)
})

const createSprite = ({ z }) => {
  for (let i = 0; i < 1; i++) {
    let rotation = 0
    const sprite = renderer.createSprite({
      size: { width: 100, height: 100 },
      position: {
        x: Math.random() * 1024,
        y: Math.random() * 1024,
        z,
      },
      rotation,
    })
    const randomTexture = textures[i]
    renderer.bindSpriteTexture(sprite, randomTexture)
    setInterval(() => {
      sprite.updateProperties({ rotation: rotation++ })
    }, 1000 / 60)
  }
}

const createCubeSprite = () => {
  for (let i = 0; i < 1; i++) {
    const sprite = renderer.createCubeSprite({
      size: { width: 400, height: 400, depth: 400 }, //
      position: {
        x: 0.5 * 1024,
        y: 0.5 * 1024,
        z: 0,
      },
      rotation: {
        fromX: 0,
        fromY: 0,
        fromZ: 0,
      },
    })
    const randomT1 = textures[0]
    const randomT2 = textures[1]
    const randomT3 = textures[2]
    const randomT4 = textures[3]
    const randomT5 = textures[4]
    const randomT6 = textures[5]

    renderer.bindSpriteTextures(sprite, [
      randomT1,
      randomT2,
      randomT3,
      randomT4,
      randomT5,
      randomT6,
    ])

    const rotationXSpeed = 0.1 * 5
    const rotationYSpeed = 0 * 5
    const rotationZSpeed = 0 * 5

    setInterval(() => {
      renderer.updatePerspective({
        near: renderer.matrixSystem.perspective.near,
        fovy: renderer.matrixSystem.perspective.fovy,
      })
      sprite.updateProperties({
        position: {
          x: sprite.position.x + 0,
          y: sprite.position.y + 0,
          z: sprite.position.z + 0,
        },
        rotation: {
          fromX: sprite.rotation.fromX + rotationXSpeed,
          fromY: sprite.rotation.fromY + rotationYSpeed,
          fromZ: sprite.rotation.fromZ + rotationZSpeed,
        },
      })
    }, 30)
  }
  renderer.batchRender()
}

window.createCubeSprite = createCubeSprite
window.createSprite = createSprite

window.createSprite({z:10})
const camera = {
  eye: vec3.fromValues(0, 0, 1),
  center: vec3.fromValues(0, 0, 0),
  up: vec3.fromValues(0, 1, 0),
}

setInterval(() => {
  camera.eye[0]+=0.002
  // // camera.center[0]+=0.01
  // camera.up[0]+=0.002

  renderer.updateCamera(camera)
  renderer.batchRender()
}, 30)

// setInterval(() => {
//   renderer.profiler.start('render_combine', {
//     interval: 30,
//     extraText: `渲染数量${renderer._sprites.length}`,
//   })
//   createSprite({ z: 1 })
//   renderer.profiler.end('render_combine')
// }, 1000)
