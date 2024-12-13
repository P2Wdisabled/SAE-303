<?php
require_once("Repository/EntityRepository.php");
require_once("Class/Film.php");

/**
 * Classe VenteRepository
 * Gère les opérations CRUD pour les ventes.
 */
class FilmsRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function mostUsed() {}

    public function TotalLastmonth() {}

    public function evolution() {}

    
    public function evolutionpergenre() {}

    public function UsesPerCountries() {}

    public function FilmStats($filmid){}
    
    public function AllFilms() {}

    public function getStats($clientid){}

    public function getList(){}

    public function getConsumation() {
        $stmt = $this->cnx->prepare("SELECT
    c.country AS Pays,
    DATE_FORMAT(r.rental_date, '%Y-%m') AS Mois,
    ROUND(SUM(m.duration_minutes / 60 * 2.7), 2) AS Consommation_GB
FROM
    Rentals r
JOIN
    Customers c ON r.customer_id = c.id
JOIN
    Movies m ON r.movie_id = m.id

WHERE
    r.rental_date >= DATE_SUB(CURDATE(), INTERVAL 11 MONTH)
GROUP BY
    c.country,
    DATE_FORMAT(r.rental_date, '%Y-%m')
ORDER BY
    Mois,
    c.country DESC;");
        $stmt->execute();
        $consumation = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $consumation;
    }
}
?>