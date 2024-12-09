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

    public function find($id) {
    }

    public function findAll(): float {
        //on récupère la somme des Location sur le mois en cours 
        $stmt = $this->cnx->prepare("SELECT rental_price FROM Rentals WHERE rental_date > :date");
        $currentDate = date('Y-m-01');
        $stmt->bindParam(':date', $currentDate, PDO::PARAM_STR);
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