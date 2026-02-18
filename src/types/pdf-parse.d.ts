declare module "pdf-parse" {
  interface PdfData {
    numpages: number;
    numrender: number;
    info: Record<string, unknown>;
    metadata: Record<string, unknown> | null;
    text: string;
    version: string;
  }

  function pdf(
    dataBuffer: Buffer,
    options?: { pagerender?: (pageData: unknown) => string }
  ): Promise<PdfData>;

  export default pdf;
}
