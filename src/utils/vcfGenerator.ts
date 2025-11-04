export interface ContactData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  organization?: string;
  title?: string;
}

export const generateVcfContent = (contact: ContactData): string => {
  let vcf = "BEGIN:VCARD\n";
  vcf += "VERSION:3.0\n";

  vcf += `FN:${contact.firstName} ${contact.lastName}\n`;
  vcf += `N:${contact.lastName};${contact.firstName};;;\n`;

  if (contact.phone) {
    const cleanedPhone = contact.phone.replace(/[^0-9+]/g, "");
    vcf += `TEL;TYPE=CELL,VOICE:${cleanedPhone}\n`;
  }

  if (contact.email) {
    vcf += `EMAIL;TYPE=INTERNET:${contact.email}\n`;
  }

  if (contact.organization) {
    vcf += `ORG:${contact.organization}\n`;
  }
  if (contact.title) {
    vcf += `TITLE:${contact.title}\n`;
  }

  vcf += "END:VCARD\n";
  return vcf;
};

export const downloadVcf = (contact: ContactData): void => {
  const vcfContent = generateVcfContent(contact);

  const blob = new Blob([vcfContent], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;

  const filename = `${contact.firstName}_${contact.lastName}.vcf`;
  a.download = filename.replace(/\s/g, "_");

  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
