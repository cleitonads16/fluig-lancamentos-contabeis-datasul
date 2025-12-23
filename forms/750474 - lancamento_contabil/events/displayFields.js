function displayFields(form,customHTML){ 
    
    var activity = getValue("WKNumState");
    var modo = form.getFormMode();
    var fieldMotivo = form.getValue('motivo_l');
    var fieldAreaAprov = form.getValue('set_value_aprov_area');
    var fieldOrigemDados = form.getValue('set_value_origem_dados');

    if (modo == 'VIEW') {
        form.setShowDisabledFields(true);
    }


    var areas = {
        'bio.logistic': "BIOMASSA LOGISTICA", 
        'comercial': "COMERCIAL", 
        'bio.operacao': "BIOMASSA OPERAÇÃO", 
        'bio.planejam': "BIOMASSA DESTOCA", 
        'bio.silvicul': "BIOMASSA SILVICULTURA", 
        'bio.manutenc': "BIOMASSA MANUTENÇÃO"
    };

    var descriptionArea = areas[fieldAreaAprov];

    // var fieldsAprov = {
    //     "option_aprov_gestor": option_aprov_gestor,
    //     "option_analise_contabil": option_analise_contabil,
    //     "option_aprov_1": option_aprov_1
    // };

    // var div = viewDivAprov(fieldsAprov);
    
    var today = new Date();
	var dy = today.getDate();
		dy = dy.toString();
		
	var mt = today.getMonth()+1;
		mt = mt.toString();
				
	if(dy.length == 1){
		dy = '0'+dy;
	}
		
	if(mt.length == 1){
		mt = '0'+mt;
	}
	
	var yr = today.getFullYear();
	var currentDate = dy+"/"+mt+"/"+yr;

    var c1 = DatasetFactory.createConstraint("colleaguePK.colleagueId", getValue("WKUser"), getValue("WKUser"), ConstraintType.MUST);
    var constraints = new Array(c1);
    var colaborador = DatasetFactory.getDataset("nomeEmpresa_colleague", null, constraints, null);

    const url = fluigAPI.getPageService().getServerURL();
	form.setValue("url_atual", url);

    customHTML.append(
        "<script>" +
        "$('#code_activity').val(" + activity + ");" +
        "$('.w3-centerRei').hide();" + 
        
        "</script>"
    );

    if(activity == 0){

        customHTML.append(
            "<script>" +
            "$('#data_solicitacao').val('" + currentDate + "');" + 
            "$('#responsavel').val('" + colaborador.getValue(0, "colleagueName") + "');" +
            "$('#emailFluigSolicitante').val('" + colaborador.getValue(0, "mail") + "');" +
            "$('#div_aprov_gestor').hide();" + 
            "$('#div_aprov_contabil').hide();" + 
            "$('#div_analise_contabil').hide();" +
            "$('#div_aprov_controller').hide();" + 
            "$('#div_arquivo').addClass('hide');" +
            "$('#div_num_nf').hide();" +     
            "habilitaOptionsMotivoLancamento('" + colaborador.getValue(0, "colleaguePK.colleagueId") + "')" +                 
            "</script>"
        );
       
    }

    if(activity == 74){
        customHTML.append(
            "<script>" +
            "$('#responsavel_gestor').val('" + colaborador.getValue(0, "colleagueName") + "');" +
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" + 
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "$('#planilha').attr('disabled',true);" +
            "$('#motivo_l').attr('disabled',true);" +
            "$('#area_aprov').attr('disabled',true);" +
            "$('#tipo_l').attr('disabled',true);" + 
            "$('#div_exportarPlanilha').removeClass('hide');" +
            "$('#div_arquivo').addClass('hide');" +
            "$('#div_aprov_contabil').hide();" +
            "$('#div_aprov_controller').hide();" + 
            "$('#div_modo_lancamento').hide();" + 
            "$('#btn_itemNota').attr('disabled', true);" +
            "$('.col_ratear').addClass('hide');" +
            // "$('#set_value_motivo').val('" + fieldMotivo + "');" +
            "updateRow();" +
            "idSolicitacaoHistorico();" +
            "$('#div_aprov_gestor').show();" +          
           "$('#div_analise_contabil').hide();" +
            "</script>"
        );
    }

    // analise contabil
    if(activity == 56){
        customHTML.append(
            "<script>" +
            "$('#responsavel_analise_contabil').val('" + colaborador.getValue(0, "colleagueName") + "');" +
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" + 
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "$('#planilha').attr('disabled',true);" +
            "$('#motivo_l').attr('disabled',true);" +
            "$('#area_aprov').attr('disabled',true);" +
            "$('#tipo_l').attr('disabled',true);" + 
            "$('#option_aprov_gestor').attr('disabled',true);" +
            "$('#div_exportarPlanilha').removeClass('hide');" +
            "$('#div_arquivo').addClass('hide');" +
            "$('#div_aprov_contabil').hide();" +
            "$('#div_aprov_controller').hide();" + 
            "$('#div_modo_lancamento').hide();" +
            "$('#btn_itemNota').attr('disabled', true);" +
            "$('.col_ratear').addClass('hide');" +
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#tipo_l').val('" + fieldOrigemDados + "');" + 
            "updateRow();" +
            "idSolicitacaoHistorico();" +   
            
            "</script>"
        );
    }

    // aprov contabil
    if(activity == 7){
        
        customHTML.append(
            "<script>" +          
            "$('#responsavel_aprov_1').val('" + colaborador.getValue(0, "colleagueName") + "');" +
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" + 
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "$('#div_aprov_controller').addClass('hide');" +
            "$('#planilha').attr('disabled',true);" +
            "$('#motivo_l').attr('disabled',true);" +
            "$('#area_aprov').attr('disabled',true);" +
            "$('#tipo_l').attr('disabled',true);" + 
            "$('#option_aprov_gestor').attr('disabled',true).val($('#set_value_gestor_aprov').val());" +
            "$('#div_exportarPlanilha').removeClass('hide');" +
            "$('#div_arquivo').addClass('hide');" +
            "$('#div_modo_lancamento').hide();" + 
            "$('#option_analise_contabil').attr('disabled',true).val($('#set_value_analis_contabil').val());" +   
            "$('#btn_itemNota').attr('disabled', true);" +
            "$('.col_ratear').addClass('hide');" + 
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#tipo_l').val('" + fieldOrigemDados + "');" +      
            "updateRow();" +
            "if($('#motivo_l').val() == '2') $('#div_aprov_gestor').show();" + 
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#analista_contabil').val() == '' ? $('#div_analise_contabil').show() : $('#div_analise_contabil').hide();" +
            "</script>"
        );
        
    }

    // aprov controller
    if(activity == 11){
        customHTML.append(
            "<script>" +          
            "$('#responsavel_aprov_2').val('" + colaborador.getValue(0, "colleagueName") + "');" +
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" +
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" +  
            "$('#planilha').attr('disabled',true);" +
            "$('#motivo_l').attr('disabled',true);" +
            "$('#area_aprov').attr('disabled',true);" +
            // "$('#option_aprov_1').attr('desabled',true);" +
            "$('#tipo_l').attr('disabled',true);" +
            "$('#option_aprov_gestor').attr('disabled',true).val($('#set_value_gestor_aprov').val());" + 
            "$('#option_analise_contabil').attr('disabled',true).val($('#set_value_analis_contabil').val());" +           
            "$('#option_aprov_1').attr('disabled',true).val($('#set_value_aprov_contabil').val());" +
            "$('#div_exportarPlanilha').removeClass('hide');" +
            "$('#div_arquivo').addClass('hide');" +
            "$('#div_modo_lancamento').hide();" +
            "$('#btn_itemNota').attr('disabled', true);" +
            "$('.col_ratear').addClass('hide');" +
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#tipo_l').val('" + fieldOrigemDados + "');" + 
            "updateRow();" +
            "if($('#motivo_l').val() == '2') $('#div_aprov_gestor').show();" + 
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#analista_contabil').val() == '' ? $('#div_analise_contabil').show() : $('#div_analise_contabil').hide();" +
            "</script>"
        );
    }

    // erro integracao
    if(activity == 20){

        

        customHTML.append(
            "<script>" +          
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" + 
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "if($('#option_aprov_2').val() == '') $('#div_aprov_controller').addClass('hide');" +
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#option_aprov_gestor').attr('disabled',true).val($('#set_value_gestor_aprov').val());" + 
            "$('#option_analise_contabil').attr('disabled',true).val($('#set_value_analis_contabil').val());" +           
            "$('#option_aprov_1').attr('disabled',true).val($('#set_value_aprov_contabil').val());" +
            "$('#option_aprov_2').attr('readonly',true).val($('#set_value_aprov_controller').val());" +
            "$('#motivo_reprovacao_1').attr('readonly',true);" +
            "$('#motivo_reprovacao_2').attr('readonly',true);" +
            "$('.w3-centerRei').show();" + 
            "$('#div_arquivo').removeClass('hide');" +
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "$('#tipo_l').val('" + fieldOrigemDados + "');" + 
            "updateRow();" +
            "if($('#motivo_l').val() == '2') $('#div_aprov_gestor').show();" + 
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#analista_contabil').val() == '' ? $('#div_analise_contabil').show() : $('#div_analise_contabil').hide();" +
            "</script>"
        );
    }

    // corecao solicitante
    if(activity == 30){
        customHTML.append(
            "<script>" +          
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" + 
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "if($('#option_aprov_2').val() == '') $('#div_aprov_controller').addClass('hide');" +
            "$('#option_aprov_gestor').attr('disabled',true).val($('#set_value_gestor_aprov').val());" +
            "$('#option_analise_contabil').attr('disabled',true).val($('#set_value_analis_contabil').val());" +           
            "$('#option_aprov_1').attr('disabled',true).val($('#set_value_aprov_contabil').val());" +
            "$('#motivo_reprov_analis_cont').attr('disabled',true);" +           
            "$('#motivo_reprov_gestor').attr('disabled',true);" +           
            "$('#option_aprov_2').attr('readonly',true);" +
            "$('#motivo_reprovacao_1').attr('readonly',true);" +
            "$('#motivo_reprovacao_2').attr('readonly',true);" +
            "$('.w3-centerRei').show();" + 
            "$('#div_arquivo').addClass('hide');" +
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "if($('#motivo_l').val() == '2') $('#div_aprov_gestor').show();" + 
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#tipo_l').val('" + fieldOrigemDados + "');" + 
            "$('#option_aprov_gestor').val() == '' ? $('#div_aprov_gestor').hide() : $('#div_aprov_gestor').show();" +
            "$('#option_analise_contabil').val() == '' ? $('#div_analise_contabil').hide() : $('#div_analise_contabil').show();" +
            "$('#option_aprov_1').val() == '' ? $('#div_aprov_contabil').hide() : $('#div_aprov_contabil').show();" +
            "$('#option_aprov_2').val() == '' ? $('#div_aprov_controller').hide() : $('#div_aprov_controller').show();" +
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
             "$('#analista_contabil').val() == '' ? $('#div_analise_contabil').show() : $('#div_analise_contabil').hide();" +
            "</script>"
        );
    }

    // fim
    if(activity == 16){

        customHTML.append(
            "<script>" +          
            "$('#div_tabela').removeClass('hide');" + 
            "$('#div_valor_total').removeClass('hide');" +
            "$('#div_valor_total_debito').removeClass('hide');" + 
            "$('#div_valor_total_credito').removeClass('hide');" + 
            "$('#div_num_doc_form').removeClass('hide');" +  
            "$('#div_responsavel').removeClass('col-md-4').addClass('col-md-3');" +  
            "$('#div_nome_lancamento').removeClass('col-md-4').addClass('col-md-3');" +  
            "$('#div_modo_lancamento').hide();" +  
            // "$('#div_responsavel').addClass('col-md-6');" +
            "$('#div_arquivo').removeClass('hide');" + 
            "$('.col_ratear').addClass('hide');" +
            "$('#motivo_l').val($('#set_value_motivo').val());" +
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#area_aprov').append('<option value=" + fieldAreaAprov + " selected>" + descriptionArea + "</option>');" + 
            "$('#tipo_l').val('" + fieldOrigemDados + "');" + 
            "$('#motivo_l').val() == '2' ? $('#div_aprov_gestor').show() : $('#div_aprov_gestor').hide();" +
            "$('#option_aprov_gestor').val($('#set_value_gestor_aprov').val());" +
            "$('#option_analise_contabil').val($('#set_value_analis_contabil').val());" +           
            "$('#option_aprov_1').val($('#set_value_aprov_contabil').val());" +
            "$('#option_aprov_2').val($('#set_value_aprov_controller').val());" +
            "$('#analista_contabil').val() == '' ? $('#div_analise_contabil').show() : $('#div_analise_contabil').hide();" +
            "</script>"
        );
    }

}

