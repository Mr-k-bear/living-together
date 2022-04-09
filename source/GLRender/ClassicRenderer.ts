import { ObjectData } from "@Model/Renderer";
import { ObjectID } from "@Model/Model";
import { IParameterValue, getDefaultValue } from "@Model/Parameter";
import { BasicRenderer } from "./BasicRenderer";
import { BasicsShader } from "./BasicShader";
import { Axis } from "./Axis";
import { BasicCube } from "./BasicCube";
import { GroupShader } from "./GroupShader";
import { BasicGroup } from "./BasicGroup";
import { DisplayObject } from "./DisplayObject";

enum MouseMod {
    Drag = 1,
    click = 2
}

type IClassicRendererParameter = {
	renderer: {};
	points: {
        color: "color",
        size: "number"
    };
	cube: {
        color: "color"
    };
}

class ClassicRenderer extends BasicRenderer<IClassicRendererParameter> {

    public override rendererParameterOption = {};
	public override pointsParameterOption = {
        color: { type: "color", name: "", defaultValue: [0, 0, 0] },
        size: { type: "number", name: "Common.Attr.Key.Size", defaultValue: 60, numberStep: 10, numberMin: 0 }
    };
	public override cubeParameterOption = {
        color: { type: "color", name: "", defaultValue: [0, 0, 0] },
    };

    private basicShader: BasicsShader = undefined as any;
    private axisObject: Axis = undefined as any;
    private groupShader: GroupShader = undefined as any;

    /**
     * 是否完成缩放
     */
    private lastScale: number = 0;
    private readonly cubeRadius = 2**.5;
    private readonly farFogLine = 2.2;

    /**
     * 对象储池数组
     */
    private objectPool = new Map<ObjectID, DisplayObject>();

    public mouseMod: MouseMod = MouseMod.Drag;

    public setMouseIcon() {
        if (this.mouseMod === MouseMod.Drag) {
            this.canvas.can.style.cursor = "grab";
        }
        if (this.mouseMod === MouseMod.click) {
            this.canvas.can.style.cursor = "default";
        }
    }

    public onLoad(): this {

        this.rendererParameter = getDefaultValue(this.rendererParameterOption);
        
        // 自动调节分辨率
        this.autoResize();

        this.basicShader = new BasicsShader().bindRenderer(this);
        this.groupShader = new GroupShader().bindRenderer(this);
        this.axisObject = new Axis().bindRenderer(this).bindShader(this.basicShader);

        this.canvas.on("mousemove", () => {
            if (this.mouseMod === MouseMod.Drag) {
                // 相机旋转
                if (this.canvas.mouseDown)
                this.camera.ctrlInertia(this.canvas.mouseMotionX, this.canvas.mouseMotionY);
            }
        });

        this.canvas.on("mousedown", () => {
            if (this.mouseMod === MouseMod.Drag) {
                this.canvas.can.style.cursor = "grabbing"
            } 
        });

        this.canvas.on("mouseup", () => {
            if (this.mouseMod === MouseMod.Drag) {
                this.canvas.can.style.cursor = "grab"
            }
        });

        this.canvas.on("mousewheel", () => {
            if (this.mouseMod === MouseMod.Drag) {
                this.camera.eyeInertia(this.canvas.wheelDelta);
            } 
        });
        
        // 运行
        this.run();

        this.setMouseIcon();

        // 测试数据传递
        // setInterval(() => {
        //     this.basicGroup.upLoadData(new Array(100 * 3).fill(0).map(() => (Math.random() - .5) * 2));
        // }, 500);

        return this;
    }

    loop(t: number): void {

        this.emit("loop", t);

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

        // 绘制全部物体
        // 对象清理实现自动内存释放
        let cleanArray: undefined | Set<ObjectID>;
        this.objectPool.forEach((object, key) => {
            if (object.drawEmptyFrame > this.maxDrawEmptyFrame) {

                // 加入清除列表
                if (!cleanArray) cleanArray = new Set<string>();
                cleanArray.add(key);

                // 释放显存
                object.clean();
            }
        });

        if (cleanArray) {
            cleanArray.forEach((key) => {
                this.objectPool.delete(key);
                console.log(`Renderer: Automatically clear objects ${key}`);
            });
        }

        // 遍历绘制
        this.objectPool.forEach((object) => {
            if (object.isDraw) {
                object.draw();
                object.drawEmptyFrame = 0;
            }
            else object.drawEmptyFrame ++;
        });

        // 右上角绘制坐标轴
        const position = 120;
        this.gl.viewport(
            this.canvas.width - position * this.camera.ratio + (this.camera.ratio - 1) * position / 2, 
            this.canvas.height - position, 
            position * this.camera.ratio, 
            position
        );
        this.axisObject.draw();
    }

    /**
     * 最大不活动帧数
     */
    private maxDrawEmptyFrame = 5000;

    clean(id?: ObjectID | ObjectID[]): this {
        if (id) {
            if (Array.isArray(id)) {
                id.forEach((key) => {
                    let object = this.objectPool.get(key);
                    if (object) object.isDraw = false;
                });
            } else {
                let object = this.objectPool.get(id);
                if (object) object.isDraw = false;
            }
        } else {
            this.objectPool.forEach((object) => {
                object.isDraw = false;
            });
        }
        return this;
    }

    points(
        id: ObjectID, position?: ObjectData,
        param?: Readonly<IParameterValue<IClassicRendererParameter["points"]>>
    ): this {
        let object = this.objectPool.get(id);
        let group: BasicGroup;
        if (object) {
            if (BasicGroup.isGroup(object)) {
                group = object;

                // 数据上传
                if (position) {
                    object.upLoadData(position);
                }
            } else {
                throw new Error("Renderer: Use duplicate ObjectID when drawing different types of objects");
            }
        } else {
            group = new BasicGroup().bindRenderer(this).bindShader(this.groupShader);
            
            // 数据上传
            group.upLoadData(position ?? []);

            this.objectPool.set(id, group);
            console.log(`Renderer: Create new group object with id ${id}`);
        }

        // 开启绘制
        group.isDraw = true;

        // 参数传递
        if (param) {

            // 颜色数据
            if (param.color) {
                group.color[0] = param.color[0] ?? group.color[0]
                group.color[1] = param.color[1] ?? group.color[1]
                group.color[2] = param.color[2] ?? group.color[2]
            }

            // 半径数据
            if (param.size) {
                group.size = param.size;
            }
        }

        return this;
    }

    cube(
        id: ObjectID, position?: ObjectData, radius?: ObjectData,
        param?: Readonly<IParameterValue<IClassicRendererParameter["cube"]>>
    ): this {
        let object = this.objectPool.get(id);
        let cube: BasicCube;
        if (object) {
            if (BasicCube.isCube(object)) {
                cube = object;

                // 坐标数据上传
                if (position) {
                    cube.position[0] = position[0] ?? cube.position[0];
                    cube.position[1] = position[1] ?? cube.position[1];
                    cube.position[2] = position[2] ?? cube.position[2];
                }

                if (radius) {
                    cube.r[0] = radius[0] ?? cube.r[0];
                    cube.r[1] = radius[1] ?? cube.r[1];
                    cube.r[2] = radius[2] ?? cube.r[2];
                }

            } else {
                throw new Error("Renderer: Use duplicate ObjectID when drawing different types of objects");
            }
        } else {
            cube = new BasicCube().bindRenderer(this).bindShader(this.basicShader);
            
            // 数据上传
            if (position) {
                cube.position[0] = position[0] ?? cube.position[0];
                cube.position[1] = position[1] ?? cube.position[1];
                cube.position[2] = position[2] ?? cube.position[2];
            }

            if (radius) {
                cube.r[0] = radius[0] ?? cube.r[0];
                cube.r[1] = radius[1] ?? cube.r[1];
                cube.r[2] = radius[2] ?? cube.r[2];
            }

            this.objectPool.set(id, cube);
            console.log(`Renderer: Create new cube object with id ${id}`);
        }

        // 开启绘制
        cube.isDraw = true;

        // 参数传递
        if (param && param.color) {

            cube.color[0] = param.color[0] ?? cube.color[0];
            cube.color[1] = param.color[1] ?? cube.color[1];
            cube.color[2] = param.color[2] ?? cube.color[2];
        }

        return this;
    }
}

export default ClassicRenderer;
export { ClassicRenderer, MouseMod };