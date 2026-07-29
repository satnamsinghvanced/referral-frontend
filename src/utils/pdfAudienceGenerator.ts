import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { AudienceSegment } from "../types/campaign";

export const generateAudiencePdf = (audience: AudienceSegment) => {
  const doc = new jsPDF();
  
  const addFooter = () => {
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      const footerText = `Page ${i} of ${pageCount} | Segment: ${audience.name}`;
      doc.text(footerText, 14, 285);
      doc.text(new Date().toLocaleDateString(), 180, 285);
    }
  };

  // Header Banner
  doc.setFillColor(14, 165, 233); // Primary sky blue brand color
  doc.rect(0, 0, 210, 45, 'F');
  
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text("Audience Segment Report", 14, 18);
  
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(audience.name, 14, 28);
  
  doc.setFontSize(9);
  doc.setTextColor(224, 242, 254);
  const desc = audience.description || "No description provided.";
  // Split long description into lines
  const splitDesc = doc.splitTextToSize(desc, 180);
  doc.text(splitDesc, 14, 35);

  let yOffset = 55;

  // Segment Information Section
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Segment Information", 14, yOffset);
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(14, yOffset + 2, 196, yOffset + 2);
  
  yOffset += 10;
  
  // Grid/Key-Value info
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Segment Type:", 14, yOffset);
  doc.text("Status:", 80, yOffset);
  doc.text("Total Size:", 140, yOffset);
  
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(audience.type || "N/A", 14, yOffset + 5);
  
  // Status with custom styling if active/inactive
  const statusStr = audience.status || "Active";
  doc.setTextColor(statusStr === "Active" ? 22 : 100, statusStr === "Active" ? 163 : 116, statusStr === "Active" ? 74 : 139); // green for active
  doc.text(statusStr, 80, yOffset + 5);
  
  doc.setTextColor(15, 23, 42);
  const totalContacts = (audience.referrers?.length || 0) + (audience.practices?.length || 0) + (audience.referrals?.length || 0);
  doc.text(`${totalContacts} contacts`, 140, yOffset + 5);
  
  yOffset += 15;
  
  // Optional criteria
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Location:", 14, yOffset);
  doc.text("Activity Window:", 80, yOffset);
  if (audience.partnerLevel || audience.practiceSize) {
    doc.text(audience.type === "Dental Practices" ? "Practice Size:" : "Partner Level:", 140, yOffset);
  }
  
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(audience.location || "All Locations", 14, yOffset + 5);
  doc.text(audience.activity || "All Activity", 80, yOffset + 5);
  if (audience.partnerLevel || audience.practiceSize) {
    doc.text(audience.practiceSize || audience.partnerLevel || "N/A", 140, yOffset + 5);
  }
  
  yOffset += 20;

  // Render Referrers Table if present
  if (audience.referrers && audience.referrers.length > 0) {
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Referrer Contacts (${audience.referrers.length})`, 14, yOffset);
    yOffset += 4;
    
    const tableData = audience.referrers.map((ref, idx) => [
      idx + 1,
      ref.name || "N/A",
      ref.email || "N/A",
      ref.phone || "N/A",
      ref.type ? (ref.type.charAt(0).toUpperCase() + ref.type.slice(1)) : "N/A"
    ]);
    
    autoTable(doc, {
      startY: yOffset,
      head: [["#", "Name", "Email", "Phone", "Type"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [14, 165, 233], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' } }
    });
    
    yOffset = (doc as any).lastAutoTable.finalY + 15;
  }

  // Render Referrals Table if present
  if (audience.referrals && audience.referrals.length > 0) {
    // Check if we need to add a new page if the remaining space is too small
    if (yOffset > 240) {
      doc.addPage();
      yOffset = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Referral Contacts (${audience.referrals.length})`, 14, yOffset);
    yOffset += 4;
    
    const tableData = audience.referrals.map((ref, idx) => [
      idx + 1,
      ref.name || "N/A",
      ref.email || "N/A",
      ref.phone || "N/A",
      ref.status ? (ref.status.charAt(0).toUpperCase() + ref.status.slice(1)) : "N/A"
    ]);
    
    autoTable(doc, {
      startY: yOffset,
      head: [["#", "Name", "Email", "Phone", "Status"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [14, 165, 233], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 0: { cellWidth: 10, halign: 'center' } }
    });
    
    yOffset = (doc as any).lastAutoTable.finalY + 15;
  }

  // Render Practices Table if present
  if (audience.practices && audience.practices.length > 0) {
    if (yOffset > 240) {
      doc.addPage();
      yOffset = 20;
    }
    
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text(`Practice Contacts (${audience.practices.length})`, 14, yOffset);
    yOffset += 4;
    
    const tableData = audience.practices.map((prac, idx) => {
      const addr = prac.address 
        ? `${prac.address.addressLine1}, ${prac.address.city}, ${prac.address.state} ${prac.address.zip}`
        : "N/A";
      const createdByName = prac.createdBy 
        ? `${prac.createdBy.firstName} ${prac.createdBy.lastName}`
        : "N/A";
      return [
        idx + 1,
        prac.name || "N/A",
        addr,
        createdByName
      ];
    });
    
    autoTable(doc, {
      startY: yOffset,
      head: [["#", "Practice Name", "Address", "Created By"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [14, 165, 233], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: { 
        0: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 100 }
      }
    });
    
    yOffset = (doc as any).lastAutoTable.finalY + 15;
  }

  // Empty State message in PDF if all tables are empty
  const hasNoContacts = (!audience.referrers || audience.referrers.length === 0) &&
                        (!audience.referrals || audience.referrals.length === 0) &&
                        (!audience.practices || audience.practices.length === 0);
  if (hasNoContacts) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("No contacts matched the filter criteria for this segment.", 14, yOffset);
  }

  addFooter();
  const filename = `AudienceSegment_${audience.name.replace(/\s+/g, "_")}.pdf`;
  doc.save(filename);
};
