import mimetypes

class ImageProcessingUtil:
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'} #criamos um conjunto de extensões permitidas para imagens

    @staticmethod
    def process_image(nomeArquivo: str) -> tuple[bool, str | None]: #criamos uma função para processar a imagem e verificar se é permitida
                                                                    # e saber qual é o tipo MIME correto para a imagem
                                                                    #-> tuple[bool, str | None] este trechop serve para solidificar a saída dda função tornando a imutavel
                                                                    #a alterações, onde o primeiro valor do tuple é um booleano que indica se a extensão é permitida
                                                                    #  e o segundo valor é uma string que indica o tipo MIME correto para a imagem

        if not nomeArquivo or '.' not in nomeArquivo: #verificamos se o nome do arquivo é válido e se contém uma extensão
            return False
        
        extensao = nomeArquivo.rsplit('.', 1)[1].lower() #recortamos o nome do arquivo para obter a extensão e transformamos
                                                         #em minúsculo para padronizar a verificação

        if extensao in ImageProcessingUtil.ALLOWED_EXTENSIONS: #através do conjunto de extensões permitidas verificamos se a extensão do arquivo é permitida
            mime,_ = mimetypes.guess_type(nomeArquivo)#utilizamos a função guess_type da biblioteca mimetypes para obter o tipo MIME correto para a imagem
            if not mime: #caso não seja possível obter o tipo MIME correto, retornamos False e None
                return False, None
            return True, mime#se não houver problemas, retornamos True e o tipo MIME correto para a imagem
        return False, None #caso nenhuma das condições acima seja atendida, retornamos False e None, indicando que a extensão do arquivo não é permitida
