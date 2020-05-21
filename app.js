const newItem = document.querySelector('#newInput')


window.addEventListener('submit', (e)=> {
    e.preventDefault()
    const a = document.createElement('div')
    a.innerHTML = newItem.value
    newItem.value = ''
    document.querySelector('.items').appendChild(a)
})





