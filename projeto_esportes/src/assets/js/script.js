// DECLARANDO AS VARIAVEIS
const items = document.querySelectorAll('.item');
const taxaEntrega = 8;
let total = 0;

// PERCORRE A LISTA QUE SERA SELECIONADA
items.forEach((item) => {      //PEGANDO ITEMS DECLARADO ACIMA E FAZENDO UMA VARREDURA PARA CADA ITEM
    item.addEventListener('click', () => { //AO CLICAR NOS ITEM 
        item.classList.toggle('selected'); //CRIA UMA LISTA DE ITEMS SELECIONADOS
        calcularTotal(); //CHAMA A FUNÇÃO CALCULAR TOTAL
    });
});

// FUNÇÃO CALCULAR TOTAL
function calcularTotal() {
    total = 0;  //INICIA O VALOR COM 0
    const itemsSelecionados = document.querySelectorAll('.selected');    // PEGA OS ITEMS SELECIONADOS
    itemsSelecionados.forEach((item) => { // FAZ UMA VARREDURA NOS ITEMS
        total += parseFloat(item.dataset.preco); //E PEGA O PREÇO DE CADA UM ATRAVES DO ATRIBUTO DATA
    });
    if (itemsSelecionados.length > 0) {   // SE O TOTAL DOS ITEMS SELECIONADOS FOR MAIOR DE 0 
        total += taxaEntrega;   // PEGA O VALOR TOTAL + O VALOR DA TAXA DE ENTREGA 
    }
    document.getElementById('total').textContent = `Total: R$ ${total.toFixed(2)}`; // ADICIONA NA TELA TOTAL
    return total; // Retorna o total calculado 
}

//FUNÇÃO DO SWWEETALERT PARA CRIAR UM ALERT AO CLICAR NO BOTÃO FINALIZAR PEDIDO
const loadingBtn = document.getElementById('loadingBtn'); //SELECIONA O ELEMENTO PELO ID

if (loadingBtn) { //VERIFICA SE O ELEMENTO FOI ENCONTRADO
    loadingBtn.addEventListener('click', () => { //FUNÇÃO QUE VAI SER EXECUTADA QUANDO CLICAR NO BOTÃO
        Swal.fire({   //EXIBE UMA MODAL NA TELA (CAIXA DE DIALOGO)
            title: 'Carregando...',  //TITULO DA MODAL
            allowOutsideClick: false, // IMPEDE QUE O MODAL FECHE QUANDO O USUARIO CLICAR FORA DELE
            didOpen: () => {   // DEFINE UMA FUNÇÃO QUE É EXECUTADA QUANDO A MODAL É ABERTO
                Swal.showLoading();  //EXIBE UM INDICARDO DE CARREGAMENTO DENTRO DA MODAL
                finalizarPedido()  // CHAMANDO A FUNÇÃO FINALIZAR PEDIDO
                    .then((pedido) => {   // FUNÇÃO ASSINCRONA QUE É EXECUTADA QUANDO A PROMISE É RESOLVIDA COM SUCESSO
                        Swal.close();  //FECHA A MODAL DE CARREGAMENTO
                        exibirMensagemSucesso(pedido); //CHAMADA A FUNÇÃO EXIBIRMENSAGEM
                        
                    })
                    .catch((erro) => { //CASO ACONTECA ALGUM ERRO APRESENTA UMA MENSAGEM DE ERRO
                        Swal.close();
                        Swal.fire('Erro!', erro, 'error');
                    });
            },
        });
    });
}
// FUNÇÃO FINALIZAR PEDIDO

async function finalizarPedido() { // A FUNÇÃO RECEBE UMA PROMESSA 
    return new Promise((resolve, reject) => { //A PROMESSA RECEBE DOIS PARAMETROS RESOLVE(QUANDO RESOLVIDA) E REJECT(QUANDO DA ERRO)
        const endereco = document.getElementById('endereco').value;  // PEGANDO O ID DO ENDERECO
        const pagamento = document.querySelector('input[name="pagamento"]:checked'); //PEGANDO A FORMA DE PAGAMENTO TICADA
        const itemsSelecionados = document.querySelectorAll('.selected'); //PEGANDO TODOS OS ITEMS SELECIONADOS

        //VALIDAÇÃO  DOS DADOS - VERIFICA SE OS ITEMS SELECIONADOS ESTÃO VAZIOS E compara se o número de elementos no array é exatamente igual a zero

        if (itemsSelecionados.length === 0) {  //COMPARA SE O NUMERO DE ELEMENTOS NO ARRAY É EXATAMENTE IGUAL A 0
            //reject() é uma função usada em Promises (um padrão para lidar com operações assíncronas em JavaScript
            reject('Selecione pelo menos um item para fazer o pedido!');  //VERIFICA SE O USUARIO NÃO SELECIONOU NENHUM ITEM
            return;
        }
        if (!endereco) { // VERIFICA SE O ENDEREÇO  É FALSA
            reject('Por favor, informe o endereço de entrega!');
            return;
        }
        if (!pagamento) { // VERIFICA SE O PAGAMENTO  É FALSA
            reject('Selecione uma forma de pagamento!');
            return;
        }
        //CRIAÇÃO DO OBJETO PEDIDO COM  SEUS ATRIBUTOS 
        const pedido = {
            items: Array.from(itemsSelecionados).map((item) => item.querySelector('h3').textContent), // USA O METODO MAP PARA CRIAR UM NOVO ARRY COM OS DADOS DE CADA ITEM
            endereco,
            formaPagamento: pagamento.value,  //RECEBE O VALOR ESCOLHIDO NA FORMA DE PAGAMENTO
            total: calcularTotal(), // TOTAL RECEBE A FUNÇÃO CALCULARTOTAL
        };
        //FUNÇÃOQ QUE VAI LEVAR 2 SEGUNDOS PARA SER RESOLVIDA
        setTimeout(() => {
            resolve(pedido);
        }, 2000);
    });
}
// FUNÇÃO QUE EXIBE A MENSAGEM DO PEDIDO

function exibirMensagemSucesso(pedido) {
    const { items, endereco, formaPagamento, total } = pedido; // Destructuring
    //OBJETO MENSAGEM E SEUS ATRIBUITOS
    const mensagem = `
        Itens: ${items.join(', ')}<br>
        Endereço: ${endereco}<br>
        Forma de pagamento: ${formaPagamento}<br>
        Total (com taxa de entrega R$ ${taxaEntrega.toFixed(2)}): R$ ${total.toFixed(2)}<br>
    `;

    Swal.fire('Pedido realizado com sucesso!', mensagem, 'success').then(() => { //MENSAGEM DE SUCESSO
        novoPedido(); // CHAMA A FUNÇÃO NOVO PEDIDO APOS A MENSAGEM
    });
}
