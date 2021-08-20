let pen = document.getElementById("pen"),
    eraser = document.getElementById("eraser"),
    clear = document.getElementById("clear"),
    save = document.getElementById("save"),
    toolsList = document.getElementsByTagName("li"),
    colorAll = document.getElementById("line-color"),
    colorList = colorAll.getElementsByTagName("li"),
    weightAll = document.getElementById("line-weight"),
    weightList = weightAll.getElementsByTagName("li"),
    eraserAll = document.getElementById("eraser-width"),
    eraserList = eraserAll.getElementsByTagName("li"),
    //canvas画布
    canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d"),
    //背景
    canvasBack = document.getElementById("background"),
    ctx1 = canvasBack.getContext("2d");

//初始化 颜色、粗细
let colorValue = "#000000";
let weightValue = 15;
let eraserSize = 32;

pen.addEventListener('click', () => {
    pen.classList.add("active");
    eraser.classList.remove("active");
    colorAll.style.display = 'block';
    weightAll.style.display = 'block';
    eraserAll.style.display = "none";
    useEraser = false;
    usePaint = true;
    document.body.style.cursor = `url('img/pen32.ico') 0 32, auto`
})
eraser.addEventListener('click', () => {
    eraser.classList.add("active");
    pen.classList.remove("active");
    colorAll.style.display = 'none';
    weightAll.style.display = 'none';
    eraserAll.style.display = "block";
    useEraser = true;
    usePaint = false;
    document.body.style.cursor = `url('img/eraser32.ico') 16 16, auto`
})
clear.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
})
save.addEventListener('click', () => {
    let url = canvas.toDataURL("image/png");
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.href = url;
    a.target = '_blank';
    a.download = '我的绘画';
    a.click();
})

for (let i = 0; i < colorList.length; i++) {
    colorList[i].addEventListener("click", () => {
        for (let y = 0; y < colorList.length; y++) {
            if (colorList[y].classList.value.indexOf('active') !== -1) {
                colorList[y].classList.remove("active");
            }
        }
        colorList[i].classList.add("active");
        //改变粗细背景颜色
        let colorChange = colorList[i].getAttribute("color");
        for (let z = 0; z < weightList.length; z++) {
            weightList[z].style.backgroundColor = colorChange;
        }
        colorValue = colorChange;
    })
}


for (let i = 0; i < weightList.length; i++) {
    weightList[i].addEventListener("click", () => {
        for (let y = 0; y < weightList.length; y++) {
            if (weightList[y].classList.value.indexOf('active') !== -1) {
                weightList[y].classList.remove("active");
            }
        }
        weightList[i].classList.add("active");
        weightValue = weightList[i].getAttribute("weight");
        console.log('当前粗细：' + weightValue);
    })
}

eraser16.addEventListener('click', () => {
    document.body.style.cursor = `url('img/eraser16.ico') 8 8, auto`
    eraserSize = 8
})

eraser32.addEventListener('click', () => {
    document.body.style.cursor = `url('img/eraser32.ico') 16 16, auto`
    eraserSize = 16
})

eraser48.addEventListener('click', () => {
    document.body.style.cursor = `url('img/eraser48.ico') 24 24, auto`
    eraserSize = 24
})

eraser64.addEventListener('click', () => {
    document.body.style.cursor = `url('img/eraser64.ico') 32 32, auto`
    eraserSize = 32
})


//自动调整画布大小（根据页面大小动态调整）
autoSetCanvas();

function autoSetCanvas() {
    change();
    backGroundStyle();

    window.onresize = function() {
        // change();
        backGroundStyle();
        //改变页面大小重置线条链接状态
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    };

    function change() {
        let pageW = document.documentElement.clientWidth;
        let pageH = document.documentElement.clientHeight;
        canvas.width = pageW;
        canvas.height = pageH;
        canvasBack.width = pageW;
        canvasBack.height = pageH;
    }
};

//绘画鼠标事件

//定义鼠标按下的初始位置变量：
let oldPoint = {
        mouseX: undefined,
        mouseY: undefined
    },
    usePaint = true,
    useEraser = false,
    painting = false,
    erasering = false;
//设置canvas属性
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

//按下
canvas.addEventListener("mousedown", (e) => {
    let mouseX = e.clientX,
        mouseY = e.clientY;
    if (usePaint) {
        painting = true;
        oldPoint.mouseX = e.clientX;
        oldPoint.mouseY = e.clientY;
        ctx.beginPath();
        ctx.fillStyle = colorValue;
        ctx.arc(mouseX, mouseY, weightValue / 2, Math.PI * 2, false);
        ctx.fill();
    } else if (useEraser) {
        erasering = true;
        // ctx.clearRect(mouseX - eraserSize / 2, mouseY - eraserSize / 2, eraserSize, eraserSize);
        clearArcFun(mouseX - eraserSize / 2, mouseY - eraserSize / 2, eraserSize);
    }
})

//移动
canvas.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX,
        mouseY = e.clientY;
    if (usePaint) {
        if (painting) {
            newPoint = {
                mouseX,
                mouseY
            };
            ctx.beginPath();
            ctx.moveTo(oldPoint.mouseX, oldPoint.mouseY);
            ctx.lineTo(newPoint.mouseX, newPoint.mouseY);
            ctx.closePath()
            ctx.fillStyle = colorValue;
            ctx.lineWidth = weightValue;
            ctx.strokeStyle = colorValue;
            ctx.fill();
            ctx.stroke();
            oldPoint = newPoint;
        }
    } else
    if (useEraser) {
        if (erasering) {
            // ctx.clearRect(mouseX - eraserSize / 2, mouseY - eraserSize / 2, eraserSize, eraserSize);
            clearArcFun(mouseX - eraserSize / 2, mouseY - eraserSize / 2, eraserSize);
        }
    }
})

//松开
canvas.addEventListener("mouseup", () => {
    painting = false;
    erasering = false;
})

//圆形清除
function clearArcFun(x, y, r) { //(x,y)为要清除的圆的圆心，r为半径，cxt为context
    var stepClear = 1; //别忘记这一步  
    clearArc(x, y, r);

    function clearArc(x, y, radius) {
        var calcWidth = radius - stepClear;
        var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
        var posX = x - calcWidth;
        var posY = y - calcHeight;
        var widthX = 2 * calcWidth;
        var heightY = 2 * calcHeight;
        if (stepClear <= radius) {
            ctx.clearRect(posX, posY, widthX, heightY);
            stepClear += 1;
            clearArc(x, y, radius);
        }
    }
}

//背景样式
function backGroundStyle() {
    // 绘制 30 X 30 的虚线正方形背景
    ctx1.lineWidth = 2;
    ctx1.beginPath();
    ctx1.setLineDash([5, 5]);
    ctx1.strokeStyle = '#e6e6e6';
    ctx1.moveTo(0, 0);
    let pageW = document.documentElement.clientWidth;
    let pageH = document.documentElement.clientHeight;
    for (let i = 0; i <= pageW; i += 30) {
        ctx1.moveTo(0, i);
        ctx1.lineTo(pageW, i);
    }
    for (let i = 0; i <= pageW; i += 30) {
        ctx1.moveTo(i, 0);
        ctx1.lineTo(i, pageH);
    }
    ctx1.stroke();
}