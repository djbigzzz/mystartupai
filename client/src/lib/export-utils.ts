// Export utility functions for document generation and download
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'xlsx' | 'zip';
  items: string[];
  includeMetadata?: boolean;
  watermark?: boolean;
}

export interface FinancialReportData {
  companyName: string;
  scenario: string;
  metrics: {
    revenue: any;
    expenses: any;
    ltv: number;
    cac: number;
    runway: number;
    breakEvenMonth: number;
    grossMargin: number;
  };
  monthlyData?: any[];
  chartElements?: HTMLElement[];
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

// Generate financial model PDF
export async function generateFinancialModelPDF(reportData: FinancialReportData): Promise<Blob> {
  const pdf = new jsPDF();
  
  // Title page
  pdf.setFontSize(20);
  pdf.text(`Financial Model Report - ${reportData.companyName}`, 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Scenario: ${reportData.scenario}`, 20, 50);
  pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 60);
  
  // Executive Summary
  pdf.setFontSize(16);
  pdf.text('Executive Summary', 20, 80);
  
  pdf.setFontSize(10);
  const summaryY = 95;
  const metrics = reportData.metrics;
  
  pdf.text(`• Break-even Month: ${metrics.breakEvenMonth}`, 20, summaryY);
  pdf.text(`• Runway: ${metrics.runway.toFixed(0)} months`, 20, summaryY + 10);
  pdf.text(`• Gross Margin: ${metrics.grossMargin}%`, 20, summaryY + 20);
  pdf.text(`• LTV:CAC Ratio: ${(metrics.ltv / metrics.cac).toFixed(1)}:1`, 20, summaryY + 30);
  
  // 5-Year Revenue Projections
  pdf.setFontSize(16);
  pdf.text('5-Year Financial Projections', 20, summaryY + 60);
  
  pdf.setFontSize(10);
  let tableY = summaryY + 75;
  
  // Table headers
  pdf.text('Year', 20, tableY);
  pdf.text('Revenue', 60, tableY);
  pdf.text('Expenses', 100, tableY);
  pdf.text('Profit', 140, tableY);
  pdf.text('Margin', 170, tableY);
  
  tableY += 10;
  
  // Table data
  Object.entries(metrics.revenue).forEach(([year, revenue], index) => {
    const yearNum = index + 1;
    const expense = metrics.expenses[year as keyof typeof metrics.expenses];
    const profit = (revenue as number) - expense;
    const margin = ((profit / (revenue as number)) * 100).toFixed(1);
    
    pdf.text(`Year ${yearNum}`, 20, tableY);
    pdf.text(`$${((revenue as number) / 1000000).toFixed(1)}M`, 60, tableY);
    pdf.text(`$${(expense / 1000000).toFixed(1)}M`, 100, tableY);
    pdf.text(`$${(profit / 1000000).toFixed(1)}M`, 140, tableY);
    pdf.text(`${margin}%`, 170, tableY);
    
    tableY += 10;
  });
  
  // Unit Economics
  pdf.addPage();
  pdf.setFontSize(16);
  pdf.text('Unit Economics', 20, 30);
  
  pdf.setFontSize(12);
  pdf.text(`Customer Lifetime Value (LTV): $${metrics.ltv.toFixed(0)}`, 20, 50);
  pdf.text(`Customer Acquisition Cost (CAC): $${metrics.cac.toFixed(0)}`, 20, 65);
  pdf.text(`LTV:CAC Ratio: ${(metrics.ltv / metrics.cac).toFixed(1)}:1`, 20, 80);
  pdf.text(`Gross Margin: ${metrics.grossMargin}%`, 20, 95);
  
  // Capture charts if provided
  if (reportData.chartElements && reportData.chartElements.length > 0) {
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Financial Charts', 20, 30);
    
    // Note: In a real implementation, you would capture charts using html2canvas
    // and add them to the PDF
    pdf.setFontSize(10);
    pdf.text('Charts would be embedded here from html2canvas capture', 20, 50);
  }
  
  // Monthly Cash Flow (if available)
  if (reportData.monthlyData && reportData.monthlyData.length > 0) {
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.text('Monthly Cash Flow Analysis', 20, 30);
    
    pdf.setFontSize(8);
    let monthlyY = 50;
    
    // Headers
    pdf.text('Month', 20, monthlyY);
    pdf.text('Revenue', 50, monthlyY);
    pdf.text('Expenses', 80, monthlyY);
    pdf.text('Cash Flow', 110, monthlyY);
    pdf.text('Customers', 140, monthlyY);
    
    monthlyY += 8;
    
    // First 24 months data
    reportData.monthlyData.slice(0, 24).forEach((month) => {
      pdf.text(month.month.toString(), 20, monthlyY);
      pdf.text(`$${(month.revenue / 1000).toFixed(0)}K`, 50, monthlyY);
      pdf.text(`$${(month.expense / 1000).toFixed(0)}K`, 80, monthlyY);
      pdf.text(`$${(month.cashFlow / 1000).toFixed(0)}K`, 110, monthlyY);
      pdf.text(month.customers.toString(), 140, monthlyY);
      
      monthlyY += 6;
      
      // Add new page if needed
      if (monthlyY > 250) {
        pdf.addPage();
        monthlyY = 30;
      }
    });
  }
  
  return new Blob([pdf.output('blob')], { type: 'application/pdf' });
}

// Generate financial model CSV
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