let board;
let boardWidth=360;
let boardHeight=640;
let c;

let birdWidth= 34;// ratio is of 17:12 of the real dimension of the bird image....
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird ={   
    x: birdX,
    y:birdY,
    width:birdWidth,
    height:birdHeight
}

let pipeWidth = 64;
let pipeHeight = boardHeight/2;
let pipeX = boardWidth;
let pipeY =0;
let topPipeImg;

let bottomPipeWidth = 64;
let bottomPipeHeight =undefined;
let bottomPipeX = boardWidth;
let bottomPipeY = undefined;

let bottomPipeImg;
let pipeArray = [];

let velocityX =-2;
let velocityY = 0;
let gravity = 0.4;

let gameOver = false;
let score = 0;
let highScore = 0;
let a = "GAMEOVER";

window.onload = function (){
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    c = board.getContext('2d');
    birdImg = new Image();
    birdImg.src = "./Images/bird.png";

    birdImg.onload = function(){
        c.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./Images/pipeTop.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src="./Images/pipeBottom.png";

   requestAnimationFrame(update);
   setInterval(placePipes,1500);
   setInterval(placeBottomPipes,1600);
   document.addEventListener("keydown",moveBird);
}

const newGameButton = document.getElementById("newGameButton");
newGameButton.addEventListener("click", startNewGame);

function startNewGame(){
    score=0;
    bird.y = birdY;
    pipeArray=[];
    gameOver=false;
    newGameButton.style.display = "none";
    requestAnimationFrame(update);
}

function randomIntGenerator(min,max){
    return Math.random()*(max-min)+min;
}
function update(){ 
    if(gameOver === true){
        return;
    }
    c.clearRect(0,0,boardWidth,boardHeight); 
    requestAnimationFrame(update); 

    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY,0);
    c.drawImage(birdImg,bird.x,bird.y,bird.width,bird.height);

    if(bird.y>boardHeight){
        newGameButton.style.display="block";
        gameOver =true;
    }
    
    for(let i =0; i<pipeArray.length; i++){
        pipeArray[i].x += velocityX ;
        c.drawImage(pipeArray[i].img,pipeArray[i].x,pipeArray[i].y,pipeArray[i].width,pipeArray[i].height); 
        
        if(!pipeArray[i].passed && bird.x > pipeArray[i].x + pipeArray[i].width){
            score += 0.5;
            pipeArray[i].passed = true;
        }
       if(detectCollision(bird,pipeArray[i])){
        if(score>highScore){
            highScore = score;
        }  
        gameOver = true;
           newGameButton.style.display ="block";
        c.fillStyle = "white";
     c.font = "45px Courier New";
     c.fillText(a,5,45);
     score = " ";
       }

       while(pipeArray.length>0 && pipeArray[i]<-pipeArray[i].width){
        pipeArray.shift();
       }
    }
  
    
     c.fillStyle = "white";
     c.font = "45px Courier New";
     c.fillText(score,5,45);
     c.fillText(highScore,5,95);
}

function randomIntGenerator(min,max){
    return Math.random()*(max-min)+min;
}

function placePipes(){
    if(gameOver === true){
        return;
    }
       let pipe = {
        img:topPipeImg,
        x:pipeX,
        y:pipeY,
        width:pipeWidth,
        height:pipeHeight-Math.random()*boardHeight/4.5,
        passed:false
    }
    pipeArray.push(pipe);
}

function placeBottomPipes(){
    if(gameOver === true){
        return;
    }
    let sandman = randomIntGenerator(boardHeight/2+70,boardHeight-120);
    let pipe = {
        img: bottomPipeImg,
        x: bottomPipeX,
        y: sandman,
        height: boardHeight-sandman,
        width:bottomPipeWidth,
        passed:false
    }
    pipeArray.push(pipe);
}

function moveBird(e){
    if(e.code == "space" || e.code =="ArrowUp" || e.code == "KeyX"){
        velocityY = -6;
    }
}

function detectCollision(a,b){
    return a.x + a.width > b.x &&
           a.x< b.x + b.width &&
           a.y + a.height > b.y &&
           a.y < b.y + b.height
}