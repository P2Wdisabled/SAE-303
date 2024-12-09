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

    public function find($id) {
    }

    public function findAll(): float {
        //on récupère la somme des ventes sur le mois en cours 
        $stmt = $this->cnx->prepare("SELECT purchase_price FROM Sales WHERE purchase_date > :date");
        $currentDate = date('Y-m-01');
        $stmt->bindParam(':date', $currentDate, PDO::PARAM_STR);
        $stmt->execute();
        $ventes = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $totalVentes = array_sum(array_column($ventes, 'purchase_price'));
        $totalVentes = number_format($totalVentes, 2, '.', '');
        return $totalVentes;
    }

    public function save($Vente) {
    }

    public function delete($id) {
    }

    public function update($Vente) {
    }
}
?>