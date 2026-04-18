import fs from 'fs';
import path from 'path';

const sourceDir = "C:\\Users\\USER\\.gemini\\antigravity\\brain\\b8e4368e-f417-4657-b807-a58e91174c6a";
const destDir = "c:\\wamp64\\www\\unionamericana\\public\\images";

// Create destination if it doesn't exist
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Map of source images to destination exact names
const filesToCopy = [
    { src: "humanitarian_action_1776524190345.png", dest: "humanitarian_action.png" },
    { src: "essential_services_1776524205445.png", dest: "essential_services.png" },
    { src: "community_development_1776524222297.png", dest: "community_development.png" },
    { src: "rights_defense_1776524248664.png", dest: "rights_defense.png" },
    // Use the newly generated LATAM Hub image
    { src: "latam_hub_1776524785240.png", dest: "latam_hub.png" }
];

filesToCopy.forEach(file => {
    const sourcePath = path.join(sourceDir, file.src);
    const destPath = path.join(destDir, file.dest);
    
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copiado exitosamente: ${file.dest}`);
    } else {
        console.error(`❌ No se encontró la imagen original: ${file.src}`);
    }
});

console.log("\n¡Las imágenes están listas en la carpeta public/images!");
