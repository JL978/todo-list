const timerFace = document.querySelector('h1')
const progress = document.querySelector('.progress')
let runTime
let mover
let counter

setTime(0)

function timer(seconds){
     clearInterval(mover)
     clearInterval(counter)

    const start = Date.now()
    const end = start + seconds*1000
    const totalTime = end - start
    
    mover = setInterval(()=>{
        milLeft = end - Date.now()
        if (milLeft < 0) {
            clearInterval(mover)
            progress.style.transform = `rotate(0deg)`
            return
        }
        updateProgress(milLeft, totalTime)
    })

    counter = setInterval(() => {
        secLeft = Math.round((end - Date.now())/1000)

        if (secLeft < 0){
            clearInterval(counter)
            return
        }
        setTime(secLeft)
        
    }, 1000);
}

function setTime(seconds){
    const min = Math.floor(seconds/60)
    const sec = seconds%60 

    timerFace.textContent = `${min< 10? "0":''}${min}:${sec< 10? "0":''}${sec}`
}

function updateProgress(timeLeft, totalTime){
    degree = (1- timeLeft/totalTime) * 360
    progress.style.transform = `rotate(${degree}deg)`
}

const buttonInputs = document.querySelectorAll(".setTime")
const manualInput = document.querySelector('.time-input')
const buttons = document.querySelector('.buttons')
let startButton = document.querySelector("#start")
const pauseButton = document.querySelector("#pause")
const resetButton = document.querySelector("#reset")


buttonInputs.forEach(button => button.addEventListener('click', (e) => {
    runTime = e.target.dataset.min * 60
    setTime(runTime)
}))


function startClick(){
    startButton = document.querySelector("#start")
    if (!startButton.classList.contains("inProgress") && runTime != 0 && runTime){
        startButton.classList.toggle("inProgress")

        manualInput.classList.toggle('hide')
        buttons.classList.toggle('hide')

        startButton.removeEventListener('click', startClick)
        timer(runTime)
    }
}

startButton.addEventListener('click', startClick)

pauseButton.addEventListener('click', () =>{
    startButton = document.querySelector("#start")
    if (startButton.classList.contains("inProgress")){
        startButton.classList.toggle("inProgress")
        startButton.addEventListener('click', startClick)
    }
})