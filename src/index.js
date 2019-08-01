import './test.css'
import './test.scss'
import data from './data.json'
import './test'
console.log(data)
let a = document.createElement('div');
a.classList.add('a')
document.querySelector('#app').append(a)
let b = document.createElement('div')
b.classList.add('test')
document.querySelector('#app').append(b)
