// 定义一个属性 apos
attribute vec3 apos;
attribute vec4 a_color;
// 纹理
attribute vec2 aTextureCoord;//纹理坐标
attribute float aTextureId;//纹理id
attribute vec4 a_color_delta;// 顶点颜色偏移

varying vec4 vColorDelta;
varying vec4 v_color;
varying float vTextureId;
varying highp vec2 vTextureCoord;//插值后纹理坐标
varying vec4 debug_color;

// 矩阵
uniform mat4 modelMatrix3D;// 三维模型矩阵
uniform mat4 projectMatrix3D;// 三维视图矩阵

void main(){
    //顶点位置，位于坐标原点
    vec4 temp =modelMatrix3D * vec4(apos.x,apos.y,apos.z,1.);// vec4(apos.x / 500., apos.y / 500., 1.0 , 1.0);
    //给内置变量gl_PointSize赋值像素大小
    gl_Position = vec4(temp.xyz,1.);
    gl_PointSize=20.;
    // 纹理坐标
    vTextureCoord=aTextureCoord;
    // 顶点颜色
    v_color=vec4(a_color.r/255.,a_color.g/255.,a_color.b/255.,a_color.a/255.);
    vTextureId=aTextureId;
    vColorDelta=vec4(a_color_delta.r/255.,a_color_delta.g/255.,a_color_delta.b/255.,a_color_delta.a/255.);
}