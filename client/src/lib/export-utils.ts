// Export utility functions for document generation and download

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'xlsx' | 'zip';
  items: string[];
  includeMetadata?: boolean;
  watermark?: boolean;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: 'business-plan' | 'pitch-deck' | 'financial-model' | 'market-research' | 'legal-docs';
  content: any;
  lastUpdated: Date;
}

// Simulate document generation
export async function generateDocument(templateId: string, data: any): Promise<Blob> {
  // In a real implementation, this would:
  // 1. Fetch the template
  // 2. Merge with user data
  // 3. Generate the document using a service like Puppeteer for PDF or docx library
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate document generation delay
      const mockContent = `Generated ${templateId} document with data: ${JSON.stringify(data)}`;
      const blob = new Blob([mockContent], { type: 'application/pdf' });
      resolve(blob);
    }, 1000 + Math.random() * 2000);
  });
}

// Generate business plan PDF
export async function generateBusinessPlan(startupData: any): Promise<Blob> {
  const template = `
    # Business Plan: ${startupData.companyName}
    
    ## Executive Summary
    ${startupData.executiveSummary || 'AI-generated executive summary based on your startup profile...'}
    
    ## Market Analysis
    ${startupData.marketAnalysis || 'Comprehensive market analysis with industry insights...'}
    
    ## Financial Projections
    ${startupData.financials || '5-year financial projections with revenue forecasts...'}
    
    ## Marketing Strategy
    ${startupData.marketing || 'Go-to-market strategy and customer acquisition plan...'}
    
    Generated on: ${new Date().toLocaleDateString()}
  `;
  
  return new Blob([template], { type: 'application/pdf' });
}

// Generate pitch deck
export async function generatePitchDeck(startupData: any): Promise<Blob> {
  const slides = [
    'Company Overview',
    'Problem Statement', 
    'Solution',
    'Market Opportunity',
    'Business Model',
    'Financial Projections',
    'Team',
    'Funding Requirements'
  ];
  
  const pitchContent = slides.map((slide, index) => 
    `Slide ${index + 1}: ${slide}\n${startupData[slide.toLowerCase().replace(' ', '_')] || 'AI-generated content for ' + slide}\n\n`
  ).join('');
  
  return new Blob([pitchContent], { type: 'application/vnd.ms-powerpoint' });
}

// Generate financial model
export async function generateFinancialModel(startupData: any): Promise<Blob> {
  const csvContent = `
Year,Revenue,Expenses,Profit,Growth Rate
2025,100000,80000,20000,0%
2026,250000,180000,70000,150%
2027,600000,400000,200000,140%
2028,1200000,750000,450000,100%
2029,2000000,1200000,800000,67%
  `.trim();
  
  return new Blob([csvContent], { type: 'text/csv' });
}

// Download file with proper naming
export function downloadFile(blob: Blob, filename: string, mimeType?: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

// Create export package (ZIP file simulation)
export async function createExportPackage(
  items: DocumentTemplate[], 
  options: ExportOptions
): Promise<Blob> {
  // In a real implementation, this would use a library like JSZip
  const packageContent = items.map(item => 
    `File: ${item.name}\nType: ${item.type}\nContent: [Document content would be here]\n\n`
  ).join('---\n\n');
  
  const metadata = options.includeMetadata ? `
Export Metadata:
Generated: ${new Date().toISOString()}
Format: ${options.format}
Items: ${items.length}
Watermark: ${options.watermark ? 'Yes' : 'No'}

---

` : '';
  
  return new Blob([metadata + packageContent], { type: 'application/zip' });
}

// Get file size estimate
export function estimateFileSize(documentType: string, dataSize: number): string {
  const baseSizes = {
    'business-plan': 2.4, // MB
    'pitch-deck': 1.8,
    'financial-model': 0.9,
    'market-research': 1.2,
    'legal-docs': 1.5
  };
  
  const baseSize = baseSizes[documentType as keyof typeof baseSizes] || 1.0;
  const scaledSize = baseSize * (1 + dataSize / 10000); // Scale based on data amount
  
  return scaledSize < 1 ? `${Math.round(scaledSize * 1000)} KB` : `${scaledSize.toFixed(1)} MB`;
}

// Email export package
export async function emailExportPackage(
  recipientEmail: string, 
  packageBlob: Blob, 
  message?: string
): Promise<boolean> {
  // In a real implementation, this would call a backend API
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email sent to ${recipientEmail} with package (${packageBlob.size} bytes)`);
      if (message) console.log(`Message: ${message}`);
      resolve(true);
    }, 1500);
  });
}

// Generate share link
export async function generateShareLink(
  packageBlob: Blob, 
  expirationDays: number = 7
): Promise<string> {
  // In a real implementation, this would upload to cloud storage and return a signed URL
  return new Promise((resolve) => {
    setTimeout(() => {
      const linkId = Math.random().toString(36).substring(7);
      const shareUrl = `https://mystartup.ai/shared/${linkId}`;
      resolve(shareUrl);
    }, 1000);
  });
}