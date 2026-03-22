import os
import subprocess
import sys

# Change to backend directory
backend_dir = r"c:\Users\missi\Desktop\CRM Conseiller\conseiller-crm-1\backend"
requirements_file = os.path.join(backend_dir, "requirements.txt")

with open(requirements_file, 'r') as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]

for req in requirements:
    try:
        # Check if the package is installed
        # This will check for basic existence. We won't check versions as precisely here.
        package_name = req.split('==')[0]
        # Skip empty lines or comments if any left
        if not package_name: continue
        
        # Check if installed
        subprocess.run([sys.executable, "-m", "pip", "show", package_name], 
                      stdout=subprocess.DEVNULL, 
                      stderr=subprocess.DEVNULL, 
                      check=True)
    except subprocess.CalledProcessError:
        print(f"Missing: {req}")

print("\nFinished dependency check.")
