import { jsPDF } from 'jspdf';
import { Hotel } from '../data/hotels';

export type VoucherTemplate = 'classic' | 'luxury' | 'modern' | 'corporate';

interface GuestAssignment {
  name: string;
  roomNumber: number;
  roomType: string;
  bedType: string;
}

// Hotel brand colors for visual identity
const hotelBrands: Record<string, { primary: string; secondary: string; accent: string }> = {
  'jw-marriott-marquis': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'atlantis-palm': { primary: '#003366', secondary: '#00A5E0', accent: '#FFD700' },
  'creekside-accor': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'doubletree-m-square': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'radisson-deira-creek': { primary: '#003DA5', secondary: '#FFD100', accent: '#CC0000' },
  'westminster-dubai-mall': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'millennium-central': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'marriott-executive-creek': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'tower-plaza': { primary: '#1C1C1C', secondary: '#C4A35A', accent: '#8B0000' },
  'movenpick-creek': { primary: '#8B0000', secondary: '#D4AF37', accent: '#2F4F4F' },
  'paramount-dubai': { primary: '#1a1a1a', secondary: '#C4A35A', accent: '#8B0000' },
  'holiday-inn-express-airport': { primary: '#007B5F', secondary: '#FFC72C', accent: '#1a1a1a' },
  'mercure-gold-al-mina': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'holiday-inn-express-safa': { primary: '#007B5F', secondary: '#FFC72C', accent: '#1a1a1a' },
  'golden-sands-3': { primary: '#D4AF37', secondary: '#8B4513', accent: '#1a1a1a' },
  'ibis-styles-deira': { primary: '#E30613', secondary: '#1a1a1a', accent: '#FFC72C' },
  'atana-hotel': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'jannah-creek': { primary: '#006847', secondary: '#D4AF37', accent: '#1a1a1a' },
  'courtyard-wtc': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'four-points-sheikh-zayed': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'emirates-palace': { primary: '#D4AF37', secondary: '#8B4513', accent: '#1a1a1a' },
  'dusit-thani-ad': { primary: '#6B2D5B', secondary: '#D4AF37', accent: '#1a1a1a' },
  'rixos-marina': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'khalidiya-palace': { primary: '#006847', secondary: '#D4AF37', accent: '#1a1a1a' },
  'hilton-yas-island': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'w-abu-dhabi': { primary: '#1a1a1a', secondary: '#555555', accent: '#8B0000' },
  'royal-m-hotel': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'intercontinental-abu-dhabi': { primary: '#003366', secondary: '#7EB5DA', accent: '#00A859' },
  'conrad-etihad': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#8B0000' },
  'grand-hyatt-ad': { primary: '#002F6C', secondary: '#1E4D8C', accent: '#D4AF37' },
  'marriott-downtown-ad': { primary: '#6B2D5B', secondary: '#B8860B', accent: '#1a1a1a' },
  'royal-rose': { primary: '#8B0000', secondary: '#D4AF37', accent: '#1a1a1a' },
  'sofitel-corniche': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
  'st-regis-ad': { primary: '#1a1a1a', secondary: '#C4A35A', accent: '#8B0000' },
  'four-seasons-al-maryah': { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' },
};

function getBrandColors(hotelId: string) {
  return hotelBrands[hotelId] || { primary: '#1B365D', secondary: '#C4A35A', accent: '#8B0000' };
}

function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

function calculateNights(checkIn: string, checkOut: string): number {
  try {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate.getTime() - inDate.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  } catch {
    return 1;
  }
}

// Draw subtle watermark for CONFIRMED (using light color as opacity substitute)
function drawConfirmedWatermark(doc: jsPDF, x: number, y: number, color: [number, number, number]) {
  // Blend color with white to simulate low opacity
  const lightColor: [number, number, number] = [
    Math.min(255, color[0] + 200),
    Math.min(255, color[1] + 200),
    Math.min(255, color[2] + 200)
  ];
  
  doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
  doc.setFontSize(36);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED', x, y, { angle: -15 });
  
  doc.setFontSize(14);
  doc.text('GUARANTEED', x + 5, y + 12, { angle: -15 });
}

// Draw subtle watermark for PAID
function drawPaidWatermark(doc: jsPDF, x: number, y: number, color: [number, number, number]) {
  const lightColor: [number, number, number] = [
    Math.min(255, color[0] + 210),
    Math.min(255, color[1] + 210),
    Math.min(255, color[2] + 210)
  ];
  
  doc.setTextColor(lightColor[0], lightColor[1], lightColor[2]);
  doc.setFontSize(30);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID', x, y, { angle: -12 });
}

// Draw prominent booking reference
function drawBookingReference(doc: jsPDF, bookingRef: string, x: number, y: number, width: number, colors: { primary: [number, number, number]; secondary: [number, number, number] }) {
  // Box background
  doc.setFillColor(250, 250, 252);
  doc.roundedRect(x, y, width, 18, 2, 2, 'F');
  doc.setDrawColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(x, y, width, 18, 2, 2, 'S');
  
  // Label
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('BOOKING REFERENCE', x + 5, y + 5);
  
  // Reference number
  doc.setFontSize(14);
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.setFont('courier', 'bold');
  doc.text(bookingRef, x + 5, y + 13);
  
  // Date on right
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  doc.text(`Issued: ${issueDate}`, x + width - 5, y + 5, { align: 'right' });
  doc.text(`Ref #: ${bookingRef}`, x + width - 5, y + 13, { align: 'right' });
}

export function generateVoucherPDF(
  hotel: Hotel,
  guests: string[],
  checkInDate: string,
  checkOutDate: string,
  boardBasis: string,
  template: VoucherTemplate = 'classic'
): jsPDF {
  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const margin = 18;
    const contentWidth = pageWidth - margin * 2;
    const colors = getBrandColors(hotel.id);
    const [pr, pg, pb] = hexToRgb(colors.primary);
    const [sr, sg, sb] = hexToRgb(colors.secondary);
    const [ar, ag, ab] = hexToRgb(colors.accent);
    
    // Assign guests to rooms (2 per room)
    const assignments: GuestAssignment[] = [];
    let roomNumber = 101;
    
    for (let i = 0; i < guests.length; i++) {
      const roomType = hotel.roomTypes[i % hotel.roomTypes.length];
      const bedTypes = ['Twin Bed', 'Double Bed', 'King Bed', 'Queen Bed'];
      const bedType = bedTypes[i % bedTypes.length];
      
      assignments.push({
        name: guests[i].trim(),
        roomNumber: roomNumber,
        roomType: roomType,
        bedType: bedType
      });
      
      if ((i + 1) % 2 === 0) {
        roomNumber++;
      }
    }

    const bookingRef = generateBookingId();
    const nights = calculateNights(checkInDate, checkOutDate);
    const roomCount = Math.ceil(guests.length / 2);
    const roomNumbers = assignments.map(a => a.roomNumber).filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b);

    // ===== TEMPLATE-SPECIFIC HEADER =====
    let currentY = 10;
    
    if (template === 'classic') {
      // Top accent bars
      doc.setFillColor(pr, pg, pb);
      doc.rect(0, 0, pageWidth, 4, 'F');
      doc.setFillColor(sr, sg, sb);
      doc.rect(0, 4, pageWidth, 1.5, 'F');
      currentY = 14;
    } else if (template === 'luxury') {
      // Luxury: Gold border frame
      doc.setDrawColor(sr, sg, sb);
      doc.setLineWidth(0.8);
      doc.rect(8, 8, pageWidth - 16, 289 - 16);
      doc.setDrawColor(pr, pg, pb);
      doc.setLineWidth(0.3);
      doc.rect(10, 10, pageWidth - 20, 289 - 20);
      currentY = 18;
    } else if (template === 'modern') {
      // Modern: Minimal top line
      doc.setFillColor(pr, pg, pb);
      doc.rect(margin, 10, contentWidth, 0.5, 'F');
      currentY = 16;
    } else if (template === 'corporate') {
      // Corporate: Full width header block
      doc.setFillColor(pr, pg, pb);
      doc.rect(0, 0, pageWidth, 35, 'F');
      currentY = 12;
    }

    // ===== BOOKING REFERENCE (PROMINENT) =====
    drawBookingReference(doc, bookingRef, margin, currentY, contentWidth, {
      primary: [pr, pg, pb],
      secondary: [sr, sg, sb]
    });
    currentY += 24;

    // ===== HOTEL HEADER =====
    if (template === 'classic') {
      doc.setFontSize(18);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(hotel.name.toUpperCase(), margin, currentY + 5);
      
      doc.setFontSize(10);
      doc.setTextColor(sr, sg, sb);
      doc.text('★'.repeat(hotel.starRating) + '☆'.repeat(5 - hotel.starRating), margin, currentY + 12);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(hotel.address, margin, currentY + 18);
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text(`Tel: ${hotel.phone}`, pageWidth - margin, currentY + 18, { align: 'right' });
      currentY += 24;
    } else if (template === 'luxury') {
      // Centered elegant header
      doc.setFontSize(9);
      doc.setTextColor(sr, sg, sb);
      doc.setFont('helvetica', 'normal');
      doc.text('— ESTABLISHED EXCELLENCE —', pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 6;
      doc.setFontSize(20);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(hotel.name.toUpperCase(), pageWidth / 2, currentY + 5, { align: 'center' });
      
      // Decorative line
      doc.setDrawColor(sr, sg, sb);
      doc.setLineWidth(0.3);
      doc.line(pageWidth / 2 - 30, currentY + 8, pageWidth / 2 + 30, currentY + 8);
      
      currentY += 12;
      doc.setFontSize(10);
      doc.setTextColor(sr, sg, sb);
      doc.text('★ '.repeat(hotel.starRating).trim(), pageWidth / 2, currentY, { align: 'center' });
      
      currentY += 5;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont('helvetica', 'normal');
      doc.text(hotel.address, pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;
    } else if (template === 'modern') {
      doc.setFontSize(22);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(hotel.name.toUpperCase(), margin, currentY + 5);
      
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text(`${hotel.starRating}-STAR  •  ${hotel.address}`, margin, currentY + 12);
      currentY += 20;
    } else if (template === 'corporate') {
      // White text on dark header
      doc.setFontSize(18);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text(hotel.name.toUpperCase(), margin, currentY + 5);
      
      doc.setFontSize(9);
      doc.setTextColor(200, 200, 200);
      doc.setFont('helvetica', 'normal');
      doc.text('★'.repeat(hotel.starRating), margin, currentY + 12);
      doc.text(hotel.address, margin, currentY + 18);
      doc.text(`Tel: ${hotel.phone}`, pageWidth - margin, currentY + 18, { align: 'right' });
      currentY = 42;
    }

    // ===== SUBTLE CONFIRMED WATERMARK (Background) =====
    drawConfirmedWatermark(doc, pageWidth / 2 - 20, currentY + 30, [pr, pg, pb]);

    // ===== TITLE =====
    if (template === 'luxury') {
      doc.setFontSize(11);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'normal');
      doc.text('RESERVATION CONFIRMATION', pageWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('A confirmation of your exclusive stay', pageWidth / 2, currentY + 5, { align: 'center' });
    } else {
      doc.setFontSize(13);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text('HOTEL BOOKING VOUCHER', pageWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('This document serves as confirmation of your hotel reservation', pageWidth / 2, currentY + 5, { align: 'center' });
    }
    currentY += 14;

    // ===== DATES SECTION =====
    const colWidth = contentWidth / 3;
    
    if (template === 'luxury') {
      // Luxury: Elegant date display
      doc.setDrawColor(sr, sg, sb);
      doc.setLineWidth(0.2);
      doc.line(margin, currentY, pageWidth - margin, currentY);
      currentY += 5;
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('ARRIVAL', margin + colWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(checkInDate), margin + colWidth / 2, currentY + 6, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('DURATION', margin + colWidth + colWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(14);
      doc.setTextColor(ar, ag, ab);
      doc.setFont('helvetica', 'bold');
      doc.text(`${nights} NIGHTS`, margin + colWidth + colWidth / 2, currentY + 6, { align: 'center' });
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('DEPARTURE', margin + colWidth * 2 + colWidth / 2, currentY, { align: 'center' });
      doc.setFontSize(10);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(checkOutDate), margin + colWidth * 2 + colWidth / 2, currentY + 6, { align: 'center' });
      
      currentY += 12;
      doc.setDrawColor(sr, sg, sb);
      doc.line(margin, currentY, pageWidth - margin, currentY);
    } else {
      // Standard date box
      doc.setFillColor(248, 249, 252);
      doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');
      doc.setDrawColor(220, 220, 230);
      doc.setLineWidth(0.2);
      doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'S');
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.setFont('helvetica', 'normal');
      doc.text('CHECK-IN', margin + colWidth / 2, currentY + 5, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(checkInDate), margin + colWidth / 2, currentY + 12, { align: 'center' });
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('After 15:00', margin + colWidth / 2, currentY + 17, { align: 'center' });
      
      doc.setDrawColor(200, 200, 210);
      doc.line(margin + colWidth, currentY + 3, margin + colWidth, currentY + 19);
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('DURATION', margin + colWidth + colWidth / 2, currentY + 5, { align: 'center' });
      doc.setFontSize(16);
      doc.setTextColor(ar, ag, ab);
      doc.setFont('helvetica', 'bold');
      doc.text(`${nights}`, margin + colWidth + colWidth / 2 - 4, currentY + 14, { align: 'center' });
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      doc.text('NIGHTS', margin + colWidth + colWidth / 2 + 5, currentY + 14);
      doc.setFontSize(7);
      doc.text(`${boardBasis}`, margin + colWidth + colWidth / 2, currentY + 19, { align: 'center' });
      
      doc.setDrawColor(200, 200, 210);
      doc.line(margin + colWidth * 2, currentY + 3, margin + colWidth * 2, currentY + 19);
      
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('CHECK-OUT', margin + colWidth * 2 + colWidth / 2, currentY + 5, { align: 'center' });
      doc.setFontSize(11);
      doc.setTextColor(pr, pg, pb);
      doc.setFont('helvetica', 'bold');
      doc.text(formatDate(checkOutDate), margin + colWidth * 2 + colWidth / 2, currentY + 12, { align: 'center' });
      doc.setFontSize(7);
      doc.setTextColor(120, 120, 120);
      doc.text('Before 12:00', margin + colWidth * 2 + colWidth / 2, currentY + 17, { align: 'center' });
    }
    currentY += 28;

    // ===== GUEST TABLE =====
    doc.setFontSize(9);
    doc.setTextColor(pr, pg, pb);
    doc.setFont('helvetica', 'bold');
    doc.text('GUEST & ROOM ALLOCATION', margin, currentY);
    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text(`${guests.length} Guest(s) | ${roomCount} Room(s)`, pageWidth - margin, currentY, { align: 'right' });
    currentY += 4;
    
    // Table header
    doc.setFillColor(pr, pg, pb);
    doc.roundedRect(margin, currentY, contentWidth, 7, 1, 1, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('S/N', margin + 4, currentY + 4.5);
    doc.text('GUEST NAME', margin + 14, currentY + 4.5);
    doc.text('ROOM', margin + 105, currentY + 4.5, { align: 'center' });
    doc.text('ROOM TYPE', margin + 125, currentY + 4.5);
    doc.text('BEDDING', margin + 168, currentY + 4.5);
    currentY += 7;
    
    // Group by room
    const roomGroups: { [key: number]: GuestAssignment[] } = {};
    assignments.forEach(a => {
      if (!roomGroups[a.roomNumber]) roomGroups[a.roomNumber] = [];
      roomGroups[a.roomNumber].push(a);
    });
    
    let guestIndex = 1;
    const sortedRoomNumbers = Object.keys(roomGroups).map(Number).sort((a, b) => a - b);
    
    sortedRoomNumbers.forEach((roomNum, rIdx) => {
      const roomGuests = roomGroups[roomNum];
      
      if (rIdx > 0) {
        doc.setDrawColor(230, 230, 235);
        doc.setLineWidth(0.1);
        doc.line(margin + 2, currentY - 0.5, margin + contentWidth - 2, currentY - 0.5);
      }
      
      roomGuests.forEach((assignment, idx) => {
        if (guestIndex % 2 === 0) {
          doc.setFillColor(248, 249, 252);
          doc.rect(margin, currentY, contentWidth, 7, 'F');
        }
        
        doc.setFontSize(7.5);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'normal');
        doc.text(guestIndex.toString(), margin + 5, currentY + 4.5);
        
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(40, 40, 40);
        const displayName = assignment.name.length > 42 ? assignment.name.substring(0, 42) + '...' : assignment.name;
        doc.text(displayName, margin + 14, currentY + 4.5);
        
        if (idx === 0) {
          doc.setFontSize(8);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(pr, pg, pb);
          doc.text(roomNum.toString(), margin + 105, currentY + 4.5, { align: 'center' });
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(80, 80, 80);
          doc.text(assignment.roomType, margin + 125, currentY + 4.5);
          doc.text(assignment.bedType, margin + 168, currentY + 4.5);
        } else {
          doc.setFontSize(7);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(150, 150, 150);
          doc.text('—', margin + 105, currentY + 4.5, { align: 'center' });
          doc.setTextColor(80, 80, 80);
          doc.text(assignment.roomType, margin + 125, currentY + 4.5);
          doc.text(assignment.bedType, margin + 168, currentY + 4.5);
        }
        
        currentY += 7;
        guestIndex++;
        
        if (currentY > 255) {
          doc.addPage();
          currentY = 20;
        }
      });
    });

    // ===== SUMMARY BOX WITH PAID WATERMARK =====
    currentY += 6;
    if (currentY > 240) {
      doc.addPage();
      currentY = 20;
    }
    
    // PAID watermark
    drawPaidWatermark(doc, pageWidth - margin - 40, currentY + 10, [34, 139, 34]);
    
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'F');
    doc.setDrawColor(220, 220, 230);
    doc.setLineWidth(0.2);
    doc.roundedRect(margin, currentY, contentWidth, 16, 2, 2, 'S');
    
    doc.setFontSize(8);
    doc.setTextColor(pr, pg, pb);
    doc.setFont('helvetica', 'bold');
    doc.text('BOOKING SUMMARY', margin + 5, currentY + 5);
    
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Guests: ${guests.length}`, margin + 5, currentY + 10);
    doc.text(`Total Rooms: ${roomCount}`, margin + 50, currentY + 10);
    doc.text(`Duration: ${nights} Night(s)`, margin + 90, currentY + 10);
    doc.text(`Board: ${boardBasis}`, margin + 130, currentY + 10);
    
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Rate: ${hotel.price}/night`, margin + 5, currentY + 14);
    doc.text(`Room Range: ${roomNumbers[0]} - ${roomNumbers[roomNumbers.length - 1]}`, margin + 50, currentY + 14);
    
    // Subtle paid indicator (not a bold badge)
    doc.setFontSize(7);
    doc.setTextColor(34, 139, 34);
    doc.setFont('helvetica', 'italic');
    doc.text('Payment Received', pageWidth - margin - 5, currentY + 14, { align: 'right' });

    // ===== NON-REFUNDABLE NOTICE =====
    currentY += 22;
    if (currentY > 255) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFillColor(ar, ag, ab);
    doc.roundedRect(margin, currentY, contentWidth, 8, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠  THIS BOOKING IS NON-REFUNDABLE AND NON-TRANSFERABLE', pageWidth / 2, currentY + 5, { align: 'center' });

    // ===== IMPORTANT NOTES =====
    currentY += 14;
    if (currentY > 260) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(8);
    doc.setTextColor(pr, pg, pb);
    doc.setFont('helvetica', 'bold');
    doc.text('IMPORTANT INFORMATION', margin, currentY);
    
    currentY += 5;
    doc.setFontSize(7);
    doc.setTextColor(80, 80, 80);
    doc.setFont('helvetica', 'normal');
    
    const notes = [
      '• Check-in time is 15:00. Early check-in is subject to availability.',
      '• Check-out time is 12:00. Late check-out may incur additional charges.',
      '• A valid passport or government-issued ID is required for all guests at check-in.',
      '• Room type and bed preference are subject to availability at time of arrival.',
      '• A security deposit may be required by the hotel at check-in.',
      '• This voucher must be presented at the hotel reception upon arrival.',
      '• For any amendments, please contact your travel agent directly.'
    ];
    
    notes.forEach(note => {
      doc.text(note, margin + 2, currentY);
      currentY += 4;
    });

    // ===== BOTTOM FOOTER =====
    currentY += 10;
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    
    // Footer bar
    doc.setFillColor(pr, pg, pb);
    doc.rect(0, currentY, pageWidth, 14, 'F');
    
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'normal');
    doc.text(hotel.name, margin, currentY + 4);
    doc.text(hotel.address.substring(0, 80), margin, currentY + 8);
    doc.text(`Tel: ${hotel.phone}`, margin, currentY + 12);
    
    doc.text(`Ref: ${bookingRef}`, pageWidth - margin, currentY + 4, { align: 'right' });
    doc.text('This is a computer-generated document', pageWidth - margin, currentY + 8, { align: 'right' });
    doc.text('No signature required', pageWidth - margin, currentY + 12, { align: 'right' });
    
    // Bottom accent
    doc.setFillColor(sr, sg, sb);
    doc.rect(0, currentY + 14, pageWidth, 2, 'F');

    return doc;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}
