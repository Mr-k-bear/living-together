import { GLContextObject } from "./GLContext";
import { BasicsShader } from "./BasicShader";

class BaseCube extends GLContextObject{

    /**
     * 立方体数据
     */
    static CUBE_VER_DATA = new Float32Array([
        1,1,1,   -1,1,1,   -1,1,-1,    1,1,-1,
        1,-1,1,  -1,-1,1,  -1,-1,-1,   1,-1,-1
    ]);

    /**
     * 立方体线段绘制索引
     */
    static CUBE_ELE_DATA = new Uint16Array([
        0,1,  1,2,  2,3,  3,0,
        4,5,  5,6,  6,7,  7,4,
        0,4,  1,5,  2,6,  3,7
    ]);

    public onLoad() {

        // 创建缓冲区
        this.cubeVertexBuffer = this.gl.createBuffer();
        this.cubeElementBuffer = this.gl.createBuffer();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, BaseCube.CUBE_VER_DATA, this.gl.STATIC_DRAW);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeElementBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, BaseCube.CUBE_ELE_DATA, this.gl.STATIC_DRAW);
    }
    
    private cubeVertexBuffer: WebGLBuffer | null = null;
    private cubeElementBuffer: WebGLBuffer | null = null;

    /**
     * 绘制半径
     */
    private r:[number,number,number] = [1, 1, 1];

    /**
     * 坐标
     */
    public position = [0, 0, 0];

    /**
     * 颜色
     */
    public color = [1, 1, 1];

    /**
     * 绘制立方体
     */
    public draw(shader: BasicsShader){

        // 使用程序
        shader.use();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.cubeVertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.cubeElementBuffer);

        // 指定指针数据
        this.gl.vertexAttribPointer(
            shader.attribLocate("aPosition"),
            3, this.gl.FLOAT, false, 0, 0);

        // mvp参数传递
        shader.mvp(this.camera.transformMat);

        // 半径传递
        shader.radius(this.r);
        shader.position(this.position);

        // 指定颜色
        shader.color(this.color);

        shader.fogColor(this.renderer.fogColor);
        shader.fogDensity(this.renderer.fogDensity);

        // 开始绘制
        this.gl.drawElements(this.gl.LINES, 24, this.gl.UNSIGNED_SHORT, 0);
    }
}

export default BaseCube;
export { BaseCube };