from pathlib import Path
import re
text = Path('index.html').read_text(encoding='utf-8')
match = re.search(r'let quizData = \[([\s\S]*?)\];', text)
if not match:
    raise SystemExit('quizData not found')
content = match.group(1)
objects = re.split(r'\},\s*\{', content)
patterns = ['இந்த சின்ன', 'இந்த சைகை', 'இந்த சின்னத்தின்', 'இந்த சைகையின்']
problems = []
symbol_entries = []
for i,obj in enumerate(objects):
    if i == 0:
        obj = obj.strip() + '}'
    elif i == len(objects) - 1:
        obj = '{' + obj.strip()
    else:
        obj = '{' + obj.strip() + '}'
    q_match = re.search(r'question:\s*"([^"]*)"', obj)
    img_match = re.search(r'image:\s*"([^"]*)"', obj)
    q_text = q_match.group(1) if q_match else ''
    img = img_match.group(1) if img_match else None
    if any(p in q_text for p in patterns):
        symbol_entries.append((i, q_text, img))
        if img is None:
            problems.append((i, q_text))
print('total entries', len(objects))
print('symbol-like entries', len(symbol_entries))
print('symbol-like without image', len(problems))
for entry in problems:
    print('MISSING', entry[0], entry[1])
for entry in symbol_entries[:50]:
    print(entry[0], 'IMG' if entry[2] else 'NOIMG', entry[1], entry[2])
