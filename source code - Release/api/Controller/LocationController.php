<?php
require_once "Controller.php";
require_once "Repository/LocationRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class LocationController extends Controller {

    private LocationRepository $location;

    public function __construct(){
        $this->location = new LocationRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $param = $request->getParam("param");

        if ($param == "top3") {
            return $this->location->mostUsed();
        }
        else if ($param == "lastmonth") {
            return $this->location->TotalLastmonth();
        }
        else if ($param == "evolution") {
            return $this->location->evolution();
        }
        else if ($param == "evolutionPerGenre") {
            return $this->location->evolutionpergenre();
        }
        else if ($param == "UsesPerCountries") {
            return $this->location->UsesPerCountries();
        }
        else if ($param == "FilmStats") {
            $filmid = (int)$request->getParam("filmid");
            return $this->location->FilmStats($filmid);
        }
        else if ($param == "AllFilms") {
            return $this->location->AllFilms();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>