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
        //on récupère la somme des Location sur le mois en cours 
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

    public function save($Vente) {
    }

    public function delete($id) {
    }

    public function update($Vente) {
    }
}
?>