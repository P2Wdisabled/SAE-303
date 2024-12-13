<?php
require_once "Controller.php";
require_once "Repository/VentesRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class VentesController extends Controller {

    private VentesRepository $ventes;

    public function __construct(){
        $this->ventes = new VentesRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $param = $request->getParam("param");

        if  ($param == "top3"){
            return $this->ventes->mostUsed();
        }
        else if ($param == "lastmonth") {
            return $this->ventes->TotalLastmonth();
        }
        else if ($param == "evolution") {
            return $this->ventes->evolution();
        }
        else if ($param == "evolutionPerGenre") {
            return $this->ventes->evolutionpergenre();
        }
        else if ($param == "UsesPerCountries") {
            return $this->ventes->UsesPerCountries();
        }
        else if ($param == "FilmStats") {
            $film = (int)$request->getParam("filmid");
            return $this->ventes->FilmStats($film);
        }
        else if ($param == "AllFilms") {
            return $this->ventes->AllFilms();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>