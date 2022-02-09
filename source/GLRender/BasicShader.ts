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
    uColor: ObjectData
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

            void main(){
                gl_Position = uMvp * vec4(aPosition * uRadius + uPosition, 1.);
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
}