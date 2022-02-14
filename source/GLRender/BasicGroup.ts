import { GLContextObject } from "./GLContext";
import { GroupShader } from "./GroupShader";
import { ObjectData } from "@Model/Renderer";

class BasicGroup extends GLContextObject{

	private pointVertexBuffer: WebGLBuffer | null = null;
	private pointVecMaxCount: number = 100 * 3;
	private pointVecCount: number = 0;

    public onLoad() {

        // 创建缓冲区
        this.pointVertexBuffer = this.gl.createBuffer();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.pointVecMaxCount, this.gl.DYNAMIC_DRAW);
    }

	/**
	 * 向 GPU 上传数据
	 */
	public upLoadData(data: ObjectData) {

		// 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.DYNAMIC_DRAW);

		this.pointVecCount = data.length / 3;
	}

	/**
	 * 大小
	 */
	public size = 50;

    /**
     * 颜色
     */
    public color = [1, 1, 1];

    /**
     * 绘制立方体
     */
    public draw(shader: GroupShader){

        // 使用程序
        shader.use();

        // 绑定缓冲区
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.pointVertexBuffer);

        // 指定指针数据
        this.gl.vertexAttribPointer(
            shader.attribLocate("aPosition"),
            3, this.gl.FLOAT, false, 0, 0);

        // mvp参数传递
        shader.mvp(this.camera.transformMat);

        // 半径传递
        shader.radius(this.size);

        // 指定颜色
        shader.color(this.color);

        shader.fogColor(this.renderer.fogColor);
        shader.fogDensity(this.renderer.fogDensity);

        // 开始绘制
        this.gl.drawArrays(this.gl.POINTS, 0, this.pointVecCount);
    }
}

export default BasicGroup;
export { BasicGroup };