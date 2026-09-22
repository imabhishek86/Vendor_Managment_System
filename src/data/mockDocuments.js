export const mockDocuments = [
  {
    id: "doc001",
    entityType: "driver",
    entityId: "D001",
    documentType: "Driving License",
    documentNumber: "DL-938475",
    issueDate: "2020-05-10",
    expiryDate: "2030-05-10",
    status: "Verified",
    fileName: "d001-license.pdf",
    uploadedAt: "2026-01-15",
    vendorId: "V1",
    rejectionReason: null
  },
  {
    id: "doc002",
    entityType: "vehicle",
    entityId: "VH-101",
    documentType: "Registration Certificate",
    documentNumber: "REG-101-ABC",
    issueDate: "2021-06-15",
    expiryDate: "2027-06-15",
    status: "Verified",
    fileName: "vh101-rc.pdf",
    uploadedAt: "2026-02-20",
    vendorId: "V1",
    rejectionReason: null
  },
  {
    id: "doc003",
    entityType: "vehicle",
    entityId: "VH-103",
    documentType: "Insurance",
    documentNumber: "INS-5555-XYZ",
    issueDate: "2024-06-12",
    expiryDate: "2025-06-12", // Potentially expired depending on current date
    status: "Verified",
    fileName: "vh103-insurance.pdf",
    uploadedAt: "2026-08-01",
    vendorId: "V1",
    rejectionReason: null
  },
  {
    id: "doc004",
    entityType: "driver",
    entityId: "D002",
    documentType: "ID Proof",
    documentNumber: "AADHAAR-1234",
    issueDate: "2015-01-01",
    expiryDate: "2099-12-31", // Never expires
    status: "Pending",
    fileName: "d002-id.jpg",
    uploadedAt: "2026-09-18",
    vendorId: "V2",
    rejectionReason: null
  },
  {
    id: "doc005",
    entityType: "vehicle",
    entityId: "VH-102",
    documentType: "Permit",
    documentNumber: "PER-9876",
    issueDate: "2025-09-10",
    expiryDate: "2026-09-10", // Old date, testing expiry
    status: "Verified", // Manual status says verified, but dateStatus should override
    fileName: "vh102-permit.pdf",
    uploadedAt: "2026-09-01",
    vendorId: "V2",
    rejectionReason: null
  },
  {
    id: "doc006",
    entityType: "driver",
    entityId: "D004",
    documentType: "Police Verification",
    documentNumber: "PV-445566",
    issueDate: "2026-09-01",
    expiryDate: "2027-09-01",
    status: "Rejected",
    fileName: "d004-police.png",
    uploadedAt: "2026-09-05",
    vendorId: "V4",
    rejectionReason: "Document image is too blurry to read."
  },
  {
    id: "doc007",
    entityType: "driver",
    entityId: "D005",
    documentType: "Driving License",
    documentNumber: "DL-456789",
    issueDate: "2023-01-01",
    expiryDate: "2026-10-01", // Expiring soon
    status: "Verified",
    fileName: "d005-license.pdf",
    uploadedAt: "2026-05-10",
    vendorId: "V4",
    rejectionReason: null
  }
];
