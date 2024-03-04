let listaDeItens = []
let itemAEditar 

const form = document.querySelector('#form-itens')
const itensInput = document.querySelector('#receber-item')
let ulItens = document.querySelector('#lista-de-itens')
let ulItensComprados = document.querySelector('#itens-comprados')
const itensRecuperados = localStorage.getItem('ListaDeItens')


//Verfica se já existem dados guardados na localStorage, e tiver manda os dados pra função mostrar item
if(itensRecuperados){
    listaDeItens = JSON.parse(itensRecuperados)
    mostrarItem()
} else{
    listaDeItens = []
}

form.addEventListener('submit', (e) => {
    e.preventDefault()
    salvarItem()
    mostrarItem()
    itensInput.focus()
})

function salvarItem() {
    const comprasItem = itensInput.value

    //Verifica se já existe o item adicionado na lista 
    const checarDuplicado = listaDeItens.some((elemento) => elemento.valor.toUpperCase() === comprasItem.toUpperCase())

    if (checarDuplicado) {
        console.log('esse item já existe')
    } else {
        listaDeItens.push({
            valor: comprasItem,
            checar: false
        })
    }

    itensInput.value = ''
}

function atualizaLocalStorage(){
    localStorage.setItem('ListaDeItens', JSON.stringify(listaDeItens))
}

function mostrarItem() {
    ulItens.innerHTML = ''
    ulItensComprados.innerHTML = ''

    listaDeItens.forEach((elemento, i) => {

        if (elemento.checar) {
            ulItensComprados.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${i}">
                    <div>
                        <input type="checkbox" checked class="is-clickable" />
                        <span class="itens-comprados is-size-5">${elemento.valor}</span>
                    </div>
                    <div>
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>
            `
        } else {
            ulItens.innerHTML += `
                <li class="item-compra is-flex is-justify-content-space-between" data-value="${i}">
                    <div>
                        <input type="checkbox" class="is-clickable" />
                        <input type="text" class="is-size-5" value="${elemento.valor}" ${i !== Number(itemAEditar) ? 'disabled': ''}></input>
                    </div>
                    <div>   
                        ${i === Number(itemAEditar) ? '<button onclick="salvarEdicao()"><i class="fa-regular fa-floppy-disk is-clickable"></i></button>' : '<i class="fa-regular is-clickable fa-pen-to-square editar"></i>'}
                        <i class="fa-solid fa-trash is-clickable deletar"></i>
                    </div>
                </li>
            `
        }

    })

    const inputCheckBox = document.querySelectorAll('input[type="checkbox"]')

    inputCheckBox.forEach((elemento) => {

        elemento.addEventListener('click', (evento) => {
            //Seleciona o elemento avô do input e pega o valor do seu atributo
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value')

            //Acessa o Array de Lista de Item no indice especifico do objeto, e pega o atriubuto checar, nele vai ser atribuido se ele foi ou não selecionado
            listaDeItens[valorDoElemento].checar = evento.target.checked
            
            mostrarItem()

        })
    })

    const lixeira = document.querySelectorAll('.deletar')

    //Funcionalidade de clique na lixeira pra remover o objeto
    lixeira.forEach((elemento) => {

        elemento.addEventListener('click', (evento) => {
            
            const valorDoElemento = evento.target.parentElement.parentElement.getAttribute('data-value')

            listaDeItens.splice(valorDoElemento, 1)
            mostrarItem()

        })
    })

    const lapis = document.querySelectorAll('.editar')

    lapis.forEach((elemento) => {
        elemento.addEventListener('click', (evento) =>{
            itemAEditar = evento.target.parentElement.parentElement.getAttribute('data-value')
            mostrarItem() 
            console.log(itemAEditar)
        })
        
    })

    atualizaLocalStorage()

}

function salvarEdicao(){
    const itemEditado = document.querySelector(`[data-value="${itemAEditar}"] input[type="text"]`)
    listaDeItens[itemAEditar].valor = itemEditado.value
    console.log(listaDeItens)
    itemAEditar = -1
    mostrarItem()
}
