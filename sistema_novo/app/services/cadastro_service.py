from app.models.cadastro_model import CadastroEstoque
from app.models.movimentacao_model import MovimentacaoEstoque
from datetime import datetime
from flask import request

class CadastroService:
        @staticmethod
        def adicionar_produto(nome_produto, codigo_de_barras, quantidade, lote, validade_int, validade_texto, imagem_caminho, categoria):
            
            # Puxar os dados do formulário de cadastro de /routes/cadastro_route.py
            modo_rapido = request.form('modo_rapido') == 'on'
            codigo_de_barras = int(request.form('codigo_de_barras', ''))
            validade = request.form('validade')
            

            try:
              quantidade_nova = int(request.form('quantidade', 0))
            except ValueError:
              raise ValueError("A quantidade deve ser um número válido.")

            # 2. Conversão e formatação da data
            try:
              datetime_validade = datetime.strptime(validade, '%d/%m/%Y') #conversão para datetime em formato brasileiro
            except ValueError:
                datetime_validade = datetime.fromisoformat(validade)
        
            validade_int = int(datetime_validade.timestamp()) #transfere para timestamp que pegar o valor da data em um número inteiro
            validade_text = datetime_validade.strftime('%d/%m/%Y') #formata a data para uma string por exemplo 31/12/2024

        
            if modo_rapido:
                produtoExistente = CadastroEstoque.adicionar_quantidade(codigo_de_barras, quantidade_nova, validade_text)
                movimentacaoDoproduto = MovimentacaoEstoque.re
                return produtoExistente
            else:
                #puxa os outros valores do formulário
                nome_produto = request.form('produto_nome')
                lote = request.form('lote','')
                categoria = request.form('categoria','')
                caminho_imagem = request.form('image_path')
                
            
