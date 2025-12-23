function beforeSendValidate(form) {

    var fileInput = $('#planilha'); // ID do campo file no formulário
    var optionSelect = $('#motivo_l'); 
    var activity = $('#code_activity');
    var insertManual = $('#tipo_l');
    var codeActiv = parseInt(activity.val());

    var total_credito = fieldsFloat($("#valor_total_credito").val());
    var total_debito = fieldsFloat($("#valor_total_debito").val());
    var compara = parseFloat(total_credito) === parseFloat(total_debito);

    if(codeActiv <= 6 && optionSelect.val() != "3" && insertManual.val() == 'upload'){
        
        if (fileInput.val() === "") {
            throw "<b>Upload de tabela Ecxel é obrigatório, clique em escolher arquivo e selecione a tabela padrão.<b>";
        }

        var file = fileInput[0].files[0].name; // Obtém o arquivo anexado
        var typeFile = file.split(".");

        var allowedTypes = ['xlsx']; // Tipos permitidos
        if (allowedTypes.indexOf(typeFile[1]) === -1) {
            throw "Upload deve ser Ecxel, do tipo .xlsx";
        }

    }

    if(codeActiv <= 6 && !compara) {
        throw "<b>O total de Débito deve ser igual ao total de Crédito.</b>";
    }
   

    
}

function fieldsFloat(valor){

    var total_credito_debito = parseFloat(valor.replace("R$", "").trim().replace(/\./g, "").replace(",", "."));
    return total_credito_debito.toFixed(2);
}