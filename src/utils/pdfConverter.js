import * as pdfjsLib from 'pdfjs-dist';

// Use CDN for the worker to avoid Vite build configuration issues
// Make sure to match the worker to the exact version of pdfjs-dist installed
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

/**
 * Converts a PDF file into an array of image data URLs.
 * @param {File} file The PDF file object
 * @returns {Promise<Array<{url: string}>>} Array of image objects compatible with Halos slide_deck
 */
export async function convertPdfToImages(file) {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    
    const images = [];
    
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        // Scale 2.0 provides a good balance between quality and memory usage for 1080p outputs
        const viewport = page.getViewport({ scale: 2.0 }); 
        
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        const renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert to data URL (JPEG for smaller memory footprint than PNG)
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        images.push({ url: dataUrl, name: `Page ${i}` });
    }
    
    return images;
}
