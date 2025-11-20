#!/bin/bash

# ------------------------------------------------------------------------------
#  create missing folders for improved project structure
# ------------------------------------------------------------------------------

echo "📁 Creating recommended project folders..."

# --- Layout folders ---
mkdir -p src/layouts/workspace
mkdir -p src/layouts/app

# --- Features root standardization ---
for feature in appointments encounters exams patient scheduler systemConfig; do
  mkdir -p src/features/$feature/dashboard
  mkdir -p src/features/$feature/layout
  mkdir -p src/features/$feature/modules
  mkdir -p src/features/$feature/ui
done

# --- Pages folder ---
#mkdir -p src/pages/patient
#mkdir -p src/pages/encounters
#mkdir -p src/pages/exams
#mkdir -p src/pages/scheduler
#mkdir -p src/pages/system

# --- Shared global components ---
mkdir -p src/components/shared/forms
mkdir -p src/components/shared/tables
mkdir -p src/components/shared/cards
mkdir -p src/components/shared/filters

# --- Global hooks ---
mkdir -p src/hooks/global

# --- Utils groups ---
mkdir -p src/utils/forms
mkdir -p src/utils/validators
mkdir -p src/utils/dates

echo "✨ Structure update complete!"
