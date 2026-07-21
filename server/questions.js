const questions = [
  // ==================== FACILE (questions 1-8) ====================
  {
    id: 1, difficulty: 'Facile', time: 15,
    question: 'Quel animal est le symbole du Bénin ?',
    answers: ['Lion', 'Éléphant', 'Panthère', 'Aigle'],
    correctIndex: 1
  },
  {
    id: 2, difficulty: 'Facile', time: 15,
    question: 'Combien font 7 × 8 ?',
    answers: ['48', '54', '56', '64'],
    correctIndex: 2
  },
  {
    id: 3, difficulty: 'Facile', time: 15,
    question: 'Quelle application a popularisé les vidéos courtes ?',
    answers: ['YouTube', 'TikTok', 'Snapchat', 'Instagram'],
    correctIndex: 1
  },
  {
    id: 4, difficulty: 'Facile', time: 15,
    question: 'Qui est le créateur de Dragon Ball ?',
    answers: ['Eiichiro Oda', 'Akira Toriyama', 'Masashi Kishimoto', 'Tite Kubo'],
    correctIndex: 1
  },
  {
    id: 5, difficulty: 'Facile', time: 15,
    question: 'Quel est le pays le plus peuplé d\'Afrique ?',
    answers: ['Égypte', 'Nigeria', 'Éthiopie', 'RD Congo'],
    correctIndex: 1
  },
  {
    id: 6, difficulty: 'Facile', time: 15,
    question: 'De quelle couleur est le ciel la nuit ?',
    answers: ['Bleu', 'Noir', 'Violet', 'Blanc'],
    correctIndex: 1
  },
  {
    id: 7, difficulty: 'Facile', time: 15,
    question: 'Que signifie "Google" ?',
    answers: ['Chercher', 'Un chiffre énorme (Googol)', 'Rapide', 'Navigateur'],
    correctIndex: 1
  },
  {
    id: 8, difficulty: 'Facile', time: 15,
    question: 'Combien de jours y a-t-il dans une année bissextile ?',
    answers: ['364', '365', '366', '367'],
    correctIndex: 2
  },

  // ==================== MOYEN (questions 9-16) ====================
  {
    id: 9, difficulty: 'Moyen', time: 20,
    question: 'Quel pays africain est le plus grand producteur d\'or ?',
    answers: ['Afrique du Sud', 'Ghana', 'Mali', 'Soudan'],
    correctIndex: 1
  },
  {
    id: 10, difficulty: 'Moyen', time: 20,
    question: 'Quelle mer est la plus salée du monde ?',
    answers: ['Mer Morte', 'Mer Rouge', 'Mer Méditerranée', 'Mer Noire'],
    correctIndex: 0
  },
  {
    id: 11, difficulty: 'Moyen', time: 20,
    question: 'Qui joue le rôle de Joker dans "The Dark Knight" ?',
    answers: ['Jack Nicholson', 'Heath Ledger', 'Joaquin Phoenix', 'Jared Leto'],
    correctIndex: 1
  },
  {
    id: 12, difficulty: 'Moyen', time: 20,
    question: 'Quel footballeur africain a remporté le Ballon d\'Or ?',
    answers: ['Didier Drogba', 'Samuel Eto\'o', 'George Weah', 'Mohamed Salah'],
    correctIndex: 2
  },
  {
    id: 13, difficulty: 'Moyen', time: 20,
    question: 'Dans Harry Potter, quel est le nom de l\'école de sorcellerie ?',
    answers: ['Durmstrang', 'Beauxbâtons', 'Poudlard', 'Ilvermorny'],
    correctIndex: 2
  },
  {
    id: 14, difficulty: 'Moyen', time: 20,
    question: 'Quel est le plus long fleuve du monde ?',
    answers: ['Nil', 'Amazone', 'Mississippi', 'Yangtsé'],
    correctIndex: 0
  },
  {
    id: 15, difficulty: 'Moyen', time: 20,
    question: 'Quelle est la capitale du Sénégal ?',
    answers: ['Bamako', 'Dakar', 'Abidjan', 'Conakry'],
    correctIndex: 1
  },
  {
    id: 16, difficulty: 'Moyen', time: 20,
    question: 'Qui a chanté "Thriller" ?',
    answers: ['Prince', 'Michael Jackson', 'Stevie Wonder', 'Marvin Gaye'],
    correctIndex: 1
  },

  // ==================== DIFFICILE (questions 17-24) ====================
  {
    id: 17, difficulty: 'Difficile', time: 25,
    question: 'Quel pays africain était autrefois appelé la "Haute-Volta" ?',
    answers: ['Mali', 'Burkina Faso', 'Niger', 'Tchad'],
    correctIndex: 1
  },
  {
    id: 18, difficulty: 'Difficile', time: 25,
    question: 'Quel est l\'élément le plus abondant dans l\'univers ?',
    answers: ['Oxygène', 'Hydrogène', 'Hélium', 'Carbone'],
    correctIndex: 1
  },
  {
    id: 19, difficulty: 'Difficile', time: 25,
    question: 'Dans Jujutsu Kaisen, quel est le nom du démon le plus puissant ?',
    answers: ['Mahito', 'Sukuna', 'Jogo', 'Hanami'],
    correctIndex: 1
  },
  {
    id: 20, difficulty: 'Difficile', time: 25,
    question: 'Qui a remporté la première Coupe du Monde de football en 1930 ?',
    answers: ['Brésil', 'Uruguay', 'Argentine', 'Italie'],
    correctIndex: 1
  },
  {
    id: 21, difficulty: 'Difficile', time: 25,
    question: 'Quel pays abrite le lac Victoria ?',
    answers: ['Kenya', 'Ouganda', 'Tanzanie', 'Les trois'],
    correctIndex: 3
  },
  {
    id: 22, difficulty: 'Difficile', time: 25,
    question: 'Qu\'est-ce que le "phishing" sur Internet ?',
    answers: ['Un jeu en ligne', 'Une tentative d\'escroquerie', 'Un réseau social', 'Un antivirus'],
    correctIndex: 1
  },
  {
    id: 23, difficulty: 'Difficile', time: 25,
    question: 'Quel mammifère pond des œufs ?',
    answers: ['Chauve-souris', 'Ornithorynque', 'Dauphin', 'Pangolin'],
    correctIndex: 1
  },
  {
    id: 24, difficulty: 'Difficile', time: 25,
    question: 'Quel est le désert le plus chaud du monde ?',
    answers: ['Sahara', 'Gobi', 'Lut (Iran)', 'Mojave'],
    correctIndex: 2
  },

  // ==================== EXPERT (questions 25-30) ====================
  {
    id: 25, difficulty: 'Expert', time: 30,
    question: 'Qui était le roi du Bénin (Dahomey) connu pour ses Amazones ?',
    answers: ['Béhanzin', 'Guézo', 'Glèlè', 'Agadja'],
    correctIndex: 1
  },
  {
    id: 26, difficulty: 'Expert', time: 30,
    question: 'Qu\'est-ce que le "Deep Web" ?',
    answers: ['Un site de streaming', 'La partie non indexée d\'Internet', 'Un navigateur', 'Un réseau WiFi'],
    correctIndex: 1
  },
  {
    id: 27, difficulty: 'Expert', time: 30,
    question: 'Quel est le seul pays africain à n\'avoir jamais été colonisé ?',
    answers: ['Éthiopie', 'Liberia', 'Les deux', 'Aucun'],
    correctIndex: 2
  },
  {
    id: 28, difficulty: 'Expert', time: 30,
    question: 'Quelle est la protéine responsable de la contraction musculaire ?',
    answers: ['Hémoglobine', 'Myosine', 'Kératine', 'Collagène'],
    correctIndex: 1
  },
  {
    id: 29, difficulty: 'Expert', time: 30,
    question: 'Dans Death Note, quel est le vrai nom de L ?',
    answers: ['Light Yagami', 'L Lawliet', 'Near', 'Mello'],
    correctIndex: 1
  },
  {
    id: 30, difficulty: 'Expert', time: 30,
    question: 'Quel pays a inventé le café ?',
    answers: ['Brésil', 'Colombie', 'Éthiopie', 'Italie'],
    correctIndex: 2
  },
]

module.exports = questions