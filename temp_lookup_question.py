from pathlib import Path
import re
text = Path('index.html').read_text(encoding='utf-8')
start = text.find('let quizData = [')
end = text.find('];', start)
if start == -1 or end == -1:
    raise SystemExit('quizData not found')
content = text[start:end]
objects = re.split(r'\},\s*\n\s*\{', content)
search_opts = [
    'கண்டிப்பாக வலதுபுறம் திரும்பவும்',
    'சாலை வழவழு',
    'இடதுபுறம் திரும்பவும்',
    'வலதுபுறம் செல்லக்கூடாது'
]
for i,obj in enumerate(objects):
    block = obj
    if i == 0:
        block = obj + '}'
    elif i == len(objects)-1:
        block = '{' + obj
    else:
        block = '{' + obj + '}'
    if all(opt in block for opt in search_opts):
        q = re.search(r'question:\s*"([^"]*)"', block)
        img = re.search(r'image:\s*"([^"]*)"', block)
        print('FOUND INDEX', i)
        print('QUESTION:', q.group(1) if q else 'N/A')
        print('IMAGE:', img.group(1) if img else 'NONE')
        print('LINE', text[:text.find(block)].count('\n')+1)
        print(block)
