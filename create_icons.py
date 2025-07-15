#!/usr/bin/env python3
"""
Generate SVG icons for the SCORM Completion Helper extension
"""

import os
import xml.etree.ElementTree as ET

def create_icon_svg(size):
    """Create an SVG icon with the given size"""
    
    # Create SVG root element
    svg = ET.Element('svg', {
        'xmlns': 'http://www.w3.org/2000/svg',
        'width': str(size),
        'height': str(size),
        'viewBox': f'0 0 {size} {size}'
    })
    
    # Create gradient definition
    defs = ET.SubElement(svg, 'defs')
    gradient = ET.SubElement(defs, 'linearGradient', {
        'id': 'grad1',
        'x1': '0%',
        'y1': '0%',
        'x2': '100%',
        'y2': '100%'
    })
    
    ET.SubElement(gradient, 'stop', {
        'offset': '0%',
        'style': 'stop-color:#667eea;stop-opacity:1'
    })
    
    ET.SubElement(gradient, 'stop', {
        'offset': '100%',
        'style': 'stop-color:#764ba2;stop-opacity:1'
    })
    
    # Create background circle
    ET.SubElement(svg, 'circle', {
        'cx': str(size // 2),
        'cy': str(size // 2),
        'r': str(size // 2 - 2),
        'fill': 'url(#grad1)',
        'stroke': 'none'
    })
    
    # Create checkmark path
    checkmark_size = size * 0.6
    checkmark_offset = (size - checkmark_size) // 2
    
    # Simple checkmark path
    checkmark_path = f"M {checkmark_offset + checkmark_size * 0.2} {checkmark_offset + checkmark_size * 0.5} " \
                    f"L {checkmark_offset + checkmark_size * 0.45} {checkmark_offset + checkmark_size * 0.75} " \
                    f"L {checkmark_offset + checkmark_size * 0.8} {checkmark_offset + checkmark_size * 0.25}"
    
    ET.SubElement(svg, 'path', {
        'd': checkmark_path,
        'stroke': 'white',
        'stroke-width': str(max(2, size // 16)),
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
        'fill': 'none'
    })
    
    return svg

def svg_to_string(svg_element):
    """Convert SVG element to string"""
    return '<?xml version="1.0" encoding="UTF-8"?>\n' + ET.tostring(svg_element, encoding='unicode')

def main():
    """Generate all icon sizes"""
    sizes = [16, 32, 48, 128]
    
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        svg = create_icon_svg(size)
        svg_content = svg_to_string(svg)
        
        # Save as SVG file
        with open(f'icons/icon-{size}.svg', 'w') as f:
            f.write(svg_content)
        
        print(f"Created icon-{size}.svg")

if __name__ == '__main__':
    main()