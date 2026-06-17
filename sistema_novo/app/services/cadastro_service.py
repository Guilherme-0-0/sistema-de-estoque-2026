from app.models.cadastro_model import CadastroEstoque
from app.models.movimentacao_model import MovimentacaoEstoque
from datetime import datetime
from flask import request

class CadastroService:
        @staticmethod # Serviço de cadastro do produto
        def adicionar_produto(nome_produto, codigo_de_barras, quantidade, lote, validade, categoria, modo_rapido, caminho_imagem, responsavel_atual):
          
            # 2. Conversão e formatação da data
            try:
              datetime_validade = datetime.strptime(validade, '%d/%m/%Y') #conversão para datetime em formato brasileiro
            except ValueError:
                datetime_validade = datetime.fromisoformat(validade)
        
            validade_int = int(datetime_validade.timestamp()) #transfere para timestamp que pegar o valor da data em um número inteiro
            validade_text = datetime_validade.strftime('%d/%m/%Y') #formata a data para uma string por exemplo 31/12/2024

            #modo rápido de cadastro de produto
            if modo_rapido:

                produtoExistente = CadastroEstoque.adicionar_quantidade(codigo_de_barras, quantidade, validade_text)
                sucesso = produtoExistente is not None
                movimentacaoDoproduto = MovimentacaoEstoque.registrar_movimentacao(codigo_de_barras, quantidade, "Adicionar", )
                if sucesso:
                  return f"Produto '{nome_produto}' atualizado com sucesso. Quantidade adicionada: {quantidade}."
                else:
                  return f"Erro ao atualizar o produto '{nome_produto}'."

            #modo normal de cadastro de produto
            else:
                adicionarProduto = CadastroEstoque.cadastrar_produto(nome_produto, codigo_de_barras, quantidade, lote, validade_int, validade_text, caminho_imagem, categoria)
                #registroMovimentacao = MovimentacaoEstoque.registrar_movimenta
                if adicionarProduto is not None:
                  return f"Produto '{nome_produto}' cadastrado com sucesso."
                else:
                  return f"Erro ao cadastrar o produto '{nome_produto}'."
                
                
            
