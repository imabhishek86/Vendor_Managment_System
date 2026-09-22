export function buildVendorTree(vendors) {
  const vendorMap = {};
  const rootVendors = [];

  // First pass: map each vendor by ID and add a children array
  vendors.forEach(vendor => {
    vendorMap[vendor.id] = { ...vendor, children: [] };
  });

  // Second pass: organize into a tree
  vendors.forEach(vendor => {
    if (vendor.parentId && vendorMap[vendor.parentId]) {
      vendorMap[vendor.parentId].children.push(vendorMap[vendor.id]);
    } else {
      rootVendors.push(vendorMap[vendor.id]);
    }
  });

  return rootVendors;
}
