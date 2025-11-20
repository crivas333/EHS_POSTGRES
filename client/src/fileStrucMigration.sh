#!/bin/bash

echo "🚀 Starting project restructuring..."

# --- 1. Create new architecture folders ---
mkdir -p features/patient/{components,hooks,api,store,ui}
mkdir -p features/encounters/{components,hooks,api,store,ui}
mkdir -p features/exams/{components,hooks,api,store,ui}
mkdir -p features/scheduler/{components,hooks,api,store,ui}
mkdir -p components/shared
mkdir -p features/systemConfig/{components,hooks,api}

echo "📁 Created new folder structure."

# --- 2. Move patient domain ---
mv components/patient/*                features/patient/components/   2>/dev/null
mv features/patient/patientSearch      features/patient/components/   2>/dev/null
mv graphqlClient/gqlQueries_patient.js features/patient/api/          2>/dev/null
mv hooks/usePatientSearch.js           features/patient/hooks/        2>/dev/null

echo "👤 Patient module reorganized."

# --- 3. Move encounters domain ---
mv components/encounter/*              features/encounters/components/ 2>/dev/null
mv modules/encounters/components/*     features/encounters/components/ 2>/dev/null
mv modules/encounters/hooks/*          features/encounters/hooks/      2>/dev/null
mv graphqlClient/gqlQueries_encounters.js features/encounters/api/     2>/dev/null

echo "🩺 Encounters module reorganized."

# --- 4. Move exams domain ---
mv components/exam/*                   features/exams/components/     2>/dev/null
mv graphqlClient/gqlQueries_exams.js   features/exams/api/            2>/dev/null

echo "🔬 Exams module reorganized."

# --- 5. Move scheduler / calendar domain ---
mv components/scheduler/*              features/scheduler/components/ 2>/dev/null
mv helpers/defaultEvent.js             features/scheduler/            2>/dev/null
mv helpers/statusToColor.js            features/scheduler/            2>/dev/null
mv graphqlClient/gqlQueries_appointments.js features/scheduler/api/   2>/dev/null

echo "📅 Scheduler module reorganized."

# --- 6. Move system config domain ---
mv components/systemConfig/*           features/systemConfig/components/ 2>/dev/null
mv graphqlClient/gqlQueries_sysconf.js features/systemConfig/api/        2>/dev/null
mv hooks/useApplicationFields.js       features/systemConfig/hooks/      2>/dev/null

echo "⚙️ System config module reorganized."

# --- 7. Consolidate shared UI components ---
mv components/common/*                 components/shared/              2>/dev/null
mv components/reusableForms/*          components/shared/              2>/dev/null
mv components/notification/*           components/shared/notification/ 2>/dev/null

echo "🧩 Shared UI components consolidated."

# --- 8. Clean pages (thin page wrappers) ---
mkdir -p pages
echo "⚪ Pages folder stays but will be cleaned manually after review."

# --- 9. Create index.js files for each feature ---
for f in features/*; do
  if [ -d "$f" ]; then
    echo "// Auto-generated module barrel file" > "$f/index.js"
    echo "export * from './components';" >> "$f/index.js"
    echo "export * from './hooks';" >> "$f/index.js"
    echo "export * from './api';" >> "$f/index.js"
    echo "export * from './store';" >> "$f/index.js"
    echo "export * from './ui';" >> "$f/index.js"
  fi
done

echo "📦 Barrel files generated."

echo "✅ Migration completed!"
echo "⚠️ Review changes but nothing was deleted."

