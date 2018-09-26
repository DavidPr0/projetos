/**********************************
***********Fictory class***********
***********************************/
class Despesa{
	constructor(ano, mes, dia, tipo, descricao, valor){
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor

	}
/* Valida os campos evitando passar campo vazio
***********************************************/
	validarDados(){
		for(let i in this){
			// console.log(i, this[i])
			if (this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}else{
				return true
			}
		}
	}
}

class Bd{
	constructor(){
		let id = localStorage.getItem('id')
		if (id === null) {
			localStorage.setItem('id', 0)
		}
	}
	getProximoId(){
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId)+ 1
	}

	gravar(d){
		
		let id = this.getProximoId()

		localStorage.setItem(id,JSON.stringify(d))

		localStorage.setItem('id', id)
	}

/***Recupera todos registros um a um***
***************************************/
	recuperarTodosRegistros(){

		//array de despesas
		let despesas = Array()
		let id = localStorage.getItem('id')

		//recupera todas as despesas cadastrada em localstorage
		for (let i = 1; i <= id; i++) {
			
			//recupera a despesa
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			
			if (despesa === null) {
				continue
			}
			//atribui id ao elemento criado
			despesa.id = i
			despesas.push(despesa)
		}

		return despesas
	}

	pesquisar(despesa){
		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		

		//ano
		if (despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if (despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if (despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if (despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descrição
		if (despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if (despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}
		return despesasFiltradas
	}

	remover(id){
		localStorage.removeItem(id)
	}

}

let bd = new Bd()
/**********************************
***Função que cadasta as despesas**
***********************************/
function cadastrarDespesa(){
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
	
	let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
	// if responsável por validar as informações cadastradas
	if(despesa.validarDados()){
		bd.gravar(despesa)
		
		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso!'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'
		
		$('#modalRegistroDespesa').modal('show')
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''

	}else{
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do arquivo!'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Existem campos vazios!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'
		$('#modalRegistroDespesa').modal('show')
	}
}
function carregaListaDespesas(despesas = Array(), filtro = false){
	//array responsável por receber os valores do array da função recuperarTodosRegistros
	if (despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}
	//seleciona o elemento tbody da tabela
	let listaDespesas = document.getElementById('listaDespesas')
	listaDespesas.innerHTML = ''

	/*
	<tr>
        <td>Data</td>
        <td>Alimentação</td>
	    <td>Descrição</td>
    	<td>Valor</td>        
  	</tr>
  	*/
  
  	//percorrer o array despesas, listando cada despesa de forma dinâmica
  	despesas.forEach( function(d) {
  		// statements
 		
  		//criando a linha (tr)
  		let linha = listaDespesas.insertRow()

  		//criar as colunas (td)
  		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

  		//ajustando tipo 
  		switch (d.tipo) {
  			case '1': d.tipo = 'Alimentação'
  				break;
  			case '2': d.tipo = 'Educação'
  				break;
			case '3': d.tipo = 'Lazer'
  				break;
			case '4': d.tipo = 'Saúde'
  				break;
  			case '5': d.tipo = 'Transporte'
  				break;
  		}
  		linha.insertCell(1).innerHTML = d.tipo
  		linha.insertCell(2).innerHTML = d.descricao
  		linha.insertCell(3).innerHTML = d.valor

  		//criar botão de exclusão
  		let btn = document.createElement("button")
  		btn.className = 'btn btn-danger'
  		btn.innerHTML = '<i class="fas fa-times"></i>'
  		btn.id = `id_despesa_${d.id}`
  		btn.onclick = function(){
  			//remover a despesa  			
  			let id = this.id.replace('id_despesa_', '')
  			// alert(id)
  			bd.remover(id)

  			window.location.reload()
  		}
  		linha.insertCell(4).append(btn)
  		
  	})
}

/***Recupera todos registros um a um***
***************************************/
function pesquisarDespesa(){
	let ano = document.getElementById('ano').value
	let mes = document.getElementById('mes').value
	let dia = document.getElementById('dia').value
	let tipo = document.getElementById('tipo').value
	let descricao = document.getElementById('descricao').value
	let valor = document.getElementById('valor').value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)
	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)
}
