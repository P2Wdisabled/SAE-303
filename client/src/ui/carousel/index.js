let Carousel = {};

Carousel.loadCarousel = async function() {
    Carousel.RentCarousel();
    Carousel.SoldCarousel();

};

Carousel.RentCarousel = async function(){
// Sélection des éléments
const scrollContainer = document.getElementById('iteration6Rent');
const scrollLeftBtn = document.getElementById('scrollLeft-Rent');
const scrollRightBtn = document.getElementById('scrollRight-Rent');

// Quantité de défilement en pixels
const scrollAmount = 408;

// Fonction pour défiler à gauche
scrollLeftBtn.addEventListener('click', () => {
scrollContainer.scrollBy({
top: 0,
left: -scrollAmount,
behavior: 'smooth'
});
});

// Fonction pour défiler à droite
scrollRightBtn.addEventListener('click', () => {
scrollContainer.scrollBy({
top: 0,
left: scrollAmount,
behavior: 'smooth'
});
});
};

Carousel.SoldCarousel = async function(){

// Sélection des éléments
const scrollContainer = document.getElementById('iteration6Sold');
const scrollLeftBtn = document.getElementById('scrollLeft-Sold');
const scrollRightBtn = document.getElementById('scrollRight-Sold');

// Quantité de défilement en pixels
const scrollAmount = 408;

// Fonction pour défiler à gauche
scrollLeftBtn.addEventListener('click', () => {
scrollContainer.scrollBy({
top: 0,
left: -scrollAmount,
behavior: 'smooth'
});
});

// Fonction pour défiler à droite
scrollRightBtn.addEventListener('click', () => {
scrollContainer.scrollBy({
top: 0,
left: scrollAmount,
behavior: 'smooth'
});
});

};


export { Carousel };