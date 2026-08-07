from pathlib import Path
import re
text = Path('index.html').read_text(encoding='utf-8')
# Split quizData objects by top-level braces roughly
start = text.find('let quizData = [')
end = text.find('];', start)
if start == -1 or end == -1:
    raise SystemExit('quizData not found')
content = text[start:end]
# find question strings and image presence within each object
obj_pattern = re.compile(r'\{([^\}]*)\}', re.S)
objects = obj_pattern.findall(content)
counts = {}
for obj in objects:
    q_match = re.search(r'question:\s*"([^"]*)"', obj)
    if not q_match:
        continue
    q = q_match.group(1)
    img = bool(re.search(r'image:\s*"([^"]*)"', obj))
    counts.setdefault(q, {'with':0, 'without':0})
    counts[q]['with' if img else 'without'] += 1
print('duplicate entries with and without image:')
for q, data in counts.items():
    if data['with'] > 0 and data['without'] > 0:
        print(q, data)
print('target counts:')
print('இந்த சின்னத்தின் பொருள்', counts.get('இந்த சின்னத்தின் பொருள்', {}))
print('இந்த சைகையின் பொருள்', counts.get('இந்த சைகையின் பொருள்', {}))
