precision highp float;
varying vec4 v_color;
varying highp vec2 vTextureCoord;
varying vec4 color_apos;
varying float vTextureId;
varying vec4 vColorDelta;
uniform sampler2D uSamplers[<<<uSamplerLength>>>];
// debug color
varying vec4 debug_color;

void main(){
    vec4 textureColor;
    <<<gl_FragColor>>>
    gl_FragColor = textureColor+vColorDelta;
}