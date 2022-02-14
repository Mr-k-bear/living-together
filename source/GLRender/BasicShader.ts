import { ObjectData } from "@Model/Renderer";
import { GLContext } from "./GLContext";
import { GLShader } from "./GLShader";

export { BasicsShader }

interface IBasicsShaderAttribute {
    aPosition: ObjectData
}

interface IBasicsShaderUniform {
    uRadius: ObjectData,
    uMvp: ObjectData,
    uPosition: ObjectData,
    uColor: ObjectData,
    uFogColor: ObjectData,
    uFogDensity: ObjectData
}

/**
 * 基础绘制 Shader
 * @class BasicsShader
 */
class BasicsShader extends GLShader<IBasicsShaderAttribute, IBasicsShaderUniform>{

    public onLoad() {

        // 顶点着色
        const vertex = `
            attribute vec3 aPosition;
            
            uniform vec3 uRadius;
            uniform mat4 uMvp;
            uniform vec3 uPosition;

            varying vec3 vPosition;

            void main(){
                gl_Position = uMvp * vec4(aPosition * uRadius + uPosition, 1.);
                vPosition = gl_Position.xyz;
            }
        `;

        // 片段着色
        const fragment = `
            precision lowp float;
            
            uniform vec3 uFogColor;
            uniform vec3 uColor;
            uniform vec3 uFogDensity;

            varying vec3 vPosition;
        
            void main(){
                float disClamp = clamp(vPosition.z, uFogDensity.y, uFogDensity.z);
                float disNormal = (disClamp - uFogDensity.y) / (uFogDensity.z - uFogDensity.y);
                float vFogPower = clamp(disNormal * uFogDensity.x, 0., 1.);
                
                gl_FragColor = vec4(mix(uColor, uFogColor, vFogPower), 1.);
            }
        `;

        // 保存代码
        this.setSource(vertex, fragment);

        // 编译
        this.compile();
    }

    /**
     * 传递半径数据
     */
    public radius(r: ObjectData){
        this.gl.uniform3fv(
            this.uniformLocate("uRadius"), r
        );
        return this;
    }

    /**
     * 坐标
     */
    public position(position: ObjectData){
        this.gl.uniform3fv(
            this.uniformLocate("uPosition"), position
        );
        return this;
    }

    /**
     * 传递半径数据
     */
    public mvp(mat: ObjectData, transpose: boolean = false){
        this.gl.uniformMatrix4fv(
            this.uniformLocate("uMvp"), transpose, mat
        );
        return this;
    }

    /**
     * 传递半径数据
     */
    public color(rgb: ObjectData){
        this.gl.uniform3fv(
            this.uniformLocate("uColor"), rgb
        );
    }

    /**
     * 雾颜色
     */
    public fogColor(rgb: ObjectData) {
        this.gl.uniform3fv(
            this.uniformLocate("uFogColor"), rgb
        )
    }

    /**
     * 雾强度
     */
    public fogDensity(rgb: ObjectData) {
        this.gl.uniform3fv(
            this.uniformLocate("uFogDensity"), rgb
        )
    }
}