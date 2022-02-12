import { vec3, vec2, mat4 } from 'gl-matrix';
import { GLCanvas } from './GLCanvas';

/**
 * 摄像机
 */
class Camera{

    private canvas: GLCanvas;

    /**
     * 视点
     */
    public eye: vec3;

    /**
     * 目标
     */
    public target: vec3;

     /**
      * 镜头旋转方向
      */
    public up: vec3;

    /**
     * 视野大小
     */
    public range: number = Math.PI / 9;

    /**
     * 画布宽高比例
     */
    public ratio: number = 1.;

    /**
     * 进远平面距离
     */
    public nearFar: vec2;

    /**
     * 观察者矩阵
     */
    public viewMat: mat4;

    /**
     * 观察者矩阵
     */
    public projectionMat: mat4;

    /**
     * 变换矩阵
     */
    public transformMat: mat4;

    /**
     * 逆变换矩阵
     */
    public transformNMat: mat4;

    /**
     * 构造函数设置初始值
     */
    public constructor(canvas: GLCanvas) {

        this.canvas = canvas;

        // 设置全部参数的初始值
        this.eye = vec3.create();
        this.target = vec3.create();
        this.up = vec3.create();
        this.nearFar = vec2.create();
        this.viewMat = mat4.create();

        this.projectionMat = mat4.create();
        this.transformMat = mat4.create();
        this.transformNMat = mat4.create();

        

        // 设置视点初始值
        vec3.set(this.eye, 0., 0., 10.);

        // 设置向上方向
        vec3.set(this.up, 0., 1., 0.);

        // 设置进远平面
        vec2.set(this.nearFar, 0.001, 1000.);

        // 射线追踪临时变量
        this.tempRayP = vec3.create();
        this.tempRayO = vec3.create();
        this.tempRayPoint = vec3.create();
    }

    private tempRayPoint: vec3;
    private tempRayP: vec3;
    private tempRayO: vec3;

    /**
     * 生成变换需要的全部矩阵
     */
    public generateMat(){

        // 更新 ratio
        this.ratio = this.canvas.ratio;

        // 更新观察者矩阵
        mat4.lookAt(this.viewMat, this.eye, this.target, this.up);

        // 更新投影矩阵
        mat4.perspective(this.projectionMat,
            this.range, this.ratio, this.nearFar[0], this.nearFar[1]);

        // 更新变换矩阵
        mat4.multiply(this.transformMat, this.projectionMat, this.viewMat);

        // 计算逆矩阵
        mat4.invert(this.transformNMat, this.transformMat);
    }

    /**
     * X 轴旋转角度
     * [0 - 360)
     */
    public angleX:number = 90;

    /**
     * Y 轴旋转角度
     * [90 - -90]
     */
    public angleY:number = 0;

    /**
     * 视点距离
     */
    public get eyeDist(): number {
        return vec3.length(this.eye);
    }

    /**
     * 视点缩放
     */
    public eyeScale(scale: number): this {
        let dis = this.eyeDist;
        if ((dis + scale) < 0) scale = .1 - dis;
        vec3.set(this.eye,
            (this.eye[0] / dis) * scale + this.eye[0],
            (this.eye[1] / dis) * scale + this.eye[1],
            (this.eye[2] / dis) * scale + this.eye[2]
        );
        return this;
    }

    /**
     * 通过角度设置视点
     */
    public setEyeFromAngle(){

        // 平移至原点
        vec3.sub(this.eye, this.eye, this.target);

        // 计算视点距离
        let dis = this.eyeDist;

        // 计算方向角
        let anDir = vec3.create();

        // 设置水平旋转坐标
        let dx = Math.cos(this.angleX * Math.PI / 180);
        let dz = Math.sin(this.angleX * Math.PI / 180);

        // 计算垂直旋转坐标
        let dv = Math.cos(this.angleY * Math.PI / 180);
        let dy = Math.sin(this.angleY * Math.PI / 180);

        // 合成
        vec3.set(anDir,
            dx * dv * dis,
            dy * dis,
            dz * dv * dis
        );

        // 赋值
        vec3.copy(this.eye, anDir);

        // 平移回视点
        vec3.add(this.eye, this.eye, this.target);
    }

    /**
     * 控制灵敏度
     */
    public sensitivity:number = .5;

    /**
     * 摄像机控制函数
     */
    public ctrl(x:number, y:number) {

        this.angleX += x * this.sensitivity;
        this.angleY += y * this.sensitivity;

        if (this.angleX > 360) this.angleX = this.angleX - 360;
        if (this.angleX < 0) this.angleX = 360 + this.angleX;

        if (this.angleY > 90) this.angleY = 90;
        if (this.angleY < -90) this.angleY = -90;

        this.setEyeFromAngle();
    }

    /**
     * 射线追踪
     */
    public rayTrack(x: number, y: number): [vec3, vec3] {

        // 逆变换
        vec3.set(this.tempRayP, x, y, 1);
        vec3.transformMat4(this.tempRayP, this.tempRayP, this.transformNMat);

        vec3.set(this.tempRayO, x, y, 0);
        vec3.transformMat4(this.tempRayO, this.tempRayO, this.transformNMat);

        vec3.sub(this.tempRayP, this.tempRayP, this.tempRayO);
        vec3.normalize(this.tempRayP, this.tempRayP);

        return [this.tempRayO, this.tempRayP];
    }

    /**
     * 极限追踪距离
     */
    public EL:number = 1e-5;

    private scaleRay(D: number, d: number, o: vec3, p: vec3): vec3 {

        // 限制 d
        if (d < this.EL) d = this.EL;

        let len = D / d;

        this.tempRayPoint[0] = o[0] + p[0] * len;
        this.tempRayPoint[1] = o[1] + p[1] * len;
        this.tempRayPoint[2] = o[2] + p[2] * len;

        return this.tempRayPoint;
    }

    /**
     * 计算射线与 XY 平面焦点
     * @param o 射线原点
     * @param p 射线方向
     * @param k 交点距离
     */
    public intersectionLineXYPlant(o: vec3, p: vec3, k: number = 0): vec3 {

        let d = Math.abs(p[2] - k);
        let D = Math.abs(o[2] - k);

        return this.scaleRay(D, d, o, p);
    }

    /**
     * 计算射线与 XZ 平面焦点
     * @param o 射线原点
     * @param p 射线方向
     * @param k 交点距离
     */
    public intersectionLineXZPlant(o: vec3, p: vec3, k:number = 0): vec3 {

        let d = Math.abs(p[1] - k);
        let D = Math.abs(o[1] - k);

        return this.scaleRay(D, d, o, p);
    }

    /**
     * 计算射线与 YZ 平面焦点
     * @param o 射线原点
     * @param p 射线方向
     * @param k 交点距离
     */
    public intersectionLineYZPlant(o: vec3, p: vec3, k: number = 0): vec3 {

        let d = Math.abs(p[0] - k);
        let D = Math.abs(o[0] - k);

        return this.scaleRay(D, d, o, p);
    }
}

export default Camera;
export { Camera };