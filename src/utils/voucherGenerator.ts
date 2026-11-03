import jsPDF from 'jspdf';
import { Hotel } from '../data/hotels';

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
  'w-abu-dhabi': { primary: '#1a1a1a', secondary: '#FFFFFF', accent: '#8B0000' },
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

function drawHotelLogo(doc: jsPDF, hotel: Hotel, x: number, y: number) {
  const colors = getBrandColors(hotel.id);
  const [pr, pg, pb] = hexToRgb(colors.primary);
  const [sr, sg, sb] = hexToRgb(colors.secondary);
  
  // Draw a sophisticated hotel emblem
  // Outer circle
  doc.setDrawColor(pr, pg, pb);
  doc.setLineWidth(0.8);
  doc.circle(x + 15, y + 15, 14);
  
  // Inner decorative elements
  doc.setFillColor(pr, pg, pb);
  doc.circle(x + 15, y + 15, 12, 'F');
  
  // Star or diamond in center
  doc.setFillColor(sr, sg, sb);
  doc.setFontSize(14);
  doc.setTextColor(sr, sg, sb);
  doc.text('★', x + 15, y + 19, { align: 'center' });
  
  // Hotel initials
  const initials = hotel.name.split(' ').filter(w => w.length > 2).slice(0, 2).map(w => w[0]).join('');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text(initials, x + 15, y + 13, { align: 'center' });
}

function drawBarcode(doc: jsPDF, x: number, y: number, data: string, width: number, height: number) {
  const barWidth = width / (data.length * 2);
  doc.setFillColor(0, 0, 0);
  
  for (let i = 0; i < data.length; i++) {
    const digit = parseInt(data[i]);
    const barH = height + (digit % 3);
    doc.rect(x + i * barWidth * 2, y, barWidth * 0.8, barH, 'F');
    if (digit > 5) {
      doc.rect(x + i * barWidth * 2 + barWidth, y, barWidth * 0.4, barH * 0.7, 'F');
    }
  }
  
  doc.setFontSize(7);
  doc.setTextColor(80, 80, 80);
  doc.setFont('courier', 'normal');
  doc.text(data, x + width / 2, y + height + 5, { align: 'center' });
}

function drawPartnersGrid(doc: jsPDF, x: number, y: number, width: number) {
  const partners = [
    'Jumeirah', 'Address Hotels', 'Armani Hotel', 'Burj Al Arab', 'One&Only',
    'Atlantis The Palm', 'Kempinski', 'Raffles', 'St. Regis', 'Ritz-Carlton',
    'Mandarin Oriental', 'Four Seasons', 'Waldorf Astoria', 'Park Hyatt', 'W Hotels',
    'Anantara', 'Taj Hotels', 'Oberoi', 'Palazzo Versace', 'Bvlgari Hotel',
    'Fairmont', 'Sofitel', 'Shangri-La', 'InterContinental', 'Marriott Luxury',
    'Westin', 'Le Méridien', 'Radisson Collection', 'Dusit Thani', 'Rixos',
    'Marriott Marquis', 'Hilton Luxury', 'Hyatt Regency', 'Rotana Premier', 'Minor Hotels'
  ];

  // Title
  doc.setFontSize(9);
  doc.setTextColor(44, 44, 44);
  doc.setFont('helvetica', 'normal');
  doc.text('PREMIER HOSPITALITY PARTNERS', x + width / 2, y, { align: 'center' });
  
  doc.setFontSize(6);
  doc.setTextColor(119, 119, 119);
  doc.text('A CURATED COLLECTION OF LUXURY BRANDS', x + width / 2, y + 4, { align: 'center' });

  // Grid
  const gridY = y + 8;
  const cols = 5;
  const cellWidth = width / cols;
  const cellHeight = 8;
  const rows = Math.ceil(partners.length / cols);

  // Draw grid background
  doc.setFillColor(248, 249, 250);
  doc.rect(x, gridY, width, rows * cellHeight, 'F');
  
  // Draw grid borders
  doc.setDrawColor(209, 213, 219);
  doc.setLineWidth(0.2);
  
  // Vertical lines
  for (let i = 0; i <= cols; i++) {
    doc.line(x + i * cellWidth, gridY, x + i * cellWidth, gridY + rows * cellHeight);
  }
  
  // Horizontal lines
  for (let i = 0; i <= rows; i++) {
    doc.line(x, gridY + i * cellHeight, x + width, gridY + i * cellHeight);
  }

  // Draw partner names
  doc.setFontSize(5.5);
  doc.setTextColor(75, 85, 99);
  doc.setFont('helvetica', 'normal');
  
  partners.forEach((partner, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    const cellX = x + col * cellWidth;
    const cellY = gridY + row * cellHeight;
    
    // Truncate long names
    let displayName = partner;
    if (displayName.length > 18) {
      displayName = displayName.substring(0, 17) + '…';
    }
    
    doc.text(displayName.toUpperCase(), cellX + cellWidth / 2, cellY + cellHeight / 2 + 1, { align: 'center' });
  });
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
  const issueDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const nights = calculateNights(checkInDate, checkOutDate);
  const roomCount = Math.ceil(guests.length / 2);

  // ===== TOP ACCENT BAR =====
  doc.setFillColor(pr, pg, pb);
  doc.rect(0, 0, pageWidth, 4, 'F');
  
  // Secondary accent line
  doc.setFillColor(sr, sg, sb);
  doc.rect(0, 4, pageWidth, 1.5, 'F');

  // ===== HEADER SECTION =====
  let currentY = 14;
  
  // Hotel Logo
  drawHotelLogo(doc, hotel, margin, currentY);
  
  // Hotel Name & Details
  doc.setFontSize(20);
  doc.setTextColor(pr, pg, pb);
  doc.setFont('helvetica', 'bold');
  doc.text(hotel.name.toUpperCase(), margin + 35, currentY + 8);
  
  // Star rating
  doc.setFontSize(11);
  doc.setTextColor(sr, sg, sb);
  doc.text('★'.repeat(hotel.starRating) + '☆'.repeat(5 - hotel.starRating), margin + 35, currentY + 15);
  
  // Address
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(hotel.address, margin + 35, currentY + 21);
  
  // Booking reference on right
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text('BOOKING REFERENCE', pageWidth - margin, currentY + 2, { align: 'right' });
  doc.setFontSize(12);
  doc.setTextColor(pr, pg, pb);
  doc.setFont('courier', 'bold');
  doc.text(bookingRef, pageWidth - margin, currentY + 8, { align: 'right' });
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'normal');
  doc.text(`ISSUED: ${issueDate}`, pageWidth - margin, currentY + 13, { align: 'right' });
  doc.text(hotel.phone, pageWidth - margin, currentY + 18, { align: 'right' });

  // ===== CONFIRMATION BADGE =====
  currentY = 40;
  const badgeX = pageWidth - margin - 22;
  const badgeY = currentY - 5;
  
  // Green confirmation circle
  doc.setDrawColor(34, 139, 34);
  doc.setLineWidth(1.2);
  doc.circle(badgeX, badgeY, 10);
  doc.setFillColor(34, 139, 34);
  doc.circle(badgeX, badgeY, 9, 'F');
  doc.setFontSize(6);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('CONFIRMED', badgeX, badgeY - 1, { align: 'center' });
  doc.setFontSize(5);
  doc.text('GUARANTEED', badgeX, badgeY + 3, { align: 'center' });

  // ===== DIVIDER =====
  currentY = 44;
  doc.setDrawColor(pr, pg, pb);
  doc.setLineWidth(0.3);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  doc.setDrawColor(sr, sg, sb);
  doc.setLineWidth(0.15);
  doc.line(margin, currentY + 1, pageWidth - margin, currentY + 1);

  // ===== BOOKING VOUCHER TITLE =====
  currentY += 8;
  doc.setFontSize(14);
  doc.setTextColor(pr, pg, pb);
  doc.setFont('helvetica', 'bold');
  doc.text('HOTEL BOOKING VOUCHER', pageWidth / 2, currentY, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('This document serves as confirmation of your hotel reservation', pageWidth / 2, currentY + 5, { align: 'center' });

  // ===== DATES SECTION =====
  currentY += 14;
  
  // Date box background
  doc.setFillColor(248, 249, 252);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'F');
  doc.setDrawColor(220, 220, 230);
  doc.setLineWidth(0.2);
  doc.roundedRect(margin, currentY, contentWidth, 22, 2, 2, 'S');
  
  // Check-in
  const colWidth = contentWidth / 3;
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
  
  // Divider
  doc.setDrawColor(200, 200, 210);
  doc.line(margin + colWidth, currentY + 3, margin + colWidth, currentY + 19);
  
  // Nights
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('DURATION', margin + colWidth + colWidth / 2, currentY + 5, { align: 'center' });
  doc.setFontSize(16);
  doc.setTextColor(ar, ag, ab);
  doc.setFont('helvetica', 'bold');
  doc.text(`${nights}`, margin + colWidth + colWidth / 2 - 4, currentY + 14, { align: 'center' });
  doc.setFontSize(8);
  doc.setTextColor(120, 120, 120);
  doc.text('NIGHTS', margin + colWidth + colWidth / 2 + 5, currentY + 14, { align: 'left' });
  doc.setFontSize(7);
  doc.text(`${boardBasis}`, margin + colWidth + colWidth / 2, currentY + 19, { align: 'center' });
  
  // Divider
  doc.setDrawColor(200, 200, 210);
  doc.line(margin + colWidth * 2, currentY + 3, margin + colWidth * 2, currentY + 19);
  
  // Check-out
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text('CHECK-OUT', margin + colWidth * 2 + colWidth / 2, currentY + 5, { align: 'center' });
  doc.setFontSize(11);
  doc.setTextColor(pr, pg, pb);
  doc.setFont('helvetica', 'bold');
  doc.text(formatDate(checkOutDate), margin + colWidth * 2 + colWidth / 2, currentY + 12, { align: 'center' });
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.text('Before 12:00', margin + colWidth * 2 + colWidth / 2, currentY + 17, { align: 'center' });

  // ===== GUEST & ROOM DETAILS =====
  currentY += 28;
  
  // Section title
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
  const roomNumbers = Object.keys(roomGroups).map(Number).sort((a, b) => a - b);
  
  roomNumbers.forEach((roomNum, rIdx) => {
    const roomGuests = roomGroups[roomNum];
    
    // Room separator for first room
    if (rIdx > 0) {
      doc.setDrawColor(230, 230, 235);
      doc.setLineWidth(0.1);
      doc.line(margin + 2, currentY - 0.5, margin + contentWidth - 2, currentY - 0.5);
    }
    
    roomGuests.forEach((assignment, idx) => {
      // Row background
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
      
      // Room number
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
      
      // Page break check
      if (currentY > 255) {
        doc.addPage();
        currentY = 20;
      }
    });
  });

  // ===== SUMMARY BOX =====
  currentY += 6;
  if (currentY > 240) {
    doc.addPage();
    currentY = 20;
  }
  
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
  
  // Payment status
  doc.setFillColor(34, 139, 34);
  doc.roundedRect(pageWidth - margin - 35, currentY + 3, 30, 10, 1, 1, 'F');
  doc.setFontSize(7);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('PAID', pageWidth - margin - 20, currentY + 9, { align: 'center' });

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

  // ===== BARCODE =====
  currentY += 6;
  if (currentY > 260) {
    doc.addPage();
    currentY = 20;
  }
  
  const barcodeData = bookingRef + Date.now().toString().slice(-6);
  drawBarcode(doc, pageWidth / 2 - 35, currentY, barcodeData, 70, 18);

  // ===== PREMIER HOSPITALITY PARTNERS =====
  currentY += 30;
  if (currentY > 230) {
    doc.addPage();
    currentY = 20;
  }
  
  drawPartnersGrid(doc, margin, currentY, contentWidth);
  currentY += 85;

  // ===== BOTTOM FOOTER =====
  currentY += 30;
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
}
