const fs = require('fs');
const path = require('path');
const storePath = path.join(__dirname, 'Store.js');

let content = fs.readFileSync(storePath, 'utf8');

const regex = /primaryImage:\s*["'][^"']+["'],?/g;
let counter = 0;
const validImages = ['roseGoldFacial', 'avocadoCream', 'strawberryMoisturiser', 'revitalFaceWash', 'antioxidantFacemask'];

content = content.replace(regex, (match) => {
    if (match.includes('shopify.com') || match.includes('instagram.com')) {
        let img = validImages[counter % validImages.length];
        counter++;
        return `primaryImage: ${img},`;
    }
    return match;
});

const regexHover = /hoverImg:\s*["'][^"']+["'],?/g;
content = content.replace(regexHover, (match) => {
    if (match.includes('shopify.com') || match.includes('instagram.com')) {
        let img = validImages[counter % validImages.length];
        counter++;
        return `hoverImg: ${img},`;
    }
    return match;
});

fs.writeFileSync(storePath, content, 'utf8');
console.log('Images fixed');
