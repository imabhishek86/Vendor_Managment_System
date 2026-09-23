let seed = 12345;
function random() {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
}

function randomInt(min, max) {
  return Math.floor(random() * (max - min + 1)) + min;
}

function randomItem(array) {
  return array[randomInt(0, array.length - 1)];
}

const firstNames = ['James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Charles', 'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen', 'Rahul', 'Amit', 'Priya', 'Sneha', 'Vikram', 'Anjali', 'Arjun', 'Ravi', 'Neha', 'Pooja'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Kumar', 'Singh', 'Sharma', 'Patel', 'Gupta', 'Rao', 'Deshmukh', 'Joshi', 'Reddy', 'Nair'];
const vendorNames = ['Fleet', 'Logistics', 'Transport', 'Cabs', 'Express', 'Transit', 'Motors', 'Drive', 'Travels', 'Mobility'];
const vendorPrefixes = ['Global', 'Metro', 'City', 'Westside', 'Coastal', 'Quick', 'Fast', 'Safe', 'Reliable', 'Prime', 'Apex', 'Nova', 'Pioneer', 'Star', 'Blue'];

export function generateVendors(count, existingCount = 6) {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const id = `V${existingCount + i + 1}`;
    const name = `${randomItem(vendorPrefixes)} ${randomItem(vendorNames)} ${randomItem(['Inc.', 'LLC', 'Corp', 'Agency'])}`;
    const type = randomItem(['Master Vendor', 'Super Vendor', 'Regional Vendor', 'City Vendor', 'Sub Vendor']);
    // Distribute statuses: mostly Active
    let status = 'Active';
    const statusRoll = random();
    if (statusRoll > 0.9) status = 'Pending';
    else if (statusRoll > 0.8) status = 'Suspended';
    else if (statusRoll > 0.75) status = 'Inactive';

    generated.push({
      id,
      name,
      contactPerson: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      email: `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      phone: `+1 (555) ${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
      status,
      type,
      parentId: type === 'Master Vendor' ? null : `V${randomInt(1, existingCount + i)}`,
      joinDate: `202${randomInt(1, 4)}-0${randomInt(1, 9)}-1${randomInt(0, 9)}`
    });
  }
  return generated;
}

export function generateDrivers(count, vendors, existingCount = 6) {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const idNum = existingCount + i + 1;
    const id = `D${String(idNum).padStart(3, '0')}`;
    
    let status = 'Active';
    const statusRoll = random();
    if (statusRoll > 0.8) status = 'Off-Duty';
    else if (statusRoll > 0.9) status = 'Suspended';
    
    // Assign a predictable vehicle based on index, since we will generate 600 vehicles.
    // Drivers 7 to 600 get vehicles 7 to 600.
    const assignedVehicle = idNum <= 600 ? `VH-${100 + idNum}` : 'Unassigned';

    generated.push({
      id,
      name: `${randomItem(firstNames)} ${randomItem(lastNames)}`,
      licenseNumber: `DL-${randomInt(100000, 999999)}`,
      status,
      rating: +(random() * (5 - 3.5) + 3.5).toFixed(1),
      vendorId: randomItem(vendors).id,
      assignedVehicle,
      phone: `+1 (555) ${String(randomInt(100, 999)).padStart(3, '0')}-${String(randomInt(1000, 9999)).padStart(4, '0')}`
    });
  }
  return generated;
}

export function generateVehicles(count, vendors, existingCount = 6) {
  const generated = [];
  const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Hyundai', 'Nissan', 'Tata', 'Maruti', 'Mahindra'];
  const types = ['Sedan', 'SUV', 'Van', 'Hatchback', 'Minivan'];
  
  for (let i = 0; i < count; i++) {
    const idNum = existingCount + i + 1;
    const id = `VH-${100 + idNum}`;
    
    let status = 'Active';
    const statusRoll = random();
    if (statusRoll > 0.8) status = 'Maintenance';
    else if (statusRoll > 0.9) status = 'Inactive';
    else if (statusRoll > 0.95) status = 'Pending';
    
    const driverId = `D${String(idNum).padStart(3, '0')}`;

    generated.push({
      id,
      make: randomItem(makes),
      model: `${randomItem(['Pro', 'Max', 'Plus', 'Eco', 'Sport'])} ${randomInt(1, 9)}`,
      licensePlate: `${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}${String.fromCharCode(65 + randomInt(0, 25))}-${randomInt(1000, 9999)}`,
      status,
      vendorId: randomItem(vendors).id,
      driverId,
      type: randomItem(types),
      year: randomInt(2015, 2024),
      registrationNumber: `REG-${idNum}-${randomInt(1000, 9999)}`,
      registrationExpiry: `202${randomInt(5, 9)}-0${randomInt(1, 9)}-1${randomInt(0, 9)}`,
      insuranceExpiry: `202${randomInt(5, 7)}-0${randomInt(1, 9)}-1${randomInt(0, 9)}`,
      permitExpiry: `202${randomInt(5, 7)}-0${randomInt(1, 9)}-1${randomInt(0, 9)}`
    });
  }
  return generated;
}
