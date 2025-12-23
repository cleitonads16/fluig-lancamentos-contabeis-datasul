function beforeTaskSave(colleagueId,nextSequenceId,userList){

	var task_code = getValue("WKNumState");
	var cod_process = getValue("WKNumProces");
	var aprov_controller = hAPI.getCardValue('aprov_controller');
	var applicant = hAPI.getCardValue('emailFluigSolicitante');
	var approver = hAPI.getCardValue('emailFluigAprov');
	var nameApplicant = hAPI.getCardValue('responsavel'); 
	var nameApprover = hAPI.getCardValue('responsavel_aprov_1');
	var statusApprover = hAPI.getCardValue('option_aprov_1')
	var textObservation = hAPI.getCardValue('motivo_reprovacao_1');
	var url = hAPI.getCardValue('url_atual');
	var parameters = new java.util.HashMap();
    var recipient = new java.util.ArrayList();

	if(task_code <= 6 || task_code == 30){
		
		var docs = hAPI.listAttachments();		
		var total_anexos = docs.size();
		
		if(total_anexos == 0){
			throw ("<strong>Anexo obrigatório para iniciar a solicitação, Clique na aba, (Anexos) para upload do arquivo.</strong>");
		}

		notificationApprover(
			parameters,
			recipient,
			url,
			cod_process,
			nameApplicant,
			nameApprover,
			approver
		);
	
	}

	if(task_code == 7){
		if(statusApprover == 'reprovado'){
			statusApprover = 'Reprovada';
			notificationApplicant(
				parameters,
				recipient,
				url,
				cod_process,
				applicant,
				nameApplicant,
				statusApprover,
				nameApprover,
				textObservation
			);
		}else{
			statusApprover = 'Aprovada';
			if(textObservation == "") textObservation = 'Campo observação não foi preenchido'
			if(aprov_controller == "true"){
				nameApprover = approverController();
				notificationApprover(
					parameters,
					recipient,
					url,
					cod_process,
					nameApplicant,
					nameApprover,
					approver
				);
			}
			
		}

	}

	if(aprov_controller == "true"){
		if(task_code == 11 || task_code == 20){
			gerarLotesDatasul();
		}	
	}else{
		if(task_code == 7 || task_code == 11 || task_code == 20){
			gerarLotesDatasul();			
		}
	}

}

function gerarLotesDatasul(){


	try {

		var registration = hAPI.getCardValue('matriculaFluig');
		var responsible = hAPI.getCardValue('responsavel');
		var releaseName = hAPI.getCardValue('nome_l');
		var releaseDate = hAPI.getCardValue('data_l');
		var dateDefault = releaseDate.replaceAll("/", ""); 
		var activity = getValue("WKNumState");
		var usuario = getValue('WKUser');
		var processo = getValue("WKNumProces");
		var document_id = getValue("WKFormId")
		var card_id = getValue("WKCardId");
		var campos   = hAPI.getCardData(processo);
		var contador = campos.keySet().iterator();

		var data = {
			"lancamento": []
		};

		while (contador.hasNext()) {

			var id = contador.next();
		
			if (id.match(/tb_conta___/)) {

				var campo = campos.get(id);
				var seq   = id.split("___");
				var nextSequenceId = parseInt(seq[1]);



				var account = campos.get("codigo_conta___" + seq[1]);
				var creditDebit = campos.get("tb_credito_debito___" + seq[1]);
				var costCenter = campos.get("codigo_cc___" + seq[1]);
				var listValue = campos.get("tb_valor___" + seq[1]);
				var valorMontante = campos.get("montante_valor___" + seq[1]);
				var monante = parseFloat(valorMontante);
				var establishment = campos.get("codigo_estab___" + seq[1]);
				var history = campos.get("tb_historico___" + seq[1]);


				
				data["lancamento"].push(
					{
						"Empresa":"100",
						"Data_lancamento":"" + dateDefault,
						"Tipo_documento":"16",
						"Moeda":"BRL",
						"Referencia":null,
						"Texto": "" + releaseName + " - Integração Manual Fluig: " + processo,
						"Local_Negocio":"" + establishment,
						"Item": nextSequenceId,
						"Conta_contabil":"" + account,
						"Centro_custo":"" + costCenter,
						"Material":null,
						"Centro":"" + establishment,
						"Cliente":null,
						"Texto_item":"" + history,
						"Razao_especial":null,
						"Condicao_pagamento":null,
						"Forma_pagamento":null,
						"Bloqueio_pagamento":null,
						"Atribuicao":null,
						"Ordem":null,
						"Chave_ref_Item_doc":null,
						"Quantidade":null,
						"Unidade_medida":null,
						"Pedido_Compra":null,
						"Item_pedido_compra":null,
						"Conta_conciliacao":"1",
						"Periodo_contabil":"08",
						"Tipo_avaliacao":null,
						"Banco_empresa":null,
						"Montante": monante,
						"Imobilizado":null,
						"Sub_ativo":null,
						"Chave_Debito_Credito":"" + creditDebit,
						"Data_documento":"" + dateDefault,
						"Id_usuario":"super"
					}
				);
			}
		}

		var jsonData = JSON.stringify(data);



		var getParameters = parametersService();
		var user = getParameters.get("userName");
		var password = getParameters.get("password");
		var c1 = DatasetFactory.createConstraint("contas", jsonData, jsonData, ConstraintType.MUST); 
		var c2 = DatasetFactory.createConstraint("userName", user, user, ConstraintType.MUST); 
		var c3 = DatasetFactory.createConstraint("password", password, password, ConstraintType.MUST); 
		var c4 = DatasetFactory.createConstraint("publisherId", registration, registration, ConstraintType.MUST); 
		var c5 = DatasetFactory.createConstraint("requestId", processo, processo, ConstraintType.MUST); 
		var constraints = new Array(c1, c2, c3, c4, c5);

		var dataset = DatasetFactory.getDataset('nomeEmpresa_ds_lacamento_contabil', null, constraints, null);

		var docnumber = dataset.getValue(0, 'NumeroDocumento');
		var status = dataset.getValue(0, 'status');
		var erro = dataset.getValue(0, 'Erro');
		var documentId = parseInt(dataset.getValue(0, 'id_document'));
		


		if(docnumber == "badRequest"){
			hAPI.setCardValue('erro_integracao', 'true');
			hAPI.setCardValue("documentGedId", documentId);
			hAPI.setCardValue("status", status);

		}else{
			hAPI.setCardValue("numero_documento", docnumber);
			hAPI.setCardValue("num_doc_form", docnumber);
			hAPI.setTaskComments(getValue('WKUser'), getValue('WKNumProces'), 0, "Número do Documento Gerado no Datasul: " + docnumber);
			hAPI.setCardValue('erro_integracao', 'false');
			hAPI.setCardValue("documentGedId", documentId);
		}
		
		
	} catch (error) {
		hAPI.setCardValue('erro_integracao', 'true');
		hAPI.setCardValue("documentGedId", documentId);
	}
}


function notificationApplicant(
	parameters, 
	recipient, 
	url, 
	id_process, 
	applicant,
	nameSol,
	statusAprov,
	nameAprov,
	obsText
){

	try {

		parameters.put("nome", nameSol);
		parameters.put("status_aprov", statusAprov);
		parameters.put("aprov_contabil", nameAprov);
		parameters.put("solicitacao", id_process.toString());
		parameters.put("obs", obsText);
		parameters.put("link", url + '/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + id_process);
		parameters.put("button", "ACESSAR SOLICITAÇÃO");
		parameters.put("subject", "APROVAÇÃO LANÇAMENTOS CONTÁBEIS , ID FLUIG Nº  " + id_process);

		recipient.add(applicant);
		
		notifier.notify("admin", "solicitante_lanc_contabil", parameters, recipient, "text/html");
} catch (error) {
		// erro no envio de email - mantido tratamento sem log
	}

}

function notificationApprover(
	parameters, 
	recipient, 
	url, 
	id_process,
	nameSol,
	nameAprov,
	approver
){

	try {

		parameters.put("nome", nameAprov);
		parameters.put("solicitante", nameSol);
		parameters.put("solicitacao", id_process.toString());
		parameters.put("button", "ACESSAR SOLICITAÇÃO");
		parameters.put("link", url + '/portal/p/1/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID=' + id_process);
		parameters.put("subject", "APROVAÇÃO LANÇAMENTOS CONTÁBEIS , ID FLUIG Nº  " + id_process);

		recipient.add(approver);
		
		notifier.notify("admin", "aprov_lanc_contabil", parameters, recipient, "text/html");
} catch (error) {
			// erro no envio de email - mantido tratamento sem log
	}

}


function approverController(){

	var ds = DatasetFactory.getDataset("nomeEmpresa_ds_aprov_controller", null, null, null);
	var colleague_id = "";

	if(ds){
		colleague_id = ds.getValue(0, "NOME");
	}else{
		colleague_id = "Aprovador não encontrado no papel 274"
	}
	
	return colleague_id;

}

function parametersService(){
	var getData = fluigAPI.getTenantService().getTenantData(["userName", "password"]);
	return getData;
}

