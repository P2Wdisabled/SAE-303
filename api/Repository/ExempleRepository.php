<?php
require_once("Repository/EntityRepository.php");
require_once("Class/Exemple.php");

/**
 * Classe ExempleRepository
 * Gère les opérations CRUD pour les produits.
 */
class ExempleRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?Exemple{
        $stmt = $this->cnx->prepare("SELECT * FROM exemples WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $prod = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$prod) return null;

        $Exemple = new Exemple($prod['id']);
        $Exemple->setName($prod['name']);

        return $Exemple;
    }

    public function findAll(): array {
        $stmt = $this->cnx->prepare("SELECT * FROM exemples");
        $stmt->execute();
        $exemples = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $res = [];
        foreach ($exemples as $prod) {
            $Exemple = new Exemple($prod['id']);
            $Exemple->setName($prod['name']);
            $res[] = $Exemple;
        }
        return $res;
    }

    public function save($Exemple) {
    }

    public function delete($id) {
    }

    public function update($Exemple) {
    }
}
?>