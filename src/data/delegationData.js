export const mockDelegations = [
  {
    id: "del001",
    delegatorId: "V1",
    delegateeId: "V2",
    permissions: [
      "driver_management",
      "vehicle_management",
      "document_verification"
    ],
    status: "Active",
    createdAt: "2026-09-20"
  },
  {
    id: "del002",
    delegatorId: "V1",
    delegateeId: "V4",
    permissions: [
      "driver_management",
      "vehicle_management",
      "compliance_management"
    ],
    status: "Active",
    createdAt: "2026-09-18"
  },
  {
    id: "del003",
    delegatorId: "V1",
    delegateeId: "V3",
    permissions: [
      "vendor_management",
      "payment_management"
    ],
    status: "Revoked",
    createdAt: "2026-08-15"
  }
];
