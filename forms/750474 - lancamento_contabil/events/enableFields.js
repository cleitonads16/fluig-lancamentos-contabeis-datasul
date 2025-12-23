function enableFields(form){ 


    var activity = getValue("WKNumState");
    var modo = form.getFormMode();



    if(activity == 7 || activity == 56 || activity == 74){
        tableEnabledFields(form);
        form.setEnabled('nome_l', false);
        form.setEnabled('data_l', false);
        form.setEnabled('consulta_numero_sc', false);
        form.setEnabled('aprov_contabil', false);
        form.setEnabled('numeroNf',false);
        form.setEnabled('serie',false);
        form.setEnabled('codFornecedor',false);
        activity == 74 ? form.setEnabled('motivo_reprov_gestor', true) : form.setEnabled('motivo_reprov_gestor', false);
    }

    if(activity == 11){
        tableEnabledFields(form);
        form.setEnabled('nome_l', false);
        form.setEnabled('data_l', false);
        form.setEnabled('consulta_numero_sc', false);
        form.setEnabled('aprov_contabil', false);
         form.setEnabled('numeroNf',false);
        form.setEnabled('serie',false);
        form.setEnabled('codFornecedor',false);
    }

}

function tableEnabledFields(form){

    var tableAccounts = form.getChildrenIndexes("contas");

    for (var i = 0; i < tableAccounts.length; i++) {
        form.setEnabled("tb_conta___" + tableAccounts[i], false);
        form.setEnabled("tb_des_conta___" + tableAccounts[i], false);
        form.setEnabled("tb_credito_debito___" + tableAccounts[i], false);
        form.setEnabled("tb_un___" + tableAccounts[i], false);
        form.setEnabled("tb_des_un___" + tableAccounts[i], false);
        form.setEnabled("tb_cc___" + tableAccounts[i], false);
        form.setEnabled("tb_des_cc___" + tableAccounts[i], false);
        form.setEnabled("tb_valor___" + tableAccounts[i], false);
        form.setEnabled("tb_estabelecimento___" + tableAccounts[i], false);
        form.setEnabled("tb_historico___" + tableAccounts[i], true);
    }
}

