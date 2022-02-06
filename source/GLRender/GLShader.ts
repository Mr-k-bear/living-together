import { EventType } from "@Common/Emitter";
import { GLContextObject } from "./GLContext"

/**
 * Shader类
 */
abstract class GLShader<
	E extends Record<EventType, any> = {}
> extends GLContextObject<E> {

    /**
     * 顶点着色器源码
     */
    protected vertexShaderSource:string = "";

    /**
     * 片段着色器源代码
     */
    protected fragmentShaderSource:string = "";

    /**
     * 顶点着色器
     */
    protected vertexShader: WebGLShader | null = null;

    /**
     * 片段着色器
     */
    protected fragmentShader: WebGLShader | null = null;

    /**
     * 程序
     */
    protected program: WebGLProgram | null = null;

    /**
     * 设置源代码
     */
    protected setSource(vert:string, frag:string){

        this.vertexShaderSource = vert.replace(/^\s+/, "");

        this.fragmentShaderSource = frag.replace(/^\s+/, "");

        return this;
    }

    /**
     * 编译
     */
    protected compile() {

        // 创建程序
        this.program = this.gl.createProgram();

        // 创建顶点着色器
        this.vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER);

        // 创建片段着色器
        this.fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER);

        // 绑定源代码
        this.gl.shaderSource(!this.vertexShader, this.vertexShaderSource);
        this.gl.shaderSource(!this.fragmentShader, this.fragmentShaderSource);

        // 编译
        this.gl.compileShader(!this.vertexShader);
        this.gl.compileShader(!this.fragmentShader);

        // 检测编译错误
        if(!this.gl.getShaderParameter(!this.vertexShader, this.gl.COMPILE_STATUS)){
            console.error("vertex:\r\n" + this.gl.getShaderInfoLog(!this.vertexShader));
        }

        if(!this.gl.getShaderParameter(!this.fragmentShader, this.gl.COMPILE_STATUS)){
            console.error("fragment:\r\n" + this.gl.getShaderInfoLog(!this.fragmentShader));
        }

        // 附加到程序
        this.gl.attachShader(!this.program, !this.vertexShader);
        this.gl.attachShader(!this.program, !this.fragmentShader);

        // 连接程序
        this.gl.linkProgram(!this.program);

        // 检测链接错误
        if(!this.gl.getProgramParameter(!this.program, this.gl.LINK_STATUS)){
            console.error("link:\r\n" + this.gl.getProgramInfoLog(!this.program));
        }

        return this;
    }

    /**
     * attrib 位置缓存
     */
    private attribLocationCache: Map<string, GLint> = new Map();

    /**
     * attrib 位置缓存
     */
    private uniformLocationCache: Map<string, WebGLUniformLocation> = new Map();

    /**
     * 获取 attribLocation
     */
    public attribLocate(attr: string){

        // 获取缓存
        let cache = this.attribLocationCache.get(attr);

        // 缓存搜索
        if (cache === undefined || cache <= -1){

            cache = this.gl.getAttribLocation(!this.program, attr);

            if (cache === undefined || cache <= -1) {
                console.error("Attrib: can not get locate of " + attr);
            } else {
                this.gl.enableVertexAttribArray(cache);
            }
            
            this.attribLocationCache.set(attr, cache);

            return cache;
        }

        // 搜索到返回
        else {
            this.gl.enableVertexAttribArray(cache);
            return cache
        }

    }

    /**
     * 获取 attribLocation
     */
    public uniformLocate(uni: string) {

        // 获取缓存
        let cache: WebGLUniformLocation | null = this.uniformLocationCache.get(uni) as any;
		if (cache === undefined) cache = null;

        // 缓存搜索
        if (!cache) {

            cache = this.gl.getUniformLocation(!this.program, uni);
            if (!cache) console.error("Uniform: can not get locate of " + uni);

            this.uniformLocationCache.set(uni, cache as any);

            return cache;
        }

        // 搜索到返回
        else return cache;
    }

    /**
     * 使用程序
     */
    public use(){
        this.gl.useProgram(this.program);
        return this;
    }
}

export default GLShader;
export { GLShader };