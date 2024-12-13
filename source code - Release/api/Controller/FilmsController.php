<?php
require_once "Controller.php";
require_once "Repository/FilmsRepository.php";

/**
 * Classe ExempleController
 * Gère les requêtes REST pour les produits.
 */
class FilmsController extends Controller {

    private FilmsRepository $film;

    public function __construct(){
        $this->film = new FilmsRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $param = $request->getParam("param");

        if  ($param == "Consumation"){
            return $this->film->getConsumation();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
    }

    protected function processPutRequest(HttpRequest $request) {
    }
}
?>