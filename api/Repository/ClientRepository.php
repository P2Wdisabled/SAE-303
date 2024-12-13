<?php
require_once("Repository/EntityRepository.php");
require_once("Class/Clients.php");

/**
 * Classe VenteRepository
 * Gère les opérations CRUD pour les ventes.
 */
class ClientRepository extends EntityRepository {

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

    public function getStats($clientid){
        $sql = "SELECT 
    'Rental' AS transaction_type,
    c.id AS customer_id,
    c.firs_name,
    c.last_name,
    c.email,
    c.country,
    c.city,
    c.lat,
    c.lng,
    m.id AS movie_id,
    m.movie_title,
    m.genre,
    m.release_date,
    m.duration_minutes,
    m.rating,
    r.rental_date AS date,
    r.rental_price AS price
FROM 
    Customers c
JOIN 
    Rentals r ON c.id = r.customer_id
JOIN 
    Movies m ON m.id = r.movie_id
WHERE 
    c.id = :clientid

UNION ALL

SELECT 
    'Sale' AS transaction_type,
    c.id AS customer_id,
    c.firs_name,
    c.last_name,
    c.email,
    c.country,
    c.city,
    c.lat,
    c.lng,
    m.id AS movie_id,
    m.movie_title,
    m.genre,
    m.release_date,
    m.duration_minutes,
    m.rating,
    s.purchase_date AS date,
    s.purchase_price AS price
FROM 
    Customers c
JOIN 
    Sales s ON c.id = s.customer_id
JOIN 
    Movies m ON m.id = s.movie_id
WHERE 
    c.id = :clientid

ORDER BY 
    genre ASC, 
    date DESC;
";
        $stmt = $this->cnx->prepare($sql);
        $stmt->bindParam(":clientid", $clientid);
        $stmt->execute();
        $client = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $client;
    }

    public function getList(){
        $sql = "SELECT id, firs_name as first_name, last_name FROM Customers";
        $stmt = $this->cnx->prepare($sql);
        $stmt->execute();
        $liste = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return  $liste;
    }
}
?>