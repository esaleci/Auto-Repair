export const previewData = {
  recentInvoices: [
    {
      id: "inv_01",
      invoiceNumber: "INV-10001",
      amount: 177.97,
      tax: 14.24,
      total: 192.21,
      status: "PAID",
      customer: {
        firstName: "Alice",
        lastName: "Cooper",
      },
      repairOrder: {
        orderNumber: "RO-100001",
      },
      createdAt: "2023-04-10T11:30:00.000Z",
      updatedAt: "2023-04-10T11:30:00.000Z",
    },
    {
      id: "inv_02",
      invoiceNumber: "INV-10002",
      amount: 569.96,
      tax: 45.6,
      total: 615.56,
      status: "PAID",
      customer: {
        firstName: "Bob",
        lastName: "Dylan",
      },
      repairOrder: {
        orderNumber: "RO-100002",
      },
      createdAt: "2023-04-12T16:45:00.000Z",
      updatedAt: "2023-04-12T16:45:00.000Z",
    },
    {
      id: "inv_03",
      invoiceNumber: "INV-10003",
      amount: 174.97,
      tax: 14.0,
      total: 188.97,
      status: "PAID",
      customer: {
        firstName: "Frank",
        lastName: "Sinatra",
      },
      repairOrder: {
        orderNumber: "RO-100006",
      },
      createdAt: "2023-04-11T12:15:00.000Z",
      updatedAt: "2023-04-11T12:15:00.000Z",
    },
    {
      id: "inv_04",
      invoiceNumber: "INV-10004",
      amount: 509.97,
      tax: 40.8,
      total: 550.77,
      status: "PARTIAL",
      customer: {
        firstName: "Gloria",
        lastName: "Estefan",
      },
      repairOrder: {
        orderNumber: "RO-100007",
      },
      createdAt: "2023-04-13T14:00:00.000Z",
      updatedAt: "2023-04-13T14:00:00.000Z",
    },
  ],
  upcomingAppointments: [
    {
      id: "apt_01",
      date: "2023-04-20T14:00:00.000Z",
      repairOrder: {
        customer: {
          firstName: "Diana",
          lastName: "Ross",
        },
        vehicle: {
          make: "Chevrolet",
          model: "Malibu",
        },
      },
      createdAt: "2023-04-15T09:00:00.000Z",
      updatedAt: "2023-04-15T09:00:00.000Z",
    },
    {
      id: "apt_02",
      date: "2023-04-22T09:30:00.000Z",
      repairOrder: {
        customer: {
          firstName: "Elton",
          lastName: "John",
        },
        vehicle: {
          make: "Nissan",
          model: "Altima",
        },
      },
      createdAt: "2023-04-16T11:00:00.000Z",
      updatedAt: "2023-04-16T11:00:00.000Z",
    },
    {
      id: "apt_03",
      date: "2023-04-21T13:30:00.000Z",
      repairOrder: {
        customer: {
          firstName: "Ike",
          lastName: "Turner",
        },
        vehicle: {
          make: "Lexus",
          model: "RX",
        },
      },
      createdAt: "2023-04-17T10:00:00.000Z",
      updatedAt: "2023-04-17T10:00:00.000Z",
    },
    {
      id: "apt_04",
      date: "2023-04-23T10:00:00.000Z",
      repairOrder: {
        customer: {
          firstName: "Janet",
          lastName: "Jackson",
        },
        vehicle: {
          make: "Tesla",
          model: "Model 3",
        },
      },
      createdAt: "2023-04-18T15:00:00.000Z",
      updatedAt: "2023-04-18T15:00:00.000Z",
    },
  ],
  recentRepairOrders: [
    {
      id: "ro_01",
      orderNumber: "RO-100001",
      status: "COMPLETED",
      description: "Regular maintenance - oil change, filter replacement, and tire rotation",
      customer: {
        firstName: "Alice",
        lastName: "Cooper",
      },
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2018,
      },
      startDate: "2023-04-10T09:00:00.000Z",
      endDate: "2023-04-10T11:30:00.000Z",
      createdAt: "2023-04-09T12:00:00.000Z",
      updatedAt: "2023-04-10T11:30:00.000Z",
    },
    {
      id: "ro_02",
      orderNumber: "RO-100002",
      status: "COMPLETED",
      description: "Brake pad replacement and rotor resurfacing",
      customer: {
        firstName: "Bob",
        lastName: "Dylan",
      },
      vehicle: {
        make: "Honda",
        model: "Civic",
        year: 2019,
      },
      startDate: "2023-04-12T13:00:00.000Z",
      endDate: "2023-04-12T16:45:00.000Z",
      createdAt: "2023-04-11T10:00:00.000Z",
      updatedAt: "2023-04-12T16:45:00.000Z",
    },
    {
      id: "ro_03",
      orderNumber: "RO-100003",
      status: "IN_PROGRESS",
      description: "Engine misfire diagnosis and spark plug replacement",
      customer: {
        firstName: "Charlie",
        lastName: "Parker",
      },
      vehicle: {
        make: "Ford",
        model: "F-150",
        year: 2020,
      },
      startDate: "2023-04-15T10:30:00.000Z",
      endDate: null,
      createdAt: "2023-04-14T15:00:00.000Z",
      updatedAt: "2023-04-15T10:30:00.000Z",
    },
    {
      id: "ro_04",
      orderNumber: "RO-100004",
      status: "PENDING",
      description: "AC system not cooling properly - diagnostic and repair",
      customer: {
        firstName: "Diana",
        lastName: "Ross",
      },
      vehicle: {
        make: "Chevrolet",
        model: "Malibu",
        year: 2017,
      },
      startDate: "2023-04-20T14:00:00.000Z",
      endDate: null,
      createdAt: "2023-04-15T09:00:00.000Z",
      updatedAt: "2023-04-15T09:00:00.000Z",
    },
  ],
}

// Add the missing previewLocations export
export const previewLocations = [
  {
    id: "loc_downtown",
    name: "Downtown Auto Repair",
    address: "123 Main Street, Downtown, NY 10001",
    phone: "(212) 555-1234",
    _count: {
      employees: 5,
      customers: 5,
      repairOrders: 5,
      inventory: 8,
    },
  },
  {
    id: "loc_uptown",
    name: "Uptown Auto Repair",
    address: "456 Park Avenue, Uptown, NY 10021",
    phone: "(212) 555-5678",
    _count: {
      employees: 5,
      customers: 5,
      repairOrders: 5,
      inventory: 4,
    },
  },
]

// Add the missing previewCustomers export
export const previewCustomers = [
  {
    id: "cust_01",
    firstName: "Alice",
    lastName: "Cooper",
    email: "alice.cooper@example.com",
    phone: "(212) 555-1001",
    address: "789 Broadway, New York, NY 10003",
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    vehicles: [
      {
        id: "veh_01",
        make: "Toyota",
        model: "Camry",
        year: 2018,
      },
      {
        id: "veh_11",
        make: "Subaru",
        model: "Outback",
        year: 2020,
      },
    ],
    _count: {
      repairOrders: 2,
    },
  },
  {
    id: "cust_02",
    firstName: "Bob",
    lastName: "Dylan",
    email: "bob.dylan@example.com",
    phone: "(212) 555-1002",
    address: "101 5th Avenue, New York, NY 10011",
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    vehicles: [
      {
        id: "veh_02",
        make: "Honda",
        model: "Civic",
        year: 2019,
      },
    ],
    _count: {
      repairOrders: 1,
    },
  },
  {
    id: "cust_03",
    firstName: "Charlie",
    lastName: "Parker",
    email: "charlie.parker@example.com",
    phone: "(212) 555-1003",
    address: "202 W 23rd St, New York, NY 10011",
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    vehicles: [
      {
        id: "veh_03",
        make: "Ford",
        model: "F-150",
        year: 2020,
      },
      {
        id: "veh_12",
        make: "Jeep",
        model: "Wrangler",
        year: 2021,
      },
    ],
    _count: {
      repairOrders: 2,
    },
  },
]

// Add the missing previewVehicles export
export const previewVehicles = [
  {
    id: "veh_01",
    make: "Toyota",
    model: "Camry",
    year: 2018,
    vin: "1HGCM82633A123456",
    licensePlate: "ABC-1234",
    color: "Silver",
    customer: {
      id: "cust_01",
      firstName: "Alice",
      lastName: "Cooper",
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    _count: {
      repairOrders: 1,
    },
  },
  {
    id: "veh_02",
    make: "Honda",
    model: "Civic",
    year: 2019,
    vin: "2HGFC2F52KH123456",
    licensePlate: "DEF-5678",
    color: "Blue",
    customer: {
      id: "cust_02",
      firstName: "Bob",
      lastName: "Dylan",
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    _count: {
      repairOrders: 1,
    },
  },
  {
    id: "veh_03",
    make: "Ford",
    model: "F-150",
    year: 2020,
    vin: "1FTEW1EP1LFA12345",
    licensePlate: "GHI-9012",
    color: "Red",
    customer: {
      id: "cust_03",
      firstName: "Charlie",
      lastName: "Parker",
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    _count: {
      repairOrders: 1,
    },
  },
]

// Add the missing previewRepairOrders export
export const previewRepairOrders = [
  {
    id: "ro_01",
    orderNumber: "RO-100001",
    status: "COMPLETED",
    description: "Regular maintenance - oil change, filter replacement, and tire rotation",
    customer: {
      id: "cust_01",
      firstName: "Alice",
      lastName: "Cooper",
    },
    vehicle: {
      id: "veh_01",
      make: "Toyota",
      model: "Camry",
      year: 2018,
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    startDate: "2023-04-10T09:00:00.000Z",
    endDate: "2023-04-10T11:30:00.000Z",
  },
  {
    id: "ro_02",
    orderNumber: "RO-100002",
    status: "COMPLETED",
    description: "Brake pad replacement and rotor resurfacing",
    customer: {
      id: "cust_02",
      firstName: "Bob",
      lastName: "Dylan",
    },
    vehicle: {
      id: "veh_02",
      make: "Honda",
      model: "Civic",
      year: 2019,
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    startDate: "2023-04-12T13:00:00.000Z",
    endDate: "2023-04-12T16:45:00.000Z",
  },
  {
    id: "ro_03",
    orderNumber: "RO-100003",
    status: "IN_PROGRESS",
    description: "Engine misfire diagnosis and spark plug replacement",
    customer: {
      id: "cust_03",
      firstName: "Charlie",
      lastName: "Parker",
    },
    vehicle: {
      id: "veh_03",
      make: "Ford",
      model: "F-150",
      year: 2020,
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    startDate: "2023-04-15T10:30:00.000Z",
    endDate: null,
  },
]

// Add the missing previewInventory export
export const previewInventory = [
  {
    id: "inv_01",
    name: "Oil Filter",
    partNumber: "OF-12345",
    description: "Standard oil filter for most vehicles",
    price: 12.99,
    quantity: 50,
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
  },
  {
    id: "inv_02",
    name: "Air Filter",
    partNumber: "AF-67890",
    description: "High-performance air filter",
    price: 24.99,
    quantity: 35,
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
  },
  {
    id: "inv_03",
    name: "Brake Pads",
    partNumber: "BP-54321",
    description: "Ceramic brake pads - front",
    price: 89.99,
    quantity: 20,
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
  },
]

// Add the missing previewInvoices export
export const previewInvoices = [
  {
    id: "inv_01",
    invoiceNumber: "INV-10001",
    amount: 177.97,
    tax: 14.24,
    total: 192.21,
    status: "PAID",
    customer: {
      id: "cust_01",
      firstName: "Alice",
      lastName: "Cooper",
    },
    repairOrder: {
      id: "ro_01",
      orderNumber: "RO-100001",
    },
    createdAt: "2023-04-10T11:30:00.000Z",
  },
  {
    id: "inv_02",
    invoiceNumber: "INV-10002",
    amount: 569.96,
    tax: 45.6,
    total: 615.56,
    status: "PAID",
    customer: {
      id: "cust_02",
      firstName: "Bob",
      lastName: "Dylan",
    },
    repairOrder: {
      id: "ro_02",
      orderNumber: "RO-100002",
    },
    createdAt: "2023-04-12T16:45:00.000Z",
  },
  {
    id: "inv_03",
    invoiceNumber: "INV-10003",
    amount: 174.97,
    tax: 14.0,
    total: 188.97,
    status: "PAID",
    customer: {
      id: "cust_03",
      firstName: "Frank",
      lastName: "Sinatra",
    },
    repairOrder: {
      id: "ro_03",
      orderNumber: "RO-100006",
    },
    createdAt: "2023-04-11T12:15:00.000Z",
  },
]

// Add the missing previewAppointments export
export const previewAppointments = [
  {
    id: "apt_01",
    date: "2023-04-20T14:00:00.000Z",
    status: "SCHEDULED",
    customer: {
      id: "cust_04",
      firstName: "Diana",
      lastName: "Ross",
    },
    vehicle: {
      id: "veh_04",
      make: "Chevrolet",
      model: "Malibu",
      year: 2017,
    },
    location: {
      id: "loc_downtown",
      name: "Downtown Auto Repair",
    },
    description: "AC system not cooling properly - diagnostic and repair",
  },
  {
    id: "apt_02",
    date: "2023-04-22T09:30:00.000Z",
    status: "SCHEDULED",
    customer: {
      id: "cust_05",
      firstName: "Elton",
      lastName: "John",
    },
    vehicle: {
      id: "veh_05",
      make: "Nissan",
      model: "Altima",
      year: 2018,
    },
    location: {
      id: "loc_uptown",
      name: "Uptown Auto Repair",
    },
    description: "Regular maintenance - oil change and tire rotation",
  },
  {
    id: "apt_03",
    date: "2023-04-21T13:30:00.000Z",
    status: "SCHEDULED",
    customer: {
      id: "cust_09",
      firstName: "Ike",
      lastName: "Turner",
    },
    vehicle: {
      id: "veh_09",
      make: "Lexus",
      model: "RX",
      year: 2019,
    },
    location: {
      id: "loc_uptown",
      name: "Uptown Auto Repair",
    },
    description: "Check engine light - diagnostic",
  },
]
