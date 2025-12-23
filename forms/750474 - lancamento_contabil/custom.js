$(document).ready(function(e){

    $('#valor_modal').mask('R$ 000.000.000.000.000,00', {reverse : true});
    $('#valor_modal_id02').mask('R$ 000.000.000.000.000,00', {reverse : true});
    $('#percentualModal_id02').mask('000,00', {reverse : true});
    
    //codigo da atividade atual
    var task = $("#code_activity").val();
    var codeTask = parseInt(task);

    //insere * para obrigatorios
    $(".required").each(function (index, value) {
		$(this).parent().find("label.control-label:first").append('<span class="text-danger"> *</span>');
	});

    //regra do modo para inserir dados
    $('#tipo_l').on('change', function(){
        var op = this.value;
        $('#set_value_origem_dados').val(op);
        switch(op){
            case "manual":
                $('#div_consult_sc').addClass('hide');
                $('#div_bottons').removeClass('hide');
                $('#div_upload').addClass('hide');
                $('#div_download').addClass('hide');
                $('.w3-centerRei').show();
                // $('#motivo_l').val('');
                removeTable('contas');
                updateRow();                           
                break;
            case "upload":
                $('#div_consult_sc').addClass('hide');
                $('#div_bottons').addClass('hide');
                $('#div_upload').removeClass('hide'); 
                $('#div_download').removeClass('hide'); 
                $('.w3-centerRei').hide();
                // $('#motivo_l').val('');
                removeTable('contas');
                updateRow();             
                break;
            case "solicitacao":
                $('#div_consult_sc').removeClass('hide');
                $('#div_upload').addClass('hide');
                $('#div_bottons').addClass('hide');
                $('#div_download').addClass('hide');
                $('#motivo_l').val('3');
                $('.w3-centerRei').hide(); 
                removeTagZoom('consulta_numero_sc');
                removeTable('contas');
                updateRow();             
                break;
            default:
        }
    });

    // regra para reversao
    $('#motivo_l').on('change', function(){
        var op = this.value;
        var select = $('#tipo_l');
        $('#set_value_motivo').val(op);
        if(op == "3"){
            $('#div_consult_sc').removeClass('hide');
            $('#div_upload').addClass('hide');
            $('#div_download').addClass('hide');
            $('#div_bottons').addClass('hide');
            $('#tipo_l').val('solicitacao').attr('disabled', true);
            $('.w3-centerRei').hide(); 
            select.find('option[value="nota"]').remove();
            removeTable('contas');
            $('.provisao').removeClass('col-md-3').addClass('col-md-4');

        }else if(op == "7"){
            $('#div_num_nf').show();
            $('#div_consult_sc').addClass('hide');
            $('#div_upload').addClass('hide');
            $('#div_download').addClass('hide');
            select.find('option[value="nota"]').length > 0;
            select.append('<option value="nota">Consulta de Nota Fiscal</option>');
            $('#tipo_l').val('nota').attr('disabled', true);
            removeTable('contas');
            $('.provisao').removeClass('col-md-3').addClass('col-md-4');

        }else if(op == "2"){
            $('#div_area_aprov').removeClass('hide');
            $('.provisao').removeClass('col-md-4').addClass('col-md-3');

        }else{
            $("#num_sc_rervertida").val('');
            $('#div_num_nf').hide();
            $('#tipo_l').val('').attr('disabled', false);
            $('#div_num_nf').hide();
            select.find('option[value="nota"]').remove();
            $('#div_consult_sc').addClass('hide');
            $('#div_bottons').addClass('hide');
            $('#div_upload').addClass('hide');
            $('#div_download').addClass('hide');
            $('#div_area_aprov').addClass('hide');
            $('.provisao').removeClass('col-md-3').addClass('col-md-4');
        }
    });

    // upload de planilha execel
    $('#planilha').change(function() {
        $('#div_tabela').removeClass('hide');
        $('#div_valor_total').removeClass('hide');
        $('#div_valor_total_debito').removeClass('hide');
        $('#div_valor_total_credito').removeClass('hide');
         
        var file = this.files[0];
        var reader = new FileReader();
    
        reader.onload = function(e) {
            var data = new Uint8Array(e.target.result);
            var workbook = XLSX.read(data, { type: 'array' });
        
            var firstSheetName = workbook.SheetNames[0];
            var worksheet = workbook.Sheets[firstSheetName];
        
            // Converte os dados para JSON, mantendo os títulos corrigidos
            var jsonDataRaw = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
            // Normaliza os nomes das colunas removendo espaços extras
            var jsonData = jsonDataRaw.map(row => {
                var cleanedRow = {};
                Object.keys(row).forEach(key => {
                    var cleanKey = key.trim();
                    cleanedRow[cleanKey] = row[key]; 
                });
                return cleanedRow;
            });
        
            for (var i = 0; i < jsonData.length; i++) {
                var row = wdkAddChild('contas');
                var account = jsonData[i]['Conta Datasul'];
                var creditDebit = jsonData[i]['D/C'];
                var costCenter = jsonData[i]['Centro Custo'];
                var listValue = jsonData[i]['Valor'];  
                var convertValue = parseFloat(listValue);
                var establishment = jsonData[i]['Estabelecimento'];
                var history = jsonData[i]['Histórico'];
                var inputValue = convertValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                var valorMontante = parseFloat(inputValue.replace("R$", "").trim().replace(/\./g, "").replace(",", "."));
        
                // Define os valores das colunas
                $('#tb_conta___' + row).val(account);
                $('#codigo_conta___' + row).val(account);
                $('#tb_credito_debito___' + row).val(creditDebit);
                $('#tb_cc___' + row).val(costCenter);
                $('#codigo_cc___' + row).val(costCenter);
                $('#tb_estabelecimento___' + row).val(establishment);
                $('#codigo_estab___' + row).val(establishment);
                $('#tb_historico___' + row).val(history);
                $('#tb_valor___' + row).val(inputValue); // Valor original para todas as linhas
                $('#montante_valor___' + row).val(valorMontante); 
            }
        
            setTimeout(function() {
                valueTotalAccount();
                updateRow();
                ruleAprovController();
                $('table[tablename="contas"] tbody tr').eq(0).hide();
            }, 500);
        };
    
        reader.readAsArrayBuffer(file);
    });
    

    // condicoes para visualizacao de div's aprovacoes
    $('#option_aprov_1').change(function(){
        var op = this.value;
        $('#set_value_aprov_contabil').val(op);
        if(op == 'reprovado'){
            $('#div_motivo_reprovacao_1').removeClass('hide');
        }else{
            $('#div_motivo_reprovacao_1').addClass('hide');
        }
    });

    $('#option_aprov_gestor').change(function(){
        var op = this.value;
        $('#set_value_gestor_aprov').val(op);
        if(op == 'reprovado'){
            $('#div_motivo_reprov_gestor').removeClass('hide');
        }else{
            $('#div_motivo_reprov_gestor').addClass('hide');
        }
    });

    $('#option_analise_contabil').change(function(){
        var op = this.value;
        $('#set_value_analis_contabil').val(op);
        if(op == 'corrigir'){
            $('#div_motivo_reprov_analis_cont').removeClass('hide');
        }else{
            $('#div_motivo_reprov_analis_cont').addClass('hide');
        }
    });

    $('#option_aprov_2').change(function(){
        var op = this.value;
        $('#set_value_aprov_controller').val(op);
        if(op == 'reprovado'){
            $('#div_motivo_reprovacao_2').removeClass('hide');
        }else{
            $('#div_motivo_reprovacao_2').addClass('hide');
        }
    });

    $('#area_aprov').change(function(){
        var op = this.value;
        $('#set_value_aprov_area').val(op);
    });

    // mantem regas de visualizacao de div's aprovadores
    $('#option_aprov_1').each(function(index, element){
        var op = element.value;
        if(op == 'reprovado'){
            $('#div_motivo_reprovacao_1').removeClass('hide');
        }else{
            $('#div_motivo_reprovacao_1').addClass('hide');
        }
   });

   $('#option_aprov_gestor').each(function(index, element){
        var op = element.value;
        if(op == 'reprovado'){
            $('#div_motivo_reprov_gestor').removeClass('hide');
        }else{
            $('#div_motivo_reprov_gestor').addClass('hide');
        }
   });

   $('#option_analise_contabil').each(function(index, element){
        var op = element.value;
        if(op == 'corrigir'){
            $('#div_motivo_reprov_analis_cont').removeClass('hide');
        }else{
            $('#div_motivo_reprov_analis_cont').addClass('hide');
        }
   });

   $('#option_aprov_2').each(function(index, element){
        var op = element.value;
        if(op == 'reprovado'){
            $('#div_motivo_reprovacao_2').removeClass('hide');
        }else if(op == 'aprovado'){
            $('#div_motivo_reprovacao_2').addClass('hide');
        }else {
            $('#div_motivo_reprovacao_2').addClass('hide');
        }
    });

    //mantem regra do modo para inserir dados
    $('#tipo_l').each(function(index, element){
        var op = element.value;       
        switch(op){
            case "manual":
                $('#div_consult_sc').addClass('hide');
                $('#div_bottons').addClass('hide');
                $('#div_upload').addClass('hide');                        
                $('#div_download').addClass('hide');                        
                break;
            case "upload":
                $('#div_consult_sc').addClass('hide');
                $('#div_bottons').addClass('hide');
                $('#div_upload').removeClass('hide');        
                $('#div_download').removeClass('hide');        
                break;
            case "solicitacao":
                $('#div_consult_sc').removeClass('hide');
                $('#div_upload').addClass('hide');
                $('#div_bottons').addClass('hide');          
                $('#div_download').addClass('hide');          
                break;
            default:
        }
    });

    $('#motivo_l').each(function(index, element){
        
        var op = element.value;
        
        if(op == "7"){
            $('#div_num_nf').show(); 
            $('#div_itens_nota').removeClass('hide');
            origemNotaFiscal();         
        } else if(op == "2"){
            $('#div_num_nf').hide(); 
            $('#div_area_aprov').removeClass('hide');
            $('.provisao').removeClass('col-md-4').addClass('col-md-3');

        }else {
            $('#div_num_nf').hide(); 
            $('#div_itens_nota').addClass('hide');  
            $('#div_area_aprov').addClass('hide');        
        }
    });

    //regras para reversao debito e credito
    $("#tabContas").on("blur", ".tb_credito_debito", function (event) {

        var valueUpperCase = this.value.toUpperCase();
        var idField = event.currentTarget.id;
        var getIndexField = idField.split('___');
        var index = getIndexField[1];

        if(valueUpperCase == 'D' || valueUpperCase == 'C'){
            $('#tb_credito_debito___' + index).val(valueUpperCase);
        }else{
            $('#tb_credito_debito___' + index).val('');
            FLUIGC.message.alert({
                message : 'O campo deve ser preenchido com: (D) para Débito ou (C) para Crédito.',
                title : 'ATENÇÃO!',
                label : 'OK'
            });
        }
      
    });

    //executa funcao para somar valores
    $("#tabContas").on("blur", ".tb_valor", function (event) {
        valueTotalAccount();
    });

    //condicoes executadas em tarefas especificas
    if(codeTask == 7 || codeTask == 11 || codeTask == 20) $('table[tablename="contas"] tbody tr').eq(0).hide();

    if(codeTask <= 6 || codeTask == 30){       
        $("#data_l").datetimepicker({
            pickDate : true,
            pickTime : false,
            language : 'pt-br',
            format : 'DD/MM/YYYY',
        });
    }

    $('#btn_file_view').on('click', function(){

        var url = $("#url_atual").val();
        var status = $("#status").val();
        var id = parseInt($('#documentGedId').val());

        if(id > 0){
            var file = url + '/portal/p/1/ecmnavigation?app_ecm_navigation_doc=' + id;
            window.open(file);
        }else{
            
            FLUIGC.message.alert({
                message: 'O arquivo não pode ser gerado devido ao seguinte erro ' + status,
                title: 'Falha na geração do arquivo:',
                label: 'OK'
            });

        }   
    });

    //Trata o campo de acordo com regras da API progress    
    $( "#numeroNf" ).mask('000000000', {reverse: true}).on( "blur", function() {
        
        let str = this.value;
        let strSemZeros = str.replace(/^0+/, '');
        let numCaracteres = strSemZeros.length;

        if (numCaracteres < 7) {
            strSemZeros = strSemZeros.padStart(7, '0');
        }

        $('#numeroNf').val(strSemZeros); 
		
	} );

    $("#credito_debito_modal").on("input", function () {
        var valorAtual = this.value.toUpperCase();
        if (valorAtual !== 'C' && valorAtual !== 'D') {
            $("#credito_debito_modal").val("")
            FLUIGC.toast({
                title: 'Atenção: ',
                message: "Esse campo deve ser preenchido com: (D) para Débito ou (C) para Crédito.",
                type: 'warning',
                time: 5000
		    });
        }
    });

    $("#credito_debito_modal_id02").on("input", function () {
        var valorAtual = this.value.toUpperCase();
        if (valorAtual !== 'C' && valorAtual !== 'D') {
            $("#credito_debito_modal_id02").val("")
            FLUIGC.toast({
                title: 'Atenção: ',
                message: "Esse campo deve ser preenchido com: (D) para Débito ou (C) para Crédito.",
                type: 'warning',
                time: 5000
		    });
        }
    });

    $("#btn_itemNota").on("click", function () {

        var numeroNf = $("#numeroNf").val();
        var serieNf = $("#serieNota").val();
        var codFornecedor = $("#codigoFornecedor").val();
        
        $("#div_itens_nota").removeClass('hide');

        if (!numeroNf || !serieNf || !codFornecedor) {
           msgBuscaNota(true);
        }else{
            removeTable('itens');
            dadosItemNf(numeroNf, serieNf, codFornecedor);
            adicionarClickLinhas();           
        }
        
    });

    $('#planilha').on('change', function() {
        var fileName = this.files[0] ? this.files[0].name : 'Nenhum arquivo escolhido';
        $('#file-text').text(fileName); 
    });

    $('#valor_modal_id02').on('blur', validarRateio);

});

const rowsPerPage = 7; // Número de linhas por página
var currentPage = 1;
var table = document.getElementById("tabContas");
var tbody = table.querySelector("tbody");
var rows = Array.from(tbody.querySelectorAll("tr")); // Todas as linhas da tabela

function displayRows() {

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    
    // Oculta todas as linhas
    rows.forEach((row, index) => {
        row.style.display = (index >= start && index < end) ? '' : 'none';
    });

    // Atualiza os botões de paginação
    updatePagination();
}

function updatePagination() {
    const totalPages = Math.ceil(rows.length / rowsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = '';
    
    // Criar o botão de exportar se não existir
    createExportButton();
    
    if (rows.length <= rowsPerPage) return;
    
    const maxVisiblePages = 3;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar para não mostrar a última página duas vezes
    if (totalPages > maxVisiblePages && endPage === totalPages) {
        endPage = totalPages - 1;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Botão "Anterior"
    if (currentPage > 1) {
        const prevButton = document.createElement("button");
        prevButton.innerText = "Anterior";
        prevButton.className = "btnPagination";
        prevButton.onclick = () => {
            currentPage--;
            displayRows();
        };
        paginationDiv.appendChild(prevButton);
    }
    
    // Botões de página
    for (let i = startPage; i <= endPage; i++) {
        const pageButton = document.createElement("button");
        pageButton.innerText = i;
        pageButton.className = "btnPagination";
        
        // Aplicar estilo ativo usando classe CSS
        if (currentPage === i) {
            pageButton.classList.add("active");
        }
        
        pageButton.onclick = () => {
            currentPage = i;
            displayRows();
        };
        paginationDiv.appendChild(pageButton);
    }
    
    // Última página (sempre mostrar se houver mais de maxVisiblePages)
    if (totalPages > maxVisiblePages && endPage < totalPages) {
        // Adicionar "..." se houver gap
        if (endPage < totalPages - 1) {
            const dotsSpan = document.createElement("span");
            dotsSpan.innerText = "...";
            dotsSpan.style.padding = "0 8px";
            dotsSpan.style.color = "#666";
            paginationDiv.appendChild(dotsSpan);
        }
        
        const lastPageButton = document.createElement("button");
        lastPageButton.innerText = totalPages;
        lastPageButton.className = "btnPagination";
        
        // Aplicar estilo ativo usando classe CSS
        if (currentPage === totalPages) {
            lastPageButton.classList.add("active");
        }
        
        lastPageButton.onclick = () => {
            currentPage = totalPages;
            displayRows();
        };
        paginationDiv.appendChild(lastPageButton);
    }
    
    // Botão "Próxima"
    if (currentPage < totalPages) {
        const nextButton = document.createElement("button");
        nextButton.innerText = "Próxima";
        nextButton.className = "btnPagination";
        nextButton.onclick = () => {
            currentPage++;
            displayRows();
        };
        paginationDiv.appendChild(nextButton);
    }
}

// function createExportButton() {
//     // Verificar se o container já existe
//     let exportContainer = document.getElementById("export-container");
//     if (!exportContainer) {
//         // Criar container de exportação
//         exportContainer = document.createElement("div");
//         exportContainer.id = "export-container";
        
//         // Criar botão de exportar
//         const exportButton = document.createElement("button");
//         exportButton.innerText = "Exportar Planilha";
//         exportButton.className = "btnExport";
//         exportButton.onclick = () => exportaExcel("tabContas", "lancamentos_contabeis"); 
        
//         exportContainer.appendChild(exportButton);
        
//         // Adicionar ao container principal da paginação
//         const paginationContainer = document.getElementById("pagination-container");
//         if (paginationContainer) {
//             paginationContainer.appendChild(exportContainer);
//         }
//     }
// }

function valueTotalAccount() {
    
    var valTotalCredito = 0;
    var valTotalDebito = 0;

    $("input[id^='montante_valor___']").each(function() {

        var index = $(this).prop('id').replace('montante_valor___', ''); 
        var valAux = $('#montante_valor___' + index).val();

        var valDigit = parseFloat(valAux);
        var tipo = $('#tb_credito_debito___' + index).val()
        tipo = tipo ? tipo.toUpperCase() : "";

        var valor = valDigit;
    
        if (tipo == 'C') {
            valTotalCredito += valor;
        } else if (tipo == 'D') {
            valTotalDebito += valor;
        }
        
    });

    var somaValTotalCredito = valTotalCredito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    var somaValTotalDebito = valTotalDebito.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    $("#valor_total_credito").val(somaValTotalCredito);
    $("#valor_total_debito").val(somaValTotalDebito);

    ruleAprovController();  
}

function parseValorBrasileiro(valor) {
    if (!valor) return 0;
    valor = valor.replace(/\./g, ''); 
    valor = valor.replace(',', '.'); 
    return parseFloat(valor);
}

function aprovController(valorTotal){

    var unit_value = parseFloat(valorTotal.replace(/\./g, "").replace(",", "."))
	var formatted_value = unit_value.toFixed(4);
	var controller;

    formatted_value > 100000.0000 ? controller = true : controller = false

	return controller

}

function setSelectedZoomItem(selectedItem) {

    const actions = {

        'consulta_numero_sc': () => {
            removeTable('contas');
            $("#num_sc_rervertida").val(selectedItem['ID_SOLICITACAO']);
            consultOnRequest(selectedItem['ID_SOLICITACAO']);
        },

        'aprov_contabil': () => {
            $("#matriculaFluig").val(selectedItem['MATRICULA']);
            $("#emailFluigAprov").val(selectedItem['EMAIL']);
            $("#responsavel_aprov_1").val(selectedItem['NOME']);
        },

        'serie': () => {
            $("#serieNota").val(selectedItem['SERIE']);
        },

        'codFornecedor': () => {
            $("#codigoFornecedor").val(selectedItem['CODIGO']);
        }
    };

    const action = actions[selectedItem.inputId];
    if (action) {
        action();
    }
}

function consultOnRequest(requestNumber){

    $('#div_tabela').removeClass('hide');
    $('#div_valor_total').removeClass('hide');
    $('#div_valor_total_debito').removeClass('hide');
    $('#div_valor_total_credito').removeClass('hide');
    $('.w3-centerRei').show();
    
    var c1 = DatasetFactory.createConstraint("number", requestNumber, requestNumber, ConstraintType.MUST); 
	var constraints = new Array(c1);  
	var ds = DatasetFactory.getDataset("nomeEmpresa_ds_account_table", null, constraints, null);

    var monanteValor;

    for(var i = 0; i < ds.values.length; i++){

        var row = wdkAddChild('contas');
        var debitOrCredit = ds.values[i]['DEBITO_CREDITO'];
        var updateHistory = ds.values[i]['HISTORICO'];
        var editDescription = updateHistory.split(" - ");
        var valor = ds.values[i]['VALOR'];
        monanteValor = parseFloat(valor.replace(/\./g, "").replace(",", "."));

        debitOrCredit == 'D' ? debitOrCredit = 'C' : debitOrCredit = 'D'

        $('#tb_conta___' + row).val(ds.values[i]['CONTA']);
        $('#codigo_conta___' + row).val(ds.values[i]['CODIGO_CONTA']);
        $('#tb_credito_debito___' + row).val(debitOrCredit);
        // $('#tb_un___' + row).val(ds.values[i]['UN']);
        $('#tb_cc___' + row).val(ds.values[i]['CC']);
        $('#codigo_cc___' + row).val(ds.values[i]['CODIGO_CC']);
        $('#tb_valor___' + row).val(valor);
        $('#montante_valor___' + row).val(monanteValor);
        $('#tb_estabelecimento___' + row).val(ds.values[i]['ESTABELECIMENTO']);
        $('#codigo_estab___' + row).val(ds.values[i]['CODIGO_ESTAB']);
        $('#tb_historico___' + row).val(editDescription[1]);

        valueTotalAccount()
    }

    updateRow();
    ruleAprovController();
    // $('table[tablename=contas] tbody tr')[0].remove();
    $('table[tablename="contas"] tbody tr').eq(0).hide();
    
}

function substringMatcher(strs) {
	return function findMatches(q, cb) {
		var matches, substrRegex;

		matches = [];

		substrRegex = new RegExp(q, 'i');

		$.each(strs, function (i, str) {
			if (substrRegex.test(str)) {
				matches.push({
					description: str
				});
			}
		});
		cb(matches);
	};
}

function updateRow(){
    rows = Array.from(tbody.querySelectorAll("tr")); 
    displayRows();
    $('table[tablename="contas"] tbody tr').eq(0).hide();
}

function ruleAprovController(){
    var getValueAccount = $("#valor_total_debito").val();
    var ruleController = aprovController(getValueAccount.replace("R$", "").trim());
    $('#aprov_controller').val(ruleController)
}


function removeTable(tableName) {
    if(tableName == "contas"){
        $('table[tablename=contas] tbody tr').not(':first').remove();
        $('#valor_total_debito').val("");
        $('#valor_total_credito').val("");
        $('#valor_total').val("");
    }else{
        $('table[tablename=itens] tbody tr').not(':first').remove();
    }
}
    

function removeTagZoom(fields){
    var numberRequest = document.getElementById(fields);
    var length = numberRequest.options.length;
    for (i = 0; i < length; i++) {
        numberRequest.options[i].remove();
    }
}


function exportaExcelTodasAsPaginas(tableId, nomeBaseArquivo){
    const tabela = document.getElementById(tableId);
    if (!tabela) { console.warn('Tabela não encontrada:', tableId); return; }

    // Nome do arquivo
    const hoje = new Date();
    const dataStr = ('0'+hoje.getDate()).slice(-2)+"-"+('0'+(hoje.getMonth()+1)).slice(-2)+"-"+hoje.getFullYear();
    const nomeArquivo = `${nomeBaseArquivo}_${dataStr}.xls`;

    // Determinar total de páginas
    let totalPages = 1;
    if (typeof window.rowsPerPage === 'number' && Array.isArray(window.rows)) {
        totalPages = Math.max(1, Math.ceil(window.rows.length / window.rowsPerPage));
    } else {
        const nums = Array.from(document.querySelectorAll('#pagination .btnPagination'))
        .map(b => parseInt(b.textContent, 10)).filter(n => !isNaN(n));
        if (nums.length) totalPages = Math.max(...nums);
    }

    // Guardar estado atual e ocultar para evitar flicker
    const paginaOriginal = window.currentPage || 1;
    const visAnterior = tabela.style.visibility;
    tabela.style.visibility = 'hidden';

    // Cabeçalho: copiar os TH visíveis (sem .hide/.remove)
    const thead = tabela.querySelector('thead');
    const colsHeader = [];
    if (thead) {
        thead.querySelectorAll('th').forEach(th=>{
        if (!th.classList.contains('hide') && !th.classList.contains('remove')) {
            colsHeader.push(th.textContent.trim());
        }
        });
    }

    // Coletar linhas únicas (como arrays de texto) de todas as páginas
    // --- 5) Percorrer todas as páginas e coletar as linhas (dedup por índice ___N)
    const seenKeys = new Set();
    const rowsData = [];

    // Função para achar o índice ___N típico do WDK/Fluig
    function getRowKey(tr){
        // procura um name/id com ___N (ex.: tb_conta___7)
        const el = tr.querySelector('input, select, textarea');
        if (el){
            const nm = (el.getAttribute('name') || el.id || '');
            const m = nm.match(/___(\d+)/);
            if (m) return m[1]; // “7”, “12”, etc.
        }
        // fallbacks comuns
        return tr.getAttribute('data-row-id') || tr.getAttribute('data-id') || null;
    }

    for (let p = 1; p <= totalPages; p++) {
        if (typeof window.displayRows === 'function') {
            window.currentPage = p;
            window.displayRows();
        }

        tabela.querySelectorAll('tbody tr').forEach(tr=>{
            // pega a chave única da linha
            const key = getRowKey(tr) || `p${p}-r${rowsData.length}`; // fallback bem raro

            if (seenKeys.has(key)) return; // já coletou esta linha em outra página
            seenKeys.add(key);

            // monta as células só das colunas visíveis (sem .hide / .remove)
            const cells = Array.from(tr.children)
            .filter(td => !td.classList.contains('hide') && !td.classList.contains('remove'))
            .map(td=>{
                const input  = td.querySelector('input:not([type="hidden"])');
                const area   = td.querySelector('textarea');
                const select = td.querySelector('select');
                if (input)  return (input.value || '').trim();
                if (area)   return (area.value || '').trim();
                if (select) {
                const opt = select.options[select.selectedIndex];
                return opt ? (opt.text || '').trim() : '';
                }
                const clone = td.cloneNode(true);
                clone.querySelectorAll('.remove, button, i, svg').forEach(el=>el.remove());
                return clone.textContent.replace(/\s+/g,' ').trim();
            });

            // descarta o template vazio (todas células em branco)
            if (cells.some(v => v !== '')) rowsData.push(cells);
        });
    }

    // Restaurar a página original
    if (typeof window.displayRows === 'function') {
        window.currentPage = paginaOriginal;
        window.displayRows();
    }
    tabela.style.visibility = visAnterior;

    // Construir uma tabela HTML limpa com cabeçalho e linhas únicas
    let html = '<table><thead><tr>';
    colsHeader.forEach(h=> html += `<th>${escapeHtml(h)}</th>`);
    html += '</tr></thead><tbody>';
    rowsData.forEach(row=>{
        html += '<tr>';
        row.forEach(cell=>{
        html += `<td>${escapeHtml(cell).replace(/\r\n|\r|\n/g,'<br>')}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table>';

    const meta = '<meta http-equiv="content-type" content="text/html; charset=UTF-8" />';
    const blob = new Blob([meta + html], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = nomeArquivo;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();

    // util
    function escapeHtml(s){
        return String(s)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
    }
}

// Botão
function createExportButton() {
  let exportContainer = document.getElementById("export-container");
  if (!exportContainer) {
    exportContainer = document.createElement("div");
    exportContainer.id = "export-container";
    const exportButton = document.createElement("button");
    exportButton.innerText = "Exportar Planilha";
    exportButton.className = "btnExport";
    exportButton.onclick = () => exportaExcelTodasAsPaginas("tabContas", "lancamentos_contabeis");
    exportContainer.appendChild(exportButton);
    const paginationContainer = document.getElementById("pagination-container");
    if (paginationContainer) paginationContainer.appendChild(exportContainer);
  }
}

// Ajuste o botão para chamar a função acima
// function createExportButton() {
//   let exportContainer = document.getElementById("export-container");
//   if (!exportContainer) {
//     exportContainer = document.createElement("div");
//     exportContainer.id = "export-container";

//     const exportButton = document.createElement("button");
//     exportButton.innerText = "Exportar Planilha";
//     exportButton.className = "btnExport";
//     exportButton.onclick = () => exportaExcelTodasAsPaginas("tabContas", "lancamentos_contabeis");

//     exportContainer.appendChild(exportButton);

//     const paginationContainer = document.getElementById("pagination-container");
//     if (paginationContainer) paginationContainer.appendChild(exportContainer);
//   }
// }

function abreFecha(abre, fecha, opc) {

	if (abre != "") {
		document.getElementById(abre).style.display = 'block'; //Abre						
		
	}
	if (fecha != "") {
		document.getElementById(fecha).style.display = 'none'; //Fecha				
	}

	$("#opcao").val(opc)
	
}

function addItens() {

    var opc = $("#opcao").val();
	var valid = validCamposModal(opc);
   
	if (valid) {

		if (opc == 'inclusao') {
            $('#div_tabela').removeClass('hide');
            $('#div_valor_total_debito').removeClass('hide');
            $('#div_valor_total_credito').removeClass('hide');
			abreFecha('', 'id01');			
			wdkAddChild('contas');
			dadosRegrasTabelaDeItens(opc)
            valueTotalAccount();
			limpaCamposModal();
            
		
		}else if (opc == 'rateio'){

            $('#div_tabela').removeClass('hide');
            $('#div_valor_total_debito').removeClass('hide');
            $('#div_valor_total_credito').removeClass('hide');
			abreFecha('', 'id02');			
			wdkAddChild('contas');                    
			dadosRegrasTabelaDeItens(opc)
            valueTotalAccount();
			limpaCamposModal();

        }else {//Caso seja edição, exclui linha anterior e adiciona uma nova 
			Javascript: fnWdkRemoveChild(oElementGlobal);
			$("#opcao").val('inclusao');
			addItens('');
			
		}

	}

}

function validCamposModal(opc) {

	var valid = true;
	var conta;
	var dc;
	var cc;
	var valor;
	var estabelecimento;
	var historico;

    const modais = {
        'inclusao': () => {

            conta = $("#codigo_conta_modal").val();
            dc = $("#credito_debito_modal").val();
            // cc = $("#centro_custo_modal").val();
            valor = $("#valor_modal").val();
            estabelecimento = $("#estabelecimento_modal").val();
            historico = $("#historico_modal").val();

        },

        'rateio': () =>{

            conta = $("#codigo_conta_modal_id02").val();
            dc = $("#credito_debito_modal_id02").val();
            cc = $("#centro_custo_modal_id02").val();
            valor = $("#valor_modal_id02").val();
            estabelecimento = $("#estabelecimento_modal_id02").val();
            historico = $("#historico_modal_id02").val();
        }
    };

    const modal = modais[opc];
    if (modal) {
        modal();
    }
	
	var v_campos = [conta, dc, cc, valor, estabelecimento, historico];

	v_campos.forEach(function (campo) {
		if (campo == "") {
			valid = false;
		}
	});

	if(valid == false){
		FLUIGC.toast({
			title: 'Atenção: ',
			message: "Preencha todos os campos obrigatórios, idicado com *",
			type: 'danger'
		});
	}

	return valid;
}

function dadosRegrasTabelaDeItens(opc){	

    var item;
    var conta;
    var dc;
    var cc;
    var valor;
    var valorMontante;
    var percentual;
    var estabelecimento;
    var historico;

    const modais = {

        'inclusao': () => {
            conta = $("#codigo_conta_modal").val();
            dc = $("#credito_debito_modal").val();
            cc = $("#centro_custo_modal").val();
            valor = $("#valor_modal").val();
            valorMontante = parseFloat(valor.replace("R$", "").replace(/\./g, "").replace(",", "."));
            estabelecimento = $("#estabelecimento_modal").val();
            historico = $("#historico_modal").val();
             $('.percentual').addClass('hide');
        },

        'rateio': () => {
            item = $("#set_cod_item").val();
            conta = $("#codigo_conta_modal_id02").val();
            dc = $("#credito_debito_modal_id02").val();
            cc = $("#centro_custo_modal_id02").val();
            valor = $("#valor_modal_id02").val();
            valorMontante = parseFloat(valor.replace(/\./g, "").replace(",", "."));         
            percentual = $("#percentualModal_id02").val()  + "%";	
            estabelecimento = $("#estabelecimento_modal_id02").val();
            historico = $("#historico_modal_id02").val();
            $('.w3-centerRei').show(); 
            $('.percentual').removeClass('hide');
            $("#btnAltera___" + newId).hide();
            // $('#div_bottonRateio').removeClass('hide');
        }
    };

    const modal = modais[opc];
    if (modal) {
        modal();
    }
	
	$('#item_rateado___' + newId).val(item);
	$('#tb_conta___' + newId).val(conta);
	$('#codigo_conta___' + newId).val(conta);
	$('#tb_credito_debito___' + newId).val(dc);
	$('#tb_cc___' + newId).val(cc);
	$('#codigo_cc___' + newId).val(cc);
	$('#tb_valor___' + newId).val(valor);
    $('#montante_valor___' + newId).val(valorMontante);
	$('#tb_percentualRateio___' + newId).val(percentual);
	$('#tb_estabelecimento___' + newId).val(estabelecimento);
	$('#codigo_estab___' + newId).val(estabelecimento);
	$('#tb_historico___' + newId).val(historico);

}

function limpaCamposModal() {

	$("#credito_debito_modal").val("");
	$("#valor_modal").val("");
	$("#historico_modal").val("");
    $("#credito_debito_modal_id02").val("");
	$("#valor_modal_id02").val("");
	$("#historico_modal_id02").val("");
	$("#percentualModal_id02").val("");
    
	var clearFields = [
        'codigo_conta_modal', 
        'centro_custo_modal', 
        'estabelecimento_modal',
        'codigo_conta_modal_id02', 
        'centro_custo_modal_id02', 
        'estabelecimento_modal_id02'
    ];

	clearFields.forEach(function (field) {
		removeTagZoom(field);
	});
}


function editaItens(oElement) {

    // Recuperar o valor do registro filho que está setado     
	var e_conta = $(oElement).closest('tr').find("input[id^='tb_conta___']").val();
    var e_dc = $(oElement).closest('tr').find("input[id^='tb_credito_debito___']").val();
    var e_cc = $(oElement).closest('tr').find("input[id^='tb_cc___']").val();
    var e_valor = $(oElement).closest('tr').find("input[id^='tb_valor___']").val();
    var e_estabelecimento = $(oElement).closest('tr').find("input[id^='tb_estabelecimento___']").val();
    var e_historico = $(oElement).closest('tr').find("textarea[id^='tb_historico___']").val();

    var fieldsModal = [
        'codigo_conta_modal', 
        'centro_custo_modal', 
        'estabelecimento_modal'
    ];

    fieldsModal.forEach(function (field) {
        removeTagZoom(field);
    });

    if (e_conta) setZoomData("codigo_conta_modal", e_conta);
    if (e_cc) setZoomData("centro_custo_modal", e_cc);
    if (e_estabelecimento) setZoomData("estabelecimento_modal", e_estabelecimento);
	
	$("#credito_debito_modal").val(e_dc);
	$("#valor_modal").val(e_valor);
	$("#historico_modal").val(e_historico);
	
	$("#opcao").val('edicao');	
	oElementGlobal = oElement;

	abreFecha('id01', '');
	
}

function setZoomData(instance, value) {
    window[instance].setValue(value)
}

function dadosItemNf(nf, serie, fornecedor){

    var c1 = DatasetFactory.createConstraint("numNf", nf, nf, ConstraintType.MUST);
    var c2 = DatasetFactory.createConstraint("serie", serie, serie, ConstraintType.MUST);
    var c3 = DatasetFactory.createConstraint("codFornecedor", fornecedor, fornecedor, ConstraintType.MUST);
    var constraints = new Array(c1, c2, c3);
    var ds = DatasetFactory.getDataset("nomeEmpresa_ds_consulta_nf_rateio", null, constraints, null);
    // var ds = DatasetFactory.getDataset("nomeEmpresa_ds_contasRateioTestes", null, constraints, null);

    if(ds && ds.values.length > 0){
        msgBuscaNota(false);
        
        for(var i = 0; i < ds.values.length; i++){

            var row = wdkAddChild('itens');
            var total = ds.values[i]['TOTAL_ITEM'];
            var totalFormatado = total.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            $('#tbRateioItem___' + row).val(ds.values[i]['ITEM']);
            $('#tbRateioConta___' + row).val(ds.values[i]['CONTA']);
            $('#tbRateioCC___' + row).val(ds.values[i]['CENTRO_CUSTO']);
            $('#tbRateioValor___' + row).val(totalFormatado);
            $('#tbRateioEstabelecimento___' + row).val(ds.values[i]['ESTABELECIMENTO']);
        }
        
    }else{
        msgBuscaNota(true);
    }
}

function iniciarRateioItens(oElement){

    var e_itemId02 = $(oElement).closest('tr').find("input[id^='tbRateioItem___']").val(); 
    var e_contaId02 = $(oElement).closest('tr').find("input[id^='tbRateioConta___']").val(); 
    var e_dcId02 = "D";     
    var e_valorId02 = $(oElement).closest('tr').find("input[id^='tbRateioValor___']").val();
    var e_estabelecimentoId02 = $(oElement).closest('tr').find("input[id^='tbRateioEstabelecimento___']").val();
    
    var saldo = exibeSaldoRateio(e_valorId02, e_contaId02, e_itemId02);
    
    if (saldo.valorRestante > 0) {

        setZoomData("codigo_conta_modal_id02", e_contaId02);
        setZoomData("estabelecimento_modal_id02", e_estabelecimentoId02);
        
        $("#credito_debito_modal_id02").val(e_dcId02).attr('disabled', true);
        $("#valorItem_modal_id02").val(e_valorId02).attr('disabled', true);
        $("#saldo_id02").val(formatValue(saldo.valorRestante));
        $("#percentRatear_id02").val(saldo.porcentagemRestante);
        $("#set_cod_item").val(e_itemId02);

        oElementGlobal = oElement;
        abreFecha('id02', '', 'rateio');

    }else{

        FLUIGC.toast({
            title: 'Atenção: ',
            message: "Não há saldo restante para rateio.",
            type: 'warning',
            time: 5000
        });
    }
    
	
}

function adicionarClickLinhas() {
    $('#tabItens tbody tr').off('click');

    $('#tabItens tbody tr').on('click', function(event) {
        if ($(event.target).is('button') || $(event.target).is('i')) return;

        var indice = $(this).index();

        var item = $(this).find('input[name*="tbRateioItem"]').val() || '';
        var conta = $(this).find('input[name*="tbRateioConta"]').val() || '';
        var centroCusto = $(this).find('input[name*="tbRateioCC"]').val() || '';
        var valor = $(this).find('input[name*="tbRateioValor"]').val() || '';
        var estabelecimento = $(this).find('input[name*="tbRateioEstabelecimento"]').val() || '';
        var _monanteValor = parseFloat(valor.replace(/\./g, "").replace(",", "."));

        var dadosLinha = {
            item: item,
            indice: indice,
            conta: conta,
            centroCusto: centroCusto,
            valor: valor,
            montante: _monanteValor,
            estabelecimento: estabelecimento
        };

        var existe = false;
        $('#tabContas tbody tr').each(function () {

            var itemRateado = $(this).find('.item_rateado').val();
            var contaExistente = $(this).find('.tb_conta').val();
            var ccExistente = $(this).find('.tb_cc').val();
            var estabExistente = $(this).find('.tb_estabelecimento').val();
            var percentual = $(this).find('.tb_percentualRateio').val();

            if (itemRateado === dadosLinha.item &&
                contaExistente === dadosLinha.conta && 
                ccExistente === dadosLinha.centroCusto &&
                estabExistente === dadosLinha.estabelecimento &&
                percentual === '100%') {
                existe = true;
                return false; // interrompe o loop
            }
        });

        if (existe) {
            FLUIGC.toast({ title: 'Aviso: ', message: 'Esta conta já foi adicionada.', type: 'warning' });
            return;
        }

        // Cria nova linha
        var novaLinha = wdkAddChild('contas');

        var linha = $('#tabContas tbody tr').last(); // pega a última inserida
        
        linha.find('.item_rateado').val(dadosLinha.item);
        linha.find('.tb_conta').val(dadosLinha.conta);
        linha.find('.codigo_conta').val(dadosLinha.conta);
        
        linha.find('.tb_cc').val(dadosLinha.centroCusto);
        linha.find('.codigo_cc').val(dadosLinha.centroCusto);

        linha.find('.tb_valor').val(dadosLinha.valor);
        linha.find('.montante_valor').val(dadosLinha.montante);
        linha.find('.tb_percentualRateio').val('100%')

        linha.find('.tb_estabelecimento').val(dadosLinha.estabelecimento);
        linha.find('.codigo_estab').val(dadosLinha.estabelecimento);

        linha.find('.tb_credito_debito').val('C');
        linha.find('.tb_historico').attr('readonly', false);
        linha.find('.btnAltera').hide();

        $('.w3-centerRei').show();
        $('.percentual').removeClass('hide');
        $('#div_tabela').removeClass('hide');
        $('#div_valor_total_debito').removeClass('hide');
        $('#div_valor_total_credito').removeClass('hide');
        valueTotalAccount();
        
    });

    $('#tabItens tbody tr').css('cursor', 'pointer');

    $('#tabItens tbody tr').off('mouseenter mouseleave').on('mouseenter', function(event) {
        const $target = $(event.target);

        // Supondo que 'Ratear' seja a 6ª coluna (índice 5)
        if ($target.closest('td').index() !== 5) {
            $(this).attr('title', 'Clique para inserir conta de crédito');
        } else {
            $(this).removeAttr('title');
        }
    });
}

function downloadPlanilha() {
    var url = 'padrao_lancamento_contabil_form.xlsx';
    var link = document.createElement('a');
    link.href = url;
    link.download = 'planilha_padrao.xlsx';
    link.click();
}

// Função para converter string com vírgulas para número
function parseValue(value) {
    if (!value) return 0;
    return parseFloat(value.toString().replace(/\./g, '').replace(',', '.')) || 0;
}

function formatValue(value) {
  // sempre "123456.78"
  const s = value.toFixed(2)
    // separa inteiro de decimal
    .replace('.', ',');       // “123456,78”

  // insere os pontos de milhar:
  // lookahead que coloca "." a cada 3 dígitos antes da virgula
  return s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}


// Função para calcular porcentagem baseada no valor do rateio
function calcularPorcentagem() {
    var valorTotalElement = document.getElementById('valorItem_modal_id02');
    var valorRateioElement = document.getElementById('valor_modal_id02');
    var percentualElement = document.getElementById('percentualModal_id02');

    var valorTotal = parseValue(valorTotalElement.value);
    var valorRateio = parseValue(valorRateioElement.value);
    
    if (valorTotal > 0 && valorRateio >= 0) {
        var percentual = (valorRateio / valorTotal) * 100;
        percentualElement.value = formatValue(percentual);
    } else if (valorTotal === 0) {
        percentualElement.value = '';
    }
}

// Função para calcular valor do rateio baseado na porcentagem
function calcularValorRateio() {
    var valorTotalElement = document.getElementById('valorItem_modal_id02');
    var valorRateioElement = document.getElementById('valor_modal_id02');
    var percentualElement = document.getElementById('percentualModal_id02');
    
    var valorTotal = parseValue(valorTotalElement.value);
    var percentual = parseValue(percentualElement.value);
    
    if (valorTotal > 0 && percentual >= 0) {
        var valorRateio = (valorTotal * percentual) / 100;
        valorRateioElement.value = formatValue(valorRateio);
    } else if (valorTotal === 0) {
        valorRateioElement.value = '';
    }
}

// Função universal para usar com onkeyup/oninput nos campos
function atualizarRateio(campo) {
    // Pequeno delay para garantir que o valor foi atualizado
    setTimeout(function() {
        if (campo === 'valor') {
            calcularPorcentagem();
        } else if (campo === 'porcentagem') {
            calcularValorRateio();
        }
    }, 10);
}

function msgBuscaNota(status){
    if(status == true){
        document.getElementById("pagination_itens").innerHTML = "<span style='color:red;'>Nota não encontrada</span>";
    }else{
        document.getElementById("pagination_itens").innerHTML = "";
    }
}

function exibeSaldoRateio(totalItem, conta, item) {

    var total = parseFloat(totalItem.replace(/\./g, '').replace(',', '.')) || 0;
    var totalDebito = 0;

    $("input[name*=tb_conta___]").each(function() {

        const index = this.name.split("___")[1]
        
        var dc = $('#tb_credito_debito___' + index).val();
        var itemVal = $('#item_rateado___' + index).val();
        var contaVal = $('#tb_conta___' + index).val();
        var valorStr = $('#tb_valor___' + index).val();

        if (dc === 'D' && conta === contaVal && String(item) === String(itemVal)) {
            if (valorStr) {
                
                var valor = parseFloat(valorStr.replace(/\./g, '').replace(',', '.')) || 0;
                totalDebito += valor;
            }
        }
    });

    var valorRestante = total - totalDebito;
    var porcentagemRestante = total > 0 ? (valorRestante / total) * 100 : 0;

    return {
        valorRestante: valorRestante,
        porcentagemRestante: porcentagemRestante.toFixed(2)
    };
}


function validarRateio() {
  
  var valorRateio = parseFloat($('#valor_modal_id02').val().replace(',', '.')) || 0;
  var saldoRatear = parseFloat($('#saldo_id02').val().replace(',', '.')) || 0;

  if (valorRateio > saldoRatear) {
  
    $('#valor_modal_id02').val('');
    
    FLUIGC.toast({
        title: 'Atenção: ',
        message: "O valor do Rateio está maior que o saldo a ratear, ajuste o valor.",
        type: 'warning',
        time: 5000
    });
    
    $('#valor_modal_id02').focus();
    
    return false;
  }
  
  return true;
}

function origemNotaFiscal(){
    var novaOption = document.createElement('option');
    novaOption.value = 'nota';
    novaOption.text = 'Consulta de Nota Fiscal';

    var select = document.getElementById('tipo_l');

    if (select) {
        select.appendChild(novaOption);
        select.value = 'nota'; 
    } 
}

function idSolicitacaoHistorico(){

    var idProcess = $("#numero_solicitacao").val();

    $('textarea[name*=tb_historico___]').each(function () {

        const index = this.name.split("___").pop();
        var valueHistorico = $('#tb_historico___' + index).val();
        var validIdProcess = valueHistorico.split(" - ")[0] === idProcess;
        const historicoInput = idProcess + ' - ' + $('#tb_historico___' + index).val();
    
        if(!validIdProcess){

            $('#tb_historico___' + index).val(historicoInput);
        }
        
    });
    
}


function habilitaOptionsMotivoLancamento(userContabil) {
    
    const papel = '386' // analistas contabeis
    var c1 = DatasetFactory.createConstraint("workflowColleagueRolePK.roleId", papel, papel, ConstraintType.MUST);
    var constraints = new Array(c1);
    var ds = DatasetFactory.getDataset("nomeEmpresa_workflowColleagueRole", null, constraints, null);
    var todos = ['1', '3', '4', '5', '6', '99'];
    var contabil = ['1', '2', '3', '4', '5', '6', '7', '99'];
    var encontrado = false;

    if (ds && ds.values.length > 0) {

        for (var i = 0; i < ds.values.length; i++) {

            var analista = ds.values[i]['workflowColleagueRolePK.colleagueId'];
            
            if (analista === userContabil) {
                encontrado = true;          
            } 
        }

        if(encontrado) {
            
            contabil.forEach(function(classOption){
                $('.' + classOption).removeClass('hide');
                $('#analista_contabil').val(analista);
            });
        }else {
            
            todos.forEach(function(classOption){
                $('.' + classOption).addClass('hide');
                $('#analista_contabil').val("");
            });
        }
        
    } 

}