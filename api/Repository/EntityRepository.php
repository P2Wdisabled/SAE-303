<?php

/**
 *  Classe EntityRespository
 * 
 *  Classe abstraite ! Elle décrit la gestion d'une famille de ressources (produits, commandes, utilisateurs...)
 *  au niveau du système d'information (base de données).
 * 
 *  Quand on a une nouvelle famille de ressource à gérer, on créera une classe fille qui saura : 
 * 
 *  - trouver une ressource dans la base  (voir la méthode find)
 *  - trouver toutes les ressources  dans la base (voir la méthode findAll)
 *  - sauvegarder une ressource dans la base (voir la méthode save)
 *  - supprimer une ressource dans la base (voir la méthode delete)
 *  - mettre à jour une ressource dans la base (voir la méthode update)
 * 
 *  Exemple : voir la classe ProductRepository
 */
abstract class EntityRepository {
    protected $cnx;

    protected function __construct(){
        // Modifiez ici vos informations de BDD et de connexion
        $pswd = "Hhcfiy6A4(jMr3Yx";
        $this->cnx = new PDO("mysql:host=54.37.68.129:3306;dbname=SAE303-VOD", "viewer", $pswd);
    }

    /**
     *  find
     *  Query the data base for the entity with id $id.
     *  Must return an Entity object or false if the query fails
     */
    abstract public function mostUsed();

    /**
     *  findAll
     *  Query the data base for all the entities
     *  Must return an array of Entity objects or false if the query fails
     */
    abstract public function TotalLastmonth();

    /**
     *  save
     *  Save in the data base a new Entity object.
     *  Update the Entity object with its data base id.
     *  Must return true or false if it fails to save the object.
     */
    abstract public function evolution();

    /**
     *  delete
     *  delete in the data base Entity object with id $id
     *  Must return true or false if it fails to delete the object.
     */
    abstract public function evolutionpergenre();

     /**
     *  udpate
     *  update in the data base Entity object $entity
     *  Must return true or false if it fails to delete the object.
     */
    abstract public function UsesPerCountries();

    abstract public function FilmStats($film);

    abstract public function AllFilms();

    abstract public function getStats($clientid);

    abstract public function getList();
}