const timerFace = document.querySelector('h1')
const progress = document.querySelector('.progress')

setTime(0)

function timer(seconds){
    const start = Date.now()
    const end = start + seconds*1000
    const totalTime = end - start
    
    setTime(seconds)
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
timer(0)
function setTime(seconds){
    const min = Math.floor(seconds/60)
    const sec = seconds%60 

    timerFace.textContent = `${min< 10? "0":''}${min}:${sec< 10? "0":''}${sec}`
}

function updateProgress(timeLeft, totalTime){
    degree = (1- timeLeft/totalTime) * 360
    progress.style.transform = `rotate(${degree}deg)`
}