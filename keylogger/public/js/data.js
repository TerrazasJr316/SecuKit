// Datos de los partidos (20 partidos)
export const matches = [
    { id: 1, local: "México", visitante: "Sudáfrica", fecha: "11 JUN 2026", sede: "Estadio Banorte", ciudad: "Ciudad de México", pais: "mexico", fase: "grupo A", precio: 2450, imagen: "/src/banorte.jpg.jpeg", categoria: "vip", destacado: "GRUPO A" },
    { id: 2, local: "Corea del Sur", visitante: "República Checa", fecha: "11 JUN 2026", sede: "Akron", ciudad: "Zapopan", pais: "mexico", fase: "grupo A", precio: 1890, imagen: "/src/akron.jpg", categoria: "premium", destacado: "GRUPO A" },

    { id: 3, local: "Canadá", visitante: "Bosnia-Herzegovina", fecha: "12 JUN 2026", sede: "BMO Field", ciudad: "Toronto", pais: "canada", fase: "grupo B", precio: 2750, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO B" },
    { id: 4, local: "EE.UU", visitante: "Paraguay", fecha: "12 JUN 2026", sede: "SoFi Stadium", ciudad: "Inglewood", pais: "usa", fase: "grupo D", precio: 1600, imagen: "/src/akron.jpg", categoria: "premium", destacado: "GRUPO D" },

    { id: 5, local: "Haití", visitante: "Escocia", fecha: "12 JUN 2026", sede: "Gillette Stadium", ciudad: "Foxborough", pais: "usa", fase: "grupo C", precio: 2300, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 6, local: "Australia", visitante: "Turquía", fecha: "13 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo D", precio: 1950, imagen: "/src/sofi.jpg", categoria: "general", destacado: "GRUPO D" },
    { id: 7, local: "Brasil", visitante: "Marruecos", fecha: "13 JUN 2026", sede: "MetLife Stadium", ciudad: "East Rutherford", pais: "usa", fase: "grupo C", precio: 2100, imagen: "/src/levis.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 8, local: "Catar", visitante: "Suiza", fecha: "13 JUN 2026", sede: "Levi's Stadium", ciudad: "Santa Clara", pais: "usa", fase: "grupo B", precio: 2800, imagen: "/src/metlife.jpg", categoria: "premium", destacado: "GRUPO B" },

    { id: 9, local: "Costa de Marfil", visitante: "Ecuador", fecha: "14 JUN 2026", sede: "Lincoln Financial Field", ciudad: "Filadelfia", pais: "usa", fase: "grupo E", precio: 1700, imagen: "/src/gillette.jpg", categoria: "general", destacado: "GRUPO E" },
    { id: 10, local: "Alemania", visitante: "Curazao", fecha: "14 JUN 2026", sede: "NRG Stadium", ciudad: "Houston", pais: "usa", fase: "grupo E", precio: 2550, imagen: "/src/bc.jpg", categoria: "vip", destacado: "GRUPO E" },
    { id: 11, local: "Países Bajos", visitante: "Japón", fecha: "14 JUN 2026", sede: "AT&T Stadium", ciudad: "Arlington", pais: "usa", fase: "grupo F", precio: 1850, imagen: "/src/att.jpg", categoria: "vip", destacado: "GRUPO F" },
    { id: 12, local: "Suecia", visitante: "Túnez", fecha: "14 JUN 2026", sede: "BBVA", ciudad: "Guadalupe", pais: "mexico", fase: "grupo F", precio: 2950, imagen: "/src/bbva.jpg", categoria: "general", destacado: "GRUPO F" },

    { id: 13, local: "Arabia Saudita", visitante: "Uruguay", fecha: "15 JUN 2026", sede: "Hard Rock Stadium", ciudad: "Miami", pais: "usa", fase: "grupo H", precio: 1750, imagen: "/src/hard.jpg", categoria: "general", destacado: "GRUPO H" },
    { id: 14, local: "España", visitante: "Cabo Verde", fecha: "15 JUN 2026", sede: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "usa", fase: "grupo H", precio: 2200, imagen: "/src/mercedes.jpg", categoria: "premium", destacado: "GRUPO H" },
    { id: 15, local: "Irán", visitante: "Nueva Zelanda", fecha: "15 JUN 2026", sede: "SoFi Stadium", ciudad: "Inglewood", pais: "usa", fase: "grupo G", precio: 1900, imagen: "/src/sofi.jpg", categoria: "vip", destacado: "GRUPO G" },
    { id: 16, local: "Bélgica", visitante: "Egipto", fecha: "15 JUN 2026", sede: "Lumen Field", ciudad: "Seattle", pais: "usa", fase: "grupo G", precio: 2600, imagen: "/src/lumen.jpg", categoria: "premium", destacado: "GRUPO G" },

    { id: 17, local: "Francia", visitante: "Senegal", fecha: "16 JUN 2026", sede: "MetLife Stadium", ciudad: "East Rutherford", pais: "usa", fase: "grupo I", precio: 2000, imagen: "/src/metlife.jpg", categoria: "premium", destacado: "GRUPO I" },
    { id: 18, local: "Irak", visitante: "Noruega", fecha: "16 JUN 2026", sede: "Gillette Stadium", ciudad: "Foxborough", pais: "usa", fase: "grupo I", precio: 1650, imagen: "/src/gillette.jpg", categoria: "general", destacado: "GRUPO I" },
    { id: 19, local: "Argentina", visitante: "Argelia", fecha: "16 JUN 2026", sede: "Arrowhead Stadium", ciudad: "Kansas City", pais: "usa", fase: "grupo J", precio: 2700, imagen: "/src/arrowhead.jpg", categoria: "vip", destacado: "GRUPO J" },
    { id: 20, local: "Austria", visitante: "Jordania", fecha: "16 JUN 2026", sede: "Levi's Stadium", ciudad: "Santa Clara", pais: "usa", fase: "grupo J", precio: 1800, imagen: "/src/levis.jpg", categoria: "vip", destacado: "GRUPO J" },

    { id: 21, local: "Ghana", visitante: "Panamá", fecha: "17 JUN 2026", sede: "BMO Field", ciudad: "Toronto", pais: "canada", fase: "grupo L", precio: 2400, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 22, local: "Inglaterra", visitante: "Croacia", fecha: "17 JUN 2026", sede: "AT&T Stadium", ciudad: "Arlington", pais: "usa", fase: "grupo L", precio: 1550, imagen: "/src/att.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 23, local: "Portugal", visitante: "República Democrática del Congo", fecha: "17 JUN 2026", sede: "NRG Stadium", ciudad: "Houston", pais: "usa", fase: "grupo K", precio: 2850, imagen: "/src/nrg.jpg", categoria: "general", destacado: "GRUPO K" },
    { id: 24, local: "Uzbekistán", visitante: "Colombia", fecha: "17 JUN 2026", sede: "Estadio Banorte", ciudad: "Ciudad de México", pais: "mexico", fase: "grupo K", precio: 2150, imagen: "/src/banorte.jpg.jpeg", categoria: "general", destacado: "GRUPO K" },

    { id: 25, local: "República Checa", visitante: "Sudáfrica", fecha: "18 JUN 2026", sede: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "usa", fase: "grupo A", precio: 1700, imagen: "/src/mercedes.jpg", categoria: "general", destacado: "GRUPO A" },
    { id: 26, local: "Suiza", visitante: "Bosnia-Herzegovina", fecha: "18 JUN 2026", sede: "SoFi Stadium", ciudad: "Inglewood", pais: "usa", fase: "grupo B", precio: 2500, imagen: "/src/sofi.jpg", categoria: "general", destacado: "GRUPO B" },
    { id: 27, local: "Canadá", visitante: "Catar", fecha: "18 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo B", precio: 1800, imagen: "/src/bc.jpg", categoria: "general", destacado: "GRUPO B" },
    { id: 28, local: "México", visitante: "Corea del Sur", fecha: "18 JUN 2026", sede: "Akron", ciudad: "Zapopan", pais: "mexico", fase: "grupo A", precio: 2900, imagen: "/src/akron.jpg", categoria: "general", destacado: "GRUPO A" },

    { id: 29, local: "Brasil", visitante: "Haití", fecha: "19 JUN 2026", sede: "Lincoln Financial Field", ciudad: "Filadelfia", pais: "usa", fase: "grupo C", precio: 1600, imagen: "/src/lincoln.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 30, local: "Escocia", visitante: "Marruecos", fecha: "19 JUN 2026", sede: "Gillette Stadium", ciudad: "Foxborough", pais: "usa", fase: "grupo C", precio: 2350, imagen: "/src/gillette.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 31, local: "Turquía", visitante: "Paraguay", fecha: "19 JUN 2026", sede: "Levi's Stadium", ciudad: "Santa Clara", pais: "usa", fase: "grupo D", precio: 1750, imagen: "/src/levis.jpg", categoria: "general", destacado: "GRUPO D" },
    { id: 32, local: "Estados Unidos", visitante: "Australia", fecha: "19 JUN 2026", sede: "Lumen Field", ciudad: "Seattle", pais: "usa", fase: "grupo D", precio: 2650, imagen: "/src/lumen.jpg", categoria: "general", destacado: "GRUPO D" },

    { id: 33, local: "Alemania", visitante: "Costa de Marfil", fecha: "20 JUN 2026", sede: "BMO Field", ciudad: "Toronto", pais: "canada", fase: "grupo E", precio: 2050, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO E" },
    { id: 34, local: "Ecuador", visitante: "Curazao", fecha: "20 JUN 2026", sede: "Arrowhead Stadium", ciudad: "Kansas City", pais: "usa", fase: "grupo E", precio: 1950, imagen: "/src/arrowhead.jpg", categoria: "general", destacado: "GRUPO E" },
    { id: 35, local: "Países Bajos", visitante: "Suecia", fecha: "20 JUN 2026", sede: "NRG Stadium", ciudad: "Houston", pais: "usa", fase: "grupo F", precio: 2200, imagen: "/src/nrg.jpg", categoria: "general", destacado: "GRUPO F" },
    { id: 36, local: "Túnez", visitante: "Japón", fecha: "20 JUN 2026", sede: "BBVA", ciudad: "Guadalupe", pais: "mexico", fase: "grupo F", precio: 1700, imagen: "/src/bbva.jpg", categoria: "general", destacado: "GRUPO F" },

    { id: 37, local: "Uruguay", visitante: "Cabo Verde", fecha: "21 JUN 2026", sede: "Hard Rock Stadium", ciudad: "Miami", pais: "usa", fase: "grupo H", precio: 2800, imagen: "/src/hard.jpg", categoria: "general", destacado: "GRUPO H" },
    { id: 38, local: "España", visitante: "Arabia Saudita", fecha: "21 JUN 2026", sede: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "usa", fase: "grupo H", precio: 1850, imagen: "/src/mercedes.jpg", categoria: "general", destacado: "GRUPO H" },
    { id: 39, local: "Bélgica", visitante: "Irán", fecha: "21 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo G", precio: 2400, imagen: "/src/bc.jpg", categoria: "general", destacado: "GRUPO G" },
    { id: 40, local: "Nueva Zelanda", visitante: "Egipto", fecha: "21 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo G", precio: 1600, imagen: "/src/bc.jpg", categoria: "general", destacado: "GRUPO G" },

    { id: 41, local: "Noruega", visitante: "Senegal", fecha: "22 JUN 2026", sede: "MetLife Stadium", ciudad: "East Rutherford", pais: "usa", fase: "grupo I", precio: 2750, imagen: "/src/metlife.jpg", categoria: "general", destacado: "GRUPO I" },
    { id: 42, local: "Francia", visitante: "Irak", fecha: "22 JUN 2026", sede: "Lincoln Financial Field", ciudad: "Filadelfia", pais: "usa", fase: "grupo I", precio: 2100, imagen: "/src/lincoln.jpg", categoria: "general", destacado: "GRUPO I" },
    { id: 43, local: "Argentina", visitante: "Austria", fecha: "22 JUN 2026", sede: "AT&T Stadium", ciudad: "Arlington", pais: "usa", fase: "grupo J", precio: 1750, imagen: "/src/att.jpg", categoria: "general", destacado: "GRUPO J" },
    { id: 44, local: "Jordania", visitante: "Argelia", fecha: "22 JUN 2026", sede: "Levi's Stadium", ciudad: "Santa Clara", pais: "usa", fase: "grupo J", precio: 2550, imagen: "/src/levis.jpg", categoria: "general", destacado: "GRUPO J" },

    { id: 45, local: "Inglaterra", visitante: "Ghana", fecha: "23 JUN 2026", sede: "Gillette Stadium", ciudad: "Foxborough", pais: "usa", fase: "grupo L", precio: 1900, imagen: "/src/gillette.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 46, local: "Panamá", visitante: "Croacia", fecha: "23 JUN 2026", sede: "BMO Field", ciudad: "Toronto", pais: "canada", fase: "grupo L", precio: 2650, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 47, local: "Portugal", visitante: "Uzbekistán", fecha: "23 JUN 2026", sede: "NRG Stadium", ciudad: "Houston", pais: "usa", fase: "grupo K", precio: 2000, imagen: "/src/nrg.jpg", categoria: "general", destacado: "GRUPO K" },
    { id: 48, local: "Colombia", visitante: "República Democrática del Congo", fecha: "23 JUN 2026", sede: "Akron", ciudad: "Zapopan", pais: "mexico", fase: "grupo K", precio: 1700, imagen: "/src/akron.jpg", categoria: "general", destacado: "GRUPO K" },

    { id: 49, local: "Escocia", visitante: "Brasil", fecha: "24 JUN 2026", sede: "Hard Rock Stadium", ciudad: "Miami", pais: "usa", fase: "grupo C", precio: 2850, imagen: "/src/hard.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 50, local: "Marruecos", visitante: "Haití", fecha: "24 JUN 2026", sede: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "usa", fase: "grupo C", precio: 1800, imagen: "/src/mercedes.jpg", categoria: "general", destacado: "GRUPO C" },
    { id: 51, local: "Suiza", visitante: "Canadá", fecha: "24 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo B", precio: 2200, imagen: "/src/bc.jpg", categoria: "general", destacado: "GRUPO B" },
    { id: 52, local: "Bosnia-Herzegovina", visitante: "Catar", fecha: "24 JUN 2026", sede: "Lumen Field", ciudad: "Seattle", pais: "usa", fase: "grupo B", precio: 1950, imagen: "/src/lumen.jpg", categoria: "general", destacado: "GRUPO B" },
    { id: 53, local: "República Checa", visitante: "México", fecha: "24 JUN 2026", sede: "Estadio Banorte", ciudad: "Ciudad de México", pais: "mexico", fase: "grupo A", precio: 2500, imagen: "/src/banorte.jpg.jpeg", categoria: "general", destacado: "GRUPO A" },
    { id: 54, local: "Sudáfrica", visitante: "Corea del Sur", fecha: "24 JUN 2026", sede: "BBVA", ciudad: "Guadalupe", pais: "mexico", fase: "grupo A", precio: 1700, imagen: "/src/bbva.jpg", categoria: "general", destacado: "GRUPO A" },

    { id: 55, local: "Curazao", visitante: "Costa de Marfil", fecha: "25 JUN 2026", sede: "Lincoln Financial Field", ciudad: "Filadelfia", pais: "usa", fase: "grupo E", precio: 2650, imagen: "/src/lincoln.jpg", categoria: "general", destacado: "GRUPO E" },
    { id: 56, local: "Ecuador", visitante: "Alemania", fecha: "25 JUN 2026", sede: "MetLife Stadium", ciudad: "East Rutherford", pais: "usa", fase: "grupo E", precio: 1850, imagen: "/src/metlife.jpg", categoria: "general", destacado: "GRUPO E" },
    { id: 57, local: "Japón", visitante: "Suecia", fecha: "25 JUN 2026", sede: "AT&T Stadium", ciudad: "Arlington", pais: "usa", fase: "grupo F", precio: 2300, imagen: "/src/att.jpg", categoria: "general", destacado: "GRUPO F" },
    { id: 58, local: "Túnez", visitante: "Países Bajos", fecha: "25 JUN 2026", sede: "Arrowhead Stadium", ciudad: "Kansas City", pais: "usa", fase: "grupo F", precio: 2000, imagen: "/src/arrowhead.jpg", categoria: "general", destacado: "GRUPO F" },
    { id: 59, local: "Turquía", visitante: "Estados Unidos", fecha: "25 JUN 2026", sede: "SoFi Stadium", ciudad: "Inglewood", pais: "usa", fase: "grupo D", precio: 2750, imagen: "/src/sofi.jpg", categoria: "general", destacado: "GRUPO D" },
    { id: 60, local: "Paraguay", visitante: "Australia", fecha: "25 JUN 2026", sede: "Levi's Stadium", ciudad: "Santa Clara", pais: "usa", fase: "grupo D", precio: 1600, imagen: "/src/levis.jpg", categoria: "general", destacado: "GRUPO D" },

    { id: 61, local: "Noruega", visitante: "Francia", fecha: "26 JUN 2026", sede: "Gillette Stadium", ciudad: "Foxborough", pais: "usa", fase: "grupo I", precio: 2900, imagen: "/src/gillette.jpg", categoria: "general", destacado: "GRUPO I" },
    { id: 62, local: "Senegal", visitante: "Irak", fecha: "26 JUN 2026", sede: "BMO Field", ciudad: "Toronto", pais: "canada", fase: "grupo I", precio: 1750, imagen: "/src/bmo.jpg", categoria: "general", destacado: "GRUPO I" },
    { id: 63, local: "Egipto", visitante: "Irán", fecha: "26 JUN 2026", sede: "Lumen Field", ciudad: "Seattle", pais: "usa", fase: "grupo G", precio: 2400, imagen: "/src/lumen.jpg", categoria: "general", destacado: "GRUPO G" },
    { id: 64, local: "Nueva Zelanda", visitante: "Bélgica", fecha: "26 JUN 2026", sede: "BC Place Vancouver", ciudad: "Vancouver", pais: "canada", fase: "grupo G", precio: 2050, imagen: "/src/bc.jpg", categoria: "general", destacado: "GRUPO G" },
    { id: 65, local: "Cabo Verde", visitante: "Arabia Saudita", fecha: "26 JUN 2026", sede: "NRG Stadium", ciudad: "Houston", pais: "usa", fase: "grupo H", precio: 1700, imagen: "/src/nrg.jpg", categoria: "general", destacado: "GRUPO H" },
    { id: 66, local: "Uruguay", visitante: "España", fecha: "26 JUN 2026", sede: "Akron", ciudad: "Zapopan", pais: "mexico", fase: "grupo H", precio: 2550, imagen: "/src/akron.jpg", categoria: "general", destacado: "GRUPO H" },

    { id: 67, local: "Panamá", visitante: "Inglaterra", fecha: "27 JUN 2026", sede: "MetLife Stadium", ciudad: "East Rutherford", pais: "usa", fase: "grupo L", precio: 1950, imagen: "/src/metlife.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 68, local: "Croacia", visitante: "Ghana", fecha: "27 JUN 2026", sede: "Lincoln Financial Field", ciudad: "Filadelfia", pais: "usa", fase: "grupo L", precio: 2200, imagen: "/src/lincoln.jpg", categoria: "general", destacado: "GRUPO L" },
    { id: 69, local: "Argelia", visitante: "Austria", fecha: "27 JUN 2026", sede: "SoFi Stadium", ciudad: "Inglewood", pais: "usa", fase: "grupo J", precio: 2800, imagen: "/src/sofi.jpg", categoria: "general", destacado: "GRUPO J" },
    { id: 70, local: "Jordania", visitante: "Argentina", fecha: "27 JUN 2026", sede: "AT&T Stadium", ciudad: "Arlington", pais: "usa", fase: "grupo J", precio: 1850, imagen: "/src/att.jpg", categoria: "general", destacado: "GRUPO J" },
    { id: 71, local: "Colombia", visitante: "Portugal", fecha: "27 JUN 2026", sede: "Hard Rock Stadium", ciudad: "Miami", pais: "usa", fase: "grupo K", precio: 2650, imagen: "/src/hard.jpg", categoria: "general", destacado: "GRUPO K" },
    { id: 72, local: "República Democrática del Congo", visitante: "Uzbekistán", fecha: "27 JUN 2026", sede: "Mercedes-Benz Stadium", ciudad: "Atlanta", pais: "usa", fase: "grupo K", precio: 2100, imagen: "/src/mercedes.jpg", categoria: "general", destacado: "GRUPO K" },
];

// Datos de las secciones del estadio
export const stadiumSections = {
    suites: [
        { id: 'suite1', name: 'Suite Presidencial', capacity: 12, priceMultiplier: 3.5, available: true },
        { id: 'suite2', name: 'Suite Diamante', capacity: 10, priceMultiplier: 3.0, available: true },
        { id: 'suite3', name: 'Suite Platino', capacity: 8, priceMultiplier: 2.8, available: true },
        { id: 'suite4', name: 'Suite Ejecutiva', capacity: 6, priceMultiplier: 2.5, available: false }
    ],
    vip: [
        { row: 'A', seats: 12, priceMultiplier: 2.2 },
        { row: 'B', seats: 12, priceMultiplier: 2.2 },
        { row: 'C', seats: 12, priceMultiplier: 2.2 }
    ],
    premium: [
        { row: 'D', seats: 14, priceMultiplier: 1.3 },
        { row: 'E', seats: 14, priceMultiplier: 1.3 },
        { row: 'F', seats: 14, priceMultiplier: 1.3 },
        { row: 'G', seats: 14, priceMultiplier: 1.3 }
    ],
    general: [
        { row: 'H', seats: 16, priceMultiplier: 1.0 },
        { row: 'I', seats: 16, priceMultiplier: 1.0 },
        { row: 'J', seats: 16, priceMultiplier: 1.0 },
        { row: 'K', seats: 16, priceMultiplier: 1.0 },
        { row: 'L', seats: 16, priceMultiplier: 1.0 }
    ]
};

// Datos de sedes
export const venues = [
    { name: "CDMX", flag: "mx", city: "Ciudad de México", imagen: "/src/city-cdmx.png" },
    { name: "GDL", flag: "mx", city: "Guadalajara", imagen: "/src/city-gdl.png" },
    { name: "MTY", flag: "mx", city: "Monterrey", imagen: "/src/city-mty.png" },
    { name: "NY/NJ", flag: "us", city: "Nueva York", imagen: "/src/city-nynj.png" },
    { name: "LA", flag: "us", city: "Los Ángeles", imagen: "/src/city-la.png" },
    { name: "DALLAS", flag: "us", city: "Dallas", imagen: "/src/city-dallas.png" },
    { name: "TORONTO", flag: "ca", city: "Toronto", imagen: "/src/city-toronto.png" },
    { name: "VANCOUVER", flag: "ca", city: "Vancouver", imagen: "/src/city-vancouver.png" }
];