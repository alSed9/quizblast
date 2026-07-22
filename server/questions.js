const questions = [
  // ==================== FACILE (questions 1-8) ====================
  {
    id: 1, difficulty: 'Facile', time: 15,
    question: 'Quel est le jour qui suit le lundi ?',
    answers: ['Dimanche', 'Mardi', 'Mercredi', 'Samedi'],
    correctIndex: 1
  },
  {
    id: 2, difficulty: 'Facile', time: 15,
    question: 'De quelle couleur est le ciel par beau temps ?',
    answers: ['Vert', 'Rouge', 'Bleu', 'Jaune'],
    correctIndex: 2
  },
  {
    id: 3, difficulty: 'Facile', time: 15,
    question: 'Combien font 10 + 5 ?',
    answers: ['12', '14', '15', '16'],
    correctIndex: 2
  },
  {
    id: 4, difficulty: 'Facile', time: 15,
    question: 'Quel animal miaule ?',
    answers: ['Chien', 'Chat', 'Vache', 'Mouton'],
    correctIndex: 1
  },
  {
    id: 5, difficulty: 'Facile', time: 15,
    question: 'Combien y a-t-il de doigts sur les deux mains ?',
    answers: ['8', '9', '10', '12'],
    correctIndex: 2
  },
  {
    id: 6, difficulty: 'Facile', time: 15,
    question: 'Que boit un bébé ?',
    answers: ['Café', 'Lait', 'Jus d\'orange', 'Coca'],
    correctIndex: 1
  },
  {
    id: 7, difficulty: 'Facile', time: 15,
    question: 'Quel est le contraire de "grand" ?',
    answers: ['Large', 'Petit', 'Haut', 'Long'],
    correctIndex: 1
  },
  {
    id: 8, difficulty: 'Facile', time: 15,
    question: 'Avec quoi écrit-on sur un tableau ?',
    answers: ['Stylo', 'Craie', 'Crayon', 'Pinceau'],
    correctIndex: 1
  },

  // ==================== MOYEN (questions 9-16) ====================
  {
    id: 9, difficulty: 'Moyen', time: 20,
    question: 'Quelle est la capitale du Bénin ?',
    answers: ['Cotonou', 'Porto-Novo', 'Parakou', 'Abomey'],
    correctIndex: 1
  },
  {
    id: 10, difficulty: 'Moyen', time: 20,
    question: 'Combien de planètes y a-t-il dans le système solaire ?',
    answers: ['7', '8', '9', '10'],
    correctIndex: 1
  },
  {
    id: 11, difficulty: 'Moyen', time: 20,
    question: 'Qui est le créateur de One Piece ?',
    answers: ['Akira Toriyama', 'Eiichiro Oda', 'Masashi Kishimoto', 'Tite Kubo'],
    correctIndex: 1
  },
  {
    id: 12, difficulty: 'Moyen', time: 20,
    question: 'Quel est le plus grand pays d\'Afrique ?',
    answers: ['Nigeria', 'Algérie', 'RD Congo', 'Soudan'],
    correctIndex: 1
  },
  {
    id: 13, difficulty: 'Moyen', time: 20,
    question: 'Dans Naruto, qui est le rival de Naruto ?',
    answers: ['Kakashi', 'Sasuke', 'Shikamaru', 'Neji'],
    correctIndex: 1
  },
  {
    id: 14, difficulty: 'Moyen', time: 20,
    question: 'Qui chante "Yemanja" ?',
    answers: ['Angélique Kidjo', 'Beyoncé', 'Rihanna', 'Yemi Alade'],
    correctIndex: 0
  },
  {
    id: 15, difficulty: 'Moyen', time: 20,
    question: 'Quel réseau social appartient à Elon Musk ?',
    answers: ['Facebook', 'Instagram', 'X (Twitter)', 'Snapchat'],
    correctIndex: 2
  },
  {
    id: 16, difficulty: 'Moyen', time: 20,
    question: 'Quel est le sport le plus populaire en Afrique ?',
    answers: ['Basketball', 'Football', 'Rugby', 'Athlétisme'],
    correctIndex: 1
  },

  // ==================== DIFFICILE (questions 17-24) ====================
  {
    id: 17, difficulty: 'Difficile', time: 25,
    question: 'En quelle année le Bénin a-t-il obtenu son indépendance ?',
    answers: ['1958', '1960', '1962', '1965'],
    correctIndex: 1
  },
  {
    id: 18, difficulty: 'Difficile', time: 25,
    question: 'Quel est le plus grand désert chaud du monde ?',
    answers: ['Gobi', 'Sahara', 'Kalahari', 'Mojave'],
    correctIndex: 1
  },
  {
    id: 19, difficulty: 'Difficile', time: 25,
    question: 'Dans Dragon Ball, comment s\'appelle la transformation ultime de Goku ?',
    answers: ['Super Saiyan', 'Ultra Instinct', 'Kaioken', 'Fusion'],
    correctIndex: 1
  },
  {
    id: 20, difficulty: 'Difficile', time: 25,
    question: 'Qui était le premier président du Ghana indépendant ?',
    answers: ['Nelson Mandela', 'Kwame Nkrumah', 'Julius Nyerere', 'Patrice Lumumba'],
    correctIndex: 1
  },
  {
    id: 21, difficulty: 'Difficile', time: 25,
    question: 'Quel organe pompe le sang dans le corps ?',
    answers: ['Cerveau', 'Cœur', 'Foie', 'Poumons'],
    correctIndex: 1
  },
  {
    id: 22, difficulty: 'Difficile', time: 25,
    question: 'Quel pays a inventé le chocolat ?',
    answers: ['Suisse', 'Belgique', 'Mexique', 'France'],
    correctIndex: 2
  },
  {
    id: 23, difficulty: 'Difficile', time: 25,
    question: 'Quelle est la monnaie du Nigeria ?',
    answers: ['Cedi', 'Naira', 'Franc CFA', 'Shilling'],
    correctIndex: 1
  },
  {
    id: 24, difficulty: 'Difficile', time: 25,
    question: 'Combien d\'os a un corps humain adulte ?',
    answers: ['186', '206', '226', '256'],
    correctIndex: 1
  },

  // ==================== EXPERT (questions 25-30) ====================
  {
    id: 25, difficulty: 'Expert', time: 30,
    question: 'Quel roi du Dahomey a résisté à la colonisation française ?',
    answers: ['Guézo', 'Glèlè', 'Béhanzin', 'Agadja'],
    correctIndex: 2
  },
  {
    id: 26, difficulty: 'Expert', time: 30,
    question: 'Quelle est la vitesse de la lumière ?',
    answers: ['~150 000 km/s', '~300 000 km/s', '~450 000 km/s', '~600 000 km/s'],
    correctIndex: 1
  },
  {
    id: 27, difficulty: 'Expert', time: 30,
    question: 'Dans L\'Attaque des Titans, qui est le Titan Colossal ?',
    answers: ['Reiner', 'Bertholdt', 'Eren', 'Armin'],
    correctIndex: 1
  },
  {
    id: 28, difficulty: 'Expert', time: 30,
    question: 'Quel est le seul pays africain à n\'avoir jamais été colonisé ?',
    answers: ['Liberia', 'Éthiopie', 'Les deux', 'Aucun'],
    correctIndex: 2
  },
  {
    id: 29, difficulty: 'Expert', time: 30,
    question: 'Qu\'est-ce que le "quantum" en physique ?',
    answers: ['Une particule géante', 'La plus petite unité d\'énergie', 'Une galaxie', 'Un type de lumière'],
    correctIndex: 1
  },
  {
    id: 30, difficulty: 'Expert', time: 30,
    question: 'Quel écrivain a écrit "L\'Enfant noir" ?',
    answers: ['Ahmadou Kourouma', 'Camara Laye', 'Mongo Beti', 'Ferdinand Oyono'],
    correctIndex: 1
  },
]

module.exports = questions