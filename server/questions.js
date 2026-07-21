const questions = [
  // Facile (15s)
  { id: 1, difficulty: 'Facile', time: 15, question: 'Quelle est la capitale de la France ?', answers: ['Londres', 'Paris', 'Berlin', 'Madrid'], correctIndex: 1 },
  { id: 2, difficulty: 'Facile', time: 15, question: 'Combien de continents y a-t-il sur Terre ?', answers: ['5', '6', '7', '8'], correctIndex: 2 },
  { id: 3, difficulty: 'Facile', time: 15, question: 'Quelle est la couleur du ciel par temps clair ?', answers: ['Vert', 'Rouge', 'Bleu', 'Jaune'], correctIndex: 2 },
  { id: 4, difficulty: 'Facile', time: 15, question: 'Combien font 2 + 2 ?', answers: ['3', '4', '5', '6'], correctIndex: 1 },
  { id: 5, difficulty: 'Facile', time: 15, question: 'Quel animal est le roi de la jungle ?', answers: ['Tigre', 'Lion', 'Éléphant', 'Ours'], correctIndex: 1 },
  
  // Moyen (20s)
  { id: 6, difficulty: 'Moyen', time: 20, question: 'Quelle est la capitale du Brésil ?', answers: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correctIndex: 2 },
  { id: 7, difficulty: 'Moyen', time: 20, question: 'En quelle année a eu lieu la Révolution française ?', answers: ['1789', '1799', '1769', '1804'], correctIndex: 0 },
  { id: 8, difficulty: 'Moyen', time: 20, question: 'Qui a écrit "Les Misérables" ?', answers: ['Balzac', 'Victor Hugo', 'Zola', 'Flaubert'], correctIndex: 1 },
  { id: 9, difficulty: 'Moyen', time: 20, question: 'Quel est le plus grand océan ?', answers: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'], correctIndex: 2 },
  { id: 10, difficulty: 'Moyen', time: 20, question: 'Quel pays a inventé la pizza ?', answers: ['France', 'Italie', 'Grèce', 'Espagne'], correctIndex: 1 },
  
  // Difficile (25s)
  { id: 11, difficulty: 'Difficile', time: 25, question: 'Quel est le plus grand désert du monde ?', answers: ['Sahara', 'Gobi', 'Antarctique', 'Kalahari'], correctIndex: 2 },
  { id: 12, difficulty: 'Difficile', time: 25, question: 'Qui a peint le plafond de la Chapelle Sixtine ?', answers: ['Léonard de Vinci', 'Raphaël', 'Michel-Ange', 'Donatello'], correctIndex: 2 },
  { id: 13, difficulty: 'Difficile', time: 25, question: 'Quel est l\'élément chimique le plus abondant dans l\'univers ?', answers: ['Oxygène', 'Carbone', 'Hydrogène', 'Azote'], correctIndex: 2 },
  { id: 14, difficulty: 'Difficile', time: 25, question: 'Quelle est la monnaie du Japon ?', answers: ['Yuan', 'Won', 'Yen', 'Ringgit'], correctIndex: 2 },
  { id: 15, difficulty: 'Difficile', time: 25, question: 'Qui a découvert la pénicilline ?', answers: ['Pasteur', 'Fleming', 'Koch', 'Jenner'], correctIndex: 1 },
  
  // Expert (30s)
  { id: 16, difficulty: 'Expert', time: 30, question: 'Quel élément chimique a pour symbole "W" ?', answers: ['Wolfram', 'Tungstène', 'Les deux', 'Aucun'], correctIndex: 2 },
  { id: 17, difficulty: 'Expert', time: 30, question: 'Quelle est la valeur de la constante de Planck ?', answers: ['6,626 × 10⁻³⁴ J·s', '3,00 × 10⁸ m/s', '9,81 m/s²', '1,602 × 10⁻¹⁹ C'], correctIndex: 0 },
  { id: 18, difficulty: 'Expert', time: 30, question: 'Quel pays a le plus de fuseaux horaires ?', answers: ['Russie', 'USA', 'France', 'Chine'], correctIndex: 2 },
  { id: 19, difficulty: 'Expert', time: 30, question: 'Quelle est la profondeur moyenne de l\'océan ?', answers: ['~1200m', '~2500m', '~3800m', '~5000m'], correctIndex: 2 },
  { id: 20, difficulty: 'Expert', time: 30, question: 'Qui a formulé la théorie de la relativité générale ?', answers: ['Newton', 'Einstein', 'Hawking', 'Bohr'], correctIndex: 1 },
  
  // Bonus
  { id: 21, difficulty: 'Expert', time: 30, question: 'Quelle est la vitesse de la lumière dans le vide ?', answers: ['~300 000 km/s', '~150 000 km/s', '~450 000 km/s', '~600 000 km/s'], correctIndex: 0 },
  { id: 22, difficulty: 'Expert', time: 30, question: 'Quel est le nombre d\'or (φ) approximatif ?', answers: ['1,414', '1,618', '2,718', '3,142'], correctIndex: 1 },
  { id: 23, difficulty: 'Difficile', time: 25, question: 'Quelle est la capitale de l\'Australie ?', answers: ['Sydney', 'Melbourne', 'Canberra', 'Brisbane'], correctIndex: 2 },
  { id: 24, difficulty: 'Difficile', time: 25, question: 'Qui a écrit "1984" ?', answers: ['Aldous Huxley', 'George Orwell', 'Ray Bradbury', 'H.G. Wells'], correctIndex: 1 },
  { id: 25, difficulty: 'Moyen', time: 20, question: 'Quel est le plus long fleuve du monde ?', answers: ['Nil', 'Amazone', 'Mississippi', 'Yangtsé'], correctIndex: 0 },
]

module.exports = questions