const newInput = document.querySelector('#newInput')
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
    const allItems = [...items.querySelectorAll('div')]
    const crossedItems = allItems.filter(item => item.classList.contains('crossed'))

    crossedItems.forEach(item => {
        itemsList.splice(itemsList.indexOf(item.outerHTML), 1)
        localStorage.setItem('items', itemsList)
        item.remove()
    })
}

//Edit Icon
const editItems = document.querySelector('#editItems')
editItems.addEventListener('click', itemsEdit)

function itemsEdit(){
    editItems.classList.toggle('active')

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
            //when the blur event happens, we want to rewrite the itemsList and save to localStorage
            item.addEventListener('focusout', ()=>{
                //in case user deleted everything, we'll add something to the div so that its not empty
                if (item.innerHTML==''){
                    item.innerHTML = '[add item]'
                }
                
                itemsList.splice(currentIndex, 1, item.outerHTML)
                localStorage.setItem('items', itemsList)
            })
            })
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