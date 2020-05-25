const newItem = document.querySelector('#newInput')

let items;

window.addEventListener('submit', (e)=> {
    e.preventDefault()
    if (newItem.value !== ''){
        const a = document.createElement('div')
    a.innerHTML = `${newItem.value}`
    a.classList.add('itemLabel')
    newItem.value = ''
    document.querySelector('.items').appendChild(a)
    a.addEventListener('click', handleClick)
    }
})

function handleClick() {
    this.classList.toggle('crossed')
}



