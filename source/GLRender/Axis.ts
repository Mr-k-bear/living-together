import { BasicsShader } from "./BasicShader";
import { GLContextObject } from "./GLContext";

class Axis extends GLContextObject{

    /**
     * 坐标轴数据
     */
    static AXIS_VER_DATA = new Float32Array([
        0,0,0,  1,0,0,
        0,0,0,  0,1,0,
        0,0,0,  0,0,1
    ]);

    private axisVertexBuffer: WebGLBuffer | null = null;

    public onLoad() {

        // 创建缓冲区
        this.axisVertexBuffer = this.gl.createBuffer();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.axisVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Axis.AXIS_VER_DATA, this.gl.STATIC_DRAW);
    }

    /**
     * 绘制半径
     */
    public r:number = 1;

    public pos:number[] = [0, 0, 0];

    /**
     * 绘制坐标轴
     */
    public draw(shader: BasicsShader){

        // 使用程序
        shader.use();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.axisVertexBuffer);

        // 指定指针数据
        this.gl.vertexAttribPointer(
            shader.attribLocate("aPosition"),
            3, this.gl.FLOAT, false, 0, 0);

        // mvp参数传递
        shader.mvp(this.camera.transformMat);

        // 半径传递
        shader.radius([this.r, this.r, this.r]);
        shader.position(this.pos);

        // 绘制 X 轴
        shader.color([1, 0, 0]);
        this.gl.drawArrays(this.gl.LINES, 0, 2);

        // 绘制 Y 轴
        shader.color([0, 1, 0]);
        this.gl.drawArrays(this.gl.LINES, 2, 2);

        // 绘制 Z 轴
        shader.color([0, 0, 1]);
        this.gl.drawArrays(this.gl.LINES, 4, 2);
    }
}

export default Axis;
export { Axis };