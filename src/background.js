import background01 from './images/backgrounds/background-01.jpg';
import background02 from './images/backgrounds/background-02.jpg';
import background03 from './images/backgrounds/background-03.jpg';
import background04 from './images/backgrounds/background-04.jpg';

export const Backgrounds = [
    { 
        src: background01,
        ref: 'Photo by <a href="https://unsplash.com/es/@nedaastani?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Neda Astani</a> on <a href="https://unsplash.com/es/fotos/campo-de-hierba-verde-cerca-del-lago-bajo-nubes-blancas-y-cielo-azul-durante-el-dia-KWTkd7mHqKE?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
    },
    {
        src: background02,
        ref: 'Photo by <a href="https://unsplash.com/es/@noaa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">NOAA</a> on <a href="https://unsplash.com/es/fotos/tormenta-electrica-de-microrrafagas-Led9c1SSNFo?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
    },
    { 
        src: background03,
        ref: 'Photo by <a href="https://unsplash.com/es/@noaa?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">NOAA</a> on <a href="https://unsplash.com/es/fotos/campo-de-hierba-xpOW8Pnla8M?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
    },
    {
        src: background04,
        ref: 'Photo by <a href="https://unsplash.com/es/@wolfgang_hasselmann?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Wolfgang Hasselmann</a> on <a href="https://unsplash.com/es/fotos/cielo-azul-y-nubes-blancas-sobre-el-lago-bR_-gllg7Bs?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>'
    }
];

export function setRandomBackground() {
    const body   = document.querySelector('body');
    const footer = document.querySelector('footer');
    const index  = Math.floor(Math.random() * Backgrounds.length);

    if (!body) {
        console.error('body not found');
        return;
    }

    if (!footer) {
        console.error('footer not found');
        return;
    }

    body.style.backgroundImage = `url('${Backgrounds[index].src}')`;
    footer.innerHTML = Backgrounds[index].ref;
}