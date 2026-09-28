import re

file_path = "src/app/components/AdminCMSModal.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace heavily styled, neon gradients and dark modes with a completely flat, airy Light Mode
replacements = [
    # Overlay & Modals
    (r"bg-slate-950/70 backdrop-blur-sm", r"bg-gray-900/40 backdrop-blur-none"),
    (r"bg-black/85 backdrop-blur-md", r"bg-gray-900/40 backdrop-blur-none"),
    (r"bg-[#0d1117] border border-slate-800", r"bg-white border border-gray-200 shadow-xl"),
    (r"bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl", r"bg-white border border-gray-200 rounded-xl shadow-2xl"),
    (r"bg-slate-900", r"bg-white"),
    
    # Text colors
    (r"text-white", r"text-gray-900"),
    (r"text-slate-100", r"text-gray-900"),
    (r"text-slate-200", r"text-gray-800"),
    (r"text-slate-300", r"text-gray-700"),
    (r"text-slate-400", r"text-gray-500"),
    (r"text-slate-500", r"text-gray-400"),
    (r"text-blue-400", r"text-gray-900"),
    (r"text-blue-500", r"text-black"),
    
    # Backgrounds & Sections
    (r"bg-[#161b22]", r"bg-gray-50"),
    (r"bg-[#0d1117]", r"bg-white"),
    (r"bg-slate-950/80", r"bg-white border-b border-gray-200"),
    (r"bg-slate-950/40", r"bg-gray-50 border-b border-gray-200"),
    (r"bg-slate-950", r"bg-white"),
    (r"bg-slate-900/40", r"bg-white"),
    (r"bg-slate-800/60", r"bg-gray-50"),
    (r"bg-slate-800/40", r"bg-white"),
    (r"bg-slate-800", r"bg-gray-100"),
    (r"bg-slate-700", r"bg-gray-200"),
    
    # Borders
    (r"border-slate-800", r"border-gray-200"),
    (r"border-slate-700", r"border-gray-200"),
    (r"border-blue-500", r"border-black"),
    
    # Buttons & Accents
    (r"bg-blue-600 hover:bg-blue-500 text-white", r"bg-black hover:bg-gray-800 text-white"),
    (r"bg-amber-500 hover:bg-amber-400 text-slate-950", r"bg-black hover:bg-gray-800 text-white"),
    (r"bg-amber-500", r"bg-black"),
    
    # Custom Chips & Tags
    (r"bg-blue-500/10 text-gray-900 font-medium border border-blue-500/20", r"bg-gray-100 text-gray-700 font-medium border border-gray-200"),
    (r"bg-blue-500/10 text-black border-blue-500/20", r"bg-gray-100 text-gray-800 border-gray-200"),
    (r"bg-blue-500/5", r"bg-gray-100"),
    (r"bg-blue-500/10 border-black shadow-sm", r"bg-gray-50 border-black shadow-sm"),
    (r"bg-blue-500/10 border-black", r"bg-gray-50 border-black"),
    (r"bg-blue-600", r"bg-black"),
    (r"bg-indigo-600", r"bg-black"),
    (r"bg-indigo-500", r"bg-gray-800"),
    
    # Fix specific form inputs
    (r"focus:border-amber-400", r"focus:border-black focus:ring-1 focus:ring-black"),
    (r"focus:border-blue-500", r"focus:border-black focus:ring-1 focus:ring-black"),
    
    # specific text overwrites that got mismatched
    (r"text-white hover:text-white", r"text-gray-500 hover:text-gray-900"),
    (r"text-gray-900 hover:text-gray-900", r"text-gray-500 hover:text-gray-900"),
    
    # Checkbox checks
    (r"accent-amber-400", r"accent-black"),
    
    # More specific overrides for tabs
    (r"border-black text-black bg-gray-100", r"border-black text-black bg-white"),
    (r"border-transparent text-gray-500 hover:text-gray-800", r"border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored CMS styling to clean light mode.")
