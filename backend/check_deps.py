import pkg_resources

with open(r'c:\Users\missi\Desktop\CRM Conseiller\conseiller-crm-1\backend\requirements.txt', 'r') as f:
    requirements = [line.strip() for line in f if line.strip() and not line.startswith('#')]

missing_packages = []
for req in requirements:
    try:
        pkg_resources.require(req)
    except (pkg_resources.DistributionNotFound, pkg_resources.VersionConflict) as e:
        missing_packages.append(str(req))

if missing_packages:
    print("Missing or version mismatch packages:")
    for pkg in missing_packages:
        print(pkg)
else:
    print("All backend dependencies are correctly installed.")
