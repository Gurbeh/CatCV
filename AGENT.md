# AGENT.md

## 🎯 Purpose  
This file defines rules and workflows for AI Agents (e.g. Codex).  
Agents must strictly follow these instructions, based on the location of this file in the repository tree.  

---

## 🌳 Scope and Hierarchy  

- If an AGENT.md file is located in the repository root, its rules apply to the entire project.  
- If an AGENT.md file exists inside a subdirectory (e.g., /components/AGENT.md), its rules apply only to files inside that directory and its children.  
- Rules from parent directories must also be respected.  
  - Example: If /AGENT.md has global rules, and /components/AGENT.md has local rules, then agents working in /components must follow both.  

---

## 🔧 Post-Coding Workflow  

1. Run Quality Checks  
   - Execute lint.  
   - Build the project.  

2. Fix Errors  
   - If lint or build fails, fix the issues before continuing.  

3. Stage Changes  
   - Once everything passes successfully, run:  
    
     git add .
     
 

---

## 📌 Notes for Agents  
- Do not skip lint/build checks.  
- Do not commit files until errors are resolved.  
- Always apply all parent AGENT.md rules when inside subdirectories.  

---
