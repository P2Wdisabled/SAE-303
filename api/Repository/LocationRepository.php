<?php
require_once("Repository/EntityRepository.php");
require_once("Class/Location.php");

/**
 * Classe VenteRepository
 * Gère les opérations CRUD pour les Location.
 */
class LocationRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function mostUsed() {
        $stmt = $this->cnx->prepare("SELECT COUNT(*) as nb, movie_id FROM Rentals WHERE YEAR(rental_date) = :currentyear AND MONTH(rental_date) = :currentmonth GROUP BY movie_id ORDER BY nb DESC LIMIT 3");
        $currentYear = date('Y');
        $currentMonth = date('m');
        $stmt->bindValue(':currentyear', $currentYear, PDO::PARAM_INT);
        $stmt->bindValue(':currentmonth', $currentMonth, PDO::PARAM_INT);
        $stmt->execute();
        $films = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($films as $key => $film) {
            $stmt = $this->cnx->prepare("SELECT movie_title FROM Movies WHERE id = :id");
            $stmt->bindValue(':id', $film['movie_id'], PDO::PARAM_INT);
            $stmt->execute();
            $movie = $stmt->fetch(PDO::FETCH_ASSOC);
            $films[$key]['movie_title'] = $movie['movie_title'];
        }
        return $films;
    }

    public function TotalLastmonth(): float {
        $stmt = $this->cnx->prepare("SELECT rental_price FROM Rentals WHERE YEAR(rental_date) = :currentyear AND MONTH(rental_date) = :currentmonth");
        $currentYear = date('Y');
        $currentMonth = date('m');
        $stmt->bindValue(':currentyear', $currentYear, PDO::PARAM_INT);
        $stmt->bindValue(':currentmonth', $currentMonth, PDO::PARAM_INT);
        $stmt->execute();
        $location = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $totalLocation = array_sum(array_column($location, 'rental_price'));
        $totalLocation = number_format($totalLocation, 2, '.', '');
        return $totalLocation;
    }

    public function evolution() {
        $stmt = $this->cnx->prepare("SELECT SUM(rental_price) as location, MONTH(rental_date) as mois FROM Rentals GROUP BY MONTH(rental_date) ORDER BY MONTH(rental_date) DESC LIMIT 7");
        $stmt->execute();
        $evolution = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $evolution;
    }

    public function evolutionpergenre() {
        $stmt = $this->cnx->prepare("
    SELECT 
        Movies.genre, 
        COUNT(Rentals.rental_price) AS location, 
        MONTH(Rentals.rental_date) AS mois 
    FROM 
        Rentals 
    JOIN 
        Movies 
        ON Rentals.movie_id = Movies.id 
    WHERE 
        Rentals.rental_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY 
        Movies.genre, 
        MONTH(Rentals.rental_date)
    ORDER BY 
        Movies.genre ASC, 
        mois ASC
");
$stmt->execute();
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Transformation des résultats pour correspondre à la structure souhaitée
$evolution = [];
foreach ($results as $row) {
    $genre = $row['genre'];
    if (!isset($evolution[$genre])) {
        $evolution[$genre] = [
            'genre' => $genre,
            'evolution' => []
        ];
    }
    $evolution[$genre]['evolution'][] = [
        'mois' => (int)$row['mois'],
        'location' => (float)$row['location']
    ];
}

// Réindexer le tableau pour obtenir un array indexé numériquement
$evolution = array_values($evolution);

return $evolution;

    }

    public function UsesPerCountries() {
    $stmt = $this->cnx->prepare("SELECT Customers.country, COUNT(Rentals.rental_price) as value FROM Rentals JOIN Customers ON Rentals.customer_id = Customers.id GROUP BY Customers.country ORDER BY value Desc");
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return $results;
    }


    public function FilmStats($filmid){
  
    
    $stmt = $this->cnx->prepare("SELECT movie_title FROM Movies WHERE id = :movie_id");
    $stmt->bindParam(':movie_id', $filmid, PDO::PARAM_INT);
    $stmt->execute();
    $movie = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$movie) {
        // Si le film n'existe pas
        return [
            "film" => "Inconnu",
            "evolution" => []
        ];
    }
    
    $filmTitle = $movie['movie_title'];
    
    // Étape 2 : Récupérer les locations des 6 derniers mois
    $stmt = $this->cnx->prepare("
        SELECT 
            COUNT(Rentals.rental_price) AS value,
            MONTH(Rentals.rental_date) AS mois
        FROM 
            Rentals
        WHERE 
            Rentals.rental_date >= DATE_SUB(CURDATE(), INTERVAL 7 MONTH)
            AND Rentals.movie_id = :movie_id
        GROUP BY 
            MONTH(Rentals.rental_date)
        ORDER BY 
            mois ASC
    ");
    $stmt->bindParam(':movie_id', $filmid, PDO::PARAM_INT);
    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Créer un tableau associatif pour les mois et les locations
    $monthLocations = [];
    foreach ($results as $row) {
        $monthLocations[(int)$row['mois']] = (float)$row['value'];
    }
    
    // Étape 3 : Déterminer les 6 derniers mois
    $currentMonth = (int)date('n');
    $lastSixMonths = [];
    for ($i = 6; $i >= 0; $i--) {
        $month = $currentMonth - $i;
        if ($month <= 0) {
            $month += 12;
        }
        $lastSixMonths[] = $month;
    }
    
    // Construire l'évolution avec des valeurs par défaut
    $evolution = [];
    foreach ($lastSixMonths as $month) {
        $evolution[] = [
            'mois' => $month,
            'value' => isset($monthLocations[$month]) ? $monthLocations[$month] : 0
        ];
    }
    
    return [
        "film" => $filmTitle,
        "evolution" => $evolution
    ];
}

    public function AllFilms() {
        $stmt = $this->cnx->prepare("SELECT DISTINCT movie_title as title, id FROM Movies");
        $stmt->execute();
        $films = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $films;
    }
}   
?>