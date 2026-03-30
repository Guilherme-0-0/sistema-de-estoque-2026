"""
Script para verificar integridade do projeto:
- Links quebrados em templates
- Arquivos CSS/JS/imagens faltando
- Problemas de encoding
- Estrutura de diretórios
"""

import os
import re
from pathlib import Path

def verify_project_structure():
    """Verifica estrutura básica do projeto."""
    base_dir = Path(__file__).parent
    required_dirs = ['templates', 'static', 'static/css', 'static/js', 'static/img']
    required_files = ['app.py', 'translations.py']
    
    problems = []
    
    # Verifica diretórios
    for dir_path in required_dirs:
        full_path = base_dir / dir_path
        if not full_path.exists():
            problems.append(f"❌ Diretório faltando: {dir_path}")
            # Cria o diretório
            full_path.mkdir(parents=True, exist_ok=True)
            problems.append(f"✅ Diretório criado: {dir_path}")
        else:
            print(f"✅ Diretório OK: {dir_path}")
    
    # Verifica arquivos principais
    for file_path in required_files:
        full_path = base_dir / file_path
        if not full_path.exists():
            problems.append(f"❌ Arquivo faltando: {file_path}")
        else:
            print(f"✅ Arquivo OK: {file_path}")
    
    return problems

def find_resource_references(template_content, template_name):
    """Encontra referências a recursos (CSS, JS, imagens) em um template."""
    references = {
        'css': [],
        'js': [],
        'images': []
    }
    
    # CSS links
    css_pattern = r'href=["\']([^"\']*\.css)["\']'
    references['css'] = re.findall(css_pattern, template_content)
    
    # JS scripts
    js_pattern = r'src=["\']([^"\']*\.js)["\']'
    references['js'] = re.findall(js_pattern, template_content)
    
    # Imagens
    img_pattern = r'src=["\']([^"\']*\.(png|jpg|jpeg|gif|webp|svg))["\']'
    references['images'] = [match[0] for match in re.findall(img_pattern, template_content, re.IGNORECASE)]
    
    # Background images em CSS inline
    bg_pattern = r'background(?:-image)?:\s*url\(["\']?([^"\'()]+)["\']?\)'
    references['images'].extend(re.findall(bg_pattern, template_content, re.IGNORECASE))
    
    return references

def verify_templates():
    """Verifica todos os templates HTML."""
    base_dir = Path(__file__).parent
    templates_dir = base_dir / 'templates'
    static_dir = base_dir / 'static'
    
    problems = []
    
    if not templates_dir.exists():
        problems.append("❌ Diretório 'templates' não existe!")
        return problems
    
    for template_file in templates_dir.glob('**/*.html'):
        print(f"\n🔍 Verificando: {template_file.name}")
        
        try:
            with open(template_file, 'r', encoding='utf-8') as f:
                content = f.read()
        except UnicodeDecodeError:
            problems.append(f"❌ Erro de encoding em: {template_file.name}")
            continue
        
        references = find_resource_references(content, template_file.name)
        
        # Verifica CSS
        for css_link in references['css']:
            if css_link.startswith(('http://', 'https://', '//')):
                continue  # URLs externas
            
            if css_link.startswith('/static/'):
                css_path = base_dir / css_link[1:]
            elif css_link.startswith('static/'):
                css_path = base_dir / css_link
            else:
                css_path = static_dir / css_link
            
            if not css_path.exists():
                problems.append(f"❌ CSS não encontrado: {css_link} (em {template_file.name})")
        
        # Verifica JS
        for js_link in references['js']:
            if js_link.startswith(('http://', 'https://', '//')):
                continue
            
            if js_link.startswith('/static/'):
                js_path = base_dir / js_link[1:]
            elif js_link.startswith('static/'):
                js_path = base_dir / js_link
            else:
                js_path = static_dir / js_link
            
            if not js_path.exists():
                problems.append(f"❌ JS não encontrado: {js_link} (em {template_file.name})")
        
        # Verifica imagens
        for img_link in references['images']:
            if img_link.startswith(('http://', 'https://', '//', 'data:')):
                continue
            
            if img_link.startswith('/static/'):
                img_path = base_dir / img_link[1:]
            elif img_link.startswith('static/'):
                img_path = base_dir / img_link
            else:
                img_path = static_dir / 'img' / img_link
            
            if not img_path.exists():
                problems.append(f"❌ Imagem não encontrada: {img_link} (em {template_file.name})")
    
    return problems

def verify_static_files():
    """Lista arquivos estáticos órfãos (não referenciados)."""
    base_dir = Path(__file__).parent
    static_dir = base_dir / 'static'
    templates_dir = base_dir / 'templates'
    
    if not static_dir.exists():
        return []
    
    # Coleta todos os arquivos estáticos
    static_files = set()
    for file_path in static_dir.rglob('*'):
        if file_path.is_file():
            rel_path = file_path.relative_to(base_dir)
            static_files.add(str(rel_path).replace('\\', '/'))
    
    # Coleta todas as referências nos templates
    referenced_files = set()
    for template_file in templates_dir.glob('**/*.html'):
        try:
            with open(template_file, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Encontra todas as referências a /static/
            refs = re.findall(r'["\']([^"\']*static/[^"\']+)["\']', content)
            for ref in refs:
                if ref.startswith('/'):
                    ref = ref[1:]
                referenced_files.add(ref)
        except:
            continue
    
    # Arquivos órfãos
    orphan_files = []
    for sf in static_files:
        if sf not in referenced_files:
            orphan_files.append(sf)
    
    return orphan_files

def main():
    """Executa todas as verificações."""
    print("=" * 60)
    print("🔍 VERIFICAÇÃO DE INTEGRIDADE DO PROJETO")
    print("=" * 60)
    
    all_problems = []
    
    # 1. Estrutura
    print("\n📁 Verificando estrutura...")
    structure_problems = verify_project_structure()
    all_problems.extend(structure_problems)
    
    # 2. Templates
    print("\n📄 Verificando templates...")
    template_problems = verify_templates()
    all_problems.extend(template_problems)
    
    # 3. Arquivos órfãos
    print("\n🗑️ Verificando arquivos órfãos...")
    orphan_files = verify_static_files()
    if orphan_files:
        print(f"ℹ️ Encontrados {len(orphan_files)} arquivos estáticos não referenciados:")
        for of in orphan_files[:10]:  # Mostra só os primeiros 10
            print(f"   - {of}")
        if len(orphan_files) > 10:
            print(f"   ... e mais {len(orphan_files) - 10} arquivos")
    
    # Resumo
    print("\n" + "=" * 60)
    if all_problems:
        print(f"❌ PROBLEMAS ENCONTRADOS: {len(all_problems)}")
        print("=" * 60)
        for problem in all_problems:
            print(problem)
    else:
        print("✅ NENHUM PROBLEMA ENCONTRADO!")
        print("=" * 60)
    
    return len(all_problems) == 0

if __name__ == '__main__':
    import sys
    success = main()
    sys.exit(0 if success else 1)
