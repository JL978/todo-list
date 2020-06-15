const newInput = document.querySelector('#newItem')
const items = document.querySelector('.items')


let itemsList = localStorage.getItem('items') || [];

//handling load and reaload event such to take stored items (if any) out of localStorage and
//add them to the items variable to display on the DOM
function onLoad(){
    if (itemsList.length != 0){
        itemsList = itemsList.split(',')
        items.innerHTML = itemsList.join('')

        const loadedItems = [...items.childNodes]
        loadedItems.forEach(item => {
            //handle the case where user reloads during edit
            //this takes of the edit mode and make the items not editable
            if (item.classList.contains('edit-mode')){
                const currentIndex = itemsList.indexOf(item.outerHTML)

                item.classList.toggle('itemLabel')
                item.classList.toggle('edit-mode')
                item.contentEditable = !item.isContentEditable

                itemsList.splice(currentIndex, 1, item.outerHTML)   
            }
            item.addEventListener('click', handleClick)
        })
    }
}

onLoad()

//handle the submit event of the input box by creating a new div and add the content 
//from the input box to it and then add it to the display list and clear the content 
//in the input box
window.addEventListener('submit', (e)=> {
    e.preventDefault()

    if (newInput.value !== ''){
        const newDiv = document.createElement('div')

        newDiv.innerHTML = `${newInput.value}`
        newDiv.classList.add('itemLabel')
        items.appendChild(newDiv)
        newDiv.addEventListener('click', handleClick)

        itemsList.push(newDiv.outerHTML)
        localStorage.setItem('items', itemsList)

        newInput.value = ''
    }
})

//handle the click event on each items, by toggling the css crossed class and also 
//modify the itemsList that get added to localStorage so the cross state persist
function handleClick() {
    const currentIndex = itemsList.indexOf(this.outerHTML) 
    this.classList.toggle('crossed')
    const modified = this.outerHTML
    itemsList.splice(currentIndex, 1, modified)
    localStorage.setItem('items', itemsList)
}

//Icons functionality
//Delete icon
const deleteItems = document.querySelector('#deleteItems')
deleteItems.addEventListener('click', deleteCrossed)

//Selecting all items with the crossed class and remove them from itemsList and update
//localStorage, then the item is removed
function deleteCrossed(){
    const allItems = [...items.querySelectorAll('.itemLabel')]
    const crossedItems = allItems.filter(item => item.classList.contains('crossed'))

    crossedItems.forEach(item => {
        itemsList.splice(itemsList.indexOf(item.outerHTML), 1)
        localStorage.setItem('items', itemsList)
        item.remove()
    })
}

//Edit Icon and Timer Icon
const editItems = document.querySelector('#editItems')
const focusTool = document.querySelector('#timer')

editItems.addEventListener('click', itemsEdit)

function itemsEdit(){
    editItems.classList.toggle('active')
    
    if (editItems.classList.contains('active')){
        focusTool.removeEventListener('click', focusSelection)
        deleteItems.removeEventListener('click', deleteCrossed)
        focusTool.classList.add('disabled')
        deleteItems.classList.add('disabled')
    }else{
        focusTool.addEventListener('click', focusSelection)
        deleteItems.addEventListener('click', deleteCrossed)
        focusTool.classList.remove('disabled')
        deleteItems.classList.remove('disabled')
    }

    const allItems = [...items.querySelectorAll('div')]
    allItems.forEach(item =>{
        const currentIndex = itemsList.indexOf(item.outerHTML)
        if (editItems.classList.contains('active')){
            //if edit it active, we don't want any click event to be active
            item.removeEventListener('click', handleClick)
            //added so that when the enter key is hit, it does not make a
            //new line but trigger the blur event on the item
            item.addEventListener('keydown', e => {
                if (e.key === "Enter"){
                    e.preventDefault()
                    item.blur()
                }
            })
            //when the blur event happens, we want to rewrite the itemsList and save to localStorage
            item.addEventListener('focusout', ()=>{
                //in case user deleted everything, we'll add something to the div so that its not empty
                if (item.innerHTML==''){
                    item.innerHTML = '[add item]'
                }
                
                itemsList.splice(currentIndex, 1, item.outerHTML)
                localStorage.setItem('items', itemsList)
            })
            
            item.addEventListener('focusin', () => {
                console.log(item);
                
            });
            
        }else{
            //if the edit is turned off, we want to return the cross-out functionality
            item.addEventListener('click', handleClick)
        }
        //Everytime the edit button is clicked, we want to turn off the itemLabel class
        //to remove the css hover property and turn on the edit-mode class 
        item.classList.toggle('itemLabel')
        item.classList.toggle('edit-mode')

        item.contentEditable = !item.isContentEditable

        itemsList.splice(currentIndex, 1, item.outerHTML)
        localStorage.setItem('items', itemsList)
    })
}

focusTool.addEventListener('click', focusSelection)


function focusOn(){
    const currentFocus = document.querySelector('.currentFocusItem')
    currentFocus.innerHTML = this.innerHTML
}

function focusSelection(){
    focusTool.classList.toggle('active')

    if (focusTool.classList.contains('active')){
        editItems.removeEventListener('click', itemsEdit)
        deleteItems.removeEventListener('click', deleteCrossed)
        editItems.classList.add('disabled')
        deleteItems.classList.add('disabled')
    }else{
        editItems.addEventListener('click', itemsEdit)
        deleteItems.addEventListener('click', deleteCrossed)
        editItems.classList.remove('disabled')
        deleteItems.classList.remove('disabled')
    }


    const items = document.querySelectorAll('.itemLabel')
    if (items.length !== 0){
        newInput.disabled = !newInput.attributes.disabled
        items.forEach(item => {
            item.classList.toggle('focusSelect')
            if (item.classList.contains('focusSelect')) {
                item.removeEventListener('click', handleClick)
                item.addEventListener('click', focusOn)
            }else{
                item.removeEventListener('click', focusOn)
                item.addEventListener('click', handleClick)
            }
        })
    } 
}




const timerFace = document.querySelector('.clockFace')
const progress = document.querySelector('.progress')
const beep = document.querySelector('audio')
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
            beep.play()
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