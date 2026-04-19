import os

dirs = [
    "src/app/(auth)",
    "src/app/(dashboard)",
    "src/components/ui",
    "src/components/layout",
    "src/components/auth",
    "src/components/listings",
    "src/components/customers",
    "src/components/tasks",
    "src/components/dashboard",
    "src/components/activity",
    "src/components/shared",
    "src/lib/auth",
    "src/lib/db",
    "src/lib/permissions",
    "src/lib/validations",
    "src/lib/services",
    "src/lib/queries",
    "src/lib/utils",
    "src/lib/constants",
    "prisma",
    "types",
    "src/app/(dashboard)/listings",
    "src/app/(dashboard)/customers",
    "src/app/(dashboard)/tasks",
    "src/app/(dashboard)/activity",
    "src/app/(dashboard)/users",
    "src/app/(dashboard)/settings",
    "src/app/api/auth",
    "src/app/api/listings",
    "src/app/api/customers",
    "src/app/api/tasks",
    "src/app/api/activity",
    "src/app/api/users",
]

for d in dirs:
    os.makedirs(d, exist_ok=True)
    print(f"Created: {d}")
