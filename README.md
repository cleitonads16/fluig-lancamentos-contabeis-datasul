# Fluig – Lançamentos Contábeis com Integração Datasul

Este projeto tem como objetivo automatizar e centralizar o processo de **lançamentos contábeis no Fluig**, contemplando fluxo de aprovações, rateios por centro de custo, importação de planilhas Excel e integração automática com o ERP **Datasul**.

---

## 🎯 Objetivo

- Centralizar os lançamentos contábeis em um único sistema
- Reduzir erros manuais e uso de planilhas externas
- Garantir rastreabilidade, controle e conformidade
- Automatizar aprovações e integração com o Datasul

---

## 🧩 Funcionalidades Principais

### ✔️ Criação de Lançamentos Contábeis
- Registro de lançamentos diretamente no Fluig
- Anexo obrigatório de documentos
- Histórico do lançamento contendo o número da solicitação Fluig

### ✔️ Importação de Planilhas Excel
- Importação de dados contábeis via Excel
- Exibição e edição dos dados em tabela no formulário
- Integração automática após aprovação

### ✔️ Fluxo de Aprovação
- **Aprovação Contábil** (obrigatória)
- **Aprovação do Controller** (quando valor > R$ 100.000,00)
- Retorno ao solicitante em caso de reprovação

### ✔️ Rateios Contábeis
- Motivo específico: **7 – Rateios**
- Consulta de Nota Fiscal no Datasul
- Rateio por centro de custo com controle de saldo e percentual
- Interface via modal para rateio detalhado

### ✔️ Integração com Datasul
- Integração via **API Progress**
- Validação de campos obrigatórios
- Registro de logs e alertas em caso de falha
- Suporte a reversão de lançamentos

---

## 🔄 Fluxo do Processo (Resumo)

1. Solicitação de lançamento no Fluig
2. Importação ou preenchimento manual dos dados
3. Anexo obrigatório
4. Análise / Aprovação Contábil
5. Aprovação do Controller (quando aplicável)
6. Integração automática com o Datasul

---

## 🛠️ Tecnologias Utilizadas

- Fluig BPM
- HTML5
- JavaScript
- jQuery
- API Progress (Datasul)

---

## 🔐 Segurança e Governança

- Controle de acesso por grupos (ex: Analistas Contábeis)
- Histórico completo de aprovações e reprovações
- Conformidade com boas práticas de auditoria e LGPD

---

## 🏗️ Arquitetura da Solução

O Fluig atua como orquestrador do processo, centralizando formulários, regras de negócio e aprovações.  
A comunicação com o Datasul ocorre via API Progress para consulta e gravação de dados contábeis, garantindo consistência e automação ponta a ponta.

---

## 📈 Benefícios

- Eliminação de processos manuais
- Maior controle e rastreabilidade
- Redução de erros operacionais
- Ganho de produtividade nas áreas contábil e fiscal

---

## 📄 Licença

Projeto interno – uso corporativo.
