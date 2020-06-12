const timerFace = document.querySelector('h1')
const progress = document.querySelector('.progress')
let runTime
let mover
let counter

setTime(0)

function timer(seconds, resume=false, mil=0){
    clearInterval(mover)
    clearInterval(counter)

    const start = Date.now()
    if (resume){
        var end = start + mil
    }else{
        var end = start + seconds*1000
    }
    var totalTime = seconds*1000
    
    mover = setInterval(()=>{
        milLeft = end - Date.now()
        localStorage.setItem('mil', milLeft)
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
const manualInputDiv = document.querySelector('.time-input')
const buttons = document.querySelector('.buttons')
let startButton = document.querySelector("#start")
const pauseButton = document.querySelector("#pause")
const resetButton = document.querySelector("#restart")
const manualInput = document.querySelector('#SetTimer')

buttonInputs.forEach(button => button.addEventListener('click', (e) => {
    runTime = e.target.dataset.min * 60
    setTime(runTime)
    localStorage.setItem('totalTime', runTime)
}))


function startClick(){
    startButton = document.querySelector("#start")
    if (!startButton.classList.contains("inProgress") && runTime != 0 && runTime){
        startButton.classList.add("inProgress")

        manualInputDiv.classList.add('hide')
        buttons.classList.add('hide')

        startButton.removeEventListener('click', startClick)
        timer(runTime)
    }
}

startButton.addEventListener('click', startClick)

function resumeClick(){
    currentTotalTime = parseInt(localStorage.getItem('totalTime'))
    mil = parseInt(localStorage.getItem('mil'))
    timer(currentTotalTime, resume=true, mil=mil)
    startButton.classList.add("inProgress")
}

pauseButton.addEventListener('click', () =>{
    startButton = document.querySelector("#start")
    if (startButton.classList.contains("inProgress")){
        clearInterval(mover)
        clearInterval(counter)
        startButton.classList.remove("inProgress")
        startButton.addEventListener('click', resumeClick)
    }
})

function checkValid(input){
    if (!isNaN(input)){
        return true
    }
    splited = input.split(':')
    if (splited.length === 2 &&  0 < splited[0].length <= 2 && splited[1].length === 2){
        return true
    }
    return false
}

function convertSeconds(input){
    if (!isNaN(input)){
        totalSec = input * 60
    }else{
        splited = input.split(':')
        min = splited[0]
        sec = splited[1]
        if ((min[0]) === 0){
            min = min[1]
        }
        totalSec = parseInt(min*60) + parseInt(sec)
    }
    return totalSec < 3600 ? totalSec:3600
}

manualInput.addEventListener('keydown', (e)=>{
    if (isNaN(e.key) && e.key!=='Backspace' && e.key !== ":"){
        e.preventDefault()
    }
    if (e.key === "Enter"){
        if (checkValid(manualInput.value)){
            runTime = convertSeconds((manualInput.value))
            manualInput.value = ''
            setTime(runTime)
            localStorage.setItem('totalTime', runTime)
        }
    }
})

resetButton.addEventListener('click', () => {
    clearInterval(mover)
    clearInterval(counter)
    setTime(runTime)
    progress.style.transform = `rotate(0deg)`
    manualInputDiv.classList.remove('hide')
    buttons.classList.remove('hide')
    startButton.classList.remove("inProgress")
    startButton.removeEventListener('click', resumeClick)
    startButton.addEventListener('click', startClick)
})