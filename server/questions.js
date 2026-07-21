const questions = [
  // ==================== FACILE (questions 1-8) ====================
  {
    id: 1, difficulty: 'Facile', time: 15,
    question: 'Quelle est la monnaie officielle du Bénin ?',
    answers: ['Franc CFA', 'Naira', 'Cedi', 'Dollar'],
    correctIndex: 0
  },
  {
    id: 2, difficulty: 'Facile', time: 15,
    question: 'Combien de couleurs y a-t-il dans un arc-en-ciel ?',
    answers: ['5', '6', '7', '8'],
    correctIndex: 2
  },
  {
    id: 3, difficulty: 'Facile', time: 15,
    question: 'Quel est le réseau social le plus utilisé dans le monde ?',
    answers: ['Twitter', 'Instagram', 'Facebook', 'TikTok'],
    correctIndex: 2
  },
  {
    id: 4, difficulty: 'Facile', time: 15,
    question: 'Qui chante "Blinding Lights" ?',
    answers: ['Drake', 'The Weeknd', 'Bruno Mars', 'Ed Sheeran'],
    correctIndex: 1
  },
  {
    id: 5, difficulty: 'Facile', time: 15,
    question: 'Dans One Piece, comment s\'appelle le chapeau de Luffy ?',
    answers: ['Chapeau de soleil', 'Chapeau de paille', 'Chapeau rouge', 'Chapeau du pirate'],
    correctIndex: 1
  },
  {
    id: 6, difficulty: 'Facile', time: 15,
    question: 'Quel pays organise la Coupe du Monde 2026 ?',
    answers: ['Qatar', 'France', 'USA-Canada-Mexique', 'Brésil'],
    correctIndex: 2
  },
  {
    id: 7, difficulty: 'Facile', time: 15,
    question: 'Quel est le fruit le plus consommé au monde ?',
    answers: ['Pomme', 'Banane', 'Orange', 'Mangue'],
    correctIndex: 1
  },
  {
    id: 8, difficulty: 'Facile', time: 15,
    question: 'Que signifie "Wi-Fi" ?',
    answers: ['Wireless Finder', 'Wireless Fidelity', 'Wide Frequency', 'Wired Fiber'],
    correctIndex: 1
  },

  // ==================== MOYEN (questions 9-16) ====================
  {
    id: 9, difficulty: 'Moyen', time: 20,
    question: 'Quel pays africain est surnommé "le géant d\'Afrique" ?',
    answers: ['Afrique du Sud', 'Nigeria', 'Égypte', 'RD Congo'],
    correctIndex: 1
  },
  {
    id: 10, difficulty: 'Moyen', time: 20,
    question: 'Qui a fondé l\'empire du Mali au 13ème siècle ?',
    answers: ['Mansa Moussa', 'Soundiata Keïta', 'Askia Mohammed', 'Sonni Ali'],
    correctIndex: 1
  },
  {
    id: 11, difficulty: 'Moyen', time: 20,
    question: 'Dans quel film Marvel apparaît Black Panther pour la première fois ?',
    answers: ['Avengers', 'Captain America: Civil War', 'Iron Man 3', 'Thor Ragnarok'],
    correctIndex: 1
  },
  {
    id: 12, difficulty: 'Moyen', time: 20,
    question: 'Quel est le vrai nom de l\'artiste Burna Boy ?',
    answers: ['David Adeleke', 'Damini Ogulu', 'Ayodeji Balogun', 'Ahmed Ololade'],
    correctIndex: 1
  },
  {
    id: 13, difficulty: 'Moyen', time: 20,
    question: 'Quel gaz les plantes absorbent-elles pour la photosynthèse ?',
    answers: ['Oxygène', 'Azote', 'Dioxyde de carbone', 'Hydrogène'],
    correctIndex: 2
  },
  {
    id: 14, difficulty: 'Moyen', time: 20,
    question: 'Qui a remporté la CAN 2023 (Coupe d\'Afrique des Nations) ?',
    answers: ['Nigeria', 'Côte d\'Ivoire', 'Sénégal', 'Maroc'],
    correctIndex: 1
  },
  {
    id: 15, difficulty: 'Moyen', time: 20,
    question: 'Quelle série a battu le record d\'audience Netflix avec "Mercredi" ?',
    answers: ['Stranger Things', 'Wednesday', 'La Casa de Papel', 'Bridgerton'],
    correctIndex: 1
  },
  {
    id: 16, difficulty: 'Moyen', time: 20,
    question: 'Quel instrument de musique est associé au reggae ?',
    answers: ['Piano', 'Guitare électrique', 'Basse', 'Batterie'],
    correctIndex: 2
  },

  // ==================== DIFFICILE (questions 17-24) ====================
  {
    id: 17, difficulty: 'Difficile', time: 25,
    question: 'Quelle est la capitale économique de la Côte d\'Ivoire ?',
    answers: ['Yamoussoukro', 'Abidjan', 'Bouaké', 'San Pedro'],
    correctIndex: 1
  },
  {
    id: 18, difficulty: 'Difficile', time: 25,
    question: 'Quel mathématicien a inventé le calcul différentiel en même temps que Newton ?',
    answers: ['Descartes', 'Leibniz', 'Pascal', 'Euler'],
    correctIndex: 1
  },
  {
    id: 19, difficulty: 'Difficile', time: 25,
    question: 'Dans Demon Slayer, quel est le style de respiration de Tanjiro ?',
    answers: ['Respiration de l\'eau', 'Respiration du feu', 'Respiration du soleil', 'Respiration du vent'],
    correctIndex: 0
  },
  {
    id: 20, difficulty: 'Difficile', time: 25,
    question: 'Quel pays est le premier producteur mondial de cacao ?',
    answers: ['Ghana', 'Côte d\'Ivoire', 'Brésil', 'Indonésie'],
    correctIndex: 1
  },
  {
    id: 21, difficulty: 'Difficile', time: 25,
    question: 'Que mesure l\'échelle de Richter ?',
    answers: ['La vitesse du vent', 'L\'intensité des séismes', 'La température', 'La pression atmosphérique'],
    correctIndex: 1
  },
  {
    id: 22, difficulty: 'Difficile', time: 25,
    question: 'Qui a peint "Guernica" ?',
    answers: ['Salvador Dalí', 'Pablo Picasso', 'Vincent van Gogh', 'Claude Monet'],
    correctIndex: 1
  },
  {
    id: 23, difficulty: 'Difficile', time: 25,
    question: 'Quel pays africain possède le plus de sites UNESCO ?',
    answers: ['Égypte', 'Maroc', 'Afrique du Sud', 'Éthiopie'],
    correctIndex: 0
  },
  {
    id: 24, difficulty: 'Difficile', time: 25,
    question: 'Quel est le composant principal du sable ?',
    answers: ['Calcaire', 'Silice', 'Argile', 'Granit'],
    correctIndex: 1
  },

  // ==================== EXPERT (questions 25-30) ====================
  {
    id: 25, difficulty: 'Expert', time: 30,
    question: 'Quel royaume africain était dirigé par la reine Nzinga au 17ème siècle ?',
    answers: ['Royaume du Kongo', 'Royaume Ndongo', 'Royaume du Bénin', 'Royaume Ashanti'],
    correctIndex: 1
  },
  {
    id: 26, difficulty: 'Expert', time: 30,
    question: 'Qu\'est-ce que le "Bug Bounty" en informatique ?',
    answers: ['Un virus informatique', 'Une récompense pour trouver des failles', 'Un logiciel antivirus', 'Un navigateur web'],
    correctIndex: 1
  },
  {
    id: 27, difficulty: 'Expert', time: 30,
    question: 'Dans l\'Attaque des Titans, quel est le vrai nom du Titan Assaillant ?',
    answers: ['Reiner Braun', 'Eren Yeager', 'Armin Arlert', 'Zeke Yeager'],
    correctIndex: 1
  },
  {
    id: 28, difficulty: 'Expert', time: 30,
    question: 'Quelle ville abrite le siège de l\'Union Africaine ?',
    answers: ['Nairobi', 'Addis-Abeba', 'Le Caire', 'Pretoria'],
    correctIndex: 1
  },
  {
    id: 29, difficulty: 'Expert', time: 30,
    question: 'Combien d\'os possède un humain adulte ?',
    answers: ['186', '206', '226', '256'],
    correctIndex: 1
  },
  {
    id: 30, difficulty: 'Expert', time: 30,
    question: 'Quel philosophe a dit "Je pense, donc je suis" ?',
    answers: ['Platon', 'René Descartes', 'Socrate', 'Aristote'],
    correctIndex: 1
  },
]

module.exports = questions