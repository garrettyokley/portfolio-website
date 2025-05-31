#!/usr/bin/env python3
import os
import sys
import subprocess
import shutil

def extract_text_from_pdf(pdf_path, output_path, pdftotext_path=None):
    """
    Extract text from a PDF file using pdftotext.exe
    
    Args:
        pdf_path (str): Path to the PDF file
        output_path (str): Path to save the output text
        pdftotext_path (str, optional): Path to pdftotext.exe. If None, will look in default locations
    
    Returns:
        bool: True if successful, False otherwise
    """
    # Determine the path to pdftotext.exe
    if not pdftotext_path:
        # Default locations to check
        possible_locations = [
            # Current directory
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "pdftotext.exe"),
            # public/pdftools directory (for web projects)
            os.path.join(os.path.dirname(os.path.abspath(__file__)), "public", "pdftools", "pdftotext.exe"),
            # Installed Poppler location
            os.path.join(os.path.dirname(os.path.abspath(__file__)), 
                         "Release-24.08.0-0", "poppler-24.08.0", "Library", "bin", "pdftotext.exe")
        ]
        
        for loc in possible_locations:
            if os.path.exists(loc):
                pdftotext_path = loc
                break
    
    if not pdftotext_path or not os.path.exists(pdftotext_path):
        print(f"Error: pdftotext.exe not found.")
        return False
    
    try:
        # Run pdftotext
        result = subprocess.run([pdftotext_path, pdf_path, output_path], 
                               stdout=subprocess.PIPE, 
                               stderr=subprocess.PIPE,
                               text=True)
        
        if result.returncode != 0:
            print(f"Error running pdftotext: {result.stderr}")
            return False
        
        print(f"Successfully extracted text from {pdf_path} to {output_path}")
        return True
    except Exception as e:
        print(f"Error: {str(e)}")
        return False

def setup_pdftools_directory(source_dir, target_dir="public/pdftools"):
    """
    Set up the pdftools directory with required files
    
    Args:
        source_dir (str): Source directory containing pdftotext.exe and DLLs
        target_dir (str): Target directory to copy files to
    
    Returns:
        bool: True if successful, False otherwise
    """
    try:
        # Create target directory if it doesn't exist
        os.makedirs(target_dir, exist_ok=True)
        
        # Copy pdftotext.exe
        pdftotext_path = os.path.join(source_dir, "pdftotext.exe")
        if os.path.exists(pdftotext_path):
            shutil.copy2(pdftotext_path, target_dir)
            print(f"Copied pdftotext.exe to {target_dir}")
        else:
            print(f"Error: pdftotext.exe not found in {source_dir}")
            return False
        
        # Copy required DLLs
        dll_files = [f for f in os.listdir(source_dir) if f.endswith('.dll')]
        for dll in dll_files:
            dll_path = os.path.join(source_dir, dll)
            shutil.copy2(dll_path, target_dir)
            print(f"Copied {dll} to {target_dir}")
        
        return True
    except Exception as e:
        print(f"Error setting up pdftools directory: {str(e)}")
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python pdf_to_text_windows.py <pdf_file> <output_text_file> [pdftotext_path]")
        print("  or")
        print("Usage: python pdf_to_text_windows.py setup <source_dir> [target_dir]")
        sys.exit(1)
    
    if sys.argv[1].lower() == "setup":
        if len(sys.argv) < 3:
            print("Error: Missing source directory")
            print("Usage: python pdf_to_text_windows.py setup <source_dir> [target_dir]")
            sys.exit(1)
        
        source_dir = sys.argv[2]
        target_dir = sys.argv[3] if len(sys.argv) > 3 else "public/pdftools"
        
        if setup_pdftools_directory(source_dir, target_dir):
            print(f"Successfully set up pdftools directory at {target_dir}")
        else:
            print("Failed to set up pdftools directory")
            sys.exit(1)
    else:
        pdf_path = sys.argv[1]
        output_path = sys.argv[2]
        pdftotext_path = sys.argv[3] if len(sys.argv) > 3 else None
        
        if extract_text_from_pdf(pdf_path, output_path, pdftotext_path):
            print("Text extraction completed successfully")
        else:
            print("Failed to extract text")
            sys.exit(1)