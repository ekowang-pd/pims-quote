import re

with open(r'e:/pims设计/app/bundle-temp.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find function Ja (VanityCabinetConfigurator)
idx = content.find('function Ja')
if idx >= 0:
    print('Found Ja at:', idx)
    print(repr(content[idx:idx+300]))
    print('---')
    # Also find the function definition that precedes it
    start = max(0, idx - 100)
    print('Context before:', repr(content[start:idx]))

# Find the vanity config data - look for structured arrays with label fields
# Search for Chinese text in the bundle
idx2 = content.find('mianqi')
print('\nmianqi found at:', idx2)
if idx2 >= 0:
    print(repr(content[max(0,idx2-200):idx2+200]))

# Search for kelinai config
idx3 = content.find('kelinai')
print('\nkelinai found at:', idx3)
if idx3 >= 0:
    print(repr(content[max(0,idx3-100):idx3+300]))
