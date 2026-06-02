#!/usr/bin/env python3
"""
Script pour remplacer toutes les redirections /login par /auth/login
"""
import os
import re

def fix_file(filepath):
    """Remplace router.push('/login') par router.push('/auth/login')"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Remplacer les occurrences
        original = content
        content = content.replace("router.push('/login')", "router.push('/auth/login')")
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Corrigé: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"❌ Erreur {filepath}: {e}")
        return False

def main():
    """Parcourir tous les fichiers .tsx dans apps/web-nextjs/pages"""
    base_dir = "apps/web-nextjs/pages"
    count = 0
    
    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file.endswith('.tsx'):
                filepath = os.path.join(root, file)
                if fix_file(filepath):
                    count += 1
    
    print(f"\n🎉 {count} fichiers corrigés!")

if __name__ == "__main__":
    main()
