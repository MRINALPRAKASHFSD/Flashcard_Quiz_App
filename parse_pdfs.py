import PyPDF2
import json
import random
import re
import os

def extract_qa_from_pdf(pdf_path, num_questions=40):
    text = ""
    with open(pdf_path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            text += page.extract_text() + "\n"
            
    # Parse answer key
    # Matches like Q01: B) or Q1: B)
    answers = {}
    for match in re.finditer(r'Q0?(\d+):\s*([A-D])\)', text):
        answers[int(match.group(1))] = match.group(2)
        
    # Parse questions
    # Matches Q1. <question> A) <opt> B) <opt> C) <opt> D) <opt>
    questions = []
    
    # Split by Q<number>. 
    parts = re.split(r'Q(\d+)\.\s+', text)
    
    for i in range(1, len(parts), 2):
        q_num = int(parts[i])
        block = parts[i+1]
        
        # We need to find A), B), C), D)
        a_match = re.search(r'A\)\s*(.*?)(?=B\))', block, re.DOTALL)
        b_match = re.search(r'B\)\s*(.*?)(?=C\))', block, re.DOTALL)
        c_match = re.search(r'C\)\s*(.*?)(?=D\))', block, re.DOTALL)
        d_match = re.search(r'D\)\s*(.*?)(?=\n|$|■)', block, re.DOTALL)
        
        if not (a_match and b_match and c_match and d_match):
            continue
            
        q_text = block[:a_match.start()].strip()
        opts = [
            a_match.group(1).strip(),
            b_match.group(1).strip(),
            c_match.group(1).strip(),
            d_match.group(1).strip()
        ]
        
        ans_letter = answers.get(q_num, 'A')
        correct_idx = ord(ans_letter) - ord('A')
        
        questions.append({
            "original_num": q_num,
            "question": q_text.replace('\n', ' '),
            "options": [o.replace('\n', ' ') for o in opts],
            "correctAnswer": correct_idx,
            "explanation": f"The correct answer is {ans_letter}.",
            "points": 10
        })
        
    # If we couldn't parse correctly, fallback to dummy or handle
    if len(questions) < num_questions:
        print(f"Warning: Only extracted {len(questions)} from {pdf_path}")
        
    # Select random 40
    selected = random.sample(questions, min(num_questions, len(questions)))
    return selected

def main():
    pdf1 = r"C:\Users\USER\Desktop\Extras\Flashcard_Quiz_App\Assets\sanchetna_club_quiz\Know_My_India_Mega_Quiz_100_Questions.pdf"
    pdf2 = r"C:\Users\USER\Desktop\Extras\Flashcard_Quiz_App\Assets\sanchetna_club_quiz\Know_My_India_Mega_Quiz_Set2_100_Questions.pdf"
    
    qs1 = extract_qa_from_pdf(pdf1, 50)
    qs2 = extract_qa_from_pdf(pdf2, 50)
    
    all_qs = qs1 + qs2
    random.shuffle(all_qs)
    
    final_questions = []
    
    rounds = [
        {"id": "Qualification Round", "title": "Qualification Round", "subtitle": "First 20 Questions", "scoreRule": "+10 points"},
        {"id": "Additional Round 1", "title": "Additional Round 1", "subtitle": "Extra 20 Questions", "scoreRule": "+10 points"},
        {"id": "Additional Round 2", "title": "Additional Round 2", "subtitle": "Extra 20 Questions", "scoreRule": "+10 points"},
        {"id": "Additional Round 3", "title": "Additional Round 3", "subtitle": "Extra 20 Questions", "scoreRule": "+10 points"},
        {"id": "Final Round", "title": "Final Round", "subtitle": "Last 20 Questions", "scoreRule": "+10 points"}
    ]
    
    for i, q in enumerate(all_qs):
        round_idx = i // 20
        if round_idx > 4:
            round_idx = 4
        q_obj = {
            "id": i + 1,
            "level": rounds[round_idx]["title"],
            "category": rounds[round_idx]["id"],
            "question": q["question"],
            "options": q["options"],
            "correctAnswer": q["correctAnswer"],
            "explanation": q["explanation"],
            "points": 10
        }
        final_questions.append(q_obj)
        
    dataset = {
        "id": "sanchetna_club_quiz_dataset",
        "name": "Sanchetna Club Quiz",
        "description": "100 questions from Know My India Mega Quiz Sets 1 & 2.",
        "version": "1.0.0",
        "updatedAt": "2026-09-29T00:00:00.000Z",
        "divisions": rounds,
        "questions": final_questions
    }
    
    out_path = r"C:\Users\USER\Desktop\Extras\Flashcard_Quiz_App\public\assets\dataset\sanchetna_club_quiz.json"
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)
        
    print(f"Generated dataset with {len(final_questions)} questions at {out_path}")

if __name__ == "__main__":
    main()
