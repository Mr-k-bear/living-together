const PATH = require("path");
const FS = require("fs");
const MINIMIST = require("minimist");
const READLINE = require("readline-sync");

const ARGS = MINIMIST(process.argv.slice(2), {
    alias: {i: ["input", "save"], o: ["output", "obj"]}
});

// 获取路径
const inputFilePath = PATH.resolve(ARGS.i ?? "./save.ltss");
const outputFilePath = PATH.resolve(ARGS.o ?? "./output.obj");

// 读取文件
const fileString = FS.readFileSync(inputFilePath);
console.log("文件读取成功...\r\n");

/**
 * 引入所需类型
 * @typedef {import("../source/Model/Archive").IArchiveObject} IArchiveObject
 * @typedef {import("../source/Model/Clip").IArchiveClip} IArchiveClip
 */

/**
 * 解析文件
 * @type {IArchiveObject}
 */
const archive = JSON.parse(fileString);
console.log("文件解析成功...\r\n");

// 打印全部的剪辑列表
if (archive.clipPool.length > 0) {
    console.log("这个存档中存在以下剪辑:");
}
archive.clipPool.map((item, index) => {    
    console.log(" \033[44;30m" + (index + 1) + "\033[40;32m " + item.name + " [" + item.id + "]\033[0m");
});

/**
 * 选择剪辑
 * @type {IArchiveClip}
 */
let clip;
if (archive.clipPool.length <= 0) {
    console.log("存档中没有剪辑, 退出程序...\r\n");
    process.exit();
} else if (archive.clipPool.length === 1) {
    console.log("\r\n存档中只有一个剪辑, 自动选择...\r\n");
    clip = archive.clipPool[0];
} else {
    console.log("\r\n请选择一个剪辑: ");
    let userInput = READLINE.question();
    for (let i = 0; i < archive.clipPool.length; i++) {
        if ((i + 1) == userInput) {
            clip = archive.clipPool[i];
            break;
        }
    }
}

// 选择提示
if (clip) {
    console.log("已选择剪辑: " + clip.name + "\r\n");
} else {
    console.log("没有选择任何剪辑, 退出程序...\r\n");
    process.exit();
}

// 解压缩文件
console.log("正在还原压缩剪辑记录...\r\n");
const frames = clip.frames;

/**
 * @type {Map<string, {name: string, type: string, select?: boolean}}
 */
const objectMapper = new Map();

const LastFrameData = "@";

/**
 * @type {IArchiveClip["frames"]}
 */
const F = [];
frames.forEach((frame) => {
    /**
     * @type {IArchiveClip["frames"][number]["commands"]}
     */
    const FCS = [];
    frame.commands.forEach((command) => {

        // 压缩指令
        const FC = {
            id: command.id,
            type: command.type
        };

        /**
         * 上一帧
         * @type {IArchiveClip["frames"][number]}
         */
        const lastFrame = F[F.length - 1];

        /**
         * 上一帧指令
         * @type {IArchiveClip["frames"][number]["commands"][number]}
         */
        const lastCommand = lastFrame?.commands.filter((c) => {
            if (c.type === command.type && c.id === command.id) {
                return true;
            } else {
                return false;
            }
        })[0];

        // 记录
        FC.name = (LastFrameData === command.name) ? lastCommand?.name : command.name;
        
        FC.data = (LastFrameData === command.data) ? lastCommand?.data : command.data;

        FC.mapId = (LastFrameData === command.mapId) ? lastCommand?.mapId : command.mapId;

        FC.position = (LastFrameData === command.position) ? lastCommand?.position : command.position;

        FC.radius = (LastFrameData === command.radius) ? lastCommand?.radius : command.radius;

        // 获取 Mapper
        const mapper = objectMapper.get(FC.id);
        if (mapper) {
            mapper.type = FC.type ?? mapper.type;
            mapper.name = FC.name ?? mapper.name;
        } else {
            objectMapper.set(FC.id, {
                type: FC.type,
                name: FC.name
            });
        }

        FCS.push(FC);
    });

    F.push({
        duration: frame.duration,
        process: frame.process,
        commands: FCS
    });
});

console.log("剪辑记录还原成功...\r\n");
console.log("剪辑共 " + F.length + " 帧, 对象 " + objectMapper.size + " 个\r\n");
if (objectMapper.size) {
    console.log("剪辑记录中存在以下对象:");
} else {
    console.log("剪辑记录中没有任何对象，退出程序...");
    process.exit();
}
let objectMapperForEachIndex = 1;
objectMapper.forEach((item, key) => {
    console.log(" \033[44;30m" + (objectMapperForEachIndex ++) + "\033[40;32m " + item.type + " " + item.name + " [" + key + "]\033[0m");
});

/**
 * @type {number[]}
 */
const pointMapper = [];

/**
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {number}
 */
function getPointID(x, y, z) {
    let search = -1;
    let pointMapperLength = (pointMapper.length / 3);
    // for (let i = 0; i < pointMapperLength; i++) {
    //     if (
    //         pointMapper[i * 3 + 0] === x &&
    //         pointMapper[i * 3 + 1] === y &&
    //         pointMapper[i * 3 + 2] === z
    //     ) {
    //         search = i;
    //     }
    // }
    if (search >= 0) {
        return search;
    } else {
        pointMapper.push(x);
        pointMapper.push(y);
        pointMapper.push(z);
        return pointMapperLength + 1;
    }
}

let frameId = 0;
/**
 * @type {Map<string, {id: number, start: number, last: number, name: string, point: number[]}[]>}
 */
const objectLineMapper = new Map();
/**
 * @param {string} obj 
 * @param {number} id 
 * @param {number} point 
 */
function recordPoint(obj, id, point) {
    let searchObj = objectLineMapper.get(obj);
    if (searchObj) {

        /**
         * @type {{id: number, start: number, last: number, point: number[]}}
         */
        let search;
        for (let i = 0; i < searchObj.length; i++) {
            if (searchObj[i].id === id && searchObj[i].last === (frameId - 1)) {
                search = searchObj[i];
            }
        }

        if (search) {
            search.point.push(point);
            search.last = frameId;
        } else {
            searchObj.push({
                id: id,
                start: frameId,
                last: frameId,
                point: [point]
            });
        }
    } else {
        objectLineMapper.set(obj, [{
            id: id,
            start: frameId,
            last: frameId,
            point: [point]
        }]);
    }
}

console.log("\r\n正在收集多边形数据...\r\n");
for (frameId = 0; frameId < F.length; frameId ++) {
    F[frameId].commands.forEach((command) => {

        if (command.type === "points" && command.mapId && command.data) {
            command.mapId.forEach((pid, index) => {

                const x = command.data[index * 3 + 0];
                const y = command.data[index * 3 + 1]
                const z = command.data[index * 3 + 2]

                if (
                    x !== undefined &&
                    y !== undefined &&
                    z !== undefined
                ) {
                    recordPoint(command.id, pid, getPointID(x, y, z));
                }
            })
        }
    });
}

let pointCount = (pointMapper.length / 3);

console.log("收集点数据 " + pointCount + "个\r\n");
console.log("收集样条:");
let objectLineMapperIndexPrint = 1;
objectLineMapper.forEach((item, key) => {
    let iName = objectMapper.get(key).name;
    console.log(" \033[44;30m" + (objectLineMapperIndexPrint ++) + "\033[40;32m " + item.length + " " + iName + " [" + key + "]\033[0m");
});

console.log("\r\n正在生成 .obj 文件...\r\n");

let fileStr = ""; let fileStrVec = "";

objectLineMapper.forEach((item, key) => {
    
    for (let i = 0; i < item.length; i++) {
        fileStr += "\r\n";
        fileStr += ("o " + objectMapper.get(key).name + " " + item[i].id + "\r\n");
        fileStr += "usemtl default\r\n";
        fileStr += "l ";
        fileStr += getPointID(
            item[i].start / (F.length - 1),
            item[i].last / (F.length - 1),
            (item[i].last - item[i].start) / (F.length - 1)
        ) + " ";
        fileStr += item[i].point.join(" ");
        fileStr += "\r\n";
    }

    fileStr += "\r\n";
});

pointCount = (pointMapper.length / 3);
for (let i = 0; i < pointCount; i++) {
    fileStrVec += ("v " + pointMapper[i * 3 + 0] + " " + pointMapper[i * 3 + 1] + " " + pointMapper[i * 3 + 2] + "\r\n");
}

const file = "# Create with Living Together (Parse from .ltss file)\r\n\r\n" + fileStrVec + fileStr;

console.log("正在生成保存文件...\r\n");
FS.writeFileSync(outputFilePath, file);
console.log("成功\r\n");