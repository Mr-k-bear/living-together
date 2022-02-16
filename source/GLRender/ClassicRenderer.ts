import { ObjectID, ObjectData, ICommonParam } from "@Model/Renderer";
import { BasicRenderer } from "./BasicRenderer";
import { BasicsShader } from "./BasicShader";
import { Axis } from "./Axis";
import { BaseCube } from "./BasicCube";
import { GroupShader } from "./GroupShader";
import { BasicGroup } from "./BasicGroup";

interface IClassicRendererParams {}

class ClassicRenderer extends BasicRenderer<{}, IClassicRendererParams> {

    private basicShader: BasicsShader = undefined as any;
    private axisObject: Axis = undefined as any;
    private groupShader: GroupShader = undefined as any;

    /**
     * 是否完成缩放
     */
    private lastScale: number = 0;
    private readonly cubeRadius = 2**.5;
    private readonly farFogLine = 2.5;

    /**
     * 点存储池数组
     */
    private groupPool = new Map<ObjectID, BasicGroup>();

    /**
     * 立方体储池数组
     */
    private cubePool = new Map<ObjectID, BaseCube>();

    public onLoad(): void {
        
        // 自动调节分辨率
        this.autoResize();

        this.basicShader = new BasicsShader().bindRenderer(this);
        this.groupShader = new GroupShader().bindRenderer(this);
        this.axisObject = new Axis().bindRenderer(this);
        
        // 测试渲染器
        if (true) {
            let cubeObject = new BaseCube().bindRenderer(this);
            let basicGroup = new BasicGroup().bindRenderer(this);

            // 生成随机数据测试
            basicGroup.upLoadData(new Array(1000 * 3).fill(0).map(() => (Math.random() - .5) * 2));

            this.cubePool.set("1", cubeObject);
            this.groupPool.set("1", basicGroup);
        }

        this.canvas.on("mousemove", () => {

            // 相机旋转
            if (this.canvas.mouseDown)
            this.camera.ctrlInertia(this.canvas.mouseMotionX, this.canvas.mouseMotionY);
        });

        this.canvas.on("mousedown", () => {
            this.canvas.can.style.cursor = "grabbing"
        });

        this.canvas.on("mouseup", () => {
            this.canvas.can.style.cursor = "grab"
        });

        this.canvas.on("mousewheel", () => {
            this.camera.eyeInertia(this.canvas.wheelDelta);
        });
        
        // 运行
        this.run();

        // 测试数据传递
        // setInterval(() => {
        //     this.basicGroup.upLoadData(new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2));
        // }, 500);
    }

    loop(t: number): void {

        // 常规绘制窗口
        this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

        this.camera.dynamics(t);

        // 自动计算最佳雾参数
        let dist = this.camera.eyeDist;
        if (Math.abs(this.lastScale - dist) > this.camera.EL) {
            this.lastScale = dist;
            this.fogDensity[1] = dist - this.cubeRadius;
            this.fogDensity[2] = dist + this.cubeRadius + this.farFogLine;
        }

        this.camera.generateMat();
        
        this.cleanCanvas();

        // 绘制全部立方体
        this.cubePool.forEach((cube) => {
            if (cube.isDraw) cube.draw(this.basicShader);
            else cube.drawEmptyFrame ++;
        });

        // 绘制全部点
        this.groupPool.forEach((group) => {
            if (group.isDraw) group.draw(this.groupShader);
            else group.drawEmptyFrame ++;
        });

        // 右上角绘制坐标轴
        const position = 120;
        this.gl.viewport(
            this.canvas.width - position * this.camera.ratio + (this.camera.ratio - 1) * position / 2, 
            this.canvas.height - position, 
            position * this.camera.ratio, 
            position
        );
        this.axisObject.draw(this.basicShader);
    }

    clean(id?: ObjectID | ObjectID[]): this {
        throw new Error("Method not implemented.");
    }

    points(id: ObjectID, position: ObjectData, param?: ICommonParam): this {
        throw new Error("Method not implemented.");
    }

    cube(id: ObjectID, position: ObjectData, param?: ICommonParam): this {
        throw new Error("Method not implemented.");
    }
}

export default ClassicRenderer;
export { ClassicRenderer };