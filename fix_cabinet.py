with open(r'e:\pims设计\app\src\components\VanityCabinetConfigurator.tsx', 'rb') as f:
    content = f.read()

# Find orphaned block: from 'key_sub=' to just before '_DELETE_THIS_BLOCK_'
delete_marker = b'_DELETE_THIS_BLOCK_'
keep_marker = b'_KEEP_THIS_'

block_start = content.find(b'key_sub=')
delete_marker_pos = content.find(delete_marker)
keep_marker_pos = content.find(keep_marker)

if block_start >= 0 and delete_marker_pos >= 0:
    # Delete from 'key_sub=' to end of '_DELETE_THIS_BLOCK_' line
    # Find the newline after the marker
    end_of_marker = content.find(b'\n', delete_marker_pos) + 1
    new_content = content[:block_start] + content[end_of_marker:]
    with open(r'e:\pims设计\app\src\components\VanityCabinetConfigurator.tsx', 'wb') as f:
        f.write(new_content)
    print(f'Done. Removed {end_of_marker - block_start} bytes.')
else:
    print(f'Not found: key_sub={block_start}, _DELETE_THIS_BLOCK_={delete_marker_pos}')
