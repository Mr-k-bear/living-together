import { ObjectData } from "@Model/Renderer";
import { GLContext } from "./GLContext";
import { GLShader } from "./GLShader";

export { GroupShader }

interface IGroupShaderAttribute {
    aPosition: ObjectData
}

interface IGroupShaderUniform {
    uRadius: number,
    uMvp: ObjectData,
    uColor: ObjectData,
    uFogColor: ObjectData,
    uFogDensity: ObjectData
}

/**
 * 基础绘制 Shader
 * @class BasicsShader
 */
class GroupShader extends GLShader<IGroupShaderAttribute, IGroupShaderUniform>{

    public onLoad() {

        // 顶点着色
        const vertex = `
            attribute vec3 aPosition;
            
            uniform float uRadius;
            uniform mat4 uMvp;
            uniform vec3 uFogDensity;

            varying float vFogPower; 

            void main(){
                gl_Position = uMvp * vec4(aPosition, 1.);
				gl_PointSize = uRadius / gl_Position.z;

                float disClamp = clamp(gl_Position.z, uFogDensity.y, uFogDensity.z);
                float disNormal = (disClamp - uFogDensity.y) / (uFogDensity.z - uFogDensity.y);
                vFogPower = clamp(disNormal * uFogDensity.x, 0., 1.);
            }
        `;

        // 片段着色
        const fragment = `
            precision lowp float;
            
            uniform vec3 uColor;
            uniform vec3 uFogColor;

            varying float vFogPower;
        
            void main(){
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
    public radius(r: number){
        this.gl.uniform1f(
            this.uniformLocate("uRadius"), r
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