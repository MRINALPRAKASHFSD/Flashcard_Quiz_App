import re

file_path = "src/app/components/AdminCMSModal.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix the broken artifacts and convert to a very flat, clean light mode theme.
replacements = [
    (r"bg-gray-50lue-600", r"bg-black text-white"),
    (r"bg-gray-50lue-500", r"bg-gray-800"),
    (r"bg-\[\#0d1117\]", r"bg-white"),
    (r"bg-\[\#161b22\]", r"bg-gray-50"),
    (r"text-slate-950", r"text-white"),
    
    # Specific buttons
    (r"bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-semibold text-sm rounded-xl", r"bg-black hover:bg-gray-800 text-white font-medium text-sm rounded-lg"),
    (r"bg-gradient-to-tr from-amber-500 to-indigo-600", r"bg-black"),
    (r"bg-indigo-600/20 border-indigo-400 shadow-lg shadow-indigo-500/10", r"bg-gray-100 border-gray-300 shadow-sm"),
    (r"bg-slate-800/60 border-slate-700 hover:border-slate-500", r"bg-white border-gray-200 hover:border-gray-300"),
    (r"bg-emerald-500/20 border-emerald-400", r"bg-gray-100 border-gray-300"),
    (r"bg-cyan-500/20 border-cyan-400", r"bg-gray-100 border-gray-300"),
    
    # Text colors that might be leftover
    (r"text-slate-100", r"text-gray-900"),
    (r"text-slate-400", r"text-gray-500"),
    (r"text-slate-300", r"text-gray-600"),
    (r"text-slate-200", r"text-gray-700"),
    (r"text-slate-500", r"text-gray-400"),
    (r"text-amber-400", r"text-gray-900"),
    (r"text-emerald-400", r"text-gray-900"),
    (r"text-indigo-400", r"text-gray-900"),
    (r"text-cyan-400", r"text-gray-900"),
    (r"text-indigo-300", r"text-gray-600"),
    (r"text-amber-300", r"text-gray-900"),
    
    # Checkbox logic colors
    (r"bg-indigo-500/20 text-indigo-300 border border-indigo-500/30", r"bg-gray-100 text-gray-700 border border-gray-200"),
    (r"bg-amber-500/10 border-amber-400 shadow-xl", r"bg-gray-50 border-gray-300 shadow-sm"),
    (r"bg-slate-800/40 border-slate-700", r"bg-white border-gray-200"),
    
    # Leftover backgrounds
    (r"bg-slate-700", r"bg-gray-200"),
    (r"bg-slate-800", r"bg-gray-100"),
    (r"bg-slate-900", r"bg-white"),
    (r"bg-slate-950", r"bg-gray-50"),
    (r"border-slate-700", r"border-gray-200"),
    (r"border-slate-800", r"border-gray-200"),
    (r"bg-black/85 backdrop-blur-md", r"bg-gray-900/50"),
    
    # General tweaks for a very professional, non-scrunched look
    (r"rounded-2xl", r"rounded-xl"),
    (r"rounded-xl", r"rounded-lg"),
    (r"shadow-2xl", r"shadow-lg"),
]

for old, new in replacements:
    content = re.sub(old, new, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Fixed CMS to a highly professional flat light mode.")
