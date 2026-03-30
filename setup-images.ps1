# Script de configuración de imágenes para Mahana Tours
# Propósito: Mover y renombrar las imágenes generadas por la IA a las carpetas del proyecto

$source = "C:\Users\Cesar\.gemini\antigravity\brain\913a63f4-6a63-486f-923c-4c228b2b1d44"
$targetSite = ".\client\public\images\site"
$targetTours = ".\client\public\images\tours"

# Crear directorios si no existen
if (!(Test-Path $targetSite)) { New-Item -ItemType Directory -Path $targetSite -Force | Out-Null }
if (!(Test-Path $targetTours)) { New-Item -ItemType Directory -Path $targetTours -Force | Out-Null }

Write-Host "🚀 Iniciando movimiento de activos..." -ForegroundColor Cyan

# Mapeo de archivos (Site)
Copy-Item "$source\hero_aerial_*.png" "$targetSite\hero-aerial.png" -Force
Copy-Item "$source\beach_aerial_*.png" "$targetSite\beach-aerial.png" -Force
Copy-Item "$source\radisson_pool_panama_*.png" "$targetSite\radisson-pool.png" -Force

# Mapeo de archivos (Tours)
Copy-Item "$source\surf_101_lessons_*.png" "$targetTours\surf-101.png" -Force
Copy-Item "$source\surf_foundation_group_*.png" "$targetTours\surf-foundation.png" -Force
Copy-Item "$source\kite_surf_chame_action_*.png" "$targetTours\kite-surf.png" -Force
Copy-Item "$source\isla_otoque_panama_*.png" "$targetTours\isla-otoque.png" -Force
Copy-Item "$source\jet_ski_action_panama_*.png" "$targetTours\jet-ski.png" -Force
Copy-Item "$source\cascada_filipinas_jungle_*.png" "$targetTours\cascada-filipinas.png" -Force
Copy-Item "$source\whale_breach_panama_*.png" "$targetTours\whale-breach.png" -Force
Copy-Item "$source\fishing_boat_adventure_*.png" "$targetTours\fishing-boat.png" -Force
Copy-Item "$source\hiking_cerro_chame_view_*.png" "$targetTours\cerro-chame.png" -Force
Copy-Item "$source\surf_center_mahana_*.png" "$targetTours\surf-center.png" -Force
Copy-Item "$source\waves_chame_pacific_*.png" "$targetTours\waves-chame.png" -Force
Copy-Item "$source\sunset_cruise_pacific_*.png" "$targetTours\sunset-cruise.png" -Force
Copy-Item "$source\tubing_adventure_fun_*.png" "$targetTours\tubing-fun.png" -Force
Copy-Item "$source\valle_anton_landscape_*.png" "$targetTours\valle-anton.png" -Force

Write-Host "✅ ¡Proceso completado! 17 imágenes están ahora en su lugar." -ForegroundColor Green
Write-Host "Visita http://localhost:3000 para ver los cambios." -ForegroundColor Yellow
