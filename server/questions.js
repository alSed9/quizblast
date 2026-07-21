const questions = [
  // ==================== FACILE (questions 1-8) ====================
  {
    id: 1, difficulty: 'Facile', time: 15,
    question: 'Quel est le sport le plus populaire au monde ?',
    answers: ['Basketball', 'Tennis', 'Football', 'Cricket'],
    correctIndex: 2
  },
  {
    id: 2, difficulty: 'Facile', time: 15,
    question: 'Dans quel pays se trouve la ville de Cotonou ?',
    answers: ['Togo', 'Nigeria', 'Bénin', 'Ghana'],
    correctIndex: 2
  },
  {
    id: 3, difficulty: 'Facile', time: 15,
    question: 'Combien de planètes y a-t-il dans le système solaire ?',
    answers: ['7', '8', '9', '10'],
    correctIndex: 1
  },
  {
    id: 4, difficulty: 'Facile', time: 15,
    question: 'Dans Dragon Ball Z, comment s\'appelle le fils de Goku ?',
    answers: ['Goten', 'Gohan', 'Trunks', 'Vegeta'],
    correctIndex: 1
  },
  {
    id: 5, difficulty: 'Facile', time: 15,
    question: 'Quel est le plus grand océan du monde ?',
    answers: ['Atlantique', 'Indien', 'Pacifique', 'Arctique'],
    correctIndex: 2
  },
  {
    id: 6, difficulty: 'Facile', time: 15,
    question: 'Qui a inventé l\'ampoule électrique ?',
    answers: ['Nikola Tesla', 'Thomas Edison', 'Alexander Graham Bell', 'Albert Einstein'],
    correctIndex: 1
  },
  {
    id: 7, difficulty: 'Facile', time: 15,
    question: 'Quel animal est surnommé "le roi de la jungle" ?',
    answers: ['Tigre', 'Lion', 'Éléphant', 'Ours'],
    correctIndex: 1
  },
  {
    id: 8, difficulty: 'Facile', time: 15,
    question: 'Dans Naruto, quel est le nom du démon renard scellé en lui ?',
    answers: ['Shukaku', 'Matatabi', 'Kurama', 'Gyuki'],
    correctIndex: 2
  },

  // ==================== MOYEN (questions 9-16) ====================
  {
    id: 9, difficulty: 'Moyen', time: 20,
    question: 'En quelle année le Bénin a-t-il obtenu son indépendance ?',
    answers: ['1958', '1960', '1962', '1965'],
    correctIndex: 1
  },
  {
    id: 10, difficulty: 'Moyen', time: 20,
    question: 'Quel était le nom du Bénin avant 1975 ?',
    answers: ['Dahomey', 'Haute-Volta', 'Gold Coast', 'Soudan français'],
    correctIndex: 0
  },
  {
    id: 11, difficulty: 'Moyen', time: 20,
    question: 'Qui a réalisé le film "Black Panther" ?',
    answers: ['Spike Lee', 'Ryan Coogler', 'Ava DuVernay', 'Jordan Peele'],
    correctIndex: 1
  },
  {
    id: 12, difficulty: 'Moyen', time: 20,
    question: 'Quelle série met en scène un professeur de chimie qui devient trafiquant ?',
    answers: ['Narcos', 'Breaking Bad', 'Ozark', 'The Wire'],
    correctIndex: 1
  },
  {
    id: 13, difficulty: 'Moyen', time: 20,
    question: 'Quel artiste nigérian chante "Essence" avec Wizkid ?',
    answers: ['Burna Boy', 'Davido', 'Tems', 'Mr Eazi'],
    correctIndex: 2
  },
  {
    id: 14, difficulty: 'Moyen', time: 20,
    question: 'Quel est le plus grand pays d\'Afrique en superficie ?',
    answers: ['Nigeria', 'Algérie', 'RD Congo', 'Soudan'],
    correctIndex: 1
  },
  {
    id: 15, difficulty: 'Moyen', time: 20,
    question: 'Dans Game of Thrones, quel est le surnom de Daenerys Targaryen ?',
    answers: ['La Reine de la Nuit', 'La Mère des Dragons', 'La Dame de Fer', 'La Princesse Rouge'],
    correctIndex: 1
  },
  {
    id: 16, difficulty: 'Moyen', time: 20,
    question: 'Quel est l\'organe le plus grand du corps humain ?',
    answers: ['Le foie', 'Le cerveau', 'La peau', 'Les poumons'],
    correctIndex: 2
  },

  // ==================== DIFFICILE (questions 17-24) ====================
  {
    id: 17, difficulty: 'Difficile', time: 25,
    question: 'Qui était le premier président du Ghana indépendant ?',
    answers: ['Nelson Mandela', 'Kwame Nkrumah', 'Julius Nyerere', 'Patrice Lumumba'],
    correctIndex: 1
  },
  {
    id: 18, difficulty: 'Difficile', time: 25,
    question: 'Quel empire africain était dirigé par Soundiata Keïta ?',
    answers: ['Empire Songhaï', 'Empire du Ghana', 'Empire du Mali', 'Empire du Bénin'],
    correctIndex: 2
  },
  {
    id: 19, difficulty: 'Difficile', time: 25,
    question: 'Quelle est la plus grande lune de Saturne ?',
    answers: ['Europa', 'Titan', 'Ganymède', 'Callisto'],
    correctIndex: 1
  },
  {
    id: 20, difficulty: 'Difficile', time: 25,
    question: 'Qui a écrit "Things Fall Apart" (Le Monde s\'effondre) ?',
    answers: ['Wole Soyinka', 'Chinua Achebe', 'Ngugi wa Thiong\'o', 'Léopold Sédar Senghor'],
    correctIndex: 1
  },
  {
    id: 21, difficulty: 'Difficile', time: 25,
    question: 'Quel élément chimique a pour symbole "Au" ?',
    answers: ['Argent', 'Aluminium', 'Or', 'Argon'],
    correctIndex: 2
  },
  {
    id: 22, difficulty: 'Difficile', time: 25,
    question: 'Quelle série Netflix a rendu célèbre "Le jeu du calmar" ?',
    answers: ['Alice in Borderland', 'Squid Game', 'Hellbound', 'All of Us Are Dead'],
    correctIndex: 1
  },
  {
    id: 23, difficulty: 'Difficile', time: 25,
    question: 'Combien de temps met la lumière du Soleil pour atteindre la Terre ?',
    answers: ['~8 secondes', '~8 minutes', '~8 heures', '~8 jours'],
    correctIndex: 1
  },
  {
    id: 24, difficulty: 'Difficile', time: 25,
    question: 'Quel pays africain est surnommé "la perle de l\'Afrique" ?',
    answers: ['Kenya', 'Tanzanie', 'Ouganda', 'Rwanda'],
    correctIndex: 2
  },

  // ==================== EXPERT (questions 25-30) ====================
  {
    id: 25, difficulty: 'Expert', time: 30,
    question: 'Quel scientifique a proposé la théorie de la relativité générale ?',
    answers: ['Isaac Newton', 'Albert Einstein', 'Stephen Hawking', 'Niels Bohr'],
    correctIndex: 1
  },
  {
    id: 26, difficulty: 'Expert', time: 30,
    question: 'Dans quel pays se trouve le lac Assal, le point le plus bas d\'Afrique ?',
    answers: ['Éthiopie', 'Djibouti', 'Érythrée', 'Somalie'],
    correctIndex: 1
  },
  {
    id: 27, difficulty: 'Expert', time: 30,
    question: 'Quel pays africain a remporté le plus de Coupes d\'Afrique des Nations ?',
    answers: ['Nigeria', 'Cameroun', 'Égypte', 'Ghana'],
    correctIndex: 2
  },
  {
    id: 28, difficulty: 'Expert', time: 30,
    question: 'Quel est le nombre d\'or approximatif (φ) ?',
    answers: ['1,414', '1,618', '2,718', '3,142'],
    correctIndex: 1
  },
  {
    id: 29, difficulty: 'Expert', time: 30,
    question: 'Quel est le fleuve le plus long d\'Afrique ?',
    answers: ['Nil', 'Congo', 'Niger', 'Zambèze'],
    correctIndex: 0
  },
  {
    id: 30, difficulty: 'Expert', time: 30,
    question: 'Quel acteur a joué le rôle principal dans "The Pursuit of Happyness" ?',
    answers: ['Denzel Washington', 'Will Smith', 'Jamie Foxx', 'Morgan Freeman'],
    correctIndex: 1
  },
]

module.exports = questions