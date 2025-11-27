
import { User, Tour, ResourceType, ResourceStatus } from "./types";

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Zhang San',
    role: 'OP',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zhang',
  },
  {
    id: 'u2',
    name: 'Li Si',
    role: 'SALES',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Li',
  }
];

export const INITIAL_TOURS: Tour[] = [
  {
    id: 't1',
    code: '2025-11-01-JP',
    name: 'Autumn Japan Standard',
    startDate: '2025-11-01',
    duration: 7,
    resources: [
      {
        id: 'r1',
        tourId: 't1',
        type: ResourceType.HOTEL,
        date: '2025-11-01',
        name: 'Grand Prince Hotel New Takanawa',
        address: '3-13-1 Takanawa, Minato-ku, Tokyo',
        status: ResourceStatus.CONFIRMED,
        assignedTo: 'u1',
        dueDate: '2025-10-01',
        priceTwin: 250,
        priceSingle: 180,
        amenities: ['Wifi', 'Concierge', 'Breakfast Included'],
        hasElevator: true,
        hasAC: true,
        hasParking: true,
        cancellationDeadline: '2025-10-15',
        isOpConfirmed: true,
        isSalesConfirmed: true,
        comments: [],
        history: [
            {
                id: 'h1',
                userId: 'u1',
                userName: 'Zhang San',
                field: 'status',
                oldValue: 'SEARCHING',
                newValue: 'CONFIRMED',
                timestamp: Date.now() - 86400000
            }
        ],
        lastUpdated: Date.now(),
      },
      {
        id: 'r2',
        tourId: 't1',
        type: ResourceType.RESTAURANT,
        date: '2025-11-01',
        name: 'Gonpachi Nishi-Azabu',
        address: '1-13-11 Nishi-Azabu, Minato-ku, Tokyo',
        status: ResourceStatus.ISSUE,
        assignedTo: 'u1',
        dueDate: '2025-10-05',
        mealType: 'DINNER',
        avgPrice: 60,
        cuisineType: 'Izakaya',
        menuLink: 'https://gonpachi.jp/nishi-azabu/menu/',
        isOpConfirmed: false,
        isSalesConfirmed: false,
        comments: [
            {
                id: 'c1',
                userId: 'u2',
                userName: 'Li Si',
                userRole: 'SALES',
                content: 'Budget is max 50 EUR. This is too expensive.',
                timestamp: Date.now() - 100000,
            }
        ],
        history: [],
        lastUpdated: Date.now(),
      },
      {
        id: 'r4',
        tourId: 't1',
        type: ResourceType.HOTEL,
        date: '2025-11-02',
        name: 'Hakone Kowakien Ten-yu',
        address: 'Hakone, Japan',
        status: ResourceStatus.PROPOSED,
        assignedTo: 'u1',
        dueDate: '2025-10-10',
        priceTwin: 400,
        amenities: ['Onsen', 'Dinner Included'],
        hasElevator: true,
        hasAC: true,
        hasParking: false,
        cancellationDeadline: '2025-10-20',
        isOpConfirmed: true,
        isSalesConfirmed: false,
        comments: [],
        history: [],
        lastUpdated: Date.now(),
      },
      {
        id: 'r5',
        tourId: 't1',
        type: ResourceType.RESTAURANT,
        date: '2025-11-02',
        name: 'Hakone Soba',
        address: 'Hakone Yumoto',
        status: ResourceStatus.SEARCHING,
        assignedTo: 'u1',
        dueDate: '2025-10-12',
        mealType: 'LUNCH',
        avgPrice: 25,
        cuisineType: 'Soba Noodles',
        isOpConfirmed: false,
        isSalesConfirmed: false,
        comments: [],
        history: [],
        lastUpdated: Date.now(),
      }
    ]
  },
  {
    id: 't2',
    code: '2025-12-15-EU',
    name: 'Europe Christmas Market',
    startDate: '2025-12-15',
    duration: 10,
    resources: [
        {
            id: 'r3',
            tourId: 't2',
            type: ResourceType.HOTEL,
            date: '2025-12-15',
            name: 'Hotel Munich City Center',
            address: 'Unknown',
            status: ResourceStatus.SEARCHING,
            assignedTo: 'u1',
            dueDate: '2025-11-01',
            hasElevator: true,
            hasAC: false,
            hasParking: false,
            comments: [],
            history: [],
            lastUpdated: Date.now()
        }
    ]
  }
];
