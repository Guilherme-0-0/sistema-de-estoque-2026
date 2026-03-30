"""
Script para corrigir problemas comuns automaticamente:
- Padronizar paths em templates
- Corrigir encoding
- Adicionar arquivos placeholder faltantes
"""

import os
import re
from pathlib import Path

def fix_template_paths(template_path):
    """Corrige paths em um template HTML."""
    try:
        with open(template_path, 'r', encoding='utf-8') as f:
            content = f.read()
    except UnicodeDecodeError:
        print(f"⚠️ Erro de encoding em {template_path.name}, tentando latin-1...")
        with open(template_path, 'r', encoding='latin-1') as f:
            content = f.read()
    
    original_content = content
    changes = []
    
    # Padroniza paths CSS: href="css/style.css" -> href="/static/css/style.css"
    def fix_css_path(match):
        path = match.group(1)
        if not path.startswith(('http://', 'https://', '//', '/static/')):
            if path.startswith('css/'):
                new_path = f'/static/{path}'
                changes.append(f"CSS: {path} -> {new_path}")
                return f'href="{new_path}"'
        return match.group(0)
    
    content = re.sub(r'href=["\']([^"\']*\.css)["\']', fix_css_path, content)
    
    # Padroniza paths JS: src="js/script.js" -> src="/static/js/script.js"
    def fix_js_path(match):
        path = match.group(1)
        if not path.startswith(('http://', 'https://', '//', '/static/')):
            if path.startswith('js/'):
                new_path = f'/static/{path}'
                changes.append(f"JS: {path} -> {new_path}")
                return f'src="{new_path}"'
        return match.group(0)
    
    content = re.sub(r'src=["\']([^"\']*\.js)["\']', fix_js_path, content)
    
    # Padroniza paths de imagens
    def fix_img_path(match):
        path = match.group(1)
        if not path.startswith(('http://', 'https://', '//', '/static/', 'data:')):
            if not path.startswith('img/'):
                new_path = f'/static/img/{path}'
            else:
                new_path = f'/static/{path}'
            changes.append(f"IMG: {path} -> {new_path}")
            return f'src="{new_path}"'
        return match.group(0)
    
    content = re.sub(r'src=["\']([^"\']*\.(png|jpg|jpeg|gif|webp|svg))["\']', 
                     fix_img_path, content, flags=re.IGNORECASE)
    
    # Salva se houver mudanças
    if content != original_content:
        with open(template_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Corrigido: {template_path.name}")
        for change in changes:
            print(f"   - {change}")
        return True
    
    return False

def create_placeholder_files():
    """Cria arquivos placeholder para recursos comuns faltantes."""
    base_dir = Path(__file__).parent
    
    placeholders = {
        'static/css/style.css': '/* Arquivo CSS principal */\n',
        'static/js/main.js': '// Arquivo JavaScript principal\n',
        'static/img/.gitkeep': '',
    }
    
    created = []
    for rel_path, content in placeholders.items():
        file_path = base_dir / rel_path
        if not file_path.exists():
            file_path.parent.mkdir(parents=True, exist_ok=True)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            created.append(rel_path)
            print(f"✅ Criado: {rel_path}")
    
    return created

def main():
    """Executa todas as correções."""
    print("=" * 60)
    print("🔧 CORREÇÃO AUTOMÁTICA DE PROBLEMAS")
    print("=" * 60)
    
    base_dir = Path(__file__).parent
    templates_dir = base_dir / 'templates'
    
    # 1. Cria arquivos placeholder
    print("\n📝 Criando arquivos placeholder...")
    created = create_placeholder_files()
    if not created:
        print("ℹ️ Nenhum arquivo placeholder necessário")
    
    # 2. Corrige templates
    print("\n📄 Corrigindo templates...")
    fixed_count = 0
    if templates_dir.exists():
        for template_file in templates_dir.glob('**/*.html'):
            if fix_template_paths(template_file):
                fixed_count += 1
    
    print("\n" + "=" * 60)
    print(f"✅ Correções concluídas!")
    print(f"   - {len(created)} arquivos criados")
    print(f"   - {fixed_count} templates corrigidos")
    print("=" * 60)

if __name__ == '__main__':
    main()
