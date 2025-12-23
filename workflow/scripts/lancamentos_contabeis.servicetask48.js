function servicetask48(attempt, message) {
	
	var statusIntegracao = hAPI.getCardValue('erro_integracao');
	if(statusIntegracao == "true"){
		throw('- Acesse a aba formulário para visualizar os dados do arquivo');
	}
}