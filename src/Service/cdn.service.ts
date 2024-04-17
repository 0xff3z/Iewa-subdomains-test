import {Injectable} from "@nestjs/common";
import {MondayService} from "./monday.service";
const PDFDocument = require('pdfkit');
const imageSize = require('image-size');
const { Readable } = require('stream');
@Injectable()
export class CdnService {
    constructor(
        private readonly MondayService: MondayService
    ) {
    }


    async generateMondayAssetUrl(res, businessOwner, id) {
        try {
            const assetUrl = await this.MondayService.GenerateAssetURl(id);
            const response = await fetch(assetUrl);

            // Determine the content type
            const contentType = response.headers.get('content-type');
            console.log(contentType);

            if (contentType.includes('application/pdf')) {
                // For PDF files
                const arrayBuffer = await response.arrayBuffer();
                const pdfBuffer = Buffer.from(arrayBuffer);

                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="filename.pdf"');
                res.setHeader('Content-Length', pdfBuffer.length);
                res.setHeader('Content-Transfer-Encoding', 'binary');
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Cache-Control', 'private');
                res.setHeader('Pragma', 'private');
                res.setHeader('Expires', '0');
                res.setHeader("encoding", "utf-8")

                res.status(200).send(pdfBuffer);
            } else if (contentType.includes('image')) {
                // For images, convert to PDF
                const arrayBuffer = await response.arrayBuffer();
                const imageBuffer = Buffer.from(arrayBuffer);

                // Get image dimensions
                const dimensions = imageSize(imageBuffer);
                const { width, height } = dimensions;

                // Create a new PDF document
                const pdfDoc = new PDFDocument();
                const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

                // Pipe PDF document to response
                pdfDoc.pipe(res);

                // Add image to PDF document
                pdfDoc.image(base64Image, { width, height });

                // Finalize the PDF document
                res.setHeader('Content-Type', 'application/pdf');
                res.setHeader('Content-Disposition', 'attachment; filename="filename.pdf"');

                res.setHeader('Content-Transfer-Encoding', 'binary');
                res.setHeader('Accept-Ranges', 'bytes');
                res.setHeader('Cache-Control', 'private');
                res.setHeader('Pragma', 'private');
                res.setHeader('Expires', '0');
                res.setHeader("encoding", "utf-8")
                return pdfDoc.end();


            } else {
                // For other types, handle accordingly
                res.status(415).send('Unsupported Media Type');
            }
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }


    async downloadInvoice(res, businessOwner,id) {
        try {
            const assetUrl = await this.MondayService.GenerateAssetURl(id);
            return  res.status(200).send({data:assetUrl, message: 'Invoice Downloaded Successfully', status: 200});

        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Internal server error' });
        }
    }




}