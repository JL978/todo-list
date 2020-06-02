const timerFace = document.querySelector('h1')
const progress = document.querySelector('.progress')

setTime(0)

function timer(seconds){
    const start = Date.now()
    const end = start + seconds*1000
    const totalTime = (end - start)/1000

    setTime(seconds)
    counter = setInterval(() => {
        timeLeft = Math.round((end - Date.now())/1000)
        if (timeLeft < 0){
            clearInterval(counter)
            progress.style.transform = `rotate(0deg)`
            return
        }
        setTime(timeLeft)
        updateProgress(timeLeft, totalTime)
    }, 1000);
}
timer(10)
function setTime(seconds){
    const min = Math.floor(seconds/60)
    const sec = seconds%60 

    timerFace.textContent = `${min}:${sec< 10? "0":''}${sec}`
}

function updateProgress(timeLeft, totalTime){
    degree = (1- timeLeft/totalTime) * 360
    console.log(degree);
    
    progress.style.transform = `rotate(${degree}deg)`
}