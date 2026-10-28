// Precise 3D Building Geometries for Lovely Professional University (LPU)
// Coordinates mapped to OpenFreeMap Liberty base tiles (EPSG:4326 [lng, lat])

export const lpuCampusBoundary = {
  type: "Feature",
  properties: {
    name: "Lovely Professional University Campus",
    area: "600+ Acres"
  },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [75.6980, 31.2580],
        [75.7110, 31.2580],
        [75.7125, 31.2485],
        [75.7000, 31.2485],
        [75.6980, 31.2580]
      ]
    ]
  }
};

export const lpu3DBuildings = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        id: "b32",
        name: "Block 32 (Central Administrative Hub & Reporting)",
        category: "Administration",
        height: 28,
        min_height: 0,
        color: "#F37021", // LPU Signature Orange
        roofColor: "#E05A0C"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7040, 31.2528],
            [75.7050, 31.2528],
            [75.7050, 31.2536],
            [75.7040, 31.2536],
            [75.7040, 31.2528]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "b34",
        name: "Block 34 (School of Computer Science & Engineering)",
        category: "Academics",
        height: 36,
        min_height: 0,
        color: "#2563EB", // Tech Blue
        roofColor: "#1D4ED8"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7046, 31.2521],
            [75.7056, 31.2521],
            [75.7056, 31.2529],
            [75.7046, 31.2529],
            [75.7046, 31.2521]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "b38",
        name: "Block 38 (Central University Library)",
        category: "Library",
        height: 32,
        min_height: 0,
        color: "#D97706", // Amber Gold
        roofColor: "#B45309"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7055, 31.2516],
            [75.7065, 31.2516],
            [75.7065, 31.2524],
            [75.7055, 31.2524],
            [75.7055, 31.2516]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "auditorium",
        name: "Shanti Devi Mittal Auditorium (Uni-Auditorium)",
        category: "Auditorium & Events",
        height: 24,
        min_height: 0,
        color: "#9333EA", // Regal Purple
        roofColor: "#7E22CE"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7027, 31.2537],
            [75.7037, 31.2537],
            [75.7037, 31.2545],
            [75.7027, 31.2545],
            [75.7027, 31.2537]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "hospital",
        name: "Uni-Hospital (Medical Centre - Block 30)",
        category: "Healthcare & Emergency",
        height: 22,
        min_height: 0,
        color: "#EF4444", // Medical Crimson
        roofColor: "#DC2626"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7015, 31.2534],
            [75.7025, 31.2534],
            [75.7025, 31.2542],
            [75.7015, 31.2542],
            [75.7015, 31.2534]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "unimall",
        name: "Uni-Mall (Commercial Centre & Food Court)",
        category: "Dining & Shopping",
        height: 26,
        min_height: 0,
        color: "#10B981", // Emerald Market
        roofColor: "#059669"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7010, 31.2511],
            [75.7020, 31.2511],
            [75.7020, 31.2519],
            [75.7010, 31.2519],
            [75.7010, 31.2511]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "unipolis",
        name: "Baldev Raj Mittal Unipolis",
        category: "Culture & Arena",
        height: 18,
        min_height: 0,
        color: "#E11D48", // Rose Red
        roofColor: "#BE123C"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7035, 31.2546],
            [75.7045, 31.2546],
            [75.7045, 31.2554],
            [75.7035, 31.2554],
            [75.7035, 31.2546]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "sports_complex",
        name: "Shanti Devi Mittal Indoor Sports Complex",
        category: "Sports & Recreation",
        height: 25,
        min_height: 0,
        color: "#0284C7", // Cyan / Water
        roofColor: "#0369A1"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7020, 31.2558],
            [75.7030, 31.2558],
            [75.7030, 31.2566],
            [75.7020, 31.2566],
            [75.7020, 31.2558]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "bh_complex",
        name: "Boys Hostel Complex (BH-1 to BH-8)",
        category: "Hostel & Housing",
        height: 42,
        min_height: 0,
        color: "#475569", // Slate Dark
        roofColor: "#334155"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7070, 31.2500],
            [75.7082, 31.2500],
            [75.7082, 31.2510],
            [75.7070, 31.2510],
            [75.7070, 31.2500]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "gh_complex",
        name: "Girls Hostel Complex (GH-1 to GH-6)",
        category: "Hostel & Housing",
        height: 38,
        min_height: 0,
        color: "#BE185D", // Berry Pink
        roofColor: "#9D174D"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7005, 31.2550],
            [75.7015, 31.2550],
            [75.7015, 31.2560],
            [75.7005, 31.2560],
            [75.7005, 31.2550]
          ]
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        id: "main_gate_1",
        name: "Main Campus Gate 1 & Security Post",
        category: "Transport & Security",
        height: 14,
        min_height: 0,
        color: "#18181B", // Black Granite
        roofColor: "#09090B"
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [75.7051, 31.2564],
            [75.7059, 31.2564],
            [75.7059, 31.2572],
            [75.7051, 31.2572],
            [75.7051, 31.2564]
          ]
        ]
      }
    }
  ]
};
