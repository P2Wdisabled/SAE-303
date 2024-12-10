<?php
require_once("Repository/EntityRepository.php");
require_once("Class/Ventes.php");

/**
 * Classe VenteRepository
 * Gère les opérations CRUD pour les ventes.
 */
class VentesRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function mostUsed() {
        $stmt = $this->cnx->prepare("SELECT movie_id, COUNT(*) as nb FROM Sales WHERE YEAR(purchase_date) = :currentyear AND MONTH(purchase_date) = :currentmonth GROUP BY movie_id ORDER BY nb DESC LIMIT 3");
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
        $stmt = $this->cnx->prepare("SELECT purchase_price FROM Sales WHERE YEAR(purchase_date) = :currentyear AND MONTH(purchase_date) = :currentmonth");
        $currentYear = date('Y');
        $currentMonth = date('m');
        $stmt->bindValue(':currentyear', $currentYear, PDO::PARAM_INT);
        $stmt->bindValue(':currentmonth', $currentMonth, PDO::PARAM_INT);
        $stmt->execute();
        $ventes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $totalVentes = array_sum(array_column($ventes, 'purchase_price'));
        $totalVentes = number_format($totalVentes, 2, '.', '');
        return $totalVentes;
    }

    public function evolution() {
        $stmt = $this->cnx->prepare("SELECT SUM(purchase_price) as vente,  MONTH(purchase_date) as mois FROM Sales GROUP BY MONTH(purchase_date) ORDER BY MONTH(purchase_date) DESC LIMIT 7");
        $stmt->execute();
        $evolution = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $evolution;
    }

    
    public function evolutionpergenre() {
        $stmt = $this->cnx->prepare("
    SELECT 
        Movies.genre, 
        COUNT(Sales.purchase_price) AS location, 
        MONTH(Sales.purchase_date) AS mois 
    FROM 
        Sales 
    JOIN 
        Movies 
        ON Sales.movie_id = Movies.id 
    WHERE 
        Sales.purchase_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
    GROUP BY 
        Movies.genre, 
        MONTH(Sales.purchase_date)
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

    public function update($Vente) {
    }
}
?>