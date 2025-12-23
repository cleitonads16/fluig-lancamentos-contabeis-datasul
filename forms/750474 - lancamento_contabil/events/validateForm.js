function validateForm(form){

    var atividade = getValue('WKNumState');
    var erros = [];
    var data_type = form.getValue('tipo_l');
    var accounts_table = form.getChildrenIndexes("contas");
    var row_fields = accounts_table.length;
    

    var validacoes = {

        6: [

            { campo: "nome_l", mensagem: "Nome do Lançamento" },
            { campo: "motivo_l", mensagem: "Motivo do lançamento" },
            { campo: "data_l", mensagem: "Data do lançamento" },
            { campo: "aprov_contabil", mensagem: "Aprovador Contábil" },           
            { condicao: form.getValue("motivo_l") == "3", campos: [
                { campo: "consulta_numero_sc", mensagem: "Selecione o número de uma solicitação Fluig" },
            ]},
            
        ],

        30: [

            { campo: "nome_l", mensagem: "Nome do Lançamento" },
            { campo: "motivo_l", mensagem: "Motivo do lançamento" },
            { campo: "area_aprov", mensagem: "Selecione uma opção no campo: Área para aprovação" },
            { campo: "tipo_l", mensagem: "Selecione uma opção no campo: Origem dos dados" },
            { campo: "aprov_contabil", mensagem: "O campo: Aprovador Contábil é obrigatório" },
            { condicao: form.getValue("motivo_l") == "3", campos: [
                { campo: "consulta_numero_sc", mensagem: "Selecione o número de uma solicitação Fluig" },
            ]},
        ],

        7: [

            { campo: "option_aprov_1", mensagem: "Selecione uma opção em: Aprovar Solicitação" },
            { condicao: form.getValue("option_aprov_1") == "reprovado", campos: [
                { campo: "motivo_reprovacao_1", mensagem: "Informe o motivo da reprovação" },
            ]},
        ],

        11: [

            { campo: "option_aprov_2", mensagem: "Selecione uma opção em: Aprovar Solicitação" },
            { condicao: form.getValue("option_aprov_2") == "reprovado", campos: [
                { campo: "motivo_reprovacao_2", mensagem: "Informe o motivo da reprovação" },
            ]},
        ], 

        56: [

            { campo: "option_analise_contabil", mensagem: "Informe o status da análise" },
            { condicao: form.getValue("option_analise_contabil") == "corrigir", campos: [
                { campo: "motivo_reprov_analis_cont", mensagem: "Informe o motivo da reprovação" },
            ]},
        ],

        74: [
            { campo: "option_aprov_gestor", mensagem: "Selecione uma opção em: Aprovar Solicitação" },
            { condicao: form.getValue("option_aprov_gestor") == "reprovado", campos: [
                { campo: "motivo_reprov_gestor", mensagem: "Informe o motivo da reprovação" },
            ]},
        ]
    }

    if(atividade == 6){
        tableFields(row_fields);
    }

    // funcao auxiliar para validar os campos
    function validarCampos(campos) {
        for (var i = 0; i < campos.length; i++) {
            if (campos[i].condicao !== undefined) {
                if (campos[i].condicao) {
                    validarCampos(campos[i].campos);
                }
            } else {
                if (form.getValue(campos[i].campo) == "") {
                    erros.push("<li style='color: red'>" + campos[i].mensagem + "</li>");
                }
            }
        }
    }

    // executa as validacoes para a atividade atual
    if (validacoes[atividade]) {
        validarCampos(validacoes[atividade]);
    }

    // lanca o erro se houver mensagens acumuladas
    if (erros.length > 0) {
        throw ("<h3><b>Favor informar os campos obrigatórios:</b></h3>" + erros.join("") + "\n");
    }

   
    if(data_type == 'manual'){

        if (row_fields == 0) {
            throw "<strong>Favor Clicar no Botão para ADICIONAR CONTA</strong>"
        }

        tableFields(row_fields);

    }

    function tableFields(row_fields) {
        var requiredFields = {
            "codigo_conta": "CONTA",
            "tb_credito_debito": "D/C",
            "tb_valor": "VALOR",
            "tb_estabelecimento": "ESTABELECIMENTO",
            "tb_historico": "HISTÓRICO"
        };
    
        for (var i = 0; i < row_fields; i++) {
            var rowIndex = accounts_table[i];
            for (var field in requiredFields) {
                if (form.getValue(field + "___" + rowIndex) == "") {
                    throw "<strong>Favor preencher o campo " + requiredFields[field] + "</strong>";
                }
            }
    
            var codigoConta = form.getValue("codigo_conta___" + rowIndex);
            var codigoCC = form.getValue("codigo_cc___" + rowIndex);
            
    
            if (!codigoConta.match(/^[12973468]/) && codigoCC == "") {
                throw "<strong>Favor preencher o campo CENTRO DE CUSTO</strong>";
            }
        }
    }
    
}
