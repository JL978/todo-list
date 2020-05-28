const newInput = document.querySelector('#newInput')
const items = document.querySelector('.items')


let itemsList = localStorage.getItem('items') || [];

//handling load and reaload event such to take stored items (if any) out of localStorage and
//add them to the the items list
function onLoad(){
    if (itemsList.length != 0){
        itemsList = itemsList.split(',')
        items.innerHTML = itemsList.join('')

        const loadedItems = document.querySelectorAll('.itemLabel')
        loadedItems.forEach(item => {
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
    allItems.filter(item => item.classList.contains('crossed')).forEach(item => {
        itemsList.splice(itemsList.indexOf(item.outerHTML), 1)
        localStorage.setItem('items', itemsList)
        item.remove()
    })
}