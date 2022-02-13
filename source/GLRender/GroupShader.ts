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
    uColor: ObjectData
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

            void main(){
                gl_Position = uMvp * vec4(aPosition, 1.);
				gl_PointSize = uRadius / gl_Position.z;
            }
        `;

        // 片段着色
        const fragment = `
            precision lowp float;
            
            uniform vec3 uColor;
        
            void main(){
                gl_FragColor = vec4(uColor, 1.);
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
}