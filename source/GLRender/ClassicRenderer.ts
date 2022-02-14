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
    private cubeObject: BaseCube = undefined as any;
    private groupShader: GroupShader = undefined as any;
    private basicGroup: BasicGroup = undefined as any;

    public onLoad(): void {
        
        // 自动调节分辨率
        this.autoResize();

        this.basicShader = new BasicsShader().bindRenderer(this);
        this.axisObject = new Axis().bindRenderer(this);
        this.cubeObject = new BaseCube().bindRenderer(this);
        this.groupShader = new GroupShader().bindRenderer(this);
        this.basicGroup = new BasicGroup().bindRenderer(this);

        // 生成随机数据测试
        this.basicGroup.upLoadData(new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2));

        this.canvas.on("mousemove", () => {

            // 相机旋转
            if (this.canvas.mouseDown)
            this.camera.ctrl(this.canvas.mouseMotionX, this.canvas.mouseMotionY);

        });

        this.canvas.on("mousedown", () => {
            this.canvas.can.style.cursor = "grabbing"
        });

        this.canvas.on("mouseup", () => {
            this.canvas.can.style.cursor = "grab"
        });

        const cubeRadius = 2**.5;
        this.fogDensity = [
            this.fogDensity[0], this.camera.eye[2] - cubeRadius, 
            this.camera.eye[2] + cubeRadius + 4
        ];

        this.canvas.on("mousewheel", () => {
            this.camera.eyeScale(this.canvas.wheelDelta / 100);
            let dist = this.camera.eyeDist;
            this.fogDensity = [
                this.fogDensity[0], dist - cubeRadius, 
                dist + cubeRadius + 4
            ];
        });
        
        // 运行
        this.run();
    }

    loop(t: number): void {
        this.cleanCanvas();
        this.camera.generateMat();
        this.axisObject.draw(this.basicShader);
        this.cubeObject.draw(this.basicShader);
        this.basicGroup.draw(this.groupShader);
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