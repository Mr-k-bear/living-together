import { ObjectData } from "@Model/Renderer";
import { GLContext } from "./GLContext";
import { GLShader } from "./GLShader";

export { GroupShader }

interface IGroupShaderAttribute {
    aPosition: ObjectData
}

interface IGroupShaderUniform {
    uRadius: number,
    uShape: number,
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
            uniform int uShape;

            varying float vFogPower;
        
            void main(){

                float dist = distance(gl_PointCoord, vec2(0.5, 0.5));
                vec2 normalPos = (gl_PointCoord - vec2(0.5, 0.5)) * 2.;
                
                if ( uShape == 1 && abs(normalPos.x) < .6 && abs(normalPos.y) < .6) {
                    discard;
                }

                if ( uShape == 2 && abs(normalPos.x) > .3 && abs(normalPos.y) > .3) {
                    discard;
                }

                if ( uShape == 3 && abs(normalPos.y) > .3) {
                    discard;
                }

                if ( uShape == 4 &&
                    (abs(normalPos.x) < .4 || abs(normalPos.y) < .4) &&
                    (abs(normalPos.x) > .4 || abs(normalPos.y) > .4)
                ) {
                    discard;
                }

                if ( uShape == 5 &&
                    (abs(normalPos.x) < .75 && abs(normalPos.y) < .75) &&
                    (abs(normalPos.x) < .28 || abs(normalPos.y) < .28) &&
                    (abs(normalPos.x) > .28 || abs(normalPos.y) > .28)
                ) {
                    discard;
                }

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

    /**
     * 形状
     */
    public shape(shape: number) {
        this.gl.uniform1i(
            this.uniformLocate("uShape"), shape
        )
    }
}