import jsPDF from 'jspdf';
import { Hotel } from '../data/hotels';

interface GuestAssignment {
  name: string;
  roomNumber: number;
  roomType: string;
  bedType: string;
}

function generateBookingId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'ZT-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function generateBarcodeData(): string {
  let barcode = '';
  for (let i = 0; i < 20; i++) {
    barcode += Math.floor(Math.random() * 10).toString();
  }
  return barcode;
}

function drawBarcode(doc: jsPDF, x: number, y: number, data: string, width: number, height: number) {
  // Draw a Code 128 style barcode
  const barWidth = width / data.length;
  for (let i = 0; i < data.length; i++) {
    const digit = parseInt(data[i]);
    if (digit % 2 === 0) {
      doc.setFillColor(0, 0, 0);
      doc.rect(x + i * barWidth, y, barWidth * 0.8, height, 'F');
    }
  }
  // Add numbers below barcode
  doc.setFontSize(6);
  doc.setTextColor(0, 0, 0);
  doc.text(data, x + width / 2, y + height + 3, { align: 'center' });
}

function drawStarRating(doc: jsPDF, x: number, y: number, stars: number) {
  doc.setFontSize(10);
  doc.setTextColor(255, 165, 0);
  let starStr = '';
  for (let i = 0; i < stars; i++) {
    starStr += '★';
  }
  doc.text(starStr, x, y);
}

function drawConfirmedStamp(doc: jsPDF, x: number, y: number) {
  // Draw circular stamp
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(1.5);
  doc.circle(x, y, 12);
  doc.setFillColor(34, 139, 34, 0.1);
  doc.circle(x, y, 12, 'F');
  
  doc.setFontSize(7);
  doc.setTextColor(34, 139, 34);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED', x, y - 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('VERIFIED', x, y + 3, { align: 'center' });
}

function drawLogo(doc: jsPDF, x: number, y: number) {
  // Draw a professional travel agency logo
  // Background circle
  doc.setFillColor(220, 38, 38);
  doc.circle(x + 8, y + 8, 8, 'F');
  
  // Inner design - airplane wing shape
  doc.setFillColor(255, 165, 0);
  doc.triangle(x + 4, y + 10, x + 12, y + 4, x + 12, y + 12, 'F');
  
  // Text
  doc.setFontSize(11);
  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  doc.text('ZAIN', x + 18, y + 7);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('TRAVEL & TOURISM', x + 18, y + 12);
}

export function generateVoucherPDF(
  hotel: Hotel,
  guests: string[],
  checkInDate: string,
  checkOutDate: string,
  boardBasis: string
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;
  
  // Assign guests to rooms (2 per room)
  const assignments: GuestAssignment[] = [];
  let roomNumber = 101;
  
  for (let i = 0; i < guests.length; i++) {
    const roomType = hotel.roomTypes[Math.floor(Math.random() * hotel.roomTypes.length)];
    const bedTypes = ['Twin Bed', 'Double Bed', 'King Bed'];
    const bedType = bedTypes[Math.floor(Math.random() * bedTypes.length)];
    
    assignments.push({
      name: guests[i].trim(),
      roomNumber: roomNumber,
      roomType: roomType,
      bedType: bedType
    });
    
    // Every 2 guests, increment room number
    if ((i + 1) % 2 === 0) {
      roomNumber++;
    }
  }

  // ===== HEADER SECTION =====
  // Top decorative bar
  doc.setFillColor(15, 23, 42); // Deep navy
  doc.rect(0, 0, pageWidth, 8, 'F');
  
  // Logo at top center
  drawLogo(doc, pageWidth / 2 - 25, 12);
  
  // Title - Booking Voucher
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('BOOKING VOUCHER', pageWidth / 2, 32, { align: 'center' });
  
  // Decorative line under title
  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.5);
  doc.line(margin, 35, pageWidth - margin, 35);
  
  // Booking ID and timestamp
  const bookingId = generateBookingId();
  const timestamp = new Date().toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`Booking ID: ${bookingId}`, pageWidth - margin, 14, { align: 'right' });
  doc.text(`Issued: ${timestamp}`, pageWidth - margin, 18, { align: 'right' });
  
  // ===== HOTEL SECTION =====
  let currentY = 42;
  
  // Hotel name
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text(hotel.name, pageWidth / 2, currentY, { align: 'center' });
  
  // Star rating
  currentY += 6;
  drawStarRating(doc, pageWidth / 2 - 15, currentY, hotel.starRating);
  
  // Hotel address
  currentY += 5;
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(hotel.address, pageWidth / 2, currentY, { align: 'center' });
  
  // Confirmed stamp
  drawConfirmedStamp(doc, pageWidth - margin - 15, currentY - 3);
  
  // ===== BOOKING DETAILS SECTION =====
  currentY += 12;
  
  // Section background
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(margin, currentY - 3, contentWidth, 30, 2, 2, 'F');
  
  // Check-in / Check-out
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('CHECK-IN', margin + 5, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(checkInDate, margin + 5, currentY + 10);
  
  // Divider
  doc.setDrawColor(200, 200, 200);
  doc.line(pageWidth / 2 - 20, currentY, pageWidth / 2 - 20, currentY + 22);
  doc.line(pageWidth / 2 + 20, currentY, pageWidth / 2 + 20, currentY + 22);
  
  // Duration
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text('NIGHTS', pageWidth / 2 - 5, currentY + 4);
  doc.setFontSize(14);
  doc.setTextColor(220, 38, 38);
  doc.setFont('helvetica', 'bold');
  const nights = calculateNights(checkInDate, checkOutDate);
  doc.text(nights.toString(), pageWidth / 2 - 2, currentY + 12);
  
  // Check-out
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('CHECK-OUT', pageWidth / 2 + 25, currentY + 4);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.text(checkOutDate, pageWidth / 2 + 25, currentY + 10);
  
  // Board basis
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Board: ${boardBasis}`, margin + 5, currentY + 22);
  doc.text(`Guests: ${guests.length}`, pageWidth - margin - 5, currentY + 22, { align: 'right' });
  
  currentY += 35;
  
  // ===== GUEST LIST TABLE =====
  // Table header
  doc.setFillColor(15, 23, 42);
  doc.rect(margin, currentY, contentWidth, 8, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('#', margin + 3, currentY + 5.5);
  doc.text('GUEST NAME', margin + 15, currentY + 5.5);
  doc.text('ROOM NO.', margin + 100, currentY + 5.5);
  doc.text('ROOM TYPE', margin + 125, currentY + 5.5);
  doc.text('BED', margin + 170, currentY + 5.5);
  
  currentY += 8;
  
  // Group guests by room
  const roomGroups: { [key: number]: GuestAssignment[] } = {};
  assignments.forEach(a => {
    if (!roomGroups[a.roomNumber]) roomGroups[a.roomNumber] = [];
    roomGroups[a.roomNumber].push(a);
  });
  
  let guestIndex = 1;
  const roomNumbers = Object.keys(roomGroups).map(Number).sort((a, b) => a - b);
  
  roomNumbers.forEach(roomNum => {
    const roomGuests = roomGroups[roomNum];
    
    roomGuests.forEach((assignment, idx) => {
      // Alternating row colors
      if (guestIndex % 2 === 0) {
        doc.setFillColor(248, 250, 252);
        doc.rect(margin, currentY, contentWidth, 7, 'F');
      }
      
      // Row border
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, currentY + 7, margin + contentWidth, currentY + 7);
      
      doc.setFontSize(8);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');
      doc.text(guestIndex.toString(), margin + 5, currentY + 5);
      doc.setFont('helvetica', 'bold');
      doc.text(assignment.name.substring(0, 45), margin + 15, currentY + 5);
      doc.setFont('helvetica', 'normal');
      
      // Room number (only show for first guest in room)
      if (idx === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(220, 38, 38);
        doc.text(roomNum.toString(), margin + 103, currentY + 5);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(assignment.roomType, margin + 125, currentY + 5);
        doc.text(assignment.bedType, margin + 170, currentY + 5);
      } else {
        doc.text(assignment.roomType, margin + 125, currentY + 5);
        doc.text(assignment.bedType, margin + 170, currentY + 5);
      }
      
      currentY += 7;
      guestIndex++;
      
      // Check if we need a new page
      if (currentY > 260) {
        doc.addPage();
        currentY = 20;
      }
    });
  });
  
  // ===== PAYMENT SECTION =====
  currentY += 8;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'F');
  doc.setDrawColor(34, 197, 94);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, currentY, contentWidth, 18, 2, 2, 'S');
  
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT STATUS: PAID', margin + 5, currentY + 6);
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Total Guests: ${guests.length}  |  Total Rooms: ${roomNumbers.length}  |  ${nights} Night(s)`, margin + 5, currentY + 12);
  doc.text(`Amount: ${hotel.price} × ${roomNumbers.length} rooms`, pageWidth - margin - 5, currentY + 12, { align: 'right' });
  
  // ===== NON-REFUNDABLE BANNER =====
  currentY += 24;
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFillColor(220, 38, 38);
  doc.roundedRect(margin, currentY, contentWidth, 8, 1, 1, 'F');
  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('⚠ THIS BOOKING IS NON-REFUNDABLE', pageWidth / 2, currentY + 5.5, { align: 'center' });
  
  // ===== POLICY NOTES =====
  currentY += 14;
  if (currentY > 250) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  const policies = [
    '• Check-in time: 15:00 | Check-out time: 12:00',
    '• All guests must present valid passport/ID at check-in',
    '• Room allocation is subject to availability at time of check-in',
    '• Any modifications or cancellations are not permitted for this booking',
    '• Hotel reserves the right to charge security deposit at check-in'
  ];
  
  policies.forEach(policy => {
    doc.text(policy, margin + 2, currentY);
    currentY += 4;
  });
  
  // ===== BARCODE SECTION =====
  currentY += 8;
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }
  
  const barcodeData = generateBarcodeData();
  drawBarcode(doc, pageWidth / 2 - 30, currentY, barcodeData, 60, 15);
  
  // ===== SUPPORT CONTACT =====
  currentY += 25;
  if (currentY > 275) {
    doc.addPage();
    currentY = 20;
  }
  
  doc.setFillColor(15, 23, 42);
  doc.rect(0, currentY, pageWidth, 20, 'F');
  
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('24/7 SUPPORT', pageWidth / 2, currentY + 5, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.text(`Phone: +971 4 XXX XXXX  |  Email: support@zaintravel.com  |  WhatsApp: +971 50 XXX XXXX`, pageWidth / 2, currentY + 10, { align: 'center' });
  doc.text(`Zain Travel & Tourism LLC | Licensed by DTCM | License No: XXXXX`, pageWidth / 2, currentY + 15, { align: 'center' });
  
  // Bottom decorative bar
  doc.setFillColor(220, 38, 38);
  doc.rect(0, currentY + 18, pageWidth, 2, 'F');
  
  return doc;
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

export function generateBulkVouchers(
  hotel: Hotel,
  guests: string[],
  checkInDate: string,
  checkOutDate: string,
  boardBasis: string
): void {
  const doc = generateVoucherPDF(hotel, guests, checkInDate, checkOutDate, boardBasis);
  const fileName = `${hotel.name.replace(/[^a-zA-Z0-9]/g, '_')}_Voucher_${Date.now()}.pdf`;
  doc.save(fileName);
}
